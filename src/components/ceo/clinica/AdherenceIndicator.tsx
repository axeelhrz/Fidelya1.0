'use client';

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  LinearProgress,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Group,
  Person,
  Psychology,
  Computer,
} from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { AdherenceData } from '@/types/ceo';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

interface AdherenceIndicatorProps {
  data: AdherenceData[];
}

const programIcons: Record<string, React.ComponentType> = {
  'Terapia Individual': Person,
  'Terapia Grupal': Group,
  'Terapia Familiar': Psychology,
  'Terapia Online': Computer,
};

export default function AdherenceIndicator({ data }: AdherenceIndicatorProps) {
  const theme = useTheme();
  const [selectedProgram, setSelectedProgram] = useState<string>('all');

  const filteredData = selectedProgram === 'all' ? data : data.filter(d => d.programa === selectedProgram);

  // Chart data
  const chartData = {
    labels: filteredData.map(d => d.programa),
    datasets: [
      {
        label: 'Adherencia (%)',
        data: filteredData.map(d => d.porcentajeAdherencia),
        backgroundColor: filteredData.map((_, index) => {
          const colors = [ceoBrandColors.primary, ceoBrandColors.accentBlue, ceoBrandColors.accentPink, ceoBrandColors.secondary];
          return alpha(colors[index % colors.length], 0.8);
        }),
        borderColor: filteredData.map((_, index) => {
          const colors = [ceoBrandColors.primary, ceoBrandColors.accentBlue, ceoBrandColors.accentPink, ceoBrandColors.secondary];
          return colors[index % colors.length];
        }),
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const program = filteredData[context.dataIndex];
            return [
              `Adherencia: ${context.parsed.y.toFixed(1)}%`,
              `Completadas: ${program.sesionesCompletadas}`,
              `Programadas: ${program.sesionesProgramadas}`,
              `Pacientes: ${program.pacientesActivos}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: '"Neris", sans-serif',
            size: 11,
          },
          maxRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: alpha(ceoBrandColors.text, 0.1),
        },
        ticks: {
          font: {
            family: '"Neris", sans-serif',
            size: 11,
          },
          callback: (value: any) => `${value}%`,
        },
      },
    },
  };

  // Calculate overall metrics
  const overallMetrics = {
    promedioAdherencia: data.reduce((acc, d) => acc + d.porcentajeAdherencia, 0) / data.length,
    totalPacientes: data.reduce((acc, d) => acc + d.pacientesActivos, 0),
    totalSesiones: data.reduce((acc, d) => acc + d.sesionesCompletadas, 0),
    programasMejorAdherencia: data.filter(d => d.porcentajeAdherencia >= 85).length,
  };

  return (
    <Paper
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 3,
        border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}` }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <TrendingUp sx={{ color: ceoBrandColors.accentPink, fontSize: 28 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600,
                color: ceoBrandColors.text,
              }}
            >
              Indicador de Adherencia
            </Typography>
          </Box>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Programa</InputLabel>
            <Select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              label="Programa"
            >
              <MenuItem value="all">Todos</MenuItem>
              {data.map((program) => (
                <MenuItem key={program.programa} value={program.programa}>
                  {program.programa}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: '"Neris", sans-serif',
            color: alpha(ceoBrandColors.text, 0.7),
            mb: 2,
          }}
        >
          % de cumplimiento por programa terapéutico
        </Typography>

        {/* Summary Metrics */}
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip
            label={`${overallMetrics.promedioAdherencia.toFixed(1)}% Promedio`}
            size="small"
            sx={{
              backgroundColor: alpha(ceoBrandColors.accentPink, 0.1),
              color: ceoBrandColors.accentPink,
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
            }}
          />
          <Chip
            label={`${overallMetrics.totalPacientes} Pacientes`}
            size="small"
            sx={{
              backgroundColor: alpha(ceoBrandColors.primary, 0.1),
              color: ceoBrandColors.primary,
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
            }}
          />
          <Chip
            label={`${overallMetrics.programasMejorAdherencia}/${data.length} Programas >85%`}
            size="small"
            sx={{
              backgroundColor: alpha('#4CAF50', 0.1),
              color: '#4CAF50',
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ height: 300 }}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
          </Grid>

          {/* Program Details */}
          <Grid item xs={12} lg={4}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600,
                color: ceoBrandColors.text,
                mb: 2,
              }}
            >
              Detalles por Programa
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={2}>
              {filteredData.map((program, index) => {
                const IconComponent = programIcons[program.programa] || Person;
                const adherenceColor = program.porcentajeAdherencia >= 85 
                  ? '#4CAF50' 
                  : program.porcentajeAdherencia >= 70 
                  ? '#FF9800' 
                  : '#F44336';

                return (
                  <Paper
                    key={program.programa}
                    elevation={0}
                    sx={{
                      p: 2,
                      background: alpha(adherenceColor, 0.05),
                      border: `1px solid ${alpha(adherenceColor, 0.2)}`,
                      borderRadius: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <IconComponent sx={{ color: adherenceColor, fontSize: 20 }} />
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 600,
                          color: ceoBrandColors.text,
                          flex: 1,
                        }}
                      >
                        {program.programa}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 700,
                          color: adherenceColor,
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
                        backgroundColor: alpha(adherenceColor, 0.2),
                        mb: 1,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: adherenceColor,
                          borderRadius: 3,
                        },
                      }}
                    />

                    <Box display="flex" justifyContent="space-between">
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          color: alpha(ceoBrandColors.text, 0.7),
                        }}
                      >
                        {program.sesionesCompletadas}/{program.sesionesProgramadas} sesiones
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          color: alpha(ceoBrandColors.text, 0.7),
                        }}
                      >
                        {program.pacientesActivos} pacientes
                      </Typography>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          </Grid>
        </Grid>

        {/* Recommendations */}
        <Box mt={3}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
              color: ceoBrandColors.text,
              mb: 2,
            }}
          >
            Recomendaciones de Mejora
          </Typography>
          
          <Grid container spacing={2}>
            {data.filter(d => d.porcentajeAdherencia < 70).map((program) => (
              <Grid item xs={12} md={6} key={program.programa}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: alpha('#FF9800', 0.1),
                    border: `1px solid ${alpha('#FF9800', 0.2)}`,
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      color: '#FF9800',
                      mb: 1,
                    }}
                  >
                    {program.programa}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      color: ceoBrandColors.text,
                      fontSize: '0.8rem',
                    }}
                  >
                    Adherencia baja ({program.porcentajeAdherencia.toFixed(1)}%). 
                    Sugerencias: revisar metodología, ajustar horarios, implementar recordatorios automáticos.
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
}
