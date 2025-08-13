'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/axios';
import { User, LoginForm, RegisterForm, ApiResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async (): Promise<User | null> => {
    try {
      const response = await api.get<ApiResponse<{ user: User }>>('/api/auth/me');
      const userData = response.data.data.user;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      return null;
    }
  };

  const login = async (credentials: LoginForm) => {
    try {
      setLoading(true);
      
      // First get CSRF token
      await api.get('/sanctum/csrf-cookie');
      
      // Then login
      const response = await api.post<ApiResponse<{ user: User }>>('/api/auth/login', credentials);
      const userData = response.data.data.user;
      setUser(userData);
      
      // Wait a bit to ensure session is properly set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterForm) => {
    try {
      setLoading(true);
      
      // First get CSRF token
      await api.get('/sanctum/csrf-cookie');
      
      // Then register
      const response = await api.post<ApiResponse<{ user: User }>>('/api/auth/register', userData);
      const newUser = response.data.data.user;
      setUser(newUser);
      
      // Wait a bit to ensure session is properly set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setLoading(false);
      router.push('/auth/sign-in');
    }
  };

  // Initialize authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      // Skip if already initialized
      if (initialized) return;
      
      setLoading(true);
      
      // Skip auth check for auth pages and home page
      if (pathname.startsWith('/auth/') || pathname === '/') {
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        // Get CSRF token first
        await api.get('/sanctum/csrf-cookie');
        
        // Then check auth
        const authUser = await checkAuth();
        
        // If no user and on protected page, redirect to login
        if (!authUser && !pathname.startsWith('/auth/')) {
          router.push('/auth/sign-in');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // If auth check fails on protected page, redirect to login
        if (!pathname.startsWith('/auth/')) {
          router.push('/auth/sign-in');
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    // Only run if we have a pathname
    if (pathname) {
      initAuth();
    }
  }, [pathname, router, initialized]);

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