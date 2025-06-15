import { supabase } from './supabase'
import { Trabajador } from '@/types/database'

// Función para generar contraseña automática
export function generatePassword(nombre: string, apellido: string): string {
  if (!nombre || !apellido) return ''
  
  // Primera letra del nombre + apellido completo, todo en mayúsculas
  return (nombre.charAt(0) + apellido).toUpperCase()
}

// Función para obtener el nombre completo
export function getFullName(trabajador: Trabajador): string {
  return `${trabajador.nombre} ${trabajador.apellido}`
}

// Función para obtener todos los trabajadores activos
export async function getAllUsers(): Promise<Trabajador[]> {
  try {
    console.log('Fetching trabajadores from Supabase...')
    
    const { data, error } = await supabase
      .from('trabajadores')
      .select('*')
      .eq('activo', true)
      .order('nombre')
    
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
export async function signInWithName(fullName: string) {
  try {
    console.log('Attempting to sign in with name:', fullName)
    
    // Separar nombre y apellido
    const nameParts = fullName.trim().split(' ')
    if (nameParts.length < 2) {
      throw new Error('Formato de nombre inválido')
    }
    
    const nombre = nameParts[0]
    const apellido = nameParts.slice(1).join(' ')
    
    // Buscar el trabajador por nombre y apellido
    const { data: trabajador, error: trabajadorError } = await supabase
      .from('trabajadores')
      .select('*')
      .eq('nombre', nombre)
      .eq('apellido', apellido)
      .eq('activo', true)
      .single()
    
    if (trabajadorError) {
      console.error('Trabajador error:', trabajadorError)
      throw new Error('Usuario no encontrado en la base de datos')
    }
    
    if (!trabajador) {
      throw new Error('Usuario no encontrado')
    }
    
    console.log('Trabajador found:', trabajador.email)
    
    // Generar la contraseña automática
    const password = generatePassword(trabajador.nombre, trabajador.apellido)
    console.log('Generated password:', password)
    
    // Para este sistema simplificado, vamos a crear una sesión simulada
    // En un sistema real, necesitarías integrar con Supabase Auth
    
    // Guardar información del trabajador en localStorage para simular sesión
    const sessionData = {
      user: {
        id: trabajador.id.toString(),
        email: trabajador.email,
        user_metadata: {
          full_name: getFullName(trabajador),
          trabajador_id: trabajador.id
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