const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testLogin() {
  console.log('🔐 Probando login directo con Supabase...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'axeelhrz@gmail.com',
      password: 'Elcap5156636-0'
    });

    if (error) {
      console.log('❌ Error de login:', error.message);
      return false;
    }

    console.log('✅ Login exitoso');
    console.log('👤 Usuario:', data.user?.email);
    
    // Probar obtener guardian
    const { data: guardian, error: guardianError } = await supabase
      .from('guardians')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (guardianError) {
      console.log('❌ Error obteniendo guardian:', guardianError.message);
      return false;
    }

    console.log('👥 Guardian encontrado:', guardian?.full_name);
    return true;

  } catch (error) {
    console.log('❌ Error general:', error.message);
    return false;
  }
}

testLogin();