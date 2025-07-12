'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { commercialService, CommercialSummary } from '@/lib/services/commercialService';

export interface UseCommercialDataReturn {
  data: CommercialSummary | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
  isConnected: boolean;
  retryCount: number;
}

export function useCommercialData(): UseCommercialDataReturn {
  const { user } = useAuth();
  const [data, setData] = useState<CommercialSummary | null>(null);
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
      
      const commercialData = await commercialService.getCommercialSummary(user.centerId, 6);
      
      if (isComponentMountedRef.current) {
        setData(commercialData);
        setLastUpdated(new Date());
        setIsConnected(true);
        setRetryCount(0);
      }
    } catch (error) {
      console.error('Error loading commercial data:', error);
      
      if (isComponentMountedRef.current) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setError(`Error cargando datos comerciales: ${errorMessage}`);
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
    await loadData(true);
  }, [loadData]);

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
      // Configurar suscripciones en tiempo real para leads y campañas
      const unsubscribeLeads = commercialService.subscribeToLeads(
        user.centerId,
        () => {
          // Cuando cambien los leads, recargar el resumen comercial
          loadData(false);
        }
      );

      const unsubscribeCampaigns = commercialService.subscribeToCampaigns(
        user.centerId,
        () => {
          // Cuando cambien las campañas, recargar el resumen comercial
          loadData(false);
        }
      );

      // Combinar funciones de limpieza
      unsubscribeRef.current = () => {
        unsubscribeLeads();
        unsubscribeCampaigns();
      };

      // Cargar datos iniciales
      loadData(true);

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
      console.error('Error setting up commercial data subscription:', error);
      
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
        console.log('Connection restored, retrying commercial data...');
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

// Hook para datos específicos de leads
export function useLeadsData() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.centerId) {
      setLoading(false);
      return;
    }

    const unsubscribe = commercialService.subscribeToLeads(
      user.centerId,
      (leadsData) => {
        setLeads(leadsData);
        setError(null);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user?.centerId]);

  const convertLead = useCallback(async (leadId: string, conversionValue: number, notes?: string) => {
    if (!user?.centerId) return;
    
    try {
      await commercialService.convertLead(user.centerId, leadId, conversionValue, notes);
    } catch (error) {
      console.error('Error converting lead:', error);
      throw error;
    }
  }, [user?.centerId]);

  const assignLead = useCallback(async (leadId: string, assignedTo: string) => {
    if (!user?.centerId) return;
    
    try {
      await commercialService.assignLead(user.centerId, leadId, assignedTo);
    } catch (error) {
      console.error('Error assigning lead:', error);
      throw error;
    }
  }, [user?.centerId]);

  return {
    leads,
    loading,
    error,
    convertLead,
    assignLead
  };
}

// Hook para datos específicos de campañas
export function useCampaignsData() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.centerId) {
      setLoading(false);
      return;
    }

    const unsubscribe = commercialService.subscribeToCampaigns(
      user.centerId,
      (campaignsData) => {
        setCampaigns(campaignsData);
        setError(null);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user?.centerId]);

  return {
    campaigns,
    loading,
    error
  };
}

// Hook para métricas comerciales en tiempo real
export function useRealTimeCommercialMetrics(intervalMs: number = 60000) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<CommercialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.centerId) return;

    const updateMetrics = async () => {
      try {
        const data = await commercialService.getCommercialSummary(user.centerId, 6);
        setMetrics(data);
        setError(null);
      } catch (error) {
        console.error('Error updating real-time commercial metrics:', error);
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
