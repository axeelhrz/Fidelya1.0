'use client';

import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
} from 'recharts';
import { BurnEarnData } from '@/types/ceo';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface BurnEarnChartProps {
  data: BurnEarnData[];
  loading?: boolean;
  height?: number;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export default function BurnEarnChart({ 
  data, 
  loading = false, 
  height = 400 
}: BurnEarnChartProps) {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ height }}>
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>
    );
  }

  // Calculate totals and averages
  const totalIngresos = data.reduce((sum, item) => sum + item.ingresos, 0);
  const totalEgresos = data.reduce((sum, item) => sum + item.egresos, 0);
  const netProfit = totalIngresos - totalEgresos;
  const avgDailyIngresos = totalIngresos / data.length;
  const avgDailyEgresos = totalEgresos / data.length;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length && label) {
      const date = parseISO(label);
      return (
        <Box
          sx={{
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 2,
            boxShadow: theme.shadows[4],
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            {format(date, "dd 'de' MMMM", { locale: es })}
          </Typography>
          {payload.map((entry: TooltipPayload, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: entry.color,
                }}
              />
              {entry.name}: ${entry.value.toLocaleString()}
            </Typography>
          ))}
          {payload[0] && payload[1] && (
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ 
                mt: 1, 
                pt: 1, 
                borderTop: `1px solid ${theme.palette.divider}`,
                color: payload[0].value > payload[1].value ? theme.palette.success.main : theme.palette.error.main
              }}
            >
              Neto: ${(payload[0].value - payload[1].value).toLocaleString()}
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      {/* Summary Stats */}
      <Box 
        display="flex" 
        justifyContent="space-around" 
        sx={{ 
          mb: 3,
          p: 2,
          borderRadius: 2,
          background: alpha(theme.palette.background.paper, 0.5),
        }}
      >
        <Box textAlign="center">
          <Typography variant="h6" fontWeight="bold" color="success.main">
            ${totalIngresos.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total Ingresos
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="h6" fontWeight="bold" color="error.main">
            ${totalEgresos.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total Egresos
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            color={netProfit >= 0 ? 'success.main' : 'error.main'}
          >
            ${netProfit.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Beneficio Neto
          </Typography>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={alpha(theme.palette.text.secondary, 0.2)} 
            />
            <XAxis 
              dataKey="fecha"
              stroke={theme.palette.text.secondary}
              fontSize={12}
              tickFormatter={(value) => format(parseISO(value), 'dd/MM')}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference lines for averages */}
            <ReferenceLine 
              y={avgDailyIngresos} 
              stroke={theme.palette.success.main}
              strokeDasharray="5 5"
              label={{ value: "Promedio Ingresos", position: "insideTopRight" }}
            />
            <ReferenceLine 
              y={avgDailyEgresos} 
              stroke={theme.palette.error.main}
              strokeDasharray="5 5"
              label={{ value: "Promedio Egresos", position: "insideBottomRight" }}
            />
            
            {/* Projection area */}
            <Area
              type="monotone"
              dataKey="proyeccionIngresos"
              fill={alpha(theme.palette.success.main, 0.1)}
              stroke="none"
            />
            <Area
              type="monotone"
              dataKey="proyeccionEgresos"
              fill={alpha(theme.palette.error.main, 0.1)}
              stroke="none"
            />
            
            {/* Main lines */}
            <Line 
              type="monotone" 
              dataKey="ingresos" 
              stroke={theme.palette.success.main}
              strokeWidth={3}
              dot={{ fill: theme.palette.success.main, r: 4 }}
              activeDot={{ r: 6, fill: theme.palette.success.main }}
              name="Ingresos"
            />
            <Line 
              type="monotone" 
              dataKey="egresos" 
              stroke={theme.palette.error.main}
              strokeWidth={3}
              dot={{ fill: theme.palette.error.main, r: 4 }}
              activeDot={{ r: 6, fill: theme.palette.error.main }}
              name="Egresos"
            />
            
            {/* Projection lines */}
            <Line 
              type="monotone" 
              dataKey="proyeccionIngresos" 
              stroke={theme.palette.success.main}
              strokeWidth={2}
              strokeDasharray="8 4"
              dot={false}
              name="Proyección Ingresos"
            />
            <Line 
              type="monotone" 
              dataKey="proyeccionEgresos" 
              stroke={theme.palette.error.main}
              strokeWidth={2}
              strokeDasharray="8 4"
              dot={false}
              name="Proyección Egresos"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend */}
      <Box 
        display="flex" 
        justifyContent="center" 
        gap={3} 
        sx={{ 
          mt: 2,
          p: 2,
          borderRadius: 2,
          background: alpha(theme.palette.background.paper, 0.3),
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 16, height: 3, backgroundColor: theme.palette.success.main, borderRadius: 1 }} />
          <Typography variant="caption">Ingresos Reales</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 16, height: 3, backgroundColor: theme.palette.error.main, borderRadius: 1 }} />
          <Typography variant="caption">Egresos Reales</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ 
            width: 16, 
            height: 3, 
            backgroundColor: theme.palette.success.main, 
            borderRadius: 1,
            opacity: 0.5,
            border: `1px dashed ${theme.palette.success.main}`
          }} />
          <Typography variant="caption">Proyección 90 días</Typography>
        </Box>
      </Box>
    </Box>
  );
}
