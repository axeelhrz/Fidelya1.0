import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Validate configuration with better error handling
const validateConfig = () => {
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
    console.error('🔥 Firebase Configuration Error:', {
      missing: missingKeys,
      available: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_FIREBASE_'))
    });
    
    // In development, provide helpful guidance
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 To fix this, ensure your .env.local file contains:');
      missingKeys.forEach(key => {
        console.log(`${key}=your_firebase_${key.toLowerCase().replace('next_public_firebase_', '')}`);
      });
    }
    
    throw new Error(`Missing Firebase configuration: ${missingKeys.join(', ')}`);
  }

  // Validate that values are not empty
  const emptyKeys = requiredKeys.filter(key => process.env[key] === '');
  if (emptyKeys.length > 0) {
    throw new Error(`Empty Firebase configuration values: ${emptyKeys.join(', ')}`);
  }
};

// Initialize Firebase with error handling
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;
let isFirebaseInitialized = false;

try {
  // Only validate in browser environment to avoid SSR issues
  if (typeof window !== 'undefined') {
    validateConfig();
  }
  
  // Initialize Firebase app (avoid duplicate initialization)
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Initialize Analytics only in browser environment
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn('⚠️ Analytics initialization failed:', error);
    }
  }

  // Connect to emulators in development
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true';
    
    if (useEmulators) {
      try {
        // Check if emulators are already connected
        if (!(auth as any)._delegate?.config?.emulator) {
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        }
        if (!(db as any)._delegate?._databaseId?.projectId?.includes('demo-')) {
          connectFirestoreEmulator(db, 'localhost', 8080);
        }
        if (!(storage as any)._delegate?._host?.includes('localhost')) {
          connectStorageEmulator(storage, 'localhost', 9199);
        }
        console.log('🔧 Connected to Firebase Emulators');
      } catch (error) {
        console.warn('⚠️ Could not connect to Firebase Emulators:', error);
      }
    }
  }

  isFirebaseInitialized = true;
  console.log('🔥 Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  
  // In development, provide mock services to prevent app crash
  if (process.env.NODE_ENV === 'development') {
    console.warn('🔧 Running in development mode without Firebase. Some features will be disabled.');
    isFirebaseInitialized = false;
  } else {
    throw error;
  }
}

// Export Firebase services with fallbacks
export { app, auth, db, storage, analytics, isFirebaseInitialized };

// Export Firebase types for convenience
export type { 
  User,
  UserCredential,
  AuthError 
} from 'firebase/auth';

export type {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  Timestamp,
  FieldValue
} from 'firebase/firestore';

// Firebase collections constants
export const COLLECTIONS = {
  USERS: 'users',
  COMERCIOS: 'comercios',
  BENEFICIOS: 'beneficios',
  VALIDACIONES: 'validaciones',
  ASOCIACIONES: 'asociaciones',
  SOCIOS: 'socios',
  NOTIFICATIONS: 'notifications',
  ANALYTICS: 'analytics'
} as const;

// Firebase storage paths
export const STORAGE_PATHS = {
  COMERCIOS: 'comercios',
  BENEFICIOS: 'beneficios',
  USUARIOS: 'usuarios',
  TEMP: 'temp'
} as const;

// Enhanced error handling utility
export const handleFirebaseError = (error: any): string => {
  console.error('Firebase Error:', error);
  
  // Handle network errors
  if (error?.message?.includes('network')) {
    return 'Error de conexión. Verifica tu conexión a internet.';
  }
  
  // Handle quota exceeded
  if (error?.code === 'resource-exhausted') {
    return 'Límite de uso excedido. Intenta más tarde.';
  }
  
  if (error?.code) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/email-already-in-use':
        return 'El email ya está en uso';
      case 'auth/weak-password':
        return 'La contraseña es muy débil (mínimo 6 caracteres)';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta más tarde.';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu internet.';
      case 'permission-denied':
        return 'No tienes permisos para realizar esta acción';
      case 'not-found':
        return 'Documento no encontrado';
      case 'already-exists':
        return 'El documento ya existe';
      case 'failed-precondition':
        return 'Condición previa fallida';
      case 'aborted':
        return 'Operación cancelada';
      case 'out-of-range':
        return 'Valor fuera de rango';
      case 'unimplemented':
        return 'Operación no implementada';
      case 'internal':
        return 'Error interno del servidor';
      case 'unavailable':
        return 'Servicio no disponible temporalmente';
      case 'data-loss':
        return 'Pérdida de datos detectada';
      case 'unauthenticated':
        return 'Sesión expirada. Inicia sesión nuevamente.';
      case 'cancelled':
        return 'Operación cancelada';
      case 'invalid-argument':
        return 'Datos inválidos proporcionados';
      case 'deadline-exceeded':
        return 'Tiempo de espera agotado';
      default:
        return error.message || 'Error desconocido';
    }
  }
  
  return error.message || 'Error desconocido';
};

// Connection status utility
export const checkFirebaseConnection = async (): Promise<boolean> => {
  if (!isFirebaseInitialized) {
    return false;
  }
  
  try {
    const { enableNetwork, disableNetwork } = await import('firebase/firestore');
    await disableNetwork(db);
    await enableNetwork(db);
    return true;
  } catch (error) {
    console.error('Firebase connection check failed:', error);
    return false;
  }
};

// Utility to check if Firebase is ready
export const waitForFirebase = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isFirebaseInitialized) {
      resolve(true);
      return;
    }
    
    // Wait a bit for initialization
    setTimeout(() => {
      resolve(isFirebaseInitialized);
    }, 1000);
  });
};

// Development utilities
export const getFirebaseConfig = () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      isInitialized: isFirebaseInitialized,
      environment: process.env.NODE_ENV
    };
  }
  return { isInitialized: isFirebaseInitialized };
};