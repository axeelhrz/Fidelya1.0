'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { User, LoginForm, RegisterForm, ApiResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    // Temporarily disabled to stop infinite loops
    console.log('checkAuth called - but disabled for debugging');
  };

  const login = async (credentials: LoginForm) => {
    try {
      const response = await api.post<ApiResponse<{ user: User }>>('/api/auth/login', credentials);
      setUser(response.data.data.user);
      router.push('/dashboard');
    } catch (error: unknown) {
      throw error;
    }
  };

  const register = async (userData: RegisterForm) => {
    try {
      const response = await api.post<ApiResponse<{ user: User }>>('/api/auth/register', userData);
      setUser(response.data.data.user);
      router.push('/dashboard');
    } catch (error: unknown) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/auth/sign-in');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}