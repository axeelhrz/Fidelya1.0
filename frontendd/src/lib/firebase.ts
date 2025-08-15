import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendEmailVerification,
  User
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// Configure providers
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

appleProvider.setCustomParameters({
  locale: 'es'
});

// Auth functions
export const signInWithEmail = async (email: string, password: string, remember: boolean = false) => {
  // Set persistence based on remember me
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async (remember: boolean = false) => {
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  return signInWithPopup(auth, googleProvider);
};

export const signInWithApple = async (remember: boolean = false) => {
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  return signInWithPopup(auth, appleProvider);
};

export const sendVerificationEmail = async (user: User) => {
  return sendEmailVerification(user);
};

// Error mapping
export const mapFirebaseError = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/invalid-credential': 'Credenciales incorrectas. Verifica tu email y contraseña.',
    'auth/user-not-found': 'No existe una cuenta con este correo electrónico.',
    'auth/wrong-password': 'Contraseña incorrecta. Inténtalo de nuevo.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Inténtalo más tarde.',
    'auth/network-request-failed': 'Error de conexión. Verifica tu conexión a internet.',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
    'auth/invalid-email': 'El formato del correo electrónico no es válido.',
    'auth/popup-closed-by-user': 'Inicio de sesión cancelado.',
    'auth/popup-blocked': 'El popup fue bloqueado por el navegador.',
    'auth/cancelled-popup-request': 'Solicitud de popup cancelada.',
    'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este correo usando un método diferente.',
  };

  return errorMessages[errorCode] || 'Ha ocurrido un error inesperado. Inténtalo de nuevo.';
};

export default app;