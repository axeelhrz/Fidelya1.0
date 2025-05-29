import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Datos del menú (copiados desde src/data/menu.ts)
const menus = {
  'menu-bar-noche': {
    id: 'menu-bar-noche',
    name: 'Carta Premium Nocturna',
    description: 'Experiencia culinaria de alta gama para la noche',
    products: [
      {
        id: '1',
        name: 'Tartar de Atún Rojo',
        price: 8500,
        description: 'Atún rojo de almadraba, aguacate, mango, sésamo negro y vinagreta de yuzu',
        category: 'Entrada',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '2',
        name: 'Burrata Trufada',
        price: 6200,
        description: 'Burrata artesanal con trufa negra, rúcula salvaje y reducción de balsámico',
        category: 'Entrada',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '3',
        name: 'Carpaccio de Remolacha',
        price: 4800,
        description: 'Láminas de remolacha, queso de cabra, nueces confitadas y aceite de hierbas',
        category: 'Entrada',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '4',
        name: 'Ceviche Nikkei',
        price: 7200,
        description: 'Pescado del día, leche de tigre, ají amarillo, camote y cancha serrana',
        category: 'Entrada',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '5',
        name: 'Wagyu A5 Japonés',
        price: 28500,
        description: 'Filete de wagyu A5, puré de wasabi, shiitakes salteados y salsa teriyaki',
        category: 'Principal',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '6',
        name: 'Lubina en Costra de Sal',
        price: 12800,
        description: 'Lubina salvaje, costra de sal marina, verduras de temporada y salsa verde',
        category: 'Principal',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '7',
        name: 'Risotto de Trufa Blanca',
        price: 9500,
        description: 'Arroz carnaroli, trufa blanca de Alba, parmesano 24 meses y mantequilla clarificada',
        category: 'Principal',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '8',
        name: 'Buddha Bowl Supremo',
        price: 5800,
        description: 'Quinoa, aguacate, edamame, kimchi, tahini, semillas y proteína vegetal',
        category: 'Principal',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '9',
        name: 'Cordero Patagónico',
        price: 15200,
        description: 'Rack de cordero, puré de berenjenas ahumadas, chimichurri y papas confitadas',
        category: 'Principal',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '10',
        name: 'Agua San Pellegrino',
        price: 1200,
        description: 'Agua mineral italiana con gas natural, botella de cristal 750ml',
        category: 'Bebida',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '11',
        name: 'Kombucha Artesanal',
        price: 2800,
        description: 'Fermentado probiótico de té verde, jengibre y limón orgánico',
        category: 'Bebida',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '12',
        name: 'Vino Tinto Reserva',
        price: 4200,
        description: 'Copa de Malbec reserva, D.O. Mendoza, notas a frutos rojos',
        category: 'Bebida',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '13',
        name: 'Cóctel Signature',
        price: 3800,
        description: 'Gin premium, tónica artesanal, pepino, albahaca y twist de lima',
        category: 'Bebida',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '14',
        name: 'Soufflé de Chocolate',
        price: 4500,
        description: 'Soufflé tibio de chocolate Valrhona 70%, helado de vainilla bourbon',
        category: 'Postre',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '15',
        name: 'Tiramisú Deconstructado',
        price: 3800,
        description: 'Mascarpone, café etíope, cacao en polvo y bizcocho de soletilla',
        category: 'Postre',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '16',
        name: 'Tarta de Limón Yuzu',
        price: 3500,
        description: 'Base de galleta, crema de yuzu, merengue italiano y ralladura de limón',
        category: 'Postre',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '17',
        name: 'Helado Vegano de Coco',
        price: 2800,
        description: 'Helado artesanal de coco, coulis de mango y granola de almendras',
        category: 'Postre',
        isRecommended: true,
        isVegan: true,
      },
    ]
  },

  'menu-almuerzo': {
    id: 'menu-almuerzo',
    name: 'Menú Ejecutivo',
    description: 'Opciones ligeras y nutritivas para el almuerzo',
    products: [
      {
        id: '18',
        name: 'Ensalada César Premium',
        price: 3200,
        description: 'Lechuga romana, pollo grillado, crutones artesanales, parmesano y aderezo césar',
        category: 'Entrada',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '19',
        name: 'Salmón Teriyaki',
        price: 8900,
        description: 'Filete de salmón, salsa teriyaki, arroz jazmín y vegetales al wok',
        category: 'Principal',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '20',
        name: 'Agua Saborizada',
        price: 800,
        description: 'Agua con gas saborizada con frutas naturales',
        category: 'Bebida',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '21',
        name: 'Mousse de Maracuyá',
        price: 2500,
        description: 'Mousse ligero de maracuyá con coulis de frutos rojos',
        category: 'Postre',
        isRecommended: true,
        isVegan: false,
      },
    ]
  }
};

