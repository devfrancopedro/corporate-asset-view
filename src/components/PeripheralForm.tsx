
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const peripheralSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
  type: z.enum(['ssd', 'hd', 'memoria_ram', 'teclado', 'mouse', 'monitor', 'outro']),
  location: z.string().min(1, 'Localização é obrigatória'),
});

type PeripheralFormData = z.infer<typeof peripheralSchema>;

interface PeripheralFormProps {
  onClose: () => void;
  onSubmit: (data: PeripheralFormData) => void;
}

export const PeripheralForm: React.FC<PeripheralFormProps> = ({ onClose, onSubmit }) => {
  const form = useForm<PeripheralFormData>({
    resolver: zodResolver(peripheralSchema),
    defaultValues: {
      name: '',
      brand: '',
      quantity: 1,
      type: 'outro',
      location: 'Estoque TI',
    },
  });

  const handleSubmit = (data: PeripheralFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Adicionar Periférico</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Periférico</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: SSD 256GB" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Husky" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      placeholder="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ssd">SSD</SelectItem>
                      <SelectItem value="hd">HD</SelectItem>
                      <SelectItem value="memoria_ram">Memória RAM</SelectItem>
                      <SelectItem value="teclado">Teclado</SelectItem>
                      <SelectItem value="mouse">Mouse</SelectItem>
                      <SelectItem value="monitor">Monitor</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Estoque TI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                Adicionar Periférico
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
