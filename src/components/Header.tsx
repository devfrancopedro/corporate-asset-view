
import React from 'react';
import { Users } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg lg:text-2xl font-semibold text-gray-900 truncate">
            Gerenciador de Ativos de TI
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
            Controle completo dos equipamentos corporativos
          </p>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <Users size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Admin</span>
          </div>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs sm:text-sm font-medium">A</span>
          </div>
        </div>
      </div>
    </header>
  );
};
