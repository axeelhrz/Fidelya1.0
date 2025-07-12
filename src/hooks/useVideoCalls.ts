import { useState, useEffect, useCallback } from 'react';
import { VideoCall, CreateVideoCallData, UpdateVideoCallData, VideoCallFilters } from '../types/videocall';
import { VideoCallService } from '../lib/services/videoCallService';
import { useAuth } from '../contexts/AuthContext';

export const useVideoCalls = () => {
  const { user } = useAuth();
  const [videoCalls, setVideoCalls] = useState<VideoCall[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<VideoCallFilters>({});

  // Obtener videollamadas
  const fetchVideoCalls = useCallback(async () => {
    if (!user?.centerId || !user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const calls = await VideoCallService.getVideoCalls(
        user.centerId,
        user.id,
        filters
      );
      setVideoCalls(calls);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar videollamadas');
    } finally {
      setLoading(false);
    }
  }, [user?.centerId, user?.id, filters]);

  // Crear videollamada
  const createVideoCall = useCallback(async (data: CreateVideoCallData): Promise<string> => {
    if (!user?.centerId || !user?.id) {
      throw new Error('Usuario no autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      const videoCallId = await VideoCallService.createVideoCall(
        user.centerId,
        user.id,
        data
      );
      
      await fetchVideoCalls(); // Refrescar lista
      return videoCallId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear videollamada';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user?.centerId, user?.id, fetchVideoCalls]);

  // Actualizar videollamada
  const updateVideoCall = useCallback(async (
    videoCallId: string, 
    data: UpdateVideoCallData
  ): Promise<void> => {
    if (!user?.centerId) {
      throw new Error('Usuario no autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      await VideoCallService.updateVideoCall(user.centerId, videoCallId, data);
      await fetchVideoCalls(); // Refrescar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar videollamada';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user?.centerId, fetchVideoCalls]);

  // Cancelar videollamada
  const cancelVideoCall = useCallback(async (videoCallId: string): Promise<void> => {
    if (!user?.centerId) {
      throw new Error('Usuario no autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      await VideoCallService.cancelVideoCall(user.centerId, videoCallId);
      await fetchVideoCalls(); // Refrescar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cancelar videollamada';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user?.centerId, fetchVideoCalls]);

  // Obtener videollamada por ID
  const getVideoCallById = useCallback(async (videoCallId: string): Promise<VideoCall | null> => {
    if (!user?.centerId) return null;

    try {
      return await VideoCallService.getVideoCallById(user.centerId, videoCallId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener videollamada');
      return null;
    }
  }, [user?.centerId]);

  // Aplicar filtros
  const applyFilters = useCallback((newFilters: VideoCallFilters) => {
    setFilters(newFilters);
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Cargar videollamadas al montar el componente o cambiar filtros
  useEffect(() => {
    fetchVideoCalls();
  }, [fetchVideoCalls]);

  return {
    videoCalls,
    loading,
    error,
    filters,
    createVideoCall,
    updateVideoCall,
    cancelVideoCall,
    getVideoCallById,
    applyFilters,
    clearFilters,
    refetch: fetchVideoCalls
  };
};
