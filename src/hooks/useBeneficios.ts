import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { validacionesService } from '@/services/validaciones.service';
import BeneficiosService from '@/services/beneficios.service';
import { Beneficio, BeneficioFormData, BeneficioStats } from '@/types/beneficio';
import { Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

// Define a local interface that matches what we can provide
interface BeneficioUsoLocal {
  id: string;
  beneficioId: string;
  beneficioTitulo: string;
  beneficioDescripcion: string;
  comercioId: string;
  comercioNombre: string;
  comercioLogo?: string;
  socioId: string;
  socioNombre: string;
  socioEmail: string;
  asociacionId?: string | null;
  asociacionNombre?: string | null;
  fechaUso: Timestamp;
  montoDescuento: number;
  descuento: number;
  tipoDescuento: string;
  estado: 'usado' | 'cancelado' | 'pendiente' | 'vencido';
  detalles: string;
  codigoValidacion: string;
  metodoPago?: string;
  notas?: string | null;
}

interface EstadisticasRapidas {
  total: number;
  activos: number;
  usados: number;
  vencidos: number;
}

interface UseBeneficiosReturn {
  beneficios: Beneficio[];
  beneficiosUsados: BeneficioUsoLocal[];
  loading: boolean;
  error: string | null;
  crearBeneficio: (data: BeneficioFormData) => Promise<boolean>;
  actualizarBeneficio: (id: string, data: Partial<BeneficioFormData>) => Promise<boolean>;
  eliminarBeneficio: (id: string) => Promise<boolean>;
  cambiarEstadoBeneficio: (id: string, estado: string) => Promise<boolean>;
  refrescar: () => Promise<void>;
  getBeneficioById: (id: string) => Beneficio | undefined;
}

interface UseBeneficiosComerciosReturn extends UseBeneficiosReturn {
  stats: BeneficioStats;
  estadisticasRapidas: EstadisticasRapidas;
}

export const useBeneficios = (): UseBeneficiosReturn => {
  const { user } = useAuth();
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [beneficiosUsados, setBeneficiosUsados] = useState<BeneficioUsoLocal[]>([]);
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
        
        const beneficiosUsadosData: BeneficioUsoLocal[] = historialResult.validaciones.map(validacion => ({
          id: validacion.id,
          beneficioId: validacion.beneficioId,
          beneficioTitulo: validacion.beneficioTitulo || 'Beneficio',
          beneficioDescripcion: validacion.beneficioDescripcion || '',
          comercioId: validacion.comercioId,
          comercioNombre: validacion.comercioNombre || 'Comercio',
          comercioLogo: validacion.comercioLogo,
          socioId: user.uid,
          socioNombre: user.nombre || 'Usuario',
          socioEmail: user.email || '',
          asociacionId: user.asociacionId || null,
          asociacionNombre: null, // Not available in UserData
          fechaUso: Timestamp.fromDate(validacion.fechaValidacion),
          montoDescuento: validacion.montoDescuento || 0,
          descuento: validacion.descuento || 0,
          tipoDescuento: validacion.tipoDescuento || 'porcentaje',
          estado: validacion.estado === 'exitosa' ? 'usado' : 'cancelado',
          detalles: validacion.beneficioTitulo || 'Beneficio utilizado',
          codigoValidacion: validacion.codigoValidacion || '',
          metodoPago: 'efectivo',
          notas: null
        }));

        setBeneficiosUsados(beneficiosUsadosData);
        setBeneficios([]); // Socios don't create beneficios
        
      } else if (user.role === 'comercio') {
        // For comercio, we'll load from validaciones as well
        const validacionesResult = await validacionesService.getValidacionesComercio(user.uid, 100);
        
        const beneficiosUsadosData: BeneficioUsoLocal[] = validacionesResult.validaciones.map(validacion => ({
          id: validacion.id,
          beneficioId: validacion.beneficioId,
          beneficioTitulo: validacion.beneficioTitulo || 'Beneficio',
          beneficioDescripcion: validacion.beneficioDescripcion || '',
          comercioId: validacion.comercioId,
          comercioNombre: validacion.comercioNombre || 'Comercio',
          comercioLogo: validacion.comercioLogo,
          socioId: 'socio-' + validacion.id, // Generate a socio ID
          socioNombre: 'Socio',
          socioEmail: '',
          asociacionId: null,
          asociacionNombre: null,
          fechaUso: Timestamp.fromDate(validacion.fechaValidacion),
          montoDescuento: validacion.montoDescuento || 0,
          descuento: validacion.descuento || 0,
          tipoDescuento: validacion.tipoDescuento || 'porcentaje',
          estado: validacion.estado === 'exitosa' ? 'usado' : 'cancelado',
          detalles: validacion.beneficioTitulo || 'Beneficio utilizado',
          codigoValidacion: validacion.codigoValidacion || '',
          metodoPago: 'efectivo',
          notas: null
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

  const crearBeneficio = useCallback(async (): Promise<boolean> => {
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

  const actualizarBeneficio = useCallback(async (): Promise<boolean> => {
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

  const eliminarBeneficio = useCallback(async (): Promise<boolean> => {
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

  const cambiarEstadoBeneficio = useCallback(async (): Promise<boolean> => {
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
          const beneficiosUsadosData: BeneficioUsoLocal[] = newValidaciones.map(validacion => ({
            id: validacion.id,
            beneficioId: validacion.beneficioId,
            beneficioTitulo: validacion.beneficioTitulo || 'Beneficio',
            beneficioDescripcion: validacion.beneficioDescripcion || '',
            comercioId: validacion.comercioId,
            comercioNombre: validacion.comercioNombre || 'Comercio',
            comercioLogo: validacion.comercioLogo,
            socioId: user.role === 'socio' ? user.uid : ('socio-' + validacion.id),
            socioNombre: user.role === 'socio' ? (user.nombre || 'Usuario') : 'Socio',
            socioEmail: user.role === 'socio' ? (user.email || '') : '',
            asociacionId: user.role === 'socio' ? (user.asociacionId || null) : null,
            asociacionNombre: null, // Not available in UserData
            fechaUso: Timestamp.fromDate(validacion.fechaValidacion),
            montoDescuento: validacion.montoDescuento || 0,
            descuento: validacion.descuento || 0,
            tipoDescuento: validacion.tipoDescuento || 'porcentaje',
            estado: validacion.estado === 'exitosa' ? 'usado' : 'cancelado',
            detalles: validacion.beneficioTitulo || 'Beneficio utilizado',
            codigoValidacion: validacion.codigoValidacion || '',
            metodoPago: 'efectivo',
            notas: null
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

// Hook específico para comercios con funcionalidad completa
export const useBeneficiosComercios = (): UseBeneficiosComerciosReturn => {
  const { user } = useAuth();
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [beneficiosUsados, setBeneficiosUsados] = useState<BeneficioUsoLocal[]>([]);
  const [stats, setStats] = useState<BeneficioStats>({
    totalBeneficios: 0,
    beneficiosActivos: 0,
    beneficiosUsados: 0,
    beneficiosVencidos: 0,
    ahorroTotal: 0,
    ahorroEsteMes: 0,
    usosPorMes: [],
    topBeneficios: [],
    categorias: [],
    comercios: [],
    activos: 0
  });
  const [estadisticasRapidas, setEstadisticasRapidas] = useState<EstadisticasRapidas>({
    total: 0,
    activos: 0,
    usados: 0,
    vencidos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const cargarBeneficios = useCallback(async () => {
    if (!user || user.role !== 'comercio') {
      setBeneficios([]);
      setBeneficiosUsados([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando beneficios para comercio:', user.uid);

      // Cargar beneficios del comercio usando el servicio
      const beneficiosData = await BeneficiosService.obtenerBeneficiosPorComercio(user.uid);
      console.log('✅ Beneficios cargados:', beneficiosData.length);
      setBeneficios(beneficiosData);

      // Cargar validaciones/usos del comercio
      const validacionesResult = await validacionesService.getValidacionesComercio(user.uid, 100);
      console.log('✅ Validaciones cargadas:', validacionesResult.validaciones.length);
      
      const beneficiosUsadosData: BeneficioUsoLocal[] = validacionesResult.validaciones.map(validacion => ({
        id: validacion.id,
        beneficioId: validacion.beneficioId,
        beneficioTitulo: validacion.beneficioTitulo || 'Beneficio',
        beneficioDescripcion: validacion.beneficioDescripcion || '',
        comercioId: validacion.comercioId,
        comercioNombre: validacion.comercioNombre || 'Comercio',
        comercioLogo: validacion.comercioLogo,
        socioId: 'socio-' + validacion.id,
        socioNombre: 'Socio',
        socioEmail: '',
        asociacionId: null,
        asociacionNombre: null,
        fechaUso: Timestamp.fromDate(validacion.fechaValidacion),
        montoDescuento: validacion.montoDescuento || 0,
        descuento: validacion.descuento || 0,
        tipoDescuento: validacion.tipoDescuento || 'porcentaje',
        estado: validacion.estado === 'exitosa' ? 'usado' : 'cancelado',
        detalles: validacion.beneficioTitulo || 'Beneficio utilizado',
        codigoValidacion: validacion.codigoValidacion || '',
        metodoPago: 'efectivo',
        notas: null
      }));
      
      setBeneficiosUsados(beneficiosUsadosData);

      // Cargar estadísticas
      const statsData = await BeneficiosService.obtenerEstadisticas({
        comercioId: user.uid
      });
      console.log('✅ Estadísticas cargadas:', statsData);
      setStats(statsData);

      // Calcular estadísticas rápidas
      const now = new Date();
      const estadisticasRapidasData: EstadisticasRapidas = {
        total: beneficiosData.length,
        activos: beneficiosData.filter(b => b.estado === 'activo' && b.fechaFin.toDate() > now).length,
        usados: beneficiosUsadosData.length,
        vencidos: beneficiosData.filter(b => b.estado === 'vencido' || (b.estado === 'activo' && b.fechaFin.toDate() <= now)).length
      };
      console.log('✅ Estadísticas rápidas:', estadisticasRapidasData);
      setEstadisticasRapidas(estadisticasRapidasData);

    } catch (err) {
      console.error('❌ Error loading beneficios comercio:', err);
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
      console.log('🎯 Creando beneficio:', data);
      const beneficioId = await BeneficiosService.crearBeneficio(data, user.uid, user.role);
      console.log('✅ Beneficio creado con ID:', beneficioId);
      toast.success('Beneficio creado exitosamente');
      await cargarBeneficios(); // Recargar datos
      return true;
    } catch (error) {
      console.error('❌ Error creating beneficio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el beneficio';
      toast.error(errorMessage);
      return false;
    }
  }, [user, cargarBeneficios]);

  const actualizarBeneficio = useCallback(async (id: string, data: Partial<BeneficioFormData>): Promise<boolean> => {
    if (!user || user.role !== 'comercio') {
      toast.error('No tienes permisos para actualizar beneficios');
      return false;
    }

    try {
      console.log('🔄 Actualizando beneficio:', id, data);
      await BeneficiosService.actualizarBeneficio(id, data);
      console.log('✅ Beneficio actualizado');
      toast.success('Beneficio actualizado exitosamente');
      await cargarBeneficios(); // Recargar datos
      return true;
    } catch (error) {
      console.error('❌ Error updating beneficio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el beneficio';
      toast.error(errorMessage);
      return false;
    }
  }, [user, cargarBeneficios]);

  const eliminarBeneficio = useCallback(async (id: string): Promise<boolean> => {
    if (!user || user.role !== 'comercio') {
      toast.error('No tienes permisos para eliminar beneficios');
      return false;
    }

    try {
      console.log('🗑️ Eliminando beneficio:', id);
      await BeneficiosService.eliminarBeneficio(id);
      console.log('✅ Beneficio eliminado');
      toast.success('Beneficio eliminado exitosamente');
      await cargarBeneficios(); // Recargar datos
      return true;
    } catch (error) {
      console.error('❌ Error deleting beneficio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el beneficio';
      toast.error(errorMessage);
      return false;
    }
  }, [user, cargarBeneficios]);

  const cambiarEstadoBeneficio = useCallback(async (id: string, estado: string): Promise<boolean> => {
    if (!user || user.role !== 'comercio') {
      toast.error('No tienes permisos para cambiar el estado del beneficio');
      return false;
    }

    try {
      console.log('🔄 Cambiando estado del beneficio:', id, 'a', estado);
      await BeneficiosService.actualizarEstadoBeneficio(id, estado as 'activo' | 'inactivo' | 'vencido' | 'agotado');
      console.log('✅ Estado del beneficio actualizado');
      toast.success('Estado del beneficio actualizado');
      await cargarBeneficios(); // Recargar datos
      return true;
    } catch (error) {
      console.error('❌ Error changing beneficio status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar el estado del beneficio';
      toast.error(errorMessage);
      return false;
    }
  }, [user, cargarBeneficios]);

  const refrescar = useCallback(async () => {
    console.log('🔄 Refrescando datos...');
    await cargarBeneficios();
  }, [cargarBeneficios]);

  const getBeneficioById = useCallback((id: string): Beneficio | undefined => {
    return beneficios.find(b => b.id === id);
  }, [beneficios]);

  // Set up real-time subscription for beneficios del comercio
  useEffect(() => {
    if (user && user.role === 'comercio') {
      console.log('🔄 Configurando suscripción en tiempo real para comercio:', user.uid);
      
      // Clean up previous subscription
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      // Set up new subscription for beneficios del comercio
      unsubscribeRef.current = BeneficiosService.suscribirBeneficiosComercio(
        user.uid,
        (newBeneficios) => {
          console.log('🔄 Beneficios actualizados en tiempo real:', newBeneficios.length);
          setBeneficios(newBeneficios);
          
          // Recalcular estadísticas rápidas
          const now = new Date();
          const estadisticasRapidasData: EstadisticasRapidas = {
            total: newBeneficios.length,
            activos: newBeneficios.filter(b => b.estado === 'activo' && b.fechaFin.toDate() > now).length,
            usados: beneficiosUsados.length, // Mantener el valor actual
            vencidos: newBeneficios.filter(b => b.estado === 'vencido' || (b.estado === 'activo' && b.fechaFin.toDate() <= now)).length
          };
          setEstadisticasRapidas(estadisticasRapidasData);
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
  }, [user, cargarBeneficios, beneficiosUsados.length]);

  return {
    beneficios,
    beneficiosUsados,
    stats,
    estadisticasRapidas,
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