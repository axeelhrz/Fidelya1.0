"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/auth/authHelpers'
import { useUser } from '@/context/UserContext'
export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { refreshUser } = useUser()

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const { user, error: signInError } = await AuthService.signIn(email, password)
      
      if (signInError) {
        setError(signInError.message)
        return { success: false, error: signInError.message }
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

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true)
    setError(null)

    try {
      const { user, error: signUpError } = await AuthService.signUp(email, password, fullName)
      
      if (signUpError) {
        setError(signUpError.message)
        return { success: false, error: signUpError.message }
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
        setError(signOutError.message)
        return { success: false, error: signOutError.message }
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

  return {
    signIn,
    signUp,
    signOut,
    loading,
    error,
    clearError: () => setError(null)
  }
}
