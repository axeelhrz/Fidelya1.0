import { NextResponse } from 'next/server';
import DatabaseAPI from '../../../../lib/database';

// POST /api/database/seed - Inicializar la base de datos con datos del archivo
export async function POST() {
  try {
    // Verificar si ya hay datos
    if (DatabaseAPI.utils.hasData()) {
      return NextResponse.json({
        success: false,
        error: 'La base de datos ya contiene datos. Use /api/database/reset para reiniciar.'
      }, { status: 400 });
    }

    const success = await DatabaseAPI.utils.seedFromFile();
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Base de datos inicializada correctamente con datos del archivo'
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