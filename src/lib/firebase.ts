import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import type { Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "centro-psicologico-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "centro-psicologico-demo",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "centro-psicologico-demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Conectar a emuladores en desarrollo
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  try {
    // Solo conectar si no están ya conectados
    // Siempre conectar el emulador en desarrollo; connectAuthEmulator maneja múltiples llamadas de forma segura
    connectAuthEmulator(auth, 'http://localhost:9099');
    const dbTyped = db as Firestore & { _delegate?: { _databaseId?: { projectId?: string } } };
    if (!(dbTyped._delegate?._databaseId?.projectId?.includes('localhost'))) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    if (!functions.customDomain) {
      connectFunctionsEmulator(functions, 'localhost', 5001);
    }
    if (!storage.app.options.storageBucket?.includes('localhost')) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }
  } catch {
    console.log('Emulators already connected or not available');
  }
}

// Configuración de colecciones
export const COLLECTIONS = {
  USERS: 'users',
  CENTERS: 'centers',
  PATIENTS: 'patients',
  THERAPISTS: 'therapists',
  SESSIONS: 'sessions',
  APPOINTMENTS: 'appointments',
  ASSESSMENTS: 'assessments',
  NOTES: 'notes',
  DOCUMENTS: 'documents',
  TREATMENTS: 'treatments',
  ALERTS: 'alerts',
  PHONE_CALLS: 'phone_calls',
  EXPENSES: 'expenses',
  FINANCIAL_RECORDS: 'financial_records',
  REVENUE: 'revenue',
  PAYMENTS: 'payments',
  LEADS: 'leads',
  CAMPAIGNS: 'campaigns',
  TASKS: 'tasks',
} as const;

// Utilidades para manejo de errores
type FirebaseErrorLike = {
  code?: string;
  message?: string;
  [key: string]: unknown;
};

export const handleFirebaseError = (error: unknown): string => {
  console.error('Firebase Error:', error);

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as FirebaseErrorLike).code === 'string'
  ) {
    const firebaseError = error as FirebaseErrorLike;
    switch (firebaseError.code) {
      case 'permission-denied':
        return 'No tienes permisos para acceder a estos datos';
      case 'unavailable':
        return 'Servicio temporalmente no disponible. Intenta más tarde';
      case 'not-found':
        return 'Los datos solicitados no fueron encontrados';
      case 'already-exists':
        return 'Los datos ya existen';
      case 'failed-precondition':
        return 'Error en la configuración de la base de datos';
      default:
        return `Error de Firebase: ${firebaseError.message}`;
    }
  }

  return (typeof error === 'object' && error !== null && 'message' in error)
    ? (error as { message?: string }).message ?? 'Error desconocido de Firebase'
    : 'Error desconocido de Firebase';
};

// Función para verificar conexión
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Intentar una operación simple para verificar conectividad
    await import('firebase/firestore').then(({ doc, getDoc }) => 
      getDoc(doc(db, 'test', 'connection'))
    );
    return true;
  } catch (error) {
    console.error('Firebase connection failed:', error);
    return false;
  }
};

export default app;