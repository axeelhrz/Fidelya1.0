"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import type { User, AuthError } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    initialized: false
  })

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Error getting session:", error)
        }

        setAuthState({
          user: session?.user ?? null,
          loading: false,
          initialized: true
        })
      } catch (error) {
        console.error("Error in getInitialSession:", error)
        setAuthState({
          user: null,
          loading: false,
          initialized: true
        })
      }
    }

    getInitialSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email)
        setAuthState({
          user: session?.user ?? null,
          loading: false,
          initialized: true
        })

        // Redireccionar según el evento
        if (event === 'SIGNED_IN') {
          // Verificar si el email está confirmado
          if (session?.user?.email_confirmed_at) {
        router.push('/dashboard')
          } else {
      toast({
              title: "Verifica tu email",
              description: "Por favor, revisa tu correo y confirma tu cuenta antes de continuar.",
          variant: "default"
        })
      }
        } else if (event === 'SIGNED_OUT') {
      router.push('/auth/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, toast])

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      })

      if (error) {
        throw error
      }

      // Verificar si el email está confirmado
      if (!data.user?.email_confirmed_at) {
      toast({
          title: "Email no verificado",
          description: "Por favor, verifica tu email antes de continuar. Revisa tu bandeja de entrada.",
          variant: "destructive"
      })
        await supabase.auth.signOut()
        return { success: false, error: "Email no verificado" }
      }

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      })

      return { success: true, user: data.user }
    } catch (error: any) {
      console.error("Error signing in:", error)
      
      let errorMessage = "Error al iniciar sesión"
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email o contraseña incorrectos"
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Por favor, verifica tu email antes de continuar"
      } else if (error.message?.includes("Too many requests")) {
        errorMessage = "Demasiados intentos. Intenta nuevamente en unos minutos"
    }

      toast({
        title: "Error de autenticación",
        description: errorMessage,
        variant: "destructive"
      })

      return { success: false, error: errorMessage }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
  }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: userData.fullName,
            phone: userData.phone,
            student_name: userData.studentName,
            student_grade: userData.studentGrade
          }
        }
      })

      if (error) {
        throw error
      }

      if (data.user) {
        toast({
          title: "¡Registro exitoso! 🎉",
          description: "Te hemos enviado un correo de verificación. Por favor, revísalo para activar tu cuenta.",
        })

        return { success: true, user: data.user }
      }

      return { success: false, error: "Error desconocido" }
    } catch (error: any) {
      console.error("Error signing up:", error)
      
      let errorMessage = "Error al crear la cuenta"
      
      if (error.message?.includes("User already registered")) {
        errorMessage = "Este email ya está registrado. ¿Quieres iniciar sesión?"
      } else if (error.message?.includes("Password should be at least")) {
        errorMessage = "La contraseña debe tener al menos 6 caracteres"
      } else if (error.message?.includes("Invalid email")) {
        errorMessage = "El formato del email no es válido"
      }

      toast({
        title: "Error de registro",
        description: errorMessage,
        variant: "destructive"
      })

      return { success: false, error: errorMessage }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))
      await supabase.auth.signOut()
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        variant: "destructive"
      })
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        throw error
      }

      toast({
        title: "Email enviado",
        description: "Te hemos enviado un enlace para restablecer tu contraseña.",
      })

      return { success: true }
    } catch (error: any) {
      console.error("Error resetting password:", error)
      
      toast({
        title: "Error",
        description: "Error al enviar el email de recuperación",
        variant: "destructive"
      })

      return { success: false, error: error.message }
    }
  }

  return {
    user: authState.user,
    loading: authState.loading,
    initialized: authState.initialized,
    signIn,
    signUp,
    signOut,
    resetPassword
  }
}
