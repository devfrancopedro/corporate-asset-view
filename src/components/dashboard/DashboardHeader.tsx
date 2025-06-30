
import React from 'react';

interface DashboardHeaderProps {
  userName: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bem-vindo, {userName}</h1>
      <p className="text-gray-600 mt-2 text-sm sm:text-base">Acompanhe suas manutenções e equipamentos</p>
    </div>
  );
};
