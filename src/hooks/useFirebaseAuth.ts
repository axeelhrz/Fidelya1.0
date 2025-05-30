'use client';

import { useState, useEffect } from 'react';
import { firebaseAuth, AuthUser } from '../lib/firebase-auth';

interface UseFirebaseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithAdminPassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export function useFirebaseAuth(): UseFirebaseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Suscribirse a cambios de autenticación
    const unsubscribe = firebaseAuth.onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await firebaseAuth.signInWithPassword(email, password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de autenticación';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signInWithAdminPassword = async (password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await firebaseAuth.signInWithAdminPassword(password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Contraseña incorrecta';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await firebaseAuth.signOut();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cerrar sesión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: firebaseAuth.isAuthenticated(),
    isAdmin: firebaseAuth.isAdmin(),
    signIn,
    signInWithAdminPassword,
    signOut,
    clearError
  };
}

// Hook para proteger rutas de administración
export function useAdminAuth() {
  const auth = useFirebaseAuth();
  
  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      // Redirigir al login si no está autenticado
      window.location.href = '/admin/login';
    }
  }, [auth.loading, auth.isAuthenticated]);

  return auth;
}

// Hook para verificar permisos específicos
export function usePermissions() {
  const { user, isAdmin } = useFirebaseAuth();

  const hasPermission = (permission: string): boolean => {
    return firebaseAuth.hasPermission(permission);
  };

  const canManageProducts = (): boolean => {
    return hasPermission('manage_products');
  };

  const canManageMenus = (): boolean => {
    return hasPermission('manage_menus');
  };

  const canViewStatistics = (): boolean => {
    return hasPermission('view_statistics');
  };

  const canExportData = (): boolean => {
    return hasPermission('export_data');
  };

  return {
    user,
    isAdmin,
    hasPermission,
    canManageProducts,
    canManageMenus,
    canViewStatistics,
    canExportData
  };
}