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
} from '@mui/material';
import {
  ArrowBack,
  Refresh,
  Download,
  FilterList,
  TrendingUp,
  TrendingDown,
  AccountBalance,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
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
                    Desempeño Financiero
                  </Typography>
                </Breadcrumbs>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Escenario</InputLabel>
                  <Select
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value as any)}
                    label="Escenario"
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
                Desempeño Financiero
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
                Análisis profundo de rentabilidad, flujo de caja y performance por terapeuta
              </Typography>
              
              <Box display="flex" gap={1}>
                <Chip
                  label="Flujo de Caja"
                  size="small"
                  sx={{
                    background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                    color: 'white',
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="Rentabilidad"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: ceoBrandColors.accentPink,
                    color: ceoBrandColors.accentPink,
                    fontFamily: '"Neris", sans-serif',
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
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 3,
                  border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <AccountBalance sx={{ color: ceoBrandColors.primary, fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      color: ceoBrandColors.text,
                    }}
                  >
                    Ingresos MTD
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 700,
                    color: ceoBrandColors.primary,
                    mb: 1,
                  }}
                >
                  ${ceoMetrics.financialMetrics.ingresosMTD?.actual.toLocaleString() || '0'}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingUp sx={{ color: '#4CAF50', fontSize: 16 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#4CAF50',
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
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
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 3,
                  border: `1px solid ${alpha(ceoBrandColors.accentPink, 0.1)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <TrendingUp sx={{ color: ceoBrandColors.accentPink, fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      color: ceoBrandColors.text,
                    }}
                  >
                    EBITDA R-12
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 700,
                    color: ceoBrandColors.accentPink,
                    mb: 1,
                  }}
                >
                  ${ceoMetrics.financialMetrics.ebitdaRolling12?.actual.toLocaleString() || '0'}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(ceoBrandColors.text, 0.7),
                    fontFamily: '"Neris", sans-serif',
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
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 3,
                  border: `1px solid ${alpha(ceoBrandColors.accentBlue, 0.1)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <AccountBalance sx={{ color: ceoBrandColors.accentBlue, fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      color: ceoBrandColors.text,
                    }}
                  >
                    CAC vs LTV
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 700,
                    color: ceoBrandColors.accentBlue,
                    mb: 1,
                  }}
                >
                  {ceoMetrics.financialMetrics.cacVsLtv?.ratio.toFixed(1) || '0'}x
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(ceoBrandColors.text, 0.7),
                    fontFamily: '"Neris", sans-serif',
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
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 3,
                  border: `1px solid ${alpha('#F44336', 0.1)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <TrendingDown sx={{ color: '#F44336', fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      color: ceoBrandColors.text,
                    }}
                  >
                    Cuentas x Cobrar
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 700,
                    color: '#F44336',
                    mb: 1,
                  }}
                >
                  ${ceoMetrics.financialMetrics.cuentasPorCobrar?.backlogMas30Dias.toLocaleString() || '0'}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(ceoBrandColors.text, 0.7),
                    fontFamily: '"Neris", sans-serif',
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
      <FinanzasContent />
    </AdminRoute>
  );
}
