
import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'pendente' | 'finalizado';
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  createdDate: string;
  completedDate?: string;
  technician: string;
  category: string;
  logs: string[];
  photos: string[];
  timeToCompletion?: number;
}

interface NewTicketFormProps {
  onSubmit: (ticket: SupportTicket) => void;
}

export const NewTicketForm: React.FC<NewTicketFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'media' as const,
    category: '',
    technician: 'João Silva' // Técnico fixo para uso pessoal
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      status: 'pendente',
      priority: formData.priority,
      createdDate: new Date().toISOString(),
      technician: formData.technician,
      category: formData.category,
      logs: [],
      photos: photos
    };

    onSubmit(newTicket);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'media',
      category: '',
      technician: 'João Silva'
    });
    setPhotos([]);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simular upload de fotos (em produção, fazer upload real)
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Técnico Responsável
            </label>
            <input
              type="text"
              className="w-full input-minimal p-3 border border-gray-300 focus:border-gray-500 focus:ring-gray-500"
              value={formData.technician}
              onChange={(e) => setFormData(prev => ({ ...prev, technician: e.target.value }))}
              placeholder="Nome do técnico"
            />
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fotos (Opcional)
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="btn-minimal bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer flex items-center gap-2">
                <Camera size={16} />
                Adicionar Fotos
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                {photos.length > 0 ? `${photos.length} foto(s) selecionada(s)` : 'Nenhuma foto selecionada'}
              </span>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-24 object-cover rounded-minimal border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
  );
};
