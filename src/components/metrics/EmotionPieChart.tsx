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
  Stack
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import {
  Mood,
  MoodBad,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVeryDissatisfied,
  SentimentVerySatisfied,
  Psychology,
  Circle
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
      return <SentimentVerySatisfied sx={{ fontSize: 18 }} />;
    }
    if (emotionLower.includes('calm') || emotionLower.includes('tranquil') || emotionLower.includes('paz')) {
      return <SentimentSatisfied sx={{ fontSize: 18 }} />;
    }
    if (emotionLower.includes('ansi') || emotionLower.includes('estrés') || emotionLower.includes('nervios')) {
      return <MoodBad sx={{ fontSize: 18 }} />;
    }
    if (emotionLower.includes('trist') || emotionLower.includes('depres') || emotionLower.includes('melanc')) {
      return <SentimentVeryDissatisfied sx={{ fontSize: 18 }} />;
    }
    if (emotionLower.includes('neutr') || emotionLower.includes('estable')) {
      return <SentimentNeutral sx={{ fontSize: 18 }} />;
    }
    return <Mood sx={{ fontSize: 18 }} />;
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
      .slice(0, 6); // Limitar a 6 emociones principales
  }, [data]);

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            boxShadow: theme.shadows[8],
            minWidth: 200
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registros: {data.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Porcentaje: {data.percentage.toFixed(1)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card sx={{ height: height + 100, borderRadius: 3 }}>
        <CardHeader title={title} />
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ height: height - 50 }}>
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
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card sx={{ height: height + 100, borderRadius: 3 }}>
        <CardHeader 
          title={title}
          titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        />
        <CardContent>
          <Box 
            sx={{ 
              height: height - 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Psychology sx={{ fontSize: 64, color: 'text.secondary' }} />
            <Typography variant="h6" color="text.secondary">
              Sin datos emocionales
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Los estados emocionales aparecerán aquí cuando se registren sesiones
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const totalRecords = chartData.reduce((sum, item) => sum + item.value, 0);
  const mostFrequent = chartData[0];

  return (
    <Card sx={{ height: height + 100, borderRadius: 3 }}>
      <CardHeader 
        title={title}
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
      />
      <CardContent sx={{ height: height + 50 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ height: '100%' }}>
          {/* Gráfico circular */}
          <Box sx={{ flex: 1, minHeight: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Lista detallada */}
          <Box sx={{ flex: 1, minHeight: 250 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
              Distribución Detallada
            </Typography>
            <List sx={{ p: 0, maxHeight: 200, overflow: 'auto' }}>
              {chartData.map((item, index) => (
                <ListItem 
                  key={item.name}
                  sx={{ 
                    px: 0, 
                    py: 1,
                    borderRadius: 2,
                    mb: 0.5,
                    '&:hover': {
                      backgroundColor: alpha(item.color, 0.05),
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Box sx={{ color: item.color }}>
                      {getEmotionIcon(item.name)}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                        {item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name}
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
                      backgroundColor: alpha(item.color, 0.1),
                      color: item.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      minWidth: 50,
                    }}
                  />
                </ListItem>
              ))}
            </List>

            {/* Estadísticas resumidas */}
            <Box 
              sx={{ 
                mt: 2, 
                pt: 2, 
                borderTop: `1px solid ${theme.palette.divider}`,
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
                textAlign: 'center'
              }}
            >
              <Box>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                  {chartData.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Estados únicos
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                  {totalRecords}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total registros
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}