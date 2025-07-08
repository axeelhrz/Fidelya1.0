'use client';

import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { authService, LoginCredentials, RegisterData, AuthResponse } from '@/services/auth.service';
import { UserData } from '@/types/auth';
import { logAuthError } from '@/lib/firebase-errors';

interface AuthState {
  user: UserData | null;
  firebaseUser: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  signIn: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updatePassword: (newPassword: string) => Promise<AuthResponse>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuth = (): AuthState & AuthActions => {
  const [state, setState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    loading: true,
    error: null,
    isAuthenticated: false
  });

  // Initialize auth state listener
  useEffect(() => {
    console.log('🔐 Initializing auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        console.log('🔐 Auth state changed:', firebaseUser ? 'User signed in' : 'User signed out');
        
        if (firebaseUser) {
          // User is signed in
          console.log('🔐 Fetching user data for UID:', firebaseUser.uid);
          const userData = await authService.getUserData(firebaseUser.uid);
          
          if (userData) {
            console.log('🔐 User data loaded successfully:', userData.nombre);
            setState(prev => ({
              ...prev,
              user: userData,
              firebaseUser,
              loading: false,
              isAuthenticated: true,
              error: null
            }));
          } else {
            console.warn('🔐 User data not found in Firestore');
            setState(prev => ({
              ...prev,
              user: null,
              firebaseUser,
              loading: false,
              isAuthenticated: false,
              error: 'Datos de usuario no encontrados'
            }));
          }
        } else {
          // User is signed out
          console.log('🔐 User signed out, clearing state');
          setState(prev => ({
            ...prev,
            user: null,
            firebaseUser: null,
            loading: false,
            isAuthenticated: false,
            error: null
          }));
        }
      } catch (error) {
        logAuthError(error, 'Auth State Change');
        setState(prev => ({
          ...prev,
          user: null,
          firebaseUser: null,
          loading: false,
          isAuthenticated: false,
          error: 'Error al cargar los datos del usuario'
        }));
      }
    });

    return () => {
      console.log('🔐 Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  // Sign in
  const signIn = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('🔐 useAuth: Sign in attempt');
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authService.signIn(credentials);
      
      if (!response.success) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: response.error || 'Error al iniciar sesión' 
        }));
      } else {
        // Success state will be handled by onAuthStateChanged
        setState(prev => ({ ...prev, loading: false, error: null }));
      }
      
      return response;
    } catch (error) {
      logAuthError(error, 'useAuth Sign In');
      const errorMessage = 'Error inesperado al iniciar sesión';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Register
  const register = useCallback(async (data: RegisterData): Promise<AuthResponse> => {
    console.log('🔐 useAuth: Registration attempt');
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authService.register(data);
      
      if (!response.success) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: response.error || 'Error al registrar usuario' 
        }));
      } else {
        // Success state will be handled by onAuthStateChanged
        setState(prev => ({ ...prev, loading: false, error: null }));
      }
      
      return response;
    } catch (error) {
      logAuthError(error, 'useAuth Register');
      const errorMessage = 'Error inesperado al registrar usuario';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Sign out
  const signOut = useCallback(async (): Promise<void> => {
    console.log('🔐 useAuth: Sign out attempt');
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await authService.signOut();
      // State will be updated by onAuthStateChanged
    } catch (error) {
      logAuthError(error, 'useAuth Sign Out');
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error al cerrar sesión' 
      }));
      throw error;
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (email: string): Promise<AuthResponse> => {
    console.log('🔐 useAuth: Password reset attempt');
    setState(prev => ({ ...prev, error: null }));
    
    try {
      const response = await authService.resetPassword(email);
      
      if (!response.success) {
        setState(prev => ({ 
          ...prev, 
          error: response.error || 'Error al enviar email de recuperación' 
        }));
      }
      
      return response;
    } catch (error) {
      logAuthError(error, 'useAuth Reset Password');
      const errorMessage = 'Error inesperado al enviar email de recuperación';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Update password
  const updatePassword = useCallback(async (newPassword: string): Promise<AuthResponse> => {
    console.log('🔐 useAuth: Password update attempt');
    setState(prev => ({ ...prev, error: null }));
    
    try {
      const response = await authService.updateUserPassword(newPassword);
      
      if (!response.success) {
        setState(prev => ({ 
          ...prev, 
          error: response.error || 'Error al actualizar contraseña' 
        }));
      }
      
      return response;
    } catch (error) {
      logAuthError(error, 'useAuth Update Password');
      const errorMessage = 'Error inesperado al actualizar contraseña';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Clear error
  const clearError = useCallback((): void => {
    console.log('🔐 useAuth: Clearing error');
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async (): Promise<void> => {
    if (state.firebaseUser) {
      try {
        console.log('🔐 useAuth: Refreshing user data');
        const userData = await authService.getUserData(state.firebaseUser.uid);
        setState(prev => ({
          ...prev,
          user: userData,
          isAuthenticated: !!userData
        }));
      } catch (error) {
        logAuthError(error, 'useAuth Refresh User');
      }
    }
  }, [state.firebaseUser]);

  return {
    ...state,
    signIn,
    register,
    signOut,
    resetPassword,
    updatePassword,
    clearError,
    refreshUser
  };
};