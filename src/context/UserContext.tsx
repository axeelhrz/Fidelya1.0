"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User } from '@supabase/supabase-js'
import { supabase } from "@/lib/supabase/client"
import { AuthService } from "@/lib/auth/authHelpers"

// Definir tipos localmente para evitar problemas de importación
export interface Guardian {
  id: string
  user_id: string
  full_name: string
  email: string
  phone?: string
  is_staff: boolean
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  guardian_id: string
  name: string
  grade: string
  section: string
  level: string
  created_at: string
  updated_at: string
  is_active?: boolean
}

export interface UserContextType {
  user: User | null
  guardian: Guardian | null
  students: Student[]
  loading: boolean
  refreshUser: () => Promise<void>
  refreshStudents: () => Promise<void>
  setGuardian: (g: Guardian | null) => void
  isStaff: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [guardian, setGuardian] = useState<Guardian | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  
  const refreshUser = async () => {
    try {
      const { user: currentUser, guardian: currentGuardian } = await AuthService.getCurrentUser()
      setUser(currentUser)
      setGuardian(currentGuardian)
      
      if (currentGuardian) {
        await refreshStudents()
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  const refreshStudents = async () => {
    if (!guardian?.id) return

    try {
      const { data: studentsData, error } = await supabase
        .from('students')
        .select('*')
        .eq('guardian_id', guardian.id)
        .eq('is_active', true)
        .order('name')

      if (error) {
        console.error('Error loading students:', error)
        return
      }

      setStudents(studentsData || [])
    } catch (error) {
      console.error('Error refreshing students:', error)
    }
  }

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          await refreshUser()
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
          await refreshUser()
        } else {
          setUser(null)
          setGuardian(null)
          setStudents([])
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Refrescar estudiantes cuando cambie el guardian
  useEffect(() => {
    if (guardian?.id) {
      refreshStudents()
    }
  }, [guardian?.id])

  const value: UserContextType = {
    user,
    guardian,
    students,
    loading,
    refreshUser,
    refreshStudents,
    setGuardian,
    isStaff: guardian?.is_staff || false
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}