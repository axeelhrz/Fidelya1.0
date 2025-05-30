// Selector de base de datos simplificado - solo Firebase
const getDatabaseType = (): 'firebase' | 'static' => {
  // Verificar si Firebase está configurado
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.log('Usando Firebase como base de datos');
    return 'firebase';
  }

  // Fallback a datos estáticos si no hay Firebase configurado
  console.log('Firebase no configurado, usando datos estáticos');
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
    case 'static':
    default:
      const staticModule = await import('./database-static');
      return staticModule.default;
}
};

export { getDatabaseType };
