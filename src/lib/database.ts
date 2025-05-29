// Selector automático de base de datos basado en configuración
const getDatabaseType = (): 'supabase' | 'json' | 'static' | 'mysql' => {
  // Prioridad: variable de entorno > detección automática
  const envType = process.env.DATABASE_TYPE as 'supabase' | 'json' | 'static' | 'mysql';
  if (envType) {
    console.log('Database type from env:', envType);
    return envType;
  }

  // Auto-detección MySQL
  if (process.env.MYSQL_HOST || process.env.MYSQL_DATABASE) {
    console.log('Database type auto-detected: mysql');
    return 'mysql';
  }

  // Auto-detección Supabase
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('Database type auto-detected: supabase');
    return 'supabase';
  }

  if (process.env.VERCEL === '1') {
    console.log('Database type auto-detected: static (Vercel)');
    return 'static'; // En Vercel sin Supabase, usar datos estáticos
  }

  console.log('Database type auto-detected: json (development)');
  return 'json'; // Desarrollo local por defecto
};

// Función para obtener el adaptador correcto
export const getDatabaseAPI = async () => {
const databaseType = getDatabaseType();
  console.log('Loading database adapter:', databaseType);

switch (databaseType) {
    case 'mysql':
      const mysqlModule = await import('./database-mysql');
      return mysqlModule.default;
    case 'supabase':
      const supabaseModule = await import('./database-supabase');
      return supabaseModule.default;
    case 'json':
      const jsonModule = await import('./database-json');
      return jsonModule.default;
    case 'static':
    default:
      const staticModule = await import('./database-static');
      return staticModule.default;
}
};

export { getDatabaseType };
