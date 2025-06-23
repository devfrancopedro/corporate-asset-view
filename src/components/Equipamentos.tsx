import React, { useState } from 'react';
import { Monitor, Search, Settings, ArrowRight, FileText } from 'lucide-react';
import { EquipmentForm } from './EquipmentForm';
import { ReportModal } from './ReportModal';
import { MovementHistoryModal } from './MovementHistoryModal';
import { EditEquipmentModal } from './EditEquipmentModal';

interface Equipment {
  id: string;
  filial: string;
  nomeMaquina: string;
  macAddress: string;
  processadorCPU: string;
  memoriaRAM: string;
  armazenamento: string;
  sistemaOperacional: string;
  isCaixa: boolean;
  pdc?: string;
  status: 'Ativo' | 'Em Manutenção' | 'Desativado' | 'Em Estoque';
  location: string;
  assignedUser?: string;
  acquisitionDate: string;
}

interface MovementRecord {
  id: string;
  date: string;
  description: string;
  type: 'maintenance' | 'transfer' | 'upgrade' | 'other';
}

const mockEquipments: Equipment[] = [
  {
    id: '1',
    filial: 'MB001',
    nomeMaquina: 'Desktop-001',
    macAddress: '00:11:22:33:44:55',
    processadorCPU: 'Intel Core i5-12400',
    memoriaRAM: '8GB DDR4',
    armazenamento: 'SSD 256GB',
    sistemaOperacional: 'Windows 11',
    isCaixa: false,
    status: 'Ativo',
    location: 'TI',
    assignedUser: 'João Silva',
    acquisitionDate: '2023-01-15'
  },
  {
    id: '2',
    filial: 'MB001',
    nomeMaquina: 'Caixa-001',
    macAddress: '00:11:22:33:44:66',
    processadorCPU: 'Intel Core i3-10100',
    memoriaRAM: '4GB DDR4',
    armazenamento: 'SSD 128GB',
    sistemaOperacional: 'Windows 10',
    isCaixa: true,
    pdc: 'PDC Principal - Configuração especial para vendas',
    status: 'Ativo',
    location: 'Vendas',
    assignedUser: 'Maria Santos',
    acquisitionDate: '2023-02-20'
  },
  {
    id: '3',
    filial: 'MB002',
    nomeMaquina: 'Desktop-002',
    macAddress: '00:11:22:33:44:77',
    processadorCPU: 'AMD Ryzen 5 5600G',
    memoriaRAM: '16GB DDR4',
    armazenamento: 'SSD 512GB',
    sistemaOperacional: 'Linux Ubuntu',
    isCaixa: false,
    status: 'Em Manutenção',
    location: 'Administrativo',
    acquisitionDate: '2023-03-10'
  }
];

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
  ],
  '2': [
    {
      id: '4',
      date: '2024-01-20T11:00:00Z',
      description: 'Configuração inicial do PDC',
      type: 'other'
    },
    {
      id: '5',
      date: '2024-02-25T16:45:00Z',
      description: 'Manutenção preventiva - Limpeza interna',
      type: 'maintenance'
    }
  ],
  '3': [
    {
      id: '6',
      date: '2024-03-12T13:30:00Z',
      description: 'Diagnóstico de problema na placa mãe',
      type: 'maintenance'
    }
  ]
};

export const Equipamentos: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>(mockEquipments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch = 
      equipment.nomeMaquina.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.macAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.filial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.processadorCPU.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || equipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800';
      case 'Em Manutenção': return 'bg-yellow-100 text-yellow-800';
      case 'Desativado': return 'bg-red-100 text-red-800';
      case 'Em Estoque': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddEquipment = (data: any) => {
    const newEquipment: Equipment = {
      id: Date.now().toString(),
      ...data,
      status: 'Em Estoque' as const,
      location: 'Estoque',
      acquisitionDate: new Date().toISOString().split('T')[0]
    };
    setEquipments([...equipments, newEquipment]);
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
  };

  const handleSaveEquipment = (updatedEquipment: Equipment) => {
    setEquipments(prev => prev.map(eq => 
      eq.id === updatedEquipment.id ? updatedEquipment : eq
    ));
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipamentos</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os ativos de TI</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Adicionar Equipamento
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por nome, MAC, filial..."
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
            <option value="Ativo">Ativo</option>
            <option value="Em Manutenção">Em Manutenção</option>
            <option value="Desativado">Desativado</option>
            <option value="Em Estoque">Em Estoque</option>
          </select>
          <button 
            onClick={() => setShowReportModal(true)}
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            <FileText size={16} />
            Gerar Relatório
          </button>
        </div>
      </div>

      {/* Equipment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEquipments.map((equipment) => (
          <div key={equipment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${equipment.isCaixa ? 'bg-red-100' : 'bg-blue-100'}`}>
                  <Monitor className={equipment.isCaixa ? 'text-red-600' : 'text-blue-600'} size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{equipment.nomeMaquina}</h3>
                  <p className="text-sm text-gray-600">
                    {equipment.filial} - {equipment.isCaixa ? 'Caixa' : 'Equipamento'}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment.status)}`}>
                {equipment.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">MAC:</span>
                <span className="text-gray-900 font-medium">{equipment.macAddress}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">CPU:</span>
                <span className="text-gray-900 font-medium">{equipment.processadorCPU}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">RAM:</span>
                <span className="text-gray-900 font-medium">{equipment.memoriaRAM}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Armazenamento:</span>
                <span className="text-gray-900 font-medium">{equipment.armazenamento}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sistema:</span>
                <span className="text-gray-900 font-medium">{equipment.sistemaOperacional}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Localização:</span>
                <span className="text-gray-900 font-medium">{equipment.location}</span>
              </div>
              {equipment.assignedUser && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Usuário:</span>
                  <span className="text-gray-900 font-medium">{equipment.assignedUser}</span>
                </div>
              )}
              {equipment.isCaixa && equipment.pdc && (
                <div className="text-sm">
                  <span className="text-gray-600">PDC:</span>
                  <p className="text-gray-900 font-medium mt-1">{equipment.pdc}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleEditEquipment(equipment)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings size={14} />
                <span>Editar</span>
              </button>
              <button 
                onClick={() => handleShowMovements(equipment.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowRight size={14} />
                <span>Movimentar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEquipments.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
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
          equipments={equipments}
        />
      )}

      {selectedEquipmentId && selectedEquipment && (
        <MovementHistoryModal
          onClose={() => setSelectedEquipmentId(null)}
          equipmentName={selectedEquipment.nomeMaquina}
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
