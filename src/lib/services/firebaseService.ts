import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp,
  writeBatch,
  runTransaction,
  WhereFilterOp
} from 'firebase/firestore';
import { db, COLLECTIONS, handleFirebaseError } from '@/lib/firebase';

// Tipos base
export interface FirebaseDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueryOptions {
  limit?: number;
  where?: { field: string; operator: WhereFilterOp; value: unknown }[];
  orderBy?: { field: string; direction: 'asc' | 'desc' };
}

// Servicio base para operaciones CRUD
export class BaseFirebaseService<T extends FirebaseDocument> {
  constructor(private collectionName: string) {}

  // Crear documento
  async create(centerId: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const docRef = await addDoc(
        collection(db, COLLECTIONS.CENTERS, centerId, this.collectionName),
        {
          ...data,
          createdAt: Timestamp.fromDate(now),
          updatedAt: Timestamp.fromDate(now)
        }
      );
      return docRef.id;
    } catch (error) {
      throw new Error(handleFirebaseError(error));
    }
  }

  // Obtener documento por ID
  async getById(centerId: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, COLLECTIONS.CENTERS, centerId, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as T;
      }
      
      return null;
    } catch (error) {
      throw new Error(handleFirebaseError(error));
    }
  }

  // Obtener todos los documentos con opciones
  async getAll(centerId: string, options: QueryOptions = {}): Promise<T[]> {
    try {
      let q: import('firebase/firestore').Query = collection(db, COLLECTIONS.CENTERS, centerId, this.collectionName);

      // Aplicar filtros
      if (options.where) {
        options.where.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value));
        });
      }

      // Aplicar ordenamiento
      if (options.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
      }

      // Aplicar límite
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as T;
      });
    } catch (error) {
      throw new Error(handleFirebaseError(error));
    }
  }

  // Actualizar documento
  async update(centerId: string, id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.CENTERS, centerId, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      throw new Error(handleFirebaseError(error));
    }
  }

  // Eliminar documento
  async delete(centerId: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.CENTERS, centerId, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      throw new Error(handleFirebaseError(error));
    }
  }

  // Suscribirse a cambios en tiempo real
  subscribeToChanges(
    centerId: string, 
    callback: (data: T[]) => void, 
    options: QueryOptions = {}
  ): () => void {
    try {
      let q: import('firebase/firestore').Query = collection(db, COLLECTIONS.CENTERS, centerId, this.collectionName);
      
      // Aplicar filtros y ordenamiento igual que en getAll
      if (options.where) {
        options.where.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value));
        });
      }
      
      if (options.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
      }
      
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      return onSnapshot(
        q,
        (querySnapshot: import('firebase/firestore').QuerySnapshot) => {
          const data = querySnapshot.docs.map(doc => {
            const docData = doc.data();
            return {
              id: doc.id,
              ...docData,
              createdAt: docData.createdAt?.toDate() || new Date(),
              updatedAt: docData.updatedAt?.toDate() || new Date()
            } as T;
          });
          callback(data);
        },
        (error) => {
          console.error('Subscription error:', error);
        }
      );
    } catch (error) {
      console.error('Failed to subscribe:', error);
      return () => {};
    }
  }
}

// Servicio para operaciones por lotes
export class BatchService {
  private batch = writeBatch(db);
  private operations = 0;
  private readonly MAX_OPERATIONS = 500;

  add(centerId: string, collectionName: string, data: Record<string, unknown>): void {
    if (this.operations >= this.MAX_OPERATIONS) {
      throw new Error('Batch size limit exceeded');
    }
    
    const docRef = doc(collection(db, COLLECTIONS.CENTERS, centerId, collectionName));
    this.batch.set(docRef, {
      ...data,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date())
    });
    this.operations++;
  }

  update(centerId: string, collectionName: string, id: string, data: Record<string, unknown>): void {
    if (this.operations >= this.MAX_OPERATIONS) {
      throw new Error('Batch size limit exceeded');
    }
    
    const docRef = doc(db, COLLECTIONS.CENTERS, centerId, collectionName, id);
    this.batch.update(docRef, {
      ...data,
      updatedAt: Timestamp.fromDate(new Date())
    });
    this.operations++;
  }

  delete(centerId: string, collectionName: string, id: string): void {
    if (this.operations >= this.MAX_OPERATIONS) {
      throw new Error('Batch size limit exceeded');
    }
    
    const docRef = doc(db, COLLECTIONS.CENTERS, centerId, collectionName, id);
    this.batch.delete(docRef);
    this.operations++;
  }

  async commit(): Promise<void> {
    try {
      await this.batch.commit();
      this.operations = 0;
    } catch (error) {
      throw new Error(handleFirebaseError(error));
    }
  }
}

// Servicio para transacciones
export class TransactionService {
  async execute<T>(operation: (transaction: import('firebase/firestore').Transaction) => Promise<T>): Promise<T> {
    try {
      return await runTransaction(db, operation);
    } catch (error) {
      throw new Error(handleFirebaseError(error));
    }
  }
}

// Exportar instancias de servicios
export const batchService = new BatchService();
export const transactionService = new TransactionService();
