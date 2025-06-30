import React, { useState } from 'react';
import { Wrench, Search, Plus, Clock, CheckCircle, AlertCircle, Edit, History } from 'lucide-react';
import { NewMaintenanceForm } from './NewMaintenanceForm';
import { EditMaintenanceModal } from './EditMaintenanceModal';
import { TicketHistoryModal } from './TicketHistoryModal';
import { useMaintenances } from '@/hooks/useMaintenances';

export const Manutencoes: React.FC = () => {
  const { maintenances, loading, fetchMaintenances } = useMaintenances();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<any>(null);
  const [historyMaintenance, setHistoryMaintenance] = useState<any>(null);

  const handleNewMaintenance = () => {
    fetchMaintenances();
    setShowForm(false);
  };

  const handleUpdate = () => {
    fetchMaintenances();
  };

  const filteredMaintenances = maintenances.filter(maintenance => {
    const matchesSearch = 
      maintenance.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.description?.toLowerCase().includes(searchTerm.toLowerCase());
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manutenções</h1>
            <p className="text-gray-600 mt-2">Gerencie todas as manutenções dos equipamentos</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto btn-minimal bg-primary text-white hover:bg-primary/90 flex items-center gap-2 justify-center"
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="card-minimal p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
              </div>
              <div className="p-3 rounded-minimal bg-yellow-100">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="card-minimal p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-2">{inProgressCount}</p>
              </div>
              <div className="p-3 rounded-minimal bg-blue-100">
                <Wrench className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="card-minimal p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 mt-2">{completedCount}</p>
              </div>
              <div className="p-3 rounded-minimal bg-green-100">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card-minimal p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar por título, descrição..."
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lista de Manutenções</h2>
          
          <div className="space-y-4">
            {filteredMaintenances.map((maintenance) => (
              <div key={maintenance.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Wrench className="text-gray-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{maintenance.title}</h4>
                      <p className="text-sm text-gray-600">Tipo: {getTypeLabel(maintenance.type)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(maintenance.status || 'pendente')}`}>
                      {getStatusIcon(maintenance.status || 'pendente')}
                      {getStatusLabel(maintenance.status || 'pendente')}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-sm text-gray-600">Descrição:</span>
                  <p className="text-sm text-gray-900 mt-1">{maintenance.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    Criado em: {new Date(maintenance.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingMaintenance(maintenance)}
                      className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit size={14} />
                      Editar
                    </button>
                    <button
                      onClick={() => setHistoryMaintenance(maintenance)}
                      className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <History size={14} />
                      Histórico
                    </button>
                  </div>
                </div>
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

      {editingMaintenance && (
        <EditMaintenanceModal
          maintenance={editingMaintenance}
          onClose={() => setEditingMaintenance(null)}
          onUpdate={handleUpdate}
        />
      )}

      {historyMaintenance && (
        <TicketHistoryModal
          ticketId={historyMaintenance.id}
          ticketTitle={historyMaintenance.title}
          onClose={() => setHistoryMaintenance(null)}
          type="maintenance"
        />
      )}
    </>
  );
};
