"use client"

import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface UseAuthOptions {
  redirectTo?: string
  redirectIfFound?: boolean
}

export function useAuth(options: UseAuthOptions = {}) {
  const { user, loading, guardian } = useUser()
  const router = useRouter()
  const { redirectTo = '/auth/login', redirectIfFound = false } = options

  useEffect(() => {
    console.log('🔒 useAuth - Estado:', { 
      user: !!user, 
      guardian: !!guardian, 
      loading, 
      redirectTo, 
      redirectIfFound 
    })

    if (loading) {
      console.log('⏳ useAuth - Esperando carga...')
      return
    }

    if (!user && !redirectIfFound) {
      console.log('🚫 useAuth - No autenticado, redirigiendo a:', redirectTo)
      router.replace(redirectTo)
    }

    if (user && redirectIfFound) {
      console.log('✅ useAuth - Ya autenticado, redirigiendo al dashboard')
      router.replace('/dashboard')
    }
  }, [user, loading, redirectTo, redirectIfFound, router])

  return {
    user,
    guardian,
    loading,
    isAuthenticated: !!user,
    isEmailVerified: !!user?.email_confirmed_at,
    isStaff: guardian?.is_staff || false
  }
}

export function useRequireAuth() {
  return useAuth({ redirectTo: '/auth/login' })
}

export function useRedirectIfAuthenticated() {
  return useAuth({ redirectIfFound: true })
}