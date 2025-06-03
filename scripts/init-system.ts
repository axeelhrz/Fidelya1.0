/**
 * Script de inicialización del sistema
 * Verifica configuración, base de datos y servicios externos
 */

import { createClient } from '@supabase/supabase-js'
import { config, validateEnvironment } from '../src/lib/config/environment'

async function initializeSystem() {
  console.log('🚀 Inicializando sistema Casino Escolar...\n')

  try {
    // 1. Validar variables de entorno
    console.log('1. Validando variables de entorno...')
    validateEnvironment()
    console.log('✅ Variables de entorno OK\n')

    // 2. Verificar conexión a Supabase
    console.log('2. Verificando conexión a Supabase...')
    const supabase = createClient(config.supabase.url, config.supabase.anonKey)
    
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .limit(1)

    if (error) {
      throw new Error(`Error conectando a Supabase: ${error.message}`)
    }

    console.log('✅ Conexión a Supabase OK\n')

    // 3. Verificar configuraciones básicas
    console.log('3. Verificando configuraciones del sistema...')
    const { data: settings } = await supabase
      .from('settings')
      .select('key, value')

    const settingsMap = settings?.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as { [key: string]: string }) || {}

    const requiredSettings = [
      'order_cutoff_time',
      'system_name',
      'contact_email'
    ]

    const missingSettings = requiredSettings.filter(key => !settingsMap[key])

    if (missingSettings.length > 0) {
      console.log(`⚠️ Configuraciones faltantes: ${missingSettings.join(', ')}`)
      console.log('Creando configuraciones por defecto...')

      const defaultSettings = [
        { key: 'order_cutoff_time', value: '10:00:00', description: 'Hora límite para pedidos' },
        { key: 'system_name', value: 'Casino Escolar', description: 'Nombre del sistema' },
        { key: 'contact_email', value: 'casino@colegio.cl', description: 'Email de contacto' }
      ]

      await supabase
        .from('settings')
        .upsert(defaultSettings, { onConflict: 'key' })

      console.log('✅ Configuraciones por defecto creadas')
    } else {
      console.log('✅ Configuraciones del sistema OK')
    }

    console.log('\nConfiguraciones actuales:')
    Object.entries(settingsMap).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value}`)
    })
    console.log()

    // 4. Verificar estructura de base de datos
    console.log('4. Verificando estructura de base de datos...')
    const tables = ['guardians', 'students', 'products', 'orders', 'order_items', 'payments', 'settings']
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      if (error) {
        throw new Error(`Tabla '${table}' no existe o no es accesible: ${error.message}`)
      }
    }

    console.log('✅ Estructura de base de datos OK\n')

    // 5. Verificar GetNet (opcional en desarrollo)
    console.log('5. Verificando configuración GetNet...')
    if (config.getnet.login && config.getnet.secret) {
      console.log('✅ Credenciales GetNet configuradas')
    } else {
      console.log('⚠️ Credenciales GetNet no configuradas (requeridas para producción)')
    }
    console.log()

    // 6. Resumen final
    console.log('🎉 Sistema inicializado correctamente!')
    console.log('\nPróximos pasos:')
    console.log('1. Crear usuario administrador inicial')
    console.log('2. Subir menús semanales')
    console.log('3. Configurar notificaciones por email (opcional)')
    console.log('4. Probar flujo completo de pedidos\n')

    return true

  } catch (error) {
    console.error('❌ Error inicializando sistema:', error)
    return false
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeSystem()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('Error fatal:', error)
      process.exit(1)
    })
}

export { initializeSystem }