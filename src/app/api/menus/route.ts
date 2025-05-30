import { NextRequest, NextResponse } from 'next/server';
import { FirebaseDatabase } from '../../../lib/firebase-database';

export async function GET() {
  try {
    const menus = await FirebaseDatabase.getMenus();
    return NextResponse.json({
      success: true,
      data: menus,
      count: menus.length
    });
  } catch (error: unknown) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch menus', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const menuData = await request.json();
    
    // Validate required fields
    if (!menuData.name || !menuData.description) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Name and description are required' 
        },
        { status: 400 }
    );
  }

    // Set default values
    const processedMenuData = {
      name: menuData.name,
      description: menuData.description,
      categories: menuData.categories || [],
      isActive: menuData.isActive ?? true,
      ...menuData
    };

    const menuId = await FirebaseDatabase.createMenu(processedMenuData);
    const createdMenu = await FirebaseDatabase.getMenu(menuId);
    
    return NextResponse.json({
      success: true,
      data: createdMenu,
      message: 'Menu created successfully'
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create menu', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
}
}
