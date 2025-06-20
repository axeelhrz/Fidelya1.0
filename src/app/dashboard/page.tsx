'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  useTheme,
  alpha,
  Paper,
  Fade,
  Chip,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  TrendingUp,
  Psychology,
  Business,
  Download,
  Refresh,
  Schedule,
  Public,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/hooks/useRole';
import { useCEOMetrics } from '@/hooks/useCEOMetrics';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Import CEO section components
import CEOTopbar from '@/components/layout/CEOTopbar';
import KpiCard from '@/components/ceo/KpiCard';
import BurnEarnChart from '@/components/ceo/charts/BurnEarnChart';
import ProfitabilityHeatmap from '@/components/ceo/charts/ProfitabilityHeatmap';
import FinancialPanel from '@/components/ceo/panels/FinancialPanel';
import RightDock from '@/components/layout/RightDock';

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

// Componente para el dashboard de administrador/CEO
function CEODashboard() {
  const { user } = useAuth();
  const theme = useTheme();
  const ceoMetrics = useCEOMetrics();
  const searchParams = useSearchParams();
  const section = searchParams.get('section') || 'overview';
  const [selectedKpi, setSelectedKpi] = useState<any>(null);

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      local: format(now, "EEEE, dd 'de' MMMM 'de' yyyy - HH:mm", { locale: es }),
      utc: format(now, "HH:mm 'UTC'")
    };
  };

  const { local, utc } = getCurrentDateTime();

  const handleKpiDetailClick = (kpi: any) => {
    setSelectedKpi(kpi);
  };

  const handleCloseKpiDialog = () => {
    setSelectedKpi(null);
  };

  const handleTaskUpdate = (taskId: string, updates: any) => {
    console.log('Updating task:', taskId, updates);
  };

  const handleTaskCreate = () => {
    console.log('Creating new task...');
  };

  const handleAlertDismiss = (alertId: string) => {
    console.log('Dismissing alert:', alertId);
  };

  const renderSectionContent = () => {
    switch (section) {
      case 'kpis':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600,
                color: ceoBrandColors.text,
                mb: 4,
              }}
            >
              📊 KPIs Ejecutivos
            </Typography>
            
            <Grid container spacing={3}>
              {ceoMetrics.kpis.map((kpi, index) => (
                <Grid item xs={12} sm={6} lg={4} key={kpi.id}>
                  <KpiCard
                    kpi={kpi}
                    onDetailClick={handleKpiDetailClick}
                    delay={index}
                  />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        );

      case 'financial':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600,
                color: ceoBrandColors.text,
                mb: 4,
              }}
            >
              💰 Desempeño Financiero
            </Typography>
            
            <FinancialPanel
              burnEarnData={ceoMetrics.burnEarnData}
              profitabilityData={ceoMetrics.profitabilityData}
              loading={ceoMetrics.loading}
            />
          </motion.div>
        );

      case 'clinical':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600,
                color: ceoBrandColors.text,
                mb: 4,
              }}
            >
              🧠 Salud Clínica & Operativa
            </Typography>
            
            <Grid container spacing={4}>
              {/* Radar de Riesgo */}
              <Grid item xs={12} lg={6}>
                <Paper
                  sx={{
                    p: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: `1px solid ${alpha('#ef4444', 0.2)}`,
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600, mb: 3 }}>
                    🚨 Radar de Riesgo Activo
                  </Typography>
                  
                  {ceoMetrics.riskRadarData.map((patient, index) => (
                    <Box
                      key={patient.pacienteId}
                      sx={{
                        p: 3,
                        mb: 2,
                        borderRadius: 3,
                        background: alpha('#ef4444', 0.1),
                        border: `1px solid ${alpha('#ef4444', 0.3)}`,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                        {patient.nombre}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300, mb: 1 }}>
                        {patient.descripcion}
                      </Typography>
                                      <Typography variant="caption" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                        💡 Acciones: {patient.accionesRecomendadas.join(', ')}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Grid>

              {/* Adherencia por Programa */}
              <Grid item xs={12} lg={6}>
                <Paper
                  sx={{
                    p: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: `1px solid ${alpha('#10b981', 0.2)}`,
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600, mb: 3 }}>
                    ✅ Adherencia por Programa
                  </Typography>
                  
                  {ceoMetrics.adherenceData.map((program) => (
                    <Box key={program.programa} sx={{ mb: 3 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle2" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                          {program.programa}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600, color: '#10b981' }}>
                          {program.porcentajeAdherencia.toFixed(1)}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          height: 8,
                          bgcolor: alpha('#10b981', 0.1),
                          borderRadius: 4,
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          sx={{
                            width: `${program.porcentajeAdherencia}%`,
                            height: '100%',
                            bgcolor: '#10b981',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
                        {program.sesionesCompletadas}/{program.sesionesProgramadas} sesiones | {program.pacientesActivos} pacientes
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        );

      case 'commercial':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                p: 6,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: `1px solid ${alpha(ceoBrandColors.secondary, 0.2)}`,
                textAlign: 'center',
              }}
            >
              <BusinessCenter sx={{ fontSize: 64, color: ceoBrandColors.secondary, mb: 3 }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600,
                  color: ceoBrandColors.text,
                  mb: 2,
                }}
              >
                📈 Pipeline Comercial & Marketing
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 300,
                  color: alpha(ceoBrandColors.text, 0.7),
                  mb: 3,
                }}
              >
                Próximamente
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 300,
                  color: alpha(ceoBrandColors.text, 0.6),
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                Esta sección incluirá campañas activas, funnels de captación, costo por lead, 
                análisis de conversión y métricas de marketing digital.
              </Typography>
            </Paper>
          </motion.div>
        );

      case 'compliance':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600,
                color: ceoBrandColors.text,
                mb: 4,
              }}
            >
              ⚖️ Compliance & Cumplimiento
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} lg={8}>
                <Paper
                  sx={{
                    p: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: `1px solid ${alpha(ceoBrandColors.primary, 0.2)}`,
                  }}
                >
                  <Typography variant="h6" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600, mb: 3 }}>
                    📋 Estado de Cumplimiento
                  </Typography>
                  
                  {/* Compliance items */}
                  {[
                    { item: 'Licencia Sanitaria', estado: 'vigente', vencimiento: '2024-12-15' },
                    { item: 'Certificado Profesional', estado: 'vigente', vencimiento: '2024-08-30' },
                    { item: 'Auditoría Interna', estado: 'pendiente', vencimiento: '2024-04-15' },
                    { item: 'Backup de Datos', estado: 'completado', vencimiento: '2024-04-01' },
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 3,
                        mb: 2,
                        borderRadius: 3,
                        background: alpha(
                          item.estado === 'vigente' || item.estado === 'completado' ? '#10b981' : '#f59e0b',
                          0.1
                        ),
                        border: `1px solid ${alpha(
                          item.estado === 'vigente' || item.estado === 'completado' ? '#10b981' : '#f59e0b',
                          0.3
                        )}`,
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                          {item.item}
                        </Typography>
                        <Chip
                          label={item.estado}
                          size="small"
                          sx={{
                            background: item.estado === 'vigente' || item.estado === 'completado' ? '#10b981' : '#f59e0b',
                            color: 'white',
                            fontFamily: '"Neris", sans-serif',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300, mt: 1 }}>
                        Vencimiento: {item.vencimiento}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Grid>
              
              <Grid item xs={12} lg={4}>
                <Paper
                  sx={{
                    p: 4,
                    background: `linear-gradient(135deg, ${alpha(ceoBrandColors.primary, 0.1)} 0%, ${alpha(ceoBrandColors.secondary, 0.1)} 100%)`,
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: `1px solid ${alpha(ceoBrandColors.primary, 0.2)}`,
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600, mb: 3 }}>
                    📄 Daily CEO Brief
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300, mb: 3 }}>
                    Descarga el resumen ejecutivo diario con todas las métricas y alertas.
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: 2,
                      mb: 3,
                    }}
                  >
                    <Typography variant="caption" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                      Incluye:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      <Typography component="li" variant="caption" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
                        KPIs y métricas financieras
                      </Typography>
                      <Typography component="li" variant="caption" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
                        Alertas críticas y riesgos
                      </Typography>
                      <Typography component="li" variant="caption" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
                        Estado de compliance
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    component="button"
                    sx={{
                      width: '100%',
                      p: 2,
                      background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                      color: 'white',
                      border: 'none',
                      borderRadius: 3,
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 25px ${alpha(ceoBrandColors.primary, 0.3)}`,
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <Download sx={{ mr: 1 }} />
                    Descargar CEO Brief
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Vista general del CEO Dashboard */}
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600,
                  color: ceoBrandColors.text,
                  mb: 3,
                }}
              >
                📊 KPIs Principales
              </Typography>
              
              <Grid container spacing={3}>
                {ceoMetrics.kpis.slice(0, 4).map((kpi, index) => (
                  <Grid item xs={12} sm={6} lg={3} key={kpi.id}>
                    <KpiCard
                      kpi={kpi}
                      onDetailClick={handleKpiDetailClick}
                      delay={index}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Panel Financiero Resumido */}
            <Box sx={{ mb: 6 }}>
              <FinancialPanel
                burnEarnData={ceoMetrics.burnEarnData}
                profitabilityData={ceoMetrics.profitabilityData}
                loading={ceoMetrics.loading}
              />
            </Box>

            {/* Alertas y Insights */}
            <Grid container spacing={4}>
              <Grid item xs={12} lg={6}>
                <Paper
                  sx={{
                    p: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: `1px solid ${alpha('#ef4444', 0.2)}`,
                  }}
                >
                  <Typography variant="h6" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600, mb: 3 }}>
                    🚨 Alertas Críticas
                  </Typography>
                  
                  {ceoMetrics.criticalAlerts.slice(0, 3).map((alert) => (
                    <Box
                      key={alert.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 3,
                        background: alpha('#ef4444', 0.05),
                        border: `1px solid ${alpha('#ef4444', 0.1)}`,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                        {alert.titulo}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
                        {alert.descripcion}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Grid>

              <Grid item xs={12} lg={6}>
                <Paper
                  sx={{
                    p: 4,
                    background: `linear-gradient(135deg, ${alpha(ceoBrandColors.accentBlue, 0.1)} 0%, ${alpha(ceoBrandColors.secondary, 0.1)} 100%)`,
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: `1px solid ${alpha(ceoBrandColors.accentBlue, 0.2)}`,
                  }}
                >
                  <Typography variant="h6" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600, mb: 3 }}>
                    🤖 AI Insights
                  </Typography>
                  
                  {ceoMetrics.aiInsights.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600, mb: 2 }}>
                        {ceoMetrics.aiInsights[0].titulo}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300, mb: 2 }}>
                        {ceoMetrics.aiInsights[0].descripcion}
                      </Typography>
                      <Chip
                        label={`Confianza: ${ceoMetrics.aiInsights[0].confianza}%`}
                        size="small"
                        sx={{
                          background: ceoBrandColors.accentBlue,
                          color: 'white',
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        );
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: ceoBrandColors.background,
        fontFamily: '"Neris", sans-serif',
      }}
    >
      {/* Header / Topbar */}
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
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <Business sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600,
                        color: ceoBrandColors.text,
                        lineHeight: 1.2,
                      }}
                    >
                      Dashboard Ejecutivo
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 300,
                        color: alpha(ceoBrandColors.text, 0.7),
                      }}
                    >
                      Centro Psicológico Digital
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={3}>
                {/* Date & Time */}
                <Box textAlign="right">
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Schedule sx={{ fontSize: 16, color: ceoBrandColors.primary }} />
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600,
                        color: ceoBrandColors.text,
                      }}
                    >
                      {local}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Public sx={{ fontSize: 14, color: alpha(ceoBrandColors.text, 0.6) }} />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 300,
                        color: alpha(ceoBrandColors.text, 0.6),
                      }}
                    >
                      {utc}
                    </Typography>
                  </Box>
                </Box>

                {/* Actions */}
                <Box display="flex" alignItems="center" gap={1}>
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
                  
                  <Chip
                    label={`CEO: ${user?.displayName?.split(' ')[0] || 'Admin'}`}
                    sx={{
                      background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                      color: 'white',
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Main Content */}
      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}>
        {/* Content Area */}
        <Box sx={{ flex: 1, pr: { xs: 0, lg: '400px' } }}>
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <AnimatePresence mode="wait">
              {renderSectionContent()}
            </AnimatePresence>
          </Container>
        </Box>

        {/* Right Dock */}
        <RightDock
          criticalAlerts={ceoMetrics.criticalAlerts}
          importantAlerts={ceoMetrics.importantAlerts}
          tasks={ceoMetrics.tasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskCreate={handleTaskCreate}
          onAlertDismiss={handleAlertDismiss}
        />
      </Box>
    </Box>
  );
}

// Componente para dashboard de psicólogo
function PsychologistDashboard() {
  const theme = useTheme();
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
        Dashboard Psicólogo
      </Typography>
      
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
          Bienvenido al Dashboard de Psicólogo
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
          Aquí podrás gestionar tus pacientes, sesiones y ver métricas de tu práctica.
        </Typography>
      </Paper>
    </Container>
  );
}

// Componente para dashboard de paciente
function PatientDashboard() {
  const theme = useTheme();
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
        Mi Dashboard
      </Typography>
      
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
          Bienvenido a tu espacio personal
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
          Aquí podrás ver tus próximas citas, progreso y recursos de apoyo.
        </Typography>
      </Paper>
    </Container>
  );
}

// Componente principal
export default function DashboardPage() {
  const { role } = useRole();

  // Renderizar dashboard según el rol
  switch (role) {
    case 'admin':
      return <CEODashboard />;
    case 'psychologist':
      return <PsychologistDashboard />;
    case 'patient':
      return <PatientDashboard />;
    default:
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Cargando...
          </Typography>
        </Container>
      );
  }
}

