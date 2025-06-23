
import React, { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'technician';
}

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (email: string, password: string) => {
    console.log('Tentativa de login:', { email, password });
    
    // Usuário admin padrão - aceita "admin" tanto no email quanto na senha
    if (email.toLowerCase() === 'admin' && password.toLowerCase() === 'admin') {
      console.log('Login admin detectado');
      const adminUser: User = {
        id: 'admin',
        name: 'Administrador',
        email: 'admin',
        role: 'admin'
      };
      onLogin(adminUser);
      return;
    }

    // Simulação de autenticação - em produção seria uma API
    const mockUser: User = {
      id: '1',
      name: 'Usuário Teste',
      email: email,
      role: 'user'
    };
    onLogin(mockUser);
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // Simulação de registro - em produção seria uma API
    const newUser: User = {
      id: Date.now().toString(),
      name: name,
      email: email,
      role: 'user'
    };
    onLogin(newUser);
  };

  return (
    <>
      {isLogin ? (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setIsLogin(false)}
        />
      ) : (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </>
  );
};
