"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'

interface RegistrationData {
  fullName: string
  email: string
  password: string
}

export function useRegistration() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  const register = async (data: RegistrationData) => {
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      console.log('🚀 Iniciando registro para:', data.email)
      
      // Paso 1: Verificar si el email ya existe
      const { data: existingUser } = await supabase
        .from('guardians')
        .select('email')
        .eq('email', data.email)
        .single()

      if (existingUser) {
        setError('Este correo electrónico ya está registrado')
        setLoading(false)
        return { success: false, error: 'Este correo electrónico ya está registrado' }
      }

      // Paso 2: Registrar en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName
          }
        }
      })

      if (authError) {
        console.error('❌ Error en auth.signUp:', authError)
        setError(authError.message)
        setLoading(false)
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        console.error('❌ No se recibió usuario después del registro')
        setError('Error al crear la cuenta')
        setLoading(false)
        return { success: false, error: 'Error al crear la cuenta' }
      }

      console.log('✅ Usuario registrado en Auth:', authData.user.id)

      // Paso 3: Crear perfil de guardian
      const { error: profileError } = await supabase
        .from('guardians')
        .insert({
          user_id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          is_staff: false
        })

      if (profileError) {
        console.error('❌ Error creando perfil:', profileError)
        // El usuario ya fue creado en Auth, así que no es un error crítico
        console.log('⚠️ Perfil se creará automáticamente en el próximo login')
      } else {
        console.log('✅ Perfil de guardian creado exitosamente')
      }

      setSuccess(true)
      toast({
        title: "¡Registro exitoso!",
        description: "Por favor verifica tu correo electrónico para activar tu cuenta.",
      })

      setLoading(false)
      return { success: true }

    } catch (error: any) {
      console.error('❌ Error inesperado en registro:', error)
      const errorMessage = error.message || 'Error inesperado al registrarse'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  const reset = () => {
    setLoading(false)
    setSuccess(false)
    setError('')
  }

  return {
    register,
    loading,
    success,
    error,
    reset
  }
}