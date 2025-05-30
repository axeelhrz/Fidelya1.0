'use client';

import { useState, useEffect } from 'react';
import { FirebaseAuth, AuthUser } from '../lib/firebase-auth';

export interface UseFirebaseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

export function useFirebaseAuth(): UseFirebaseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = FirebaseAuth.onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
    setError(null);
      await FirebaseAuth.signInWithPassword(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setLoading(true);
    setError(null);
      await FirebaseAuth.createAccount(email, password, displayName);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await FirebaseAuth.signOut();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await FirebaseAuth.resetPassword(email);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
}
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    clearError
  };
}

// Hook para proteger rutas de administración
export function useAdminAuth() {
  const auth = useFirebaseAuth();
  
  useEffect(() => {
    if (!auth.loading && !auth.user) {
      // Redirigir al login si no está autenticado
      window.location.href = '/admin/login';
    }
  }, [auth.loading, auth.user]);

  return auth;
}

// Hook para verificar permisos específicos
export function usePermissions() {
  const { user } = useFirebaseAuth();

  const hasPermission = (permission: string): boolean => {
    // TODO: Implement permission checking logic based on user claims or custom fields
    if (!user) return false;
    // For now, return true for authenticated users - implement actual permission logic
    console.log('Checking permission:', permission); // Temporary usage to avoid unused parameter error
    return true;
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

  const isAdmin = user ? true : false; // TODO: Implement actual admin check

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