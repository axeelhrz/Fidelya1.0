"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error de autenticación',
          description: error.message,
        })
        return { success: false, error }
      }

      if (data.user) {
        toast({
          title: 'Inicio de sesión exitoso',
          description: 'Bienvenido de vuelta',
        })
        router.push('/dashboard')
        return { success: true, user: data.user }
      }

      return { success: false, error: new Error('No user returned') }
    } catch (error) {
      console.error('Error in signIn:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error inesperado',
      })
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error de registro',
          description: error.message,
        })
        return { success: false, error }
      }

      if (data.user) {
        toast({
          title: 'Registro exitoso',
          description: 'Por favor verifica tu email para continuar',
        })
        return { success: true, user: data.user }
      }

      return { success: false, error: new Error('No user returned') }
    } catch (error) {
      console.error('Error in signUp:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error inesperado',
      })
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message,
        })
        return { success: false, error }
      }

      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión exitosamente',
      })
      
      router.push('/auth/login')
      return { success: true }
    } catch (error) {
      console.error('Error in signOut:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error inesperado',
      })
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Función de login que es un alias de signIn para compatibilidad
  const login = signIn

  return {
    signIn,
    signUp,
    signOut,
    login, // Agregamos esta función para evitar el error "login is not a function"
    loading,
  }
}
