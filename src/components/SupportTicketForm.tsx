
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';

interface SupportTicketFormProps {
  onTicketCreated?: () => void;
}

export const SupportTicketForm: React.FC<SupportTicketFormProps> = ({ onTicketCreated }) => {
  const { createSupportTicket } = useSupabaseData();
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'media' as const,
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      await createSupportTicket({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'media',
        category: '',
      });
      setShowForm(false);
      onTicketCreated?.();
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowForm(!showForm)}
        className="btn-minimal bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
      >
        <Plus size={16} />
        {showForm ? 'Cancelar' : 'Novo Chamado'}
      </button>

      {showForm && (
        <div className="card-minimal p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Chamado de Suporte</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Chamado *
                </label>
                <input
                  type="text"
                  className="w-full input-minimal p-3 border border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Descreva brevemente o problema"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  className="w-full input-minimal p-3 border border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Rede">Rede</option>
                  <option value="Email">Email</option>
                  <option value="Impressora">Impressora</option>
                  <option value="Sistema Operacional">Sistema Operacional</option>
                  <option value="Segurança">Segurança</option>
                  <option value="Backup">Backup</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade
                </label>
                <select
                  className="w-full input-minimal p-3 border border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
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
                Descrição Detalhada *
              </label>
              <textarea
                className="w-full input-minimal p-3 border border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o problema em detalhes, incluindo quando ocorreu, frequência, mensagens de erro, etc."
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="btn-minimal bg-primary text-white hover:bg-primary/90"
              >
                Criar Chamado
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
