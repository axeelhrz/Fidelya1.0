'use client';

import { useEffect, useState } from 'react';
import type { User, UserProfile } from '@/types/database';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // TODO: Implementar autenticación con Firebase
    // Por ahora, simular estado no autenticado
    setState({
      user: null,
      profile: null,
      loading: false,
      error: null
    });
  }, []);

  // Función para hacer login
  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // TODO: Implementar login con Firebase
      console.log('Login attempt:', email);
      
      // Simulación temporal
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, error: 'Firebase no implementado aún' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  };

  // Función para registrarse
  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // TODO: Implementar registro con Firebase
      console.log('Signup attempt:', email, fullName);
      
      // Simulación temporal
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, error: 'Firebase no implementado aún' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  };

  // Función para hacer logout
  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      // TODO: Implementar logout con Firebase
      setState({
        user: null,
        profile: null,
        loading: false,
        error: null
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!state.user) return { success: false, error: 'No hay usuario autenticado' };

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // TODO: Implementar actualización de perfil con Firebase
      console.log('Profile update:', updates);
      
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, error: 'Firebase no implementado aún' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!state.user,
    isAdmin: state.profile?.role === 'admin' || state.profile?.role === 'super_admin',
    isSuperAdmin: state.profile?.role === 'super_admin'
  };
}