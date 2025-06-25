
import React, { useState } from 'react';
import { X, Clock, CheckCircle, Camera } from 'lucide-react';
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

interface EditTicketModalProps {
  ticket: SupportTicket;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (ticketId: string, updates: Partial<SupportTicket>) => void;
}

export const EditTicketModal: React.FC<EditTicketModalProps> = ({ 
  ticket, 
  isOpen, 
  onClose, 
  onUpdate 
}) => {
  const [status, setStatus] = useState(ticket.status);
  const [newLog, setNewLog] = useState('');
  const [logs, setLogs] = useState(ticket.logs);
  const [photos, setPhotos] = useState(ticket.photos);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSave = () => {
    const updates: Partial<SupportTicket> = {
      status,
      logs,
      photos,
    };

    if (status === 'finalizado' && !ticket.completedDate) {
      updates.completedDate = new Date().toISOString();
      const created = new Date(ticket.createdDate);
      const completed = new Date();
      updates.timeToCompletion = (completed.getTime() - created.getTime()) / (1000 * 60 * 60);
    }

    onUpdate(ticket.id, updates);
    onClose();
    
    toast({
      title: "Chamado atualizado",
      description: "As alterações foram salvas com sucesso",
    });
  };

  const addLog = () => {
    if (newLog.trim()) {
      setLogs([...logs, newLog.trim()]);
      setNewLog('');
    }
  };

  const removeLog = (index: number) => {
    setLogs(logs.filter((_, i) => i !== index));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-minimal w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Editar Chamado</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-minimal text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <p className="text-sm text-gray-900 p-3 bg-gray-50 rounded-minimal">{ticket.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <p className="text-sm text-gray-900 p-3 bg-gray-50 rounded-minimal">{ticket.category}</p>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setStatus('pendente')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-minimal border transition-colors ${
                    status === 'pendente' 
                      ? 'bg-yellow-50 border-yellow-300 text-yellow-800' 
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Clock size={16} />
                  <span className="text-sm font-medium">Pendente</span>
                </button>
                <button
                  onClick={() => setStatus('finalizado')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-minimal border transition-colors ${
                    status === 'finalizado' 
                      ? 'bg-green-50 border-green-300 text-green-800' 
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">Finalizado</span>
                </button>
              </div>
            </div>

            {/* Logs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logs de Atividade</label>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newLog}
                    onChange={(e) => setNewLog(e.target.value)}
                    placeholder="Adicionar nova atividade..."
                    className="flex-1 input-minimal p-3 border border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    onKeyPress={(e) => e.key === 'Enter' && addLog()}
                  />
                  <button
                    onClick={addLog}
                    className="btn-minimal bg-primary text-white hover:bg-primary/90 px-4 py-3 whitespace-nowrap"
                  >
                    Adicionar
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-minimal">
                      <span className="text-sm text-gray-900 flex-1">{log}</span>
                      <button
                        onClick={() => removeLog(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fotos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
              <div className="space-y-3">
                <label className="btn-minimal bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer inline-flex items-center gap-2">
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
                
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-20 sm:h-24 object-cover rounded-minimal border border-gray-300"
                        />
                        <button
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

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleSave}
                className="btn-minimal bg-primary text-white hover:bg-primary/90 flex-1 sm:flex-none"
              >
                Salvar Alterações
              </button>
              <button
                onClick={onClose}
                className="btn-minimal bg-gray-200 text-gray-700 hover:bg-gray-300 flex-1 sm:flex-none"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
