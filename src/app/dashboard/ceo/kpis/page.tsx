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
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
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
        background: ceoBrandColors.background,
        fontFamily: '"Neris", sans-serif',
      }}
    >
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ py: 3 }}>
            {/* Navigation */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <IconButton
                  onClick={() => router.push('/dashboard/ceo')}
                  sx={{
                    background: alpha(ceoBrandColors.primary, 0.1),
                    '&:hover': {
                      background: alpha(ceoBrandColors.primary, 0.2),
                    },
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
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Panel Ejecutivo
                  </Link>
                  <Typography color="text.primary" fontWeight={600}>
                    KPIs Ejecutivos
                  </Typography>
                </Breadcrumbs>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <Tooltip title="Filtros">
                  <IconButton
                    sx={{
                      background: alpha(ceoBrandColors.primary, 0.1),
                      '&:hover': {
                        background: alpha(ceoBrandColors.primary, 0.2),
                      },
                    }}
                  >
                    <FilterList sx={{ color: ceoBrandColors.primary }} />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Actualizar datos">
                  <IconButton
                    sx={{
                      background: alpha(ceoBrandColors.primary, 0.1),
                      '&:hover': {
                        background: alpha(ceoBrandColors.primary, 0.2),
                      },
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
                      },
                    }}
                  >
                    <Download sx={{ color: ceoBrandColors.accentPink }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Title Section */}
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600,
                  color: ceoBrandColors.text,
                  mb: 1,
                }}
              >
                KPIs Ejecutivos
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 300,
                  color: alpha(ceoBrandColors.text, 0.7),
                  mb: 2,
                }}
              >
                Vista central con todos los indicadores estratégicos del centro
              </Typography>
              
              <Box display="flex" gap={1}>
                <Chip
                  label="Tiempo Real"
                  size="small"
                  sx={{
                    background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                    color: 'white',
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="8 Métricas Clave"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: ceoBrandColors.primary,
                    color: ceoBrandColors.primary,
                    fontFamily: '"Neris", sans-serif',
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
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
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
                          ? 'linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%)'
                          : kpi.semaphore === 'amber'
                          ? 'linear-gradient(90deg, #FF9800 0%, #FFB74D 100%)'
                          : 'linear-gradient(90deg, #F44336 0%, #EF5350 100%)',
                      }
                    }}
                  >
                    {/* Icon and Title */}
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${theme.palette[kpi.color].main} 0%, ${theme.palette[kpi.color].dark} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        <IconComponent sx={{ fontSize: 24 }} />
                      </Box>
                      
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: kpi.semaphore === 'green' 
                            ? '#4CAF50'
                            : kpi.semaphore === 'amber'
                            ? '#FF9800'
                            : '#F44336',
                        }}
                      />
                    </Box>

                    {/* Value */}
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 700,
                        color: ceoBrandColors.text,
                        mb: 0.5,
                      }}
                    >
                      {kpi.value.toLocaleString()}{kpi.unit}
                    </Typography>

                    {/* Title */}
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600,
                        color: ceoBrandColors.text,
                        mb: 1,
                        lineHeight: 1.2,
                      }}
                    >
                      {kpi.title}
                    </Typography>

                    {/* Subtitle */}
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 300,
                        color: alpha(ceoBrandColors.text, 0.6),
                        display: 'block',
                        mb: 2,
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
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            background: kpi.trend.isPositive 
                              ? alpha('#4CAF50', 0.1)
                              : alpha('#F44336', 0.1),
                          }}
                        >
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontFamily: '"Neris", sans-serif',
                              fontWeight: 600,
                              color: kpi.trend.isPositive ? '#4CAF50' : '#F44336',
                            }}
                          >
                            {kpi.trend.isPositive ? '+' : ''}{kpi.trend.value}%
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 300,
                          color: alpha(ceoBrandColors.text, 0.5),
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
      <KPIsExecutivosContent />
    </AdminRoute>
  );
}
