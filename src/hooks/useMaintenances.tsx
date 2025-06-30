
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Maintenance, MaintenanceInsert } from '@/types/database';
import type { Database } from '@/integrations/supabase/types';

export const useMaintenances = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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
      fetchMaintenances();
    }
  }, [user]);

  return {
    loading,
    maintenances,
    fetchMaintenances,
    createMaintenance,
    updateMaintenance,
  };
};
