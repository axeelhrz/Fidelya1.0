// Selector automático de base de datos basado en configuración
const getDatabaseType = (): 'mysql' | 'static' => {
  // Prioridad: variable de entorno > detección automática
  const envType = process.env.DATABASE_TYPE as 'mysql' | 'static';
  if (envType) {
    console.log('Database type from env:', envType);
    return envType;
  }

  // Auto-detección MySQL
  if (process.env.MYSQL_HOST || process.env.MYSQL_DATABASE) {
    console.log('Database type auto-detected: mysql');
    return 'mysql';
  }

  // Por defecto usar datos estáticos
  console.log('Database type auto-detected: static (fallback)');
  return 'static';
};

// Función para obtener el adaptador correcto
export const getDatabaseAPI = async () => {
const databaseType = getDatabaseType();
  console.log('Loading database adapter:', databaseType);

switch (databaseType) {
    case 'mysql':
      const mysqlModule = await import('./database-mysql');
      return mysqlModule.default;
    case 'static':
    default:
      const staticModule = await import('./database-static');
      return staticModule.default;
}
};

export { getDatabaseType };
