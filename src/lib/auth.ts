import { supabase } from './supabase'
import { Profile } from '@/types/database'

// Función para generar contraseña automática
export function generatePassword(fullName: string): string {
  if (!fullName) return ''
  
  const nameParts = fullName.trim().split(' ')
  if (nameParts.length < 2) return ''
  
  const firstName = nameParts[0]
  const lastName = nameParts[nameParts.length - 1] // Tomar el último apellido
  
  // Primera letra del nombre + apellido completo, todo en mayúsculas
  return (firstName.charAt(0) + lastName).toUpperCase()
}

// Función para obtener todos los usuarios registrados
export async function getAllUsers(): Promise<Profile[]> {
  try {
    console.log('Fetching users from Supabase...')
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name')
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    console.log('Users fetched successfully:', data?.length || 0, 'users')
    return data || []
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

// Función de login personalizada por nombre
export async function signInWithName(fullName: string) {
  try {
    console.log('Attempting to sign in with name:', fullName)
    
    // Buscar el usuario por nombre completo
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('full_name', fullName)
      .single()
    
    if (profileError) {
      console.error('Profile error:', profileError)
      throw new Error('Usuario no encontrado en la base de datos')
    }
    
    if (!profile) {
      throw new Error('Usuario no encontrado')
    }
    
    console.log('Profile found:', profile.email)
    
    // Generar la contraseña automática
    const password = generatePassword(fullName)
    console.log('Generated password:', password)
    
    // Intentar hacer login con email y contraseña generada
    const { data, error } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: password,
    })
    
    if (error) {
      console.error('Auth error:', error)
      throw new Error(`Error de autenticación: ${error.message}`)
    }
    
    console.log('Login successful')
    return data
  } catch (error) {
    console.error('Error in signInWithName:', error)
    throw error
  }
}

// Función para verificar la conexión con Supabase
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
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

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })
  
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}