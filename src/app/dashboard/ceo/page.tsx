'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Fade,
  useTheme,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore,
  Psychology,
  LocalHospital,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CEODashboardLayout from '@/components/layout/CEODashboardLayout';
import KpiCard from '@/components/ceo/KpiCard';
import KpiDetailDialog from '@/components/ceo/KpiDetailDialog';
import FinancialPanel from '@/components/ceo/panels/FinancialPanel';
import { useCEOMetrics } from '@/hooks/useCEOMetrics';
import { CEOKPIData } from '@/types/ceo';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function CEODashboardPage() {
  const { user } = useAuth();
  const theme = useTheme();
  const ceoMetrics = useCEOMetrics();
  const [selectedKpi, setSelectedKpi] = useState<CEOKPIData | null>(null);
  const [clinicalPanelExpanded, setClinicalPanelExpanded] = useState(false);

  const handleKpiDetailClick = (kpi: CEOKPIData) => {
    setSelectedKpi(kpi);
  };

  const handleCloseKpiDialog = () => {
    setSelectedKpi(null);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getCEOMessage = () => {
    const messages = [
      'Su liderazgo impulsa la excelencia en salud mental',
      'Transformando vidas a través de decisiones estratégicas',
      'La innovación y el cuidado van de la mano',
      'Cada métrica refleja el impacto de su visión',
      'Construyendo el futuro de la atención psicológica'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <CEODashboardLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Hero Section - CEO Header */}
          <Fade in timeout={400}>
            <Box 
              sx={{ 
                mb: 6,
                p: 4,
                borderRadius: 4,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                  : 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '50%',
                  height: '100%',
                  background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  opacity: 0.3,
                }
              }}
            >
              <Box position="relative" zIndex={1}>
                <Box display="flex" alignItems="center" mb={2}>
                  <TrendingUp sx={{ fontSize: 32, mr: 2, color: '#A5CAE6' }} />
                  <Typography 
                    variant="h3" 
                    fontWeight="bold"
                    sx={{ fontFamily: '"Neris", sans-serif' }}
                  >
                    {getGreeting()}, {user?.displayName?.split(' ')[0] || 'CEO'}!
                  </Typography>
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.9, 
                    mb: 2,
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 600
                  }}
                >
                  Dashboard Ejecutivo - Centro Psicológico Digital
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.8, 
                    maxWidth: '60%',
                    fontFamily: '"Neris", sans-serif',
                    fontSize: '1.1rem',
                    lineHeight: 1.6
                  }}
                >
                  {getCEOMessage()}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.7, 
                    mt: 2,
                    fontFamily: '"Neris", sans-serif'
                  }}
                >
                  Hoy es {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                </Typography>
              </Box>
            </Box>
          </Fade>

          {/* KPI Cards Row */}
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              sx={{ 
                mb: 3,
                fontFamily: '"Neris", sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              📊 Fila de KPI Cards
            </Typography>
            
            <Grid container spacing={3}>
              {ceoMetrics.kpis.map((kpi, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={kpi.id}>
                  <KpiCard
                    kpi={kpi}
                    onDetailClick={handleKpiDetailClick}
                    delay={index}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Financial Panel */}
          <Box sx={{ mb: 4 }}>
            <FinancialPanel
              burnEarnData={ceoMetrics.burnEarnData}
              profitabilityData={ceoMetrics.profitabilityData}
              loading={ceoMetrics.loading}
            />
          </Box>

          {/* Clinical & Operational Health Panel */}
          <Box sx={{ mb: 4 }}>
            <Accordion 
              expanded={clinicalPanelExpanded} 
              onChange={(event, isExpanded) => setClinicalPanelExpanded(isExpanded)}
              sx={{
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                boxShadow: theme.shadows[4],
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  margin: 0,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                  color: 'white',
                  borderRadius: '16px 16px 0 0',
                  '&.Mui-expanded': {
                    minHeight: 64,
                  },
                  '& .MuiAccordionSummary-content': {
                    margin: '16px 0',
                    '&.Mui-expanded': {
                      margin: '16px 0',
                    },
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Psychology sx={{ fontSize: 28 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold" fontFamily='"Neris", sans-serif'>
                      🧠 Panel B: Salud Clínica & Operativa
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Radar de riesgo, forecast de capacidad y adherencia por programa
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails sx={{ p: 3 }}>
                <Grid container spacing={4}>
                  {/* Risk Radar Widget */}
                  <Grid item xs={12} lg={4}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: alpha(theme.palette.error.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                        height: '100%',
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={3}>
                        <LocalHospital sx={{ color: 'error.main', fontSize: 24 }} />
                        <Typography variant="h6" fontWeight="bold" fontFamily='"Neris", sans-serif'>
                          Radar de Riesgo Activo
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Pacientes con: alerta suicidio, PHQ alto, sin progreso en 3 sesiones
                      </Typography>
                      
                      {/* Risk Radar Content */}
                      <Box>
                        {ceoMetrics.riskRadarData.map((patient, index) => (
                          <Box
                            key={patient.pacienteId}
                            sx={{
                              p: 2,
                              mb: 2,
                              borderRadius: 2,
                              background: alpha(
                                patient.nivelRiesgo === 'critico' ? theme.palette.error.main :
                                patient.nivelRiesgo === 'alto' ? theme.palette.warning.main :
                                theme.palette.info.main, 
                                0.1
                              ),
                              border: `1px solid ${alpha(
                                patient.nivelRiesgo === 'critico' ? theme.palette.error.main :
                                patient.nivelRiesgo === 'alto' ? theme.palette.warning.main :
                                theme.palette.info.main, 
                                0.3
                              )}`,
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight="bold">
                              {patient.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {patient.descripcion}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" fontWeight="bold" color="text.secondary">
                                Acciones: {patient.accionesRecomendadas.join(', ')}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>

                  {/* Capacity Forecast Widget */}
                  <Grid item xs={12} lg={4}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: alpha(theme.palette.info.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                        height: '100%',
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={3}>
                        <TrendingUp sx={{ color: 'info.main', fontSize: 24 }} />
                        <Typography variant="h6" fontWeight="bold" fontFamily='"Neris", sans-serif'>
                          Forecast de Capacidad
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Heatmap calendario 30 días (verde = libre, rojo = saturado)
                      </Typography>
                      
                      {/* Capacity Forecast Content */}
                      <Grid container spacing={0.5}>
                        {ceoMetrics.capacityForecast.slice(0, 30).map((day, index) => (
                          <Grid item xs={1.7} key={day.fecha}>
                            <Box
                              sx={{
                                aspectRatio: '1',
                                borderRadius: 1,
                                background: 
                                  day.disponibilidad === 'libre' ? theme.palette.success.main :
                                  day.disponibilidad === 'ocupado' ? theme.palette.warning.main :
                                  theme.palette.error.main,
                                opacity: 0.8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                color: 'white',
                                fontWeight: 'bold',
                              }}
                              title={`${day.fecha}: ${day.porcentajeOcupacion.toFixed(0)}% ocupación`}
                            >
                              {new Date(day.fecha).getDate()}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Grid>

                  {/* Adherence Widget */}
                  <Grid item xs={12} lg={4}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: alpha(theme.palette.success.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                        height: '100%',
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={3}>
                        <Psychology sx={{ color: 'success.main', fontSize: 24 }} />
                        <Typography variant="h6" fontWeight="bold" fontFamily='"Neris", sans-serif'>
                          Adherencia por Programa
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        % de sesiones completadas por tipo de programa
                      </Typography>
                      
                      {/* Adherence Content */}
                      <Box>
                        {ceoMetrics.adherenceData.map((program, index) => (
                          <Box key={program.programa} sx={{ mb: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="body2" fontWeight="medium">
                                {program.programa}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold" color="success.main">
                                {program.porcentajeAdherencia.toFixed(1)}%
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                width: '100%',
                                height: 6,
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                borderRadius: 3,
                                overflow: 'hidden'
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${program.porcentajeAdherencia}%`,
                                  height: '100%',
                                  bgcolor: theme.palette.success.main,
                                  transition: 'width 0.3s ease'
                                }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {program.sesionesCompletadas}/{program.sesionesProgramadas} sesiones | {program.pacientesActivos} pacientes
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Commercial Pipeline Panel - Reserved for future phases */}
          <Box sx={{ mb: 4 }}>
            <Accordion 
              disabled
              sx={{
                background: alpha(theme.palette.text.secondary, 0.05),
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.text.secondary, 0.1)}`,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                sx={{
                  background: alpha(theme.palette.text.secondary, 0.1),
                  color: theme.palette.text.secondary,
                  borderRadius: '16px 16px 0 0',
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <TrendingUp sx={{ fontSize: 28 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold" fontFamily='"Neris", sans-serif'>
                      📈 Panel C: Pipeline Comercial & Marketing
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      Reservado para fases posteriores: campañas activas, funnels de captación, costo por lead
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
            </Accordion>
          </Box>
        </Container>

        {/* KPI Detail Dialog */}
        <KpiDetailDialog
          open={!!selectedKpi}
          onClose={handleCloseKpiDialog}
          kpi={selectedKpi}
        />
      </CEODashboardLayout>
    </ProtectedRoute>
  );
}
