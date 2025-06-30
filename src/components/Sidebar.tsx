
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
  { icon: Package, label: 'Estoque', path: '/movimentacoes' },
  { icon: Settings, label: 'Manutenções', path: '/manutencoes' },
  { icon: Ticket, label: 'Suporte de TI', path: '/suporte' },
];

const adminOnlyItems = [
  { icon: Users, label: 'Usuários', path: '/usuarios' },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  // Check if current user is admin
  const isAdmin = user?.email === 'admin@admin.com';

  return (
    <div className="w-64 h-screen bg-primary text-white flex flex-col rounded-r-minimal">
      <div className="p-6 border-b border-primary-foreground/10">
        <h1 className="text-xl font-bold">Controle de Ativos</h1>
        <p className="text-sm text-primary-foreground/70 mt-1">Sistema de TI</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-minimal transition-colors ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
          
          {/* Admin-only menu items */}
          {isAdmin && adminOnlyItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-minimal transition-colors ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-primary-foreground/10">
        <div className="text-sm text-primary-foreground/60">
          Versão 1.0.0
        </div>
        {isAdmin && (
          <div className="text-xs text-accent mt-1">
            Modo Administrador
          </div>
        )}
      </div>
    </div>
  );
};
