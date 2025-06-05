import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createInitialSocio() {
  // Crea el usuario Pascal Letelier
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'Pascal Letelier', // Solo el nombre como correo, según requerimiento
    password: 'Delicias1234',
    email_confirm: true,
    user_metadata: { rol: 'socio', nombre: 'Pascal Letelier' }
  });

  if (error) {
    throw new Error('No se pudo crear el socio inicial: ' + error.message);
  }
  return data;
}
