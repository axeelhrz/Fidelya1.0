import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updatePassword, type User, type Unsubscribe } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';

// ✅ Definir tipo de respuesta para autenticación
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User | null;
  userData?: UserData;
  error?: string;
}

export interface AuthClient {
  onAuthStateChanged: (callback: (user: User | null) => void) => Unsubscribe;
  signInWithPassword: (credentials: { email: string; password: string }) => Promise<AuthResponse>;
  signUp: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (userId: string, data: Partial<User>) => Promise<void>;
  uploadAvatar: (userId: string, file: File) => Promise<string>;
}

// ✅ Función para obtener datos del usuario en Firestore
const getUserData = async (uid: string): Promise<UserData | undefined> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error('No se encontraron datos del usuario en Firestore.');
    }

    return userDoc.data() as UserData;
  } catch {
    // Handle error silently and return undefined for error cases
    return undefined;
  }
};

export const authClient = {
  onAuthStateChanged: (callback: (user: User | null) => void): Unsubscribe => {
    return onAuthStateChanged(auth, callback);
  },
  updateProfile: async (userId: string, data: Partial<User>): Promise<void> => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { ...data, updatedAt: new Date() });
  },
  // ✅ Registro de usuario con Firebase Auth y Firestore
  signUp: async ({ email, password, firstName, lastName }: { email: string; password: string; firstName: string; lastName: string }): Promise<AuthResponse> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user) throw new Error('Error desconocido al registrar usuario.');

      // Guardar en Firestore
      await setDoc(doc(db, 'users', user.uid), { firstName, lastName, email, createdAt: new Date() });

      return { user };
    } catch (error) {
      if (error instanceof Error) {
        return { user: null, error: error.message };
      }
      return { user: null, error: 'An unknown error occurred' };
    }
  },

  // ✅ Inicio de sesión con email y password
  signInWithPassword: async ({ email, password }: { email: string; password: string }): Promise<AuthResponse> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user) throw new Error('No se pudo autenticar al usuario.');

      const userData = await getUserData(user.uid);

      return { user, userData };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { user: null, error: errorMessage };
    }
  },

  // ✅ Cierre de sesión
  signOut: async (): Promise<{ error?: string }> => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { error: errorMessage };
    }
  },
  resetPassword: async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    await updatePassword(user, newPassword);
  },
  getCurrentUser: () => auth.currentUser,
  uploadAvatar: async (userId: string, file: File): Promise<string> => {
    const storageRef = ref(storage, `avatars/${userId}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },
  verifyEmail: async (): Promise<void> => {
    // TODO: Implement your email verification logic here
    // This might involve calling Firebase's applyActionCode or similar
    throw new Error('Email verification not implemented');
  }
};
