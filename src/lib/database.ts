// Selector automático de base de datos basado en configuración
const getDatabaseType = (): 'firebase' | 'mysql' | 'static' => {
  // Prioridad: variable de entorno > detección automática
  const envType = process.env.DATABASE_TYPE as 'firebase' | 'mysql' | 'static';
  if (envType) {
    console.log('Tipo de base de datos desde env:', envType);
    return envType;
  }

  // Auto-detección Firebase
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.log('Tipo de base de datos auto-detectado: firebase');
    return 'firebase';
  }

  // Auto-detección MySQL
  if (process.env.MYSQL_HOST || process.env.MYSQL_DATABASE) {
    console.log('Tipo de base de datos auto-detectado: mysql');
    return 'mysql';
  }

  // Por defecto usar datos estáticos
  console.log('Tipo de base de datos auto-detectado: static (fallback)');
  return 'static';
};

// Función para obtener el adaptador correcto
export const getDatabaseAPI = async () => {
const databaseType = getDatabaseType();
  console.log('Cargando adaptador de base de datos:', databaseType);

switch (databaseType) {
    case 'firebase':
      const firebaseModule = await import('./database-firebase');
      return firebaseModule.default;
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
