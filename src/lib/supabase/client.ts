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
const defaultUrl = supabaseUrl || "https://gyucjmjbdwishgqikeos.supabase.co"
const defaultKey = supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dWNqbWpiZHdpc2hncWlrZW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5OTAxODAsImV4cCI6MjA2NDU2NjE4MH0.GRd-o4kVcPxcEvMFybON1s0LNETJQWgvpXWqyiYWA5E"

export const supabase = createClient<Database>(defaultUrl, defaultKey, {
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
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY no configurada')
    return supabase // Retornar cliente normal si no hay service key
  }
  return createClient<Database>(defaultUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}