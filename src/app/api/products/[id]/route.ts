import { NextRequest, NextResponse } from 'next/server';
import { firebaseDB } from '../../../../lib/firebase-database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID del producto es requerido' 
        },
        { status: 400 }
      );
    }

    const product = await firebaseDB.getProduct(id);

    if (!product) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Producto no encontrado' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error en GET /api/products/[id]:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

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
    if (body.price !== undefined) {
      if (typeof body.price !== 'number' || body.price <= 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'El precio debe ser un número mayor a 0' 
          },
          { status: 400 }
        );
      }
    }

    const updatedProduct = await firebaseDB.updateProduct(id, body);

    return NextResponse.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error en PUT /api/products/[id]:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
    console.error('Error en DELETE /api/products/[id]:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}