import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { generateKpis } from '@/lib/generate-kpis';
import { generatePolicyTrends } from '@/lib/generate-policy-trends';
import { useDashboardTaskKpis } from '@/hooks/use-task-dashboard-kpi';

interface UseKpiUpdaterReturn {
  updateKpis: () => Promise<boolean>;
  isUpdating: boolean;
  error: string | null;
  lastUpdateTime: Date | null;
}

/**
 * Hook personalizado para actualizar los KPIs del dashboard
 * @returns Objeto con funciones y estados para actualizar KPIs
 */
export const useKpiUpdater = (): UseKpiUpdaterReturn => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  
  // Get the task KPIs update function
  const { updateTaskKpis } = useDashboardTaskKpis();

  /**
   * Actualiza los KPIs del dashboard para el usuario actual
   * @returns Promise<boolean> - true si la actualización fue exitosa, false en caso contrario
   */
  const updateKpis = useCallback(async (): Promise<boolean> => {
    if (!user?.uid) {
      setError('Usuario no autenticado');
      return false;
    }

    try {
      setIsUpdating(true);
      setError(null);

      // Update all KPIs in parallel
      const [generalKpisResult, taskKpisResult, policyTrendsResult] = await Promise.all([
        generateKpis(user.uid),
        updateTaskKpis(),
        generatePolicyTrends(user.uid)
      ]);

      if (generalKpisResult && taskKpisResult && policyTrendsResult) {
        setLastUpdateTime(new Date());
        return true;
      }

      setError('No se pudieron actualizar algunos KPIs');
      return false;
    } catch (err) {
      console.error('Error al actualizar KPIs:', err);
      setError('Error al actualizar los KPIs del dashboard');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [user, updateTaskKpis]);

  return {
    updateKpis,
    isUpdating,
    error,
    lastUpdateTime
  };
};