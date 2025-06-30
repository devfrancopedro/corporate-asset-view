
import React from 'react';
import { Wrench, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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

interface MaintenanceCardProps {
  maintenance: MaintenanceRecord;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({ maintenance }) => {
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

  return (
    <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
            <Wrench className="text-gray-600" size={16} />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{maintenance.equipmentName}</h4>
            <p className="text-xs sm:text-sm text-gray-600">Tipo: {getTypeLabel(maintenance.type)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start">
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(maintenance.status)} whitespace-nowrap`}>
            {getStatusIcon(maintenance.status)}
            {getStatusLabel(maintenance.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3">
        <div>
          <span className="text-xs sm:text-sm text-gray-600">Data de Início:</span>
          <p className="text-xs sm:text-sm font-medium text-gray-900">
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
            <span className="text-xs sm:text-sm text-gray-600">Data de Conclusão:</span>
            <p className="text-xs sm:text-sm font-medium text-gray-900">
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
        <span className="text-xs sm:text-sm text-gray-600">Descrição:</span>
        <p className="text-xs sm:text-sm text-gray-900 mt-1 break-words">{maintenance.description}</p>
      </div>

      <div>
        <span className="text-xs sm:text-sm text-gray-600">Técnico Responsável:</span>
        <p className="text-xs sm:text-sm font-medium text-gray-900">{maintenance.technician}</p>
      </div>
    </div>
  );
};
