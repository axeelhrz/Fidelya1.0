import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validar configuración
const validateConfig = () => {
  const requiredFields = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  const missingFields = requiredFields.filter(field => !process.env[field]);
  
  if (missingFields.length > 0) {
    console.error('❌ Faltan variables de entorno de Firebase:', missingFields);
    throw new Error(`Configuración de Firebase incompleta. Faltan: ${missingFields.join(', ')}`);
  }

  console.log('✅ Configuration validated successfully');
};

// Validar configuración antes de inicializar
validateConfig();

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configuración para desarrollo local
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
  
  if (isDevelopment) {
    console.log('🔧 Configurando Firebase para desarrollo local...');
    
    // Configurar emuladores si están disponibles (opcional)
    const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true';
    
    if (useEmulators) {
      try {
        // Solo conectar emuladores si no están ya conectados
        if (!auth._delegate._config.emulator) {
          connectAuthEmulator(auth, 'http://localhost:9099');
        }
        
        if (!db._delegate._databaseId.projectId.includes('demo-')) {
          connectFirestoreEmulator(db, 'localhost', 8080);
        }
        
        if (!storage._delegate._host.includes('localhost')) {
          connectStorageEmulator(storage, 'localhost', 9199);
        }
        
        console.log('🔧 Emuladores de Firebase conectados');
      } catch (error) {
        console.warn('⚠️ No se pudieron conectar los emuladores:', error);
      }
    }
  }
}

// Función para verificar la conectividad de Firebase
export const checkFirebaseConnection = async (): Promise<{
  auth: boolean;
  firestore: boolean;
  storage: boolean;
  errors: string[];
}> => {
  const results = {
    auth: false,
    firestore: false,
    storage: false,
    errors: [] as string[]
  };

  // Verificar Auth
  try {
    await auth.authStateReady();
    results.auth = true;
    console.log('✅ Firebase Auth conectado');
  } catch (error) {
    const errorMsg = `Auth: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    results.errors.push(errorMsg);
    console.error('❌ Error conectando Firebase Auth:', error);
  }

  // Verificar Firestore
  try {
    // Intentar una operación simple
    const { enableNetwork } = await import('firebase/firestore');
    await enableNetwork(db);
    results.firestore = true;
    console.log('✅ Firebase Firestore conectado');
  } catch (error) {
    const errorMsg = `Firestore: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    results.errors.push(errorMsg);
    console.error('❌ Error conectando Firebase Firestore:', error);
  }

  // Verificar Storage
  try {
    const { ref, listAll } = await import('firebase/storage');
    const storageRef = ref(storage, '/');
    await listAll(storageRef);
    results.storage = true;
    console.log('✅ Firebase Storage conectado');
  } catch (error) {
    const errorMsg = `Storage: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    results.errors.push(errorMsg);
    console.error('❌ Error conectando Firebase Storage:', error);
    
    // Verificar si es un error CORS específico
    if (error instanceof Error && error.message.includes('CORS')) {
      results.errors.push('CORS: Configuración CORS requerida para Firebase Storage');
      console.warn('🚫 Error CORS detectado. Ejecuta: npm run setup-cors');
    }
  }

  return results;
};

// Función para obtener información del entorno
export const getEnvironmentInfo = () => {
  const info = {
    environment: process.env.NODE_ENV || 'unknown',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    authDomain: firebaseConfig.authDomain,
    useEmulators: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true',
    timestamp: new Date().toISOString()
  };

  console.log('📊 Información del entorno Firebase:', info);
  return info;
};

// Exportar la app por defecto
export default app;