
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Search, Package, Wrench } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Equipment {
  id: string;
  name: string;
  mb: string;
  model: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  assignedUser?: string;
}

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  type: 'hardware' | 'peripheral' | 'consumable';
}

const mockEquipments: Equipment[] = [
  { id: '1', name: 'Desktop-001', mb: 'MB001', model: 'Dell OptiPlex 7090', status: 'ativo', assignedUser: 'João Silva' },
  { id: '2', name: 'Notebook-002', mb: 'MB002', model: 'Lenovo ThinkPad T14', status: 'ativo', assignedUser: 'Maria Santos' },
  { id: '3', name: 'Desktop-003', mb: 'MB003', model: 'HP EliteDesk 800', status: 'ativo', assignedUser: 'Carlos Oliveira' },
  { id: '4', name: 'Caixa-001', mb: 'MB004', model: 'Montado Customizado', status: 'inativo' },
];

const mockStockItems: StockItem[] = [
  { id: '1', name: 'Memória RAM DDR4 8GB', quantity: 15, type: 'hardware' },
  { id: '2', name: 'HD SSD 256GB', quantity: 8, type: 'hardware' },
  { id: '3', name: 'Fonte 500W', quantity: 5, type: 'hardware' },
  { id: '4', name: 'Mouse USB', quantity: 25, type: 'peripheral' },
  { id: '5', name: 'Teclado USB', quantity: 20, type: 'peripheral' },
  { id: '6', name: 'Cabo HDMI', quantity: 12, type: 'consumable' },
];

interface NewMaintenanceFormProps {
  onSubmit: (maintenance: any) => void;
}

export const NewMaintenanceForm: React.FC<NewMaintenanceFormProps> = ({ onSubmit }) => {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [maintenanceType, setMaintenanceType] = useState<'preventiva' | 'corretiva' | 'upgrade'>('corretiva');
  const [diagnosis, setDiagnosis] = useState('');
  const [selectedStockItems, setSelectedStockItems] = useState<{id: string, quantity: number}[]>([]);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockSearchTerm, setStockSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredEquipments = mockEquipments.filter(eq => 
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.mb.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStockItems = mockStockItems.filter(item =>
    item.name.toLowerCase().includes(stockSearchTerm.toLowerCase())
  );

  const handleEquipmentSelect = (equipment: Equipment) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEquipment) {
      toast({
        title: "Equipamento necessário",
        description: "Selecione um equipamento para a manutenção",
        variant: "destructive"
      });
      return;
    }

    if (!diagnosis.trim()) {
      toast({
        title: "Diagnóstico necessário",
        description: "Informe o diagnóstico do problema",
        variant: "destructive"
      });
      return;
    }

    const newMaintenance = {
      id: Date.now().toString(),
      equipmentName: selectedEquipment.name,
      equipmentMB: selectedEquipment.mb,
      type: maintenanceType,
      status: 'pendente',
      startDate: new Date().toISOString(),
      description: diagnosis,
      technician: 'Técnico Atual',
      assignedUser: selectedEquipment.assignedUser,
      stockItems: selectedStockItems
    };

    onSubmit(newMaintenance);
    
    // Reset form
    setSelectedEquipment(null);
    setMaintenanceType('corretiva');
    setDiagnosis('');
    setSelectedStockItems([]);

    toast({
      title: "Manutenção criada",
      description: "Nova manutenção registrada com sucesso"
    });
  };

  const getSelectedStockItemsDetails = () => {
    return selectedStockItems.map(selected => {
      const stockItem = mockStockItems.find(item => item.id === selected.id);
      return { ...stockItem, selectedQuantity: selected.quantity };
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Wrench className="text-primary" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">Nova Manutenção</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Equipment Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipamento *
          </label>
          <div className="flex gap-2">
            <div className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50">
              {selectedEquipment ? (
                <div>
                  <p className="font-medium">{selectedEquipment.name}</p>
                  <p className="text-sm text-gray-600">MB: {selectedEquipment.mb} | {selectedEquipment.model}</p>
                  {selectedEquipment.assignedUser && (
                    <p className="text-sm text-gray-600">Usuário: {selectedEquipment.assignedUser}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Nenhum equipamento selecionado</p>
              )}
            </div>
            <Dialog open={showEquipmentModal} onOpenChange={setShowEquipmentModal}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
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
                      placeholder="Buscar por nome, MB ou modelo..."
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
                          <div>
                            <p className="font-medium">{equipment.name}</p>
                            <p className="text-sm text-gray-600">MB: {equipment.mb}</p>
                            <p className="text-sm text-gray-600">{equipment.model}</p>
                            {equipment.assignedUser && (
                              <p className="text-sm text-gray-600">Usuário: {equipment.assignedUser}</p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            equipment.status === 'ativo' ? 'bg-green-100 text-green-800' :
                            equipment.status === 'inativo' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {equipment.status}
                          </span>
                        </div>
                      </div>
                    ))}
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

        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diagnóstico do Problema *
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={4}
            placeholder="Descreva o problema encontrado ou a manutenção a ser realizada..."
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
        </div>

        {/* Stock Items */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Itens do Estoque (opcional)
            </label>
            <Dialog open={showStockModal} onOpenChange={setShowStockModal}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <Package size={16} />
                  Adicionar Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Selecionar Itens do Estoque</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Buscar itens do estoque..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={stockSearchTerm}
                      onChange={(e) => setStockSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredStockItems.map((item) => (
                      <div key={item.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Disponível: {item.quantity} unidades</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              max={item.quantity}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                              placeholder="Qtd"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const quantity = parseInt((e.target as HTMLInputElement).value);
                                  if (quantity > 0) {
                                    handleStockItemAdd(item, quantity);
                                    (e.target as HTMLInputElement).value = '';
                                  }
                                }
                              }}
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => {
                                const input = document.querySelector(`input[placeholder="Qtd"]`) as HTMLInputElement;
                                const quantity = parseInt(input.value);
                                if (quantity > 0) {
                                  handleStockItemAdd(item, quantity);
                                  input.value = '';
                                }
                              }}
                            >
                              Adicionar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {getSelectedStockItemsDetails().length > 0 && (
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-2">Itens selecionados:</p>
              <div className="space-y-1">
                {getSelectedStockItemsDetails().map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.selectedQuantity}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            <Wrench size={16} />
            Criar Manutenção
          </Button>
        </div>
      </form>
    </div>
  );
};
