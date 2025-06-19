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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { TimeSeriesData } from '@/types/metrics';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface SessionsLineChartProps {
  data: TimeSeriesData[];
  title: string;
  loading?: boolean;
  height?: number;
  showArea?: boolean;
  color?: string;
}

export default function SessionsLineChart({ 
  data, 
  title, 
  loading = false, 
  height = 300,
  showArea = false,
  color = '#1976d2'
}: SessionsLineChartProps) {
  const theme = useTheme();

  // Preparar datos para el gráfico
  const chartData = React.useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedDate: format(parseISO(item.date), 'dd/MM', { locale: es }),
      fullDate: format(parseISO(item.date), 'dd \'de\' MMMM', { locale: es })
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload}: { active?: boolean; payload?: Array<{ payload: { fullDate: string; value: number } }> }) => {
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
            {data.fullDate}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sesiones: {data.value}
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
              No hay sesiones registradas para el período seleccionado
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Calcular estadísticas
  const totalSessions = chartData.reduce((sum, item) => sum + item.value, 0);
  const averageSessions = totalSessions / chartData.length;
  const maxSessions = Math.max(...chartData.map(item => item.value));
  const minSessions = Math.min(...chartData.map(item => item.value));

  return (
    <Card sx={{ height: height + 100 }}>
      <CardHeader 
        title={title}
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {showArea ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                dataKey="formattedDate" 
                stroke={theme.palette.text.secondary}
                fontSize={12}
              />
              <YAxis 
                stroke={theme.palette.text.secondary}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={color}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                dataKey="formattedDate" 
                stroke={theme.palette.text.secondary}
                fontSize={12}
              />
              <YAxis 
                stroke={theme.palette.text.secondary}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>

        {/* Estadísticas del período */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {totalSessions}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {averageSessions.toFixed(1)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Promedio
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {maxSessions}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Máximo
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {minSessions}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Mínimo
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
