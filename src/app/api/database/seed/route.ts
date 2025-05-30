import { NextRequest, NextResponse } from 'next/server';
import { firebaseDB } from '../../../../lib/firebase-database';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    // Verificar contraseña de administrador
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Contraseña de administrador incorrecta' 
        },
        { status: 401 }
      );
    }

    await firebaseDB.initializeDatabase();

    return NextResponse.json({
      success: true,
      message: 'Base de datos inicializada correctamente con datos de ejemplo'
    });
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const password = searchParams.get('password');

    // Verificar contraseña de administrador
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Contraseña de administrador incorrecta' 
        },
        { status: 401 }
      );
    }

    if (action === 'export') {
      const data = await firebaseDB.exportData();
      
      return NextResponse.json({
        success: true,
        data,
        message: 'Datos exportados correctamente'
      });
    }

    if (action === 'schema') {
      const schema = firebaseDB.getSchemaInfo();
      
      return NextResponse.json({
        success: true,
        data: schema,
        message: 'Información del esquema obtenida'
      });
    }

    if (action === 'statistics') {
      const statistics = await firebaseDB.getStatistics();
      
      return NextResponse.json({
        success: true,
        data: statistics,
        message: 'Estadísticas obtenidas correctamente'
      });
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Acción no válida. Usa: export, schema, o statistics' 
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error en operación de base de datos:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}