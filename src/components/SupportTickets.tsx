import React from 'react';
import { useSupportTickets } from '@/hooks/useSupportTickets';
import { SupportTicketForm } from './SupportTicketForm';
import { SupportTicketStats } from './SupportTicketStats';
import { SupportTicketChart } from './SupportTicketChart';
import { SupportTicketList } from './SupportTicketList';

export const SupportTickets: React.FC = () => {
  const { supportTickets, loading, fetchSupportTickets } = useSupportTickets();

  const handleUpdate = () => {
    fetchSupportTickets();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Meus Chamados de Suporte</h1>
          <p className="text-gray-600 mt-2">Gerencie seus chamados e acompanhe o progresso</p>
        </div>
        <SupportTicketForm onTicketCreated={handleUpdate} />
      </div>

      <SupportTicketStats supportTickets={supportTickets} />

      <SupportTicketChart supportTickets={supportTickets} />

      <SupportTicketList supportTickets={supportTickets} onUpdate={handleUpdate} />
    </div>
  );
};
