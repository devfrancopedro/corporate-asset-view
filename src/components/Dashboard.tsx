
import React from 'react';
import { Monitor, Users, ArrowRight, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: 'primary' | 'accent' | 'secondary';
}> = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    primary: 'bg-primary text-white',
    accent: 'bg-accent text-white',
    secondary: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const recentActivity = [
    { id: 1, action: 'Notebook Dell atribuído a João Silva', time: '2 horas atrás', type: 'assignment' },
    { id: 2, action: 'Impressora HP em manutenção', time: '4 horas atrás', type: 'maintenance' },
    { id: 3, action: 'Monitor Samsung devolvido por Maria Santos', time: '1 dia atrás', type: 'return' },
    { id: 4, action: 'Desktop Lenovo cadastrado no sistema', time: '2 dias atrás', type: 'register' },
  ];

  const handleCadastrarEquipamento = () => {
    navigate('/equipamentos');
  };

  const handleNovaMovimentacao = () => {
    navigate('/movimentacoes');
  };

  const handleRegistrarManutencao = () => {
    navigate('/manutencoes');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral dos ativos de TI</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Equipamentos"
          value={127}
          icon={Monitor}
          color="primary"
        />
        <StatCard
          title="Equipamentos Ativos"
          value={98}
          icon={Monitor}
          color="secondary"
        />
        <StatCard
          title="Em Manutenção"
          value={8}
          icon={Settings}
          color="accent"
        />
        <StatCard
          title="Usuários Cadastrados"
          value={45}
          icon={Users}
          color="secondary"
        />
      </div>

      {/* Recent Activity and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos Equipamentos</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ativos</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-4/5 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-gray-900">98</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Em Manutenção</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-1/5 h-2 bg-accent rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-gray-900">8</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Em Estoque</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-1/4 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-gray-900">15</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Desativados</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-1/12 h-2 bg-gray-300 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-gray-900">6</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleCadastrarEquipamento}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Monitor className="text-primary" size={20} />
            <span className="text-sm font-medium text-gray-700">Cadastrar Equipamento</span>
          </button>
          <button 
            onClick={handleNovaMovimentacao}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowRight className="text-primary" size={20} />
            <span className="text-sm font-medium text-gray-700">Nova Movimentação</span>
          </button>
          <button 
            onClick={handleRegistrarManutencao}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="text-primary" size={20} />
            <span className="text-sm font-medium text-gray-700">Registrar Manutenção</span>
          </button>
        </div>
      </div>
    </div>
  );
};
