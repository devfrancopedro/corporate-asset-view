
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Equipamentos } from "./components/Equipamentos";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/equipamentos" element={
            <Layout>
              <Equipamentos />
            </Layout>
          } />
          <Route path="/usuarios" element={
            <Layout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
                <p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento</p>
              </div>
            </Layout>
          } />
          <Route path="/movimentacoes" element={
            <Layout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900">Movimentações</h1>
                <p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento</p>
              </div>
            </Layout>
          } />
          <Route path="/manutencoes" element={
            <Layout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900">Manutenções</h1>
                <p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento</p>
              </div>
            </Layout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
