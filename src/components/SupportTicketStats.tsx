
import React from 'react';
import { Ticket, Clock, CheckCircle, BarChart3 } from 'lucide-react';
import type { SupportTicket } from '@/hooks/useSupabaseData';

interface SupportTicketStatsProps {
  supportTickets: SupportTicket[];
}

export const SupportTicketStats: React.FC<SupportTicketStatsProps> = ({ supportTickets }) => {
  const completedTickets = supportTickets.filter(t => t.status === 'finalizado');
  const pendingTickets = supportTickets.filter(t => t.status === 'pendente');
  const inProgressTickets = supportTickets.filter(t => t.status === 'em_andamento');

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="card-minimal p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total de Chamados</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{supportTickets.length}</p>
          </div>
          <div className="p-3 rounded-minimal bg-gray-100">
            <Ticket className="text-gray-600" size={24} />
          </div>
        </div>
      </div>

      <div className="card-minimal p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{pendingTickets.length}</p>
          </div>
          <div className="p-3 rounded-minimal bg-yellow-100">
            <Clock className="text-yellow-600" size={24} />
          </div>
        </div>
      </div>

      <div className="card-minimal p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Em Andamento</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{inProgressTickets.length}</p>
          </div>
          <div className="p-3 rounded-minimal bg-blue-100">
            <BarChart3 className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      <div className="card-minimal p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Finalizados</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{completedTickets.length}</p>
          </div>
          <div className="p-3 rounded-minimal bg-green-100">
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};
