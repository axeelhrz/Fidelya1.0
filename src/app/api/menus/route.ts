import { NextRequest, NextResponse } from 'next/server';
import { firebaseDB } from '../../../lib/firebase-database';

export async function GET() {
  try {
    const menus = await firebaseDB.getMenus();
    
    return NextResponse.json({
      success: true,
      data: menus
    });
  } catch (error) {
    console.error('Error en GET /api/menus:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, isActive = true } = body;

    if (!name || !description) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nombre y descripción son requeridos' 
        },
        { status: 400 }
      );
    }

    const newMenu = await firebaseDB.createMenu({
      name,
      description,
      isActive
    });

    return NextResponse.json({
      success: true,
      data: newMenu
    }, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/menus:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID del menú es requerido' 
        },
        { status: 400 }
      );
    }

    const updatedMenu = await firebaseDB.updateMenu(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedMenu
    });
  } catch (error) {
    console.error('Error en PUT /api/menus:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID del menú es requerido' 
        },
        { status: 400 }
      );
    }

    await firebaseDB.deleteMenu(id);

    return NextResponse.json({
      success: true,
      message: 'Menú eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en DELETE /api/menus:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}