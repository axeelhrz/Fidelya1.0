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

// Validate configuration
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
    throw new Error(`Missing Firebase configuration: ${missingKeys.join(', ')}`);
  }
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

try {
  validateConfig();
  
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
    analytics = getAnalytics(app);
  }

  // Connect to emulators in development
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true';
    
    if (useEmulators) {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        connectFirestoreEmulator(db, 'localhost', 8080);
        connectStorageEmulator(storage, 'localhost', 9199);
        console.log('🔧 Connected to Firebase Emulators');
      } catch (error) {
        console.warn('⚠️ Could not connect to Firebase Emulators:', error);
      }
    }
  }

  console.log('🔥 Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

// Export Firebase services
export { app, auth, db, storage, analytics };

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

// Error handling utility
export const handleFirebaseError = (error: any): string => {
  console.error('Firebase Error:', error);
  
  if (error?.code) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/email-already-in-use':
        return 'El email ya está en uso';
      case 'auth/weak-password':
        return 'La contraseña es muy débil';
      case 'auth/invalid-email':
        return 'Email inválido';
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
        return 'Servicio no disponible';
      case 'data-loss':
        return 'Pérdida de datos';
      case 'unauthenticated':
        return 'No autenticado';
      default:
        return error.message || 'Error desconocido';
    }
  }
  
  return error.message || 'Error desconocido';
};

// Connection status utility
export const checkFirebaseConnection = async (): Promise<boolean> => {
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