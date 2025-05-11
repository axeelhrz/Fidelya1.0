'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase-config';
import { authService, UserData, AuthError, AuthResponse, SignUpData } from '@/components/services/auth.services';

// Tipo para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<AuthResponse>;
  signUp: (data: SignUpData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: AuthError }>;
  sendVerificationEmail: () => Promise<{ success: boolean; error?: AuthError }>;
  updateProfile: (displayName?: string, photoURL?: string) => Promise<{ success: boolean; error?: AuthError }>;
  updateEmail: (newEmail: string, password: string) => Promise<{ success: boolean; error?: AuthError }>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: AuthError }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean; url?: string; error?: AuthError }>;
  updateUserData: (data: Partial<UserData>) => Promise<{ success: boolean; error?: AuthError }>;
  activateFreePlan: () => Promise<{ success: boolean; error?: AuthError }>;
  clearError: () => void;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      
      if (!authUser) {
        setUserData(null);
        setLoading(false);
        return;
      }
      
      // Suscribirse a cambios en los datos del usuario en Firestore
      const unsubscribeDoc = onSnapshot(
        doc(db, 'users', authUser.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            setUserData(null);
          }
          setLoading(false);
        },
        (err) => {
          console.error('Error al obtener datos del usuario:', err);
          setError({
            code: 'firestore/user-data-error',
            message: 'Error al cargar datos del usuario'
          });
          setLoading(false);
        }
      );
      
      return () => unsubscribeDoc();
    });
    
    return () => unsubscribeAuth();
  }, []);

  // Iniciar sesión con email y contraseña
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.signIn(email, password);
      
      if (response.error) {
        setError(response.error);
      }
      
      return response;
    } catch {
      const error = {
        code: 'auth/unknown-error',
        message: 'Error desconocido al iniciar sesión'
      };
      setError(error);
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Iniciar sesión con Google
  const signInWithGoogle = async (): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.signInWithGoogle();
      
      if (response.error) {
        setError(response.error);
      }
      
      return response;
    } catch {
      const error = {
        code: 'auth/unknown-error',
        message: 'Error desconocido al iniciar sesión con Google'
      };
      setError(error);
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Registrar nuevo usuario
  const signUp = async (data: SignUpData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.signUp(data);
      
      if (response.error) {
        setError(response.error);
      }
      
      return response;
    } catch  {
      const error = {
        code: 'auth/unknown-error',
        message: 'Error desconocido al registrarse'
      };
      setError(error);
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const signOut = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.signOut();
    } catch {
      setError({
        code: 'auth/unknown-error',
        message: 'Error desconocido al cerrar sesión'
      });
    } finally {
      setLoading(false);
    }
  };

  // Restablecer contraseña
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: AuthError }> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.resetPassword(email);
      
      if (!response.success && response.error) {
        setError(response.error);
      }
      
      return response;
    } catch {
      const error = {
        code: 'auth/unknown-error',
        message: 'Error desconocido al restablecer contraseña'
      };
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Enviar email de verificación
  const sendVerificationEmail = async (): Promise<{ success: boolean; error?: AuthError }> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.sendVerificationEmail();
      
      if (!response.success && response.error) {
        setError(response.error);
      }
      
      return response;
    } catch {
      const error = {
        code: 'auth/unknown-error',
        message: 'Error desconocido al enviar email de verificación'
      };
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar perfil
  const updateProfile = async (displayName?: string, photoURL?: string): Promise<{ success: boolean; error?: AuthError }> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.updateUserProfile(displayName, photoURL);
      
      if (!response.success && response.error) {
        setError(response.error);
      }
      
      return response;
    } catch {
      const error = {
        code: 'auth/unknown-error',
        message: 'Error desconocido al actualizar perfil'
      };
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar email
  const updateEmail = async (newEmail: string, password: string): Promise<{ success: boolean; error?: AuthError }> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.updateUserEmail(newEmail, password);
      
      if (!response.success && response.error) {
        setError(response.error);
      }
      
      return response;
    } catch  {
      const error = {
        code: 'auth/unknown-error',
        message: 'Error desconocido al actualizar email'
      };
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar contraseña
  const updatePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: AuthError }> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.updateUserPassword(currentPassword, newPassword);
      
      if (!response.success && response.error) {
        setError(response.error);
      }
      
      return response;
    } catch {
      const error = {
        code: 'auth/unknown-error',
        message: 'Error desconocido al actualizar contraseña'
      };
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Subir avatar
  const uploadAvatar = async (file: File): Promise<{ success: boolean; url?: string; error?: AuthError }> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.uploadAvatar(file);
      
      if (!response.success && response.error) {
        setError(response.error);
        return { success: false, error: response.error };
      }
      
      return response;
    } catch {
      const error = {
        code: 'auth/unknown-error',
        message: 'Error desconocido al subir avatar'
      };
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar datos del usuario
  const updateUserData = async (data: Partial<UserData>): Promise<{ success: boolean; error?: AuthError }> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.updateUserData(data);
      
      if (!response.success && response.error) {
        setError(response.error);
      }
      
      return response;
    } catch {
      const error = {
        code: 'auth/unknown-error',
        message: 'Error desconocido al actualizar datos del usuario'
      };
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Activar plan gratuito
  const activateFreePlan = async (): Promise<{ success: boolean; error?: AuthError }> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }
      
      const response = await authService.activateFreePlan(user.uid);
      
      if (!response.success && response.error) {
        setError(response.error);
      }
      
      return response;
    } catch {
      const error = {
        code: 'auth/unknown-error',
        message: 'Error desconocido al activar plan gratuito'
      };
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Valores calculados
  const isAuthenticated = !!user;
  const isEmailVerified = user?.emailVerified ?? false;

  const value: AuthContextType = {
    user,
    userData,
    loading,
    error,
    isAuthenticated,
    isEmailVerified,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    sendVerificationEmail,
    updateProfile,
    updateEmail,
    updatePassword,
    uploadAvatar,
    updateUserData,
    activateFreePlan,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Exportar contexto
export { AuthContext };