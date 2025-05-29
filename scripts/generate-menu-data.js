import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar los datos del menú
// Extraer los datos (esto es una simplificación, podrías necesitar un parser más robusto)
const { menus } = await import('../src/data/menu.ts');

const menuData = {
  menus,
  lastUpdated: new Date().toISOString()
};

// Generar el JSON
const jsonData = JSON.stringify(menuData);

console.log('MENU_DATA variable:');
console.log(jsonData);

// Guardar en un archivo para fácil copia
fs.writeFileSync(path.join(__dirname, 'menu-data.json'), jsonData);
console.log('\nData saved to scripts/menu-data.json');