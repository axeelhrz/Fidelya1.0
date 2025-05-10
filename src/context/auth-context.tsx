'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase-config';
import { authService, UserData, AuthError } from '@/components/services/auth.services';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';

// Tipos
interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: AuthError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  updateEmail: (newEmail: string, password: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | undefined>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);

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
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.signIn(email, password);
      
      if (response.error) {
        setError(response.error);
      }
    } catch {
      setError({
        code: 'auth/unknown-error',
        message: 'Error desconocido al iniciar sesión'
      });
    } finally {
      setLoading(false);
    }
  };

  // Iniciar sesión con Google
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.signInWithGoogle();
      
      if (response.error) {
        setError(response.error);
      }
    } catch {
      setError({
        code: 'auth/unknown-error',
        message: 'Error desconocido al iniciar sesión con Google'
      });
    } finally {
      setLoading(false);
    }
  };

  // Registrar nuevo usuario
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.signUp({
        email,
        password,
        firstName,
        lastName
      });
      
      if (response.error) {
        setError(response.error);
      }
    } catch {
      setError({
        code: 'auth/unknown-error',
        message: 'Error desconocido al registrarse'
      });
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const signOut = async () => {
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
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.resetPassword(email);
      
      if (!response.success && response.error) {
        setError(response.error);
      }
    } catch {
      setError({
        code: 'auth/unknown-error',
        message: 'Error desconocido al restablecer contraseña'
      });
    } finally {
      setLoading(false);
    }
  };

  // Enviar email de verificación
  const sendVerificationEmail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.sendVerificationEmail();
      
      if (!response.success && response.error) {
        setError(response.error);
      }
    } catch {
      setError({
        code: 'auth/unknown-error',
        message: 'Error desconocido al enviar email de verificación'
      });
    } finally {
      setLoading(false);
    }
  };

  // Actualizar perfil
  const updateProfile = async (displayName?: string, photoURL?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.updateUserProfile(displayName, photoURL);
      
      if (!response.success && response.error) {
        setError(response.error);
      }
    } catch {
      setError({
        code: 'auth/unknown-error',
        message: 'Error desconocido al actualizar perfil'
      });
    } finally {
      setLoading(false);
    }
  };

  // Actualizar email
  const updateEmail = async (newEmail: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.updateUserEmail(newEmail, password);
      
      if (!response.success && response.error) {
        setError(response.error);
      }
    } catch {
      setError({
        code: 'auth/unknown-error',
        message: 'Error desconocido al actualizar email'
      });
    } finally {
      setLoading(false);
    }
  };

  // Actualizar contraseña
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.updateUserPassword(currentPassword, newPassword);
      
      if (!response.success && response.error) {
        setError(response.error);
      }
    } catch {
      setError({
        code: 'auth/unknown-error',
        message: 'Error desconocido al actualizar contraseña'
      });
    } finally {
      setLoading(false);
    }
  };

  // Subir avatar
  const uploadAvatar = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.uploadAvatar(file);
      
      if (!response.success && response.error) {
        setError(response.error);
        return undefined;
      }
      
      return response.url;
    } catch {
      setError({
        code: 'auth/unknown-error',
        message: 'Error desconocido al subir avatar'
      });
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar datos del usuario
  const updateUserData = async (data: Partial<UserData>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.updateUserData(data);
      
      if (!response.success && response.error) {
        setError(response.error);
      }
    } catch {
      setError({
        code: 'auth/unknown-error',
        message: 'Error desconocido al actualizar datos del usuario'
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userData,
    loading,
    error,
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
    updateUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}

export { AuthContext };
