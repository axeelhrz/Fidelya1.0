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
  logout: () => Promise<void>;
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
          document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=86400; SameSite=Lax`;
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        // Eliminar cookie corrupta con múltiples métodos
        clearAllCookies();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función para limpiar todas las cookies relacionadas
  const clearAllCookies = () => {
    // Múltiples formas de eliminar la cookie para asegurar que se borre
    const cookieFormats = [
      'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT',
      'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax',
      'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict',
      'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure',
      'user=; path=/; max-age=0',
      'user=; path=/; max-age=0; SameSite=Lax',
      'user=; expires=Thu, 01 Jan 1970 00:00:01 GMT',
      'user=; max-age=0'
    ];

    cookieFormats.forEach(format => {
      document.cookie = format;
    });
  };

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
        document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=86400; SameSite=Lax`;
        
        // La redirección se maneja en el componente de login
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🔄 Iniciando proceso de logout...');
      
      // 1. Limpiar el estado del usuario inmediatamente
      setUser(null);
      console.log('✅ Estado de usuario limpiado');
      
      // 2. Limpiar localStorage
      localStorage.removeItem('user');
      console.log('✅ LocalStorage limpiado');
      
      // 3. Limpiar todas las cookies de forma agresiva
      clearAllCookies();
      console.log('✅ Cookies eliminadas');
      
      // 4. Verificar que las cookies se eliminaron
      const remainingCookies = document.cookie;
      console.log('🍪 Cookies restantes:', remainingCookies);
      
      // 5. Forzar recarga de la página para limpiar cualquier estado residual
      console.log('🔄 Redirigiendo a login...');
      
      // Usar replace en lugar de push para evitar que el usuario pueda volver atrás
      await router.replace('/login');
      
      // 6. Como medida adicional, recargar la página después de un breve delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
      
      console.log('✅ Logout completado');
    } catch (error) {
      console.error('❌ Error durante logout:', error);
      // En caso de error, forzar redirección directa
      window.location.href = '/login';
    }
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