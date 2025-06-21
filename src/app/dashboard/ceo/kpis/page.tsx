'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  alpha,
  Breadcrumbs,
  Link,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  Refresh,
  Download,
  FilterList,
  TrendingUp,
  Assessment,
  Business,
  EventBusy,
  Psychology,
  AccountBalance,
  Inventory,
  Receipt,
  Star,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCEOMetrics } from '@/hooks/useCEOMetrics';
import KpiDetailModal from '@/components/ceo/kpis/KpiDetailModal';

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

const iconMap: Record<string, React.ComponentType> = {
  TrendingUp,
  Assessment,
  Business,
  EventBusy,
  Psychology,
  AccountBalance,
  Inventory,
  Receipt,
};

function KPIsExecutivosContent() {
  const router = useRouter();
  const theme = useTheme();
  const ceoMetrics = useCEOMetrics();
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);

  const handleKpiClick = (kpiId: string) => {
    setSelectedKpi(kpiId);
  };

  const handleCloseModal = () => {
    setSelectedKpi(null);
  };

  const selectedKpiData = ceoMetrics.kpis.find(kpi => kpi.id === selectedKpi);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0F0F1A 0%, #1A1B2E 100%)'
          : 'linear-gradient(135deg, #F2EDEA 0%, #F8F6F4 100%)',
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'rgba(26, 27, 46, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ py: 4 }}>
            {/* Navigation */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center" gap={3}>
                <IconButton
                  onClick={() => router.push('/dashboard/ceo')}
                  sx={{
                    background: alpha(ceoBrandColors.primary, 0.1),
                    '&:hover': {
                      background: alpha(ceoBrandColors.primary, 0.2),
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ArrowBack sx={{ color: ceoBrandColors.primary }} />
                </IconButton>
                
                <Breadcrumbs>
                  <Link 
                    color="inherit" 
                    href="/dashboard/ceo"
                    sx={{ 
                      textDecoration: 'none',
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 600,
                      '&:hover': { 
                        textDecoration: 'underline',
                        color: ceoBrandColors.primary,
                      }
                    }}
                  >
                    Panel Ejecutivo
                  </Link>
                  <Typography 
                    color="text.primary" 
                    fontWeight={700}
                    sx={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    KPIs Ejecutivos
                  </Typography>
                </Breadcrumbs>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <Tooltip title="Filtros avanzados">
                  <IconButton
                    sx={{
                      background: alpha(ceoBrandColors.secondary, 0.1),
                      '&:hover': {
                        background: alpha(ceoBrandColors.secondary, 0.2),
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <FilterList sx={{ color: ceoBrandColors.secondary }} />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Actualizar datos">
                  <IconButton
                    sx={{
                      background: alpha(ceoBrandColors.primary, 0.1),
                      '&:hover': {
                        background: alpha(ceoBrandColors.primary, 0.2),
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Refresh sx={{ color: ceoBrandColors.primary }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Exportar reporte">
                  <IconButton
                    sx={{
                      background: alpha(ceoBrandColors.accentPink, 0.1),
                      '&:hover': {
                        background: alpha(ceoBrandColors.accentPink, 0.2),
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Download sx={{ color: ceoBrandColors.accentPink }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Title Section */}
            <Box>
              <Stack direction="row" alignItems="center" gap={2} mb={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 20px rgba(93, 79, 176, 0.3)',
                  }}
                >
                  <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      lineHeight: 1.2,
                    }}
                  >
                    KPIs Ejecutivos
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 500,
                      color: 'text.secondary',
                    }}
                  >
                    Vista central con todos los indicadores estratégicos del centro
                  </Typography>
                </Box>
              </Stack>
              
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip
                  icon={<Star sx={{ fontSize: 16 }} />}
                  label="Tiempo Real"
                  size="small"
                  sx={{
                    background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                    color: 'white',
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    '& .MuiChip-icon': {
                      color: 'white',
                    },
                  }}
                />
                <Chip
                  label={`${ceoMetrics.kpis.length} Métricas Clave`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: ceoBrandColors.primary,
                    color: ceoBrandColors.primary,
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="Dashboard CEO"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: ceoBrandColors.accentBlue,
                    color: ceoBrandColors.accentBlue,
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {ceoMetrics.kpis.map((kpi, index) => {
            const IconComponent = iconMap[kpi.icon] || TrendingUp;
            
            return (
              <Grid item xs={12} sm={6} lg={3} key={kpi.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    onClick={() => handleKpiClick(kpi.id)}
                    sx={{
                      p: 3,
                      height: '100%',
                      cursor: 'pointer',
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(26, 27, 46, 0.8)'
                        : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: theme.shadows[12],
                        borderColor: ceoBrandColors.primary,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: kpi.semaphore === 'green' 
                          ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                          : kpi.semaphore === 'amber'
                          ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)'
                          : 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)',
                      }
                    }}
                  >
                    {/* Icon and Status */}
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${theme.palette[kpi.color].main} 0%, ${theme.palette[kpi.color].dark} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          boxShadow: `0 6px 20px ${alpha(theme.palette[kpi.color].main, 0.3)}`,
                        }}
                      >
                        <IconComponent sx={{ fontSize: 26 }} />
                      </Box>
                      
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          background: kpi.semaphore === 'green' 
                            ? '#10b981'
                            : kpi.semaphore === 'amber'
                            ? '#f59e0b'
                            : '#ef4444',
                          boxShadow: `0 0 12px ${kpi.semaphore === 'green' 
                            ? '#10b981'
                            : kpi.semaphore === 'amber'
                            ? '#f59e0b'
                            : '#ef4444'}`,
                        }}
                      />
                    </Box>

                    {/* Value */}
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 800,
                        color: 'text.primary',
                        mb: 1,
                        lineHeight: 1,
                      }}
                    >
                      {kpi.value.toLocaleString()}{kpi.unit}
                    </Typography>

                    {/* Title */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 1,
                        lineHeight: 1.3,
                      }}
                    >
                      {kpi.title}
                    </Typography>

                    {/* Subtitle */}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        color: 'text.secondary',
                        mb: 3,
                        lineHeight: 1.4,
                      }}
                    >
                      {kpi.subtitle}
                    </Typography>

                    {/* Trend */}
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1.5,
                            py: 0.75,
                            borderRadius: 2,
                            background: kpi.trend.isPositive 
                              ? alpha('#10b981', 0.1)
                              : alpha('#ef4444', 0.1),
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: '"Outfit", sans-serif',
                              fontWeight: 700,
                              color: kpi.trend.isPositive ? '#10b981' : '#ef4444',
                            }}
                          >
                            {kpi.trend.isPositive ? '+' : ''}{kpi.trend.value}%
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: 500,
                          color: 'text.secondary',
                        }}
                      >
                        {kpi.trend.period}
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* KPI Detail Modal */}
      <KpiDetailModal
        open={Boolean(selectedKpi)}
        onClose={handleCloseModal}
        kpiData={selectedKpiData}
      />
    </Box>
  );
}

export default function KPIsExecutivosPage() {
  return (
    <AdminRoute fallbackPath="/dashboard">
      <DashboardLayout>
        <KPIsExecutivosContent />
      </DashboardLayout>
    </AdminRoute>
  );
}