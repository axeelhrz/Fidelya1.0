'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { EMOTIONAL_STATE_COLORS, EMOTIONAL_TONE_COLORS } from '@/types/patient';
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

export default function EmotionPieChart({ 
  data, 
  title, 
  loading = false, 
  height = 300 
}: EmotionPieChartProps) {
  const theme = useTheme();

  // Preparar datos para el gráfico
  const chartData: ChartData[] = React.useMemo(() => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    
    return Object.entries(data)
      .filter(([_, value]) => value > 0)
      .map(([emotion, value]) => ({
        name: emotion,
        value,
        color: EMOTIONAL_STATE_COLORS[emotion as keyof typeof EMOTIONAL_STATE_COLORS] || 
               EMOTIONAL_TONE_COLORS[emotion as keyof typeof EMOTIONAL_TONE_COLORS] ||
               CHART_COLORS.emotions[Object.keys(data).indexOf(emotion) % CHART_COLORS.emotions.length],
        percentage: total > 0 ? (value / total) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: theme.shadows[4]
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cantidad: {data.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Porcentaje: {data.percentage.toFixed(1)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2 }}>
      {payload?.map((entry: any, index: number) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            bgcolor: 'grey.50'
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: entry.color
            }}
          />
          <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
            {entry.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  if (loading) {
    return (
      <Card sx={{ height: height + 100 }}>
        <CardHeader title={title} />
        <CardContent>
          <Box 
            sx={{ 
              height: height,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                bgcolor: 'grey.300',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card sx={{ height: height + 100 }}>
        <CardHeader title={title} />
        <CardContent>
          <Box 
            sx={{ 
              height: height,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Sin datos disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No hay información emocional registrada para el período seleccionado
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: height + 100 }}>
      <CardHeader 
        title={title}
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
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
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Estadísticas adicionales */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {chartData.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Estados únicos
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {chartData.reduce((sum, item) => sum + item.value, 0)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total registros
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {chartData[0]?.name || 'N/A'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Más frecuente
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
