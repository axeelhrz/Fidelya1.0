'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Socio, SocioStats, SocioFormData } from '@/types/socio';
import { useAuth } from './useAuth';

export const useSocios = () => {
  const { user } = useAuth();
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const sociosRef = collection(db, 'socios');
    const q = query(
      sociosRef, 
      where('asociacionId', '==', user.uid),
      orderBy('creadoEn', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const sociosData = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        })) as Socio[];
        
        setSocios(sociosData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching socios:', err);
        setError('Error al cargar los socios');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addSocio = async (socioData: SocioFormData): Promise<void> => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const sociosRef = collection(db, 'socios');
      await addDoc(sociosRef, {
        ...socioData,
        asociacionId: user.uid,
        creadoEn: Timestamp.now(),
        pagos: []
      });
    } catch (err) {
      console.error('Error adding socio:', err);
      throw new Error('Error al agregar el socio');
    }
  };

  const updateSocio = async (uid: string, socioData: Partial<SocioFormData>): Promise<void> => {
    try {
      const socioRef = doc(db, 'socios', uid);
      await updateDoc(socioRef, socioData);
    } catch (err) {
      console.error('Error updating socio:', err);
      throw new Error('Error al actualizar el socio');
    }
  };

  const deleteSocio = async (uid: string): Promise<void> => {
    try {
      const socioRef = doc(db, 'socios', uid);
      await updateDoc(socioRef, { estado: 'inactivo' });
    } catch (err) {
      console.error('Error deleting socio:', err);
      throw new Error('Error al eliminar el socio');
    }
  };

  const addMultipleSocios = async (sociosData: SocioFormData[]): Promise<void> => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const sociosRef = collection(db, 'socios');
      const promises = sociosData.map(socioData => 
        addDoc(sociosRef, {
          ...socioData,
          asociacionId: user.uid,
          creadoEn: Timestamp.now(),
          pagos: []
        })
      );
      
      await Promise.all(promises);
    } catch (err) {
      console.error('Error adding multiple socios:', err);
      throw new Error('Error al importar los socios');
    }
  };

  const getStats = (): SocioStats => {
    const activeSocios = socios.filter(s => s.estado !== 'inactivo');
    
    return {
      total: activeSocios.length,
      activos: activeSocios.filter(s => s.estado === 'activo').length,
      vencidos: activeSocios.filter(s => s.estado === 'vencido').length,
      inactivos: socios.filter(s => s.estado === 'inactivo').length
    };
  };

  return {
    socios: socios.filter(s => s.estado !== 'inactivo'), // Solo mostrar activos por defecto
    allSocios: socios, // Incluye inactivos si se necesita
    loading,
    error,
    addSocio,
    updateSocio,
    deleteSocio,
    addMultipleSocios,
    stats: getStats()
  };
};
