const { createClient } = require('@supabase/supabase-js');

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Verificando conexión básica...');
console.log('URL:', supabaseUrl ? 'configurada' : 'NO configurada');
console.log('KEY:', supabaseKey ? 'configurada' : 'NO configurada');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Variables de entorno faltantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n📡 Probando conexión...');
    const { data, error } = await supabase.from('settings').select('*').limit(1);
    
    if (error) {
      console.log('❌ Error de conexión:', error.message);
      return false;
    }
    
    console.log('✅ Conexión exitosa');
    console.log('📊 Datos recibidos:', data?.length || 0, 'registros');
    return true;
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

testConnection();
