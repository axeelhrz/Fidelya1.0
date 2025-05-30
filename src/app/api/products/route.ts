import { NextRequest, NextResponse } from 'next/server';
import { FirebaseDatabase } from '../../../lib/firebase-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const menuId = searchParams.get('menuId');
    const category = searchParams.get('category');
    const available = searchParams.get('available');

    let products = await FirebaseDatabase.getProducts(menuId || undefined);
    
    // Apply additional filters
    if (category) {
      products = products.filter(product => product.category === category);
    }
    
    if (available !== null) {
      const isAvailable = available === 'true';
      products = products.filter(product => product.isAvailable === isAvailable);
    }
    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      filters: {
        menuId: menuId || null,
        category: category || null,
        available: available || null
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch products', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    // Validate required fields
    if (!productData.name || !productData.price || !productData.menuId || !productData.category) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Name, price, menuId, and category are required' 
        },
        { status: 400 }
      );
    }

    // Validate that menu exists
    const menu = await FirebaseDatabase.getMenu(productData.menuId);
    if (!menu) {
    return NextResponse.json(
        { 
          success: false,
          error: 'Menu not found' 
        },
        { status: 404 }
    );
  }

    // Validate price
    if (typeof productData.price !== 'number' || productData.price < 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Price must be a positive number' 
        },
        { status: 400 }
      );
}

    // Set default values
    const processedProductData = {
      name: productData.name,
      description: productData.description || '',
      price: productData.price,
      category: productData.category,
      menuId: productData.menuId,
      isAvailable: productData.isAvailable ?? true,
      image: productData.image || '',
      ...productData
    };

    const productId = await FirebaseDatabase.createProduct(processedProductData);
    const createdProduct = await FirebaseDatabase.getProduct(productId);
    
    return NextResponse.json({
      success: true,
      data: createdProduct,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create product', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}