import { NextRequest, NextResponse } from 'next/server';
import DatabaseAPI from '../../../lib/database';

// GET /api/menus - Obtener todos los menús
export async function GET() {
  try {
    const menus = DatabaseAPI.menus.getAll();
    return NextResponse.json({ success: true, data: menus });
  } catch (error) {
    console.error('Error en GET /api/menus:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/menus - Crear un nuevo menú
export async function POST(request: NextRequest) {
  try {
    const menuData = await request.json();
    
    if (!menuData.id || !menuData.name || !menuData.description) {
      return NextResponse.json(
        { success: false, error: 'Datos del menú incompletos' },
        { status: 400 }
      );
    }

    const success = DatabaseAPI.menus.create(menuData);
    
    if (success) {
      return NextResponse.json({ success: true, data: menuData });
    } else {
      return NextResponse.json(
        { success: false, error: 'Error creando el menú' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en POST /api/menus:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}