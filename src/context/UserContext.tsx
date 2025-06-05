"use client"

import React, { createContext, useContext, ReactNode } from "react"
import { useAuth } from "@/hooks/useAuth"
import type { UserProfile, Student } from "@/lib/supabase/types"

interface UserContextType {
  user: UserProfile | null
  students: Student[]
  loading: boolean
  refreshUser: () => Promise<void>
  setUser: (user: UserProfile | null) => void
  isUser: () => boolean
  isAdmin: () => boolean
  isSuperAdmin: () => boolean
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  const contextValue: UserContextType = {
    user: auth.profile,
    students: auth.profile?.students || [],
    loading: auth.loading,
    refreshUser: auth.refreshProfile,
    setUser: () => {}, // No necesario con el nuevo sistema
    isUser: auth.isUser,
    isAdmin: auth.isAdmin,
    isSuperAdmin: auth.isSuperAdmin,
    signOut: auth.signOut,
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}

// Alias para compatibilidad con código existente
export function useUserContext() {
  return useUser()
}