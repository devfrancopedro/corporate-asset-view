
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Equipment {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  type: 'desktop' | 'notebook' | 'servidor' | 'impressora' | 'monitor' | 'outro';
  status: 'ativo' | 'inativo' | 'manutencao' | 'descartado';
  location?: string;
  user_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  description?: string;
  status: 'pendente' | 'em_andamento' | 'finalizado' | 'cancelado';
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  category: string;
  equipment_id?: string;
  created_by: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Maintenance {
  id: string;
  equipment_id: string;
  title: string;
  description?: string;
  type: 'preventiva' | 'corretiva' | 'upgrade';
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  technician_id?: string;
  requested_by: string;
  scheduled_date?: string;
  started_at?: string;
  completed_at?: string;
  cost?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Equipments
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  
  const fetchEquipments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('equipments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setEquipments(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar equipamentos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEquipment = async (equipment: Omit<Equipment, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('equipments')
        .insert([{ ...equipment, created_by: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      setEquipments(prev => [data, ...prev]);
      toast({
        title: "Equipamento criado",
        description: "Equipamento adicionado com sucesso",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao criar equipamento",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
    try {
      const { data, error } = await supabase
        .from('equipments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setEquipments(prev => prev.map(eq => eq.id === id ? data : eq));
      toast({
        title: "Equipamento atualizado",
        description: "Equipamento modificado com sucesso",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar equipamento",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('equipments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setEquipments(prev => prev.filter(eq => eq.id !== id));
      toast({
        title: "Equipamento excluído",
        description: "Equipamento removido com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir equipamento",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Support Tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);

  const fetchSupportTickets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSupportTickets(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar chamados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSupportTicket = async (ticket: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([{ ...ticket, created_by: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      setSupportTickets(prev => [data, ...prev]);
      toast({
        title: "Chamado criado",
        description: "Chamado de suporte criado com sucesso",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao criar chamado",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSupportTicket = async (id: string, updates: Partial<SupportTicket>) => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setSupportTickets(prev => prev.map(ticket => ticket.id === id ? data : ticket));
      toast({
        title: "Chamado atualizado",
        description: "Chamado modificado com sucesso",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar chamado",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Maintenances
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  const fetchMaintenances = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('maintenances')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMaintenances(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar manutenções",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMaintenance = async (maintenance: Omit<Maintenance, 'id' | 'created_at' | 'updated_at' | 'requested_by'>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('maintenances')
        .insert([{ ...maintenance, requested_by: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      setMaintenances(prev => [data, ...prev]);
      toast({
        title: "Manutenção agendada",
        description: "Manutenção criada com sucesso",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao criar manutenção",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchEquipments();
      fetchSupportTickets();
      fetchMaintenances();
    }
  }, [user]);

  return {
    loading,
    // Equipments
    equipments,
    fetchEquipments,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    // Support Tickets
    supportTickets,
    fetchSupportTickets,
    createSupportTicket,
    updateSupportTicket,
    // Maintenances
    maintenances,
    fetchMaintenances,
    createMaintenance,
  };
};
