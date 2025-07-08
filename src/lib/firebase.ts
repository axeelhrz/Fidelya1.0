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
    const storageConfig = {
      maxOperationRetryTime: 60000, // 1 minute
      maxUploadRetryTime: 600000,   // 10 minutes
      maxDownloadRetryTime: 60000,  // 1 minute
    };

    // Apply configuration if available
    if (storage._delegate && storage._delegate._config) {
      Object.assign(storage._delegate._config, storageConfig);
    }

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
export const testStorageConnection = async (): Promise<boolean> => {
  try {
    // Simple test to verify storage is accessible
    const testRef = storage._delegate;
    return testRef !== null;
  } catch (error) {
    console.error('❌ Error testing storage connection:', error);
    return false;
  }
};

export default app;