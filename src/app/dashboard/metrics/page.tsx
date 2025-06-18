'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Fab,
  Snackbar
} from '@mui/material';
import { Analytics, Refresh } from '@mui/icons-material';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

// Componentes
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardCard from '@/components/metrics/DashboardCard';
import EmotionPieChart from '@/components/metrics/EmotionPieChart';
import SessionsLineChart from '@/components/metrics/SessionsLineChart';
import MotivesBarChart from '@/components/metrics/MotivesBarChart';
import FiltersToolbar from '@/components/metrics/FiltersToolbar';

// Hooks y servicios
import { useMetrics, useComparativeMetrics } from '@/hooks/useMetrics';
import { useAuth } from '@/context/AuthContext';
import { usePatients } from '@/hooks/usePatients';
import { ExportService } from '@/services/exportService';
import { FirestoreService } from '@/services/firestore';

// Tipos
import { MetricsFilters, DashboardCard as DashboardCardType, ExportOptions } from '@/types/metrics';

export default function MetricsPage() {
  const { user } = useAuth();
  
  // Estado para filtros
  const [filters, setFilters] = useState<MetricsFilters>({
    dateRange: {
      start: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd')
    }
  });

  // Estado para datos auxiliares
  const [professionals, setProfessionals] = useState<Array<{ id: string; name: string }>>([]);
  const [patients, setPatients] = useState<Array<{ id: string; name: string }>>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Hooks para datos
  const { metrics, loading, error, rawData } = useMetrics(filters);
  const { comparison, loading: comparisonLoading } = useComparativeMetrics(filters);
  const { patients: allPatients } = usePatients({});

  // Cargar profesionales y pacientes para filtros
  useEffect(() => {
    if (!user?.centerId) return;

    const loadAuxiliaryData = async () => {
      try {
        // Cargar profesionales
        const centerUsers = await FirestoreService.getCenterUsers(user.centerId);
        const professionalsData = centerUsers
          .filter(u => u.role === 'psychologist' || u.role === 'admin')
          .map(u => ({
            id: u.uid,
            name: u.displayName || u.email
          }));
        setProfessionals(professionalsData);

        // Preparar datos de pacientes para filtros
        const patientsData = allPatients.map(p => ({
          id: p.id,
          name: p.fullName
        }));
        setPatients(patientsData);

      } catch (error) {
        console.error('Error loading auxiliary data:', error);
      }
    };

    loadAuxiliaryData();
  }, [user?.centerId, allPatients]);

  // Preparar tarjetas de métricas principales
  const dashboardCards: DashboardCardType[] = React.useMemo(() => {
    if (!metrics) return [];

    const cards: DashboardCardType[] = [
      {
        id: 'active-patients',
        title: 'Pacientes Activos',
        value: metrics.totalActivePatients,
        subtitle: 'Pacientes en tratamiento',
        icon: 'people',
        color: 'primary',
        trend: comparison?.totalActivePatients ? {
          value: comparison.totalActivePatients.change,
          isPositive: comparison.totalActivePatients.change >= 0,
          period: 'período anterior'
        } : undefined
      },
      {
        id: 'total-sessions',
        title: 'Total de Sesiones',
        value: metrics.totalSessions,
        subtitle: 'Sesiones registradas',
        icon: 'event_note',
        color: 'secondary',
        trend: comparison?.totalSessions ? {
          value: comparison.totalSessions.change,
          isPositive: comparison.totalSessions.change >= 0,
          period: 'período anterior'
        } : undefined
      },
      {
        id: 'average-sessions',
        title: 'Promedio por Paciente',
        value: metrics.averageSessionsPerPatient,
        subtitle: 'Sesiones por paciente',
        icon: 'trending_up',
        color: 'info',
        trend: comparison?.averageSessionsPerPatient ? {
          value: comparison.averageSessionsPerPatient.change,
          isPositive: comparison.averageSessionsPerPatient.change >= 0,
          period: 'período anterior'
        } : undefined
      },
      {
        id: 'active-alerts',
        title: 'Alertas Activas',
        value: metrics.activeAlerts,
        subtitle: 'Requieren atención',
        icon: 'warning',
        color: metrics.activeAlerts > 0 ? 'warning' : 'success',
        trend: comparison?.activeAlerts ? {
          value: comparison.activeAlerts.change,
          isPositive: comparison.activeAlerts.change <= 0, // Para alertas, menos es mejor
          period: 'período anterior'
        } : undefined
      },
      {
        id: 'follow-up-rate',
        title: 'Tasa de Seguimiento',
        value: `${metrics.followUpRate}%`,
        subtitle: 'Pacientes con 2+ sesiones',
        icon: 'assignment_turned_in',
        color: metrics.followUpRate >= 70 ? 'success' : metrics.followUpRate >= 50 ? 'warning' : 'error',
        trend: comparison?.followUpRate ? {
          value: comparison.followUpRate.change,
          isPositive: comparison.followUpRate.change >= 0,
          period: 'período anterior'
        } : undefined
      },
      {
        id: 'high-risk-patients',
        title: 'Pacientes Alto Riesgo',
        value: metrics.highRiskPatients,
        subtitle: 'Requieren atención prioritaria',
        icon: 'priority_high',
        color: metrics.highRiskPatients > 0 ? 'error' : 'success'
      }
    ];

    return cards;
  }, [metrics, comparison]);

  // Manejar cambios en filtros
  const handleFiltersChange = (newFilters: MetricsFilters) => {
    setFilters(newFilters);
  };

  // Manejar exportación
  const handleExport = async (format: 'pdf' | 'excel' | 'notion') => {
    if (!metrics || !user?.centerId) return;

    try {
      const exportOptions: ExportOptions = {
        format,
        includeCharts: true,
        includeSummary: true,
        includeRawData: format === 'excel',
        dateRange: filters.dateRange,
        filters
      };

      ExportService.validateExportOptions(exportOptions);

      setSnackbar({
        open: true,
        message: `Generando reporte en formato ${format.toUpperCase()}...`,
        severity: 'info'
      });

      switch (format) {
        case 'pdf':
          await ExportService.exportToPDF(metrics, exportOptions, 'Centro Psicológico');
          break;
        case 'excel':
          await ExportService.exportToExcel(metrics, rawData, exportOptions, 'Centro Psicológico');
          break;
        case 'notion':
          // Configuración de Notion (esto debería venir de la configuración del centro)
          const notionConfig = {
            databaseId: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID || '',
            apiKey: process.env.NEXT_PUBLIC_NOTION_API_KEY || '',
            pageTitle: 'Reporte de Métricas',
            includeCharts: true
          };
          await ExportService.exportToNotion(metrics, exportOptions, notionConfig, 'Centro Psicológico');
          break;
      }

      setSnackbar({
        open: true,
        message: `Reporte ${format.toUpperCase()} generado exitosamente`,
        severity: 'success'
      });

    } catch (error) {
      console.error('Error exporting metrics:', error);
      setSnackbar({
        open: true,
        message: `Error al generar reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        severity: 'error'
      });
    }
  };

  // Manejar actualización manual
  const handleRefresh = () => {
    // Forzar recarga cambiando ligeramente los filtros
    setFilters(prev => ({ ...prev }));
    setSnackbar({
      open: true,
      message: 'Datos actualizados',
      severity: 'success'
    });
  };

  if (loading && !metrics) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress size={60} />
          </Box>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Alert severity="error" sx={{ m: 3 }}>
            Error al cargar las métricas: {error}
          </Alert>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Box sx={{ p: 3 }}>
          {/* Encabezado */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Analytics sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Panel de Métricas
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Análisis y visualización de datos clínicos
              </Typography>
            </Box>
          </Box>

          {/* Barra de filtros */}
          <FiltersToolbar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            onRefresh={handleRefresh}
            professionals={professionals}
            patients={patients}
            loading={loading || comparisonLoading}
          />

          {metrics ? (
            <>
              {/* Tarjetas de métricas principales */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {dashboardCards.map((card) => (
                  <Grid item xs={12} sm={6} md={4} lg={2} key={card.id}>
                    <DashboardCard card={card} loading={loading} />
                  </Grid>
                ))}
              </Grid>

              {/* Gráficos principales */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Gráfico de sesiones en el tiempo */}
                <Grid item xs={12} lg={8}>
                  <SessionsLineChart
                    data={metrics.sessionsOverTime}
                    title="Sesiones Registradas por Día"
                    loading={loading}
                    showArea={true}
                    color="#1976d2"
                  />
                </Grid>

                {/* Distribución emocional */}
                <Grid item xs={12} lg={4}>
                  <EmotionPieChart
                    data={metrics.emotionalDistribution}
                    title="Distribución Emocional"
                    loading={loading}
                  />
                </Grid>
              </Grid>

              {/* Gráficos secundarios */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Motivos de consulta */}
                <Grid item xs={12} lg={6}>
                  <MotivesBarChart
                    data={metrics.motivesDistribution}
                    title="Motivos de Consulta Más Frecuentes"
                    loading={loading}
                    maxItems={8}
                  />
                </Grid>

                {/* Gráfico de pacientes nuevos */}
                <Grid item xs={12} lg={6}>
                  <SessionsLineChart
                    data={metrics.patientsOverTime}
                    title="Pacientes Nuevos por Día"
                    loading={loading}
                    showArea={false}
                    color="#2e7d32"
                  />
                </Grid>
              </Grid>

              {/* Información adicional */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      Período analizado
                    </Typography>
                    <Typography variant="body2">
                      {format(metrics.periodStart, 'dd \'de\' MMMM \'de\' yyyy', { locale: es })} - {' '}
                      {format(metrics.periodEnd, 'dd \'de\' MMMM \'de\' yyyy', { locale: es })}
                    </Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Alert severity="success">
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      Última actualización
                    </Typography>
                    <Typography variant="body2">
                      {format(metrics.calculatedAt, 'dd/MM/yyyy \'a las\' HH:mm', { locale: es })}
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </>
          ) : (
            <Alert severity="info" sx={{ mt: 3 }}>
              No hay datos disponibles para el período seleccionado. 
              Ajusta los filtros para ver las métricas.
            </Alert>
          )}

          {/* FAB para actualizar */}
          <Fab
            color="primary"
            aria-label="refresh"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16
            }}
            onClick={handleRefresh}
            disabled={loading}
          >
            <Refresh />
          </Fab>

          {/* Snackbar para notificaciones */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          >
            <Alert 
              onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
