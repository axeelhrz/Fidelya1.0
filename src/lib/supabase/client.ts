import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

// Usar las credenciales correctas del proyecto
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://koesipeybsasrknvgntg.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZXNpcGV5YnNhc3JrbnZnbnRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5Mzg2MzEsImV4cCI6MjA1ODUxNDYzMX0.zLUMG6PRVJK1pEaAdO4pssFKGp8XMx9VAvwii4Xw1iU"
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Cliente con privilegios de servicio para operaciones administrativas
export const createServiceClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY no está configurada')
  }
  
  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}