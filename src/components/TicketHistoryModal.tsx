
import React, { useEffect, useState } from 'react';
import { X, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HistoryLog {
  id: string;
  field_changed: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
  changed_by: string;
  user_name?: string;
}

interface TicketHistoryModalProps {
  ticketId: string;
  ticketTitle: string;
  onClose: () => void;
  type: 'support' | 'maintenance';
}

export const TicketHistoryModal: React.FC<TicketHistoryModalProps> = ({
  ticketId,
  ticketTitle,
  onClose,
  type
}) => {
  const [history, setHistory] = useState<HistoryLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [ticketId, type]);

  const fetchHistory = async () => {
    try {
      const tableName = type === 'support' ? 'support_ticket_logs' : 'maintenance_logs';
      const idField = type === 'support' ? 'ticket_id' : 'maintenance_id';
      
      const { data, error } = await supabase
        .from(tableName)
        .select(`
          *,
          profiles!${tableName}_changed_by_fkey(full_name)
        `)
        .eq(idField, ticketId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHistory = data?.map(log => ({
        ...log,
        user_name: log.profiles?.full_name || 'Usuário desconhecido'
      })) || [];

      setHistory(formattedHistory);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'status': return 'Status';
      case 'priority': return 'Prioridade';
      case 'assigned_to': return 'Atribuído para';
      default: return field;
    }
  };

  const getValueLabel = (field: string, value: string | null) => {
    if (!value) return 'Não definido';
    
    switch (field) {
      case 'status':
        switch (value) {
          case 'pendente': return 'Pendente';
          case 'em_andamento': return 'Em Andamento';
          case 'finalizado': return 'Finalizado';
          case 'concluida': return 'Concluída';
          case 'cancelado': return 'Cancelado';
          case 'cancelada': return 'Cancelada';
          default: return value;
        }
      case 'priority':
        switch (value) {
          case 'baixa': return 'Baixa';
          case 'media': return 'Média';
          case 'alta': return 'Alta';
          case 'critica': return 'Crítica';
          default: return value;
        }
      default:
        return value;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Histórico de Alterações
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800">{ticketTitle}</h3>
            <div className="h-px bg-gray-200 mt-2"></div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-4">
                {history.map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {log.user_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        {new Date(log.created_at).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">{getFieldLabel(log.field_changed)}</span>
                      {' alterado de '}
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        {getValueLabel(log.field_changed, log.old_value)}
                      </span>
                      {' para '}
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {getValueLabel(log.field_changed, log.new_value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="mx-auto mb-4 text-gray-400" size={48} />
                <p>Nenhuma alteração registrada ainda.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
