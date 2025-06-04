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
    if (loading) return

    if (!user && !redirectIfFound) {
      router.push(redirectTo)
    }

    if (user && redirectIfFound) {
        router.push('/dashboard')
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