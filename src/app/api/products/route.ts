import { NextRequest, NextResponse } from 'next/server';
import { FirebaseDatabase } from '../../../lib/firebase-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const menuId = searchParams.get('menuId');

    const products = await FirebaseDatabase.getProducts(menuId || undefined);
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    // Validate required fields
    if (!productData.name || !productData.price || !productData.menuId) {
      return NextResponse.json(
        { error: 'Name, price, and menuId are required' },
        { status: 400 }
      );
    }

    // Validate that menu exists
    const menu = await FirebaseDatabase.getMenu(productData.menuId);
    if (!menu) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    const productId = await FirebaseDatabase.createProduct(productData);
    const createdProduct = await FirebaseDatabase.getProduct(productId);
    
    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
}
