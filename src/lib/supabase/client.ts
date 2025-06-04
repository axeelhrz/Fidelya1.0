import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

// Verificar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Variables de entorno de Supabase no configuradas. Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local')
}

// Cliente principal de Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Cliente con privilegios de servicio para operaciones administrativas
export function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY no configurada, usando cliente normal')
    return supabase
  }
  return createClient<Database>(supabaseUrl!, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Función para verificar la conexión
export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Error de conexión a Supabase:', error)
      return false
    }
    
    console.log('✅ Conexión a Supabase exitosa')
    return true
  } catch (error) {
    console.error('Error al probar conexión:', error)
    return false
  }
}