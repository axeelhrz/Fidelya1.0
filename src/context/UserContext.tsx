'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Guardian, Student } from '@/types'
import { toast } from 'sonner'

interface UserContextType {
  user: User | null
  guardian: Guardian | null
  students: Student[]
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (data: { email: string; password: string; fullName: string; phone?: string }) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  refreshUserData: () => Promise<void>
  addStudent: (studentData: Omit<Student, 'id' | 'guardian_id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; error?: string }>
  updateStudent: (studentId: string, studentData: Partial<Student>) => Promise<{ success: boolean; error?: string }>
  deleteStudent: (studentId: string) => Promise<{ success: boolean; error?: string }>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [guardian, setGuardian] = useState<Guardian | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  
  const isAdmin = guardian?.role === 'admin' || guardian?.role === 'staff'

  // Initialize user session
useEffect(() => {
    const initializeAuth = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
          await loadUserData(session.user.id)
      }
    } catch (error) {
        console.error('Error initializing auth:', error)
    } finally {
        setIsLoading(false)
    }
  }

    initializeAuth()

    // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          await loadUserData(session.user.id)
        } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setGuardian(null)
        setStudents([])
          router.push('/auth/login')
      }
        setIsLoading(false)
    }
  )

    return () => subscription.unsubscribe()
  }, [router])

  const loadUserData = async (userId: string) => {
    try {
      // Load guardian data
      const { data: guardianData, error: guardianError } = await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (guardianError) {
        console.error('Error loading guardian data:', guardianError)
        return
  }

      setGuardian(guardianData)

      // Load students data
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('guardian_id', guardianData.id)
        .eq('is_active', true)
        .order('name')

      if (studentsError) {
        console.error('Error loading students data:', studentsError)
        return
      }

      setStudents(studentsData || [])
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        await loadUserData(data.user.id)
        toast.success('¡Bienvenido de vuelta!')
        router.push('/dashboard')
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al iniciar sesión' }
    }
  }

  const signUp = async (data: { email: string; password: string; fullName: string; phone?: string }) => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (authData.user) {
        toast.success('Cuenta creada exitosamente. Por favor verifica tu email.')
        router.push('/auth/verify-email')
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al crear la cuenta' }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Sesión cerrada exitosamente')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Error al cerrar sesión')
    }
  }

  const refreshUserData = async () => {
    if (user) {
      await loadUserData(user.id)
    }
  }

  const addStudent = async (studentData: Omit<Student, 'id' | 'guardian_id' | 'created_at' | 'updated_at'>) => {
    if (!guardian) {
      return { success: false, error: 'No hay guardian autenticado' }
    }

    try {
      const { data, error } = await supabase
        .from('students')
        .insert({
          ...studentData,
          guardian_id: guardian.id,
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      setStudents(prev => [...prev, data])
      toast.success('Estudiante agregado exitosamente')
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al agregar estudiante' }
    }
  }

  const updateStudent = async (studentId: string, studentData: Partial<Student>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', studentId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      setStudents(prev => prev.map(student => 
        student.id === studentId ? data : student
      ))
      toast.success('Estudiante actualizado exitosamente')
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al actualizar estudiante' }
    }
  }

  const deleteStudent = async (studentId: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ is_active: false })
        .eq('id', studentId)

      if (error) {
        return { success: false, error: error.message }
      }

      setStudents(prev => prev.filter(student => student.id !== studentId))
      toast.success('Estudiante eliminado exitosamente')
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al eliminar estudiante' }
    }
  }

  const value: UserContextType = {
    user,
    guardian,
    students,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    refreshUserData,
    addStudent,
    updateStudent,
    deleteStudent,
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
