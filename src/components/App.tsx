
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AuthPage } from "@/components/AuthPage";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { Equipamentos } from "@/components/Equipamentos";
import { MovementDashboard } from "@/components/MovementDashboard";
import { Manutencoes } from "@/components/Manutencoes";
import { SupportTickets } from "@/components/SupportTickets";
import { UserDashboard } from "@/components/UserDashboard";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Check if current user is admin
  const isAdmin = user.email === 'admin@admin.com';

  return (
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
        {/* Admin-only route */}
        {isAdmin && (
          <Route path="/usuarios" element={
            <Layout>
              <UserDashboard user={user} />
            </Layout>
          } />
        )}
        {/* Non-admin users trying to access users page */}
        {!isAdmin && (
          <Route path="/usuarios" element={
            <Layout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
                <p className="text-gray-600 mt-2">Você não tem permissão para acessar esta página</p>
              </div>
            </Layout>
          } />
        )}
        <Route path="/estoque" element={
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
        <Route path="*" element={
          <Layout>
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold text-gray-900">404</h1>
              <p className="text-gray-600 mt-2">Página não encontrada</p>
            </div>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
