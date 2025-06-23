import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export type UserRole = 'asociacion' | 'socio' | 'comercio';

export interface UserData {
  uid: string;
  email: string;
  nombre: string;
  role: UserRole;
  estado: 'activo' | 'inactivo';
  creadoEn: Date;
}

export const createUser = async (
  email: string, 
  password: string, 
  userData: Omit<UserData, 'uid' | 'creadoEn'>
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const newUserData: UserData = {
    ...userData,
    uid: user.uid,
    creadoEn: new Date()
  };
  
  await setDoc(doc(db, 'users', user.uid), newUserData);
  return newUserData;
};

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  
  if (!userDoc.exists()) {
    throw new Error('Usuario no encontrado');
  }
  
  return userDoc.data() as UserData;
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const signOut = async () => {
  await firebaseSignOut(auth);
};

export const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case 'asociacion':
      return '/dashboard/asociacion';
    case 'comercio':
      return '/dashboard/comercio';
    case 'socio':
      return '/dashboard/socio';
    default:
      return '/dashboard';
  }
};
