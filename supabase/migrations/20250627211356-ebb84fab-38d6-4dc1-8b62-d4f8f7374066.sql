
-- Criar tabela para histórico de mudanças nos support_tickets
CREATE TABLE public.support_ticket_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  field_changed TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para histórico de mudanças nas maintenances
CREATE TABLE public.maintenance_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  maintenance_id UUID REFERENCES public.maintenances(id) ON DELETE CASCADE NOT NULL,
  field_changed TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.support_ticket_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para support_ticket_logs
CREATE POLICY "Users can view support ticket logs" 
  ON public.support_ticket_logs 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create support ticket logs" 
  ON public.support_ticket_logs 
  FOR INSERT 
  WITH CHECK (true);

-- Políticas RLS para maintenance_logs
CREATE POLICY "Users can view maintenance logs" 
  ON public.maintenance_logs 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create maintenance logs" 
  ON public.maintenance_logs 
  FOR INSERT 
  WITH CHECK (true);

-- Função para criar log automaticamente quando support_tickets são atualizados
CREATE OR REPLACE FUNCTION log_support_ticket_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.support_ticket_logs (ticket_id, field_changed, old_value, new_value, changed_by)
    VALUES (NEW.id, 'status', OLD.status, NEW.status, auth.uid());
  END IF;
  
  -- Log priority changes
  IF OLD.priority IS DISTINCT FROM NEW.priority THEN
    INSERT INTO public.support_ticket_logs (ticket_id, field_changed, old_value, new_value, changed_by)
    VALUES (NEW.id, 'priority', OLD.priority, NEW.priority, auth.uid());
  END IF;
  
  -- Log assigned_to changes
  IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
    INSERT INTO public.support_ticket_logs (ticket_id, field_changed, old_value, new_value, changed_by)
    VALUES (NEW.id, 'assigned_to', OLD.assigned_to::text, NEW.assigned_to::text, auth.uid());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para criar log automaticamente quando maintenances são atualizadas
CREATE OR REPLACE FUNCTION log_maintenance_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.maintenance_logs (maintenance_id, field_changed, old_value, new_value, changed_by)
    VALUES (NEW.id, 'status', OLD.status, NEW.status, auth.uid());
  END IF;
  
  -- Log priority changes
  IF OLD.priority IS DISTINCT FROM NEW.priority THEN
    INSERT INTO public.maintenance_logs (maintenance_id, field_changed, old_value, new_value, changed_by)
    VALUES (NEW.id, 'priority', OLD.priority, NEW.priority, auth.uid());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers
CREATE TRIGGER support_ticket_changes_trigger
  AFTER UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION log_support_ticket_changes();

CREATE TRIGGER maintenance_changes_trigger
  AFTER UPDATE ON public.maintenances
  FOR EACH ROW
  EXECUTE FUNCTION log_maintenance_changes();
