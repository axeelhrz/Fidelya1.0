'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  useTheme,
  Skeleton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  alpha,
  Paper
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Mood,
  MoodBad,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVeryDissatisfied,
  SentimentVerySatisfied,
  Psychology,
} from '@mui/icons-material';
import { EMOTIONAL_STATE_COLORS } from '@/types/patient';
import { EMOTIONAL_TONE_COLORS } from '@/types/session';
import { CHART_COLORS } from '@/types/metrics';

interface EmotionPieChartProps {
  data: Record<string, number>;
  title: string;
  loading?: boolean;
  height?: number;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
  }>;
}

export default function EmotionPieChart({ 
  data, 
  title, 
  loading = false, 
  height = 400 
}: EmotionPieChartProps) {
  const theme = useTheme();

  // Mapeo de emociones a iconos
  const getEmotionIcon = (emotion: string) => {
    const emotionLower = emotion.toLowerCase();
    if (emotionLower.includes('alegr') || emotionLower.includes('feliz') || emotionLower.includes('positiv')) {
      return <SentimentVerySatisfied sx={{ fontSize: 20, color: theme.palette.success.main }} />;
    }
    if (emotionLower.includes('calm') || emotionLower.includes('tranquil') || emotionLower.includes('paz')) {
      return <SentimentSatisfied sx={{ fontSize: 20, color: theme.palette.info.main }} />;
    }
    if (emotionLower.includes('ansi') || emotionLower.includes('estrés') || emotionLower.includes('nervios')) {
      return <MoodBad sx={{ fontSize: 20, color: theme.palette.warning.main }} />;
    }
    if (emotionLower.includes('trist') || emotionLower.includes('depres') || emotionLower.includes('melanc')) {
      return <SentimentVeryDissatisfied sx={{ fontSize: 20, color: theme.palette.error.main }} />;
    }
    if (emotionLower.includes('neutr') || emotionLower.includes('estable')) {
      return <SentimentNeutral sx={{ fontSize: 20, color: theme.palette.text.secondary }} />;
    }
    return <Mood sx={{ fontSize: 20, color: theme.palette.primary.main }} />;
  };

  // Preparar datos para el gráfico
  const chartData: ChartData[] = React.useMemo(() => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    return Object.entries(data)
      .filter(([, value]) => value > 0)
      .map(([emotion, value], index) => ({
        name: emotion,
        value,
        color: EMOTIONAL_STATE_COLORS[emotion as keyof typeof EMOTIONAL_STATE_COLORS] || 
               EMOTIONAL_TONE_COLORS[emotion as keyof typeof EMOTIONAL_TONE_COLORS] ||
               CHART_COLORS.emotions[index % CHART_COLORS.emotions.length],
        percentage: total > 0 ? (value / total) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Limitar a 8 emociones principales
  }, [data]);

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: theme.shadows[8],
            minWidth: 200,
            border: `1px solid ${alpha(data.color, 0.2)}`
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: data.color }}>
            {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registros: {data.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Porcentaje: {data.percentage.toFixed(1)}%
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card sx={{ height: height + 100, borderRadius: 4 }}>
        <CardHeader title={title} />
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              height: height - 50
            }}
          >
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Skeleton variant="circular" width={200} height={200} />
            </Box>
            <Box sx={{ flex: 1 }}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="rectangular" width={40} height={20} sx={{ ml: 'auto', borderRadius: 1 }} />
                </Box>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card sx={{ height: height + 100, borderRadius: 4 }}>
        <CardHeader 
          title={title}
          titleTypographyProps={{ variant: 'h6', fontWeight: 'bold', fontFamily: '"Inter", sans-serif' }}
        />
        <CardContent>
          <Box 
            sx={{ 
              height: height - 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 3
            }}
          >
            <Psychology sx={{ fontSize: 80, color: 'text.secondary' }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontFamily: '"Inter", sans-serif' }}>
              Sin datos emocionales
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 300 }}>
              Los estados emocionales aparecerán aquí cuando se registren sesiones con análisis de IA
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const totalRecords = chartData.reduce((sum, item) => sum + item.value, 0);
  const mostFrequent = chartData[0];

  return (
    <Card sx={{ height: height + 100, borderRadius: 4 }}>
      <CardHeader 
        title={title}
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold', fontFamily: '"Inter", sans-serif' }}
      />
      <CardContent sx={{ height: height + 50 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            height: '100%'
          }}
        >
          {/* Gráfico circular */}
          <Box sx={{ flex: 1, minHeight: 250, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Centro del gráfico con estadística principal */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {chartData.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Estados únicos
              </Typography>
            </Box>
          </Box>

          {/* Lista detallada */}
          <Box sx={{ flex: 1, minHeight: 250 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3, fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
              Distribución Detallada
            </Typography>
            <List sx={{ p: 0, maxHeight: 220, overflow: 'auto' }}>
              {chartData.map((item) => (
                <ListItem 
                  key={item.name}
                  sx={{ 
                    px: 0, 
                    py: 1.5,
                    borderRadius: 3,
                    mb: 1,
                    background: alpha(item.color, 0.05),
                    border: `1px solid ${alpha(item.color, 0.1)}`,
                    '&:hover': {
                      backgroundColor: alpha(item.color, 0.1),
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getEmotionIcon(item.name)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem', fontFamily: '"Inter", sans-serif' }}>
                        {item.name.length > 18 ? `${item.name.substring(0, 18)}...` : item.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {item.value} registros
                      </Typography>
                    }
                  />
                  <Chip
                    label={`${item.percentage.toFixed(1)}%`}
                    size="small"
                    sx={{
                      backgroundColor: alpha(item.color, 0.15),
                      color: item.color,
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      minWidth: 55,
                      borderRadius: 2
                    }}
                  />
                </ListItem>
              ))}
            </List>

            {/* Estadísticas resumidas */}
            <Paper 
              sx={{ 
                mt: 3, 
                p: 2.5, 
                borderRadius: 3,
                background: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                    {totalRecords}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total registros
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                    {mostFrequent?.percentage.toFixed(0)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Más frecuente
                  </Typography>
                </Box>
              </Box>
              
              {mostFrequent && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                    Estado predominante: {mostFrequent.name}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}