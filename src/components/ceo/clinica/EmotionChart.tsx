'use client';

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

// Sample emotion data
const emotionData = {
  'individual': {
    'Ansiedad': { count: 45, trend: 5.2, color: '#FF9800' },
    'Depresión': { count: 32, trend: -3.1, color: '#F44336' },
    'Estrés': { count: 28, trend: 2.8, color: '#FF5722' },
    'Optimismo': { count: 25, trend: 8.4, color: '#4CAF50' },
    'Tranquilidad': { count: 18, trend: 12.1, color: '#2196F3' },
    'Frustración': { count: 15, trend: -1.5, color: '#9C27B0' },
  },
  'grupal': {
    'Apoyo': { count: 35, trend: 15.2, color: '#4CAF50' },
    'Comprensión': { count: 28, trend: 8.7, color: '#2196F3' },
    'Ansiedad Social': { count: 22, trend: -4.3, color: '#FF9800' },
    'Confianza': { count: 20, trend: 18.5, color: '#00BCD4' },
    'Inseguridad': { count: 12, trend: -7.2, color: '#F44336' },
    'Esperanza': { count: 10, trend: 22.1, color: '#8BC34A' },
  },
  'familiar': {
    'Comunicación': { count: 30, trend: 12.3, color: '#4CAF50' },
    'Conflicto': { count: 25, trend: -8.1, color: '#F44336' },
    'Comprensión': { count: 20, trend: 6.4, color: '#2196F3' },
    'Tensión': { count: 18, trend: -2.7, color: '#FF9800' },
    'Armonía': { count: 15, trend: 15.8, color: '#8BC34A' },
    'Distancia': { count: 8, trend: -12.5, color: '#9C27B0' },
  },
  'online': {
    'Comodidad': { count: 40, trend: 25.3, color: '#4CAF50' },
    'Conexión': { count: 32, trend: 18.7, color: '#2196F3' },
    'Distracción': { count: 28, trend: -5.2, color: '#FF9800' },
    'Privacidad': { count: 25, trend: 12.1, color: '#00BCD4' },
    'Tecnoestrés': { count: 15, trend: -8.9, color: '#F44336' },
    'Flexibilidad': { count: 12, trend: 20.4, color: '#8BC34A' },
  },
};

export default function EmotionChart() {
  const theme = useTheme();
  const [selectedProgram, setSelectedProgram] = useState<keyof typeof emotionData>('individual');

  const currentData = emotionData[selectedProgram];
  const emotions = Object.keys(currentData);
  const counts = Object.values(currentData).map(d => d.count);
  const colors = Object.values(currentData).map(d => d.color);

  // Chart data
  const chartData = {
    labels: emotions,
    datasets: [
      {
        data: counts,
        backgroundColor: colors.map(color => alpha(color, 0.8)),
        borderColor: colors,
        borderWidth: 2,
        hoverBackgroundColor: colors.map(color => alpha(color, 0.9)),
        hoverBorderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: '"Neris", sans-serif',
            size: 11,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const emotion = emotions[context.dataIndex];
            const data = currentData[emotion as keyof typeof currentData];
            return [
              `${emotion}: ${context.parsed}`,
              `Tendencia: ${data.trend > 0 ? '+' : ''}${data.trend.toFixed(1)}%`,
            ];
          },
        },
      },
    },
    cutout: '60%',
  };

  // Calculate totals and trends
  const totalEmotions = counts.reduce((acc, count) => acc + count, 0);
  const positiveEmotions = Object.entries(currentData)
    .filter(([emotion]) => ['Optimismo', 'Tranquilidad', 'Apoyo', 'Comprensión', 'Confianza', 'Esperanza', 'Comunicación', 'Armonía', 'Comodidad', 'Conexión', 'Privacidad', 'Flexibilidad'].includes(emotion))
    .reduce((acc, [, data]) => acc + data.count, 0);
  
  const positivePercentage = (positiveEmotions / totalEmotions) * 100;

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
            <Psychology sx={{ color: ceoBrandColors.secondary, fontSize: 28 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600,
                color: ceoBrandColors.text,
              }}
            >
              Emociones Predominantes
            </Typography>
          </Box>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Programa</InputLabel>
            <Select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value as keyof typeof emotionData)}
              label="Programa"
            >
              <MenuItem value="individual">Individual</MenuItem>
              <MenuItem value="grupal">Grupal</MenuItem>
              <MenuItem value="familiar">Familiar</MenuItem>
              <MenuItem value="online">Online</MenuItem>
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
          Distribución de estados emocionales detectados por IA
        </Typography>

        {/* Summary */}
        <Box display="flex" gap={2}>
          <Chip
            label={`${totalEmotions} Total Detecciones`}
            size="small"
            sx={{
              backgroundColor: alpha(ceoBrandColors.secondary, 0.1),
              color: ceoBrandColors.secondary,
              fontFamily: '"Neris", sans-serif',
              fontWeight: 600,
            }}
          />
          <Chip
            label={`${positivePercentage.toFixed(1)}% Emociones Positivas`}
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

      {/* Chart */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ height: 300, position: 'relative' }}>
          <Doughnut data={chartData} options={chartOptions} />
          
          {/* Center Text */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 700,
                color: ceoBrandColors.primary,
              }}
            >
              {totalEmotions}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                color: alpha(ceoBrandColors.text, 0.7),
              }}
            >
              Detecciones
            </Typography>
          </Box>
        </Box>

        {/* Top Emotions with Trends */}
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
            Tendencias Principales
          </Typography>
          
          <Box display="flex" flexDirection="column" gap={1}>
            {Object.entries(currentData)
              .sort(([,a], [,b]) => b.count - a.count)
              .slice(0, 3)
              .map(([emotion, data]) => (
                <Box
                  key={emotion}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: alpha(data.color, 0.05),
                    border: `1px solid ${alpha(data.color, 0.2)}`,
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: data.color,
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 600,
                          color: ceoBrandColors.text,
                        }}
                      >
                        {emotion}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          color: alpha(ceoBrandColors.text, 0.7),
                        }}
                      >
                        {data.count} detecciones
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={0.5}>
                      {data.trend > 0 ? (
                        <TrendingUp sx={{ fontSize: 16, color: '#4CAF50' }} />
                      ) : (
                        <TrendingDown sx={{ fontSize: 16, color: '#F44336' }} />
                      )}
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 600,
                          color: data.trend > 0 ? '#4CAF50' : '#F44336',
                        }}
                      >
                        {data.trend > 0 ? '+' : ''}{data.trend.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
