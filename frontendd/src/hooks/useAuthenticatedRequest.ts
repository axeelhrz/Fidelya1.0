import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';

export function useAuthenticatedRequest() {
  const { user, checkAuth } = useAuth();

  const makeRequest = useCallback(async <T>(
    requestFn: () => Promise<T>
  ): Promise<T> => {
    // Ensure user is authenticated
    if (!user) {
      console.log('No user found, checking authentication...');
      const authUser = await checkAuth();
      if (!authUser) {
        throw new Error('User not authenticated');
      }
    }

    try {
      return await requestFn();
    } catch (error: any) {
      console.log('Request failed with error:', error.response?.status);
      
      // If we get a 401, try to re-authenticate once
      if (error.response?.status === 401) {
        console.log('Got 401, trying to re-authenticate...');
        const authUser = await checkAuth();
        if (authUser) {
          console.log('Re-authentication successful, retrying request...');
          // Retry the request
          return await requestFn();
        } else {
          console.log('Re-authentication failed');
          throw new Error('Authentication failed');
        }
      }
      
      // If we get a 419 CSRF error, the axios interceptor should handle it
      // But if it doesn't, we can add additional handling here
      if (error.response?.status === 419) {
        console.log('Got 419 CSRF error, axios interceptor should handle this');
      }
      
      throw error;
    }
  }, [user, checkAuth]);

  return { makeRequest };
}