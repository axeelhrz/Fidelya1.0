'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/constants';
import { useAuth } from './useAuth';
import { socioService } from '@/services/socio.service';
import { 
  Socio, 
  SocioStats, 
  SocioAsociacion, 
  SocioActivity, 
  SocioConfiguration,
  UpdateSocioProfileData,
  SocioActivityFilter 
} from '@/types/socio';
import toast from 'react-hot-toast';

interface UseSocioProfileReturn {
  // Data
  socio: Socio | null;
  stats: SocioStats | null;
  asociaciones: SocioAsociacion[];
  activity: SocioActivity[];
  loading: boolean;
  updating: boolean;
  uploadingImage: boolean;
  error: string | null;
  
  // Actions
  updateProfile: (data: UpdateSocioProfileData) => Promise<void>;
  updateConfiguration: (config: Partial<SocioConfiguration>) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<string>;
  refreshData: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshActivity: (filter?: SocioActivityFilter) => Promise<void>;
  exportData: () => Promise<void>;
  logActivity: (activity: Omit<SocioActivity, 'id' | 'fecha'>) => Promise<void>;
}

export const useSocioProfile = (): UseSocioProfileReturn => {
  const { user } = useAuth();
  const [socio, setSocio] = useState<Socio | null>(null);
  const [stats, setStats] = useState<SocioStats | null>(null);
  const [asociaciones, setAsociaciones] = useState<SocioAsociacion[]>([]);
  const [activity, setActivity] = useState<SocioActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch socio profile data with real-time updates
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
        async (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            const socioData = {
              uid: doc.id,
              ...data,
              creadoEn: data.creadoEn || new Date(),
            } as Socio;
            
            setSocio(socioData);
            
            // Update last access
          //            await socioService.updateLastAccess(user.uid);
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

  // Fetch stats with caching
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

  // Fetch activity
  const refreshActivity = useCallback(async (filter: SocioActivityFilter = {}) => {
    if (!user || user.role !== 'socio') return;

    try {
      const activityData = await socioService.getSocioActivity(user.uid, {
        limit: 20,
        ...filter
      });
      setActivity(activityData);
    } catch (err) {
      console.error('Error fetching activity:', err);
      setActivity([]);
    }
  }, [user]);

  // Update profile
  const updateProfile = useCallback(async (data: UpdateSocioProfileData) => {
    if (!user || user.role !== 'socio') {
      throw new Error('Usuario no autorizado');
    }

    setUpdating(true);
    try {
      // Validate data
      let fechaNacimiento: Date | undefined = undefined;
      if (data.fechaNacimiento) {
        if (data.fechaNacimiento instanceof Date) {
          fechaNacimiento = data.fechaNacimiento;
        } else if (
          typeof data.fechaNacimiento === 'object' &&
          data.fechaNacimiento !== null &&
          typeof (data.fechaNacimiento as { toDate?: () => Date }).toDate === 'function'
        ) {
          fechaNacimiento = (data.fechaNacimiento as { toDate: () => Date }).toDate();
        }
      }
      const dataForValidation = {
        ...data,
        fechaNacimiento,
      };
      const validationErrors = socioService.validateProfileData(dataForValidation);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      await socioService.updateSocioProfile(user.uid, data);
      toast.success('Perfil actualizado exitosamente');
      
      // Refresh stats after profile update
      await refreshStats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el perfil';
      toast.error(errorMessage);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [user, refreshStats]);

  // Update configuration
  const updateConfiguration = useCallback(async (config: Partial<SocioConfiguration>) => {
    if (!user || user.role !== 'socio') {
      throw new Error('Usuario no autorizado');
    }

    setUpdating(true);
    try {
      await socioService.updateSocioConfiguration(user.uid, config);
      toast.success('Configuración actualizada exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la configuración';
      toast.error(errorMessage);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [user]);

  // Upload profile image
  const uploadProfileImage = useCallback(async (file: File): Promise<string> => {
    if (!user || user.role !== 'socio') {
      throw new Error('Usuario no autorizado');
    }

    setUploadingImage(true);
    try {
      const imageUrl = await socioService.uploadProfileImage(user.uid, file);
      toast.success('Imagen de perfil actualizada exitosamente');
      return imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir la imagen';
      toast.error(errorMessage);
      throw err;
    } finally {
      setUploadingImage(false);
    }
  }, [user]);

  // Log activity
  const logActivity = useCallback(async (activityData: Omit<SocioActivity, 'id' | 'fecha'>) => {
    if (!user || user.role !== 'socio') return;

    try {
      await socioService.logActivity(user.uid, activityData);
      // Refresh activity after logging
      await refreshActivity();
    } catch (err) {
      console.error('Error logging activity:', err);
      // Don't show error for activity logging
    }
  }, [user, refreshActivity]);

  // Export data
  const exportData = useCallback(async () => {
    if (!user || user.role !== 'socio') {
      throw new Error('Usuario no autorizado');
    }

    try {
      const exportData = await socioService.exportSocioData(user.uid);
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `perfil-socio-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Datos exportados exitosamente');
      
      // Log export activity
      await logActivity({
        tipo: 'actualizacion',
        titulo: 'Datos exportados',
        descripcion: 'Exportación completa de datos del perfil'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al exportar los datos';
      toast.error(errorMessage);
      throw err;
    }
  }, [user, logActivity]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        refreshStats(),
        fetchAsociaciones(),
        refreshActivity()
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  }, [refreshStats, fetchAsociaciones, refreshActivity]);

  // Initialize data
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeData = async () => {
      unsubscribe = await fetchSocioData();
      if (user && user.role === 'socio') {
        await Promise.all([
          refreshStats(),
          fetchAsociaciones(),
          refreshActivity()
        ]);
      }
    };

    initializeData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, fetchSocioData, refreshStats, fetchAsociaciones, refreshActivity]);

  // Auto-refresh stats every 5 minutes
  useEffect(() => {
    if (!user || user.role !== 'socio') return;

    const interval = setInterval(() => {
      refreshStats();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user, refreshStats]);

  return {
    socio,
    stats,
    asociaciones,
    activity,
    loading,
    updating,
    uploadingImage,
    error,
    updateProfile,
    updateConfiguration,
    uploadProfileImage,
    refreshData,
    refreshStats,
    refreshActivity,
    exportData,
    logActivity
  };
};