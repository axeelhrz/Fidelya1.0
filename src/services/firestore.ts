import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export class FirestoreService {
  static async create<T>(collectionName: string, data: Omit<T, 'id'>, centerId: string, createdBy: string) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        centerId,
        createdBy,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  static async update<T>(collectionName: string, id: string, data: Partial<T>) {
    try {
      await updateDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  static async delete(collectionName: string, id: string) {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  static async getById<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docSnap = await getDoc(doc(db, collectionName, id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }
}
