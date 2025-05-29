import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseAPI } from '../../../lib/database';

// POST /api/products - Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    console.log('=== POST /api/products ===');
    const { product, menuId } = await request.json();
    console.log('Creating product:', product, 'in menu:', menuId);
    
    if (!product || !menuId) {
      return NextResponse.json(
        { success: false, error: 'Datos del producto incompletos' },
        { status: 400 }
      );
    }

    const DatabaseAPI = await getDatabaseAPI();
    const success = await DatabaseAPI.products.create(product, menuId);
    
    if (success) {
      return NextResponse.json({ success: true, data: product });
    } else {
      return NextResponse.json(
        { success: false, error: 'Error creando el producto' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en POST /api/products:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}