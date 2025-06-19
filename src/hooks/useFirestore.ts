import { useState, useEffect } from 'react';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  orderBy,
  DocumentData,
  Query,
  QueryConstraint 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';

export function useDocument<T = DocumentData>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // No ejecutar consultas si no hay usuario autenticado
    if (!user || !path) {
      setLoading(false);
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const docRef = doc(db, path);
    
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        try {
          if (snapshot.exists()) {
            setData({ id: snapshot.id, ...snapshot.data() } as T);
          } else {
            setData(null);
          }
          setLoading(false);
        } catch (err) {
          console.error('Error processing document snapshot:', err);
          setError(err as Error);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Firestore document listener error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path, user]);

  return { data, loading, error };
}

export function useCollection<T = DocumentData>(
  collectionPath: string,
  queryConstraints?: QueryConstraint[]
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // No ejecutar consultas si no hay usuario autenticado o path vacío
    if (!user || !collectionPath) {
      setLoading(false);
      setData([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const collectionRef = collection(db, collectionPath);
      const q = queryConstraints && queryConstraints.length > 0 
        ? query(collectionRef, ...queryConstraints) 
        : collectionRef;
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          try {
            const docs = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as T[];
            setData(docs);
            setLoading(false);
          } catch (err) {
            console.error('Error processing collection snapshot:', err);
            setError(err as Error);
            setLoading(false);
          }
        },
        (err) => {
          console.error('Firestore collection listener error:', err);
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up Firestore listener:', err);
      setError(err as Error);
      setLoading(false);
    }
  }, [collectionPath, queryConstraints, user]);

  return { data, loading, error };
}

// Hook específico para consultas seguras con autenticación
export function useSecureCollection<T = DocumentData>(
  collectionPath: string,
  queryConstraints?: QueryConstraint[],
  enabled: boolean = true
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Solo ejecutar si está habilitado, hay usuario y path
    if (!enabled || !user || !collectionPath) {
      setLoading(false);
      setData([]);
      setError(null);
      return;
    }

    // Esperar un poco para asegurar que el usuario esté completamente autenticado
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);

      try {
        const collectionRef = collection(db, collectionPath);
        const q = queryConstraints && queryConstraints.length > 0 
          ? query(collectionRef, ...queryConstraints) 
          : collectionRef;
        
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            try {
              const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })) as T[];
              setData(docs);
              setLoading(false);
            } catch (err) {
              console.error('Error processing secure collection snapshot:', err);
              setError(err as Error);
              setLoading(false);
            }
          },
          (err) => {
            console.error('Firestore secure collection listener error:', err);
            setError(err);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (err) {
        console.error('Error setting up secure Firestore listener:', err);
        setError(err as Error);
        setLoading(false);
      }
    }, 100); // Pequeño delay para asegurar autenticación

    return () => clearTimeout(timer);
  }, [collectionPath, queryConstraints, user, enabled]);

  return { data, loading, error };
}