
import React from 'react';
import { Clock, Wrench, CheckCircle } from 'lucide-react';

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

interface DashboardStatsProps {
  maintenances: MaintenanceRecord[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ maintenances }) => {
  const pendingCount = maintenances.filter(m => m.status === 'pendente').length;
  const inProgressCount = maintenances.filter(m => m.status === 'em_andamento').length;
  const completedCount = maintenances.filter(m => m.status === 'concluida').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pendentes</p>
            <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
          </div>
          <div className="p-2 sm:p-3 rounded-lg bg-yellow-100">
            <Clock className="text-yellow-600" size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Em Andamento</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-2">{inProgressCount}</p>
          </div>
          <div className="p-2 sm:p-3 rounded-lg bg-blue-100">
            <Wrench className="text-blue-600" size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Concluídas</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600 mt-2">{completedCount}</p>
          </div>
          <div className="p-2 sm:p-3 rounded-lg bg-green-100">
            <CheckCircle className="text-green-600" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};
