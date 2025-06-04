import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  email: string
  phone?: string
  is_staff: boolean
  created_at: string
  updated_at: string
}

export interface StudentProfile {
  id: string
  guardian_id: string
  name: string
  grade: string
  section: string
  level: string
  created_at: string
  updated_at: string
}

/**
 * Servicio de autenticación principal
 */
export class AuthService {
  /**
   * Obtener usuario actual y su perfil de guardian
   */
  static async getCurrentUser() {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        return { user: null, guardian: null }
      }

      // Buscar el perfil de guardian asociado
      const { data: guardian, error: guardianError } = await supabase
      .from('guardians')
        .select('*')
        .eq('user_id', user.id)
      .single()

    if (guardianError) {
        console.error('Error fetching guardian profile:', guardianError)
        return { user, guardian: null }
}

      return { user, guardian }
  } catch (error) {
      console.error('Error in getCurrentUser:', error)
      return { user: null, guardian: null }
  }
}

/**
   * Iniciar sesión
 */
  static async signIn(email: string, password: string) {
  try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
    
    if (error) {
      throw error
    }

      return { user: data.user, session: data.session, error: null }
  } catch (error) {
      console.error('Error signing in:', error)
      return { user: null, session: null, error }
  }
}

/**
   * Registrar nuevo usuario
 */
  static async signUp(email: string, password: string, fullName: string, additionalData?: any) {
  try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
      ...additionalData
    }
        }
      })
    if (error) {
      throw error
    }

      return { user: data.user, session: data.session, error: null }
  } catch (error) {
      console.error('Error signing up:', error)
      return { user: null, session: null, error }
  }
}

/**
   * Cerrar sesión
 */
  static async signOut() {
  try {
      const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
}
      return { error: null }
  } catch (error) {
      console.error('Error signing out:', error)
      return { error }
}
}

/**
   * Recuperar contraseña
 */
  static async resetPassword(email: string, redirectTo?: string) {
  try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo || `${window.location.origin}/auth/reset-password`
    })

    if (error) {
      throw error
}

      return { error: null }
  } catch (error) {
      console.error('Error resetting password:', error)
      return { error }
  }
}

/**
   * Actualizar contraseña
 */
  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        throw error
      }

      return { error: null }
    } catch (error) {
      console.error('Error updating password:', error)
      return { error }
    }
  }
}
/**
 * Crear perfil de usuario después del registro
 */
export async function createUserProfile(user: User, additionalData: Partial<UserProfile> = {}) {
  try {
    const profileData = {
      user_id: user.id,
      full_name: user.user_metadata?.full_name || additionalData.full_name || '',
      email: user.email || '',
      phone: additionalData.phone || '',
      is_staff: additionalData.is_staff || false,
      ...additionalData
}

    const { data, error } = await supabase
      .from('guardians')
      .insert([profileData])
      .select()
      .single()

    if (error) {
      console.error('Error creating user profile:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in createUserProfile:', error)
    throw error
  }
}

/**
 * Obtener perfil completo del usuario
 */
export async function getUserProfile(userId: string) {
  try {
    const { data: guardian, error: guardianError } = await supabase
      .from('guardians')
      .select(`
        *,
        students (*)
      `)
      .eq('user_id', userId)
      .single()

    if (guardianError) {
      console.error('Error fetching user profile:', guardianError)
      throw guardianError
    }

    return guardian
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    throw error
  }
}
/**
 * Verificar si el usuario tiene email confirmado
 */
export async function checkEmailConfirmation(userId: string) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      throw error
}

    return {
      isConfirmed: !!user?.email_confirmed_at,
      user
    }
  } catch (error) {
    console.error('Error checking email confirmation:', error)
    return { isConfirmed: false, user: null }
  }
}

/**
 * Reenviar email de confirmación
 */
export async function resendConfirmationEmail(email: string) {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error resending confirmation email:', error)
    return { success: false, error }
  }
}

/**
 * Obtener información del curso
 */
function getGradeInfo(gradeValue: string) {
  const grades = [
    { value: "PRE_KINDER", label: "Pre Kinder", level: "PREESCOLAR" },
    { value: "KINDER", label: "Kinder", level: "PREESCOLAR" },
    { value: "PRIMERO_BASICO", label: "1° Básico", level: "BASICA" },
    { value: "SEGUNDO_BASICO", label: "2° Básico", level: "BASICA" },
    { value: "TERCERO_BASICO", label: "3° Básico", level: "BASICA" },
    { value: "CUARTO_BASICO", label: "4° Básico", level: "BASICA" },
    { value: "QUINTO_BASICO", label: "5° Básico", level: "BASICA" },
    { value: "SEXTO_BASICO", label: "6° Básico", level: "BASICA" },
    { value: "SEPTIMO_BASICO", label: "7° Básico", level: "BASICA" },
    { value: "OCTAVO_BASICO", label: "8° Básico", level: "BASICA" },
    { value: "PRIMERO_MEDIO", label: "1° Medio", level: "MEDIA" },
    { value: "SEGUNDO_MEDIO", label: "2° Medio", level: "MEDIA" },
    { value: "TERCERO_MEDIO", label: "3° Medio", level: "MEDIA" },
    { value: "CUARTO_MEDIO", label: "4° Medio", level: "MEDIA" }
  ]

  return grades.find(g => g.value === gradeValue) || { 
    value: gradeValue, 
    label: gradeValue, 
    level: "BASICA" 
  }
}

/**
 * Validar formato de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validar fortaleza de contraseña
 */
export function validatePasswordStrength(password: string) {
  const checks = {
    minLength: password.length >= 6,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }

  const score = Object.values(checks).filter(Boolean).length
  
  let strength = 'weak'
  if (score >= 4) strength = 'strong'
  else if (score >= 3) strength = 'medium'
  return {
    score,
    strength,
    checks,
    isValid: checks.minLength && checks.hasLowercase && checks.hasUppercase && checks.hasNumber
}
}

/**
 * Sanitizar entrada de usuario
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

/**
 * Formatear nombre (capitalizar primera letra de cada palabra)
 */
export function formatName(name: string): string {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}