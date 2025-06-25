
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Monitor, 
  Users, 
  ArrowRight, 
  Settings,
  Ticket,
  X
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Monitor, label: 'Equipamentos', path: '/equipamentos' },
  { icon: Users, label: 'Usuários', path: '/usuarios' },
  { icon: ArrowRight, label: 'Movimentações', path: '/movimentacoes' },
  { icon: Settings, label: 'Manutenções', path: '/manutencoes' },
  { icon: Ticket, label: 'Suporte de TI', path: '/suporte' },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col rounded-r-2xl border-r border-gray-800">
      <div className="p-4 lg:p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-white">Controle de Ativos</h1>
            <p className="text-xs lg:text-sm text-gray-400 mt-1">Sistema de TI</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-gray-400 hover:bg-gray-800 lg:hidden"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      
      <nav className="flex-1 p-3 lg:p-4">
        <ul className="space-y-1 lg:space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-2xl transition-colors text-sm lg:text-base ${
                    isActive
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={18} className="lg:w-5 lg:h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-3 lg:p-4 border-t border-gray-800">
        <div className="text-xs lg:text-sm text-gray-500">
          Versão 1.0.0
        </div>
      </div>
    </div>
  );
};
