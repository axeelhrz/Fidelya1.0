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
  Security,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import { useCEOMetrics } from '@/hooks/useCEOMetrics';
import ComplianceGauge from '@/components/ceo/compliance/ComplianceGauge';
import ComplianceChecklist from '@/components/ceo/compliance/ComplianceChecklist';
import ExpirationAlerts from '@/components/ceo/compliance/ExpirationAlerts';

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

function ComplianceContent() {
  const router = useRouter();
  const theme = useTheme();
  const ceoMetrics = useCEOMetrics();

  // Calculate compliance score
  const complianceScore = 78; // Simulated overall compliance score

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
                    Cumplimiento y Seguridad
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
                Cumplimiento y Seguridad
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
                Seguimiento del estado legal, técnico y de protocolos internos
              </Typography>
              
              <Box display="flex" gap={1}>
                <Chip
                  label={`${complianceScore}% Cumplimiento`}
                  size="small"
                  sx={{
                    background: complianceScore >= 90 
                      ? 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)'
                      : complianceScore >= 70
                      ? 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)'
                      : 'linear-gradient(135deg, #F44336 0%, #EF5350 100%)',
                    color: 'white',
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="3 Vencimientos Próximos"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: '#FF9800',
                    color: '#FF9800',
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="Auditoría Pendiente"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: '#F44336',
                    color: '#F44336',
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
          {/* Compliance Summary Cards */}
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
                  border: `1px solid ${alpha('#4CAF50', 0.1)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <CheckCircle sx={{ color: '#4CAF50', fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      color: ceoBrandColors.text,
                    }}
                  >
                    Backups
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
                  ✓
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(ceoBrandColors.text, 0.7),
                    fontFamily: '"Neris", sans-serif',
                  }}
                >
                  Verificados ayer
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
                  border: `1px solid ${alpha('#FF9800', 0.1)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Warning sx={{ color: '#FF9800', fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      color: ceoBrandColors.text,
                    }}
                  >
                    Políticas
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 700,
                    color: '#FF9800',
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
                  Firmadas
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
                  border: `1px solid ${alpha('#F44336', 0.1)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Error sx={{ color: '#F44336', fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      color: ceoBrandColors.text,
                    }}
                  >
                    Auditorías
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
                  2
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(ceoBrandColors.text, 0.7),
                    fontFamily: '"Neris", sans-serif',
                  }}
                >
                  Hallazgos pendientes
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
                  border: `1px solid ${alpha('#4CAF50', 0.1)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Security sx={{ color: '#4CAF50', fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      color: ceoBrandColors.text,
                    }}
                  >
                    Certificados
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
                  ✓
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(ceoBrandColors.text, 0.7),
                    fontFamily: '"Neris", sans-serif',
                  }}
                >
                  Vigentes
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          {/* Compliance Gauge */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <ComplianceGauge score={complianceScore} />
            </motion.div>
          </Grid>

          {/* Compliance Checklist */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <ComplianceChecklist />
            </motion.div>
          </Grid>

          {/* Expiration Alerts */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <ExpirationAlerts />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default function CompliancePage() {
  return (
    <AdminRoute fallbackPath="/dashboard">
      <ComplianceContent />
    </AdminRoute>
  );
}
