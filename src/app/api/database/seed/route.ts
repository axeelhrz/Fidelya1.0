import { NextRequest, NextResponse } from 'next/server';
import { FirebaseDatabase } from '../../../../lib/firebase-database';
import { initialProducts } from '../../../data/initialProducts';

export async function POST(request: NextRequest) {
  try {
    // Get admin password from request
    const { password } = await request.json();
    
    // Verify admin password
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Prepare initial data
    const initialData = {
      menus: [
        {
          id: 'menu-1',
          name: 'Menú Principal',
          description: 'Nuestro delicioso menú con los mejores platos',
          isActive: true,
          categories: ['Entradas', 'Platos Principales', 'Postres', 'Bebidas']
        }
      ],
      products: initialProducts.map(product => ({
        ...product,
        menuId: 'menu-1'
      }))
    };

    await FirebaseDatabase.initializeDatabase(initialData);
      return NextResponse.json(
      { message: 'Database initialized successfully' },
      { status: 200 }
      );
  } catch (error: unknown) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await FirebaseDatabase.exportData();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}