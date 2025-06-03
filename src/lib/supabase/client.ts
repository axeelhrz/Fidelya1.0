import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

// Verificar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno de Supabase no configuradas')
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local')
}

// Usar valores por defecto si no están configuradas (solo para desarrollo)
const defaultUrl = supabaseUrl || "https://koesipeybsasrknvgntg.supabase.co"
const defaultKey = supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZXNpcGV5YnNhc3JrbnZnbnRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5Mzg2MzEsImV4cCI6MjA1ODUxNDYzMX0.zLUMG6PRVJK1pEaAdO4pssFKGp8XMx9VAvwii4Xw1iU"
export const supabase = createClient<Database>(defaultUrl, defaultKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Cliente con privilegios de servicio para operaciones administrativas
export const createServiceClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZXNpcGV5YnNhc3JrbnZnbnRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjkzODYzMSwiZXhwIjoyMDU4NTE0NjMxfQ.yH6Jj0nvLU4R6zP2yawDq7XCgo1rI-MU6pdDY16E7U4"
  return createClient<Database>(defaultUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}