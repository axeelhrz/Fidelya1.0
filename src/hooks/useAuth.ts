"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/auth/authHelpers'
import { useUser } from '@/context/UserContext'
import { supabase } from '@/lib/supabase/client'

interface AuthError {
  message: string
}

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { refreshUser, user } = useUser()

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const { user, error: signInError } = await AuthService.signIn(email, password)
      
      if (signInError) {
        const errorMessage = (signInError as AuthError).message || 'Error durante el inicio de sesión'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      if (user) {
        await refreshUser()
        router.push('/dashboard')
        return { success: true, error: null }
      }

      setError('Error inesperado durante el inicio de sesión')
      return { success: false, error: 'Error inesperado durante el inicio de sesión' }
    } catch (err: any) {
      const errorMessage = err.message || 'Error durante el inicio de sesión'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string, additionalData?: any) => {
    setLoading(true)
    setError(null)

    try {
      const { user, error: signUpError } = await AuthService.signUp(email, password, fullName)
      
      if (signUpError) {
        const errorMessage = (signUpError as AuthError).message || 'Error durante el registro'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      if (user) {
        // Redirigir a verificación de email
        router.push('/auth/verify-email')
        return { success: true, error: null }
      }

      setError('Error inesperado durante el registro')
      return { success: false, error: 'Error inesperado durante el registro' }
    } catch (err: any) {
      const errorMessage = err.message || 'Error durante el registro'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error: signOutError } = await AuthService.signOut()
      
      if (signOutError) {
        const errorMessage = (signOutError as AuthError).message || 'Error durante el cierre de sesión'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      router.push('/auth/login')
      return { success: true, error: null }
    } catch (err: any) {
      const errorMessage = err.message || 'Error durante el cierre de sesión'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    setError(null)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      
      if (resetError) {
        const errorMessage = (resetError as AuthError).message || 'Error al enviar el email de recuperación'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      return { success: true, error: null }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al enviar el email de recuperación'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (newPassword: string) => {
    setLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (updateError) {
        const errorMessage = (updateError as AuthError).message || 'Error al actualizar la contraseña'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      return { success: true, error: null }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar la contraseña'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    loading,
    error,
    user,
    clearError: () => setError(null)
  }
}
