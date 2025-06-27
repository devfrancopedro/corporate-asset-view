
import React from 'react';
import { Ticket, Clock, CheckCircle } from 'lucide-react';
import type { SupportTicket } from '@/hooks/useSupabaseData';

interface SupportTicketListProps {
  supportTickets: SupportTicket[];
}

export const SupportTicketList: React.FC<SupportTicketListProps> = ({ supportTickets }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'finalizado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critica': return 'bg-red-500 text-white';
      case 'alta': return 'bg-orange-500 text-white';
      case 'media': return 'bg-blue-500 text-white';
      case 'baixa': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_andamento': return 'Em Andamento';
      case 'finalizado': return 'Finalizado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="card-minimal p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Meus Chamados</h2>
      
      <div className="space-y-4">
        {supportTickets.map((ticket) => (
          <div key={ticket.id} className="border border-gray-200 rounded-minimal p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-minimal">
                  <Ticket className="text-gray-600" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{ticket.title}</h4>
                  <p className="text-sm text-gray-600">Categoria: {ticket.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority || 'media')}`}>
                  {(ticket.priority || 'media').toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(ticket.status || 'pendente')}`}>
                  {(ticket.status || 'pendente') === 'pendente' ? <Clock size={12} /> : <CheckCircle size={12} />}
                  {getStatusLabel(ticket.status || 'pendente')}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <span className="text-sm text-gray-600">Descrição:</span>
              <p className="text-sm text-gray-900 mt-1">{ticket.description}</p>
            </div>

            <div className="text-sm text-gray-600">
              Criado em: {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
            </div>
          </div>
        ))}
      </div>

      {supportTickets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Ticket className="mx-auto mb-4 text-gray-400" size={48} />
          <p>Nenhum chamado registrado</p>
          <p className="text-sm mt-1">Clique em "Novo Chamado" para criar seu primeiro chamado</p>
        </div>
      )}
    </div>
  );
};
