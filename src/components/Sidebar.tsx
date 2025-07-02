
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Monitor, 
  Users, 
  Package, 
  Settings,
  Ticket 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Monitor, label: 'Equipamentos', path: '/equipamentos' },
  { icon: Package, label: 'Estoque', path: '/estoque' },
  { icon: Settings, label: 'Manutenções', path: '/manutencoes' },
  { icon: Ticket, label: 'Suporte de TI', path: '/suporte' },
];

const adminOnlyItems = [
  { icon: Users, label: 'Usuários', path: '/usuarios' },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  // Check if current user is admin - accepts both email formats
  const isAdmin = user?.email === 'admin@admin.com' || user?.email === 'admin';

  return (
    <div className="w-64 h-screen bg-primary text-white flex flex-col rounded-r-minimal overflow-y-auto shadow-lg">
      <div className="p-4 sm:p-6 border-b border-primary-foreground/10 flex-shrink-0">
        <h1 className="text-lg sm:text-xl font-bold leading-tight">Controle de Ativos</h1>
        <p className="text-xs sm:text-sm text-primary-foreground/70 mt-1">Sistema de TI</p>
      </div>
      
      <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
        <ul className="space-y-1 sm:space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-minimal transition-colors text-sm sm:text-base ${
                    isActive
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white'
                  }`
                }
              >
                <item.icon size={18} className="flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            </li>
          ))}
          
          {/* Admin-only menu items */}
          {isAdmin && adminOnlyItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-minimal transition-colors text-sm sm:text-base ${
                    isActive
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white'
                  }`
                }
              >
                <item.icon size={18} className="flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-3 sm:p-4 border-t border-primary-foreground/10 flex-shrink-0">
        <div className="text-xs sm:text-sm text-primary-foreground/60">
          Versão 1.0.0
        </div>
        {isAdmin && (
          <div className="text-xs text-accent-foreground mt-1 bg-accent px-2 py-1 rounded text-center">
            Modo Administrador
          </div>
        )}
      </div>
    </div>
  );
};
