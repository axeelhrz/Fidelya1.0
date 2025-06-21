'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
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
  Warning,
  CheckCircle,
  Schedule,
  Psychology,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { CEODashboardState } from '@/types/ceo';
import { format, addDays } from 'date-fns';

// Minimalist color palette
const colors = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
};

interface ClinicaOperativaTabProps {
  ceoMetrics: CEODashboardState;
}

export default function ClinicaOperativaTab({ ceoMetrics }: ClinicaOperativaTabProps) {
  // Sample emotion data for pie chart
  const emotionData = [
    { name: 'Ansiedad', value: 35, color: colors.primary },
    { name: 'Depresión', value: 28, color: colors.error },
    { name: 'Estrés', value: 20, color: colors.warning },
    { name: 'Trastornos del sueño', value: 12, color: colors.success },
    { name: 'Otros', value: 5, color: colors.secondary },
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
      case 'crítica': return colors.error;
      case 'alta': return colors.warning;
      case 'media': return colors.primary;
      default: return colors.secondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activa': return colors.error;
      case 'en_proceso': return colors.warning;
      case 'resuelta': return colors.success;
      default: return colors.secondary;
    }
  };

  return (
    <Box>
      <Typography 
        variant="h5" 
        sx={{ 
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          color: colors.text,
          mb: 4,
        }}
      >
        Clínica & Operativa
      </Typography>

      <Grid container spacing={4}>
        {/* Radar de Riesgo Activo */}
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: 4,
              backgroundColor: colors.surface,
              border: `1px solid #e2e8f0`,
              borderRadius: 2,
              boxShadow: 'none',
              height: '100%',
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Warning sx={{ color: colors.error, fontSize: 24 }} />
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: colors.text,
                  }}
                >
                  Radar de Riesgo Activo
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
                  }}
                >
                  Pacientes con alerta suicidio, PHQ alto, sin progreso
                </Typography>
              </Box>
            </Box>

            <Box>
              {ceoMetrics.riskRadarData.map((patient) => (
                <Box
                  key={patient.pacienteId}
                  sx={{
                    p: 3,
                    mb: 2,
                    borderRadius: 2,
                    backgroundColor: `${getSeverityColor(patient.nivelRiesgo)}08`,
                    border: `1px solid ${getSeverityColor(patient.nivelRiesgo)}20`,
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 600,
                        color: colors.text,
                      }}
                    >
                      {patient.nombre}
                    </Typography>
                    <Chip
                      label={patient.nivelRiesgo}
                      size="small"
                      sx={{
                        backgroundColor: getSeverityColor(patient.nivelRiesgo),
                        color: 'white',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 400,
                      color: colors.textSecondary,
                      mb: 2,
                    }}
                  >
                    {patient.descripcion}
                  </Typography>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 500,
                      color: colors.textSecondary,
                    }}
                  >
                    Acciones: {patient.accionesRecomendadas.join(', ')}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Forecast de Capacidad */}
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: 4,
              backgroundColor: colors.surface,
              border: `1px solid #e2e8f0`,
              borderRadius: 2,
              boxShadow: 'none',
              height: '100%',
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Schedule sx={{ color: colors.primary, fontSize: 24 }} />
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: colors.text,
                  }}
                >
                  Forecast de Capacidad
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
                  }}
                >
                  Calendario 30 días (verde = libre, rojo = saturado)
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
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
                    color: colors.textSecondary,
                    mb: 1,
                  }}
                >
                  {day}
                </Typography>
              ))}
              
              {ceoMetrics.capacityForecast.slice(0, 28).map((day) => (
                <Box
                  key={day.fecha}
                  sx={{
                    aspectRatio: '1',
                    borderRadius: 1,
                    backgroundColor: 
                      day.disponibilidad === 'libre' ? colors.success :
                      day.disponibilidad === 'ocupado' ? colors.warning :
                      colors.error,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
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
                <Box sx={{ width: 12, height: 12, borderRadius: 1, backgroundColor: colors.success }} />
                <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 400 }}>
                  Libre (&lt;60%)
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 12, height: 12, borderRadius: 1, backgroundColor: colors.warning }} />
                <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 400 }}>
                  Ocupado (60-85%)
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 12, height: 12, borderRadius: 1, backgroundColor: colors.error }} />
                <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 400 }}>
                  Saturado (&gt;85%)
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Adherencia por Programa */}
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: 4,
              backgroundColor: colors.surface,
              border: `1px solid #e2e8f0`,
              borderRadius: 2,
              boxShadow: 'none',
              height: '100%',
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <CheckCircle sx={{ color: colors.success, fontSize: 24 }} />
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: colors.text,
                  }}
                >
                  Adherencia por Programa
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
                  }}
                >
                  % de sesiones completadas por tipo de programa
                </Typography>
              </Box>
            </Box>

            <Box>
              {ceoMetrics.adherenceData.map((program) => (
                <Box key={program.programa} sx={{ mb: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 600,
                        color: colors.text,
                      }}
                    >
                      {program.programa}
                    </Typography>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 600,
                        color: colors.success,
                      }}
                    >
                      {program.porcentajeAdherencia.toFixed(1)}%
                    </Typography>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={program.porcentajeAdherencia}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#f1f5f9',
                      mb: 1,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: colors.success,
                        borderRadius: 3,
                      }
                    }}
                  />
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 400,
                      color: colors.textSecondary,
                    }}
                  >
                    {program.sesionesCompletadas}/{program.sesionesProgramadas} sesiones | {program.pacientesActivos} pacientes activos
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Mapa de Emociones */}
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: 4,
              backgroundColor: colors.surface,
              border: `1px solid #e2e8f0`,
              borderRadius: 2,
              boxShadow: 'none',
              height: '100%',
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Psychology sx={{ color: colors.primary, fontSize: 24 }} />
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: colors.text,
                  }}
                >
                  Mapa de Emociones
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
                  }}
                >
                  Distribución de condiciones predominantes
                </Typography>
              </Box>
            </Box>

            <Box sx={{ height: 200, mb: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {emotionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: colors.surface,
                      border: `1px solid #e2e8f0`,
                      borderRadius: 8,
                      fontFamily: '"Inter", sans-serif',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Legend */}
            <Box>
              {emotionData.map((item, index) => (
                <Box key={index} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: 12, height: 12, borderRadius: 1, backgroundColor: item.color }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 400,
                        color: colors.text,
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 600,
                      color: colors.text,
                    }}
                  >
                    {item.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Historial de Alertas Clínicas */}
      <Paper
        sx={{
          p: 4,
          mt: 4,
          backgroundColor: colors.surface,
          border: `1px solid #e2e8f0`,
          borderRadius: 2,
          boxShadow: 'none',
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            color: colors.text,
            mb: 3,
          }}
        >
          Historial de Alertas Clínicas Recientes
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: colors.text }}>
                  Paciente
                </TableCell>
                <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: colors.text }}>
                  Tipo de Alerta
                </TableCell>
                <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: colors.text }}>
                  Fecha
                </TableCell>
                <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: colors.text }}>
                  Severidad
                </TableCell>
                <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: colors.text }}>
                  Estado
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentClinicalAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 400, color: colors.text }}>
                    {alert.paciente}
                  </TableCell>
                  <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 400, color: colors.text }}>
                    {alert.tipo}
                  </TableCell>
                  <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 400, color: colors.text }}>
                    {format(alert.fecha, 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={alert.severidad}
                      size="small"
                      sx={{
                        backgroundColor: getSeverityColor(alert.severidad),
                        color: 'white',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
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
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}