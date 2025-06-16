import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { User, SignUpData } from '@/types/auth';
import { CenterSettings } from '@/types/center';

export class FirestoreService {
  // Usuarios
  static async createUser(uid: string, userData: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>) {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  static async getUser(uid: string): Promise<User | null> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        uid,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        lastLoginAt: data.lastLoginAt?.toDate(),
      } as User;
    }
    
    return null;
  }

  static async updateUser(uid: string, data: Partial<User>) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  static async updateLastLogin(uid: string) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    });
  }

  // Centros
  static async getCenterSettings(centerId: string): Promise<CenterSettings | null> {
    const centerRef = doc(db, 'centers', centerId);
    const centerSnap = await getDoc(centerRef);
    
    if (centerSnap.exists()) {
      const data = centerSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        subscription: {
          ...data.subscription,
          expiresAt: data.subscription.expiresAt?.toDate(),
        },
      } as CenterSettings;
    }
    
    return null;
  }

  static async updateCenterSettings(centerId: string, settings: Partial<CenterSettings>) {
    const centerRef = doc(db, 'centers', centerId);
    await updateDoc(centerRef, {
      ...settings,
      updatedAt: serverTimestamp(),
    });
  }

  // Verificar si el usuario tiene acceso al centro
  static async verifyUserCenterAccess(uid: string, centerId: string): Promise<boolean> {
    const user = await this.getUser(uid);
    return user?.centerId === centerId && user?.isActive;
  }

  // Obtener usuarios de un centro
  static async getCenterUsers(centerId: string) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('centerId', '==', centerId), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as User[];
  }
}