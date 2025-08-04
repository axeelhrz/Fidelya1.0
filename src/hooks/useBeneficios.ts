import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { validacionesService } from '@/services/validaciones.service';
import { Beneficio, BeneficioFormData, BeneficioUso } from '@/types/beneficio';
import toast from 'react-hot-toast';

interface UseBeneficiosReturn {
  beneficios: Beneficio[];
  beneficiosUsados: BeneficioUso[];
  loading: boolean;
  error: string | null;
  crearBeneficio: (data: BeneficioFormData) => Promise<boolean>;
  actualizarBeneficio: (id: string, data: Partial<BeneficioFormData>) => Promise<boolean>;
  eliminarBeneficio: (id: string) => Promise<boolean>;
  cambiarEstadoBeneficio: (id: string, estado: string) => Promise<boolean>;
  refrescar: () => Promise<void>;
  getBeneficioById: (id: string) => Beneficio | undefined;
}

export const useBeneficios = (): UseBeneficiosReturn => {
  const { user } = useAuth();
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [beneficiosUsados, setBeneficiosUsados] = useState<BeneficioUso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const cargarBeneficios = useCallback(async () => {
    if (!user) {
      setBeneficios([]);
      setBeneficiosUsados([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (user.role === 'socio') {
        // Load beneficios usados for socio from validaciones
        const historialResult = await validacionesService.getHistorialValidaciones(user.uid, 100);
        
        const beneficiosUsadosData: BeneficioUso[] = historialResult.validaciones.map(validacion => ({
          id: validacion.id,
          beneficioId: validacion.beneficioId,
          comercioId: validacion.comercioId,
          comercioNombre: validacion.comercioNombre,
          fechaUso: { toDate: () => validacion.fechaValidacion } as any,
          montoDescuento: validacion.montoDescuento,
          estado: validacion.estado === 'exitosa' ? 'usado' : 'cancelado',
          detalles: validacion.beneficioTitulo,
          codigoValidacion: validacion.codigoValidacion
        }));

        setBeneficiosUsados(beneficiosUsadosData);
        setBeneficios([]); // Socios don't create beneficios
        
      } else if (user.role === 'comercio') {
        // For comercio, we'll load from validaciones as well since we don't have a beneficios service
        const validacionesResult = await validacionesService.getValidacionesComercio(user.uid, 100);
        
        const beneficiosUsadosData: BeneficioUso[] = validacionesResult.validaciones.map(validacion => ({
          id: validacion.id,
          beneficioId: validacion.beneficioId,
          comercioId: validacion.comercioId,
          comercioNombre: validacion.comercioNombre,
          fechaUso: { toDate: () => validacion.fechaValidacion } as any,
          montoDescuento: validacion.montoDescuento,
          estado: validacion.estado === 'exitosa' ? 'usado' : 'cancelado',
          detalles: validacion.beneficioTitulo,
          codigoValidacion: validacion.codigoValidacion
        }));
        
        setBeneficiosUsados(beneficiosUsadosData);
        setBeneficios([]); // We'll implement this when we have the beneficios service
      }
    } catch (err) {
      console.error('Error loading beneficios:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar beneficios');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const crearBeneficio = useCallback(async (data: BeneficioFormData): Promise<boolean> => {
    if (!user || user.role !== 'comercio') {
      toast.error('No tienes permisos para crear beneficios');
      return false;
    }

    try {
      // TODO: Implement when beneficios service is available
      toast.error('Funcionalidad en desarrollo');
      return false;
    } catch (error) {
      console.error('Error creating beneficio:', error);
      toast.error('Error al crear el beneficio');
      return false;
    }
  }, [user]);

  const actualizarBeneficio = useCallback(async (id: string, data: Partial<BeneficioFormData>): Promise<boolean> => {
    if (!user || user.role !== 'comercio') {
      toast.error('No tienes permisos para actualizar beneficios');
      return false;
    }

    try {
      // TODO: Implement when beneficios service is available
      toast.error('Funcionalidad en desarrollo');
      return false;
    } catch (error) {
      console.error('Error updating beneficio:', error);
      toast.error('Error al actualizar el beneficio');
      return false;
    }
  }, [user]);

  const eliminarBeneficio = useCallback(async (id: string): Promise<boolean> => {
    if (!user || user.role !== 'comercio') {
      toast.error('No tienes permisos para eliminar beneficios');
      return false;
    }

    try {
      // TODO: Implement when beneficios service is available
      toast.error('Funcionalidad en desarrollo');
      return false;
    } catch (error) {
      console.error('Error deleting beneficio:', error);
      toast.error('Error al eliminar el beneficio');
      return false;
    }
  }, [user]);

  const cambiarEstadoBeneficio = useCallback(async (id: string, estado: string): Promise<boolean> => {
    if (!user || user.role !== 'comercio') {
      toast.error('No tienes permisos para cambiar el estado del beneficio');
      return false;
    }

    try {
      // TODO: Implement when beneficios service is available
      toast.error('Funcionalidad en desarrollo');
      return false;
    } catch (error) {
      console.error('Error changing beneficio status:', error);
      toast.error('Error al cambiar el estado del beneficio');
      return false;
    }
  }, [user]);

  const refrescar = useCallback(async () => {
    await cargarBeneficios();
  }, [cargarBeneficios]);

  const getBeneficioById = useCallback((id: string): Beneficio | undefined => {
    return beneficios.find(b => b.id === id);
  }, [beneficios]);

  // Set up real-time subscription for validaciones
  useEffect(() => {
    if (user) {
      // Clean up previous subscription
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      // Set up new subscription for validaciones
      const userType = user.role === 'comercio' ? 'comercio' : 'socio';
      unsubscribeRef.current = validacionesService.subscribeToValidaciones(
        user.uid,
        userType,
        (newValidaciones) => {
          // Update beneficiosUsados when validaciones change
          const beneficiosUsadosData: BeneficioUso[] = newValidaciones.map(validacion => ({
            id: validacion.id,
            beneficioId: validacion.beneficioId,
            comercioId: validacion.comercioId,
            comercioNombre: validacion.comercioNombre,
            fechaUso: { toDate: () => validacion.fechaValidacion } as any,
            montoDescuento: validacion.montoDescuento,
            estado: validacion.estado === 'exitosa' ? 'usado' : 'cancelado',
            detalles: validacion.beneficioTitulo,
            codigoValidacion: validacion.codigoValidacion
          }));
          setBeneficiosUsados(beneficiosUsadosData);
        }
      );

      // Initial load
      cargarBeneficios();
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [user, cargarBeneficios]);

  return {
    beneficios,
    beneficiosUsados,
    loading,
    error,
    crearBeneficio,
    actualizarBeneficio,
    eliminarBeneficio,
    cambiarEstadoBeneficio,
    refrescar,
    getBeneficioById
  };
};