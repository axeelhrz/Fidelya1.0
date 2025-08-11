'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const checkingAuth = useRef(false);

  const checkAuth = async () => {
    // Prevent multiple simultaneous auth checks
    if (checkingAuth.current) return;
    checkingAuth.current = true;

    try {
      const response = await api.get<ApiResponse<{ user: User }>>('/api/auth/me');
      setUser(response.data.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
      checkingAuth.current = false;
    }
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

  // Handle redirects based on auth state - separate from checkAuth
  useEffect(() => {
    if (!initialized) return; // Wait for initial auth check

    const authRoutes = ['/auth/sign-in', '/auth/sign-up'];
    const protectedRoutes = ['/dashboard', '/leagues', '/clubs', '/members', '/sports'];
    
    const isAuthRoute = authRoutes.includes(pathname);
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // If user is authenticated and on auth pages, redirect to dashboard
    if (user && isAuthRoute) {
      router.push('/dashboard');
    }
    
    // If user is not authenticated and on protected routes, redirect to sign-in
    if (!user && isProtectedRoute) {
      router.push('/auth/sign-in');
    }
  }, [user, pathname, initialized, router]);

  // Initial auth check - only run once
  useEffect(() => {
    checkAuth();
  }, []); // Empty dependency array - only run on mount

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