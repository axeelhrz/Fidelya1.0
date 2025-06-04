/**
 * Configuración centralizada de variables de entorno
 */

// Función para obtener variable de entorno con validación
function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue
  if (!value) {
    throw new Error(`❌ Variable de entorno requerida no encontrada: ${name}`)
  }
  return value
}

// Función para obtener variable opcional
function getOptionalEnvVar(name: string, defaultValue?: string): string | undefined {
  return process.env[name] || defaultValue
}

export const config = {
  // Supabase
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    serviceRoleKey: getOptionalEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
  },

  // GetNet
  getnet: {
    login: getEnvVar('GETNET_LOGIN'),
    secret: getEnvVar('GETNET_SECRET'),
    baseUrl: getEnvVar('GETNET_BASE_URL'),
  },

  // Application
  app: {
    url: getEnvVar('NEXT_PUBLIC_APP_URL'),
    environment: process.env.NODE_ENV || 'development',
  },

  // Email (opcional)
  email: {
    resendApiKey: getOptionalEnvVar('RESEND_API_KEY'),
  },

  // Security (opcional)
  auth: {
    secret: getOptionalEnvVar('NEXTAUTH_SECRET'),
    url: getOptionalEnvVar('NEXTAUTH_URL'),
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