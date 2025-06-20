'use client';

import React from 'react';
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
  LocalHospital,
  Warning,
  TrendingUp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import { useCEOMetrics } from '@/hooks/useCEOMetrics';
import RiskRadar from '@/components/ceo/clinica/RiskRadar';
import CapacityForecast from '@/components/ceo/clinica/CapacityForecast';
import AdherenceIndicator from '@/components/ceo/clinica/AdherenceIndicator';
import EmotionChart from '@/components/ceo/clinica/EmotionChart';

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

function ClinicaContent() {
  const router = useRouter();
  const theme = useTheme();
  const ceoMetrics = useCEOMetrics();

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
                    Salud Clínica & Operativa
                  </Typography>
                </Breadcrumbs>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
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
                Salud Clínica & Operativa
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
                Panel para seguimiento clínico a gran escala y gestión operativa
              </Typography>
              
              <Box display="flex" gap={1}>
                <Chip
                  label="Radar de Riesgo"
                  size="small"
                  sx={{
                    background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                    color: 'white',
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="Capacidad"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: ceoBrandColors.accentBlue,
                    color: ceoBrandColors.accentBlue,
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="Adherencia"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: ceoBrandColors.accentPink,
                    color: ceoBrandColors.accentPink,
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
          {/* Clinical Summary Cards */}
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
                  border: `1px solid ${alpha('#F44336', 0.1)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Warning sx={{ color: '#F44336', fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      color: ceoBrandColors.text,
                    }}
                  >
                    Pacientes Críticos
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
                  {ceoMetrics.riskRadarData.filter(p => p.nivelRiesgo === 'critico').length}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(ceoBrandColors.text, 0.7),
                    fontFamily: '"Neris", sans-serif',
                  }}
                >
                  Requieren atención inmediata
                </Typography>
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
                  border: `1px solid ${alpha(ceoBrandColors.accentBlue, 0.1)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <LocalHospital sx={{ color: ceoBrandColors.accentBlue, fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      color: ceoBrandColors.text,
                    }}
                  >
                    Ocupación Promedio
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
                  78%
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(ceoBrandColors.text, 0.7),
                    fontFamily: '"Neris", sans-serif',
                  }}
                >
                  Últimos 30 días
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
                  border: `1px solid ${alpha('#4CAF50', 0.1)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <TrendingUp sx={{ color: '#4CAF50', fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      color: ceoBrandColors.text,
                    }}
                  >
                    Adherencia Promedio
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 700,
                    color: '#4CAF50',
                    mb: 1,
                  }}
                >
                  85%
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(ceoBrandColors.text, 0.7),
                    fontFamily: '"Neris", sans-serif',
                  }}
                >
                  Todos los programas
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
                  border: `1px solid ${alpha(ceoBrandColors.accentPink, 0.1)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <LocalHospital sx={{ color: ceoBrandColors.accentPink, fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      color: ceoBrandColors.text,
                    }}
                  >
                    Mejoría Clínica
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
                  68%
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(ceoBrandColors.text, 0.7),
                    fontFamily: '"Neris", sans-serif',
                  }}
                >
                  PHQ-9 / GAD-7
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          {/* Risk Radar */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <RiskRadar data={ceoMetrics.riskRadarData} />
            </motion.div>
          </Grid>

          {/* Capacity Forecast */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <CapacityForecast data={ceoMetrics.capacityForecast} />
            </motion.div>
          </Grid>

          {/* Adherence Indicator */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <AdherenceIndicator data={ceoMetrics.adherenceData} />
            </motion.div>
          </Grid>

          {/* Emotion Chart */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <EmotionChart />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default function ClinicaPage() {
  return (
    <AdminRoute fallbackPath="/dashboard">
      <ClinicaContent />
    </AdminRoute>
  );
}
