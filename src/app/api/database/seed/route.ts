import { NextRequest, NextResponse } from 'next/server';
import DatabaseAPI from '../../../../lib/database-json';

// POST /api/database/seed - Inicializar la base de datos con datos del archivo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { force = false } = body;

    // Verificar si ya hay datos (solo si no es forzado)
    if (!force && DatabaseAPI.utils.hasData()) {
      return NextResponse.json({
        success: false,
        error: 'La base de datos ya contiene datos. Use force: true para sobrescribir.'
      }, { status: 400 });
    }

    // Si es forzado, limpiar la base de datos primero
    if (force) {
      DatabaseAPI.utils.clearAll();
    }

    const success = await DatabaseAPI.utils.seedFromFile();
    
    if (success) {
      const info = DatabaseAPI.utils.getInfo();
      return NextResponse.json({
        success: true,
        message: 'Base de datos inicializada correctamente con datos del archivo',
        data: info
      });
    } else {
    return NextResponse.json({
      success: false,
        error: 'Error inicializando la base de datos'
    }, { status: 500 });
  }
  } catch (error) {
    console.error('Error en POST /api/database/seed:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
}
}

// GET /api/database/seed - Obtener información de la base de datos
export async function GET() {
  try {
    const info = DatabaseAPI.utils.getInfo();
    return NextResponse.json({
      success: true,
      data: info
    });
  } catch (error) {
    console.error('Error en GET /api/database/seed:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}