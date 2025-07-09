import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './useAuth';
import { 
  adhesionService, 
  ComercioDisponible, 
  AdhesionStats 
} from '@/services/adhesion.service';

interface UseComercios {
  // Data
  comerciosVinculados: ComercioDisponible[];
  comerciosDisponibles: ComercioDisponible[];
  stats: AdhesionStats;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadComercios: () => Promise<void>;
  buscarComercios: (termino: string) => Promise<ComercioDisponible[]>;
  vincularComercio: (comercioId: string) => Promise<boolean>;
  desvincularComercio: (comercioId: string) => Promise<boolean>;
  getComerciossDisponibles: (filtros?: {
    categoria?: string;
    busqueda?: string;
    soloNoVinculados?: boolean;
  }) => Promise<void>;
  refreshStats: () => Promise<void>;
  clearError: () => void;
}

export const useComercios = (): UseComercios => {
  const { user } = useAuth();
  const [comerciosVinculados, setComerciossVinculados] = useState<ComercioDisponible[]>([]);
  const [comerciosDisponibles, setComerciossDisponibles] = useState<ComercioDisponible[]>([]);
  const [stats, setStats] = useState<AdhesionStats>({
    totalComercios: 0,
    comerciosActivos: 0,
    solicitudesPendientes: 0,
    adhesionesEsteMes: 0,
    categorias: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const asociacionId = user?.uid || '';

  // Load comercios vinculados
  const loadComercios = useCallback(async () => {
    if (!asociacionId) return;

    setLoading(true);
    setError(null);

    try {
      const [vinculados, estadisticas] = await Promise.all([
        adhesionService.getComerciossVinculados(asociacionId),
        adhesionService.getAdhesionStats(asociacionId)
      ]);

      setComerciossVinculados(vinculados);
      setStats(estadisticas);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar comercios';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [asociacionId]);

  // Get comercios disponibles
  const getComerciossDisponibles = useCallback(async (filtros: {
    categoria?: string;
    busqueda?: string;
    soloNoVinculados?: boolean;
  } = {}) => {
    if (!asociacionId) return;

    setLoading(true);
    setError(null);

    try {
      const disponibles = await adhesionService.getComerciossDisponibles(asociacionId, filtros);
      setComerciossDisponibles(disponibles);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar comercios disponibles';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [asociacionId]);

  // Buscar comercios
  const buscarComercios = useCallback(async (termino: string): Promise<ComercioDisponible[]> => {
    if (!asociacionId) return [];

    try {
      return await adhesionService.buscarComercios(termino, asociacionId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al buscar comercios';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    }
  }, [asociacionId]);

  // Vincular comercio
  const vincularComercio = useCallback(async (comercioId: string): Promise<boolean> => {
    if (!asociacionId) return false;

    setLoading(true);
    setError(null);

    try {
      // Validar vinculación
      const validacion = await adhesionService.validarVinculacion(comercioId, asociacionId);
      if (!validacion.valido) {
        toast.error(validacion.motivo || 'No se puede vincular el comercio');
        return false;
      }

      const success = await adhesionService.vincularComercio(comercioId, asociacionId);
      
      if (success) {
        toast.success('Comercio vinculado exitosamente');
        // Recargar datos
        await loadComercios();
        return true;
      } else {
        toast.error('Error al vincular el comercio');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al vincular comercio';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [asociacionId, loadComercios]);

  // Desvincular comercio
  const desvincularComercio = useCallback(async (comercioId: string): Promise<boolean> => {
    if (!asociacionId) return false;

    setLoading(true);
    setError(null);

    try {
      const success = await adhesionService.desvincularComercio(comercioId, asociacionId);
      
      if (success) {
        toast.success('Comercio desvinculado exitosamente');
        // Recargar datos
        await loadComercios();
        return true;
      } else {
        toast.error('Error al desvincular el comercio');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al desvincular comercio';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [asociacionId, loadComercios]);

  // Refresh stats
  const refreshStats = useCallback(async () => {
    if (!asociacionId) return;

    try {
      const estadisticas = await adhesionService.getAdhesionStats(asociacionId);
      setStats(estadisticas);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar estadísticas';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [asociacionId]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load initial data
  useEffect(() => {
    if (asociacionId) {
      loadComercios();
    }
  }, [asociacionId, loadComercios]);

  return {
    // Data
    comerciosVinculados,
    comerciosDisponibles,
    stats,
    loading,
    error,
    
    // Actions
    loadComercios,
    buscarComercios,
    vincularComercio,
    desvincularComercio,
    getComerciossDisponibles,
    refreshStats,
    clearError
  };
};