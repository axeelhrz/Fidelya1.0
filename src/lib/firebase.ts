import { initializeApp, getApps, FirebaseError } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-uj0wH6FjNCYn5gUeLk9U5N98k_bHVSg",
  authDomain: "corredor-47215.firebaseapp.com",
  projectId: "corredor-47215",
  storageBucket: "corredor-47215.appspot.com",
  messagingSenderId: "829858619151",
  appId: "1:829858619151:web:205f78f34f5829fd59e87a",
  measurementId: "G-EP2LZ8L0RE"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Custom error handler for Firebase operations
export const handleFirebaseError = (error: FirebaseError): string => {
  console.error('Firebase Error:', error);

  if (error.code) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/email-already-in-use':
        return 'El email ya está en uso';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/operation-not-allowed':
        return 'Operación no permitida';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Por favor, intente más tarde';
      default:
        return 'Error en la operación';
    }
  }

  return 'Error inesperado';
};

// Firestore collection references
export const collections = {
  users: 'users',
  subscriptions: 'subscriptions',
  clients: 'clients',
  policies: 'policies',
  tasks: 'tasks',
  insurers: 'insurers',
} as const;

// Type for Firestore collections
export type CollectionName = keyof typeof collections;

// Helper function to get collection reference with type safety
export const getCollectionRef = (collectionName: CollectionName) => {
  return collections[collectionName];
};

export { app, auth, db, storage };

// Initialize auth state listener
if (typeof window !== 'undefined') {
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('Usuario autenticado:', user.uid);
    } else {
      console.log('Usuario no autenticado');
    }
  });
}