
import React, { useState } from 'react';
import { X, Download, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';

interface Equipment {
  id: string;
  filial: string;
  nomeMaquina: string;
  macAddress: string;
  processadorCPU: string;
  memoriaRAM: string;
  armazenamento: string;
  isCaixa: boolean;
  pdc?: string;
  status: string;
  location: string;
  assignedUser?: string;
}

interface ReportModalProps {
  onClose: () => void;
  equipments: Equipment[];
}

const COLORS = ['#022f40', '#690500', '#4a90e2', '#f39c12', '#e74c3c'];

export const ReportModal: React.FC<ReportModalProps> = ({ onClose, equipments }) => {
  const [selectedFilial, setSelectedFilial] = useState<string>('');
  const [showCharts, setShowCharts] = useState(false);

  // Obter todas as filiais únicas
  const filiais = Array.from(new Set(equipments.map(eq => eq.filial))).sort();

  // Filtrar equipamentos por filial selecionada
  const filteredEquipments = selectedFilial 
    ? equipments.filter(eq => eq.filial === selectedFilial)
    : [];

  // Separar caixas dos demais
  const caixas = filteredEquipments.filter(eq => eq.isCaixa);
  const outros = filteredEquipments.filter(eq => !eq.isCaixa);

  // Dados para gráficos
  const chartData = [
    { name: 'Caixas', value: caixas.length },
    { name: 'Outros', value: outros.length }
  ];

  const statusData = Object.entries(
    filteredEquipments.reduce((acc, eq) => {
      acc[eq.status] = (acc[eq.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({ status, count }));

  const generateExcelReport = () => {
    if (!selectedFilial) return;

    // Criar dados para Excel
    const excelData = [
      // Cabeçalho
      [`RELATÓRIO DE EQUIPAMENTOS - ${selectedFilial}`],
      [`Data: ${new Date().toLocaleDateString('pt-BR')}`],
      [],
      // Resumo
      ['RESUMO'],
      ['Total de Equipamentos', filteredEquipments.length],
      ['Caixas', caixas.length],
      ['Outros Equipamentos', outros.length],
      [],
    ];

    // Adicionar seção de caixas
    if (caixas.length > 0) {
      excelData.push(['CAIXAS']);
      excelData.push(['Nome', 'MAC', 'CPU', 'RAM', 'Armazenamento', 'Status', 'Localização', 'Usuário', 'PDC']);
      
      caixas.forEach(eq => {
        excelData.push([
          eq.nomeMaquina,
          eq.macAddress,
          eq.processadorCPU,
          eq.memoriaRAM,
          eq.armazenamento,
          eq.status,
          eq.location,
          eq.assignedUser || '',
          eq.pdc || ''
        ]);
      });
      
      excelData.push([]);
    }

    // Adicionar seção de outros equipamentos
    if (outros.length > 0) {
      excelData.push(['OUTROS EQUIPAMENTOS']);
      excelData.push(['Nome', 'MAC', 'CPU', 'RAM', 'Armazenamento', 'Status', 'Localização', 'Usuário']);
      
      outros.forEach(eq => {
        excelData.push([
          eq.nomeMaquina,
          eq.macAddress,
          eq.processadorCPU,
          eq.memoriaRAM,
          eq.armazenamento,
          eq.status,
          eq.location,
          eq.assignedUser || ''
        ]);
      });
    }

    // Criar workbook
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');

    // Fazer download
    XLSX.writeFile(wb, `relatorio-${selectedFilial}-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const generateReport = () => {
    if (!selectedFilial) return;

    let reportContent = `RELATÓRIO DE EQUIPAMENTOS - ${selectedFilial}\n`;
    reportContent += `Data: ${new Date().toLocaleDateString('pt-BR')}\n\n`;

    if (caixas.length > 0) {
      reportContent += `=== CAIXAS (${caixas.length}) ===\n\n`;
      caixas.forEach((eq, index) => {
        reportContent += `${index + 1}. ${eq.nomeMaquina}\n`;
        reportContent += `   MAC: ${eq.macAddress}\n`;
        reportContent += `   CPU: ${eq.processadorCPU}\n`;
        reportContent += `   RAM: ${eq.memoriaRAM}\n`;
        reportContent += `   Armazenamento: ${eq.armazenamento}\n`;
        reportContent += `   Status: ${eq.status}\n`;
        reportContent += `   Localização: ${eq.location}\n`;
        if (eq.assignedUser) reportContent += `   Usuário: ${eq.assignedUser}\n`;
        if (eq.pdc) reportContent += `   PDC: ${eq.pdc}\n`;
        reportContent += `\n`;
      });
    }

    if (outros.length > 0) {
      reportContent += `=== OUTROS EQUIPAMENTOS (${outros.length}) ===\n\n`;
      outros.forEach((eq, index) => {
        reportContent += `${index + 1}. ${eq.nomeMaquina}\n`;
        reportContent += `   MAC: ${eq.macAddress}\n`;
        reportContent += `   CPU: ${eq.processadorCPU}\n`;
        reportContent += `   RAM: ${eq.memoriaRAM}\n`;
        reportContent += `   Armazenamento: ${eq.armazenamento}\n`;
        reportContent += `   Status: ${eq.status}\n`;
        reportContent += `   Localização: ${eq.location}\n`;
        if (eq.assignedUser) reportContent += `   Usuário: ${eq.assignedUser}\n`;
        reportContent += `\n`;
      });
    }

    reportContent += `\nTOTAL DE EQUIPAMENTOS: ${filteredEquipments.length}\n`;
    reportContent += `CAIXAS: ${caixas.length}\n`;
    reportContent += `OUTROS: ${outros.length}\n`;

    // Criar arquivo para download
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${selectedFilial}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Gerar Relatório</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Filial
              </label>
              <select
                value={selectedFilial}
                onChange={(e) => setSelectedFilial(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Selecione uma filial</option>
                {filiais.map(filial => (
                  <option key={filial} value={filial}>{filial}</option>
                ))}
              </select>
            </div>
            
            {selectedFilial && (
              <div className="flex items-end">
                <button
                  onClick={() => setShowCharts(!showCharts)}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2"
                >
                  <BarChart3 size={16} />
                  {showCharts ? 'Ocultar' : 'Mostrar'} Gráficos
                </button>
              </div>
            )}
          </div>

          {selectedFilial && showCharts && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Distribuição por Tipo</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Equipamentos por Status</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#022f40" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {selectedFilial && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">Preview do Relatório - {selectedFilial}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-accent mb-2">Caixas ({caixas.length})</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {caixas.length > 0 ? (
                      caixas.map(eq => (
                        <div key={eq.id} className="p-2 bg-red-50 rounded border text-sm">
                          <div className="font-medium">{eq.nomeMaquina}</div>
                          <div className="text-gray-600">MAC: {eq.macAddress}</div>
                          <div className="text-gray-600">Status: {eq.status}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">Nenhum caixa encontrado</div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-primary mb-2">Outros Equipamentos ({outros.length})</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {outros.length > 0 ? (
                      outros.map(eq => (
                        <div key={eq.id} className="p-2 bg-blue-50 rounded border text-sm">
                          <div className="font-medium">{eq.nomeMaquina}</div>
                          <div className="text-gray-600">MAC: {eq.macAddress}</div>
                          <div className="text-gray-600">Status: {eq.status}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">Nenhum outro equipamento encontrado</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded border">
                <div className="text-sm text-gray-600">
                  Total: {filteredEquipments.length} equipamentos | 
                  Caixas: {caixas.length} | 
                  Outros: {outros.length}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={generateReport}
            disabled={!selectedFilial}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            Baixar TXT
          </button>
          <button
            onClick={generateExcelReport}
            disabled={!selectedFilial}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            Baixar Excel
          </button>
        </div>
      </div>
    </div>
  );
};
