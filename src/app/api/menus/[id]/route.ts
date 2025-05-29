import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseAPI } from '../../../../lib/database';

// GET /api/menus/[id] - Obtener un menú específico
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log('=== GET /api/menus/[id] ===');
    const { id } = await context.params;
    console.log('Getting menu:', id);
    
    const DatabaseAPI = await getDatabaseAPI();
    const menu = await DatabaseAPI.menus.get(id);
    
    if (menu) {
    return NextResponse.json({ success: true, data: menu });
    } else {
      return NextResponse.json(
        { success: false, error: 'Menú no encontrado' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error en GET /api/menus/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/menus/[id] - Actualizar un menú
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log('=== PUT /api/menus/[id] ===');
    const { id } = await context.params;
    const menuData = await request.json();
    console.log('Updating menu:', id, menuData);
    
    if (!menuData.name || !menuData.description) {
      return NextResponse.json(
        { success: false, error: 'Datos del menú incompletos' },
        { status: 400 }
      );
    }

    // Asegurar que el ID coincida
    menuData.id = id;

    const DatabaseAPI = await getDatabaseAPI();
    const success = await DatabaseAPI.menus.update(menuData);
    
    if (success) {
      return NextResponse.json({ success: true, data: menuData });
    } else {
    return NextResponse.json(
        { success: false, error: 'Error actualizando el menú' },
      { status: 500 }
    );
  }
  } catch (error) {
    console.error('Error en PUT /api/menus/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
}
}

// DELETE /api/menus/[id] - Eliminar un menú
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log('=== DELETE /api/menus/[id] ===');
    const { id } = await context.params;
    console.log('Deleting menu:', id);
    
    const DatabaseAPI = await getDatabaseAPI();
    const success = await DatabaseAPI.menus.delete(id);
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Menú eliminado correctamente' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Error eliminando el menú' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en DELETE /api/menus/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}