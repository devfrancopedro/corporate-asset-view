
import React from 'react';
import { Users } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg lg:text-2xl font-semibold text-gray-900">Gerenciador de Ativos de TI</h2>
          <p className="text-xs lg:text-sm text-gray-600 mt-1 hidden sm:block">Controle completo dos equipamentos corporativos</p>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
            <Users size={14} className="lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Admin</span>
          </div>
          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-xs lg:text-sm font-medium">A</span>
          </div>
        </div>
      </div>
    </header>
  );
};
