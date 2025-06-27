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
import { Beneficio, BeneficioFormData } from '@/types/beneficio';
import { BeneficiosService } from '@/services/beneficios.service';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useBeneficios = () => {
  const { user } = useAuth();
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [beneficiosUsados, setBeneficiosUsados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch beneficios based on user role
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (user.role === 'comercio') {
      // Para comercios: obtener sus propios beneficios
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
    } else if (user.role === 'socio') {
      // Para socios: obtener beneficios disponibles y usados
      const loadSocioBeneficios = async () => {
        try {
          setLoading(true);
          
          // Obtener beneficios disponibles
          const disponibles = await BeneficiosService.getBeneficiosDisponibles(
            user.uid, 
            user.asociacionId || ''
          );
          setBeneficios(disponibles);

          // Obtener beneficios usados
          const usados = await BeneficiosService.getBeneficiosUsados(user.uid);
          setBeneficiosUsados(usados);

        } catch (error) {
          console.error('Error loading socio beneficios:', error);
          setError('Error al cargar los beneficios');
        } finally {
          setLoading(false);
        }
      };

      loadSocioBeneficios();
    }
  }, [user]);

  // Create beneficio (solo para comercios)
  const createBeneficio = useCallback(async (data: BeneficioFormData): Promise<boolean> => {
    if (!user || user.role !== 'comercio') return false;

    try {
      setLoading(true);
      
      const beneficioData = {
        ...data,
        comercioId: user.uid,
        comercioNombre: user.nombre,
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

  // Update beneficio (solo para comercios)
  const updateBeneficio = useCallback(async (id: string, data: Partial<BeneficioFormData>): Promise<boolean> => {
    if (!user || user.role !== 'comercio') return false;

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
  }, [user]);

  // Delete beneficio (solo para comercios)
  const deleteBeneficio = useCallback(async (id: string): Promise<boolean> => {
    if (!user || user.role !== 'comercio') return false;

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
  }, [user]);

  // Use beneficio (solo para socios)
  const useBeneficio = useCallback(async (beneficioId: string, comercioId: string): Promise<boolean> => {
    if (!user || user.role !== 'socio') return false;

    try {
      setLoading(true);
      
      await BeneficiosService.usarBeneficio(
        beneficioId,
        user.uid,
        comercioId,
        user.asociacionId || ''
      );

      toast.success('Beneficio usado correctamente');
      
      // Recargar beneficios
      const disponibles = await BeneficiosService.getBeneficiosDisponibles(
        user.uid, 
        user.asociacionId || ''
      );
      setBeneficios(disponibles);

      const usados = await BeneficiosService.getBeneficiosUsados(user.uid);
      setBeneficiosUsados(usados);

      return true;
    } catch (error) {
      console.error('Error using beneficio:', error);
      toast.error('Error al usar el beneficio');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Toggle beneficio status (solo para comercios)
  const toggleBeneficioStatus = useCallback(async (id: string, newStatus: 'activo' | 'inactivo'): Promise<boolean> => {
    if (!user || user.role !== 'comercio') return false;

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
  }, [user]);

  // Get active beneficios
  const activeBeneficios = beneficios.filter(b => b.estado === 'activo');
  
  // Get expired beneficios
  const expiredBeneficios = beneficios.filter(b => b.estado === 'vencido');

  return {
    beneficios,
    beneficiosUsados,
    activeBeneficios,
    expiredBeneficios,
    loading,
    error,
    createBeneficio,
    updateBeneficio,
    deleteBeneficio,
    useBeneficio,
    toggleBeneficioStatus
  };
};