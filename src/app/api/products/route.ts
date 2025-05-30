import { NextRequest, NextResponse } from 'next/server';
import { firebaseDB } from '../../../lib/firebase-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const menuId = searchParams.get('menuId');

    let products;
    if (menuId) {
      products = await firebaseDB.getProductsByMenu(menuId);
    } else {
      products = await firebaseDB.getProducts();
    }

    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error en GET /api/products:', error);
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
    const { name, price, description, category, menuId, isRecommended = false, isVegan = false, isAvailable = true } = body;

    if (!name || !price || !description || !category) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nombre, precio, descripción y categoría son requeridos' 
        },
        { status: 400 }
      );
    }

    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El precio debe ser un número mayor a 0' 
        },
        { status: 400 }
      );
    }

    const newProduct = await firebaseDB.createProduct({
      name,
      price,
      description,
      category,
      menuId,
      isRecommended,
      isVegan,
      isAvailable
    });

    return NextResponse.json({
      success: true,
      data: newProduct
    }, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/products:', error);
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
          error: 'ID del producto es requerido' 
        },
        { status: 400 }
      );
    }

    // Validar precio si se está actualizando
    if (updateData.price !== undefined) {
      if (typeof updateData.price !== 'number' || updateData.price <= 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'El precio debe ser un número mayor a 0' 
          },
          { status: 400 }
        );
      }
    }

    const updatedProduct = await firebaseDB.updateProduct(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error en PUT /api/products:', error);
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
          error: 'ID del producto es requerido' 
        },
        { status: 400 }
      );
    }

    await firebaseDB.deleteProduct(id);

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en DELETE /api/products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}