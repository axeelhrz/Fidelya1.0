'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'therapist';
  centerId: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          // Establecer cookie para el middleware
          document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=86400`; // 24 horas
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        // Eliminar cookie corrupta
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simular delay de autenticación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validar credenciales
      if (email === 'admin' && password === 'admin123') {
        const userData: User = {
          id: 'admin1',
          email: 'admin@centropsicologico.com',
          role: 'admin',
          centerId: 'center1',
          name: 'Dr. Carlos Mendoza'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Establecer cookie para el middleware
        document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=86400`; // 24 horas
        
        // Redirigir según el rol
        setTimeout(() => {
          if (userData.role === 'admin') {
            router.push('/dashboard/ceo');
          } else {
            router.push('/dashboard/sessions');
          }
        }, 100);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    
    // Eliminar cookie
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}