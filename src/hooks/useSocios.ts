'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Socio, SocioStats, SocioFormData } from '@/types/socio';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useSocios = () => {
  const { user } = useAuth();
  const [socios, setSocios] = useState<Socio[]>([]);
  const [allSocios, setAllSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSocios = useCallback(() => {
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
        
        setAllSocios(sociosData);
        // Filtrar solo los activos para la vista principal
        setSocios(sociosData.filter(s => s.estado !== 'inactivo'));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching socios:', err);
        setError('Error al cargar los socios');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    const unsubscribe = fetchSocios();
    return unsubscribe;
  }, [fetchSocios]);

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
      toast.success('Miembro agregado exitosamente');
    } catch (err) {
      console.error('Error adding socio:', err);
      toast.error('Error al agregar el miembro');
      throw new Error('Error al agregar el socio');
    }
  };

  const updateSocio = async (uid: string, socioData: Partial<SocioFormData>): Promise<void> => {
    try {
      const socioRef = doc(db, 'socios', uid);
      await updateDoc(socioRef, {
        ...socioData,
        actualizadoEn: Timestamp.now()
      });
      toast.success('Miembro actualizado exitosamente');
    } catch (err) {
      console.error('Error updating socio:', err);
      toast.error('Error al actualizar el miembro');
      throw new Error('Error al actualizar el socio');
    }
  };

  const deleteSocio = async (uid: string, permanent: boolean = false): Promise<void> => {
    try {
      if (permanent) {
        // Eliminación permanente
        const socioRef = doc(db, 'socios', uid);
        await deleteDoc(socioRef);
        toast.success('Miembro eliminado permanentemente');
      } else {
        // Eliminación suave (marcar como inactivo)
        const socioRef = doc(db, 'socios', uid);
        await updateDoc(socioRef, { 
          estado: 'inactivo',
          actualizadoEn: Timestamp.now()
        });
        toast.success('Miembro desactivado exitosamente');
      }
    } catch (err) {
      console.error('Error deleting socio:', err);
      toast.error('Error al eliminar el miembro');
      throw new Error('Error al eliminar el socio');
    }
  };

  const restoreSocio = async (uid: string): Promise<void> => {
    try {
      const socioRef = doc(db, 'socios', uid);
      await updateDoc(socioRef, { 
        estado: 'activo',
        actualizadoEn: Timestamp.now()
      });
      toast.success('Miembro restaurado exitosamente');
    } catch (err) {
      console.error('Error restoring socio:', err);
      toast.error('Error al restaurar el miembro');
      throw new Error('Error al restaurar el socio');
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
      toast.success(`${sociosData.length} miembros importados exitosamente`);
    } catch (err) {
      console.error('Error adding multiple socios:', err);
      toast.error('Error al importar los miembros');
      throw new Error('Error al importar los socios');
    }
  };

  const bulkUpdateSocios = async (uids: string[], updates: Partial<SocioFormData>): Promise<void> => {
    try {
      const promises = uids.map(uid => {
        const socioRef = doc(db, 'socios', uid);
        return updateDoc(socioRef, {
          ...updates,
          actualizadoEn: Timestamp.now()
        });
      });
      
      await Promise.all(promises);
      toast.success(`${uids.length} miembros actualizados exitosamente`);
    } catch (err) {
      console.error('Error bulk updating socios:', err);
      toast.error('Error al actualizar los miembros');
      throw new Error('Error al actualizar los socios');
    }
  };

  const bulkDeleteSocios = async (uids: string[], permanent: boolean = false): Promise<void> => {
    try {
      const promises = uids.map(uid => {
        const socioRef = doc(db, 'socios', uid);
        if (permanent) {
          return deleteDoc(socioRef);
        } else {
          return updateDoc(socioRef, { 
            estado: 'inactivo',
            actualizadoEn: Timestamp.now()
          });
        }
      });
      
      await Promise.all(promises);
      const action = permanent ? 'eliminados permanentemente' : 'desactivados';
      toast.success(`${uids.length} miembros ${action} exitosamente`);
    } catch (err) {
      console.error('Error bulk deleting socios:', err);
      toast.error('Error al procesar los miembros');
      throw new Error('Error al procesar los socios');
    }
  };

  const getStats = (): SocioStats => {
    return {
      total: allSocios.filter(s => s.estado !== 'inactivo').length,
      activos: allSocios.filter(s => s.estado === 'activo').length,
      vencidos: allSocios.filter(s => s.estado === 'vencido').length,
      inactivos: allSocios.filter(s => s.estado === 'inactivo').length
    };
  };

  const refreshData = useCallback(() => {
    setLoading(true);
    fetchSocios();
  }, [fetchSocios]);

  return {
    socios, // Solo activos y vencidos
    allSocios, // Incluye todos los estados
    loading,
    error,
    addSocio,
    updateSocio,
    deleteSocio,
    restoreSocio,
    addMultipleSocios,
    bulkUpdateSocios,
    bulkDeleteSocios,
    refreshData,
    stats: getStats()
  };
};