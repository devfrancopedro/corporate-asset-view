
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import type { SupportTicket } from '@/hooks/useSupabaseData';

interface SupportTicketChartProps {
  supportTickets: SupportTicket[];
}

const chartConfig = {
  tickets: {
    label: "Chamados",
  },
  timeToCompletion: {
    label: "Tempo (horas)",
  },
};

export const SupportTicketChart: React.FC<SupportTicketChartProps> = ({ supportTickets }) => {
  const completedTickets = supportTickets.filter(t => t.status === 'finalizado');
  
  // Dados para gráfico mensal (simulado - baseado nos chamados existentes)
  const monthlyData = [
    { month: 'Jan', total: supportTickets.length, completed: completedTickets.length },
  ];

  return (
    <div className="card-minimal p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Chamados por Mês</h3>
      <ChartContainer config={chartConfig} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="total" stroke="#808080" strokeWidth={3} />
            <Line type="monotone" dataKey="completed" stroke="#a0a0a0" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
