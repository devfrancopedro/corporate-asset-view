
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import type { Maintenance } from '@/hooks/useSupabaseData';

interface EditMaintenanceModalProps {
  maintenance: Maintenance;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditMaintenanceModal: React.FC<EditMaintenanceModalProps> = ({
  maintenance,
  onClose,
  onUpdate
}) => {
  const { updateMaintenance } = useSupabaseData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    status: maintenance.status || 'pendente',
    priority: maintenance.priority || 'media',
    title: maintenance.title,
    description: maintenance.description || '',
    notes: maintenance.notes || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateMaintenance(maintenance.id, {
        status: formData.status,
        priority: formData.priority,
        title: formData.title,
        description: formData.description,
        notes: formData.notes
      });
      
      toast({
        title: "Manutenção atualizada",
        description: "As alterações foram salvas com sucesso",
      });
      
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar manutenção:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Editar Manutenção
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full input-minimal p-3 border border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluida">Concluída</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                className="w-full input-minimal p-3 border border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              className="w-full input-minimal p-3 border border-gray-300 focus:border-gray-500 focus:ring-gray-500"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              className="w-full input-minimal p-3 border border-gray-300 focus:border-gray-500 focus:ring-gray-500"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              className="w-full input-minimal p-3 border border-gray-300 focus:border-gray-500 focus:ring-gray-500"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações adicionais sobre a manutenção..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none btn-minimal bg-primary text-white hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none btn-minimal border border-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
