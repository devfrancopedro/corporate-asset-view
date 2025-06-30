
export interface MaintenanceRecord {
  id: string;
  equipmentName: string;
  type: 'preventiva' | 'corretiva' | 'upgrade';
  status: 'pendente' | 'em_andamento' | 'concluida';
  startDate: string;
  endDate?: string;
  description: string;
  technician: string;
}

export const mockMaintenances: MaintenanceRecord[] = [
  {
    id: '1',
    equipmentName: 'Desktop-001',
    type: 'corretiva',
    status: 'em_andamento',
    startDate: '2024-01-15T10:30:00Z',
    description: 'Problema na placa mãe - diagnóstico em andamento',
    technician: 'João Silva'
  },
  {
    id: '2',
    equipmentName: 'Notebook-002',
    type: 'preventiva',
    status: 'pendente',
    startDate: '2024-01-20T09:00:00Z',
    description: 'Manutenção preventiva agendada',
    technician: 'Maria Santos'
  },
  {
    id: '3',
    equipmentName: 'Desktop-003',
    type: 'upgrade',
    status: 'concluida',
    startDate: '2024-01-10T14:20:00Z',
    endDate: '2024-01-12T16:30:00Z',
    description: 'Upgrade de memória RAM de 8GB para 16GB',
    technician: 'Carlos Oliveira'
  }
];
