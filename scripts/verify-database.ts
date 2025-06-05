import { supabase } from '../src/lib/supabase/client'

async function verifyDatabase() {
  console.log('🔍 Verificando conexión a Supabase...')
  
  try {
    // 1. Verificar conexión básica
    const { data: connectionTest, error: connectionError } = await supabase
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
        const { data, error } = await supabase
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
        .rpc('diagnose_auth_system')
      
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
        configData?.forEach((config: any) => {
          console.log(`  - ${config.key}: ${config.description || 'Sin descripción'}`)
        })
      }
    } catch (err) {
      console.error('❌ Error verificando configuración:', err)
    }
    
    // 5. Verificar datos de ejemplo
    console.log('\n📊 Verificando datos existentes...')
    
    const { data: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    const { data: menuCount } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true })
    
    const { data: ordersCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📈 Estadísticas:`)
    console.log(`  - Usuarios: ${usersCount?.length || 0}`)
    console.log(`  - Items de menú: ${menuCount?.length || 0}`)
    console.log(`  - Pedidos: ${ordersCount?.length || 0}`)
    
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
