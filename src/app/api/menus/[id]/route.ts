import { NextRequest, NextResponse } from 'next/server';
import DatabaseAPI from '../../../../lib/database';

// GET /api/menus/[id] - Obtener un menú específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const menu = DatabaseAPI.menus.get(id);
    
    if (!menu) {
      return NextResponse.json(
        { success: false, error: 'Menú no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: menu });
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const menuData = await request.json();
    menuData.id = id;

    const success = DatabaseAPI.menus.update(menuData);
    
    if (success) {
      const updatedMenu = DatabaseAPI.menus.get(id);
      return NextResponse.json({ success: true, data: updatedMenu });
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = DatabaseAPI.menus.delete(id);
    
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