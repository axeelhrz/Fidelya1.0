"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

// Types
export interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  rol: 'user' | 'admin';
  estado: 'activo' | 'inactivo' | 'pendiente_verificacion';
  created_at: string;
  updated_at: string;
}

export interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

// Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider Component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Get user profile from database
  const getUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }, []);

  // Initialize user session
  const initializeUser = useCallback(async () => {
    try {
      const supabase = supabaseBrowser();
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        setUser(null);
        setProfile(null);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        
        // Get user profile from database
        const userProfile = await getUserProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error initializing user:', error);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [getUserProfile]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!user) return;
    
    try {
      const userProfile = await getUserProfile(user.id);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, [user, getUserProfile]);

  // Update user profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;

    try {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }, [user, profile]);

  // Sign out user
  const signOut = useCallback(async () => {
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }

      setUser(null);
      setProfile(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
    }
  }, [router]);

  // Listen to auth state changes
  useEffect(() => {
    const supabase = supabaseBrowser();

    // Initialize user on mount
    initializeUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          const userProfile = await getUserProfile(session.user.id);
          setProfile(userProfile);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
          // Optionally refresh profile data
          if (profile) {
            const userProfile = await getUserProfile(session.user.id);
            setProfile(userProfile);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeUser, getUserProfile, profile]);

  // Computed values
  const isAuthenticated = !!user && !!profile;
  const isAdmin = profile?.rol === 'admin';

  const value: UserContextType = {
    user,
    profile,
    loading,
    isAuthenticated,
    isAdmin,
    signOut,
    refreshUser,
    updateProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Export types for external use
export type { User };
export default UserProvider;
