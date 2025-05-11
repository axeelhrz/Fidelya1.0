'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/auth-context';
import { User } from 'firebase/auth';
import { UserData, AuthError } from '@/types/auth';

/**
 * Hook personalizado para acceder al contexto de autenticación
 * Este hook debe ser usado dentro de un componente que esté envuelto por AuthProvider
 * 
 * @returns {Object} El contexto de autenticación con todos los métodos y propiedades
 */
export function useAuth() {
  // Obtener el contexto
  const context = useContext(AuthContext);
  
  // Si el contexto es undefined, significa que el hook se está usando fuera de un AuthProvider
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return {
    // Estado del usuario
    user: context.user,
    userData: context.userData,
    loading: context.loading,
    error: context.error,
    
    // Estado calculado
    isAuthenticated: context.isAuthenticated,
    isEmailVerified: context.isEmailVerified,
    
    // Métodos de autenticación
    signIn: context.signIn,
    signInWithGoogle: context.signInWithGoogle,
    signUp: context.signUp,
    signOut: context.signOut,
    
    // Métodos de gestión de cuenta
    resetPassword: context.resetPassword,
    sendVerificationEmail: context.sendVerificationEmail,
    
    // Métodos de actualización de perfil
    updateProfile: context.updateProfile,
    updateEmail: context.updateEmail,
    updatePassword: context.updatePassword,
    uploadAvatar: context.uploadAvatar,
    updateUserData: context.updateUserData,
    
    // Métodos de suscripción
    activateFreePlan: context.activateFreePlan,
    
    // Utilidades
    clearError: context.clearError,
    
    // Métodos de utilidad para verificar roles y permisos
    hasRole: (role: string): boolean => {
      return context.userData?.role === role;
    },
    
    hasPermission: (permission: string): boolean => {
      if (!context.userData?.permissions) return false;
      return (context.userData.permissions as unknown as Record<string, boolean>)[permission] === true;
    },
    
    // Métodos de utilidad para verificar estado de suscripción
    hasPlan: (planId: string): boolean => {
      return context.userData?.plan === planId;
    },
    
    isPlanActive: (): boolean => {
      return context.userData?.planStatus === 'active';
    },
    
    // Métodos de utilidad para preferencias
    getAppearance: () => context.userData?.appearance,
    getNotificationPreferences: () => context.userData?.notifications,
  };
}

// Exportar tipos para facilitar el uso
export type { User, UserData, AuthError };