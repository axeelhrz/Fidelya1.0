import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  DocumentData,
  QueryConstraint 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';

export function useFirestore<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      // Agregar filtro por centerId automáticamente
      const centerConstraint = where('centerId', '==', user.centerId);
      const allConstraints = [centerConstraint, ...constraints];
      
      const q = query(collection(db, collectionName), ...allConstraints);
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const documents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as T[];
          
          setData(documents);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Firestore error:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Query setup error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, [collectionName, user, constraints]);

  return { data, loading, error };
}
