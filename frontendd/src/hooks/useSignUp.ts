'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

interface SignUpData {
  email: string;
  password: string;
  password_confirmation: string;
  full_name: string;
  role: string;
  country?: string;
  address?: string;
  club_id?: string;
  birth_date?: string;
  gender?: string;
  rubber_type?: string;
  ranking?: string;
}

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface RoleInfo {
  role: string;
  club_id?: string;
  league_id?: string;
}

interface SignUpResponse {
  message: string;
  user: User;
  role_info: RoleInfo;
}

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const signUp = async (data: SignUpData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Starting sign up process...');
      console.log('📝 Sign up data:', { ...data, password: '[HIDDEN]', password_confirmation: '[HIDDEN]' });

      // Make the registration request to the correct endpoint
      const response = await api.post<SignUpResponse>('/api/auth/register', data);
      
      console.log('✅ Registration successful:', response.data);

      // Auto-login after successful registration
      if (response.data.user) {
        await login(data.email, data.password);
        
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
      console.error('❌ Sign up error:', err);
      
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
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    signUp,
    isLoading,
    error,
    clearError,
  };
};