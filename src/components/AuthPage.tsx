
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus, Monitor, Shield, Users } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao sistema de controle de ativos de TI.",
        });
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu email para confirmar a conta.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
            <Monitor className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sistema de Controle de Ativos de TI
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? 'Faça login em sua conta' : 'Crie sua conta'}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required={!isLogin}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Endereço de email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isLogin ? (
                    <LogIn className="h-5 w-5 text-primary-foreground group-hover:text-white" />
                  ) : (
                    <UserPlus className="h-5 w-5 text-primary-foreground group-hover:text-white" />
                  )}
                </span>
                {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin
                  ? 'Não tem uma conta? Cadastre-se'
                  : 'Já tem uma conta? Faça login'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recursos do Sistema</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <Monitor className="h-5 w-5 text-primary mr-3" />
              <span className="text-sm text-gray-600">Controle de equipamentos</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-primary mr-3" />
              <span className="text-sm text-gray-600">Gerenciamento de usuários</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-primary mr-3" />
              <span className="text-sm text-gray-600">Suporte personalizado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
