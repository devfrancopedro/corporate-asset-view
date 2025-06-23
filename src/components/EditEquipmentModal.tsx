
import React, { useState } from 'react';
import { X, Monitor } from 'lucide-react';

interface Equipment {
  id: string;
  filial: string;
  nomeMaquina: string;
  macAddress: string;
  processadorCPU: string;
  memoriaRAM: string;
  armazenamento: string;
  sistemaOperacional: string;
  isCaixa: boolean;
  pdc?: string;
  status: 'Ativo' | 'Em Manutenção' | 'Desativado' | 'Em Estoque';
  location: string;
  assignedUser?: string;
  acquisitionDate: string;
}

interface EditEquipmentModalProps {
  equipment: Equipment;
  onClose: () => void;
  onSave: (equipment: Equipment) => void;
}

export const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({ 
  equipment, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState<Equipment>(equipment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Monitor size={24} />
            Editar Equipamento
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filial
              </label>
              <input
                type="text"
                name="filial"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.filial}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Máquina
              </label>
              <input
                type="text"
                name="nomeMaquina"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.nomeMaquina}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MAC Address
              </label>
              <input
                type="text"
                name="macAddress"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.macAddress}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Processador/CPU
              </label>
              <input
                type="text"
                name="processadorCPU"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.processadorCPU}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Memória RAM
              </label>
              <input
                type="text"
                name="memoriaRAM"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.memoriaRAM}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Armazenamento
              </label>
              <input
                type="text"
                name="armazenamento"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.armazenamento}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sistema Operacional
              </label>
              <input
                type="text"
                name="sistemaOperacional"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.sistemaOperacional}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Ativo">Ativo</option>
                <option value="Em Manutenção">Em Manutenção</option>
                <option value="Desativado">Desativado</option>
                <option value="Em Estoque">Em Estoque</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localização
              </label>
              <input
                type="text"
                name="location"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuário Atribuído
              </label>
              <input
                type="text"
                name="assignedUser"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.assignedUser || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isCaixa"
              id="isCaixa"
              className="rounded border-gray-300 text-primary focus:ring-primary"
              checked={formData.isCaixa}
              onChange={handleChange}
            />
            <label htmlFor="isCaixa" className="text-sm font-medium text-gray-700">
              É um equipamento de caixa
            </label>
          </div>

          {formData.isCaixa && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Configuração PDC
              </label>
              <textarea
                name="pdc"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.pdc || ''}
                onChange={handleChange}
                placeholder="Descreva as configurações específicas do PDC..."
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
