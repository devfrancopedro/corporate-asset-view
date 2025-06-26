
import React, { useState } from 'react';
import { Wrench, Search, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { NewMaintenanceForm } from './NewMaintenanceForm';

interface MaintenanceRecord {
  id: string;
  equipmentName: string;
  equipmentMB: string;
  type: 'preventiva' | 'corretiva' | 'upgrade';
  status: 'pendente' | 'em_andamento' | 'concluida';
  startDate: string;
  endDate?: string;
  description: string;
  technician: string;
  assignedUser?: string;
  stockItems?: {id: string, quantity: number}[];
}

const mockMaintenances: MaintenanceRecord[] = [
  {
    id: '1',
    equipmentName: 'Desktop-001',
    equipmentMB: 'MB001',
    type: 'corretiva',
    status: 'em_andamento',
    startDate: '2024-01-15T10:30:00Z',
    description: 'Problema na placa mãe - diagnóstico em andamento',
    technician: 'João Silva',
    assignedUser: 'Carlos Santos'
  },
  {
    id: '2',
    equipmentName: 'Notebook-002',
    equipmentMB: 'MB002',
    type: 'preventiva',
    status: 'pendente',
    startDate: '2024-01-20T09:00:00Z',
    description: 'Manutenção preventiva agendada',
    technician: 'Maria Santos',
    assignedUser: 'Ana Costa'
  },
  {
    id: '3',
    equipmentName: 'Desktop-003',
    equipmentMB: 'MB001',
    type: 'upgrade',
    status: 'concluida',
    startDate: '2024-01-10T14:20:00Z',
    endDate: '2024-01-12T16:30:00Z',
    description: 'Upgrade de memória RAM de 8GB para 16GB',
    technician: 'Carlos Oliveira',
    assignedUser: 'Roberto Lima'
  },
  {
    id: '4',
    equipmentName: 'Caixa-001',
    equipmentMB: 'MB003',
    type: 'corretiva',
    status: 'pendente',
    startDate: '2024-01-18T11:00:00Z',
    description: 'Sistema travando frequentemente',
    technician: 'Pedro Alves',
    assignedUser: 'Fernanda Reis'
  }
];

export const Manutencoes: React.FC = () => {
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>(mockMaintenances);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleNewMaintenance = (newMaintenance: MaintenanceRecord) => {
    setMaintenances(prev => [newMaintenance, ...prev]);
    setShowForm(false);
  };

  const filteredMaintenances = maintenances.filter(maintenance => {
    const matchesSearch = 
      maintenance.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.equipmentMB.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (maintenance.assignedUser && maintenance.assignedUser.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === '' || maintenance.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const pendingCount = maintenances.filter(m => m.status === 'pendente').length;
  const inProgressCount = maintenances.filter(m => m.status === 'em_andamento').length;
  const completedCount = maintenances.filter(m => m.status === 'concluida').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manutenções</h1>
          <p className="text-gray-600 mt-2">Gerencie todas as manutenções dos equipamentos</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-minimal bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus size={16} />
          {showForm ? 'Cancelar' : 'Nova Manutenção'}
        </button>
      </div>

      {/* New Maintenance Form */}
      {showForm && (
        <NewMaintenanceForm onSubmit={handleNewMaintenance} />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-minimal p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
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
              <p className="text-2xl font-bold text-blue-600 mt-2">{inProgressCount}</p>
            </div>
            <div className="p-3 rounded-minimal bg-blue-100">
              <Wrench className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card-minimal p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Concluídas</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{completedCount}</p>
            </div>
            <div className="p-3 rounded-minimal bg-green-100">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-minimal p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por equipamento, MB, técnico, usuário..."
              className="w-full input-minimal pl-10 pr-4 py-2 border border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-minimal px-4 py-2 border border-gray-300"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluida">Concluída</option>
          </select>
        </div>
      </div>

      {/* Maintenances List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Lista de Manutenções</h2>
        
        <div className="space-y-4">
          {filteredMaintenances.map((maintenance) => (
            <div key={maintenance.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Wrench className="text-gray-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{maintenance.equipmentName}</h4>
                    <p className="text-sm text-gray-600">MB: {maintenance.equipmentMB} | Tipo: {getTypeLabel(maintenance.type)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(maintenance.status)}`}>
                    {getStatusIcon(maintenance.status)}
                    {getStatusLabel(maintenance.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <span className="text-sm text-gray-600">Técnico Responsável:</span>
                  <p className="text-sm font-medium text-gray-900">{maintenance.technician}</p>
                </div>
                {maintenance.assignedUser && (
                  <div>
                    <span className="text-sm text-gray-600">Usuário:</span>
                    <p className="text-sm font-medium text-gray-900">{maintenance.assignedUser}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600">Data de Início:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(maintenance.startDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="mb-2">
                <span className="text-sm text-gray-600">Descrição:</span>
                <p className="text-sm text-gray-900 mt-1">{maintenance.description}</p>
              </div>

              {maintenance.endDate && (
                <div>
                  <span className="text-sm text-gray-600">Data de Conclusão:</span>
                  <p className="text-sm text-gray-900">
                    {new Date(maintenance.endDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredMaintenances.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Wrench className="mx-auto mb-4 text-gray-400" size={48} />
            <p>Nenhuma manutenção encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};
