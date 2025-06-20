
import React from 'react';
import { X, Wrench, Clock, CheckCircle } from 'lucide-react';

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

interface UserMaintenanceModalProps {
  onClose: () => void;
  userName: string;
  maintenances: MaintenanceRecord[];
}

export const UserMaintenanceModal: React.FC<UserMaintenanceModalProps> = ({ 
  onClose, 
  userName, 
  maintenances 
}) => {
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
      default: return <Clock size={16} />;
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Histórico de Manutenções
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">{userName}</h3>
          <div className="h-px bg-gray-200"></div>
        </div>

        <div className="overflow-y-auto max-h-[50vh]">
          {maintenances.length > 0 ? (
            <div className="space-y-4">
              {maintenances.map((maintenance) => (
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Wrench className="mx-auto mb-4 text-gray-400" size={48} />
              <p>Nenhuma manutenção registrada para este usuário.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
