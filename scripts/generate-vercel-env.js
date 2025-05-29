const fs = require('fs');
const path = require('path');

// Importar los datos del menú
const menuDataPath = path.join(__dirname, '../src/data/menu.ts');

// Función para extraer los datos del archivo TypeScript
function extractMenuData() {
  try {
    // Leer el archivo de menú
    const menuContent = fs.readFileSync(menuDataPath, 'utf8');
    
    // Extraer el objeto menus usando regex
    const menusMatch = menuContent.match(/export const menus: Record<string, MenuData> = ({[\s\S]*?});/);
    
    if (!menusMatch) {
      throw new Error('No se pudo encontrar el objeto menus en el archivo');
    }
    
    // Evaluar el objeto JavaScript (esto es seguro porque controlamos el archivo)
    const menusString = menusMatch[1];
    
    // Crear un contexto seguro para evaluar el objeto
    const menuData = eval(`(${menusString})`);
    
    return {
      menus: menuData,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error extrayendo datos del menú:', error);
    return null;
  }
}

// Función principal
function generateVercelEnv() {
  console.log('🚀 Generando variable de entorno para Vercel...');
  
  const menuData = extractMenuData();
  
  if (!menuData) {
    console.error('❌ Error: No se pudieron extraer los datos del menú');
    process.exit(1);
  }
  
  // Convertir a JSON compacto
  const jsonData = JSON.stringify(menuData);
  
  // Crear el contenido del archivo
  const envContent = `# Variable de entorno para Vercel
# Copia el valor de abajo y pégalo en Vercel Dashboard > Settings > Environment Variables

MENU_DATA=${jsonData}

# Instrucciones:
# 1. Ve a tu proyecto en Vercel Dashboard
# 2. Settings > Environment Variables
# 3. Agrega una nueva variable:
#    - Name: MENU_DATA
#    - Value: (el JSON de arriba)
#    - Environments: Production, Preview, Development
# 4. Redeploy tu aplicación

# Última actualización: ${new Date().toLocaleString()}
# Total de menús: ${Object.keys(menuData.menus).length}
# Total de productos: ${Object.values(menuData.menus).reduce((total, menu) => total + menu.products.length, 0)}
`;
  
  // Escribir el archivo
  const outputPath = path.join(__dirname, '../data/vercel-env.txt');
  fs.writeFileSync(outputPath, envContent);
  
  console.log('✅ Variable de entorno generada exitosamente!');
  console.log(`📁 Archivo guardado en: ${outputPath}`);
  console.log(`📊 Menús encontrados: ${Object.keys(menuData.menus).length}`);
  console.log(`🍽️  Total de productos: ${Object.values(menuData.menus).reduce((total, menu) => total + menu.products.length, 0)}`);
  console.log('\n📋 Próximos pasos:');
  console.log('1. Copia el contenido del archivo data/vercel-env.txt');
  console.log('2. Ve a Vercel Dashboard > Settings > Environment Variables');
  console.log('3. Agrega la variable MENU_DATA con el valor JSON');
  console.log('4. Redeploy tu aplicación');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateVercelEnv();
}

module.exports = { generateVercelEnv, extractMenuData };