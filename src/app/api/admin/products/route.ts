import { NextRequest, NextResponse } from 'next/server';
import { Product } from '../../../types';

// Simulación de base de datos en memoria
const products: Product[] = [
  {
    id: '1',
    menuId: 'menu1',
    name: 'Fernet con Cola',
    price: 2500,
    description: 'Fernet Branca con Coca Cola, hielo y limón',
    category: 'Bebidas',
    isRecommended: true,
    isVegan: true,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    menuId: 'menu1',
    name: 'Empanadas de Carne',
    price: 1800,
    description: 'Empanadas caseras de carne cortada a cuchillo',
    category: 'Tapas',
    isRecommended: false,
    isVegan: false,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET - Obtener todos los productos
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validaciones básicas
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      menuId: body.menuId || 'menu1',
      name: body.name,
      price: Number(body.price),
      description: body.description || '',
      category: body.category,
      isRecommended: Boolean(body.isRecommended),
      isVegan: Boolean(body.isVegan),
      isAvailable: body.isAvailable !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Producto creado correctamente'
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar producto
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de producto requerido' },
        { status: 400 }
      );
    }

    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    products[productIndex] = {
      ...products[productIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: products[productIndex],
      message: 'Producto actualizado correctamente'
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar producto
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de producto requerido' },
        { status: 400 }
      );
    }

    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedProduct,
      message: 'Producto eliminado correctamente'
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}