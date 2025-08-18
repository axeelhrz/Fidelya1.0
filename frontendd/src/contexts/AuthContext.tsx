'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';

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
  // Relations - these come from the backend
  parentLeague?: any;
  parentClub?: any;
  league_entity?: any;  // Note: backend uses snake_case
  club_entity?: any;
  member_entity?: any;
  // Camel case versions for frontend compatibility
  leagueEntity?: any;
  clubEntity?: any;
  memberEntity?: any;
  role_info?: any;
}

interface AuthResponse {
  data: {
    user: User;
    role_info?: any;
  };
  message: string;
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

// Helper function to normalize user data from backend
function normalizeUserData(userData: any): User {
  // Convert snake_case to camelCase for frontend compatibility
  const normalized = {
    ...userData,
    leagueEntity: userData.league_entity,
    clubEntity: userData.club_entity,
    memberEntity: userData.member_entity,
  };
  
  console.log('🔄 Normalized user data:', {
    id: normalized.id,
    name: normalized.name,
    role: normalized.role,
    hasLeagueEntity: !!normalized.leagueEntity,
    leagueEntityId: normalized.leagueEntity?.id,
    leagueEntityName: normalized.leagueEntity?.name,
  });
  
  return normalized;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      console.log('🔐 Logging in user...');
      const response = await api.post<AuthResponse>('/api/auth/login', { email, password });
      const userData = normalizeUserData(response.data.data.user);
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
      const response = await api.get<AuthResponse>('/api/auth/me');
      const userData = normalizeUserData(response.data.data.user);
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
    setUser: (userData: User | null) => {
      setUser(userData ? normalizeUserData(userData) : null);
    },
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