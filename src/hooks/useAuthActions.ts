'use client';

import { useAuth } from '../contexts/AuthContext';
import { useCallback } from 'react';

export const useAuthActions = () => {
  const { requireAuth, isAuthenticated, logout } = useAuth();

  const withAuth = useCallback(
    <T extends any[]>(action: (...args: T) => void | Promise<void>) => {
      return async (...args: T) => {
        await requireAuth(() => action(...args));
      };
    },
    [requireAuth]
  );

  const withAuthCallback = useCallback(
    (callback: () => void | Promise<void>) => {
      return () => requireAuth(callback);
    },
    [requireAuth]
  );

  return {
    withAuth,
    withAuthCallback,
    isAuthenticated,
    logout,
    requireAuth,
  };
};