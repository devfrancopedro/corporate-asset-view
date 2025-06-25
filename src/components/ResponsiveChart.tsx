
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RotateCcw, X } from 'lucide-react';

interface ResponsiveChartProps {
  data: any[];
  title: string;
  dataKey: string;
  color: string;
}

export const ResponsiveChart: React.FC<ResponsiveChartProps> = ({ data, title, dataKey, color }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    setIsFullscreen(true);
    // Force landscape orientation on mobile
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {
        // Fallback if orientation lock is not supported
      });
    }
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    }
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={handleCloseFullscreen}
            className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#D1D5DB" />
              <YAxis stroke="#D1D5DB" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#374151', 
                  border: '1px solid #6B7280',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-800 rounded-2xl p-4 lg:p-6 border border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm lg:text-base font-semibold text-white">{title}</h3>
        <button
          onClick={handleFullscreen}
          className="lg:hidden p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
          title="Ver em tela cheia"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <div className="h-48 sm:h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#D1D5DB" fontSize={12} />
            <YAxis stroke="#D1D5DB" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#374151', 
                border: '1px solid #6B7280',
                borderRadius: '8px',
                color: '#F9FAFB'
              }} 
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
