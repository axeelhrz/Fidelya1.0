import { NextRequest, NextResponse } from 'next/server';
// POST /api/database/seed - Inicializar la base de datos con datos del archivo
export async function POST(request: NextRequest) {
  try {
    console.log('=== POST /api/database/seed ===');
    const body = await request.json().catch(() => ({}));
    const { force = false } = body;
    console.log('Seed request with force:', force);

    const DatabaseAPI = await import('../../../../lib/database').then(m => m.default);
    const db = await DatabaseAPI;

    // Verificar si ya hay datos (solo si no es forzado)
    if (!force && await db.utils.hasData()) {
      console.log('Database already has data, not seeding');
      return NextResponse.json({
        success: false,
        error: 'La base de datos ya contiene datos. Use force: true para sobrescribir.'
      }, { status: 400 });
    }

    // Si es forzado, limpiar la base de datos primero
    if (force) {
      console.log('Force flag set, clearing database first');
      await db.utils.clearAll();
    }

    console.log('Starting database seeding...');
    const success = await db.utils.seedFromFile();
    console.log('Seeding result:', success);
    
    if (success) {
      const info = await db.utils.getInfo();
      console.log('Database info after seeding:', info);
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
    console.log('=== GET /api/database/seed ===');
    const DatabaseAPI = await import('../../../../lib/database').then(m => m.default);
    const db = await DatabaseAPI;
    const info = await db.utils.getInfo();
    console.log('Database info:', info);
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