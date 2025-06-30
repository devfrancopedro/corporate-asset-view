
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Equipment, EquipmentInsert } from '@/types/database';
import type { Database } from '@/integrations/supabase/types';

export const useEquipments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (user) {
      fetchEquipments();
    }
  }, [user]);

  return {
    loading,
    equipments,
    fetchEquipments,
    createEquipment,
    updateEquipment,
    deleteEquipment,
  };
};
