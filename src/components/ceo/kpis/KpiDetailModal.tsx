'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  Paper,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close,
  TrendingUp,
  TrendingDown,
  Assessment,
  Business,
  EventBusy,
  Psychology,
  AccountBalance,
  Inventory,
  Receipt,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { CEOKPIData } from '@/types/ceo';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

const iconMap: Record<string, React.ComponentType> = {
  TrendingUp,
  Assessment,
  Business,
  EventBusy,
  Psychology,
  AccountBalance,
  Inventory,
  Receipt,
};

interface KpiDetailModalProps {
  open: boolean;
  onClose: () => void;
  kpiData?: CEOKPIData;
}

export default function KpiDetailModal({ open, onClose, kpiData }: KpiDetailModalProps) {
  const theme = useTheme();

  if (!kpiData) return null;

  const IconComponent = iconMap[kpiData.icon] || TrendingUp;
  const progressPercentage = kpiData.target ? (kpiData.value / kpiData.target) * 100 : 0;

  // Generate YoY comparison data (simulated)
  const yoyData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Año Actual',
        data: kpiData.sparklineData,
        borderColor: ceoBrandColors.primary,
        backgroundColor: alpha(ceoBrandColors.primary, 0.1),
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Año Anterior',
        data: kpiData.sparklineData.map(val => val * 0.85), // Simulated previous year
        borderColor: alpha(ceoBrandColors.text, 0.3),
        backgroundColor: 'transparent',
        tension: 0.4,
        borderDash: [5, 5],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: '"Neris", sans-serif',
            size: 12,
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
        },
      },
      y: {
        grid: {
          color: alpha(ceoBrandColors.text, 0.1),
        },
        ticks: {
          font: {
            family: '"Neris", sans-serif',
            size: 11,
          },
        },
      },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: ceoBrandColors.background,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderBottom: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette[kpiData.color].main} 0%, ${theme.palette[kpiData.color].dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <IconComponent sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600,
                  color: ceoBrandColors.text,
                }}
              >
                {kpiData.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 300,
                  color: alpha(ceoBrandColors.text, 0.7),
                }}
              >
                Análisis detallado y comparativo
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Current Value and Progress */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 3,
                border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
              }}
            >
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600,
                  color: ceoBrandColors.text,
                  mb: 2,
                }}
              >
                Valor Actual
              </Typography>
              
              <Typography 
                variant="h3" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 700,
                  color: ceoBrandColors.primary,
                  mb: 1,
                }}
              >
                {kpiData.value.toLocaleString()}{kpiData.unit}
              </Typography>

              {kpiData.target && (
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Meta: {kpiData.target.toLocaleString()}{kpiData.unit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {progressPercentage.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(progressPercentage, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha(ceoBrandColors.primary, 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: progressPercentage >= 90 
                          ? '#4CAF50' 
                          : progressPercentage >= 70 
                          ? '#FF9800' 
                          : '#F44336',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Trend Analysis */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 3,
                border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
              }}
            >
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600,
                  color: ceoBrandColors.text,
                  mb: 2,
                }}
              >
                Tendencia
              </Typography>
              
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                {kpiData.trend.isPositive ? (
                  <TrendingUp sx={{ color: '#4CAF50', fontSize: 32 }} />
                ) : (
                  <TrendingDown sx={{ color: '#F44336', fontSize: 32 }} />
                )}
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 700,
                      color: kpiData.trend.isPositive ? '#4CAF50' : '#F44336',
                    }}
                  >
                    {kpiData.trend.isPositive ? '+' : ''}{kpiData.trend.value}%
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontFamily: '"Neris", sans-serif' }}
                  >
                    {kpiData.trend.period}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: kpiData.semaphore === 'green' 
                    ? alpha('#4CAF50', 0.1)
                    : kpiData.semaphore === 'amber'
                    ? alpha('#FF9800', 0.1)
                    : alpha('#F44336', 0.1),
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    fontWeight: 500,
                    color: kpiData.semaphore === 'green' 
                      ? '#4CAF50'
                      : kpiData.semaphore === 'amber'
                      ? '#FF9800'
                      : '#F44336',
                  }}
                >
                  Estado: {kpiData.semaphore === 'green' ? 'Óptimo' : kpiData.semaphore === 'amber' ? 'Atención' : 'Crítico'}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Historical Chart */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 3,
                border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
              }}
            >
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600,
                  color: ceoBrandColors.text,
                  mb: 3,
                }}
              >
                Comparativo Año sobre Año
              </Typography>
              
              <Box sx={{ height: 300 }}>
                <Line data={yoyData} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>

          {/* Additional Insights */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 3,
                border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
              }}
            >
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600,
                  color: ceoBrandColors.text,
                  mb: 2,
                }}
              >
                Insights y Recomendaciones
              </Typography>
              
              <Box sx={{ pl: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    color: ceoBrandColors.text,
                    mb: 1,
                  }}
                >
                  • {kpiData.subtitle}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Neris", sans-serif',
                    color: ceoBrandColors.text,
                    mb: 1,
                  }}
                >
                  • Tendencia {kpiData.trend.isPositive ? 'positiva' : 'negativa'} sostenida en {kpiData.trend.period}
                </Typography>
                {kpiData.target && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      color: ceoBrandColors.text,
                    }}
                  >
                    • {progressPercentage >= 90 
                      ? 'Meta prácticamente alcanzada, mantener el ritmo' 
                      : progressPercentage >= 70 
                      ? 'En camino hacia la meta, revisar estrategias de aceleración'
                      : 'Requiere atención inmediata para alcanzar la meta'}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: ceoBrandColors.primary,
            color: ceoBrandColors.primary,
            fontFamily: '"Neris", sans-serif',
            fontWeight: 600,
          }}
        >
          Cerrar
        </Button>
        <Button
          variant="contained"
          sx={{
            background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
            fontFamily: '"Neris", sans-serif',
            fontWeight: 600,
          }}
        >
          Exportar Detalle
        </Button>
      </DialogActions>
    </Dialog>
  );
}
