
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

// Use the database types from Supabase
type Equipment = Database['public']['Tables']['equipments']['Row'];
type SupportTicket = Database['public']['Tables']['support_tickets']['Row'];
type Maintenance = Database['public']['Tables']['maintenances']['Row'];

// Create insert types that omit the auto-handled fields
type EquipmentInsert = Omit<Database['public']['Tables']['equipments']['Insert'], 'created_by'>;
type SupportTicketInsert = Omit<Database['public']['Tables']['support_tickets']['Insert'], 'created_by'>;
type MaintenanceInsert = Omit<Database['public']['Tables']['maintenances']['Insert'], 'requested_by'>;

// Export the types for use in other components
export type { Equipment, SupportTicket, Maintenance };

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

  const createEquipment = async (equipment: EquipmentInsert) => {
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

  const updateEquipment = async (id: string, updates: Database['public']['Tables']['equipments']['Update']) => {
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

  const createSupportTicket = async (ticket: SupportTicketInsert) => {
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

  const updateSupportTicket = async (id: string, updates: Database['public']['Tables']['support_tickets']['Update']) => {
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

  const createMaintenance = async (maintenance: MaintenanceInsert) => {
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
