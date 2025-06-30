
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
      console.log('Fetching equipments...');
      const { data, error } = await supabase
        .from('equipments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching equipments:', error);
        throw error;
      }
      console.log('Equipments fetched:', data);
      setEquipments(data || []);
    } catch (error: any) {
      console.error('Equipment fetch error:', error);
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
      console.log('Creating equipment:', equipment);
      const { data, error } = await supabase
        .from('equipments')
        .insert([{ ...equipment, created_by: user.id }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating equipment:', error);
        throw error;
      }
      console.log('Equipment created:', data);
      setEquipments(prev => [data, ...prev]);
      toast({
        title: "Equipamento criado",
        description: "Equipamento adicionado com sucesso",
      });
      return data;
    } catch (error: any) {
      console.error('Equipment creation error:', error);
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
      console.log('Updating equipment:', id, updates);
      const { data, error } = await supabase
        .from('equipments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating equipment:', error);
        throw error;
      }
      console.log('Equipment updated:', data);
      setEquipments(prev => prev.map(eq => eq.id === id ? data : eq));
      toast({
        title: "Equipamento atualizado",
        description: "Equipamento modificado com sucesso",
      });
      return data;
    } catch (error: any) {
      console.error('Equipment update error:', error);
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
      console.log('Deleting equipment:', id);
      const { error } = await supabase
        .from('equipments')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting equipment:', error);
        throw error;
      }
      console.log('Equipment deleted');
      setEquipments(prev => prev.filter(eq => eq.id !== id));
      toast({
        title: "Equipamento excluído",
        description: "Equipamento removido com sucesso",
      });
    } catch (error: any) {
      console.error('Equipment deletion error:', error);
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
      console.log('Fetching support tickets...');
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching support tickets:', error);
        throw error;
      }
      console.log('Support tickets fetched:', data);
      setSupportTickets(data || []);
    } catch (error: any) {
      console.error('Support tickets fetch error:', error);
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
      console.log('Creating support ticket:', ticket);
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([{ ...ticket, created_by: user.id }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating support ticket:', error);
        throw error;
      }
      console.log('Support ticket created:', data);
      setSupportTickets(prev => [data, ...prev]);
      toast({
        title: "Chamado criado",
        description: "Chamado de suporte criado com sucesso",
      });
      return data;
    } catch (error: any) {
      console.error('Support ticket creation error:', error);
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
      console.log('Updating support ticket:', id, updates);
      const { data, error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating support ticket:', error);
        throw error;
      }
      console.log('Support ticket updated:', data);
      setSupportTickets(prev => prev.map(ticket => ticket.id === id ? data : ticket));
      toast({
        title: "Chamado atualizado",
        description: "Chamado modificado com sucesso",
      });
      return data;
    } catch (error: any) {
      console.error('Support ticket update error:', error);
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
      console.log('Fetching maintenances...');
      const { data, error } = await supabase
        .from('maintenances')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching maintenances:', error);
        throw error;
      }
      console.log('Maintenances fetched:', data);
      setMaintenances(data || []);
    } catch (error: any) {
      console.error('Maintenances fetch error:', error);
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
      console.log('Creating maintenance:', maintenance);
      const { data, error } = await supabase
        .from('maintenances')
        .insert([{ ...maintenance, requested_by: user.id }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating maintenance:', error);
        throw error;
      }
      console.log('Maintenance created:', data);
      setMaintenances(prev => [data, ...prev]);
      toast({
        title: "Manutenção agendada",
        description: "Manutenção criada com sucesso",
      });
      return data;
    } catch (error: any) {
      console.error('Maintenance creation error:', error);
      toast({
        title: "Erro ao criar manutenção",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateMaintenance = async (id: string, updates: Database['public']['Tables']['maintenances']['Update']) => {
    try {
      console.log('Updating maintenance:', id, updates);
      const { data, error } = await supabase
        .from('maintenances')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating maintenance:', error);
        throw error;
      }
      console.log('Maintenance updated:', data);
      setMaintenances(prev => prev.map(maintenance => maintenance.id === id ? data : maintenance));
      toast({
        title: "Manutenção atualizada",
        description: "Manutenção modificada com sucesso",
      });
      return data;
    } catch (error: any) {
      console.error('Maintenance update error:', error);
      toast({
        title: "Erro ao atualizar manutenção",
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
    updateMaintenance,
  };
};
