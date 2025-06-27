'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { comercioService, ComercioFilters, ComercioResponse } from '@/services/comercio.service';
import { Comercio, ComercioFormData, ComercioStats } from '@/types/comercio';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

interface ComerciosState {
  comercio: Comercio | null;
  comercios: Comercio[];
  stats: ComercioStats | null;
  loading: boolean;
  error: string | null;
  uploading: boolean;
}

interface ComerciosActions {
  updateProfile: (data: ComercioFormData) => Promise<boolean>;
  uploadImage: (file: File, type: 'logo' | 'imagen') => Promise<string | null>;
  toggleVisibility: (visible: boolean) => Promise<boolean>;
  updateConfiguration: (config: Record<string, any>) => Promise<boolean>;
  refreshStats: () => Promise<void>;
  clearError: () => void;
  getComercios: (filters?: ComercioFilters) => Promise<void>;
}

export const useComercios = (): ComerciosState & ComerciosActions => {
  const { user } = useAuth();
  const [state, setState] = useState<ComerciosState>({
    comercio: null,
    comercios: [],
    stats: null,
    loading: true,
    error: null,
    uploading: false
  });

  // Subscribe to comercio changes
  useEffect(() => {
    if (!user || user.role !== 'comercio') {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    const unsubscribe = comercioService.subscribeToComercio(
      user.uid,
      (comercio) => {
        setState(prev => ({
          ...prev,
          comercio,
          loading: false,
          error: null
        }));
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Load stats when comercio is loaded
  useEffect(() => {
    if (state.comercio && user) {
      refreshStats();
    }
  }, [state.comercio, user]);

  // Update profile
  const updateProfile = useCallback(async (data: ComercioFormData): Promise<boolean> => {
    if (!user) return false;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await comercioService.updateProfile(user.uid, data);
      
      if (response.success) {
        toast.success('Perfil actualizado correctamente');
        return true;
      } else {
        setState(prev => ({ ...prev, error: response.error || 'Error al actualizar perfil' }));
        toast.error(response.error || 'Error al actualizar perfil');
        return false;
      }
    } catch (error) {
      const errorMessage = 'Error al actualizar el perfil';
      setState(prev => ({ ...prev, error: errorMessage }));
      toast.error(errorMessage);
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Upload image
  const uploadImage = useCallback(async (
    file: File, 
    type: 'logo' | 'imagen'
  ): Promise<string | null> => {
    if (!user) return null;

    setState(prev => ({ ...prev, uploading: true, error: null }));

    try {
      const response = await comercioService.uploadImage(user.uid, file, type);
      
      if (response.success) {
        toast.success(`${type === 'logo' ? 'Logo' : 'Imagen'} actualizada correctamente`);
        return response.data?.url || null;
      } else {
        setState(prev => ({ ...prev, error: response.error || 'Error al subir imagen' }));
        toast.error(response.error || 'Error al subir imagen');
        return null;
      }
    } catch (error) {
      const errorMessage = `Error al subir ${type === 'logo' ? 'el logo' : 'la imagen'}`;
      setState(prev => ({ ...prev, error: errorMessage }));
      toast.error(errorMessage);
      return null;
    } finally {
      setState(prev => ({ ...prev, uploading: false }));
    }
  }, [user]);

  // Toggle visibility
  const toggleVisibility = useCallback(async (visible: boolean): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await comercioService.toggleVisibility(user.uid, visible);
      
      if (response.success) {
        toast.success(`Comercio ${visible ? 'visible' : 'oculto'} correctamente`);
        return true;
      } else {
        toast.error(response.error || 'Error al cambiar visibilidad');
        return false;
      }
    } catch (error) {
      toast.error('Error al cambiar visibilidad');
      return false;
    }
  }, [user]);

  // Update configuration
  const updateConfiguration = useCallback(async (
    config: Record<string, any>
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await comercioService.updateConfiguration(user.uid, config);
      
      if (response.success) {
        toast.success('Configuración actualizada correctamente');
        return true;
      } else {
        toast.error(response.error || 'Error al actualizar configuración');
        return false;
      }
    } catch (error) {
      toast.error('Error al actualizar configuración');
      return false;
    }
  }, [user]);

  // Refresh stats
  const refreshStats = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      const stats = await comercioService.getStats(user.uid);
      setState(prev => ({ ...prev, stats, error: null }));
    } catch (error) {
      console.error('Error refreshing stats:', error);
      setState(prev => ({ ...prev, error: 'Error al cargar estadísticas' }));
    }
  }, [user]);

  // Get comercios with filters
  const getComercios = useCallback(async (filters: ComercioFilters = {}): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const comercios = await comercioService.getComercios(filters);
      setState(prev => ({ ...prev, comercios, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error al cargar comercios' 
      }));
    }
  }, []);

  // Clear error
  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Memoized QR URL
  const qrUrl = useMemo(() => {
    return state.comercio ? comercioService.generateQRUrl(state.comercio.uid) : null;
  }, [state.comercio]);

  return {
    ...state,
    updateProfile,
    uploadImage,
    toggleVisibility,
    updateConfiguration,
    refreshStats,
    clearError,
    getComercios,
    // Additional computed properties
    qrUrl,
    isVisible: state.comercio?.visible ?? false,
    hasLogo: !!state.comercio?.logoUrl,
    hasMainImage: !!state.comercio?.imagenPrincipalUrl
  };
};