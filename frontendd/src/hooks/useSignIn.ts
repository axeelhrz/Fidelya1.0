import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

interface SignInData {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface SignInResponse {
  message: string;
  user: User;
  token?: string;
}

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useAuth();

  const signIn = async (data: SignInData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Starting sign in process...');
      console.log('📝 Sign in data:', { ...data, password: '[HIDDEN]' });

      // Make the login request to the correct endpoint
      const response = await api.post<SignInResponse>('/api/auth/login', data);
      
      console.log('✅ Login successful:', response.data);

      // Set user in context
      if (response.data.user) {
        setUser(response.data.user);
        
        // Redirect based on role
        const role = response.data.user.role;
        switch (role) {
          case 'super_admin':
            router.push('/dashboard');
            break;
          case 'liga':
            router.push('/dashboard/liga');
            break;
          case 'club':
            router.push('/dashboard/club');
            break;
          case 'miembro':
            router.push('/dashboard/miembro');
            break;
          default:
            router.push('/dashboard');
        }
      }
    } catch (err: any) {
      console.error('❌ Sign in error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        setError(errorMessages.join(', '));
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    signIn,
    isLoading,
    error,
    clearError,
  };
};