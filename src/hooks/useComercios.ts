'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  onSnapshot, 
  doc, 
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Comercio, ComercioFormData, ComercioStats } from '@/types/comercio';
import { ComercioService } from '@/services/comercio.service';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

interface UseComerciosReturn {
  comercio: Comercio | null;
  loading: boolean;
  error: string | null;
  stats: ComercioStats | null;
  statsLoading: boolean;
  updateProfile: (data: ComercioFormData) => Promise<boolean>;
  uploadImage: (file: File, type: 'logo' | 'imagen') => Promise<string | null>;
  updateVisibility: (visible: boolean) => Promise<boolean>;
  refreshStats: () => Promise<void>;
  generateQRUrl: () => string;
}

export const useComercios = (): UseComerciosReturn => {
  const { user } = useAuth();
  const [comercio, setComercio] = useState<Comercio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ComercioStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Fetch comercio data with real-time updates
  useEffect(() => {
    if (!user) {
      setLoading(false);
      setComercio(null);
      return;
    }

    setLoading(true);
    setError(null);

    const comercioRef = doc(db, 'comercios', user.uid);
    
    const unsubscribe = onSnapshot(
      comercioRef, 
      (doc) => {
        if (doc.exists()) {
          const comercioData = { uid: doc.id, ...doc.data() } as Comercio;
          setComercio(comercioData);
          setError(null);
        } else {
          setComercio(null);
          setError('Comercio no encontrado');
        }
        setLoading(false);
      }, 
      (error) => {
        console.error('Error fetching comercio:', error);
        setError('Error al cargar los datos del comercio');
        setLoading(false);
        toast.error('Error al cargar los datos del comercio');
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Load stats when comercio is loaded
  useEffect(() => {
    if (comercio && user) {
      refreshStats();
    }
  }, [comercio?.uid]);

  // Update comercio profile
  const updateProfile = useCallback(async (data: ComercioFormData): Promise<boolean> => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return false;
    }

    try {
      setLoading(true);
      await ComercioService.updateProfile(user.uid, data);
      toast.success('Perfil actualizado correctamente');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el perfil';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Upload image (logo or main image)
  const uploadImage = useCallback(async (file: File, type: 'logo' | 'imagen'): Promise<string | null> => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return null;
    }

    try {
      const loadingToast = toast.loading(`Subiendo ${type === 'logo' ? 'logo' : 'imagen'}...`);
      
      const downloadURL = await ComercioService.uploadComercioImage(user.uid, file, type);
      
      toast.dismiss(loadingToast);
      toast.success(`${type === 'logo' ? 'Logo' : 'Imagen'} actualizada correctamente`);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : `Error al subir ${type === 'logo' ? 'el logo' : 'la imagen'}`;
      toast.error(errorMessage);
      return null;
    }
  }, [user]);

  // Update visibility
  const updateVisibility = useCallback(async (visible: boolean): Promise<boolean> => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return false;
    }

    try {
      await ComercioService.updateVisibility(user.uid, visible);
      toast.success(`Comercio ${visible ? 'visible' : 'oculto'} para socios`);
      return true;
    } catch (error) {
      console.error('Error updating visibility:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la visibilidad';
      toast.error(errorMessage);
      return false;
    }
  }, [user]);

  // Refresh stats
  const refreshStats = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      setStatsLoading(true);
      const newStats = await ComercioService.getComercioStats(user.uid);
      setStats(newStats);
    } catch (error) {
      console.error('Error refreshing stats:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar estadísticas';
      setError(errorMessage);
    } finally {
      setStatsLoading(false);
    }
  }, [user]);

  // Generate QR URL
  const generateQRUrl = useCallback((): string => {
    if (!user) return '';
    return ComercioService.generateQRValidationURL(user.uid);
  }, [user]);

  return {
    comercio,
    loading,
    error,
    stats,
    statsLoading,
    updateProfile,
    uploadImage,
    updateVisibility,
    refreshStats,
    generateQRUrl
  };
};