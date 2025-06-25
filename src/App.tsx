
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Equipamentos } from "./components/Equipamentos";
import { MovementDashboard } from "./components/MovementDashboard";
import { Manutencoes } from "./components/Manutencoes";
import { SupportTickets } from "./components/SupportTickets";
import { UserDashboard } from "./components/UserDashboard";
import { Auth } from "./components/Auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'technician';
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Auth onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <Layout>
                {user.role === 'admin' ? <Dashboard /> : <UserDashboard user={user} />}
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
                <MovementDashboard />
              </Layout>
            } />
            <Route path="/manutencoes" element={
              <Layout>
                <Manutencoes />
              </Layout>
            } />
            <Route path="/suporte" element={
              <Layout>
                <SupportTickets />
              </Layout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
