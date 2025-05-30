import { NextRequest, NextResponse } from 'next/server';
import { FirebaseDatabase } from '../../../../lib/firebase-database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const menu = await FirebaseDatabase.getMenu(params.id);
    
    if (!menu) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(menu);
  } catch (error: unknown) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const menuData = await request.json();
    
    // Check if menu exists
    const existingMenu = await FirebaseDatabase.getMenu(params.id);
    if (!existingMenu) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    await FirebaseDatabase.updateMenu(params.id, menuData);
    const updatedMenu = await FirebaseDatabase.getMenu(params.id);
    
    return NextResponse.json(updatedMenu);
  } catch (error: unknown) {
    console.error('Error updating menu:', error);
    return NextResponse.json(
      { error: 'Failed to update menu', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if menu exists
    const existingMenu = await FirebaseDatabase.getMenu(params.id);
    if (!existingMenu) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    await FirebaseDatabase.deleteMenu(params.id);
    
    return NextResponse.json(
      { message: 'Menu deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error deleting menu:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}