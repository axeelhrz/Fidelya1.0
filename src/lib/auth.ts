import { supabase } from './supabase'
import { Trabajador } from '@/types/database'

// Función para generar contraseña automática basada en nombre completo
export function generatePassword(nombreCompleto: string): string {
  if (!nombreCompleto) return ''
  
  const nameParts = nombreCompleto.trim().split(' ')
  if (nameParts.length < 2) return ''
  
  const firstName = nameParts[0]
  const lastName = nameParts[nameParts.length - 1] // Tomar el último apellido
  
  // Primera letra del nombre + apellido completo, todo en mayúsculas
  return (firstName.charAt(0) + lastName).toUpperCase()
}

// Función para obtener el nombre completo (ya viene completo en la BD)
export function getFullName(trabajador: Trabajador): string {
  return trabajador.nombre_completo
}

// Función para obtener todos los trabajadores activos
export async function getAllUsers(): Promise<Trabajador[]> {
  try {
    console.log('Fetching trabajadores from Supabase...')
    
    const { data, error } = await supabase
      .from('trabajadores')
      .select('*')
      .eq('activo', true)
      .order('nombre_completo')
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    console.log('Trabajadores fetched successfully:', data?.length || 0, 'users')
    return data || []
  } catch (error) {
    console.error('Error fetching trabajadores:', error)
    return []
  }
}

// Función de login personalizada por nombre
export async function signInWithName(nombreCompleto: string) {
  try {
    console.log('Attempting to sign in with name:', nombreCompleto)
    
    // Buscar el trabajador por nombre completo
    const { data: trabajador, error: trabajadorError } = await supabase
      .from('trabajadores')
      .select('*')
      .eq('nombre_completo', nombreCompleto)
      .eq('activo', true)
      .single()
    
    if (trabajadorError) {
      console.error('Trabajador error:', trabajadorError)
      throw new Error('Usuario no encontrado en la base de datos')
    }
    
    if (!trabajador) {
      throw new Error('Usuario no encontrado')
    }
    
    console.log('Trabajador found:', trabajador.nombre_completo, 'RUT:', trabajador.rut)
    
    // Generar la contraseña automática
    const generatedPassword = generatePassword(trabajador.nombre_completo)
    console.log('Generated password:', generatedPassword)
    
    // Verificar si coincide con la contraseña almacenada (si existe)
    if (trabajador.contraseña && trabajador.contraseña !== generatedPassword) {
      console.log('Using stored password instead of generated one')
    }
    
    // Para este sistema simplificado, vamos a crear una sesión simulada
    // Guardar información del trabajador en localStorage para simular sesión
    const sessionData = {
      user: {
        id: trabajador.id.toString(),
        email: `${trabajador.rut}@empresa.com`, // Usar RUT como email base
        user_metadata: {
          full_name: trabajador.nombre_completo,
          trabajador_id: trabajador.id,
          rut: trabajador.rut,
          rol: trabajador.rol,
          turno_habitual: trabajador.turno_habitual
        }
      },
      trabajador: trabajador
    }
    
    localStorage.setItem('supabase_session', JSON.stringify(sessionData))
    
    console.log('Login successful')
    return { data: sessionData, error: null }
  } catch (error) {
    console.error('Error in signInWithName:', error)
    throw error
  }
}

// Función para verificar la conexión con Supabase
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('trabajadores')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Connection test failed:', error)
      return false
    }
    
    console.log('Supabase connection successful')
    return true
  } catch (error) {
    console.error('Connection test error:', error)
    return false
  }
}

// Función para obtener la sesión actual
export async function getCurrentSession() {
  try {
    const sessionData = localStorage.getItem('supabase_session')
    if (!sessionData) return null
    
    return JSON.parse(sessionData)
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

// Función para cerrar sesión
export async function signOut() {
  localStorage.removeItem('supabase_session')
  window.location.href = '/login'
}

export async function signInWithEmail(email: string, password: string) {
  // Implementación básica para compatibilidad
  throw new Error('Login por email no implementado en este sistema')
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  throw new Error('Registro no implementado en este sistema')
}

export async function getCurrentUser() {
  const session = await getCurrentSession()
  return session?.user || null
}

export async function getProfile(userId: string): Promise<Trabajador | null> {
  try {
    const { data, error } = await supabase
      .from('trabajadores')
      .select('*')
      .eq('id', parseInt(userId))
      .single()
    
    if (error) {
      console.error('Error fetching trabajador:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('Error in getProfile:', error)
    return null
  }
}

export async function updateProfile(userId: string, updates: Partial<Trabajador>) {
  const { data, error } = await supabase
    .from('trabajadores')
    .update(updates)
    .eq('id', parseInt(userId))
    .select()
    .single()
  
  if (error) throw error
  return data
}