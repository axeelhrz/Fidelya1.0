import { NextRequest, NextResponse } from 'next/server';
import { FirebaseDatabase } from '../../../../lib/firebase-database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const productData = await request.json();
    // Check if product exists
    const existingProduct = await FirebaseDatabase.getProduct(id);
    if (!existingProduct) {
    return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
    );
    }

    // If menuId is being changed, verify the new menu exists
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
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists
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