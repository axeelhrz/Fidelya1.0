import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Solo para desarrollo - crear admin inicial
export async function POST(req: NextRequest) {
  try {
    // Verificar que estamos en desarrollo
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Esta función solo está disponible en desarrollo' },
        { status: 403 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { email, password, name } = await req.json();

    // Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { 
        role: 'super_admin',
        name 
      }
    });

    if (authError) {
      throw new Error(`Error creando usuario: ${authError.message}`);
    }

    // Crear registro en clientes con rol de super_admin
    const { error: clienteError } = await supabase
      .from('clientes')
      .insert([{
        correo_apoderado: email,
        nombre_apoderado: name,
        rol: 'super_admin',
        hijos: []
      }]);

    if (clienteError) {
      // Si falla, eliminar el usuario de Auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Error creando perfil: ${clienteError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Administrador creado exitosamente',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: 'super_admin'
      }
    });

  } catch (error: unknown) {
    console.error('Error creating admin:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