const menuData = {
  menus,
  lastUpdated: new Date().toISOString()
};

// Generar el JSON compacto para la variable de entorno
const jsonData = JSON.stringify(menuData);

// Estadísticas
const totalMenus = Object.keys(menus).length;
const totalProducts = Object.values(menus).reduce((total, menu) => total + menu.products.length, 0);
const jsonSize = (new Blob([jsonData]).size / 1024).toFixed(2);

console.log('🍽️  MenuQR - Generador de Datos para Vercel');
console.log('='.repeat(60));
console.log(`📊 Estadísticas:`);
console.log(`   • Menús: ${totalMenus}`);
console.log(`   • Productos: ${totalProducts}`);
console.log(`   • Tamaño JSON: ${jsonSize} KB`);
console.log('='.repeat(60));
console.log('');

console.log('📋 VARIABLE DE ENTORNO PARA VERCEL:');
console.log('='.repeat(60));
console.log('Name: MENU_DATA');
console.log('Value:');
console.log('');
console.log(jsonData);
console.log('');
console.log('='.repeat(60));

// Guardar en archivos para fácil acceso
const outputDir = path.join(__dirname, '..', 'data');
const outputPath = path.join(outputDir, 'menu-data.json');
const envPath = path.join(outputDir, 'vercel-env.txt');

// Crear directorio si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Guardar JSON formateado
fs.writeFileSync(outputPath, JSON.stringify(menuData, null, 2));

// Guardar variable de entorno
const envContent = `# Variable de entorno para Vercel
# Copia el valor de abajo y pégalo en Vercel Dashboard > Settings > Environment Variables

MENU_DATA=${jsonData}
`;
fs.writeFileSync(envPath, envContent);

console.log('💾 Archivos generados:');
console.log(`   • JSON formateado: ${outputPath}`);
console.log(`   • Variable de entorno: ${envPath}`);
console.log('');
console.log('🚀 Pasos para configurar en Vercel:');
console.log('');
console.log('1. Ve a tu proyecto en Vercel Dashboard');
console.log('   https://vercel.com/dashboard');
console.log('');
console.log('2. Navega a Settings > Environment Variables');
console.log('');
console.log('3. Agrega una nueva variable:');
console.log('   • Name: MENU_DATA');
console.log('   • Value: [copia el JSON de arriba]');
console.log('   • Environment: Production');
console.log('');
console.log('4. Redeploy tu aplicación:');
console.log('   • Ve a Deployments');
console.log('   • Haz clic en "Redeploy" en el último deployment');
console.log('');
console.log('5. Verifica que funcione:');
console.log('   • Visita tu-app.vercel.app/admin');
console.log('   • Deberías ver los menús cargados');
console.log('');

console.log('⚠️  Notas importantes:');
console.log('');
console.log('• En Vercel, el panel de administración funciona en modo solo lectura');
console.log('• Para editar el menú, modifica src/data/menu.ts y redeploy');
console.log('• El JSON debe estar en una sola línea (sin saltos de línea)');
console.log('• Vercel tiene un límite de 4KB por variable de entorno');
console.log(`• Tu JSON actual: ${jsonSize} KB (${jsonSize > 4 ? '⚠️ EXCEDE EL LÍMITE' : '✅ OK'})`);
console.log('');

if (parseFloat(jsonSize) > 4) {
  console.log('🚨 ADVERTENCIA: El JSON excede el límite de 4KB de Vercel');
  console.log('   Considera reducir el número de productos o usar una base de datos externa');
  console.log('');
}

console.log('✅ ¡Configuración lista para Vercel!');