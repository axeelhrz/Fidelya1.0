'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  Timestamp,
  orderBy,
  UpdateData,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Beneficio, BeneficioFormData, BeneficioUso } from '@/types/beneficio';
import { BeneficiosService } from '@/services/beneficios.service';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useBeneficios = () => {
  const { user } = useAuth();
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [beneficiosUsados, setBeneficiosUsados] = useState<BeneficioUso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Referencias para evitar re-renders innecesarios
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const lastUserRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);

  // Función para limpiar listeners
  const cleanup = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  // Fetch beneficios based on user role - optimizado para evitar re-renders
  useEffect(() => {
    // Evitar ejecutar si no hay usuario o si es el mismo usuario
    if (!user || lastUserRef.current === user.uid || isLoadingRef.current) {
      if (!user) {
        setLoading(false);
        setBeneficios([]);
        setBeneficiosUsados([]);
      }
      return;
    }

    // Limpiar listeners anteriores
    cleanup();
    
    // Marcar como cargando
    isLoadingRef.current = true;
    lastUserRef.current = user.uid;
    setLoading(true);
    setError(null);

    if (user.role === 'comercio') {
      // Para comercios: obtener sus propios beneficios con listener en tiempo real
      try {
        const beneficiosQuery = query(
          collection(db, 'beneficios'),
          where('comercioId', '==', user.uid),
          orderBy('creadoEn', 'desc')
        );

        const unsubscribe = onSnapshot(
          beneficiosQuery, 
          (snapshot) => {
            try {
              const beneficiosData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })) as Beneficio[];

              setBeneficios(beneficiosData);
              setLoading(false);
              isLoadingRef.current = false;
              setError(null);
            } catch (err) {
              console.error('Error processing beneficios snapshot:', err);
              setError('Error al procesar los beneficios');
              setLoading(false);
              isLoadingRef.current = false;
            }
          }, 
          (error) => {
            console.error('Error fetching beneficios:', error);
            setError('Error al cargar los beneficios');
            setLoading(false);
            isLoadingRef.current = false;
          }
        );

        unsubscribeRef.current = unsubscribe;
      } catch (err) {
        console.error('Error setting up beneficios listener:', err);
        setError('Error al configurar la conexión');
        setLoading(false);
        isLoadingRef.current = false;
      }

    } else if (user.role === 'socio') {
      // Para socios: obtener beneficios disponibles y usados (sin listener en tiempo real)
      const loadSocioBeneficios = async () => {
        try {
          console.log('🎁 Cargando beneficios para socio:', user.uid);
          
          // Obtener beneficios disponibles
          const disponibles = await BeneficiosService.getBeneficiosDisponibles(
            user.uid, 
            user.asociacionId || ''
          );
          setBeneficios(disponibles);

          // Obtener beneficios usados
          const usados = await BeneficiosService.getBeneficiosUsados(user.uid);
          setBeneficiosUsados(usados);

          console.log('✅ Beneficios cargados exitosamente');
        } catch (error) {
          console.error('❌ Error loading socio beneficios:', error);
          setError('Error al cargar los beneficios');
        } finally {
          setLoading(false);
          isLoadingRef.current = false;
        }
      };

      loadSocioBeneficios();
    } else {
      setLoading(false);
      isLoadingRef.current = false;
    }

    // Cleanup function
    return cleanup;
  }, [user, user?.uid, user?.role, user?.asociacionId, cleanup]);

  // Cleanup al desmontar
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Función para refrescar datos manualmente (solo para socios)
  const refreshBeneficios = useCallback(async () => {
    if (!user || user.role !== 'socio' || isLoadingRef.current) return;

    try {
      setLoading(true);
      isLoadingRef.current = true;
      
      console.log('🔄 Refrescando beneficios...');
      
      // Obtener beneficios disponibles
      const disponibles = await BeneficiosService.getBeneficiosDisponibles(
        user.uid, 
        user.asociacionId || ''
      );
      setBeneficios(disponibles);

      // Obtener beneficios usados
      const usados = await BeneficiosService.getBeneficiosUsados(user.uid);
      setBeneficiosUsados(usados);

      console.log('✅ Beneficios refrescados');
    } catch (error) {
      console.error('❌ Error refreshing beneficios:', error);
      setError('Error al actualizar los beneficios');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [user]);

  // Create beneficio (solo para comercios)
  const createBeneficio = useCallback(async (data: BeneficioFormData): Promise<boolean> => {
    if (!user || user.role !== 'comercio') return false;

    try {
      console.log('➕ Creando beneficio...');
      
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
      console.log('✅ Beneficio creado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error creating beneficio:', error);
      toast.error('Error al crear el beneficio');
      return false;
    }
  }, [user]);

  // Update beneficio (solo para comercios)
  const updateBeneficio = useCallback(async (id: string, data: Partial<BeneficioFormData>): Promise<boolean> => {
    if (!user || user.role !== 'comercio') return false;

    try {
      console.log('📝 Actualizando beneficio:', id);
      
      const beneficioRef = doc(db, 'beneficios', id);
      
      // Separar las fechas del resto de los datos
      const { fechaInicio, fechaFin, ...otherData } = data;
      
      const updateData: UpdateData<Beneficio> = {
        ...otherData,
        actualizadoEn: Timestamp.now()
      };

      // Agregar fechas convertidas si están presentes
      if (fechaInicio) {
        updateData.fechaInicio = Timestamp.fromDate(fechaInicio);
      }
      if (fechaFin) {
        updateData.fechaFin = Timestamp.fromDate(fechaFin);
      }

      await updateDoc(beneficioRef, updateData);
      toast.success('Beneficio actualizado correctamente');
      console.log('✅ Beneficio actualizado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error updating beneficio:', error);
      toast.error('Error al actualizar el beneficio');
      return false;
    }
  }, [user]);

  // Delete beneficio (solo para comercios)
  const deleteBeneficio = useCallback(async (id: string): Promise<boolean> => {
    if (!user || user.role !== 'comercio') return false;

    try {
      console.log('🗑️ Eliminando beneficio:', id);
      
      const beneficioRef = doc(db, 'beneficios', id);
      
      await updateDoc(beneficioRef, {
        estado: 'inactivo',
        actualizadoEn: Timestamp.now()
      });

      toast.success('Beneficio eliminado correctamente');
      console.log('✅ Beneficio eliminado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error deleting beneficio:', error);
      toast.error('Error al eliminar el beneficio');
      return false;
    }
  }, [user]);

  // Apply/Use beneficio (solo para socios)
  const aplicarBeneficio = useCallback(async (beneficioId: string, comercioId: string): Promise<boolean> => {
    if (!user || user.role !== 'socio' || isLoadingRef.current) return false;

    try {
      console.log('🎯 Usando beneficio:', beneficioId);
      isLoadingRef.current = true;
      
      await BeneficiosService.usarBeneficio(
        beneficioId,
        user.uid,
        comercioId,
        user.asociacionId || ''
      );

      toast.success('Beneficio usado correctamente');
      
      // Recargar beneficios después de usar uno
      await refreshBeneficios();
      
      console.log('✅ Beneficio usado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error using beneficio:', error);
      toast.error('Error al usar el beneficio');
      return false;
    } finally {
      isLoadingRef.current = false;
    }
  }, [user, refreshBeneficios]);

  // Toggle beneficio status (solo para comercios)
  const toggleBeneficioStatus = useCallback(async (id: string, newStatus: 'activo' | 'inactivo'): Promise<boolean> => {
    if (!user || user.role !== 'comercio') return false;

    try {
      console.log('🔄 Cambiando estado del beneficio:', id, 'a', newStatus);
      
      const beneficioRef = doc(db, 'beneficios', id);
      
      await updateDoc(beneficioRef, {
        estado: newStatus,
        actualizadoEn: Timestamp.now()
      });

      toast.success(`Beneficio ${newStatus === 'activo' ? 'activado' : 'desactivado'} correctamente`);
      console.log('✅ Estado del beneficio cambiado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error toggling beneficio status:', error);
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
    aplicarBeneficio,
    toggleBeneficioStatus,
    refreshBeneficios
  };
};