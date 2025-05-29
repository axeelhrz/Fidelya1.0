import { NextResponse } from 'next/server';
import DatabaseAPI from '../../../lib/database-json';

export async function GET() {
  try {
    console.log('=== DATABASE TEST START ===');
    
    // Verificar información de la base de datos
    const info = DatabaseAPI.utils.getInfo();
    console.log('Database info:', info);
    
    // Verificar si tiene datos
    const hasData = DatabaseAPI.utils.hasData();
    console.log('Has data:', hasData);
    
    // Obtener todos los menús
    const menus = DatabaseAPI.menus.getAll();
    console.log('Current menus:', menus.length);
    
    // Si no hay datos, intentar inicializar
    if (!hasData) {
      console.log('No data found, attempting to seed...');
      const seedResult = await DatabaseAPI.utils.seedFromFile();
      console.log('Seed result:', seedResult);
      
      if (seedResult) {
        const newMenus = DatabaseAPI.menus.getAll();
        console.log('Menus after seeding:', newMenus.length);
      }
    }
    
    console.log('=== DATABASE TEST END ===');
    
    return NextResponse.json({
      success: true,
      data: {
        info: DatabaseAPI.utils.getInfo(),
        hasData: DatabaseAPI.utils.hasData(),
        menus: DatabaseAPI.menus.getAll().map(m => ({ id: m.id, name: m.name, productsCount: m.products.length }))
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}