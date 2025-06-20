import { useState, useEffect, useMemo } from 'react';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  DocumentData,
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
    let isMounted = true;
    
    // No ejecutar consultas si no hay usuario autenticado
    if (!user || !path) {
      if (isMounted) {
        setLoading(false);
        setData(null);
        setError(null);
      }
      return;
    }

    setLoading(true);
    setError(null);

    const docRef = doc(db, path);
    
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!isMounted) return;
        
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
        if (!isMounted) return;
        
        console.error('Firestore document listener error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
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

  // Memoizar los constraints para evitar recreaciones innecesarias
  const memoizedConstraints = useMemo(() => queryConstraints, [queryConstraints]);

  useEffect(() => {
    let isMounted = true;
    
    // No ejecutar consultas si no hay usuario autenticado o path vacío
    if (!user || !collectionPath) {
      if (isMounted) {
        setLoading(false);
        setData([]);
        setError(null);
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const collectionRef = collection(db, collectionPath);
      const q = memoizedConstraints && memoizedConstraints.length > 0 
        ? query(collectionRef, ...memoizedConstraints) 
        : collectionRef;
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!isMounted) return;
          
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
          if (!isMounted) return;
          
          console.error('Firestore collection listener error:', err);
          setError(err);
          setLoading(false);
        }
      );

      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (err) {
      if (isMounted) {
        console.error('Error setting up Firestore listener:', err);
        setError(err as Error);
        setLoading(false);
      }
    }
  }, [collectionPath, memoizedConstraints, user]);

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

  // Memoizar la query para evitar recreaciones innecesarias
  const queryKey = useMemo(() => {
    if (!queryConstraints) return 'no-constraints';
    return JSON.stringify(queryConstraints.map(constraint => constraint.toString()));
  }, [queryConstraints]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;
    
    // Solo ejecutar si está habilitado, hay usuario y path
    if (!enabled || !user || !collectionPath) {
      if (isMounted) {
        setLoading(false);
        setData([]);
        setError(null);
      }
      return;
    }

    // Esperar un poco para asegurar que el usuario esté completamente autenticado
    const timer = setTimeout(() => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);

      try {
        const collectionRef = collection(db, collectionPath);
        const q = queryConstraints && queryConstraints.length > 0 
          ? query(collectionRef, ...queryConstraints) 
          : collectionRef;
        
        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            if (!isMounted) return;
            
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
            if (!isMounted) return;
            
            console.error('Firestore secure collection listener error:', err);
            setError(err);
            setLoading(false);
          }
        );
      } catch (err) {
        if (isMounted) {
          console.error('Error setting up secure Firestore listener:', err);
          setError(err as Error);
          setLoading(false);
        }
      }
    }, 100); // Pequeño delay para asegurar autenticación

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionPath, queryKey, user, enabled, queryConstraints]);

  return { data, loading, error };
}