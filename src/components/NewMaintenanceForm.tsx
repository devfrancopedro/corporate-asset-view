import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Package, Wrench } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useEquipments } from '@/hooks/useEquipments';
import { useMaintenances } from '@/hooks/useMaintenances';

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  type: 'hardware' | 'peripheral' | 'consumable';
}

const mockStockItems: StockItem[] = [
  { id: '1', name: 'Memória RAM DDR4 8GB', quantity: 15, type: 'hardware' },
  { id: '2', name: 'HD SSD 256GB', quantity: 8, type: 'hardware' },
  { id: '3', name: 'Fonte 500W', quantity: 5, type: 'hardware' },
  { id: '4', name: 'Mouse USB', quantity: 25, type: 'peripheral' },
  { id: '5', name: 'Teclado USB', quantity: 20, type: 'peripheral' },
  { id: '6', name: 'Cabo HDMI', quantity: 12, type: 'consumable' },
];

interface NewMaintenanceFormProps {
  onSubmit: () => void;
}

export const NewMaintenanceForm: React.FC<NewMaintenanceFormProps> = ({ onSubmit }) => {
  const { equipments } = useEquipments();
  const { createMaintenance } = useMaintenances();
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [maintenanceType, setMaintenanceType] = useState<'preventiva' | 'corretiva' | 'upgrade'>('corretiva');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'baixa' | 'media' | 'alta' | 'critica'>('media');
  const [selectedStockItems, setSelectedStockItems] = useState<{id: string, quantity: number}[]>([]);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockSearchTerm, setStockSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const filteredEquipments = equipments.filter(eq => 
    eq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStockItems = mockStockItems.filter(item =>
    item.name.toLowerCase().includes(stockSearchTerm.toLowerCase())
  );

  const handleEquipmentSelect = (equipment: any) => {
    setSelectedEquipment(equipment);
    setShowEquipmentModal(false);
  };

  const handleStockItemAdd = (stockItem: StockItem, quantity: number) => {
    if (quantity > stockItem.quantity) {
      toast({
        title: "Quantidade insuficiente",
        description: `Apenas ${stockItem.quantity} unidades disponíveis em estoque`,
        variant: "destructive"
      });
      return;
    }

    const existingItem = selectedStockItems.find(item => item.id === stockItem.id);
    if (existingItem) {
      setSelectedStockItems(prev => 
        prev.map(item => 
          item.id === stockItem.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setSelectedStockItems(prev => [...prev, { id: stockItem.id, quantity }]);
    }

    toast({
      title: "Item adicionado",
      description: `${quantity}x ${stockItem.name} adicionado à manutenção`
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Título necessário",
        description: "Informe o título da manutenção",
        variant: "destructive"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Descrição necessária",
        description: "Informe a descrição do problema",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      console.log('Submitting maintenance with data:', {
        title,
        description,
        type: maintenanceType,
        priority,
        equipment_id: selectedEquipment?.id || null,
        status: 'pendente'
      });

      await createMaintenance({
        title,
        description,
        type: maintenanceType,
        priority,
        equipment_id: selectedEquipment?.id || null,
        status: 'pendente'
      });

      // Reset form
      setSelectedEquipment(null);
      setMaintenanceType('corretiva');
      setTitle('');
      setDescription('');
      setPriority('media');
      setSelectedStockItems([]);

      onSubmit();
    } catch (error) {
      console.error('Error creating maintenance:', error);
      // Error handling is done in the createMaintenance function
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedStockItemsDetails = () => {
    return selectedStockItems.map(selected => {
      const stockItem = mockStockItems.find(item => item.id === selected.id);
      return { ...stockItem, selectedQuantity: selected.quantity };
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-6">
        <Wrench className="text-primary" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">Nova Manutenção</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ex: Substituição de HD, Limpeza preventiva..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Equipment Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipamento (opcional)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[60px] flex items-center">
              {selectedEquipment ? (
                <div className="w-full">
                  <p className="font-medium">{selectedEquipment.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedEquipment.serial_number && `Serial: ${selectedEquipment.serial_number} | `}
                    {selectedEquipment.model}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Nenhum equipamento selecionado</p>
              )}
            </div>
            <Dialog open={showEquipmentModal} onOpenChange={setShowEquipmentModal}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  <Search size={16} />
                  Selecionar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Selecionar Equipamento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Buscar por nome, serial ou modelo..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredEquipments.map((equipment) => (
                      <div
                        key={equipment.id}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleEquipmentSelect(equipment)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">{equipment.name}</p>
                            {equipment.serial_number && (
                              <p className="text-sm text-gray-600">Serial: {equipment.serial_number}</p>
                            )}
                            {equipment.model && (
                              <p className="text-sm text-gray-600">{equipment.model}</p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            equipment.status === 'ativo' ? 'bg-green-100 text-green-800' :
                            equipment.status === 'desativado' ? 'bg-red-100 text-red-800' :
                            equipment.status === 'manutencao' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {equipment.status || 'ativo'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {filteredEquipments.length === 0 && (
                      <p className="text-center text-gray-500 py-4">Nenhum equipamento encontrado</p>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Maintenance Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Manutenção *
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={maintenanceType}
            onChange={(e) => setMaintenanceType(e.target.value as any)}
          >
            <option value="corretiva">Corretiva</option>
            <option value="preventiva">Preventiva</option>
            <option value="upgrade">Upgrade</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prioridade
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição do Problema *
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={4}
            placeholder="Descreva o problema encontrado ou a manutenção a ser realizada..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            className="flex-1" 
            disabled={submitting}
          >
            <Wrench size={16} />
            {submitting ? 'Criando...' : 'Criar Manutenção'}
          </Button>
        </div>
      </form>
    </div>
  );
};
