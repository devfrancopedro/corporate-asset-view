
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session:', session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Handle admin login with simplified email
      const loginEmail = email === 'admin' ? 'admin@admin.com' : email;
      
      console.log('Attempting login with:', loginEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });
      
      if (error) {
        console.error('Login error:', error.message);
        // Se erro de usuário não encontrado para admin, criar automaticamente
        if (error.message.includes('Invalid login credentials') && email === 'admin') {
          console.log('Admin user not found, creating...');
          const { error: signUpError } = await supabase.auth.signUp({
            email: 'admin@admin.com',
            password,
            options: {
              data: {
                full_name: 'Administrador',
              },
              emailRedirectTo: `${window.location.origin}/`,
            },
          });
          
          if (signUpError) {
            console.error('Admin signup error:', signUpError.message);
            return { error: signUpError };
          }
          
          // Tentar fazer login novamente após criar o usuário
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: 'admin@admin.com',
            password,
          });
          
          if (loginError) {
            console.error('Admin login after signup error:', loginError.message);
            return { error: loginError };
          }
          
          console.log('Admin created and logged in successfully:', loginData.user?.email);
          return { error: null };
        }
      } else {
        console.log('Login successful:', data.user?.email);
      }
      
      return { error };
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        console.error('Signup error:', error.message);
      } else {
        console.log('Signup successful:', data.user?.email);
      }
      
      return { error };
    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Signout error:', error.message);
        throw error;
      } else {
        console.log('Signout successful');
        // Force page reload to ensure clean state
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Unexpected signout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
