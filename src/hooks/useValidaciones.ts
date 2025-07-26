import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { validacionesService } from '@/services/validaciones.service';
import { ValidacionResponse, Validacion } from '@/types/validacion';
import { Timestamp } from 'firebase/firestore';

interface UseValidacionesReturn {
  validaciones: Validacion[];
  loading: boolean;
  error: string | null;
  refrescar: () => Promise<void>;
  validarQR: (qrData: string) => Promise<ValidacionResponse>;
  refresh: () => Promise<void>;
  getStats: () => {
    totalValidaciones: number;
    validacionesExitosas: number;
    clientesUnicos: number;
    montoTotal: number;
  };
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export const useValidaciones = (): UseValidacionesReturn => {
  const { user } = useAuth();
  const [validaciones, setValidaciones] = useState<Validacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  const cargarValidaciones = useCallback(async (reset = false) => {
    if (!user) {
      setValidaciones([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await validacionesService.getHistorialValidaciones(
        user.uid, 
        reset ? null : lastDoc
      );
      
      if (reset) {
        setValidaciones(result.validaciones || []);
      } else {
        setValidaciones(prev => [...prev, ...(result.validaciones || [])]);
      }
      
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore || false);
    } catch (err) {
      console.error('Error loading validaciones:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar validaciones');
      if (reset) {
        setValidaciones([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user, lastDoc]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await cargarValidaciones(false);
  }, [hasMore, loading, cargarValidaciones]);

  const validarQR = useCallback(async (qrData: string): Promise<ValidacionResponse> => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    try {
      const parsedData = validacionesService.parseQRData(qrData);
      if (!parsedData) {
        throw new Error('Código QR inválido');
      }

      const result = await validacionesService.validarAcceso({
        socioId: user.uid,
        comercioId: parsedData.comercioId,
        beneficioId: parsedData.beneficioId,
        asociacionId: user.asociacionId
      });

      // Transform result to match ValidacionResponse interface
      const transformedResult: ValidacionResponse = {
        resultado: result.success ? 'habilitado' : 'no_habilitado',
        motivo: result.message,
        fechaHora: new Date(),
        montoDescuento: result.data?.validacion?.montoDescuento || 0,
        beneficioTitulo: result.data?.beneficio?.titulo,
        comercioNombre: result.data?.comercio?.nombre,
        socio: result.data?.socio || {
          nombre: user.displayName || 'Usuario',
          estado: 'activo',
          asociacion: user.asociacionId || 'independiente'
        },
        id: result.data?.validacion?.id
      };

      // Refresh data after successful validation
      if (result.success) {
        setTimeout(() => {
          refrescar();
        }, 1000);
      }

      return transformedResult;
    } catch (err) {
      console.error('Error validating QR:', err);
      throw err;
    }
  }, [user]);

  const refrescar = useCallback(async () => {
    await cargarValidaciones(true);
  }, [cargarValidaciones]);

  const refresh = useCallback(async () => {
    await refrescar();
  }, [refrescar]);

  const getStats = useCallback(() => {
    const stats = {
      totalValidaciones: validaciones.length,
      validacionesExitosas: validaciones.filter(v => v.resultado === 'habilitado').length,
      clientesUnicos: new Set(validaciones.map(v => v.socioId)).size,
      montoTotal: validaciones.reduce((sum, v) => sum + (v.montoDescuento || 0), 0)
    };
    
    return stats;
  }, [validaciones]);

  useEffect(() => {
    cargarValidaciones(true);
  }, [user]);

  return {
    validaciones,
    loading,
    error,
    refrescar,
    validarQR,
    refresh,
    getStats,
    loadMore,
    hasMore
  };
};