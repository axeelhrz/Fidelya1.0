'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/constants';
import { useAuth } from './useAuth';
import { socioService, SocioProfileData, SocioStats } from '@/services/socio.service';
import { Socio } from '@/types/socio';
import toast from 'react-hot-toast';

interface UseSocioProfileReturn {
  // Data
  socio: Socio | null;
  stats: SocioStats | null;
  asociaciones: any[];
  loading: boolean;
  updating: boolean;
  error: string | null;
  
  // Actions
  updateProfile: (data: Partial<SocioProfileData>) => Promise<void>;
  refreshData: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

export const useSocioProfile = (): UseSocioProfileReturn => {
  const { user } = useAuth();
  const [socio, setSocio] = useState<Socio | null>(null);
  const [stats, setStats] = useState<SocioStats | null>(null);
  const [asociaciones, setAsociaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch socio profile data
  const fetchSocioData = useCallback(async () => {
    if (!user || user.role !== 'socio') {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Set up real-time listener for socio data
      const socioRef = doc(db, COLLECTIONS.SOCIOS, user.uid);
      const unsubscribe = onSnapshot(socioRef, 
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setSocio({
              uid: doc.id,
              ...data,
              creadoEn: data.creadoEn || new Date(),
            } as Socio);
          } else {
            setSocio(null);
            setError('Perfil de socio no encontrado');
          }
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching socio data:', err);
          setError('Error al cargar los datos del perfil');
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error('Error setting up socio listener:', err);
      setError('Error al configurar la conexión con la base de datos');
      setLoading(false);
    }
  }, [user]);

  // Fetch stats
  const refreshStats = useCallback(async () => {
    if (!user || user.role !== 'socio') return;

    try {
      const statsData = await socioService.getSocioStats(user.uid);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Don't show error for stats, just log it
    }
  }, [user]);

  // Fetch asociaciones
  const fetchAsociaciones = useCallback(async () => {
    if (!user || user.role !== 'socio') return;

    try {
      const asociacionesData = await socioService.getSocioAsociaciones(user.uid);
      setAsociaciones(asociacionesData);
    } catch (err) {
      console.error('Error fetching asociaciones:', err);
      setAsociaciones([]);
    }
  }, [user]);

  // Update profile
  const updateProfile = useCallback(async (data: Partial<SocioProfileData>) => {
    if (!user || user.role !== 'socio') {
      throw new Error('Usuario no autorizado');
    }

    setUpdating(true);
    try {
      // Validate data
      const validationErrors = socioService.validateProfileData(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      await socioService.updateSocioProfile(user.uid, data);
      toast.success('Perfil actualizado exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el perfil';
      toast.error(errorMessage);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [user]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        refreshStats(),
        fetchAsociaciones()
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  }, [refreshStats, fetchAsociaciones]);

  // Initialize data
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeData = async () => {
      unsubscribe = await fetchSocioData();
      if (user && user.role === 'socio') {
        await Promise.all([
          refreshStats(),
          fetchAsociaciones()
        ]);
      }
    };

    initializeData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, fetchSocioData, refreshStats, fetchAsociaciones]);

  return {
    socio,
    stats,
    asociaciones,
    loading,
    updating,
    error,
    updateProfile,
    refreshData,
    refreshStats
  };
};
