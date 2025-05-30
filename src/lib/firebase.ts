import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Validar configuración
const validateConfig = () => {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);
  
  if (missingKeys.length > 0) {
    console.error('Missing Firebase configuration keys:', missingKeys);
    throw new Error(`Firebase configuration incomplete. Missing: ${missingKeys.join(', ')}`);
  }
};

// Validar configuración antes de inicializar
validateConfig();

// Inicializar Firebase solo si no existe una instancia
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Inicializar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Variables para controlar la conexión de emuladores
let emulatorsConnected = false;

// Configurar emuladores en desarrollo
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && !emulatorsConnected) {
  try {
    // Solo conectar emuladores si no están ya conectados
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    
    if (!((db as unknown as { _delegate: { _databaseId: { projectId: string } } })._delegate._databaseId.projectId.includes('demo-'))) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    
    if (!storage.app.options.storageBucket?.includes('demo-')) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }
    
    emulatorsConnected = true;
    console.log('Firebase emulators connected');
  } catch (error) {
    console.log('Emuladores ya conectados o no disponibles:', error);
  }
}

// Función para verificar conexión
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Intentar una operación simple para verificar la conexión
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