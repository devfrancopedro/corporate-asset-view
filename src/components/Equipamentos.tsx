
import React, { useState } from 'react';
import { Monitor, Search, Settings, History, FileText, Eye, EyeOff } from 'lucide-react';
import { EquipmentForm } from './EquipmentForm';
import { ReportModal } from './ReportModal';
import { MovementHistoryModal } from './MovementHistoryModal';
import { EditEquipmentModal } from './EditEquipmentModal';
import { useSupabaseData } from '@/hooks/useSupabaseData';

interface MovementRecord {
  id: string;
  date: string;
  description: string;
  type: 'maintenance' | 'transfer' | 'upgrade' | 'other';
}

const mockMovements: { [key: string]: MovementRecord[] } = {
  '1': [
    {
      id: '1',
      date: '2024-01-15T10:30:00Z',
      description: 'Trocado SSD de 128GB para 256GB',
      type: 'upgrade'
    },
    {
      id: '2',
      date: '2024-02-10T14:20:00Z',
      description: 'Formatado - Reinstalação do Windows 11',
      type: 'maintenance'
    },
    {
      id: '3',
      date: '2024-03-05T09:15:00Z',
      description: 'Trocado memória RAM de 4GB para 8GB',
      type: 'upgrade'
    }
  ]
};

export const Equipamentos: React.FC = () => {
  const { equipments, loading } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<any>(null);

  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch = 
      equipment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || equipment.status === statusFilter;
    const isActive = equipment.status !== 'desativado';
    const shouldShow = showInactive || isActive;
    return matchesSearch && matchesStatus && shouldShow;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'manutencao': return 'bg-yellow-100 text-yellow-800';
      case 'desativado': return 'bg-red-100 text-red-800';
      case 'estoque': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddEquipment = (data: any) => {
    // Equipment creation is handled by the EquipmentForm component
    setShowForm(false);
  };

  const handleEditEquipment = (equipment: any) => {
    setEditingEquipment(equipment);
  };

  const handleSaveEquipment = (updatedEquipment: any) => {
    setEditingEquipment(null);
  };

  const handleShowMovements = (equipmentId: string) => {
    setSelectedEquipmentId(equipmentId);
  };

  const selectedEquipment = selectedEquipmentId 
    ? equipments.find(eq => eq.id === selectedEquipmentId)
    : null;

  const selectedMovements = selectedEquipmentId 
    ? mockMovements[selectedEquipmentId] || []
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Equipamentos</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os ativos de TI</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Adicionar Equipamento
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por nome, serial, marca..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="manutencao">Em Manutenção</option>
            <option value="desativado">Desativado</option>
            <option value="estoque">Em Estoque</option>
          </select>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showInactive"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="showInactive" className="text-sm text-gray-700 flex items-center gap-1">
              {showInactive ? <Eye size={16} /> : <EyeOff size={16} />}
              Mostrar Desativados
            </label>
          </div>
          <button 
            onClick={() => setShowReportModal(true)}
            className="w-full sm:w-auto bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2 justify-center"
          >
            <FileText size={16} />
            Gerar Relatório
          </button>
        </div>
      </div>

      {/* Equipment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredEquipments.map((equipment) => (
          <div key={equipment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Monitor className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{equipment.name}</h3>
                  <p className="text-sm text-gray-600">
                    {equipment.brand} - {equipment.type}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment.status || 'ativo')}`}>
                {equipment.status === 'ativo' ? 'Ativo' : 
                 equipment.status === 'manutencao' ? 'Em Manutenção' :
                 equipment.status === 'desativado' ? 'Desativado' :
                 equipment.status === 'estoque' ? 'Em Estoque' : 
                 equipment.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {equipment.serial_number && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Serial:</span>
                  <span className="text-gray-900 font-medium">{equipment.serial_number}</span>
                </div>
              )}
              {equipment.model && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Modelo:</span>
                  <span className="text-gray-900 font-medium">{equipment.model}</span>
                </div>
              )}
              {equipment.location && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Localização:</span>
                  <span className="text-gray-900 font-medium">{equipment.location}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleEditEquipment(equipment)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings size={14} />
                <span className="hidden sm:inline">Editar</span>
              </button>
              <button 
                onClick={() => handleShowMovements(equipment.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <History size={14} />
                <span className="hidden sm:inline">Histórico de Movimentação</span>
                <span className="sm:hidden">Histórico</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEquipments.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <Monitor className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum equipamento encontrado</h3>
          <p className="text-gray-600">Tente ajustar os filtros ou adicione um novo equipamento</p>
        </div>
      )}

      {showForm && (
        <EquipmentForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddEquipment}
        />
      )}

      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          equipments={filteredEquipments.map(eq => ({
            id: eq.id,
            name: eq.name,
            brand: eq.brand || '',
            model: eq.model || '',
            serial_number: eq.serial_number || '',
            status: eq.status || 'ativo',
            location: eq.location || '',
            type: eq.type,
            created_at: eq.created_at,
            updated_at: eq.updated_at,
            created_by: eq.created_by,
            user_id: eq.user_id
          }))}
        />
      )}

      {selectedEquipmentId && selectedEquipment && (
        <MovementHistoryModal
          onClose={() => setSelectedEquipmentId(null)}
          equipmentName={selectedEquipment.name}
          movements={selectedMovements}
        />
      )}

      {editingEquipment && (
        <EditEquipmentModal
          equipment={editingEquipment}
          onClose={() => setEditingEquipment(null)}
          onSave={handleSaveEquipment}
        />
      )}
    </div>
  );
};
