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
import { Beneficio, BeneficioFormData } from '@/types/comercio';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useBeneficios = () => {
  const { user } = useAuth();
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch beneficios
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const beneficiosQuery = query(
      collection(db, 'beneficios'),
      where('comercioId', '==', user.uid),
      orderBy('creadoEn', 'desc')
    );

    const unsubscribe = onSnapshot(beneficiosQuery, (snapshot) => {
      const beneficiosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Beneficio[];

      setBeneficios(beneficiosData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching beneficios:', error);
      setError('Error al cargar los beneficios');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Create beneficio
  const createBeneficio = useCallback(async (data: BeneficioFormData): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);
      
      const beneficioData = {
        ...data,
        comercioId: user.uid,
        fechaInicio: Timestamp.fromDate(data.fechaInicio),
        fechaFin: Timestamp.fromDate(data.fechaFin),
        usosActuales: 0,
        estado: 'activo' as const,
        creadoEn: Timestamp.now(),
        actualizadoEn: Timestamp.now()
      };

      await addDoc(collection(db, 'beneficios'), beneficioData);
      toast.success('Beneficio creado correctamente');
      return true;
    } catch (error) {
      console.error('Error creating beneficio:', error);
      toast.error('Error al crear el beneficio');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update beneficio
  const updateBeneficio = useCallback(async (id: string, data: Partial<BeneficioFormData>): Promise<boolean> => {
    try {
      setLoading(true);
      const beneficioRef = doc(db, 'beneficios', id);
      
      const updateData: any = {
        ...data,
        actualizadoEn: Timestamp.now()
      };

      // Convert dates if present
      if (data.fechaInicio) {
        updateData.fechaInicio = Timestamp.fromDate(data.fechaInicio);
      }
      if (data.fechaFin) {
        updateData.fechaFin = Timestamp.fromDate(data.fechaFin);
      }

      await updateDoc(beneficioRef, updateData);
      toast.success('Beneficio actualizado correctamente');
      return true;
    } catch (error) {
      console.error('Error updating beneficio:', error);
      toast.error('Error al actualizar el beneficio');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete beneficio (soft delete)
  const deleteBeneficio = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const beneficioRef = doc(db, 'beneficios', id);
      
      await updateDoc(beneficioRef, {
        estado: 'inactivo',
        actualizadoEn: Timestamp.now()
      });

      toast.success('Beneficio eliminado correctamente');
      return true;
    } catch (error) {
      console.error('Error deleting beneficio:', error);
      toast.error('Error al eliminar el beneficio');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle beneficio status
  const toggleBeneficioStatus = useCallback(async (id: string, newStatus: 'activo' | 'inactivo'): Promise<boolean> => {
    try {
      const beneficioRef = doc(db, 'beneficios', id);
      
      await updateDoc(beneficioRef, {
        estado: newStatus,
        actualizadoEn: Timestamp.now()
      });

      toast.success(`Beneficio ${newStatus === 'activo' ? 'activado' : 'desactivado'} correctamente`);
      return true;
    } catch (error) {
      console.error('Error toggling beneficio status:', error);
      toast.error('Error al cambiar el estado del beneficio');
      return false;
    }
  }, []);

  // Get active beneficios
  const activeBeneficios = beneficios.filter(b => b.estado === 'activo');
  
  // Get expired beneficios
  const expiredBeneficios = beneficios.filter(b => b.estado === 'vencido');

  return {
    beneficios,
    activeBeneficios,
    expiredBeneficios,
    loading,
    error,
    createBeneficio,
    updateBeneficio,
    deleteBeneficio,
    toggleBeneficioStatus
  };
};
