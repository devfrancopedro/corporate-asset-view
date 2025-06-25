
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Wrench, HeadphonesIcon, Users, ArrowRight } from 'lucide-react';

interface SectionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  count: number;
  path: string;
  color: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, description, icon: Icon, count, path, color }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(path)}
      className="bg-gray-800 rounded-2xl border border-gray-600 p-4 lg:p-6 cursor-pointer hover:bg-gray-750 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <ArrowRight size={20} className="text-gray-400 group-hover:text-white transition-colors" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white group-hover:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-400 group-hover:text-gray-300">{description}</p>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500">Total</span>
          <span className="text-xl font-bold text-white">{count}</span>
        </div>
      </div>
    </div>
  );
};

export const DashboardSections: React.FC = () => {
  const sections = [
    {
      title: 'Equipamentos',
      description: 'Gerencie todos os equipamentos de TI',
      icon: Monitor,
      count: 127,
      path: '/equipamentos',
      color: 'bg-blue-600'
    },
    {
      title: 'Manutenções',
      description: 'Acompanhe manutenções e reparos',
      icon: Wrench,
      count: 15,
      path: '/manutencoes',
      color: 'bg-orange-600'
    },
    {
      title: 'Suporte',
      description: 'Tickets e chamados técnicos',
      icon: HeadphonesIcon,
      count: 8,
      path: '/suporte',
      color: 'bg-green-600'
    },
    {
      title: 'Usuários',
      description: 'Gerenciamento de usuários',
      icon: Users,
      count: 45,
      path: '/usuarios',
      color: 'bg-purple-600'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">Acesso Rápido</h2>
        <p className="text-sm text-gray-400">Navegue rapidamente entre as seções</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {sections.map((section) => (
          <SectionCard
            key={section.path}
            title={section.title}
            description={section.description}
            icon={section.icon}
            count={section.count}
            path={section.path}
            color={section.color}
          />
        ))}
      </div>
    </div>
  );
};
