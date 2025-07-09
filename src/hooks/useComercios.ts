import { useState, useEffect, useCallback } from 'react';
import { 
  comercioService, 
  Comercio, 
  ComercioFormData, 
  ComercioStats, 
  ValidationData 
} from '@/services/comercio.service';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface UseComerciosReturn {
  comercio: Comercio | null;
  stats: ComercioStats;
  validaciones: ValidationData[];
  analyticsData: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  hasMoreValidaciones: boolean;
  loadComercio: () => Promise<void>;
  updateComercio: (data: Partial<ComercioFormData>) => Promise<boolean>;
  uploadLogo: (file: File) => Promise<boolean>;
  generateQRCode: (beneficioId?: string) => Promise<boolean>;
  loadValidaciones: (filters?: Record<string, unknown>) => Promise<void>;
  loadMoreValidaciones: () => Promise<void>;
  loadAnalytics: (period?: 'week' | 'month' | 'year') => Promise<void>;
  updateConfiguration: (config: Record<string, unknown>) => Promise<boolean>;
  linkToAssociation: (asociacionId: string) => Promise<boolean>;
  unlinkFromAssociation: (asociacionId: string) => Promise<boolean>;
  refreshStats: () => Promise<void>;
  clearError: () => void;
}

export function useComercios(): UseComerciosReturn {
  const { user } = useAuth();
  const [comercio, setComercio] = useState<Comercio | null>(null);
  const [stats, setStats] = useState<ComercioStats>({
    totalBeneficios: 0,
    beneficiosActivos: 0,
    validacionesHoy: 0,
    validacionesMes: 0,
    clientesUnicos: 0,
    ingresosMensuales: 0,
    promedioValidacionesDiarias: 0,
    crecimientoMensual: 0,
  });
  const [validaciones, setValidaciones] = useState<ValidationData[]>([]);
  const [analyticsData, setAnalyticsData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastValidacionDoc, setLastValidacionDoc] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null);
  const [validacionFilters, setValidacionFilters] = useState<Record<string, unknown>>({});
  const [hasMoreValidaciones, setHasMoreValidaciones] = useState<boolean>(false);

  const comercioId = user?.uid || '';

  // Load comercio data
  const loadComercio = useCallback(async () => {
    if (!comercioId) return;

    try {
      setLoading(true);
      setError(null);

      const comercioData = await comercioService.getComercioById(comercioId);
      setComercio(comercioData);

      if (!comercioData) {
        setError('Comercio no encontrado');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar comercio';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [comercioId]);

  // Update comercio
  const updateComercio = useCallback(async (data: Partial<ComercioFormData>): Promise<boolean> => {
    if (!comercioId) return false;

    try {
      setLoading(true);
      setError(null);

      const success = await comercioService.updateComercio(comercioId, data);
      
      if (success) {
        toast.success('Comercio actualizado exitosamente');
        await loadComercio(); // Refresh data
        return true;
      } else {
        throw new Error('Error al actualizar comercio');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar comercio';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [comercioId, loadComercio]);

  // Upload logo
  const uploadLogo = useCallback(async (file: File): Promise<boolean> => {
    if (!comercioId) return false;

    try {
      setLoading(true);
      setError(null);

      const logoUrl = await comercioService.uploadLogo(comercioId, file);
      
      if (logoUrl) {
        toast.success('Logo subido exitosamente');
        await loadComercio(); // Refresh data
        return true;
      } else {
        throw new Error('Error al subir logo');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al subir logo';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [comercioId, loadComercio]);

  // Generate QR Code
  const generateQRCode = useCallback(async (beneficioId?: string): Promise<boolean> => {
    if (!comercioId) return false;

    try {
      setLoading(true);
      setError(null);

      const qrCode = await comercioService.generateQRCode(comercioId, beneficioId);
      
      if (qrCode) {
        toast.success('Código QR generado exitosamente');
        await loadComercio(); // Refresh data
        return true;
      } else {
        throw new Error('Error al generar código QR');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al generar código QR';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [comercioId, loadComercio]);

  // Load validaciones
  const loadValidaciones = useCallback(async (filters: Record<string, unknown> = {}) => {
    if (!comercioId) return;

    try {
      setLoading(true);
      setError(null);
      setValidacionFilters(filters);

      const result = await comercioService.getValidations(comercioId, filters, 20);
      
      setValidaciones(result.validaciones);
      setHasMoreValidaciones(result.hasMore);
      setLastValidacionDoc(result.lastDoc);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar validaciones';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [comercioId]);

  // Load more validaciones
  const loadMoreValidaciones = useCallback(async () => {
    if (!comercioId || !hasMoreValidaciones || loading) return;

    try {
      setLoading(true);

      const result = await comercioService.getValidations(
        comercioId, 
        validacionFilters, 
        20, 
        lastValidacionDoc
      );
      
      setValidaciones(prev => [...prev, ...result.validaciones]);
      setHasMoreValidaciones(result.hasMore);
      setLastValidacionDoc(result.lastDoc);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar más validaciones';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [comercioId, hasMoreValidaciones, loading, validacionFilters, lastValidacionDoc]);

  // Load analytics
  const loadAnalytics = useCallback(async (period: 'week' | 'month' | 'year' = 'month') => {
    if (!comercioId) return;

    try {
      setLoading(true);
      setError(null);

      const analytics = await comercioService.getAnalyticsData(comercioId, period);
      setAnalyticsData(analytics);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar analytics';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [comercioId]);

  // Update configuration
  const updateConfiguration = useCallback(async (config: Record<string, unknown>): Promise<boolean> => {
    if (!comercioId) return false;

    try {
      setLoading(true);
      setError(null);

      const success = await comercioService.updateConfiguration(comercioId, config);
      
      if (success) {
        toast.success('Configuración actualizada exitosamente');
        await loadComercio(); // Refresh data
        return true;
      } else {
        throw new Error('Error al actualizar configuración');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar configuración';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [comercioId, loadComercio]);

  // Link to association
  const linkToAssociation = useCallback(async (asociacionId: string): Promise<boolean> => {
    if (!comercioId) return false;

    try {
      setLoading(true);
      setError(null);

      const success = await comercioService.linkToAssociation(comercioId, asociacionId);
      
      if (success) {
        toast.success('Vinculado a asociación exitosamente');
        await loadComercio(); // Refresh data
        return true;
      } else {
        throw new Error('Error al vincular con asociación');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al vincular con asociación';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [comercioId, loadComercio]);

  // Unlink from association
  const unlinkFromAssociation = useCallback(async (asociacionId: string): Promise<boolean> => {
    if (!comercioId) return false;

    try {
      setLoading(true);
      setError(null);

      const success = await comercioService.unlinkFromAssociation(comercioId, asociacionId);
      
      if (success) {
        toast.success('Desvinculado de asociación exitosamente');
        await loadComercio(); // Refresh data
        return true;
      } else {
        throw new Error('Error al desvincular de asociación');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al desvincular de asociación';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [comercioId, loadComercio]);

  // Refresh stats
  const refreshStats = useCallback(async () => {
    if (!comercioId) return;

    try {
      const newStats = await comercioService.getComercioStats(comercioId);
      setStats(newStats);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  }, [comercioId]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load initial data
  useEffect(() => {
    if (comercioId) {
      loadComercio();
      refreshStats();
      loadValidaciones();
      loadAnalytics();
    }
  }, [comercioId, loadComercio, refreshStats, loadValidaciones, loadAnalytics]);

  return {
    comercio,
    stats,
    validaciones,
    analyticsData,
    loading,
    error,
    hasMoreValidaciones,
    loadComercio,
    updateComercio,
    uploadLogo,
    generateQRCode,
    loadValidaciones,
    loadMoreValidaciones,
    loadAnalytics,
    updateConfiguration,
    linkToAssociation,
    unlinkFromAssociation,
    refreshStats,
    clearError,
  };
}