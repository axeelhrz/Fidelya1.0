import { useState, useEffect, useCallback } from 'react';
import { fetchAnalyticsData, subscribeToAnalyticsUpdates, UserPlan } from '@/components/services/firebase.services';

// Define AnalyticsFilters interface
export interface AnalyticsFilters {
  // Add properties based on your filtering requirements
  [key: string]: unknown;
}

// Define UseAnalyticsDataProps interface
export interface UseAnalyticsDataProps {
  userId: string;
  userPlan: UserPlan;
  filters?: AnalyticsFilters;
  realtime?: boolean;
}

// Define AnalyticsData interface
export interface AnalyticsData {
  // Add properties based on your data structure
  [key: string]: unknown;
}

interface UseAnalyticsDataReturn {
  data: AnalyticsData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useAnalyticsData = ({
  userId,
  userPlan,
  filters,
  realtime = false
}: UseAnalyticsDataProps): UseAnalyticsDataReturn => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Función para obtener datos
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const analyticsData = await fetchAnalyticsData(userId, userPlan, filters);
      setData(analyticsData as unknown as AnalyticsData);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId, userPlan, filters]);
   
  // Efecto para cargar datos iniciales y configurar suscripción en tiempo real si es necesario
  useEffect(() => {
    // Si no queremos tiempo real, simplemente obtenemos los datos una vez
    if (!realtime) {
      fetchData();
      return;
    }
    
    // Si queremos tiempo real, configuramos la suscripción
    const handleUpdate = (newData: unknown) => {
      setData(newData as AnalyticsData);
      setLoading(false);
    };
    
    const handleError = (err: Error) => {
      console.error('Error in realtime updates:', err);
      setError(err);
      setLoading(false);
    };
    
    // Iniciar carga
    setLoading(true);
    
    // Suscribirse a actualizaciones
    const unsubscribe = subscribeToAnalyticsUpdates(
      userId,
      userPlan,
      filters,
      handleUpdate,
      handleError
    );
    
    // Limpiar suscripción al desmontar
    return () => {
      unsubscribe();
    };
  }, [userId, userPlan, filters, realtime, fetchData]);
  
  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};