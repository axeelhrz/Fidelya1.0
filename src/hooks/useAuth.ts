"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import type { User, AuthError } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  loginAttempts: number
  lastLoginAttempt: Date | null
}

interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

interface RegisterCredentials {
  email: string
  password: string
  fullName: string
  phone: string
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    loginAttempts: 0,
    lastLoginAttempt: null
  })

  const router = useRouter()
  const { toast } = useToast()

  // Rate limiting
  const MAX_LOGIN_ATTEMPTS = 5
  const LOCKOUT_DURATION = 5 * 60 * 1000 // 5 minutos

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        setAuthState(prev => ({
          ...prev,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
          loading: false
        }))
      } catch (error) {
        console.error('Error getting initial session:', error)
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Error al verificar la sesión'
        }))
      }
    }

    getInitialSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({
          ...prev,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
          loading: false
        }))

        if (event === 'SIGNED_IN') {
          toast({
            title: "¡Bienvenido!",
            description: "Has iniciado sesión correctamente.",
            variant: "default"
          })
        }

        if (event === 'SIGNED_OUT') {
          toast({
            title: "Sesión cerrada",
            description: "Has cerrado sesión correctamente.",
            variant: "default"
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [toast])

  const checkRateLimit = (): boolean => {
    const { loginAttempts, lastLoginAttempt } = authState
    
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS && lastLoginAttempt) {
      const timeSinceLastAttempt = Date.now() - lastLoginAttempt.getTime()
      if (timeSinceLastAttempt < LOCKOUT_DURATION) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 60000)
        setAuthState(prev => ({
          ...prev,
          error: `Demasiados intentos fallidos. Intenta nuevamente en ${remainingTime} minutos.`
        }))
        return false
      } else {
        // Reset attempts after lockout period
        setAuthState(prev => ({
          ...prev,
          loginAttempts: 0,
          lastLoginAttempt: null
        }))
      }
    }
    
    return true
  }

  const login = async ({ email, password, rememberMe }: LoginCredentials) => {
    if (!checkRateLimit()) return false

    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      })

      if (error) throw error

      // Reset login attempts on successful login
      setAuthState(prev => ({
        ...prev,
        loginAttempts: 0,
        lastLoginAttempt: null,
        loading: false
      }))

      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberMe')
      }

      // Redirect based on user role
      const { data: guardian } = await supabase
        .from('guardians')
        .select('is_staff')
        .eq('user_id', data.user.id)
        .single()

      if (guardian?.is_staff) {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }

      return true
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Increment login attempts
      setAuthState(prev => ({
        ...prev,
        loginAttempts: prev.loginAttempts + 1,
        lastLoginAttempt: new Date(),
        loading: false,
        error: getAuthErrorMessage(error)
      }))

      toast({
        title: "Error de autenticación",
        description: getAuthErrorMessage(error),
        variant: "destructive"
      })

      return false
    }
  }

  const register = async ({ email, password, fullName, phone }: RegisterCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Registrar usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim()
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Crear perfil de guardian
        const { error: profileError } = await supabase
          .from('guardians')
          .insert({
            user_id: authData.user.id,
            full_name: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            is_staff: false
          })

        if (profileError) throw profileError

        toast({
          title: "¡Registro exitoso!",
          description: "Tu cuenta ha sido creada. Por favor verifica tu email.",
          variant: "default"
        })

        router.push('/auth/login?message=Verifica tu email para continuar')
        return true
      }

      return false
    } catch (error: any) {
      console.error('Registration error:', error)
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: getAuthErrorMessage(error)
      }))

      toast({
        title: "Error en el registro",
        description: getAuthErrorMessage(error),
        variant: "destructive"
      })

      return false
    }
  }

  const logout = async () => {
    setAuthState(prev => ({ ...prev, loading: true }))

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      localStorage.removeItem('rememberMe')
      router.push('/auth/login')
    } catch (error: any) {
      console.error('Logout error:', error)
      toast({
        title: "Error al cerrar sesión",
        description: "Hubo un problema al cerrar la sesión.",
        variant: "destructive"
      })
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const resetPassword = async (email: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      toast({
        title: "Email enviado",
        description: "Revisa tu correo para restablecer tu contraseña.",
        variant: "default"
      })

      return true
    } catch (error: any) {
      console.error('Reset password error:', error)
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: getAuthErrorMessage(error)
      }))

      toast({
        title: "Error",
        description: getAuthErrorMessage(error),
        variant: "destructive"
      })

      return false
    }
  }

  return {
    ...authState,
    login,
    register,
    logout,
    resetPassword
  }
}

function getAuthErrorMessage(error: AuthError | any): string {
  switch (error?.message || error?.code) {
    case 'Invalid login credentials':
      return 'Credenciales incorrectas. Verifica tu email y contraseña.'
    case 'Email not confirmed':
      return 'Por favor confirma tu email antes de iniciar sesión.'
    case 'User already registered':
      return 'Este email ya está registrado. Intenta iniciar sesión.'
    case 'Password should be at least 6 characters':
      return 'La contraseña debe tener al menos 6 caracteres.'
    case 'Unable to validate email address: invalid format':
      return 'El formato del email no es válido.'
    case 'signup_disabled':
      return 'El registro está temporalmente deshabilitado.'
    default:
      return error?.message || 'Ha ocurrido un error inesperado.'
  }
}