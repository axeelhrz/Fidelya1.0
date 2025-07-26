'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp
} from 'firebase/firestore';
import { useAuth } from './useAuth';
import { useOptimizedRealtimeCollection } from './useOptimizedRealtimeFirebase';
import { useDebouncedCallback } from './useDebounce';

interface OptimizedValidacion {
  id: string;
  comercioId: string;
  comercioNombre: string;
  comercioLogo?: string;
  beneficioId: string;
  beneficioTitulo: string;
  beneficioDescripcion: string;
  descuento: number;
  tipoDescuento: string;
  fechaValidacion: Timestamp;
  montoDescuento: number;
  estado: 'exitosa' | 'fallida' | 'pendiente' | 'cancelada';
  codigoValidacion: string;
}

interface OptimizedStats {
  totalValidaciones: number;
  ahorroTotal: number;
  beneficiosEsteMes: number;
  ahorroEsteMes: number;
  comerciosVisitados: number;
  beneficiosMasUsados: Array<{ titulo: string; usos: number }>;
  comerciosFavoritos: Array<{ nombre: string; visitas: number }>;
  validacionesPorMes: Array<{ mes: string; validaciones: number; ahorro: number }>;
}

interface ActivityLog {
  id: string;
  type: 'benefit_used' | 'profile_updated' | 'level_up' | 'achievement_earned' | 'system_alert';
  title: string;
  description: string;
  timestamp: Timestamp;
  metadata?: Record<string, unknown>;
}

interface ConnectionState {
  isConnected: boolean;
  isReconnecting: boolean;
  lastSync: Date | null;
  error: string | null;
}

interface UseOptimizedSocioDataReturn {
  validaciones: OptimizedValidacion[];
  stats: OptimizedStats;
  activities: ActivityLog[];
  connectionState: ConnectionState;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
  hasNewActivity: boolean;
  markActivityAsRead: () => void;
  isFromCache: boolean;
}

export function useOptimizedSocioData(): UseOptimizedSocioDataReturn {
  const { user } = useAuth();
  const [hasNewActivity, setHasNewActivity] = useState(false);
  const [lastActivityCount, setLastActivityCount] = useState(0);

  const socioId = user?.uid || '';

  // Usar el hook optimizado para validaciones
  const {
    data: validaciones = [],
    loading,
    error,
    connectionState,
    forceRefresh,
    isFromCache
  } = useOptimizedRealtimeCollection<OptimizedValidacion>(
    'validaciones',
    socioId ? [
      where('socioId', '==', socioId),
      where('estado', '==', 'exitosa'),
      orderBy('fechaValidacion', 'desc'),
      limit(100)
    ] : [],
    {
      enableToasts: false,
      debounceMs: 500,
      cacheTimeout: 60000, // 1 minuto de cache
      enableOfflineSupport: true
    }
  );

  // Detectar nuevas actividades con debounce
  const debouncedActivityCheck = useDebouncedCallback((newCount: number) => {
    if (lastActivityCount > 0 && newCount > lastActivityCount && !isFromCache) {
      setHasNewActivity(true);
    }
    setLastActivityCount(newCount);
  }, 1000);

  useEffect(() => {
    debouncedActivityCheck(validaciones.length);
  }, [validaciones.length, debouncedActivityCheck]);

  // Calcular estadísticas con memoización optimizada
  const stats = useMemo<OptimizedStats>(() => {
    if (!validaciones.length) {
      return {
        totalValidaciones: 0,
        ahorroTotal: 0,
        beneficiosEsteMes: 0,
        ahorroEsteMes: 0,
        comerciosVisitados: 0,
        beneficiosMasUsados: [],
        comerciosFavoritos: [],
        validacionesPorMes: []
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filtrar validaciones del mes actual
    const validacionesEsteMes = validaciones.filter(v => {
      const fecha = v.fechaValidacion.toDate();
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    });

    // Calcular estadísticas básicas
    const totalValidaciones = validaciones.length;
    const ahorroTotal = validaciones.reduce((total, v) => total + (v.montoDescuento || 0), 0);
    const beneficiosEsteMes = validacionesEsteMes.length;
    const ahorroEsteMes = validacionesEsteMes.reduce((total, v) => total + (v.montoDescuento || 0), 0);

    // Calcular comercios únicos
    const comerciosUnicos = new Set(validaciones.map(v => v.comercioId));
    const comerciosVisitados = comerciosUnicos.size;

    // Calcular beneficios más usados (optimizado)
    const beneficiosMap = new Map<string, { titulo: string; usos: number }>();
    validaciones.forEach(v => {
      const existing = beneficiosMap.get(v.beneficioId);
      if (existing) {
        existing.usos++;
      } else {
        beneficiosMap.set(v.beneficioId, { titulo: v.beneficioTitulo, usos: 1 });
      }
    });

    const beneficiosMasUsados = Array.from(beneficiosMap.values())
      .sort((a, b) => b.usos - a.usos)
      .slice(0, 5);

    // Calcular comercios favoritos (optimizado)
    const comerciosMap = new Map<string, { nombre: string; visitas: number }>();
    validaciones.forEach(v => {
      const existing = comerciosMap.get(v.comercioId);
      if (existing) {
        existing.visitas++;
      } else {
        comerciosMap.set(v.comercioId, { nombre: v.comercioNombre, visitas: 1 });
      }
    });

    const comerciosFavoritos = Array.from(comerciosMap.values())
      .sort((a, b) => b.visitas - a.visitas)
      .slice(0, 5);

    // Calcular validaciones por mes (últimos 6 meses)
    const mesesMap = new Map<string, { validaciones: number; ahorro: number }>();
    
    // Inicializar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = fecha.toISOString().substr(0, 7);
      mesesMap.set(key, { validaciones: 0, ahorro: 0 });
    }

    // Procesar validaciones
    validaciones.forEach(v => {
      const fecha = v.fechaValidacion.toDate();
      const key = fecha.toISOString().substr(0, 7);
      const existing = mesesMap.get(key);
      if (existing) {
        existing.validaciones++;
        existing.ahorro += v.montoDescuento || 0;
      }
    });

    const validacionesPorMes = Array.from(mesesMap.entries()).map(([mes, data]) => ({
      mes: new Date(mes + '-01').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
      ...data,
    }));

    return {
      totalValidaciones,
      ahorroTotal,
      beneficiosEsteMes,
      ahorroEsteMes,
      comerciosVisitados,
      beneficiosMasUsados,
      comerciosFavoritos,
      validacionesPorMes
    };
  }, [validaciones]);

  // Convertir validaciones a logs de actividad (memoizado)
  const activities = useMemo<ActivityLog[]>(() => {
    return validaciones.slice(0, 10).map(validacion => ({
      id: validacion.id,
      type: 'benefit_used' as const,
      title: 'Beneficio utilizado',
      description: `${validacion.beneficioTitulo} en ${validacion.comercioNombre}`,
      timestamp: validacion.fechaValidacion,
      metadata: {
        comercioId: validacion.comercioId,
        beneficioId: validacion.beneficioId,
        descuento: validacion.descuento,
        montoDescuento: validacion.montoDescuento
      }
    }));
  }, [validaciones]);

  // Función para refrescar datos
  const refreshData = useCallback(() => {
    forceRefresh();
  }, [forceRefresh]);

  // Marcar actividad como leída
  const markActivityAsRead = useCallback(() => {
    setHasNewActivity(false);
  }, []);

  return {
    validaciones,
    stats,
    activities,
    connectionState,
    loading,
    error,
    refreshData,
    hasNewActivity,
    markActivityAsRead,
    isFromCache
  };
}
