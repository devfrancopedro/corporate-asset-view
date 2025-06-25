
import React, { useState } from 'react';
import { Ticket, Plus, Clock, CheckCircle, Camera, BarChart3, Calendar } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { NewTicketForm } from './NewTicketForm';
import { useToast } from '@/hooks/use-toast';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'pendente' | 'finalizado';
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  createdDate: string;
  completedDate?: string;
  technician: string;
  category: string;
  logs: string[];
  photos: string[];
  timeToCompletion?: number; // em horas
}

const mockTickets: SupportTicket[] = [
  {
    id: '1',
    title: 'Problema na impressora do RH',
    description: 'Impressora não está conectando à rede',
    status: 'finalizado',
    priority: 'media',
    createdDate: '2024-01-15T09:00:00Z',
    completedDate: '2024-01-15T14:30:00Z',
    technician: 'João Silva',
    category: 'Hardware',
    logs: ['Verificado cabo de rede', 'Reinstalado drivers', 'Problema resolvido'],
    photos: [],
    timeToCompletion: 5.5
  },
  {
    id: '2',
    title: 'Sistema lento no computador da contabilidade',
    description: 'Performance muito baixa, travamentos frequentes',
    status: 'pendente',
    priority: 'alta',
    createdDate: '2024-01-20T11:15:00Z',
    technician: 'João Silva',
    category: 'Software',
    logs: ['Verificado uso de CPU - 98%', 'Identificado malware', 'Iniciando limpeza'],
    photos: []
  },
  {
    id: '3',
    title: 'Email não funciona',
    description: 'Usuário não consegue enviar emails',
    status: 'finalizado',
    priority: 'baixa',
    createdDate: '2024-01-18T16:20:00Z',
    completedDate: '2024-01-19T10:00:00Z',
    technician: 'João Silva',
    category: 'Email',
    logs: ['Verificado configurações SMTP', 'Atualizadas configurações', 'Testado envio'],
    photos: [],
    timeToCompletion: 17.5
  }
];

const chartConfig = {
  tickets: {
    label: "Chamados",
  },
  timeToCompletion: {
    label: "Tempo (horas)",
  },
};

export const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const { toast } = useToast();

  const handleNewTicket = (newTicket: SupportTicket) => {
    setTickets(prev => [newTicket, ...prev]);
    setShowForm(false);
    toast({
      title: "Chamado criado",
      description: "Novo chamado foi registrado com sucesso",
    });
  };

  const handleUpdateTicket = (ticketId: string, updates: Partial<SupportTicket>) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, ...updates } : ticket
    ));
  };

  const completedTickets = tickets.filter(t => t.status === 'finalizado');
  const pendingTickets = tickets.filter(t => t.status === 'pendente');

  // Dados para gráfico de tempo de resolução
  const timeData = completedTickets
    .filter(t => t.timeToCompletion)
    .map(t => ({
      name: t.title.substring(0, 20) + '...',
      time: t.timeToCompletion
    }));

  // Dados para gráfico mensal
  const monthlyData = [
    { month: 'Jan', total: 15, completed: 12 },
    { month: 'Fev', total: 20, completed: 18 },
    { month: 'Mar', total: 25, completed: 23 },
    { month: 'Abr', total: 18, completed: 16 },
    { month: 'Mai', total: 22, completed: 20 },
    { month: 'Jun', total: 28, completed: 25 }
  ];

  const getStatusColor = (status: string) => {
    return status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suporte de TI</h1>
          <p className="text-gray-600 mt-2">Gerencie chamados e acompanhe métricas de atendimento</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-minimal bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus size={16} />
          {showForm ? 'Cancelar' : 'Novo Chamado'}
        </button>
      </div>

      {/* Novo formulário de chamado */}
      {showForm && (
        <NewTicketForm onSubmit={handleNewTicket} />
      )}

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-minimal p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Chamados</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{tickets.length}</p>
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
              <p className="text-sm font-medium text-gray-600">Finalizados</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{completedTickets.length}</p>
            </div>
            <div className="p-3 rounded-minimal bg-green-100">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card-minimal p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {completedTickets.length > 0 
                  ? `${(completedTickets.reduce((acc, t) => acc + (t.timeToCompletion || 0), 0) / completedTickets.length).toFixed(1)}h`
                  : '0h'
                }
              </p>
            </div>
            <div className="p-3 rounded-minimal bg-blue-100">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-minimal p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tempo de Resolução</h3>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="time" fill="#808080" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="card-minimal p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chamados por Mês</h3>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="total" stroke="#808080" strokeWidth={3} />
                <Line type="monotone" dataKey="completed" stroke="#a0a0a0" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* Lista de chamados */}
      <div className="card-minimal p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Chamados Recentes</h2>
        
        <div className="space-y-4">
          {tickets.map((ticket) => (
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                    {ticket.status === 'pendente' ? <Clock size={12} /> : <CheckCircle size={12} />}
                    {ticket.status === 'pendente' ? 'Pendente' : 'Finalizado'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <span className="text-sm text-gray-600">Técnico:</span>
                  <p className="text-sm font-medium text-gray-900">{ticket.technician}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Criado em:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(ticket.createdDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {ticket.completedDate && (
                  <div>
                    <span className="text-sm text-gray-600">Finalizado em:</span>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(ticket.completedDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <span className="text-sm text-gray-600">Descrição:</span>
                <p className="text-sm text-gray-900 mt-1">{ticket.description}</p>
              </div>

              {ticket.logs.length > 0 && (
                <div className="mb-3">
                  <span className="text-sm text-gray-600">Logs:</span>
                  <ul className="text-sm text-gray-900 mt-1 space-y-1">
                    {ticket.logs.map((log, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>{log}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {ticket.photos.length > 0 && (
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Camera size={14} />
                      {ticket.photos.length} foto(s)
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedTicket(ticket)}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Ticket className="mx-auto mb-4 text-gray-400" size={48} />
            <p>Nenhum chamado registrado</p>
          </div>
        )}
      </div>
    </div>
  );
};
