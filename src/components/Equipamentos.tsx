
import React, { useState } from 'react';
import { Monitor, Search, Settings, Users, ArrowRight } from 'lucide-react';

interface Equipment {
  id: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  patrimony: string;
  status: 'Ativo' | 'Em Manutenção' | 'Desativado' | 'Em Estoque';
  location: string;
  assignedUser?: string;
  acquisitionDate: string;
}

const mockEquipments: Equipment[] = [
  {
    id: '1',
    type: 'Notebook',
    brand: 'Dell',
    model: 'Latitude 5520',
    serialNumber: 'DL123456',
    patrimony: 'PAT001',
    status: 'Ativo',
    location: 'TI',
    assignedUser: 'João Silva',
    acquisitionDate: '2023-01-15'
  },
  {
    id: '2',
    type: 'Desktop',
    brand: 'Lenovo',
    model: 'ThinkCentre M720',
    serialNumber: 'LN789012',
    patrimony: 'PAT002',
    status: 'Ativo',
    location: 'Financeiro',
    assignedUser: 'Maria Santos',
    acquisitionDate: '2023-02-20'
  },
  {
    id: '3',
    type: 'Impressora',
    brand: 'HP',
    model: 'LaserJet Pro 404dn',
    serialNumber: 'HP345678',
    patrimony: 'PAT003',
    status: 'Em Manutenção',
    location: 'Administrativo',
    acquisitionDate: '2023-03-10'
  }
];

export const Equipamentos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredEquipments = mockEquipments.filter(equipment => {
    const matchesSearch = equipment.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipamentos</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os ativos de TI</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
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
              placeholder="Buscar por marca, modelo ou série..."
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
          <button className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors">
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
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Monitor className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{equipment.brand} {equipment.model}</h3>
                  <p className="text-sm text-gray-600">{equipment.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment.status)}`}>
                {equipment.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Série:</span>
                <span className="text-gray-900 font-medium">{equipment.serialNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Patrimônio:</span>
                <span className="text-gray-900 font-medium">{equipment.patrimony}</span>
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
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings size={14} />
                <span>Editar</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
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
    </div>
  );
};
