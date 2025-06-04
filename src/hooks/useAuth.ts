'use client'

import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface UseAuthOptions {
  redirectTo?: string
  redirectIfFound?: boolean
  adminOnly?: boolean
}

export function useAuth(options: UseAuthOptions = {}) {
  const { user, guardian, isLoading, isAdmin } = useUser()
  const router = useRouter()

  const {
    redirectTo = '/auth/login',
    redirectIfFound = false,
    adminOnly = false,
  } = options

  useEffect(() => {
    if (isLoading) return

    // Redirect if user not found and should redirect
    if (!user && !redirectIfFound) {
      router.push(redirectTo)
      return
    }

    // Redirect if user found and should redirect
    if (user && redirectIfFound) {
        router.push('/dashboard')
      return
      }

    // Check admin access
    if (adminOnly && user && !isAdmin) {
      router.push('/dashboard')
      return
    }

    // Check email verification
    if (user && !user.email_confirmed_at) {
      router.push('/auth/verify-email')
      return
    }
  }, [user, guardian, isLoading, isAdmin, router, redirectTo, redirectIfFound, adminOnly])
  return {
    user,
    guardian,
    isLoading,
    isAdmin,
    isAuthenticated: !!user,
    isEmailVerified: !!user?.email_confirmed_at,
  }
}

// Specific hooks for different use cases
export function useRequireAuth() {
  return useAuth({ redirectTo: '/auth/login' })
}

export function useRequireAdmin() {
  return useAuth({ redirectTo: '/dashboard', adminOnly: true })
}

export function useRedirectIfAuthenticated() {
  return useAuth({ redirectIfFound: true })
}