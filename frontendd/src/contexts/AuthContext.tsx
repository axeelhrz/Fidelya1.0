'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<User | null>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      console.log('🔐 Logging in user...');
      const response = await api.post('/api/auth/login', { email, password });
      const userData = response.data.user;
      setUser(userData);
      console.log('✅ Login successful:', userData);
      return userData;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 Logging out user...');
      await api.post('/api/auth/logout');
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Even if logout fails on server, clear local state
      setUser(null);
    }
  };

  const checkAuth = async (): Promise<User | null> => {
    try {
      console.log('🔍 Checking authentication...');
      const response = await api.get('/api/auth/me');
      const userData = response.data.user;
      setUser(userData);
      console.log('✅ Auth check successful:', userData);
      return userData;
    } catch (error) {
      console.log('ℹ️ User not authenticated');
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.log('ℹ️ Initial auth check failed');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}