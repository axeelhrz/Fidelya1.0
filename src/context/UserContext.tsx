"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Student, UserProfile } from "@/lib/supabase/types"

export interface Student {
  id: string
  name: string
  grade: string
  section: string
  level: string
  tipo?: string // 'Estudiante' o 'Funcionario'
}

export interface Guardian {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string
  is_staff: boolean
  students: Student[]
}

interface UserContextType {
  user: UserProfile | null
  students: Student[]
  loading: boolean
  refreshUser: () => Promise<void>
  setUser: (user: UserProfile | null) => void
  addStudent: (student: Student) => void
  updateStudent: (studentId: string, updates: Partial<Student>) => void
  removeStudent: (studentId: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  
  const refreshUser = async () => {
    setLoading(true)
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      
      if (!authUser) {
        setUser(null)
        setStudents([])
        setLoading(false)
        return
      }

      // Obtener perfil del usuario
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", authUser.email)
        .single()

      if (userError) {
        console.error("Error al obtener usuario:", userError)
        setUser(null)
        setStudents([])
        setLoading(false)
        return
      }

      if (!userData) {
        console.warn("No se encontró un usuario para el email:", authUser.email)
        setUser(null)
        setStudents([])
        setLoading(false)
        return
      }

      // Obtener estudiantes del usuario
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .eq("guardian_id", userData.id)
        .eq("is_active", true)
        .order("name")

      if (studentsError) {
        console.error("Error al obtener estudiantes:", studentsError)
      }

      // Obtener información del rol y permisos
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_user_role_info', { user_email: authUser.email })

      const { data: permissionsData, error: permissionsError } = await supabase
        .rpc('get_user_permissions', { user_email: authUser.email })

      if (roleError) {
        console.error("Error al obtener información del rol:", roleError)
      }

      if (permissionsError) {
        console.error("Error al obtener permisos:", permissionsError)
      }

      const roleInfo = roleData?.[0]
      const permissions = permissionsData || []

      // Mapear datos del usuario
      const userProfile: UserProfile = {
        id: userData.id,
        email: userData.email,
        fullName: userData.full_name,
        phone: userData.phone,
        role: userData.role,
        isActive: userData.is_active,
        lastLogin: userData.last_login,
        loginCount: userData.login_count || 0,
        students: studentsData || [],
        permissions: permissions.map((p: any) => p.permission_name),
        roleInfo: roleInfo ? {
          displayName: roleInfo.display_name,
          description: roleInfo.description,
          color: roleInfo.color,
        } : undefined,
      }

      setUser(userProfile)
      setStudents(studentsData || [])
    } catch (error) {
      console.error("Error en refreshUser:", error)
      setUser(null)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student])
    if (user) {
      setUser({
        ...user,
        students: [...user.students, student]
      })
    }
  }

  const updateStudent = (studentId: string, updates: Partial<Student>) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, ...updates } : student
      )
    )
    if (user) {
      setUser({
        ...user,
        students: user.students.map(student => 
          student.id === studentId ? { ...student, ...updates } : student
        )
      })
    }
  }

  const removeStudent = (studentId: string) => {
    setStudents(prev => prev.filter(student => student.id !== studentId))
    if (user) {
      setUser({
        ...user,
        students: user.students.filter(student => student.id !== studentId)
      })
    }
  }

  useEffect(() => {
    refreshUser()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setStudents([])
        } else if (event === 'SIGNED_IN' && session?.user) {
          await refreshUser()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{ 
      user, 
      students, 
      loading, 
      refreshUser, 
      setUser,
      addStudent,
      updateStudent,
      removeStudent
    }}>
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