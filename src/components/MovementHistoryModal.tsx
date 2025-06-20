
import React from 'react';
import { X } from 'lucide-react';

interface MovementRecord {
  id: string;
  date: string;
  description: string;
  type: 'maintenance' | 'transfer' | 'upgrade' | 'other';
}

interface MovementHistoryModalProps {
  onClose: () => void;
  equipmentName: string;
  movements: MovementRecord[];
}

export const MovementHistoryModal: React.FC<MovementHistoryModalProps> = ({ 
  onClose, 
  equipmentName, 
  movements 
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Histórico de Movimentações
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">{equipmentName}</h3>
          <div className="h-px bg-gray-200"></div>
        </div>

        <div className="overflow-y-auto max-h-[50vh]">
          {movements.length > 0 ? (
            <div className="space-y-3">
              {movements.map((movement, index) => (
                <div key={movement.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-gray-800 rounded-full mt-2"></div>
                    {index < movements.length - 1 && (
                      <div className="w-px h-8 bg-gray-300 mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="text-sm text-gray-600 mb-1">
                      {new Date(movement.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="text-gray-900 font-medium">
                      {movement.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma movimentação registrada para este equipamento.</p>
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
