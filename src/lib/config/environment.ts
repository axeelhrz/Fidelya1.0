/**
 * Configuración centralizada de variables de entorno
 */
import { z } from 'zod'

// Función para obtener variable de entorno con validación
function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue
  if (!value) {
    throw new Error(`Environment variable ${name} is required`)
  }
  return value
}

// Schema de validación para variables de entorno
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // GetNet
  GETNET_LOGIN: z.string().min(1),
  GETNET_SECRET: z.string().min(1),
  GETNET_BASE_URL: z.string().url(),
  
  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  
  // Email
  RESEND_API_KEY: z.string().min(1).optional(),
  
  // Security
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  
  // Casino specific
  CASINO_NAME: z.string().default('Casino Escolar'),
  CASINO_EMAIL: z.string().email().default('contacto@casinoescolar.cl'),
  CASINO_PHONE: z.string().default('+56912345678'),
  ORDER_CUTOFF_HOUR: z.string().default('10'),
})

function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Invalid environment variables:', error)
    throw new Error('Invalid environment variables')
  }
}
  
export const env = validateEnv()

export const config = {
  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },
  getnet: {
    login: env.GETNET_LOGIN,
    secret: env.GETNET_SECRET,
    baseUrl: env.GETNET_BASE_URL,
  },
  app: {
    url: env.NEXT_PUBLIC_APP_URL,
    environment: env.NODE_ENV,
  },
  email: {
    resendApiKey: env.RESEND_API_KEY,
  },
  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL,
  },
  casino: {
    name: env.CASINO_NAME,
    email: env.CASINO_EMAIL,
    phone: env.CASINO_PHONE,
    orderCutoffHour: parseInt(env.ORDER_CUTOFF_HOUR),
  },
} as const

export type Config = typeof config

/**
 * Validar que todas las variables requeridas estén configuradas
 */
export function validateEnvironment() {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'GETNET_LOGIN',
    'GETNET_SECRET',
    'GETNET_BASE_URL',
    'NEXT_PUBLIC_APP_URL'
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    console.error('❌ Variables de entorno faltantes:', missingVars)
    throw new Error(`Variables de entorno faltantes: ${missingVars.join(', ')}`)
  }

  console.log('✅ Variables de entorno validadas correctamente')
  return true
}

/**
 * Verificar configuración y mostrar información
 */
export function checkConfiguration() {
  try {
    validateEnvironment()
    
    console.log('🚀 Configuración de la aplicación:')
    console.log(`   • Entorno: ${config.app.environment}`)
    console.log(`   • URL de la app: ${config.app.url}`)
    console.log(`   • Supabase URL: ${config.supabase.url}`)
    console.log(`   • GetNet URL: ${config.getnet.baseUrl}`)
    
    return true
  } catch (error) {
    console.error('❌ Error en la configuración:', error)
    return false
  }
}

// Verificar configuración al importar (solo en desarrollo)
if (config.app.environment === 'development') {
  checkConfiguration()
}
