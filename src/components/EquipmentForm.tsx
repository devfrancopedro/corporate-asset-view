
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const equipmentSchema = z.object({
  filial: z.string().min(1, 'Número da filial é obrigatório'),
  nomeMaquina: z.string().min(1, 'Nome da máquina é obrigatório'),
  macAddress: z.string().min(1, 'MAC da máquina é obrigatório'),
  processadorCPU: z.string().min(1, 'Processador CPU é obrigatório'),
  memoriaRAM: z.string().min(1, 'Memória RAM é obrigatória'),
  armazenamento: z.string().min(1, 'SSD ou HD é obrigatório'),
  isCaixa: z.boolean(),
  pdc: z.string().optional(),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

interface EquipmentFormProps {
  onClose: () => void;
  onSubmit: (data: EquipmentFormData) => void;
}

export const EquipmentForm: React.FC<EquipmentFormProps> = ({ onClose, onSubmit }) => {
  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      filial: 'MB',
      nomeMaquina: '',
      macAddress: '',
      processadorCPU: '',
      memoriaRAM: '',
      armazenamento: '',
      isCaixa: false,
      pdc: '',
    },
  });

  const isCaixa = form.watch('isCaixa');

  const handleSubmit = (data: EquipmentFormData) => {
    // Garantir que o número da filial sempre comece com MB
    const formattedData = {
      ...data,
      filial: data.filial.startsWith('MB') ? data.filial : `MB${data.filial}`,
    };
    onSubmit(formattedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Adicionar Equipamento</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="filial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Filial</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MB001"
                        {...field}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (!value.startsWith('MB')) {
                            value = `MB${value.replace('MB', '')}`;
                          }
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nomeMaquina"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Máquina</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Desktop-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="macAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MAC da Máquina</FormLabel>
                    <FormControl>
                      <Input placeholder="00:11:22:33:44:55" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="processadorCPU"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processador CPU</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Intel Core i5-12400" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="memoriaRAM"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Memória RAM</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 8GB DDR4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="armazenamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SSD ou HD</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: SSD 256GB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isCaixa"
                checked={isCaixa}
                onChange={(e) => form.setValue('isCaixa', e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="isCaixa" className="text-sm font-medium text-gray-700">
                É um caixa?
              </label>
            </div>

            {isCaixa && (
              <FormField
                control={form.control}
                name="pdc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PDC</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Informações do PDC..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Adicionar Equipamento
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
