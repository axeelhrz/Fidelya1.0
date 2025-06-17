'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Session, User } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/database.types'

type UserProfile = Database['public']['Tables']['users']['Row']

interface AuthResponse {
  user?: User
  session?: Session
  profile?: UserProfile
}

interface UserContextType {
  user: ReturnType<typeof useAuth>['user']
  profile: ReturnType<typeof useAuth>['profile']
  session: Session | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; data?: AuthResponse }>
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string; data?: AuthResponse }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  updateProfile: ReturnType<typeof useAuth>['updateProfile']
  isAuthenticated: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  try {
    const auth = useAuth()

    const contextValue: UserContextType = {
      user: auth.user,
      profile: auth.profile,
      session: null,
      loading: auth.loading,
      error: auth.error,
      signIn: auth.signIn,
      signUp: auth.signUp,
      signOut: auth.signOut,
      updateProfile: auth.updateProfile,
      isAuthenticated: auth.isAuthenticated,
      isAdmin: auth.isAdmin,
      isSuperAdmin: auth.isSuperAdmin
    }

    return (
      <UserContext.Provider value={contextValue}>
        {children}
      </UserContext.Provider>
    )
  } catch (error) {
    console.error('Error in UserProvider:', error)
    
    // Fallback context value in case of error
    const fallbackValue: UserContextType = {
      user: null,
      profile: null,
      session: null,
      loading: false,
      error: 'Error initializing user context',
      signIn: async () => ({ success: false, error: 'Context not available' }),
      signUp: async () => ({ success: false, error: 'Context not available' }),
      signOut: async () => ({ success: false, error: 'Context not available' }),
      updateProfile: async () => ({ success: false, error: 'Context not available' }),
      isAuthenticated: false,
      isAdmin: false,
      isSuperAdmin: false
    }

    return (
      <UserContext.Provider value={fallbackValue}>
        {children}
      </UserContext.Provider>
    )
  }
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider. Make sure to wrap your app with <UserProvider>')
  }
  return context
}

// Alias para compatibilidad con código existente
export function useUserContext() {
  return useUser()
}

// Hook alternativo que no lanza error si no está en el contexto
export function useUserSafe() {
  const context = useContext(UserContext)
  return context || null
}