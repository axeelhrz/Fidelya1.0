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
  Stack,
  Chip,
  alpha
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import {
  Warning,
  CheckCircle,
  ErrorOutline
} from '@mui/icons-material';

interface AlertStatusDonutProps {
  activeAlerts: number;
  resolvedAlerts: number;
  title: string;
  loading?: boolean;
  height?: number;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
  }>;
}

export default function AlertStatusDonut({ 
  activeAlerts, 
  resolvedAlerts, 
  title, 
  loading = false, 
  height = 350 
}: AlertStatusDonutProps) {
  const theme = useTheme();

  // Preparar datos para el gráfico
  const chartData: ChartData[] = React.useMemo(() => {
    const data = [];
    
    if (activeAlerts > 0) {
      data.push({
        name: 'Alertas Activas',
        value: activeAlerts,
        color: theme.palette.warning.main,
        icon: <Warning sx={{ fontSize: 20 }} />
      });
    }
    
    if (resolvedAlerts > 0) {
      data.push({
        name: 'Alertas Resueltas',
        value: resolvedAlerts,
        color: theme.palette.success.main,
        icon: <CheckCircle sx={{ fontSize: 20 }} />
      });
    }

    return data;
  }, [activeAlerts, resolvedAlerts, theme]);

  const totalAlerts = activeAlerts + resolvedAlerts;
  const resolutionRate = totalAlerts > 0 ? (resolvedAlerts / totalAlerts) * 100 : 0;

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = totalAlerts > 0 ? (data.value / totalAlerts) * 100 : 0;
      
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
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Box sx={{ color: data.color }}>
              {data.icon}
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {data.name}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Cantidad: {data.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Porcentaje: {percentage.toFixed(1)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card sx={{ height: height + 150, borderRadius: 4 }}>
        <CardHeader title={title} />
        <CardContent>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              {[1, 2, 3].map((item) => (
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

  if (totalAlerts === 0) {
    return (
      <Card sx={{ height: height + 150, borderRadius: 4 }}>
        <CardHeader 
          title={title}
          titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        />
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
            <CheckCircle sx={{ fontSize: 64, color: 'success.main' }} />
            <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
              Sin alertas registradas
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No hay alertas clínicas para el período seleccionado
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: height + 150, borderRadius: 4 }}>
      <CardHeader 
        title={title}
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
      />
      <CardContent>
        <Box sx={{ display: 'flex', gap: 3, height: height }}>
          {/* Gráfico donut */}
          <Box sx={{ flex: 1, minWidth: 250, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Centro del donut con estadísticas */}
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
                {totalAlerts}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total alertas
              </Typography>
            </Box>
          </Box>

          {/* Detalles y estadísticas */}
          <Box sx={{ flex: 1, minWidth: 250 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3, fontWeight: 600 }}>
              Resumen de Estado
            </Typography>
            
            <Stack spacing={2}>
              {chartData.map((item) => (
                <Box 
                  key={item.name}
                  sx={{ 
                    p: 2,
                    borderRadius: 3,
                    background: alpha(item.color, 0.1),
                    border: `1px solid ${alpha(item.color, 0.2)}`,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ color: item.color }}>
                      {item.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.value} alertas
                      </Typography>
                    </Box>
                    <Chip
                      label={`${((item.value / totalAlerts) * 100).toFixed(1)}%`}
                      size="small"
                      sx={{
                        backgroundColor: alpha(item.color, 0.2),
                        color: item.color,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>

            {/* Métricas adicionales */}
            <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                Tasa de Resolución
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: resolutionRate >= 70 
                      ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`
                      : resolutionRate >= 50
                      ? `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`
                      : `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  {resolutionRate >= 70 ? <CheckCircle sx={{ fontSize: 20 }} /> : <ErrorOutline sx={{ fontSize: 20 }} />}
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {resolutionRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Alertas resueltas
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
