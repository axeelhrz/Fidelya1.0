const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testDatabase() {
  console.log('🗄️  VERIFICANDO BASE DE DATOS\n');

  const tables = [
    'guardians',
    'students', 
    'products',
    'orders',
    'order_items',
    'payments',
    'settings'
  ];

  let allTablesExist = true;

  for (const table of tables) {
    try {
      console.log(`📋 Verificando tabla: ${table}...`);
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ Error en tabla ${table}:`, error.message);
        allTablesExist = false;
      } else {
        console.log(`✅ Tabla ${table} existe`);
      }
    } catch (error) {
      console.log(`❌ Error verificando ${table}:`, error.message);
      allTablesExist = false;
    }
  }

  console.log('\n📊 RESUMEN:');
  if (allTablesExist) {
    console.log('✅ Todas las tablas existen');
    
    // Contar registros
    console.log('\n📈 CONTANDO REGISTROS:');
    for (const table of tables) {
      try {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        console.log(`   ${table}: ${count || 0} registros`);
      } catch (error) {
        console.log(`   ${table}: Error contando`);
      }
    }
  } else {
    console.log('❌ Faltan algunas tablas - necesitas ejecutar el script SQL');
  }

  return allTablesExist;
}

testDatabase();