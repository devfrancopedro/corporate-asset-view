
-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'technician')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Criar tabela de equipamentos
CREATE TABLE public.equipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  serial_number TEXT UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('desktop', 'notebook', 'servidor', 'impressora', 'monitor', 'outro')),
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'manutencao', 'descartado')),
  location TEXT,
  user_id UUID REFERENCES public.profiles(id),
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela de movimentações
CREATE TABLE public.movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID REFERENCES public.equipments(id) ON DELETE CASCADE NOT NULL,
  from_user_id UUID REFERENCES public.profiles(id),
  to_user_id UUID REFERENCES public.profiles(id),
  from_location TEXT,
  to_location TEXT,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('transferencia', 'alocacao', 'devolucao', 'manutencao')),
  reason TEXT,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela de manutenções
CREATE TABLE public.maintenances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID REFERENCES public.equipments(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('preventiva', 'corretiva', 'upgrade')),
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')),
  priority TEXT DEFAULT 'media' CHECK (priority IN ('baixa', 'media', 'alta', 'critica')),
  technician_id UUID REFERENCES public.profiles(id),
  requested_by UUID REFERENCES public.profiles(id) NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela de chamados de suporte
CREATE TABLE public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'finalizado', 'cancelado')),
  priority TEXT DEFAULT 'media' CHECK (priority IN ('baixa', 'media', 'alta', 'critica')),
  category TEXT NOT NULL,
  equipment_id UUID REFERENCES public.equipments(id),
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Criar tabela de logs de chamados
CREATE TABLE public.ticket_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Políticas RLS para equipments
CREATE POLICY "Users can view all equipments" ON public.equipments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create equipments" ON public.equipments FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update equipments" ON public.equipments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete equipments" ON public.equipments FOR DELETE TO authenticated USING (true);

-- Políticas RLS para movements
CREATE POLICY "Users can view all movements" ON public.movements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create movements" ON public.movements FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- Políticas RLS para maintenances
CREATE POLICY "Users can view all maintenances" ON public.maintenances FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create maintenances" ON public.maintenances FOR INSERT TO authenticated WITH CHECK (auth.uid() = requested_by);
CREATE POLICY "Users can update maintenances" ON public.maintenances FOR UPDATE TO authenticated USING (true);

-- Políticas RLS para support_tickets (cada usuário vê apenas seus próprios chamados)
CREATE POLICY "Users can view own tickets" ON public.support_tickets FOR SELECT TO authenticated USING (auth.uid() = created_by OR auth.uid() = assigned_to);
CREATE POLICY "Users can create own tickets" ON public.support_tickets FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own tickets" ON public.support_tickets FOR UPDATE TO authenticated USING (auth.uid() = created_by OR auth.uid() = assigned_to);

-- Políticas RLS para ticket_logs
CREATE POLICY "Users can view logs of their tickets" ON public.ticket_logs FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.support_tickets 
    WHERE id = ticket_id AND (created_by = auth.uid() OR assigned_to = auth.uid())
  )
);
CREATE POLICY "Users can create logs for their tickets" ON public.ticket_logs FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM public.support_tickets 
    WHERE id = ticket_id AND (created_by = auth.uid() OR assigned_to = auth.uid())
  )
);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_equipments_updated_at BEFORE UPDATE ON public.equipments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_maintenances_updated_at BEFORE UPDATE ON public.maintenances FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
