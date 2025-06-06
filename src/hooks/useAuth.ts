"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/app/lib/firebase'

interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  userType: 'funcionario' | 'estudiante'
  children?: Array<{
    id: string
    name: string
    age: number
    class: string
    level: 'basico' | 'medio'
  }>
}

interface UseAuthReturn {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<AuthUser, 'id'>
            setUser({
              ...userData,
              id: firebaseUser.uid
            })
          } else {
            // Usuario no encontrado en Firestore
            setUser(null)
            router.push('/auth/registro')
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error)
          setUser(null)
          router.push('/auth/login')
        }
      } else {
        setUser(null)
        router.push('/auth/login')
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  return {
    user,
    isLoading,
    isAuthenticated: !!user
  }
}
