
import React, { useState } from 'react';
import { Ticket, Plus, Clock, CheckCircle, Camera, BarChart3 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';

const chartConfig = {
  tickets: {
    label: "Chamados",
  },
  timeToCompletion: {
    label: "Tempo (horas)",
  },
};

export const SupportTickets: React.FC = () => {
  const { supportTickets, createSupportTicket, updateSupportTicket, loading } = useSupabaseData();
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'media' as const,
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      await createSupportTicket({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
        status: 'pendente',
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'media',
        category: '',
      });
      setShowForm(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const completedTickets = supportTickets.filter(t => t.status === 'finalizado');
  const pendingTickets = supportTickets.filter(t => t.status === 'pendente');
  const inProgressTickets = supportTickets.filter(t => t.status === 'em_andamento');

  // Dados para gráfico mensal (simulado - baseado nos chamados existentes)
  const monthlyData = [
    { month: 'Jan', total: supportTickets.length, completed: completedTickets.length },
  ];

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Chamados de Suporte</h1>
          <p className="text-gray-600 mt-2">Gerencie seus chamados e acompanhe o progresso</p>
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
        <div className="card-minimal p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Chamado de Suporte</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Chamado *
                </label>
                <input
                  type="text"
                  className="w-full input-minimal p-3 border border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Descreva brevemente o problema"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  className="w-full input-minimal p-3 border border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Rede">Rede</option>
                  <option value="Email">Email</option>
                  <option value="Impressora">Impressora</option>
                  <option value="Sistema Operacional">Sistema Operacional</option>
                  <option value="Segurança">Segurança</option>
                  <option value="Backup">Backup</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade
                </label>
                <select
                  className="w-full input-minimal p-3 border border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição Detalhada *
              </label>
              <textarea
                className="w-full input-minimal p-3 border border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o problema em detalhes, incluindo quando ocorreu, frequência, mensagens de erro, etc."
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="btn-minimal bg-primary text-white hover:bg-primary/90"
              >
                Criar Chamado
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cards de estatísticas */}
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

      {/* Gráfico */}
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

      {/* Lista de chamados */}
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                    {ticket.status === 'pendente' ? <Clock size={12} /> : <CheckCircle size={12} />}
                    {getStatusLabel(ticket.status)}
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
    </div>
  );
};
