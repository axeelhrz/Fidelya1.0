import { supabase } from '@/lib/supabase/client'
import { AuthError, User } from '@supabase/supabase-js'
import { Guardian, GuardianInsert } from '@/lib/supabase/types'

export interface AuthResponse {
  success: boolean
  error?: string
  user?: User
  guardian?: Guardian
}

export interface RegisterData {
  email: string
  password: string
  fullName: string
  phone?: string
}

export class AuthService {
  /**
   * Registrar nuevo usuario
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // 1. Crear usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone
          }
        }
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: 'No se pudo crear el usuario' }
      }

      // 2. Crear perfil de guardian
      const guardianData: GuardianInsert = {
        user_id: authData.user.id,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        is_staff: false
      }

      const { data: guardian, error: guardianError } = await supabase
        .from('guardians')
        .insert(guardianData)
        .select()
        .single()

      if (guardianError) {
        console.error('Error creando guardian:', guardianError)
        return { success: false, error: 'Error creando perfil de usuario' }
      }

      return {
        success: true,
        user: authData.user,
        guardian
      }
    } catch (error) {
      console.error('Error en registro:', error)
      return { success: false, error: 'Error interno del servidor' }
    }
  }

  /**
   * Iniciar sesión
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: 'No se pudo iniciar sesión' }
      }

      // Obtener datos del guardian
      const { data: guardian, error: guardianError } = await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', data.user.id)
        .single()

      if (guardianError) {
        console.error('Error obteniendo guardian:', guardianError)
        return { success: false, error: 'Error obteniendo datos del usuario' }
      }

      return {
        success: true,
        user: data.user,
        guardian
      }
    } catch (error) {
      console.error('Error en login:', error)
      return { success: false, error: 'Error interno del servidor' }
    }
  }

  /**
   * Cerrar sesión
   */
  static async logout(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error en logout:', error)
      return { success: false, error: 'Error cerrando sesión' }
    }
  }

  /**
   * Recuperar contraseña
   */
  static async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error en reset password:', error)
      return { success: false, error: 'Error enviando email de recuperación' }
    }
  }

  /**
   * Actualizar contraseña
   */
  static async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error actualizando contraseña:', error)
      return { success: false, error: 'Error actualizando contraseña' }
    }
  }

  /**
   * Obtener usuario actual
   */
  static async getCurrentUser(): Promise<{ user: User | null; guardian: Guardian | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { user: null, guardian: null }
      }

      const { data: guardian } = await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', user.id)
        .single()

      return { user, guardian }
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error)
      return { user: null, guardian: null }
    }
  }

  /**
   * Verificar si el usuario es staff
   */
  static async isStaff(userId: string): Promise<boolean> {
    try {
      const { data: guardian } = await supabase
        .from('guardians')
        .select('is_staff')
        .eq('user_id', userId)
        .single()

      return guardian?.is_staff || false
    } catch (error) {
      console.error('Error verificando staff:', error)
      return false
    }
  }
}