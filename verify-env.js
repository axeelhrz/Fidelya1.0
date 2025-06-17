/**
 * Utilidad para verificar si las variables de entorno están cargadas correctamente
 * Ejecutar con: node verify-env.js
 */

// Importar dotenv para cargar manualmente las variables
require('dotenv').config({ path: '.env.local' });

console.log('\n=== VERIFICACIÓN DE VARIABLES DE ENTORNO ===\n');

// Variables críticas para GetNet
const getnetVars = [
  'GETNET_LOGIN',
  'GETNET_SECRET',
  'GETNET_BASE_URL',
  'NEXT_PUBLIC_APP_URL'
];

// Variables de Supabase
const supabaseVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

// Verificar variables GetNet
console.log('Variables GetNet:');
getnetVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  // Solo mostrar primeros caracteres de claves secretas
  const displayValue = varName.includes('SECRET') && value 
    ? value.substring(0, 3) + '...' 
    : value;
  console.log(`${status} ${varName}: ${displayValue || 'NO DEFINIDA'}`);
});

console.log('\nVariables Supabase:');
supabaseVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  // Solo mostrar primeros caracteres de claves
  const displayValue = varName.includes('KEY') && value 
    ? value.substring(0, 10) + '...' 
    : value;
  console.log(`${status} ${varName}: ${displayValue || 'NO DEFINIDA'}`);
});

console.log('\n=== SUGERENCIAS ===');
console.log('1. Si faltan variables (❌), verifica que existan en .env.local');
console.log('2. Asegúrate que no hay espacios ni comillas extras en los valores');
console.log('3. Reinicia el servidor Next.js después de modificar .env.local');
console.log('4. Prueba eliminar la caché: rm -rf .next/\n');
