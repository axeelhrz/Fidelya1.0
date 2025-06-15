'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentSession, signOut as authSignOut } from '@/lib/auth'
import { Funcionario } from '@/types/database'

interface User {
  id: string
  email: string
  user_metadata: {
    full_name: string
    funcionario_id: number
  }
}

interface AuthContextType {
  user: User | null
  profile: Funcionario | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Funcionario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const session = await getCurrentSession()
      if (session) {
        setUser(session.user)
        setProfile(session.funcionario)
      }
    } catch (error) {
      console.error('Error checking session:', error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await authSignOut()
    setUser(null)
    setProfile(null)
  }

  const value = {
    user,
    profile,
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}