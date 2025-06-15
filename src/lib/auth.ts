import { supabase } from './supabase'
import { Funcionario } from '@/types/database'

// Función para generar contraseña automática
export function generatePassword(nombre: string, apellido: string): string {
  if (!nombre || !apellido) return ''
  
  // Primera letra del nombre + apellido completo, todo en mayúsculas
  return (nombre.charAt(0) + apellido).toUpperCase()
}

// Función para obtener el nombre completo
export function getFullName(funcionario: Funcionario): string {
  return `${funcionario.nombre} ${funcionario.apellido}`
}

// Función para obtener todos los funcionarios activos
export async function getAllUsers(): Promise<Funcionario[]> {
  try {
    console.log('Fetching funcionarios from Supabase...')
    
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('activo', true)
      .order('nombre')
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    console.log('Funcionarios fetched successfully:', data?.length || 0, 'users')
    return data || []
  } catch (error) {
    console.error('Error fetching funcionarios:', error)
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
    
    // Buscar el funcionario por nombre y apellido
    const { data: funcionario, error: funcionarioError } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('nombre', nombre)
      .eq('apellido', apellido)
      .eq('activo', true)
      .single()
    
    if (funcionarioError) {
      console.error('Funcionario error:', funcionarioError)
      throw new Error('Usuario no encontrado en la base de datos')
    }
    
    if (!funcionario) {
      throw new Error('Usuario no encontrado')
    }
    
    console.log('Funcionario found:', funcionario.email)
    
    // Generar la contraseña automática
    const password = generatePassword(funcionario.nombre, funcionario.apellido)
    console.log('Generated password:', password)
    
    // Para este sistema simplificado, vamos a crear una sesión simulada
    // En un sistema real, necesitarías integrar con Supabase Auth
    
    // Guardar información del funcionario en localStorage para simular sesión
    const sessionData = {
      user: {
        id: funcionario.id.toString(),
        email: funcionario.email,
        user_metadata: {
          full_name: getFullName(funcionario),
          funcionario_id: funcionario.id
        }
      },
      funcionario: funcionario
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
    const { error } = await supabase
      .from('funcionarios')
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

export async function signInWithEmail() {
  // Implementación básica para compatibilidad
  throw new Error('Login por email no implementado en este sistema')
}

export async function signUpWithEmail() {
  throw new Error('Registro no implementado en este sistema')
}

export async function getCurrentUser() {
  const session = await getCurrentSession()
  return session?.user || null
}

export async function getProfile(userId: string): Promise<Funcionario | null> {
  try {
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('id', parseInt(userId))
      .single()
    
    if (error) {
      console.error('Error fetching funcionario:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('Error in getProfile:', error)
    return null
  }
}

export async function updateProfile(userId: string, updates: Partial<Funcionario>) {
  const { data, error } = await supabase
    .from('funcionarios')
    .update(updates)
    .eq('id', parseInt(userId))
    .select()
    .single()
  
  if (error) throw error
  return data
}