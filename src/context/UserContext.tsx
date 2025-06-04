"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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
}
interface UserContextType {
  user: User | null
  guardian: Guardian | null
  students: Student[]
  loading: boolean
  signOut: () => Promise<void>
  refreshUserData: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [guardian, setGuardian] = useState<Guardian | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  const fetchUserData = async (currentUser: User) => {
    try {
      // Buscar guardian por user_id
      const { data: guardianData, error: guardianError } = await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()

      if (guardianError) {
        console.error('Error fetching guardian:', guardianError)
        return
      }
        
        setGuardian(guardianData)

      // Buscar estudiantes del guardian
      if (guardianData) {
          const { data: studentsData, error: studentsError } = await supabase
            .from('students')
            .select('*')
            .eq('guardian_id', guardianData.id)
          if (studentsError) {
          console.error('Error fetching students:', studentsError)
          } else {
            setStudents(studentsData || [])
          }
        }
    } catch (error) {
      console.error('Error in fetchUserData:', error)
    }
  }

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        throw error
      }
      
      if (data.user) {
        setUser(data.user)
        await fetchUserData(data.user)
      }
    } catch (error) {
      console.error('Error logging in:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
        setUser(null)
      setGuardian(null)
        setStudents([])
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
        setLoading(false)
      }
  }

useEffect(() => {
  // Obtener sesión inicial
  const getInitialSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
        setLoading(false)
        return
      }

      if (session?.user) {
        setUser(session.user)
        await fetchUserData(session.user)
      }
    } catch (error) {
      console.error('Error in getInitialSession:', error)
    } finally {
      setLoading(false)
    }
  }

  getInitialSession()

  // Escuchar cambios de autenticación
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        await fetchUserData(session.user)
      } else {
        setUser(null)
        setGuardian(null)
        setStudents([])
      }
      
      setLoading(false)
    }
  )

  return () => {
    subscription.unsubscribe()
  }
}, [])

  const value = {
    user,
    guardian,
    students,
    loading,
    signOut,
    refreshUserData,
    login,
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
