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
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  Refresh,
  Download,
  Security,
  CheckCircle,
  Warning,
  Error,
  Gavel,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCEOMetrics } from '@/hooks/useCEOMetrics';
import ComplianceGauge from '@/components/ceo/compliance/ComplianceGauge';

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
                  <Gavel sx={{ color: 'white', fontSize: 24 }} />
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
                    Cumplimiento y Seguridad
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 500,
                      color: 'text.secondary',
                    }}
                  >
                    Seguimiento del estado legal, técnico y de protocolos internos
                  </Typography>
                </Box>
              </Stack>
              
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip
                  label={`${complianceScore}% Cumplimiento`}
                  size="small"
                  sx={{
                    background: complianceScore >= 90 
                      ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                      : complianceScore >= 70
                      ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
                      : 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                    color: 'white',
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                  }}
                />
                <Chip
                  label="3 Vencimientos Próximos"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: '#f59e0b',
                    color: '#f59e0b',
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="Auditoría Pendiente"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: '#ef4444',
                    color: '#ef4444',
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
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(26, 27, 46, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 4,
                  border: `1px solid ${alpha('#10b981', 0.1)}`,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <CheckCircle sx={{ color: '#10b981', fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    Backups
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800,
                    color: '#10b981',
                    mb: 1,
                  }}
                >
                  ✓
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
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
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(26, 27, 46, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 4,
                  border: `1px solid ${alpha('#f59e0b', 0.1)}`,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Warning sx={{ color: '#f59e0b', fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    Políticas
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800,
                    color: '#f59e0b',
                    mb: 1,
                  }}
                >
                  85%
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
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
                  <Error sx={{ color: '#ef4444', fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    Auditorías
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
                  2
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
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
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(26, 27, 46, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 4,
                  border: `1px solid ${alpha('#10b981', 0.1)}`,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Security sx={{ color: '#10b981', fontSize: 32 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    Certificados
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800,
                    color: '#10b981',
                    mb: 1,
                  }}
                >
                  ✓
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
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

          {/* Compliance Details */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(26, 27, 46, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 4,
                  border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
                  backdropFilter: 'blur(10px)',
                  height: '100%',
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 3,
                  }}
                >
                  Estado de Cumplimiento
                </Typography>
                
                <Grid container spacing={3}>
                  {[
                    { category: 'Protección de Datos', status: 'completo', score: 95 },
                    { category: 'Políticas Internas', status: 'pendiente', score: 85 },
                    { category: 'Certificaciones', status: 'completo', score: 100 },
                    { category: 'Auditorías', status: 'revision', score: 60 },
                    { category: 'Backups y Seguridad', status: 'completo', score: 98 },
                    { category: 'Documentación Legal', status: 'pendiente', score: 75 },
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          background: alpha(
                            item.status === 'completo' ? '#10b981' :
                            item.status === 'pendiente' ? '#f59e0b' : '#ef4444',
                            0.1
                          ),
                          border: `1px solid ${alpha(
                            item.status === 'completo' ? '#10b981' :
                            item.status === 'pendiente' ? '#f59e0b' : '#ef4444',
                            0.2
                          )}`,
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontFamily: '"Outfit", sans-serif',
                              fontWeight: 600,
                              color: 'text.primary',
                            }}
                          >
                            {item.category}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: '"Outfit", sans-serif',
                              fontWeight: 700,
                              color: item.status === 'completo' ? '#10b981' :
                                     item.status === 'pendiente' ? '#f59e0b' : '#ef4444',
                            }}
                          >
                            {item.score}%
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: '100%',
                            height: 6,
                            borderRadius: 3,
                            background: alpha(
                              item.status === 'completo' ? '#10b981' :
                              item.status === 'pendiente' ? '#f59e0b' : '#ef4444',
                              0.2
                            ),
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${item.score}%`,
                              height: '100%',
                              background: item.status === 'completo' ? '#10b981' :
                                         item.status === 'pendiente' ? '#f59e0b' : '#ef4444',
                              borderRadius: 3,
                              transition: 'width 1s ease',
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>
          </Grid>

          {/* Recent Compliance Activities */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(26, 27, 46, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 4,
                  border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 3,
                  }}
                >
                  Actividades Recientes
                </Typography>
                
                <Grid container spacing={2}>
                  {[
                    { activity: 'Backup automático completado', time: 'Hace 2 horas', status: 'success' },
                    { activity: 'Política de privacidad actualizada', time: 'Hace 1 día', status: 'info' },
                    { activity: 'Certificado SSL renovado', time: 'Hace 3 días', status: 'success' },
                    { activity: 'Auditoría de seguridad pendiente', time: 'Hace 1 semana', status: 'warning' },
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          background: alpha(
                            item.status === 'success' ? '#10b981' :
                            item.status === 'warning' ? '#f59e0b' :
                            item.status === 'info' ? ceoBrandColors.accentBlue : '#ef4444',
                            0.1
                          ),
                          border: `1px solid ${alpha(
                            item.status === 'success' ? '#10b981' :
                            item.status === 'warning' ? '#f59e0b' :
                            item.status === 'info' ? ceoBrandColors.accentBlue : '#ef4444',
                            0.2
                          )}`,
                          textAlign: 'center',
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 600,
                            color: 'text.primary',
                            mb: 1,
                          }}
                        >
                          {item.activity}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontFamily: '"Inter", sans-serif',
                            color: 'text.secondary',
                          }}
                        >
                          {item.time}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
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
      <DashboardLayout>
        <ComplianceContent />
      </DashboardLayout>
    </AdminRoute>
  );
}
    
