import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredKeys = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  const missingKeys = requiredKeys.filter(key => !process.env[key]);
  
  if (missingKeys.length > 0) {
    console.error('❌ Missing Firebase configuration keys:', missingKeys);
    throw new Error(`Missing Firebase configuration: ${missingKeys.join(', ')}`);
  }

  console.log('✅ Firebase configuration validated successfully');
  return true;
};

// Validate configuration before initializing
validateFirebaseConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enhanced storage configuration for better CORS and error handling
if (typeof window !== 'undefined') {
  console.log('🔧 Configurando Firebase Storage para cliente...');
  
  // Configure storage with better retry and timeout settings
  try {
    // Set custom configuration for better upload handling
    // NOTE: There is currently no public API to set retry times directly on FirebaseStorage.
    // The following code is commented out because accessing private properties like _delegate is not supported.
    /*
    const storageConfig = {
      maxOperationRetryTime: 60000, // 1 minute
      maxUploadRetryTime: 600000,   // 10 minutes
      maxDownloadRetryTime: 60000,  // 1 minute
    };

    // Apply configuration if available
    if (storage._delegate && storage._delegate._config) {
      Object.assign(storage._delegate._config, storageConfig);
    }
    */

    console.log('✅ Firebase Storage configurado correctamente');
  } catch (error) {
    console.warn('⚠️ Error configurando Firebase Storage:', error);
  }
}

// Development emulator connections
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true';
  
  if (useEmulators) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099');
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('🔧 Conectado a emuladores de Firebase');
    } catch (error) {
      console.warn('⚠️ Error conectando a emuladores:', error);
    }
  }
}

// Storage connection test utility
import { ref, list } from 'firebase/storage';

export const testStorageConnection = async (): Promise<boolean> => {
  try {
    // Try listing the root of the storage bucket to verify accessibility
    const rootRef = ref(storage);
    await list(rootRef, { maxResults: 1 });
    return true;
  } catch (error) {
    console.error('❌ Error testing storage connection:', error);
    return false;
  }
};

// Enhanced error handling for Firebase operations
export const handleFirebaseError = (error: unknown): string => {
  console.error('Firebase Error:', error);

  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: string }).code;
    switch (code) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/email-already-in-use':
        return 'Este email ya está registrado';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde';
      case 'permission-denied':
        return 'No tienes permisos para realizar esta acción';
      case 'unavailable':
        return 'Servicio temporalmente no disponible';
      case 'deadline-exceeded':
        return 'Tiempo de espera agotado. Intenta nuevamente';
      default:
        if ('message' in error && typeof (error as { message?: string }).message === 'string') {
          return (error as { message: string }).message;
        }
        return 'Ha ocurrido un error inesperado';
    }
  }
  return 'Ha ocurrido un error inesperado';
};

// Connection status monitoring
export const monitorConnection = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      console.log('🌐 Conexión restaurada');
    });
    
    window.addEventListener('offline', () => {
      console.log('📴 Conexión perdida');
    });
  }
};

// Initialize connection monitoring
monitorConnection();

export default app;