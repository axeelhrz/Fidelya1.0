/**
 * Configuración centralizada de variables de entorno
 */

export const config = {
  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },

  // GetNet
  getnet: {
    login: process.env.GETNET_LOGIN!,
    secret: process.env.GETNET_SECRET!,
    baseUrl: process.env.GETNET_BASE_URL!,
  },

  // Application
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL!,
    environment: process.env.NODE_ENV || 'development',
  },

  // Email
  email: {
    resendApiKey: process.env.RESEND_API_KEY,
  },

  // Security
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL,
  }
}

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
    throw new Error(`Variables de entorno faltantes: ${missingVars.join(', ')}`)
  }

  console.log('✅ Variables de entorno validadas correctamente')
}

/**
 * Verificar configuración en tiempo de ejecución
 */
export function checkConfiguration() {
  try {
    validateEnvironment()
    
    console.log('🔧 Configuración del sistema:')
    console.log(`- Entorno: ${config.app.environment}`)
    console.log(`- URL de la app: ${config.app.url}`)
    console.log(`- Supabase URL: ${config.supabase.url}`)
    console.log(`- GetNet URL: ${config.getnet.baseUrl}`)
    
    return true
  } catch (error) {
    console.error('❌ Error en configuración:', error)
    return false
  }
}