'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Avatar,
  alpha,
} from '@mui/material';
import {
  BarChart,
  Security,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useAnalytics } from '@/hooks/useAnalytics';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComercioSidebar } from '@/components/layout/ComercioSidebar';
import { KpiCards } from '@/components/comercio/analytics/KpiCards';
import { ValidationsOverTime } from '@/components/comercio/analytics/ValidationsOverTime';
import { ByAssociationChart } from '@/components/comercio/analytics/ByAssociationChart';
import { HourlyActivityChart } from '@/components/comercio/analytics/HourlyActivityChart';
import { TopDaysList } from '@/components/comercio/analytics/TopDaysList';
import { TopBenefits } from '@/components/comercio/analytics/TopBenefits';
import { DateRangeSelector } from '@/components/comercio/analytics/DateRangeSelector';
import { subDays } from 'date-fns';

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <Box 
    sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ position: 'relative', mb: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              border: '6px solid #e2e8f0',
              borderRadius: '50%',
              borderTopColor: '#06b6d4',
              borderRightColor: '#0891b2',
              animation: 'spin 1.5s linear infinite',
              mx: 'auto',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mb: 2 }}>
          Cargando Analytics
        </Typography>
        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
          {message}
        </Typography>
      </Box>
    </motion.div>
  </Box>
);

const AccessDeniedScreen: React.FC = () => (
  <Box 
    sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Container maxWidth="sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: alpha('#ef4444', 0.1),
              color: '#ef4444',
              mx: 'auto',
              mb: 4,
            }}
          >
            <Security sx={{ fontSize: 50 }} />
          </Avatar>
          
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 2 }}>
            Acceso Restringido
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 4, maxWidth: 400, mx: 'auto' }}>
            Necesitas permisos de comercio para acceder a este panel de analytics.
          </Typography>
        </Box>
      </motion.div>
    </Container>
  </Box>
);

export default function ComercioAnalytics() {
  const { user, loading: authLoading } = useAuth();
  const { comercio, loading: comercioLoading } = useComercios();
  const { loading: beneficiosLoading } = useBeneficios();
  const { loading: validacionesLoading } = useValidaciones();

  // Date range state (default: last 30 days)
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });

  const { analyticsData, loading: analyticsLoading } = useAnalytics(dateRange);

  const loading = authLoading || comercioLoading || beneficiosLoading || validacionesLoading || analyticsLoading;

  // Check authentication and role
  if (!authLoading && (!user || user.role !== 'comercio')) {
    return <AccessDeniedScreen />;
  }

  if (loading) {
    return <LoadingScreen message="Preparando tus estadísticas avanzadas..." />;
  }

  return (
    <DashboardLayout 
      activeSection="analytics" 
      onSectionChange={() => {}}
      sidebarComponent={ComercioSidebar}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha('#06b6d4', 0.1),
                    color: '#06b6d4',
                    width: 48,
                    height: 48,
                  }}
                >
                  <BarChart sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>
                    Analytics
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                    Estadísticas avanzadas de tu comercio
                  </Typography>
                </Box>
              </Stack>
            </Box>
            
            <DateRangeSelector
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </Stack>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Box sx={{ mb: 6 }}>
            <KpiCards data={analyticsData} />
          </Box>
        </motion.div>

        {/* Main Charts Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Validations Over Time */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ValidationsOverTime data={analyticsData.dailyValidations} />
            </motion.div>
          </Grid>

          {/* By Association Chart */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ByAssociationChart data={analyticsData.byAssociation} />
            </motion.div>
          </Grid>

          {/* Hourly Activity */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <HourlyActivityChart data={analyticsData.hourlyActivity} />
            </motion.div>
          </Grid>

          {/* Top Days */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <TopDaysList data={analyticsData.topDays} />
            </motion.div>
          </Grid>

          {/* Top Benefits */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <TopBenefits data={analyticsData.topBenefits} />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}
