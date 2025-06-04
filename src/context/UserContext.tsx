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
  
  // Cargar datos del guardian y estudiantes - SIMPLIFICADO
  const loadUserData = async (userId: string) => {
    try {
      console.log('🔍 Cargando datos del usuario:', userId)
      setLoading(true)
      
      // Buscar guardian - SIN timeout, dejamos que Supabase maneje sus timeouts
      const { data: guardianData, error: guardianError } = await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (guardianError) {
        console.error('❌ Error cargando guardian:', guardianError)
        
        // Si no existe el guardian, intentar crearlo
        if (guardianError.code === 'PGRST116') {
          console.log('👤 Guardian no existe, intentando crear...')
          await createGuardianProfile(userId)
          return // createGuardianProfile ya maneja setLoading(false)
    }
        // Para otros errores, continuar sin guardian pero terminar loading
        // Para otros errores, continuar sin guardian
        console.warn('⚠️ Continuando sin guardian debido a error:', guardianError.message)
        setGuardian(null)
        setStudents([])
        setLoading(false)
        return
      }

      if (guardianData) {
        console.log('✅ Guardian encontrado:', guardianData.full_name)
        setGuardian(guardianData)

        // Cargar estudiantes del guardian
        try {
          const { data: studentsData, error: studentsError } = await supabase
            .from('students')
            .select('*')
            .eq('guardian_id', guardianData.id)
            .order('name')

          if (studentsError) {
            console.error('❌ Error cargando estudiantes:', studentsError)
            setStudents([])
          } else {
            console.log('📚 Estudiantes cargados:', studentsData?.length || 0)
            setStudents(studentsData || [])
          }
        } catch (studentsError) {
          console.error('❌ Error inesperado cargando estudiantes:', studentsError)
          setStudents([])
        }
      }
    } catch (error) {
      console.error('❌ Error inesperado en loadUserData:', error)
      setGuardian(null)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const createGuardianProfile = async (userId: string): Promise<void> => {
  const createGuardianProfile = async (userId: string): Promise<boolean> => {
    try {
      console.log('👤 Creando perfil de guardian para:', userId)
      
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        setLoading(false)
        return
        return false
      }

      const { data, error } = await supabase
        .from('guardians')
        .insert({
          user_id: userId,
          email: userData.user.email!,
          full_name: userData.user.user_metadata?.full_name || 'Usuario',
          is_staff: false
        })
        .select()
        .single()

      if (error) {
        return false
      } else {
        console.log('✅ Perfil de guardian creado:', data)
        setGuardian(data)
        return true
      }
    } catch (error) {
    } finally {
      setLoading(false)
      return false
    }
  }

  // Función para refrescar datos del usuario
  const refreshUserData = async () => {
    if (user?.id) {
      await loadUserData(user.id)
    }
  }
  // Función de login
  // Función de login mejorada
  // Función de login
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Intentando iniciar sesión para:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        
        // Mensajes de error más específicos
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Credenciales incorrectas. Verifica tu email y contraseña.' }
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: 'Por favor verifica tu correo electrónico antes de iniciar sesión.' }
        }
        if (error.message.includes('Too many requests')) {
          return { error: 'Demasiados intentos. Espera unos minutos antes de intentar nuevamente.' }
        }
        
        return { error: error.message }
      }

      if (!data.user) {
        console.error('❌ No se recibió usuario después del login')
        return { error: 'Error al iniciar sesión' }
      }

      console.log('✅ Login exitoso para usuario:', data.user.id)

      // Verificar si el email está confirmado
      if (!data.user.email_confirmed_at) {
        console.log('⚠️ Email no verificado')
        return { error: 'Por favor verifica tu correo electrónico antes de iniciar sesión.' }
      }

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      })

      return {}
    } catch (error: any) {
      console.error('❌ Error inesperado en signIn:', error)
      return { error: 'Error inesperado al iniciar sesión' }
    }
  // Función de registro

  // Función de registro optimizada
  // Función de registro
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('📝 Iniciando registro para:', email)
      
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
        console.error('❌ Error en auth.signUp:', error)
        return { error: error.message }
      }

      if (!data.user) {
        console.error('❌ No se recibió usuario después del registro')
        return { error: 'Error al crear la cuenta' }
      }

      console.log('✅ Usuario registrado en Auth:', data.user.id)

      toast({
        title: "¡Registro exitoso!",
        description: "Por favor verifica tu correo electrónico para activar tu cuenta.",
      })

      return {}
    } catch (error: any) {
      console.error('❌ Error inesperado en signUp:', error)
      return { error: 'Error inesperado al registrarse. Por favor intenta nuevamente.' }
    }
  }

  // Función de logout
  const signOut = async () => {
    try {
      console.log('🚪 Cerrando sesión...')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('❌ Error en signOut:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error al cerrar sesión",
        })
      } else {
        console.log('✅ Sesión cerrada exitosamente')
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
      console.error('❌ Error inesperado en signOut:', error)
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
      }

      // Actualizar estado local
      setGuardian({ ...guardian, ...data })
      
      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente.",
      })

      return {}
    } catch (error: any) {
      console.error('❌ Error actualizando perfil:', error)
      return { error: 'Error inesperado al actualizar perfil' }
    }
  }

  // Efecto para manejar cambios de autenticación
    console.log('🚀 Inicializando UserContext...')
    
      console.log('📋 Sesión inicial:', session?.user?.id || 'No hay sesión')
      console.log('📧 Email verificado:', !!session?.user?.email_confirmed_at)

      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        loadUserData(session.user.id)
      } else {
        setLoading(false)
    })

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.id || 'No user')
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('👤 Usuario autenticado, cargando datos...')
          await loadUserData(session.user.id)
        } else {
          console.log('👋 Usuario desautenticado, limpiando datos...')
          setGuardian(null)
          setStudents([])
          setLoading(false)
        }
      }
  )

    return () => {
      console.log('🧹 Limpiando suscripción de auth')
      subscription.unsubscribe()
}
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