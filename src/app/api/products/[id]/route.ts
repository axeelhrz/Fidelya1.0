import { NextRequest, NextResponse } from 'next/server';
import { FirebaseDatabase } from '../../../../lib/firebase-database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await FirebaseDatabase.getProduct(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error: unknown) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch product', 
        details: error instanceof Error ? error.message : 'Unknown error' 
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
    const productData = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Verificar que el producto existe
    const existingProduct = await FirebaseDatabase.getProduct(id);
    if (!existingProduct) {
    return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
    );
    }

    // Si se está cambiando el menuId, verificar que el nuevo menú existe
    if (productData.menuId && productData.menuId !== existingProduct.menuId) {
      const menu = await FirebaseDatabase.getMenu(productData.menuId);
      if (!menu) {
    return NextResponse.json(
          { error: 'Menu not found' },
          { status: 404 }
    );
  }
}

    await FirebaseDatabase.updateProduct(id, productData);
    const updatedProduct = await FirebaseDatabase.getProduct(id);
    
    return NextResponse.json({
      success: true,
      data: updatedProduct
    });
  } catch (error: unknown) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update product', 
        details: error instanceof Error ? error.message : 'Unknown error' 
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
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Verificar que el producto existe
    const existingProduct = await FirebaseDatabase.getProduct(id);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    await FirebaseDatabase.deleteProduct(id);
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: unknown) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete product', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}