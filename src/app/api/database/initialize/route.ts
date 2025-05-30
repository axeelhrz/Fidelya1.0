import { NextResponse } from 'next/server';
import { FirebaseDatabase } from '../../../../lib/firebase-database';
import { initialFirebaseData, prepareInitialData } from '../../../../lib/firebaseInitialData';

export async function POST() {
  try {
    // Verificar si ya existen menús
    const existingMenus = await FirebaseDatabase.getMenus();
    
    if (existingMenus.length > 0) {
      return NextResponse.json(
        { 
          message: 'La base de datos ya está inicializada',
          menusCount: existingMenus.length 
        },
        { status: 200 }
      );
    }

    // Crear el menú principal primero
    const menuData = initialFirebaseData.menus[0];
    const menuId = await FirebaseDatabase.createMenu(menuData);

    // Preparar los datos con el ID del menú correcto
    const initialData = prepareInitialData(menuId);

    // Crear productos y categorías
    const productPromises = initialData.products.map(product => 
      FirebaseDatabase.createProduct(product)
    );
    
    const categoryPromises = initialData.categories.map(category => 
      FirebaseDatabase.createCategory(category)
    );

    await Promise.all([...productPromises, ...categoryPromises]);

    return NextResponse.json(
      { 
        message: 'Base de datos inicializada exitosamente',
        menuId: menuId,
        productsCount: initialData.products.length,
        categoriesCount: initialData.categories.length
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error inicializando la base de datos:', error);
    return NextResponse.json(
      { 
        error: 'Error al inicializar la base de datos', 
        details: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await FirebaseDatabase.exportData();
    return NextResponse.json({
      success: true,
      data: data,
      menusCount: data.menus.length,
      productsCount: data.products.length,
      categoriesCount: data.categories.length
    });
  } catch (error: unknown) {
    console.error('Error exportando datos:', error);
    return NextResponse.json(
      { 
        error: 'Error al exportar datos', 
        details: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}