
import React from 'react';
import { Wrench, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'technician';
}

interface MaintenanceRecord {
  id: string;
  equipmentName: string;
  type: 'preventiva' | 'corretiva' | 'upgrade';
  status: 'pendente' | 'em_andamento' | 'concluida';
  startDate: string;
  endDate?: string;
  description: string;
  technician: string;
}

interface UserDashboardProps {
  user: User;
}

const mockMaintenances: MaintenanceRecord[] = [
  {
    id: '1',
    equipmentName: 'Desktop-001',
    type: 'corretiva',
    status: 'em_andamento',
    startDate: '2024-01-15T10:30:00Z',
    description: 'Problema na placa mãe - diagnóstico em andamento',
    technician: 'João Silva'
  },
  {
    id: '2',
    equipmentName: 'Notebook-002',
    type: 'preventiva',
    status: 'pendente',
    startDate: '2024-01-20T09:00:00Z',
    description: 'Manutenção preventiva agendada',
    technician: 'Maria Santos'
  },
  {
    id: '3',
    equipmentName: 'Desktop-003',
    type: 'upgrade',
    status: 'concluida',
    startDate: '2024-01-10T14:20:00Z',
    endDate: '2024-01-12T16:30:00Z',
    description: 'Upgrade de memória RAM de 8GB para 16GB',
    technician: 'Carlos Oliveira'
  }
];

export const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return <Clock size={16} />;
      case 'em_andamento': return <Wrench size={16} />;
      case 'concluida': return <CheckCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'preventiva': return 'Preventiva';
      case 'corretiva': return 'Corretiva';
      case 'upgrade': return 'Upgrade';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_andamento': return 'Em Andamento';
      case 'concluida': return 'Concluída';
      default: return status;
    }
  };

  const pendingCount = mockMaintenances.filter(m => m.status === 'pendente').length;
  const inProgressCount = mockMaintenances.filter(m => m.status === 'em_andamento').length;
  const completedCount = mockMaintenances.filter(m => m.status === 'concluida').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bem-vindo, {user.name}</h1>
        <p className="text-gray-600 mt-2">Acompanhe suas manutenções e equipamentos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Em Andamento</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{inProgressCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Wrench className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Concluídas</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{completedCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Histórico de Manutenções</h2>
        
        <div className="space-y-4">
          {mockMaintenances.map((maintenance) => (
            <div key={maintenance.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Wrench className="text-gray-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{maintenance.equipmentName}</h4>
                    <p className="text-sm text-gray-600">Tipo: {getTypeLabel(maintenance.type)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(maintenance.status)}`}>
                    {getStatusIcon(maintenance.status)}
                    {getStatusLabel(maintenance.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <span className="text-sm text-gray-600">Data de Início:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(maintenance.startDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {maintenance.endDate && (
                  <div>
                    <span className="text-sm text-gray-600">Data de Conclusão:</span>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(maintenance.endDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-2">
                <span className="text-sm text-gray-600">Descrição:</span>
                <p className="text-sm text-gray-900 mt-1">{maintenance.description}</p>
              </div>

              <div>
                <span className="text-sm text-gray-600">Técnico Responsável:</span>
                <p className="text-sm font-medium text-gray-900">{maintenance.technician}</p>
              </div>
            </div>
          ))}
        </div>

        {mockMaintenances.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Wrench className="mx-auto mb-4 text-gray-400" size={48} />
            <p>Nenhuma manutenção registrada.</p>
          </div>
        )}
      </div>
    </div>
  );
};
