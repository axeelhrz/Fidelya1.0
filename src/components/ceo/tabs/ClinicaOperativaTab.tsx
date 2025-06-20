'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  LocalHospital,
  Psychology,
  TrendingUp,
  Warning,
  CheckCircle,
  Schedule,
  Group,
  Assessment,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { motion } from 'framer-motion';
import { CEODashboardState } from '@/types/ceo';
import { format, addDays } from 'date-fns';

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

interface ClinicaOperativaTabProps {
  ceoMetrics: CEODashboardState;
}

export default function ClinicaOperativaTab({ ceoMetrics }: ClinicaOperativaTabProps) {
  const theme = useTheme();

  // Sample emotion data for pie chart
  const emotionData = [
    { name: 'Ansiedad', value: 35, color: ceoBrandColors.accentPink },
    { name: 'Depresión', value: 28, color: ceoBrandColors.primary },
    { name: 'Estrés', value: 20, color: ceoBrandColors.accentBlue },
    { name: 'Trastornos del sueño', value: 12, color: ceoBrandColors.secondary },
    { name: 'Otros', value: 5, color: alpha(ceoBrandColors.text, 0.3) },
  ];

  // Sample recent clinical alerts
  const recentClinicalAlerts = [
    {
      id: 1,
      paciente: 'Paciente A.',
      tipo: 'Riesgo suicida',
      fecha: new Date(),
      severidad: 'crítica',
      estado: 'activa'
    },
    {
      id: 2,
      paciente: 'Paciente B.',
      tipo: 'PHQ-9 Alto',
      fecha: addDays(new Date(), -1),
      severidad: 'alta',
      estado: 'en_proceso'
    },
    {
      id: 3,
      paciente: 'Paciente C.',
      tipo: 'Falta a sesiones',
      fecha: addDays(new Date(), -2),
      severidad: 'media',
      estado: 'resuelta'
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'crítica': return '#ef4444';
      case 'alta': return '#f59e0b';
      case 'media': return ceoBrandColors.accentBlue;
      default: return ceoBrandColors.text;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activa': return '#ef4444';
      case 'en_proceso': return '#f59e0b';
      case 'resuelta': return '#10b981';
      default: return ceoBrandColors.text;
    }
  };

  return (
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: `linear-gradient(135deg, ${ceoBrandColors.accentBlue} 0%, ${ceoBrandColors.secondary} 100%)`,
            color: 'white',
            borderRadius: 4,
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600, // Semibold
              mb: 1,
            }}
          >
            🧠 Clínica & Operativa
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              fontWeight: 300, // Light
              opacity: 0.9,
            }}
          >
            Salud operacional, radar de riesgo y adherencia por programa
          </Typography>
        </Paper>
      </motion.div>

      <Grid container spacing={4}>
        {/* Radar de Riesgo Activo */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
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
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Warning sx={{ color: '#ef4444', fontSize: 32 }} />
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: ceoBrandColors.text,
                    }}
                  >
                    🚨 Radar de Riesgo Activo
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.6),
                    }}
                  >
                    Pacientes con alerta suicidio, PHQ alto, sin progreso
                  </Typography>
                </Box>
              </Box>

              <Box>
                {ceoMetrics.riskRadarData.map((patient, index) => (
                  <motion.div
                    key={patient.pacienteId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        mb: 2,
                        borderRadius: 3,
                        background: alpha(
                          patient.nivelRiesgo === 'critico' ? '#ef4444' :
                          patient.nivelRiesgo === 'alto' ? '#f59e0b' :
                          ceoBrandColors.accentBlue, 
                          0.1
                        ),
                        border: `1px solid ${alpha(
                          patient.nivelRiesgo === 'critico' ? '#ef4444' :
                          patient.nivelRiesgo === 'alto' ? '#f59e0b' :
                          ceoBrandColors.accentBlue, 
                          0.3
                        )}`,
                      }}
                    >
                      <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontFamily: '"Neris", sans-serif',
                            fontWeight: 600, // Semibold
                            color: ceoBrandColors.text,
                          }}
                        >
                          {patient.nombre}
                        </Typography>
                        <Chip
                          label={patient.nivelRiesgo}
                          size="small"
                          sx={{
                            background: patient.nivelRiesgo === 'critico' ? '#ef4444' :
                                       patient.nivelRiesgo === 'alto' ? '#f59e0b' :
                                       ceoBrandColors.accentBlue,
                            color: 'white',
                            fontFamily: '"Neris", sans-serif',
                            fontWeight: 600, // Semibold
                          }}
                        />
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 300, // Light
                          color: alpha(ceoBrandColors.text, 0.8),
                          mb: 2,
                        }}
                      >
                        {patient.descripcion}
                      </Typography>
                      
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 600, // Semibold
                          color: alpha(ceoBrandColors.text, 0.7),
                        }}
                      >
                        💡 Acciones: {patient.accionesRecomendadas.join(', ')}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Forecast de Capacidad */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Paper
              sx={{
                p: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: `1px solid ${alpha(ceoBrandColors.accentBlue, 0.2)}`,
                height: '100%',
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Schedule sx={{ color: ceoBrandColors.accentBlue, fontSize: 32 }} />
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: ceoBrandColors.text,
                    }}
                  >
                    📅 Forecast de Capacidad
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.6),
                    }}
                  >
                    Heatmap calendario 30 días (verde = libre, rojo = saturado)
                  </Typography>
                </Box>
              </Box>

              {/* Calendar Heatmap */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 1,
                  mb: 3,
                }}
              >
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
                  <Typography
                    key={day}
                    variant="caption"
                    sx={{
                      textAlign: 'center',
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: alpha(ceoBrandColors.text, 0.6),
                      mb: 1,
                    }}
                  >
                    {day}
                  </Typography>
                ))}
                
                {ceoMetrics.capacityForecast.slice(0, 28).map((day, index) => (
                  <Box
                    key={day.fecha}
                    sx={{
                      aspectRatio: '1',
                      borderRadius: 1,
                      background: 
                        day.disponibilidad === 'libre' ? '#10b981' :
                        day.disponibilidad === 'ocupado' ? '#f59e0b' :
                        '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                      transition: 'transform 0.2s',
                    }}
                    title={`${format(new Date(day.fecha), 'dd/MM')}: ${day.porcentajeOcupacion.toFixed(0)}% ocupación`}
                  >
                    {new Date(day.fecha).getDate()}
                  </Box>
                ))}
              </Box>

              {/* Legend */}
              <Box display="flex" alignItems="center" gap={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 1, background: '#10b981' }} />
                  <Typography variant="caption" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
                    Libre (&lt;60%)
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 1, background: '#f59e0b' }} />
                  <Typography variant="caption" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
                    Ocupado (60-85%)
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 1, background: '#ef4444' }} />
                  <Typography variant="caption" sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
                    Saturado (&gt;85%)
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Adherencia por Programa */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
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
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <CheckCircle sx={{ color: '#10b981', fontSize: 32 }} />
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: ceoBrandColors.text,
                    }}
                  >
                    ✅ Adherencia por Programa
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.6),
                    }}
                  >
                    % de sesiones completadas por tipo de programa
                  </Typography>
                </Box>
              </Box>

              <Box>
                {ceoMetrics.adherenceData.map((program, index) => (
                  <motion.div
                    key={program.programa}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    <Box sx={{ mb: 3 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontFamily: '"Neris", sans-serif',
                            fontWeight: 600, // Semibold
                            color: ceoBrandColors.text,
                          }}
                        >
                          {program.programa}
                        </Typography>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontFamily: '"Neris", sans-serif',
                            fontWeight: 600, // Semibold
                            color: '#10b981',
                          }}
                        >
                          {program.porcentajeAdherencia.toFixed(1)}%
                        </Typography>
                      </Box>
                      
                      <LinearProgress
                        variant="determinate"
                        value={program.porcentajeAdherencia}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha('#10b981', 0.1),
                          mb: 1,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#10b981',
                            borderRadius: 4,
                          }
                        }}
                      />
                      
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 300, // Light
                          color: alpha(ceoBrandColors.text, 0.6),
                        }}
                      >
                        {program.sesionesCompletadas}/{program.sesionesProgramadas} sesiones | {program.pacientesActivos} pacientes activos
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Mapa de Emociones Predominantes */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Paper
              sx={{
                p: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: `1px solid ${alpha(ceoBrandColors.primary, 0.2)}`,
                height: '100%',
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Psychology sx={{ color: ceoBrandColors.primary, fontSize: 32 }} />
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: ceoBrandColors.text,
                    }}
                  >
                    🎭 Mapa de Emociones
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.6),
                    }}
                  >
                    Distribución de condiciones predominantes
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ height: 250, mb: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emotionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {emotionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: `1px solid ${alpha(ceoBrandColors.primary, 0.2)}`,
                        borderRadius: 8,
                        fontFamily: '"Neris", sans-serif',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              {/* Legend */}
              <Box>
                {emotionData.map((item, index) => (
                  <Box key={index} display="flex" alignItems="center" justifyContent="between" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ width: 12, height: 12, borderRadius: 1, background: item.color }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 300, // Light
                          color: ceoBrandColors.text,
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600, // Semibold
                        color: ceoBrandColors.text,
                      }}
                    >
                      {item.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Historial de Alertas Clínicas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Paper
          sx={{
            p: 4,
            mt: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            border: `1px solid ${alpha(ceoBrandColors.secondary, 0.2)}`,
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Assessment sx={{ color: ceoBrandColors.secondary, fontSize: 32 }} />
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600, // Semibold
                  color: ceoBrandColors.text,
                }}
              >
                📋 Historial de Alertas Clínicas Recientes
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 300, // Light
                  color: alpha(ceoBrandColors.text, 0.6),
                }}
              >
                Seguimiento de alertas y resoluciones del equipo clínico
              </Typography>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                    Paciente
                  </TableCell>
                  <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                    Tipo de Alerta
                  </TableCell>
                  <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                    Fecha
                  </TableCell>
                  <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                    Severidad
                  </TableCell>
                  <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                    Estado
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentClinicalAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
                      {alert.paciente}
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
                      {alert.tipo}
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 300 }}>
                      {format(alert.fecha, 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.severidad}
                        size="small"
                        sx={{
                          background: getSeverityColor(alert.severidad),
                          color: 'white',
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.estado}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: getStatusColor(alert.estado),
                          color: getStatusColor(alert.estado),
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </motion.div>
    </Box>
  );
}