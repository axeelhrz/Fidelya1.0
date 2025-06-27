'use client';

import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseInitialized, waitForFirebase } from '@/lib/firebase';
import { authService, LoginCredentials, RegisterData, AuthResponse } from '@/services/auth.service';
import { UserData } from '@/types/auth';

interface AuthState {
  user: UserData | null;
  firebaseUser: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isFirebaseReady: boolean;
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
    isAuthenticated: false,
    isFirebaseReady: isFirebaseInitialized
  });

  // Wait for Firebase initialization
  useEffect(() => {
    const initializeAuth = async () => {
      if (!isFirebaseInitialized) {
        const isReady = await waitForFirebase();
        setState(prev => ({ 
          ...prev, 
          isFirebaseReady: isReady,
          loading: !isReady,
          error: !isReady ? 'Firebase no está configurado correctamente' : null
        }));
        
        if (!isReady) {
          return;
        }
      }

      // Initialize auth state listener only if Firebase is ready
      if (isFirebaseInitialized && auth) {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          try {
            if (firebaseUser) {
              // User is signed in
              const userData = await authService.getUserData(firebaseUser.uid);
              
              setState(prev => ({
                ...prev,
                user: userData,
                firebaseUser,
                loading: false,
                isAuthenticated: !!userData,
                error: null
              }));
            } else {
              // User is signed out
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
            console.error('Error in auth state change:', error);
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

        return () => unsubscribe();
      } else {
        // Firebase not initialized, set loading to false
        setState(prev => ({ 
          ...prev, 
          loading: false,
          error: 'Firebase no está disponible'
        }));
      }
    };

    initializeAuth();
  }, []);

  // Sign in
  const signIn = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (!isFirebaseInitialized) {
      return {
        success: false,
        error: 'Firebase no está configurado correctamente'
      };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const response = await authService.signIn(credentials);
    
    if (!response.success) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: response.error || 'Error al iniciar sesión' 
      }));
    }
    
    return response;
  }, []);

  // Register
  const register = useCallback(async (data: RegisterData): Promise<AuthResponse> => {
    if (!isFirebaseInitialized) {
      return {
        success: false,
        error: 'Firebase no está configurado correctamente'
      };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const response = await authService.register(data);
    
    if (!response.success) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: response.error || 'Error al registrar usuario' 
      }));
    }
    
    return response;
  }, []);

  // Sign out
  const signOut = useCallback(async (): Promise<void> => {
    if (!isFirebaseInitialized) {
      console.warn('Cannot sign out: Firebase not initialized');
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await authService.signOut();
    } catch (error) {
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
    if (!isFirebaseInitialized) {
      return {
        success: false,
        error: 'Firebase no está configurado correctamente'
      };
    }

    setState(prev => ({ ...prev, error: null }));
    
    const response = await authService.resetPassword(email);
    
    if (!response.success) {
      setState(prev => ({ 
        ...prev, 
        error: response.error || 'Error al enviar email de recuperación' 
      }));
    }
    
    return response;
  }, []);

  // Update password
  const updatePassword = useCallback(async (newPassword: string): Promise<AuthResponse> => {
    if (!isFirebaseInitialized) {
      return {
        success: false,
        error: 'Firebase no está configurado correctamente'
      };
    }

    setState(prev => ({ ...prev, error: null }));
    
    const response = await authService.updateUserPassword(newPassword);
    
    if (!response.success) {
      setState(prev => ({ 
        ...prev, 
        error: response.error || 'Error al actualizar contraseña' 
      }));
    }
    
    return response;
  }, []);

  // Clear error
  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async (): Promise<void> => {
    if (!isFirebaseInitialized || !state.firebaseUser) {
      return;
    }

    try {
      const userData = await authService.getUserData(state.firebaseUser.uid);
      setState(prev => ({
        ...prev,
        user: userData,
        isAuthenticated: !!userData
      }));
    } catch (error) {
      console.error('Error refreshing user:', error);
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