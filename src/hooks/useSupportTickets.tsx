
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import type { SupportTicket, SupportTicketInsert } from '@/types/database';
import type { Database } from '@/integrations/supabase/types';

export const useSupportTickets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (user) {
      fetchSupportTickets();
    }
  }, [user]);

  return {
    loading,
    supportTickets,
    fetchSupportTickets,
    createSupportTicket,
    updateSupportTicket,
  };
};
