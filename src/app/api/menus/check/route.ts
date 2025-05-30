import { NextResponse } from 'next/server';
import { FirebaseDatabase } from '../../../../lib/firebase-database';

export async function GET() {
  try {
    const menus = await FirebaseDatabase.getMenus({ isActive: true });
    
    if (menus.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No active menus found',
        data: {
          hasMenus: false,
          menuCount: 0,
          availableMenus: []
        }
      });
    }

    const menuList = menus.map(menu => ({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      isActive: menu.isActive
    }));

    return NextResponse.json({
      success: true,
      message: 'Active menus found',
      data: {
        hasMenus: true,
        menuCount: menus.length,
        availableMenus: menuList,
        defaultMenuId: menus[0].id // Primer menú como predeterminado
      }
    });
  } catch (error: unknown) {
    console.error('Error checking menus:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to check menus', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}