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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  Refresh,
  Download,
  FilterList,
  TrendingUp,
  TrendingDown,
  AccountBalance,
  MonetizationOn,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCEOMetrics } from '@/hooks/useCEOMetrics';
import BurnEarnChart from '@/components/ceo/charts/BurnEarnChart';
import ProfitabilityHeatmap from '@/components/ceo/charts/ProfitabilityHeatmap';
import AccountsReceivableTable from '@/components/ceo/finanzas/AccountsReceivableTable';
import FinancialSimulator from '@/components/ceo/finanzas/FinancialSimulator';

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

function FinanzasContent() {
  const router = useRouter();
  const theme = useTheme();
  const ceoMetrics = useCEOMetrics();
  const [scenario, setScenario] = useState<'pesimista' | 'base' | 'agresivo'>('base');

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
                    Desempeño Financiero
                  </Typography>
                </Breadcrumbs>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel sx={{ fontFamily: '"Outfit", sans-serif' }}>Escenario</InputLabel>
                  <Select
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value as any)}
                    label="Escenario"
                    sx={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    <MenuItem value="pesimista">Pesimista</MenuItem>
                    <MenuItem value="base">Base</MenuItem>
                    <MenuItem value="agresivo">Agresivo</MenuItem>
                  </Select>
                </FormControl>

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
                    background: `linear-gradient(135deg, ${ceoBrandColors.accentPink} 0%, ${ceoBrandColors.secondary} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 20px rgba(217, 125, 183, 0.3)',
                  }}
                >
                  <MonetizationOn sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${ceoBrandColors.accentPink} 0%, ${ceoBrandColors.secondary} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      lineHeight: 1.2,
                    }}
                  >
                    Desempeño Financiero
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 500,
                      color: 'text.secondary',
                    }}
                  >
                    Análisis profundo de rentabilidad, flujo de caja y performance por terapeuta
                  </Typography>
                </Box>
              </Stack>
              
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip
                  label="Flujo de Caja"
                  size="small"
                  sx={{
                    background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                    color: 'white',
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                  }}
                />
                <Chip
                  label="Rentabilidad"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: ceoBrandColors.accentPink,
                    color: ceoBrandColors.accentPink,
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={`Escenario: ${scenario.charAt(0).toUpperCase() + scenario.slice(1)}`}
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
          {/* Financial Summary Cards */}
          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(26, 27, 46, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 4,
                  border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <AccountBalance sx={{ color: ceoBrandColors.primary, fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    Ingresos MTD
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800,
                    color: ceoBrandColors.primary,
                    mb: 1,
                  }}
                >
                  ${ceoMetrics.financialMetrics.ingresosMTD?.actual.toLocaleString() || '0'}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingUp sx={{ color: '#10b981', fontSize: 16 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#10b981',
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 700,
                    }}
                  >
                    +{ceoMetrics.financialMetrics.ingresosMTD?.variacion || 0}%
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(26, 27, 46, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 4,
                  border: `1px solid ${alpha(ceoBrandColors.accentPink, 0.1)}`,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <TrendingUp sx={{ color: ceoBrandColors.accentPink, fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    EBITDA R-12
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800,
                    color: ceoBrandColors.accentPink,
                    mb: 1,
                  }}
                >
                  ${ceoMetrics.financialMetrics.ebitdaRolling12?.actual.toLocaleString() || '0'}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
                  }}
                >
                  Progreso: {ceoMetrics.financialMetrics.ebitdaRolling12?.progreso || 0}%
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(26, 27, 46, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 4,
                  border: `1px solid ${alpha(ceoBrandColors.accentBlue, 0.1)}`,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <AccountBalance sx={{ color: ceoBrandColors.accentBlue, fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    CAC vs LTV
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800,
                    color: ceoBrandColors.accentBlue,
                    mb: 1,
                  }}
                >
                  {ceoMetrics.financialMetrics.cacVsLtv?.ratio.toFixed(1) || '0'}x
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
                  }}
                >
                  Ratio saludable
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(26, 27, 46, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 4,
                  border: `1px solid ${alpha('#ef4444', 0.1)}`,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <TrendingDown sx={{ color: '#ef4444', fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    Cuentas x Cobrar
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800,
                    color: '#ef4444',
                    mb: 1,
                  }}
                >
                  ${ceoMetrics.financialMetrics.cuentasPorCobrar?.backlogMas30Dias.toLocaleString() || '0'}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
                  }}
                >
                  >30 días
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          {/* Burn & Earn Chart */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <BurnEarnChart 
                data={ceoMetrics.burnEarnData} 
                scenario={scenario}
              />
            </motion.div>
          </Grid>

          {/* Financial Simulator */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <FinancialSimulator />
            </motion.div>
          </Grid>

          {/* Profitability Heatmap */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <ProfitabilityHeatmap data={ceoMetrics.profitabilityData} />
            </motion.div>
          </Grid>

          {/* Accounts Receivable */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <AccountsReceivableTable 
                data={ceoMetrics.financialMetrics.cuentasPorCobrar}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default function FinanzasPage() {
  return (
    <AdminRoute fallbackPath="/dashboard">
      <DashboardLayout>
        <FinanzasContent />
      </DashboardLayout>
    </AdminRoute>
  );
}