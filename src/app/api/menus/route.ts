import { NextRequest, NextResponse } from 'next/server';
import { FirebaseDatabase } from '../../../lib/firebase-database';

export async function GET() {
  try {
    const menus = await FirebaseDatabase.getMenus();
    return NextResponse.json(menus);
  } catch (error: any) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menus', details: error.message },
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
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const menuId = await FirebaseDatabase.createMenu(menuData);
    const createdMenu = await FirebaseDatabase.getMenu(menuId);
    
    return NextResponse.json(createdMenu, { status: 201 });
  } catch (error: any) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { error: 'Failed to create menu', details: error.message },
      { status: 500 }
    );
  }
}
