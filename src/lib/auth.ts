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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

// Función de login personalizada por nombre
export async function signInWithName(fullName: string) {
  try {
    // Buscar el usuario por nombre completo
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('full_name', fullName)
      .single()
    
    if (profileError || !profile) {
      throw new Error('Usuario no encontrado')
    }
    
    // Generar la contraseña automática
    const password = generatePassword(fullName)
    
    // Intentar hacer login con email y contraseña generada
    const { data, error } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: password,
    })
    
    if (error) {
      // Si falla el login, intentar crear/actualizar la contraseña del usuario
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        profile.id,
        { password: password }
      )
      
      if (updateError) {
        throw new Error('Error al actualizar credenciales')
      }
      
      // Intentar login nuevamente
      const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: password,
      })
      
      if (retryError) throw retryError
      return retryData
    }
    
    return data
  } catch (error) {
    console.error('Error in signInWithName:', error)
    throw error
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
  
  if (error) return null
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