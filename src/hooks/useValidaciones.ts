import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { validacionesService } from '@/services/validaciones.service';
import { ValidacionResponse } from '@/types/validacion';

interface UseValidacionesReturn {
  validaciones: ValidacionResponse[];
  loading: boolean;
  error: string | null;
  refrescar: () => Promise<void>;
  validarQR: (qrData: string) => Promise<ValidacionResponse>;
}

export const useValidaciones = (): UseValidacionesReturn => {
  const { user } = useAuth();
  const [validaciones, setValidaciones] = useState<ValidacionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarValidaciones = useCallback(async () => {
    if (!user) {
      setValidaciones([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await validacionesService.getHistorialValidaciones(user.uid);
      
      // Transform data to match expected interface
      const transformedValidaciones: ValidacionResponse[] = result.validaciones.map(v => ({
        id: v.id,
        resultado: v.estado === 'exitosa' ? 'habilitado' : 'no_habilitado',
        motivo: v.estado === 'exitosa' ? 'Validación exitosa' : 'Validación fallida',
        fechaHora: v.fechaValidacion,
        montoDescuento: v.montoDescuento,
        beneficioTitulo: v.beneficioTitulo,
        comercioNombre: v.comercioNombre,
        socio: {
          nombre: user.displayName || 'Usuario',
          estado: 'activo',
          asociacion: user.asociacionId || 'independiente'
        }
      }));

      setValidaciones(transformedValidaciones);
    } catch (err) {
      console.error('Error loading validaciones:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar validaciones');
      setValidaciones([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const validarQR = useCallback(async (qrData: string): Promise<ValidacionResponse> => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

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

    // Transform result
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
        cargarValidaciones();
      }, 1000);
    }

    return transformedResult;
  }, [user, cargarValidaciones]);

  const refrescar = useCallback(async () => {
    await cargarValidaciones();
  }, [cargarValidaciones]);

  useEffect(() => {
    cargarValidaciones();
  }, [cargarValidaciones]);

  return {
    validaciones,
    loading,
    error,
    refrescar,
    validarQR
  };
};