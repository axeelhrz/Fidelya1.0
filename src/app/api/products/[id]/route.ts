import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseAPI } from '../../../../lib/database';

// PUT /api/products/[id] - Actualizar un producto
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log('=== PUT /api/products/[id] ===');
    const { id } = await context.params;
    const { product, menuId } = await request.json();
    console.log('Updating product:', id, product, 'in menu:', menuId);
    
    if (!product || !menuId) {
      return NextResponse.json(
        { success: false, error: 'Datos del producto incompletos' },
        { status: 400 }
      );
    }

    // Asegurar que el ID coincida
    product.id = id;

    const DatabaseAPI = await getDatabaseAPI();
    const success = await DatabaseAPI.products.update(product, menuId);
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log('=== DELETE /api/products/[id] ===');
    const { id } = await context.params;
    console.log('Deleting product:', id);
    
    const DatabaseAPI = await getDatabaseAPI();
    const success = await DatabaseAPI.products.delete(id);
    
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