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
  TrendingUp,
  BusinessCenter,
  Construction,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import ComingSoonCard from '@/components/ceo/pipeline/ComingSoonCard';

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

function PipelineContent() {
  const router = useRouter();
  const theme = useTheme();

  const plannedFeatures = [
    {
      title: 'Funnel de Captación',
      description: 'Visitas web → consultas → pacientes activos',
      icon: TrendingUp,
      priority: 'alta',
      estimatedDate: 'Q2 2024',
    },
    {
      title: 'Costo por Paciente (CAC)',
      description: 'Análisis detallado del costo de adquisición',
      icon: BusinessCenter,
      priority: 'alta',
      estimatedDate: 'Q2 2024',
    },
    {
      title: 'Retorno por Paciente (LTV)',
      description: 'Lifetime Value y proyecciones de ingresos',
      icon: TrendingUp,
      priority: 'media',
      estimatedDate: 'Q3 2024',
    },
    {
      title: 'Integración Google Ads',
      description: 'Métricas de campañas publicitarias en tiempo real',
      icon: BusinessCenter,
      priority: 'media',
      estimatedDate: 'Q3 2024',
    },
    {
      title: 'Integración Instagram Ads',
      description: 'Seguimiento de campañas en redes sociales',
      icon: BusinessCenter,
      priority: 'baja',
      estimatedDate: 'Q4 2024',
    },
    {
      title: 'Dashboard de Marketing',
      description: 'Panel completo de métricas de marketing digital',
      icon: TrendingUp,
      priority: 'alta',
      estimatedDate: 'Q3 2024',
    },
  ];

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
                    Pipeline Comercial & Marketing
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

                <Tooltip title="Exportar roadmap">
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
                Pipeline Comercial & Marketing
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
                Futuro panel para seguimiento del crecimiento, marketing y oportunidades
              </Typography>
              
              <Box display="flex" gap={1}>
                <Chip
                  label="En Desarrollo"
                  size="small"
                  sx={{
                    background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                    color: 'white',
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="6 Funcionalidades Planeadas"
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
                  label="Roadmap 2024"
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
        {/* Main Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              mb: 4,
              background: `linear-gradient(135deg, ${alpha(ceoBrandColors.primary, 0.1)} 0%, ${alpha(ceoBrandColors.secondary, 0.05)} 100%)`,
              borderRadius: 3,
              border: `1px solid ${alpha(ceoBrandColors.primary, 0.2)}`,
              textAlign: 'center',
            }}
          >
            <Construction 
              sx={{ 
                fontSize: 80, 
                color: ceoBrandColors.primary,
                mb: 2,
              }} 
            />
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600,
                color: ceoBrandColors.text,
                mb: 2,
              }}
            >
              Pipeline Comercial en Desarrollo
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                color: alpha(ceoBrandColors.text, 0.7),
                mb: 3,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Estamos construyendo un sistema completo de seguimiento comercial y marketing que incluirá 
              análisis de funnel, métricas de adquisición, integración con plataformas publicitarias y 
              dashboard de performance comercial.
            </Typography>
            <Chip
              label="Lanzamiento estimado: Q2-Q3 2024"
              sx={{
                background: `linear-gradient(135deg, ${ceoBrandColors.accentPink} 0%, ${ceoBrandColors.secondary} 100%)`,
                color: 'white',
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600,
                fontSize: '1rem',
                px: 2,
                py: 1,
              }}
            />
          </Paper>
        </motion.div>

        {/* Planned Features Grid */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontFamily: '"Neris", sans-serif',
            fontWeight: 600,
            color: ceoBrandColors.text,
            mb: 3,
          }}
        >
          Funcionalidades Planeadas
        </Typography>

        <Grid container spacing={3}>
          {plannedFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ComingSoonCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  priority={feature.priority as 'alta' | 'media' | 'baja'}
                  estimatedDate={feature.estimatedDate}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Roadmap Timeline */}
        <Box mt={6}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
              color: ceoBrandColors.text,
              mb: 3,
            }}
          >
            Roadmap de Desarrollo
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 3,
              border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
            }}
          >
            <Grid container spacing={4}>
              {['Q2 2024', 'Q3 2024', 'Q4 2024'].map((quarter, index) => {
                const quarterFeatures = plannedFeatures.filter(f => f.estimatedDate === quarter);
                
                return (
                  <Grid item xs={12} md={4} key={quarter}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        background: alpha(ceoBrandColors.primary, 0.05),
                        border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 600,
                          color: ceoBrandColors.primary,
                          mb: 2,
                        }}
                      >
                        {quarter}
                      </Typography>
                      
                      <Box display="flex" flexDirection="column" gap={1}>
                        {quarterFeatures.map((feature) => (
                          <Box
                            key={feature.title}
                            sx={{
                              p: 2,
                              borderRadius: 1,
                              background: 'rgba(255, 255, 255, 0.8)',
                              border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: '"Neris", sans-serif',
                                fontWeight: 600,
                                color: ceoBrandColors.text,
                                mb: 0.5,
                              }}
                            >
                              {feature.title}
                            </Typography>
                            <Chip
                              label={feature.priority.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor: feature.priority === 'alta' 
                                  ? alpha('#F44336', 0.1)
                                  : feature.priority === 'media'
                                  ? alpha('#FF9800', 0.1)
                                  : alpha('#4CAF50', 0.1),
                                color: feature.priority === 'alta' 
                                  ? '#F44336'
                                  : feature.priority === 'media'
                                  ? '#FF9800'
                                  : '#4CAF50',
                                fontFamily: '"Neris", sans-serif',
                                fontWeight: 600,
                                fontSize: '0.7rem',
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default function PipelinePage() {
  return (
    <AdminRoute fallbackPath="/dashboard">
      <PipelineContent />
    </AdminRoute>
  );
}
