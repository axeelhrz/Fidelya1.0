import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { validacionesService, HistorialValidacion } from '@/services/validaciones.service';
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
  const [lastDoc, setLastDoc] = useState<unknown>(null);

  // Transform HistorialValidacion to Validacion
  const transformHistorialToValidacion = useCallback((historial: HistorialValidacion): Validacion => {
    return {
      id: historial.id,
      socioId: user?.uid || '',
      socioNombre: user?.nombre || 'Usuario',
      asociacionId: user?.asociacionId || '',
      asociacionNombre: '', // This field doesn't exist in UserData, so we'll leave it empty
      comercioId: historial.comercioId,
      comercioNombre: historial.comercioNombre,
      beneficioId: historial.beneficioId,
      beneficioTitulo: historial.beneficioTitulo,
      fechaHora: Timestamp.fromDate(historial.fechaValidacion),
      resultado: historial.estado === 'exitosa' ? 'habilitado' : 
                 historial.estado === 'fallida' ? 'no_habilitado' :
                 historial.estado === 'cancelada' ? 'suspendido' : 'vencido',
      motivo: historial.estado === 'exitosa' ? 'Validación exitosa' : 'Validación fallida',
      montoDescuento: historial.montoDescuento,
      metadata: {
        qrData: historial.codigoValidacion,
        dispositivo: 'mobile',
        ip: '0.0.0.0'
      },
      estado: historial.estado === 'exitosa' ? 'completado' : 'fallido',
      monto: historial.montoDescuento || 0,
      ahorro: historial.montoDescuento || 0
    };
  }, [user]);

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
        20, // Load 20 items at a time
        reset ? null : lastDoc
      );
      
      // Transform HistorialValidacion[] to Validacion[]
      const transformedValidaciones = result.validaciones.map(transformHistorialToValidacion);
      
      if (reset) {
        setValidaciones(transformedValidaciones);
      } else {
        setValidaciones(prev => [...prev, ...transformedValidaciones]);
      }
      
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Error loading validaciones:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar validaciones');
      if (reset) {
        setValidaciones([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user, lastDoc, transformHistorialToValidacion]);

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
        socio: {
          nombre: result.data?.socio?.nombre || user.nombre || 'Usuario',
          estado: result.data?.socio?.estadoMembresia || 'activo',
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
    setLastDoc(null); // Reset pagination
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
    if (user) {
      cargarValidaciones(true);
    }
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