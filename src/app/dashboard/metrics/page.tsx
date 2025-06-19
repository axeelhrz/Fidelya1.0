'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Fab,
  Snackbar,
  Container,
  Stack,
  Paper,
  Divider,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Analytics, Refresh } from '@mui/icons-material';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

// Componentes
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AuthGuard from '@/components/auth/AuthGuard';
import MetricCard from '@/components/metrics/MetricCard';
import EmotionPieChart from '@/components/metrics/EmotionPieChart';
import SessionsLineChart from '@/components/metrics/SessionsLineChart';
import MotivesBarChart from '@/components/metrics/MotivesBarChart';
import AlertStatusDonut from '@/components/metrics/AlertStatusDonut';
import MetricsFilters from '@/components/metrics/MetricsFilters';

// Hooks y servicios
import { useMetrics, useComparativeMetrics } from '@/hooks/useMetrics';
import { useAuth } from '@/context/AuthContext';
import { usePatients } from '@/hooks/usePatients';
import { ExportService } from '@/services/exportService';
import { FirestoreService } from '@/services/firestore';

// Tipos
import { MetricsFilters as MetricsFiltersType, DashboardCard as DashboardCardType, ExportOptions } from '@/types/metrics';

function MetricsPageContent() {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Estado para filtros
  const [filters, setFilters] = useState<MetricsFiltersType>({
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
        subtitle: 'En tratamiento',
        icon: 'people',
        color: 'primary',
        trend: comparison?.totalActivePatients ? {
          value: comparison.totalActivePatients.change,
          isPositive: comparison.totalActivePatients.change >= 0,
          period: 'vs anterior'
        } : undefined
      },
      {
        id: 'total-sessions',
        title: 'Total Sesiones',
        value: metrics.totalSessions,
        subtitle: 'Registradas',
        icon: 'event_note',
        color: 'secondary',
        trend: comparison?.totalSessions ? {
          value: comparison.totalSessions.change,
          isPositive: comparison.totalSessions.change >= 0,
          period: 'vs anterior'
        } : undefined
      },
      {
        id: 'average-sessions',
        title: 'Promedio/Paciente',
        value: metrics.averageSessionsPerPatient,
        subtitle: 'Sesiones por paciente',
        icon: 'trending_up',
        color: 'info',
        trend: comparison?.averageSessionsPerPatient ? {
          value: comparison.averageSessionsPerPatient.change,
          isPositive: comparison.averageSessionsPerPatient.change >= 0,
          period: 'vs anterior'
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
          isPositive: comparison.activeAlerts.change <= 0,
          period: 'vs anterior'
        } : undefined
      },
      {
        id: 'follow-up-rate',
        title: 'Tasa Seguimiento',
        value: `${metrics.followUpRate}%`,
        subtitle: 'Pacientes 2+ sesiones',
        icon: 'assignment_turned_in',
        color: metrics.followUpRate >= 70 ? 'success' : metrics.followUpRate >= 50 ? 'warning' : 'error',
        trend: comparison?.followUpRate ? {
          value: comparison.followUpRate.change,
          isPositive: comparison.followUpRate.change >= 0,
          period: 'vs anterior'
        } : undefined
      },
      {
        id: 'high-risk-patients',
        title: 'Alto Riesgo',
        value: metrics.highRiskPatients,
        subtitle: 'Atención prioritaria',
        icon: 'priority_high',
        color: metrics.highRiskPatients > 0 ? 'error' : 'success'
      }
    ];

    return cards;
  }, [metrics, comparison]);

  // Manejar cambios en filtros
  const handleFiltersChange = (newFilters: MetricsFiltersType) => {
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
        message: `Generando reporte ${format.toUpperCase()}...`,
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
    setFilters(prev => ({ ...prev }));
    setSnackbar({
      open: true,
      message: 'Datos actualizados',
      severity: 'success'
    });
  };

  if (loading && !metrics) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 400,
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Cargando métricas clínicas...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 3,
            '& .MuiAlert-message': {
              fontSize: '1rem'
            }
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Error al cargar las métricas
          </Typography>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
      {/* Encabezado optimizado */}
      <Box sx={{ mb: { xs: 4, md: 5 } }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          alignItems={{ xs: 'flex-start', sm: 'center' }} 
          spacing={{ xs: 2, sm: 3 }} 
          sx={{ mb: 2 }}
        >
          <Box
            sx={{
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <Analytics sx={{ fontSize: { xs: 24, sm: 28 } }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant={isMobile ? "h4" : "h3"}
              component="h1" 
              sx={{ 
                fontWeight: 700,
                fontFamily: '"Inter", "Manrope", sans-serif',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
                lineHeight: 1.2
              }}
            >
              Métricas Clínicas
            </Typography>
            <Typography 
              variant={isMobile ? "body1" : "h6"}
              color="text.secondary"
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                lineHeight: 1.4
              }}
            >
              Análisis y visualización de datos del centro
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Barra de filtros */}
      <Box sx={{ mb: { xs: 4, md: 5 } }}>
        <MetricsFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onExport={handleExport}
          onRefresh={handleRefresh}
          professionals={professionals}
          patients={patients}
          loading={loading || comparisonLoading}
        />
      </Box>

      {metrics ? (
        <Stack spacing={{ xs: 4, md: 5 }}>
          {/* Tarjetas de métricas principales - Layout optimizado */}
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif'
              }}
            >
              Indicadores Clave
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(6, 1fr)'
                },
                gap: { xs: 2, sm: 2.5, md: 3 },
                '& > *': {
                  minWidth: 0,
                }
              }}
            >
              {dashboardCards.map((card, index) => (
                <MetricCard 
                  key={card.id} 
                  card={card} 
                  loading={loading}
                  delay={index}
                />
              ))}
            </Box>
          </Box>

          {/* Gráficos principales - Layout responsivo */}
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif'
              }}
            >
              Evolución Temporal
            </Typography>
            <Stack 
              direction={{ xs: 'column', lg: 'row' }} 
              spacing={3}
              sx={{
                '& > *': {
                  minWidth: 0,
                  minHeight: 400
                }
              }}
            >
              <Box sx={{ flex: { lg: 2 } }}>
                <SessionsLineChart
                  data={metrics.sessionsOverTime}
                  title="Sesiones por Día"
                  loading={loading}
                  showArea={true}
                  color={theme.palette.primary.main}
                  height={350}
                />
              </Box>
              <Box sx={{ flex: { lg: 1 } }}>
                <EmotionPieChart
                  data={metrics.emotionalDistribution}
                  title="Estados Emocionales"
                  loading={loading}
                  height={350}
                />
              </Box>
            </Stack>
          </Box>

          {/* Gráficos secundarios */}
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif'
              }}
            >
              Análisis Detallado
            </Typography>
            <Stack 
              direction={{ xs: 'column', lg: 'row' }} 
              spacing={3}
              sx={{
                '& > *': {
                  minWidth: 0,
                  minHeight: 400
                }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <MotivesBarChart
                  data={metrics.motivesDistribution}
                  title="Motivos de Consulta"
                  loading={loading}
                  maxItems={8}
                  height={350}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <AlertStatusDonut
                  activeAlerts={metrics.activeAlerts}
                  resolvedAlerts={metrics.resolvedAlerts}
                  title="Estado de Alertas"
                  loading={loading}
                  height={350}
                />
              </Box>
            </Stack>
          </Box>

          {/* Tendencias adicionales */}
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif'
              }}
            >
              Crecimiento
            </Typography>
            <SessionsLineChart
              data={metrics.patientsOverTime}
              title="Pacientes Nuevos por Día"
              loading={loading}
              showArea={false}
              color={theme.palette.success.main}
              height={300}
            />
          </Box>

          {/* Información del período - Compacta */}
          <Paper 
            sx={{ 
              p: { xs: 3, md: 4 }, 
              borderRadius: 3,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                : 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 2, sm: 4 }}
              divider={<Box sx={{ borderLeft: { sm: 1 }, borderTop: { xs: 1, sm: 0 }, borderColor: 'divider' }} />}
            >
              <Box sx={{ flex: 1, textAlign: { xs: 'left', sm: 'center' } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5, color: 'primary.main' }}>
                  Período Analizado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {format(metrics.periodStart, 'dd/MM/yyyy', { locale: es })} - {' '}
                  {format(metrics.periodEnd, 'dd/MM/yyyy', { locale: es })}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, textAlign: { xs: 'left', sm: 'center' } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5, color: 'success.main' }}>
                  Última Actualización
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {format(metrics.calculatedAt, 'dd/MM/yyyy HH:mm', { locale: es })}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      ) : (
        <Alert 
          severity="info"
          sx={{ 
            borderRadius: 3,
            p: 3,
            '& .MuiAlert-message': {
              fontSize: '1rem'
            }
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Sin datos disponibles
          </Typography>
          No hay datos para el período seleccionado. Ajusta los filtros para ver las métricas.
        </Alert>
      )}

      {/* FAB para actualizar */}
      <Fab
        color="primary"
        aria-label="refresh"
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontSize: '0.95rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default function MetricsPage() {
  return (
    <AuthGuard>
      <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
        <DashboardLayout>
          <MetricsPageContent />
        </DashboardLayout>
      </ProtectedRoute>
    </AuthGuard>
  );
}