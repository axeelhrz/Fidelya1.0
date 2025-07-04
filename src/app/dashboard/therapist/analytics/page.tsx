'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Skeleton,
  Alert,
  AlertTitle,
  Button,
  Snackbar
} from '@mui/material';
import { RefreshCw } from 'lucide-react';
import { useAnalyticsData, useAnalyticsFilters } from '@/hooks/useAnalyticsData';
import AnalyticsHeader from '@/components/clinical/analytics/AnalyticsHeader';
import KPICardsTherapist from '@/components/clinical/analytics/KPICardsTherapist';
import AnalyticsCharts from '@/components/clinical/analytics/AnalyticsCharts';
import PatientSummaryTable from '@/components/clinical/analytics/PatientSummaryTable';
import AIInsightsPanel from '@/components/clinical/analytics/AIInsightsPanel';

export default function TherapistAnalyticsPage() {
  const { filters, updateFilters, resetFilters } = useAnalyticsFilters();
  const { analytics, insights, kpiMetrics, loading, error, refresh, exportData } = useAnalyticsData(filters);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      setExportLoading(true);
      await exportData(format, filters.dateRange);
      setSnackbar({
        open: true,
        message: `Datos exportados exitosamente en formato ${format.toUpperCase()}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      setSnackbar({
        open: true,
        message: 'Error al exportar los datos. Inténtalo de nuevo.',
        severity: 'error'
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleRefreshInsights = () => {
    refresh();
    setSnackbar({
      open: true,
      message: 'Insights actualizados',
      severity: 'info'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Skeleton loading state
  if (loading && !analytics) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Skeleton */}
          <Box sx={{ mb: 4 }}>
            <Skeleton
              variant="rectangular"
              height={200}
              sx={{ borderRadius: 3, mb: 3 }}
            />
          </Box>

          {/* KPI Cards Skeleton */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
            {[...Array(6)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                height={160}
                sx={{ borderRadius: 3 }}
              />
            ))}
          </Box>

          {/* Charts and Table Skeleton */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 4 }}>
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 3 }}
            />
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 3 }}
            />
          </Box>

          <Skeleton
            variant="rectangular"
            height={500}
            sx={{ borderRadius: 3 }}
          />
        </motion.div>
      </Container>
    );
  }

  // Error state
  if (error && !analytics) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Alert
            severity="error"
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)'
            }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={refresh}
                startIcon={<RefreshCw size={16} />}
              >
                Reintentar
              </Button>
            }
          >
            <AlertTitle>Error al cargar los datos de analytics</AlertTitle>
            {error}
          </Alert>
        </motion.div>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1F2937 0%, #111827 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Efectos de fondo */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          background: isDarkMode
            ? `
              radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
            `
            : `
              radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
            `
        }}
      />

      <Container maxWidth="xl" sx={{ py: 3, position: 'relative', zIndex: 1 }}>
        {/* Header con filtros */}
        <AnalyticsHeader
          filters={filters}
          onFiltersChange={updateFilters}
          onRefresh={refresh}
          onExport={handleExport}
          loading={loading || exportLoading}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        {analytics && (
          <>
            {/* KPI Cards */}
            <KPICardsTherapist
              metrics={kpiMetrics}
              loading={loading}
            />

            {/* Layout principal */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                gap: 4,
                mb: 4
              }}
            >
              {/* Gráficos */}
              <AnalyticsCharts
                analytics={analytics}
                isDarkMode={isDarkMode}
              />

              {/* AI Insights */}
              <AIInsightsPanel
                insights={insights}
                loading={loading}
                onRefreshInsights={handleRefreshInsights}
              />
            </Box>

            {/* Tabla de pacientes */}
            <PatientSummaryTable
              patients={analytics.patientSummary}
              loading={loading}
            />
          </>
        )}

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
