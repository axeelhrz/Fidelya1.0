'use client';

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  CalendarToday,
  Warning,
  CheckCircle,
  Schedule,
  Business,
} from '@mui/icons-material';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { CapacityForecastData } from '@/types/ceo';

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

interface CapacityForecastProps {
  data: CapacityForecastData[];
}

export default function CapacityForecast({ data }: CapacityForecastProps) {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedWeek, setSelectedWeek] = useState(0);

  const getAvailabilityColor = (disponibilidad: string) => {
    switch (disponibilidad) {
      case 'libre':
        return '#4CAF50';
      case 'ocupado':
        return '#FF9800';
      case 'saturado':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getAvailabilityIcon = (disponibilidad: string) => {
    switch (disponibilidad) {
      case 'libre':
        return <CheckCircle />;
      case 'ocupado':
        return <Schedule />;
      case 'saturado':
        return <Warning />;
      default:
        return <Business />;
    }
  };

  const getAvailabilityLabel = (disponibilidad: string) => {
    switch (disponibilidad) {
      case 'libre':
        return 'Disponible';
      case 'ocupado':
        return 'Ocupado';
      case 'saturado':
        return 'Saturado';
      default:
        return 'Sin datos';
    }
  };

  // Generate weeks for selector
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const startDate = addDays(new Date(), i * 7);
    const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(startDate, { weekStartsOn: 1 });
    return {
      index: i,
      label: `${format(weekStart, 'dd MMM', { locale: es })} - ${format(weekEnd, 'dd MMM', { locale: es })}`,
      days: eachDayOfInterval({ start: weekStart, end: weekEnd }),
    };
  });

  const currentWeek = weeks[selectedWeek];

  // Get data for current week
  const weekData = currentWeek.days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayData = data.find(d => d.fecha === dayStr);
    return {
      date: day,
      data: dayData || {
        fecha: dayStr,
        disponibilidad: 'libre' as const,
        porcentajeOcupacion: 0,
        sesionesProgramadas: 0,
        capacidadMaxima: 10,
        consultoriosDisponibles: 6,
      },
    };
  });

  // Calculate week summary
  const weekSummary = {
    promedioOcupacion: weekData.reduce((acc, day) => acc + day.data.porcentajeOcupacion, 0) / weekData.length,
    diasSaturados: weekData.filter(day => day.data.disponibilidad === 'saturado').length,
    totalSesiones: weekData.reduce((acc, day) => acc + day.data.sesionesProgramadas, 0),
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
        <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <CalendarToday sx={{ color: ceoBrandColors.accentBlue, fontSize: 28 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600,
                color: ceoBrandColors.text,
              }}
            >
              Forecast de Capacidad
            </Typography>
          </Box>
          
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Semana</InputLabel>
            <Select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value as number)}
              label="Semana"
            >
              {weeks.map((week) => (
                <MenuItem key={week.index} value={week.index}>
                  {week.label}
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
          Heatmap calendario próximos 30 días
        </Typography>

        {/* Week Summary */}
        <Box display="flex" gap={2}>
          <Chip
            label={`${weekSummary.promedioOcupacion.toFixed(0)}% Ocupación Promedio`}
            size="small"
            sx={{
              backgroundColor: alpha(ceoBrandColors.accentBlue, 0.1),
              color: ceoBrandColors.accentBlue,
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
            }}
          />
          <Chip
            label={`${weekSummary.diasSaturados} Días Saturados`}
            size="small"
            sx={{
              backgroundColor: weekSummary.diasSaturados > 2 ? alpha('#F44336', 0.1) : alpha('#4CAF50', 0.1),
              color: weekSummary.diasSaturados > 2 ? '#F44336' : '#4CAF50',
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
            }}
          />
          <Chip
            label={`${weekSummary.totalSesiones} Sesiones`}
            size="small"
            sx={{
              backgroundColor: alpha(ceoBrandColors.primary, 0.1),
              color: ceoBrandColors.primary,
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {weekData.map((day, index) => {
            const isToday = format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            const availabilityColor = getAvailabilityColor(day.data.disponibilidad);
            const AvailabilityIcon = getAvailabilityIcon(day.data.disponibilidad);

            return (
              <Grid item xs={12} sm={6} md key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    background: isToday 
                      ? `linear-gradient(135deg, ${alpha(ceoBrandColors.primary, 0.1)} 0%, ${alpha(ceoBrandColors.secondary, 0.1)} 100%)`
                      : alpha(availabilityColor, 0.05),
                    border: isToday 
                      ? `2px solid ${ceoBrandColors.primary}`
                      : `1px solid ${alpha(availabilityColor, 0.2)}`,
                    borderRadius: 2,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: availabilityColor,
                      borderRadius: '8px 8px 0 0',
                    },
                  }}
                >
                  {/* Day Header */}
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600,
                        color: ceoBrandColors.text,
                      }}
                    >
                      {format(day.date, 'EEE dd', { locale: es })}
                    </Typography>
                    <Tooltip title={getAvailabilityLabel(day.data.disponibilidad)}>
                      <Box
                        sx={{
                          color: availabilityColor,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {AvailabilityIcon}
                      </Box>
                    </Tooltip>
                  </Box>

                  {/* Occupancy Bar */}
                  <Box mb={1}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          color: alpha(ceoBrandColors.text, 0.7),
                        }}
                      >
                        Ocupación
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 600,
                          color: availabilityColor,
                        }}
                      >
                        {day.data.porcentajeOcupacion.toFixed(0)}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: 6,
                        backgroundColor: alpha(availabilityColor, 0.2),
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${Math.min(day.data.porcentajeOcupacion, 100)}%`,
                          height: '100%',
                          backgroundColor: availabilityColor,
                          borderRadius: 3,
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Sessions Info */}
                  <Box display="flex" justifyContent="space-between">
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        color: alpha(ceoBrandColors.text, 0.7),
                      }}
                    >
                      {day.data.sesionesProgramadas}/{day.data.capacidadMaxima} sesiones
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        color: alpha(ceoBrandColors.text, 0.7),
                      }}
                    >
                      {day.data.consultoriosDisponibles} consultorios
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* AI Alert */}
        {weekSummary.promedioOcupacion > 85 && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              background: alpha('#FF9800', 0.1),
              border: `1px solid ${alpha('#FF9800', 0.2)}`,
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Warning sx={{ fontSize: 16, color: '#FF9800' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600,
                  color: '#FF9800',
                }}
              >
                Alerta de Capacidad
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                color: ceoBrandColors.text,
                fontSize: '0.8rem',
              }}
            >
              Ocupación sostenida > 85%. Sugerencia IA: Considerar contratar terapeuta adicional o ampliar horarios.
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
