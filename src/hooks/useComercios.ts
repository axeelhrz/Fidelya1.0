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

interface UploadProgress {
  uploading: boolean;
  progress: number;
  type?: 'logo' | 'imagen';
}

interface UseComerciosReturn {
  comercio: Comercio | null;
  loading: boolean;
  error: string | null;
  stats: ComercioStats | null;
  statsLoading: boolean;
  uploadProgress: UploadProgress;
  updateProfile: (data: ComercioFormData) => Promise<boolean>;
  uploadImage: (file: File, type: 'logo' | 'imagen') => Promise<string | null>;
  updateVisibility: (visible: boolean) => Promise<boolean>;
  refreshStats: () => Promise<void>;
  generateQRUrl: (beneficioId?: string) => string;
  generateWebUrl: (beneficioId?: string) => string;
  clearError: () => void;
  retryConnection: () => void;
  syncUserData: () => Promise<void>;
}

export const useComercios = (): UseComerciosReturn => {
  const { user, firebaseUser } = useAuth();
  const [comercio, setComercio] = useState<Comercio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ComercioStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    uploading: false,
    progress: 0
  });

  // Memoize user ID to prevent unnecessary re-renders
  const userId = useMemo(() => firebaseUser?.uid, [firebaseUser?.uid]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Sync user data with comercio document
  const syncUserData = useCallback(async (): Promise<void> => {
    if (!userId || !user) return;

    try {
      console.log('🔄 Syncing user data with comercio document');
      await ComercioService.syncUserWithComercio(userId, user);
    } catch (error) {
      console.error('❌ Error syncing user data:', error);
    }
  }, [userId, user]);

  // Refresh stats function with better error handling
  const refreshStats = useCallback(async (): Promise<void> => {
    if (!userId) return;

    try {
      setStatsLoading(true);
      setError(null);
      
      const newStats = await ComercioService.getComercioStats(userId);
      setStats(newStats);
      
      console.log('✅ Estadísticas actualizadas exitosamente');
    } catch (error) {
      console.error('❌ Error refreshing stats:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar estadísticas';
      setError(errorMessage);
      
      // Don't show toast for stats errors, just log them
      console.warn('⚠️ No se pudieron cargar las estadísticas:', errorMessage);
    } finally {
      setStatsLoading(false);
    }
  }, [userId]);

  // Retry connection function
  const retryConnection = useCallback(() => {
    if (userId) {
      setError(null);
      setLoading(true);
      // The useEffect will handle reconnection
    }
  }, [userId]);

  // Fetch comercio data with stable dependencies
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setComercio(null);
      setStats(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const comercioRef = doc(db, 'comercios', userId);
    
    const unsubscribe = onSnapshot(
      comercioRef,
      {
        includeMetadataChanges: true
      },
      async (doc) => {
        try {
          if (doc.exists()) {
            const comercioData = { uid: doc.id, ...doc.data() } as Comercio;
            setComercio(comercioData);
            setError(null);
            
            // Log connection status
            const source = doc.metadata.fromCache ? 'cache' : 'server';
            console.log(`📊 Datos de comercio cargados desde: ${source}`);
          } else {
            console.warn('⚠️ Documento de comercio no existe, intentando crear...');
            
            // Try to sync user data and create the document
            if (user) {
              try {
                await ComercioService.syncUserWithComercio(userId, user);
                // The document creation will trigger this listener again
                return;
              } catch (syncError) {
                console.error('❌ Error creating comercio document:', syncError);
                setError('Error al crear el perfil del comercio');
              }
            } else {
              setError('Comercio no encontrado y no se pueden obtener datos del usuario');
            }
            
            setComercio(null);
          }
        } catch (docError) {
          console.error('❌ Error procesando documento de comercio:', docError);
          setError('Error al procesar los datos del comercio');
        } finally {
          setLoading(false);
        }
      }, 
      (error) => {
        console.error('❌ Error fetching comercio:', error);
        
        let errorMessage = 'Error al cargar los datos del comercio';
        
        if (error.code === 'permission-denied') {
          errorMessage = 'No tienes permisos para acceder a estos datos';
        } else if (error.code === 'unavailable') {
          errorMessage = 'Servicio temporalmente no disponible';
        } else if (error.message.includes('network')) {
          errorMessage = 'Error de conexión. Verifica tu internet.';
        }
        
        setError(errorMessage);
        setLoading(false);
        
        // Show toast only for critical errors
        if (error.code === 'permission-denied') {
          toast.error(errorMessage);
        }
      }
    );

    return () => unsubscribe();
  }, [userId, user]);

  // Load stats when comercio is loaded
  useEffect(() => {
    if (comercio && userId && !statsLoading) {
      refreshStats();
    }
  }, [comercio, userId, refreshStats, statsLoading]);

  // Update comercio profile with better validation
  const updateProfile = useCallback(async (data: ComercioFormData): Promise<boolean> => {
    if (!userId) {
      toast.error('Usuario no autenticado');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      await ComercioService.updateProfile(userId, data);
      
      toast.success('Perfil actualizado correctamente');
      console.log('✅ Perfil actualizado exitosamente');
      
      return true;
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      
      let errorMessage = 'Error al actualizar el perfil';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Upload image with progress tracking
  const uploadImage = useCallback(async (
    file: File, 
    type: 'logo' | 'imagen'
  ): Promise<string | null> => {
    if (!userId) {
      toast.error('Usuario no autenticado');
      return null;
    }

    try {
      setUploadProgress({
        uploading: true,
        progress: 0,
        type
      });
      
      setError(null);
      
      const downloadURL = await ComercioService.uploadComercioImage(
        userId, 
        file, 
        type,
        (progress) => {
          setUploadProgress(prev => ({
            ...prev,
            progress: Math.round(progress)
          }));
        }
      );
      
      setUploadProgress({
        uploading: false,
        progress: 100,
        type
      });
      
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress({
          uploading: false,
          progress: 0
        });
      }, 2000);
      
      toast.success(`${type === 'logo' ? 'Logo' : 'Imagen'} actualizada correctamente`);
      console.log(`✅ ${type} subida exitosamente`);
      
      return downloadURL;
      
    } catch (error) {
      console.error(`❌ Error uploading ${type}:`, error);
      
      setUploadProgress({
        uploading: false,
        progress: 0
      });
      
      let errorMessage = `Error al subir ${type === 'logo' ? 'el logo' : 'la imagen'}`;
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    }
  }, [userId]);

  // Update visibility
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
      console.error('❌ Error updating visibility:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la visibilidad';
      toast.error(errorMessage);
      return false;
    }
  }, [userId]);

  // Generate QR URL
  const generateQRUrl = useCallback((beneficioId?: string): string => {
    if (!userId) return '';
    return ComercioService.generateQRValidationURL(userId, beneficioId);
  }, [userId]);

  // Generate web URL
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
    uploadProgress,
    updateProfile,
    uploadImage,
    updateVisibility,
    refreshStats,
    generateQRUrl,
    generateWebUrl,
    clearError,
    retryConnection,
    syncUserData
  };
};