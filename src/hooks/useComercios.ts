'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  onSnapshot, 
  doc, 
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
  generateQRUrl: (beneficioId?: string) => string;
  generateWebUrl: (beneficioId?: string) => string;
}

export const useComercios = (): UseComerciosReturn => {
  const { user } = useAuth();
  const [comercio, setComercio] = useState<Comercio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ComercioStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // FIXED: Memoize user ID to prevent unnecessary re-renders
  const userId = useMemo(() => user?.uid, [user?.uid]);

  // FIXED: Refresh stats function with stable dependencies
  const refreshStats = useCallback(async (): Promise<void> => {
    if (!userId) return;

    try {
      setStatsLoading(true);
      const newStats = await ComercioService.getComercioStats(userId);
      setStats(newStats);
      setError(null);
    } catch (error) {
      console.error('Error refreshing stats:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar estadísticas';
      setError(errorMessage);
    } finally {
      setStatsLoading(false);
    }
  }, [userId]); // FIXED: Only depend on userId

  // FIXED: Fetch comercio data with stable dependencies
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setComercio(null);
      setStats(null);
      return;
    }

    setLoading(true);
    setError(null);

    const comercioRef = doc(db, 'comercios', userId);
    
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
  }, [userId]); // FIXED: Only depend on userId

  // FIXED: Load stats only when comercio is loaded and user is available
  useEffect(() => {
    if (comercio && userId && !statsLoading) {
      refreshStats();
    }
  }, [comercio?.uid, userId, refreshStats]); // FIXED: Depend on comercio.uid instead of entire comercio object

  // FIXED: Update comercio profile with stable dependencies
  const updateProfile = useCallback(async (data: ComercioFormData): Promise<boolean> => {
    if (!userId) {
      toast.error('Usuario no autenticado');
      return false;
    }

    try {
      setLoading(true);
      await ComercioService.updateProfile(userId, data);
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
  }, [userId]);

  // FIXED: Upload image with stable dependencies
  const uploadImage = useCallback(async (file: File, type: 'logo' | 'imagen'): Promise<string | null> => {
    if (!userId) {
      toast.error('Usuario no autenticado');
      return null;
    }

    try {
      const loadingToast = toast.loading(`Subiendo ${type === 'logo' ? 'logo' : 'imagen'}...`);
      
      const downloadURL = await ComercioService.uploadComercioImage(userId, file, type);
      
      toast.dismiss(loadingToast);
      toast.success(`${type === 'logo' ? 'Logo' : 'Imagen'} actualizada correctamente`);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : `Error al subir ${type === 'logo' ? 'el logo' : 'la imagen'}`;
      toast.error(errorMessage);
      return null;
    }
  }, [userId]);

  // FIXED: Update visibility with stable dependencies
  const updateVisibility = useCallback(async (visible: boolean): Promise<boolean> => {
    if (!userId) {
      toast.error('Usuario no autenticado');
      return false;
    }

    try {
      await ComercioService.updateVisibility(userId, visible);
      toast.success(`Comercio ${visible ? 'visible' : 'oculto'} para socios`);
      return true;
    } catch (error) {
      console.error('Error updating visibility:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la visibilidad';
      toast.error(errorMessage);
      return false;
    }
  }, [userId]);

  // FIXED: Generate QR URL with stable dependencies
  const generateQRUrl = useCallback((beneficioId?: string): string => {
    if (!userId) return '';
    return ComercioService.generateQRValidationURL(userId, beneficioId);
  }, [userId]);

  // FIXED: Generate web URL with stable dependencies
  const generateWebUrl = useCallback((beneficioId?: string): string => {
    if (!userId) return '';
    return ComercioService.generateWebValidationURL(userId, beneficioId);
  }, [userId]);

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
    generateQRUrl,
    generateWebUrl
  };
};