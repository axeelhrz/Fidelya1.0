import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Cargar variables de entorno
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  console.log('🚀 Configurando base de datos...')
  
  try {
    // Leer el archivo SQL
    const sqlPath = join(process.cwd(), 'supabase', 'setup-database.sql')
    const sqlContent = readFileSync(sqlPath, 'utf-8')
    
    console.log('📄 Ejecutando script SQL...')
    
    // Ejecutar el script SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: sqlContent
    })
    
    if (error) {
      console.error('❌ Error ejecutando SQL:', error.message)
      
      // Intentar ejecutar por partes si falla
      console.log('🔄 Intentando ejecutar por partes...')
      
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i]
        if (statement) {
          try {
            console.log(`Ejecutando statement ${i + 1}/${statements.length}...`)
            const { error: stmtError } = await supabase.rpc('exec_sql', {
              sql: statement + ';'
            })
            
            if (stmtError) {
              console.warn(`⚠️ Warning en statement ${i + 1}: ${stmtError.message}`)
            }
          } catch (err) {
            console.warn(`⚠️ Error en statement ${i + 1}:`, err)
          }
        }
      }
    } else {
      console.log('✅ Script SQL ejecutado exitosamente')
    }
    
    // Verificar que las tablas se crearon
    console.log('\n🔍 Verificando tablas creadas...')
    
    const tables = ['users', 'students', 'menu_items', 'orders', 'payment_transactions', 'system_config']
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.error(`❌ Error verificando tabla ${table}:`, error.message)
        } else {
          console.log(`✅ Tabla ${table} creada correctamente`)
        }
      } catch (err) {
        console.error(`❌ Error verificando tabla ${table}:`, err)
      }
    }
    
    console.log('\n🎉 Configuración de base de datos completada!')
    return true
    
  } catch (error) {
    console.error('💥 Error fatal:', error)
    return false
  }
}

setupDatabase()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('💥 Error:', error)
    process.exit(1)
  })
