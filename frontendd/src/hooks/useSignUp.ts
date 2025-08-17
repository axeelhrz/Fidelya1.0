'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

interface SignUpData {
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  phone: string;
  country: string;
  // Liga fields
  league_name?: string;
  province?: string;
  logo_path?: string;
  // Club fields
  club_name?: string;
  parent_league_id?: string;
  city?: string;
  address?: string;
  // Member fields
  full_name?: string;
  parent_club_id?: string;
  birth_date?: string;
  gender?: string;
  rubber_type?: string;
  ranking?: string;
  photo_path?: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone: string;
  country: string;
  created_at: string;
  updated_at: string;
  // Role-specific fields
  league_name?: string;
  province?: string;
  club_name?: string;
  parent_league_id?: number;
  city?: string;
  address?: string;
  full_name?: string;
  parent_club_id?: number;
  birth_date?: string;
  gender?: string;
  rubber_type?: string;
  ranking?: string;
  logo_path?: string;
  photo_path?: string;
}

interface RoleInfo {
  type: string;
  name?: string;
  [key: string]: any;
}

interface SignUpResponse {
  data: {
    user: User;
    role_info: RoleInfo;
  };
  message: string;
}

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useAuth();

  const signUp = async (data: SignUpData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Starting sign up process...');
      console.log('📝 Sign up data:', { ...data, password: '[HIDDEN]', password_confirmation: '[HIDDEN]' });

      // Make the registration request to the correct endpoint
      const response = await api.post<SignUpResponse>('/api/auth/register', data);
      
      console.log('✅ Registration successful:', response.data);

      // Set user in context
      if (response.data.data.user) {
        setUser(response.data.data.user);
        
        // Redirect based on role
        const role = response.data.data.user.role;
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