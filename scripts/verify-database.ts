import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/lib/supabase/database.types'

interface DiagnosticItem {
  component: string
  status: string
  details: string
}

interface SystemConfig {
  key: string
  description?: string
  value?: string
}

// Cargar variables de entorno
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas')
  console.log('Verificar que .env.local contenga:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

async function verifyDatabase() {
  console.log('🔍 Verificando conexión a Supabase...')
  console.log(`📍 URL: ${supabaseUrl}`)
  
  try {
    // 1. Verificar conexión básica
    const { error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      console.error('❌ Error de conexión:', connectionError.message)
      return false
    }
    
    console.log('✅ Conexión a Supabase exitosa')
    
    // 2. Verificar tablas principales
    const tables = ['users', 'students', 'menu_items', 'orders', 'payment_transactions']
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.error(`❌ Error en tabla ${table}:`, error.message)
        } else {
          console.log(`✅ Tabla ${table} accesible`)
        }
      } catch (err) {
        console.error(`❌ Error verificando tabla ${table}:`, err)
      }
    }
    
    // 3. Verificar funciones
    console.log('\n🔧 Verificando funciones...')
    
    try {
      const { data: diagData, error: diagError } = await supabase
        .rpc('get_system_diagnostics')
      
      if (diagError) {
        console.error('❌ Error ejecutando diagnóstico:', diagError.message)
      } else {
        console.log('✅ Diagnóstico del sistema:')
        diagData?.forEach((item: any) => {
          const status = item.status === 'OK' ? '✅' : '❌'
          console.log(`  ${status} ${item.component}: ${item.details}`)
        })
      }
    } catch (err) {
      console.error('❌ Error en diagnóstico:', err)
    }
    
    // 4. Verificar configuración del sistema
    console.log('\n⚙️ Verificando configuración...')
    
    try {
      const { data: configData, error: configError } = await supabase
        .from('system_config')
        .select('*')
      
      if (configError) {
        console.error('❌ Error obteniendo configuración:', configError.message)
      } else {
        console.log(`✅ Configuraciones encontradas: ${configData?.length || 0}`)
        configData?.forEach((config: SystemConfig) => {
          console.log(`  - ${config.key}: ${config.description || 'Sin descripción'}`)
        })
      }
    } catch (err) {
      console.error('❌ Error verificando configuración:', err)
    }
    
    // 5. Verificar datos de ejemplo
    console.log('\n📊 Verificando datos existentes...')
    
    const { data: usersData, count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
    
    const { data: menuData, count: menuCount } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact' })
    
    const { data: ordersData, count: ordersCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
    
    console.log(`📈 Estadísticas:`)
    console.log(`  - Usuarios: ${usersCount || 0}`)
    console.log(`  - Items de menú: ${menuCount || 0}`)
    console.log(`  - Pedidos: ${ordersCount || 0}`)
    
    // 6. Mostrar algunos datos de ejemplo si existen
    if (usersData && usersData.length > 0) {
      console.log('\n👥 Usuarios existentes:')
      usersData.slice(0, 3).forEach((user: any) => {
        console.log(`  - ${user.full_name} (${user.email}) - Rol: ${user.role}`)
      })
    }
    
    if (menuData && menuData.length > 0) {
      console.log('\n🍽️ Menús existentes:')
      menuData.slice(0, 3).forEach((menu: any) => {
        console.log(`  - ${menu.name} - ${menu.category} - $${menu.price_student}`)
      })
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Error general:', error)
    return false
  }
}

// Ejecutar verificación
verifyDatabase()
  .then((success) => {
    if (success) {
      console.log('\n🎉 Verificación completada exitosamente!')
    } else {
      console.log('\n⚠️ Verificación completada con errores')
    }
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })