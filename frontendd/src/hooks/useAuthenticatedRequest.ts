import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useAuthenticatedRequest() {
  const { user } = useAuth();

  const makeRequest = useCallback(async <T>(
    requestFn: () => Promise<T>
  ): Promise<T> => {
    try {
      return await requestFn();
    } catch (error: unknown) {
      // Let the axios interceptor handle authentication errors
      // Just re-throw the error to be handled by the calling component
      throw error;
    }
  }, [user]);

  return { makeRequest };
}