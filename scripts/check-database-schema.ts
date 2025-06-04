import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gyucjmjbdwishgqikeos.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dWNqbWpiZHdpc2hncWlrZW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5OTAxODAsImV4cCI6MjA2NDU2NjE4MH0.GRd-o4kVcPxcEvMFybON1s0LNETJQWgvpXWqyiYWA5E'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabaseSchema() {
  console.log('🔍 Verificando esquema de base de datos...\n')
  
  const tablesToCheck = [
    'guardians',
    'students', 
    'almuerzos',
    'colaciones',
    'pedidos',
    'clientes'
  ]

  for (const table of tablesToCheck) {
    try {
      console.log(`📋 Verificando tabla: ${table}`)
      
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .limit(1)

      if (error) {
        console.log(`❌ Error en tabla ${table}:`, error.message)
      } else {
        console.log(`✅ Tabla ${table} existe - Registros: ${count || 0}`)
      }
    } catch (err) {
      console.log(`❌ Error verificando ${table}:`, err)
    }
    console.log('')
  }

  // Verificar estructura específica de algunas tablas
  console.log('🔍 Verificando estructura de tablas existentes...\n')
  
  try {
    const { data: guardiansData } = await supabase
      .from('guardians')
      .select('*')
      .limit(1)
    
    if (guardiansData && guardiansData.length > 0) {
      console.log('📋 Estructura de guardians:', Object.keys(guardiansData[0]))
    }
  } catch (err) {
    console.log('❌ No se pudo verificar estructura de guardians')
  }

  try {
    const { data: studentsData } = await supabase
      .from('students')
      .select('*')
      .limit(1)
    
    if (studentsData && studentsData.length > 0) {
      console.log('📋 Estructura de students:', Object.keys(studentsData[0]))
    }
  } catch (err) {
    console.log('❌ No se pudo verificar estructura de students')
  }
}

checkDatabaseSchema().catch(console.error)