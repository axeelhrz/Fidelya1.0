'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { analyticsService } from '@/lib/services/analyticsService';
import { 
  TherapistAnalytics, 
  AnalyticsFilters, 
  AIInsight,
  AnalyticsMetric 
} from '@/types/analytics';

export function useAnalyticsData(filters?: AnalyticsFilters) {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<TherapistAnalytics | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    if (!user?.centerId || !user?.id) {
      setLoading(false);
      setError('Usuario no autenticado');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [analyticsData, insightsData] = await Promise.all([
        analyticsService.getTherapistAnalytics(user.centerId, user.id, filters),
        analyticsService.getAIInsights(user.centerId, user.id)
      ]);

      setAnalytics(analyticsData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setError(`Error cargando analytics: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setAnalytics(null);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  }, [user?.centerId, user?.id, filters]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const refresh = useCallback(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const exportData = useCallback(async (format: 'json' | 'csv', dateRange: { start: Date; end: Date }) => {
    if (!user?.centerId || !user?.id) return;

    try {
      const blob = await analyticsService.exportAnalyticsData(user.centerId, user.id, {
        format,
        dateRange
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${format}-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }, [user?.centerId, user?.id]);

  // Generar métricas KPI desde los datos de analytics
  const kpiMetrics: AnalyticsMetric[] = analytics ? [
    {
      id: 'total-patients',
      name: 'Pacientes Activos',
      value: analytics.totalPatients,
      trend: 'stable',
      status: 'success',
      unit: '',
      description: 'Total de pacientes asignados',
      sparklineData: [analytics.totalPatients - 2, analytics.totalPatients - 1, analytics.totalPatients]
    },
    {
      id: 'active-sessions',
      name: 'Sesiones Completadas',
      value: analytics.activeSessions,
      trend: 'up',
      status: 'success',
      unit: '',
      description: 'Sesiones completadas en el período',
      sparklineData: [analytics.activeSessions - 5, analytics.activeSessions - 2, analytics.activeSessions]
    },
    {
      id: 'avg-sessions',
      name: 'Sesiones Promedio',
      value: analytics.averageSessionsPerPatient.toFixed(1),
      trend: 'up',
      status: 'success',
      unit: 'por paciente',
      description: 'Promedio de sesiones por paciente',
      target: 8
    },
    {
      id: 'active-alerts',
      name: 'Alertas Activas',
      value: analytics.activeAlerts,
      trend: analytics.activeAlerts > 5 ? 'up' : 'stable',
      status: analytics.activeAlerts > 5 ? 'warning' : 'success',
      unit: '',
      description: 'Alertas clínicas que requieren atención'
    },
    {
      id: 'follow-up-rate',
      name: 'Tasa de Seguimiento',
      value: `${analytics.followUpRate.toFixed(1)}%`,
      trend: 'up',
      status: analytics.followUpRate > 80 ? 'success' : 'warning',
      unit: '',
      description: 'Pacientes con 2+ sesiones',
      target: 85
    },
    {
      id: 'completion-rate',
      name: 'Finalización',
      value: `${analytics.sessionCompletionRate.toFixed(1)}%`,
      trend: 'up',
      status: analytics.sessionCompletionRate > 90 ? 'success' : 'warning',
      unit: '',
      description: 'Tasa de finalización de sesiones',
      target: 95
    }
  ] : [];

  return {
    analytics,
    insights,
    kpiMetrics,
    loading,
    error,
    refresh,
    exportData
  };
}

export function useAnalyticsFilters() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: {
      start: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1),
      end: new Date()
    }
  });

  const updateFilters = useCallback((newFilters: Partial<AnalyticsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      dateRange: {
        start: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1),
        end: new Date()
      }
    });
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters
  };
}
