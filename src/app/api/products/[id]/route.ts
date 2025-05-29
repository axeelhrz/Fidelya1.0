import { NextRequest, NextResponse } from 'next/server';
import DatabaseAPI from '../../../../lib/database';

// PUT /api/products/[id] - Actualizar un producto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { product, menuId } = await request.json();
    product.id = params.id;

    const success = DatabaseAPI.products.update(product, menuId);
    
    if (success) {
      return NextResponse.json({ success: true, data: product });
    } else {
      return NextResponse.json(
        { success: false, error: 'Error actualizando el producto' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en PUT /api/products/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Eliminar un producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = DatabaseAPI.products.delete(params.id);
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Producto eliminado correctamente' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Error eliminando el producto' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en DELETE /api/products/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}