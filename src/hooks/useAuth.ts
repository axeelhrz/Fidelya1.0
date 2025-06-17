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
    try {
      // TODO: Implementar autenticación con Supabase
      // Por ahora, simular estado no autenticado
      setState({
        user: null,
        profile: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      setState({
        user: null,
        profile: null,
        loading: false,
        error: 'Error initializing authentication'
      });
    }
  }, []);

  // Función para hacer login
  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // TODO: Implementar login con Supabase
      console.log('Login attempt:', email);
      
      // Simulación temporal - simular éxito para testing
      const mockUser: User = {
        id: '1',
        email: email,
        fullName: 'Usuario de Prueba',
        phone: '+56 9 1234 5678',
        role: 'user',
        isActive: true,
        loginCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const mockProfile: UserProfile = {
        id: '1',
        email: email,
        fullName: 'Usuario de Prueba',
        phone: '+56 9 1234 5678',
        role: 'user',
        isActive: true,
        lastLogin: new Date().toISOString(),
        loginCount: 1,
        students: []
      };

      setState({
        user: mockUser,
        profile: mockProfile,
        loading: false,
        error: null
      });

      return { success: true, data: { user: mockUser as any, profile: mockProfile as any } };
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
      // TODO: Implementar registro con Supabase
      console.log('Signup attempt:', email, fullName);
      
      // Simulación temporal - simular éxito para testing
      const mockUser: User = {
        id: '2',
        email: email,
        fullName: fullName,
        phone: phone,
        role: 'user',
        isActive: true,
        loginCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const mockProfile: UserProfile = {
        id: '2',
        email: email,
        fullName: fullName,
        phone: phone || '',
        role: 'user',
        isActive: true,
        lastLogin: null,
        loginCount: 0,
        students: []
      };

      setState({
        user: mockUser,
        profile: mockProfile,
        loading: false,
        error: null
      });

      return { success: true, data: { user: mockUser as any, profile: mockProfile as any } };
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
      // TODO: Implementar logout con Supabase
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
      // TODO: Implementar actualización de perfil con Supabase
      console.log('Profile update:', updates);
      
      // Simulación temporal
      const updatedProfile = state.profile ? { ...state.profile, ...updates } : null;
      
      setState(prev => ({ 
        ...prev, 
        profile: updatedProfile,
        loading: false 
      }));
      
      return { success: true, data: updatedProfile };
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