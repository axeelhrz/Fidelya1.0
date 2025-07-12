'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { clinicalService, ClinicalMetrics } from '@/lib/services/clinicalService';

export interface UseClinicalDataReturn {
  data: ClinicalMetrics | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
  isConnected: boolean;
  retryCount: number;
}

export function useClinicalData(): UseClinicalDataReturn {
  const { user } = useAuth();
  const [data, setData] = useState<ClinicalMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMountedRef = useRef(true);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 segundos

  // Función para cargar datos manualmente
  const loadData = useCallback(async (showLoading = true) => {
    if (!user?.centerId) {
      setLoading(false);
      setError('No hay centro asignado');
      setIsConnected(false);
      return;
    }

    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      
      const clinicalData = await clinicalService.getClinicalMetrics(user.centerId, false);
      
      if (isComponentMountedRef.current) {
        setData(clinicalData);
        setLastUpdated(new Date());
        setIsConnected(true);
        setRetryCount(0);
      }
    } catch (error) {
      console.error('Error loading clinical data:', error);
      
      if (isComponentMountedRef.current) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setError(`Error cargando datos clínicos: ${errorMessage}`);
        setIsConnected(false);
        
        // Intentar reconectar automáticamente
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          retryTimeoutRef.current = setTimeout(() => {
            if (isComponentMountedRef.current) {
              loadData(false);
            }
          }, RETRY_DELAY * (retryCount + 1));
        }
      }
    } finally {
      if (isComponentMountedRef.current && showLoading) {
        setLoading(false);
      }
    }
  }, [user?.centerId, retryCount]);

  // Función para refrescar datos
  const refresh = useCallback(async () => {
    // Limpiar cache antes de refrescar
    if (user?.centerId) {
      clinicalService.clearCache(user.centerId);
    }
    await loadData(true);
  }, [loadData, user?.centerId]);

  // Configurar suscripción en tiempo real
  useEffect(() => {
    if (!user?.centerId) {
      setLoading(false);
      setError('No hay centro asignado');
      setIsConnected(false);
      return;
    }

    // Limpiar suscripción anterior
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    // Limpiar timeout de reintento
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    setLoading(true);
    setError(null);
    setRetryCount(0);

    try {
      // Configurar suscripción en tiempo real
      unsubscribeRef.current = clinicalService.subscribeToMetrics(
        user.centerId,
        (metrics) => {
          if (isComponentMountedRef.current) {
            setData(metrics);
            setLastUpdated(new Date());
            setIsConnected(true);
            setError(null);
            setLoading(false);
            setRetryCount(0);
          }
        }
      );

      // Timeout para detectar problemas de conexión
      const connectionTimeout = setTimeout(() => {
        if (isComponentMountedRef.current && loading) {
          setError('Timeout de conexión. Verificando conectividad...');
          setIsConnected(false);
          loadData(false);
        }
      }, 10000); // 10 segundos

      return () => {
        clearTimeout(connectionTimeout);
      };

    } catch (error) {
      console.error('Error setting up clinical data subscription:', error);
      
      if (isComponentMountedRef.current) {
        setError(`Error configurando suscripción: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        setIsConnected(false);
        setLoading(false);
        
        // Fallback a carga manual
        loadData(false);
      }
    }
  }, [user?.centerId, loadData, loading]);

  // Cleanup al desmontar
  useEffect(() => {
    isComponentMountedRef.current = true;
    
    return () => {
      isComponentMountedRef.current = false;
      
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, []);

  // Detectar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => {
      if (isComponentMountedRef.current && !isConnected && user?.centerId) {
        console.log('Connection restored, retrying...');
        setRetryCount(0);
        loadData(false);
      }
    };

    const handleOffline = () => {
      if (isComponentMountedRef.current) {
        setIsConnected(false);
        setError('Sin conexión a internet');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isConnected, user?.centerId, loadData]);

  return {
    data,
    loading,
    error,
    refresh,
    lastUpdated,
    isConnected,
    retryCount
  };
}

// Hook para datos clínicos específicos de un paciente
export function usePatientClinicalData(patientId: string) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.centerId || !patientId) {
      setLoading(false);
      return;
    }

    const loadPatientData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [patientAssessments, patientAlerts] = await Promise.all([
          clinicalService['assessmentService'].getPatientAssessments(user.centerId, patientId),
          clinicalService['alertService'].getPatientAlerts(user.centerId, patientId)
        ]);

        setAssessments(patientAssessments);
        setAlerts(patientAlerts);
      } catch (error) {
        console.error('Error loading patient clinical data:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadPatientData();
  }, [user?.centerId, patientId]);

  return {
    assessments,
    alerts,
    loading,
    error
  };
}

// Hook para métricas en tiempo real con intervalos personalizados
export function useRealTimeClinicalMetrics(intervalMs: number = 30000) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ClinicalMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.centerId) return;

    const updateMetrics = async () => {
      try {
        const data = await clinicalService.getClinicalMetrics(user.centerId, false);
        setMetrics(data);
        setError(null);
      } catch (error) {
        console.error('Error updating real-time metrics:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    // Carga inicial
    updateMetrics();

    // Configurar intervalo
    const interval = setInterval(updateMetrics, intervalMs);

    return () => {
      clearInterval(interval);
    };
  }, [user?.centerId, intervalMs]);

  return { metrics, loading, error };
}