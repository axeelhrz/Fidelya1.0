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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { CHART_COLORS } from '@/types/metrics';

interface MotivesBarChartProps {
  data: Record<string, number>;
  title: string;
  loading?: boolean;
  height?: number;
  maxItems?: number;
}

interface ChartData {
  name: string;
  fullName: string;
  value: number;
  percentage: number;
  color: string;
}

export default function MotivesBarChart({ 
  data, 
  title, 
  loading = false, 
  height = 300,
  maxItems = 10
}: MotivesBarChartProps) {
  const theme = useTheme();

  // Preparar datos para el gráfico
  const chartData: ChartData[] = React.useMemo(() => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    
    return Object.entries(data)
      .filter(([, value]) => value > 0)
      .map(([motive, value], index) => ({
        name: motive.length > 20 ? `${motive.substring(0, 20)}...` : motive,
        fullName: motive,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
        color: CHART_COLORS.gradient[index % CHART_COLORS.gradient.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, maxItems);
  }, [data, maxItems]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartData }> }) => {
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
            boxShadow: theme.shadows[4],
            maxWidth: 300
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {data.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pacientes: {data.value}
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
                width: '100%',
                height: '80%',
                bgcolor: 'grey.300',
                borderRadius: 1,
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
              No hay motivos de consulta registrados para el período seleccionado
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Calcular estadísticas
  const totalPatients = chartData.reduce((sum, item) => sum + item.value, 0);
  const mostCommon = chartData[0];
  const averagePerMotive = totalPatients / chartData.length;

  return (
    <Card sx={{ height: height + 100 }}>
      <CardHeader 
        title={title}
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="name" 
              stroke={theme.palette.text.secondary}
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Estadísticas adicionales */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {chartData.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Motivos únicos
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {totalPatients}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total pacientes
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {averagePerMotive.toFixed(1)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Promedio
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {mostCommon?.percentage.toFixed(1)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Más común
            </Typography>
          </Box>
        </Box>

        {/* Mostrar el motivo más común */}
        {mostCommon && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
              Motivo más frecuente:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mostCommon.fullName} ({mostCommon.value} pacientes)
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
