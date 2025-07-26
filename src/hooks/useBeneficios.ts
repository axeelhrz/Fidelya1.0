'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Unsubscribe } from 'firebase/firestore';
import { BeneficiosService } from '@/services/beneficios.service';
import { 
  Beneficio, 
  BeneficioUso, 
  BeneficioStats, 
  BeneficioFormData, 
  BeneficioFilter 
} from '@/types/beneficio';
import { useAuth } from './useAuth';
import { useDebouncedCallback } from './useDebounce';
import { optimizedNotifications } from '@/lib/optimized-notifications';

interface UseBeneficiosOptions {
  autoLoad?: boolean;
  useRealtime?: boolean;
  cacheEnabled?: boolean;
}

export const useBeneficios = (options: UseBeneficiosOptions = {}) => {
  const { 
    autoLoad = true, 
    useRealtime = false, 
  } = options;

  const { user } = useAuth();
  
  // Estados principales con referencias estables
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [beneficiosUsados, setBeneficiosUsados] = useState<BeneficioUso[]>([]);
  const [stats, setStats] = useState<BeneficioStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Referencias para optimización
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const mountedRef = useRef(true);
  const lastDataRef = useRef<{
    beneficios: Beneficio[];
    beneficiosUsados: BeneficioUso[];
    stats: BeneficioStats | null;
  }>({
    beneficios: [],
    beneficiosUsados: [],
    stats: null
  });

  // Debounced update functions para evitar actualizaciones muy frecuentes
  const debouncedSetBeneficios = useDebouncedCallback((newBeneficios: Beneficio[]) => {
    if (!mountedRef.current) return;
    
    // Solo actualizar si realmente cambió
    const currentStr = JSON.stringify(lastDataRef.current.beneficios);
    const newStr = JSON.stringify(newBeneficios);
    
    if (currentStr !== newStr) {
      setBeneficios(newBeneficios);
      lastDataRef.current.beneficios = newBeneficios;
    }
  }, 500);

  const debouncedSetBeneficiosUsados = useDebouncedCallback((newUsados: BeneficioUso[]) => {
    if (!mountedRef.current) return;
    
    const currentStr = JSON.stringify(lastDataRef.current.beneficiosUsados);
    const newStr = JSON.stringify(newUsados);
    
    if (currentStr !== newStr) {
      setBeneficiosUsados(newUsados);
      lastDataRef.current.beneficiosUsados = newUsados;
    }
  }, 500);

  const debouncedSetStats = useDebouncedCallback((newStats: BeneficioStats | null) => {
    if (!mountedRef.current) return;
    
    const currentStr = JSON.stringify(lastDataRef.current.stats);
    const newStr = JSON.stringify(newStats);
    
    if (currentStr !== newStr) {
      setStats(newStats);
      lastDataRef.current.stats = newStats;
    }
  }, 1000);

  // Cleanup al desmontar
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Cargar beneficios con cache y optimizaciones
  const cargarBeneficios = useCallback(async (filtros?: BeneficioFilter) => {
    if (!user || loading) return;

    try {
      setLoading(true);
      setError(null);

      let beneficiosData: Beneficio[] = [];

      switch (user.role) {
        case 'socio':
          if (user.asociacionId) {
            console.log('🔍 Cargando beneficios para socio:', user.uid);
            beneficiosData = await BeneficiosService.obtenerBeneficiosDisponibles(
              user.uid,
              user.asociacionId,
              filtros
            );
          } else {
            console.warn('⚠️ Socio sin asociación asignada');
            setError('No tienes una asociación asignada. Contacta al administrador.');
          }
          break;

        case 'comercio':
          beneficiosData = await BeneficiosService.obtenerBeneficiosPorComercio(user.uid);
          break;

        case 'asociacion':
          beneficiosData = await BeneficiosService.obtenerBeneficiosPorAsociacion(user.uid);
          break;

        default:
          console.warn('Rol de usuario no reconocido:', user.role);
      }

      // Usar debounced update
      debouncedSetBeneficios(beneficiosData);
      console.log(`✅ Se cargaron ${beneficiosData.length} beneficios para ${user.role}`);
    } catch (err) {
      console.error('Error cargando beneficios:', err);
      if (mountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar beneficios';
        setError(errorMessage);
        optimizedNotifications.error(errorMessage);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [user, loading, debouncedSetBeneficios]);

  // Cargar historial de usos optimizado
  const cargarHistorialUsos = useCallback(async () => {
    if (!user || user.role !== 'socio') return;

    try {
      const usos = await BeneficiosService.obtenerHistorialUsos(user.uid);
      debouncedSetBeneficiosUsados(usos);
      console.log(`✅ Se cargaron ${usos.length} usos del historial`);
    } catch (err) {
      console.error('Error cargando historial de usos:', err);
      if (mountedRef.current) {
        optimizedNotifications.error('Error al cargar el historial de beneficios');
      }
    }
  }, [user, debouncedSetBeneficiosUsados]);

  // Cargar estadísticas optimizado
  const cargarEstadisticas = useCallback(async () => {
    if (!user) return;

    try {
      const filtros: { comercioId?: string; asociacionId?: string; socioId?: string } = {};
      
      if (user.role === 'comercio') {
        filtros.comercioId = user.uid;
      } else if (user.role === 'asociacion') {
        filtros.asociacionId = user.uid;
      } else if (user.role === 'socio' && user.asociacionId) {
        filtros.socioId = user.uid;
        filtros.asociacionId = user.asociacionId;
      }

      console.log('🔍 Cargando estadísticas con filtros:', filtros);
      const estadisticas = await BeneficiosService.obtenerEstadisticas(filtros);
      debouncedSetStats(estadisticas);
      console.log('✅ Estadísticas cargadas:', estadisticas);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  }, [user, debouncedSetStats]);

  // Configurar listener en tiempo real optimizado
  const configurarRealtime = useCallback(() => {
    if (!user || !useRealtime) return;

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    switch (user.role) {
      case 'socio':
        if (user.asociacionId) {
          console.log('🔄 Configurando listener en tiempo real para socio');
          unsubscribeRef.current = BeneficiosService.suscribirBeneficiosDisponibles(
            user.uid,
            user.asociacionId,
            (beneficiosData) => {
              debouncedSetBeneficios(beneficiosData);
              console.log(`🔄 Beneficios actualizados en tiempo real: ${beneficiosData.length}`);
            }
          );
        }
        break;

      case 'comercio':
        unsubscribeRef.current = BeneficiosService.suscribirBeneficiosComercio(
          user.uid,
          (beneficiosData) => {
            debouncedSetBeneficios(beneficiosData);
          }
        );
        break;
    }
  }, [user, useRealtime, debouncedSetBeneficios]);

  // Efecto principal optimizado
  useEffect(() => {
    if (autoLoad && user) {
      if (useRealtime) {
        configurarRealtime();
      } else {
        cargarBeneficios();
      }
      
      if (user.role === 'socio') {
        cargarHistorialUsos();
      }
      
      cargarEstadisticas();
    }
  }, [user, autoLoad, useRealtime, cargarBeneficios, cargarHistorialUsos, cargarEstadisticas, configurarRealtime]);

  // Datos derivados memoizados para evitar recálculos
  const beneficiosActivos = useMemo(() => 
    beneficios.filter(b => b.estado === 'activo'), 
    [beneficios]
  );

  const beneficiosInactivos = useMemo(() => 
    beneficios.filter(b => b.estado === 'inactivo'), 
    [beneficios]
  );

  const beneficiosVencidos = useMemo(() => 
    beneficios.filter(b => b.estado === 'vencido'), 
    [beneficios]
  );

  const beneficiosAgotados = useMemo(() => 
    beneficios.filter(b => b.estado === 'agotado'), 
    [beneficios]
  );

  const beneficiosDestacados = useMemo(() => 
    beneficios.filter(b => b.destacado), 
    [beneficios]
  );

  // Estadísticas rápidas memoizadas y estables
  const estadisticasRapidas = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const ahorroEsteMes = beneficiosUsados
      .filter(uso => {
        const fecha = uso.fechaUso.toDate();
        return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
      })
      .reduce((total, uso) => total + (uso.montoDescuento || 0), 0);

    return {
      total: beneficiosActivos.length,
      activos: beneficiosActivos.length,
      usados: beneficiosUsados.length,
      ahorroTotal: beneficiosUsados.reduce((total, uso) => total + (uso.montoDescuento || 0), 0),
      ahorroEsteMes
    };
  }, [beneficiosActivos.length, beneficiosUsados]);

  // Funciones de acción optimizadas (mantener las existentes pero con optimizedNotifications)
  const crearBeneficio = useCallback(async (data: BeneficioFormData): Promise<boolean> => {
    if (!user || (user.role !== 'comercio' && user.role !== 'asociacion')) {
      optimizedNotifications.error('No tienes permisos para crear beneficios');
      return false;
    }

    try {
      setLoading(true);
      
      await BeneficiosService.crearBeneficio(data, user.uid, user.role);
      optimizedNotifications.success('Beneficio creado exitosamente');
      
      if (!useRealtime) {
        await cargarBeneficios();
      }
      await cargarEstadisticas();
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear beneficio';
      optimizedNotifications.error(message);
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, cargarBeneficios, cargarEstadisticas, useRealtime]);

  // Resto de funciones similares con optimizedNotifications...

  const refrescar = useCallback(async () => {
    if (refreshing) return;
    
    try {
      setRefreshing(true);
      setError(null);
      
      await Promise.all([
        cargarBeneficios(),
        user?.role === 'socio' && cargarHistorialUsos(),
        cargarEstadisticas()
      ].filter(Boolean));
      
      optimizedNotifications.success('Datos actualizados');
    } catch (err) {
      console.error('Error al refrescar:', err);
      optimizedNotifications.error('Error al actualizar datos');
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, cargarBeneficios, cargarHistorialUsos, cargarEstadisticas, user]);

  return {
    // Estados
    beneficios,
    beneficiosUsados,
    stats,
    loading,
    error,
    refreshing,

    // Datos derivados memoizados
    beneficiosActivos,
    beneficiosInactivos,
    beneficiosVencidos,
    beneficiosAgotados,
    beneficiosDestacados,
    estadisticasRapidas,

    // Acciones
    crearBeneficio,
    refrescar,

    // Funciones de carga manual
    cargarBeneficios,
    cargarHistorialUsos,
    cargarEstadisticas
  };
};

// Hook especializado para socios optimizado
export const useBeneficiosSocio = () => {
  return useBeneficios({
    autoLoad: true,
    useRealtime: true,
    cacheEnabled: true
  });
};