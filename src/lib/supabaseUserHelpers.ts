import { supabase } from './supabase/client'
import type { Hijo } from './supabase/types'

export interface RegistrationData {
  email: string
  password: string
  nombreApoderado: string
  telefono?: string
  hijos: Hijo[]
}

export async function registerUser(data: RegistrationData) {
  try {
    console.log('Starting user registration process...')
    
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.nombreApoderado,
          phone: data.telefono
        }
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      throw new Error(`Error de autenticación: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error('No se pudo crear el usuario')
    }

    console.log('User created in Auth:', authData.user.id)

    // 2. Wait for auth to settle
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 3. Create client profile
    const clientData = {
      user_id: authData.user.id,
      correo_apoderado: data.email,
      nombre_apoderado: data.nombreApoderado,
      telefono: data.telefono || null,
      hijos: data.hijos,
      rol: 'user' as const,
      is_active: true
    }

    console.log('Creating client profile:', clientData)

    const { data: clienteData, error: clienteError } = await supabase
      .from('clientes')
      .insert(clientData)
      .select()
      .single()

    if (clienteError) {
      console.error('Client creation error:', clienteError)
      
      // Try to clean up auth user if client creation fails
      try {
        await supabase.auth.admin.deleteUser(authData.user.id)
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError)
      }
      
      // Provide specific error messages
      if (clienteError.code === '23505') {
        throw new Error('Ya existe una cuenta con este correo electrónico')
      } else if (clienteError.code === '42501') {
        throw new Error('Error de permisos. Por favor intenta nuevamente')
      } else {
        throw new Error(`Error al crear el perfil: ${clienteError.message}`)
      }
    }

    console.log('Client created successfully:', clienteData)
    return { user: authData.user, cliente: clienteData }

  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('id')
      .eq('correo_apoderado', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking email:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error checking email existence:', error)
    return false
  }
}