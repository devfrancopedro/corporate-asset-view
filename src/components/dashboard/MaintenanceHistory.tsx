
import React from 'react';
import { Wrench } from 'lucide-react';
import { MaintenanceCard } from './MaintenanceCard';

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

interface MaintenanceHistoryProps {
  maintenances: MaintenanceRecord[];
}

export const MaintenanceHistory: React.FC<MaintenanceHistoryProps> = ({ maintenances }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mx-4 sm:mx-0">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Histórico de Manutenções</h2>
      
      <div className="space-y-4">
        {maintenances.map((maintenance) => (
          <MaintenanceCard key={maintenance.id} maintenance={maintenance} />
        ))}
      </div>

      {maintenances.length === 0 && (
        <div className="text-center py-6 sm:py-8 text-gray-500">
          <Wrench className="mx-auto mb-4 text-gray-400" size={40} />
          <p className="text-sm sm:text-base">Nenhuma manutenção registrada.</p>
        </div>
      )}
    </div>
  );
};
