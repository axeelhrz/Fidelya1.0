'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/auth-context';
import type { User } from 'firebase/auth';
import type { UserData, AuthError } from '@/components/services/auth.services';

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
    
    // Método de utilidad para verificar si el usuario está autenticado
    isAuthenticated: !!context.user,
    
    // Método de utilidad para verificar si el email está verificado
    isEmailVerified: context.user?.emailVerified ?? false,
  };
}

// Exportar tipos para facilitar el uso
export type { User, UserData, AuthError };