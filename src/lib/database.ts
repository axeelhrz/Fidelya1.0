// Selector automático de base de datos basado en configuración
const getDatabaseType = (): 'supabase' | 'json' | 'static' => {
  // Prioridad: variable de entorno > detección automática
  const envType = process.env.DATABASE_TYPE as 'supabase' | 'json' | 'static';
  if (envType) {
    return envType;
  }

  // Auto-detección
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return 'supabase';
  }

  if (process.env.VERCEL === '1') {
    return 'static'; // En Vercel sin Supabase, usar datos estáticos
  }

  return 'json'; // Desarrollo local por defecto
};

// Importar el adaptador correcto
const databaseType = getDatabaseType();
console.log('Using database type:', databaseType);

let DatabaseAPI;

switch (databaseType) {
  case 'supabase':
    DatabaseAPI = import('./database-supabase').then(module => module.default);
    break;
  case 'json':
    DatabaseAPI = import('./database-json').then(module => module.default);
    break;
  case 'static':
  default:
    DatabaseAPI = import('./database-static').then(module => module.default);
    break;
}

export default DatabaseAPI;
export { databaseType };