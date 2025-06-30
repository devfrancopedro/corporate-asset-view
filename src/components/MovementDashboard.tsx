
import React, { useState } from 'react';
import { Monitor, HardDrive, Mouse, Keyboard, Plus, Package } from 'lucide-react';
import { PeripheralForm } from './PeripheralForm';
import { useToast } from '@/hooks/use-toast';

interface Peripheral {
  id: string;
  name: string;
  brand: string;
  quantity: number;
  type: 'ssd' | 'hd' | 'memoria_ram' | 'teclado' | 'mouse' | 'monitor' | 'outro';
  location: string;
}

const mockPeripherals: Peripheral[] = [
  { id: '1', name: 'SSD 256GB', brand: 'Husky', quantity: 20, type: 'ssd', location: 'Estoque TI' },
  { id: '2', name: 'Memória RAM 8GB DDR4', brand: 'HyperX', quantity: 4, type: 'memoria_ram', location: 'Estoque TI' },
  { id: '3', name: 'Teclado USB', brand: 'Multilaser', quantity: 2, type: 'teclado', location: 'Estoque TI' },
  { id: '4', name: 'Mouse USB', brand: 'Multilaser', quantity: 2, type: 'mouse', location: 'Estoque TI' },
];

export const MovementDashboard: React.FC = () => {
  const [peripherals, setPeripherals] = useState<Peripheral[]>(mockPeripherals);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ssd':
      case 'hd':
        return <HardDrive className="text-blue-600" size={20} />;
      case 'memoria_ram':
        return <Monitor className="text-green-600" size={20} />;
      case 'teclado':
        return <Keyboard className="text-purple-600" size={20} />;
      case 'mouse':
        return <Mouse className="text-red-600" size={20} />;
      default:
        return <Package className="text-gray-600" size={20} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ssd': return 'SSD';
      case 'hd': return 'HD';
      case 'memoria_ram': return 'Memória RAM';
      case 'teclado': return 'Teclado';
      case 'mouse': return 'Mouse';
      case 'monitor': return 'Monitor';
      default: return 'Outro';
    }
  };

  const getTotalByType = (type: string) => {
    return peripherals
      .filter(p => p.type === type)
      .reduce((sum, p) => sum + p.quantity, 0);
  };

  const handleAddPeripheral = (data: any) => {
    try {
      console.log('Adding peripheral to stock:', data);
      const newPeripheral: Peripheral = {
        id: Date.now().toString(),
        ...data,
      };
      setPeripherals(prev => [...prev, newPeripheral]);
      setShowForm(false);
      
      toast({
        title: "Item adicionado ao estoque",
        description: `${data.name} foi adicionado com sucesso`,
      });
      
      console.log('Peripheral added successfully:', newPeripheral);
    } catch (error) {
      console.error('Error adding peripheral:', error);
      toast({
        title: "Erro ao adicionar item",
        description: "Ocorreu um erro ao adicionar o item ao estoque",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Estoque</h1>
          <p className="text-gray-600 mt-2">Dashboard de equipamentos e periféricos</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 justify-center"
        >
          <Plus size={16} />
          Adicionar Item
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="text-blue-600" size={20} />
            <span className="text-sm font-medium text-gray-600">SSDs</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{getTotalByType('ssd')}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="text-green-600" size={20} />
            <span className="text-sm font-medium text-gray-600">HDs</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{getTotalByType('hd')}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Monitor className="text-purple-600" size={20} />
            <span className="text-sm font-medium text-gray-600">RAM</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{getTotalByType('memoria_ram')}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Keyboard className="text-orange-600" size={20} />
            <span className="text-sm font-medium text-gray-600">Teclados</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{getTotalByType('teclado')}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mouse className="text-red-600" size={20} />
            <span className="text-sm font-medium text-gray-600">Mouses</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{getTotalByType('mouse')}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Monitor className="text-cyan-600" size={20} />
            <span className="text-sm font-medium text-gray-600">Monitores</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{getTotalByType('monitor')}</div>
        </div>
      </div>

      {/* Peripherals List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Itens em Estoque</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {peripherals.map((peripheral) => (
            <div key={peripheral.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                    {getTypeIcon(peripheral.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{peripheral.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{peripheral.brand}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-lg font-bold text-gray-900">{peripheral.quantity}</div>
                  <div className="text-xs text-gray-600">unidades</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="text-gray-900">{getTypeLabel(peripheral.type)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Local:</span>
                  <span className="text-gray-900 truncate ml-2">{peripheral.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {peripherals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Package className="mx-auto mb-4 text-gray-400" size={48} />
            <p>Nenhum item em estoque</p>
          </div>
        )}
      </div>

      {showForm && (
        <PeripheralForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddPeripheral}
        />
      )}
    </div>
  );
};
