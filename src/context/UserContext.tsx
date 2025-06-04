"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { Guardian, Student } from '@/lib/supabase/types'
import { useToast } from '@/components/ui/use-toast'

interface UserContextType {
  user: User | null
  session: Session | null
  guardian: Guardian | null
  students: Student[]
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Guardian>) => Promise<{ error?: string }>
  refreshUserData: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [guardian, setGuardian] = useState<Guardian | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  
  // Cargar datos del guardian y estudiantes
  const loadUserData = async (userId: string) => {
    try {
      // Buscar guardian
      const { data: guardianData, error: guardianError } = await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (guardianError && guardianError.code !== 'PGRST116') {
        console.error('Error cargando guardian:', guardianError)
        return
      }

      if (guardianData) {
        setGuardian(guardianData)

        // Cargar estudiantes del guardian
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('*')
          .eq('guardian_id', guardianData.id)
          .order('name')

        if (studentsError) {
          console.error('Error cargando estudiantes:', studentsError)
        } else {
          setStudents(studentsData || [])
        }
      }
    } catch (error) {
      console.error('Error en loadUserData:', error)
    }
  }

  // Función para refrescar datos del usuario
  const refreshUserData = async () => {
    if (user?.id) {
      await loadUserData(user.id)
    }
  }

  // Función de login
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
      console.error('Error en signIn:', error)
        return { error: error.message }
      }

      if (data.user && !data.user.email_confirmed_at) {
        return { error: 'Por favor verifica tu correo electrónico antes de iniciar sesión.' }
      }
        toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
        })
      return {}
    } catch (error) {
      console.error('Error inesperado en signIn:', error)
      return { error: 'Error inesperado al iniciar sesión' }
    }
  }

  // Función de registro optimizada
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Iniciando registro para:', email)
      
      // Paso 1: Registrar usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
        })
      if (error) {
        console.error('Error en auth.signUp:', error)
        return { error: error.message }
      }

      if (!data.user) {
        console.error('No se recibió usuario después del registro')
        return { error: 'Error al crear la cuenta' }
      }

      console.log('Usuario registrado en Auth:', data.user.id)

      // Paso 2: Crear perfil de guardian solo si el usuario fue creado exitosamente
      try {
        const { error: profileError } = await supabase
          .from('guardians')
          .insert({
            user_id: data.user.id,
            email: email,
            full_name: fullName,
            is_staff: false
          })

        if (profileError) {
          console.error('Error creando perfil de guardian:', profileError)
          // No retornamos error aquí porque el usuario ya fue creado en Auth
          // El perfil se puede crear después
        } else {
          console.log('Perfil de guardian creado exitosamente')
        }
      } catch (profileError) {
        console.error('Error inesperado creando perfil:', profileError)
        // Continuamos porque el usuario ya fue registrado
      }

      toast({
        title: "¡Registro exitoso!",
        description: "Por favor verifica tu correo electrónico para activar tu cuenta.",
      })

      return {}
    } catch (error) {
      console.error('Error inesperado en signUp:', error)
      return { error: 'Error inesperado al registrarse. Por favor intenta nuevamente.' }
    }
  }

  // Función de logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error en signOut:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error al cerrar sesión",
        })
      } else {
        setUser(null)
        setSession(null)
        setGuardian(null)
        setStudents([])
        toast({
          title: "Sesión cerrada",
          description: "Has cerrado sesión correctamente.",
        })
      }
    } catch (error) {
      console.error('Error inesperado en signOut:', error)
    }
  }

  // Función para actualizar perfil
  const updateProfile = async (data: Partial<Guardian>) => {
    if (!guardian) {
      return { error: 'No hay usuario autenticado' }
    }

    try {
      const { error } = await supabase
        .from('guardians')
        .update(data)
        .eq('id', guardian.id)

      if (error) {
        return { error: error.message }
      }

      // Actualizar estado local
      setGuardian({ ...guardian, ...data })
      
      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente.",
      })

      return {}
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      return { error: 'Error inesperado al actualizar perfil' }
    }
  }

  // Efecto para manejar cambios de autenticación
  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Sesión inicial:', session?.user?.id)
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserData(session.user.id)
      }
      setLoading(false)
    })

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadUserData(session.user.id)
        } else {
          setGuardian(null)
          setStudents([])
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const value: UserContextType = {
    user,
    session,
    guardian,
    students,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshUserData
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
    throw new Error('useUser debe ser usado dentro de un UserProvider')
  }
  return context
}
