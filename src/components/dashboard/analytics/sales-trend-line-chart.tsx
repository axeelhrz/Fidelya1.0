import React from 'react';
import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer, 
  Area, 
  ComposedChart 
} from 'recharts';
import { Props as LegendProps } from 'recharts/types/component/DefaultLegendContent';
import { useTheme, alpha, useMediaQuery } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ChartWrapper } from '@/components/dashboard/analytics/chart-wrapper';

interface MonthlyTrendData {
  month: string;
  new: number;
  renewals: number;
  total: number;
}

interface SalesTrendLineChartProps {
  data: MonthlyTrendData[];
  loading?: boolean;
}

export const SalesTrendLineChart: React.FC<SalesTrendLineChartProps> = ({ data, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Colores para las líneas
  const newColor = theme.palette.primary.main;
  const renewalsColor = theme.palette.success.main;
  const totalColor = theme.palette.info.main;
  
  // Optimizar datos para móvil si hay demasiados puntos
  const optimizedData = isMobile && data.length > 6 
    ? data.filter((_, index) => index % 2 === 0) // Mostrar solo cada segundo punto en móvil
    : data;

  // Abreviar nombres de meses en móvil
  const processedData = isMobile 
    ? optimizedData.map(item => ({
        ...item,
        month: item.month.substring(0, 3) // Usar solo las primeras 3 letras del mes
      }))
    : optimizedData;
  
  // Custom Tooltip
  const CustomTooltip = ({ 
    active, 
    payload, 
    label 
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: alpha(theme.palette.background.paper, 0.9),
            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            p: isMobile ? 1 : 1.5,
            borderRadius: '8px',
            boxShadow: isMobile ? 'none' : theme.shadows[3],
            maxWidth: isMobile ? '150px' : 'auto',
          }}
        >
          <Typography 
            sx={{ 
              m: 0, 
              fontWeight: 600, 
              color: theme.palette.text.primary,
              fontFamily: 'Sora, sans-serif',
              fontSize: isMobile ? '0.75rem' : '0.875rem'
            }}
          >
            {label}
          </Typography>
          {payload.map((entry: { name: string; value: number; color: string }, index: number) => (
            <Typography 
              key={`tooltip-${index}`}
              sx={{ 
                mt: 0.5, 
                color: entry.color,
                fontFamily: 'Inter, sans-serif',
                fontSize: isMobile ? '0.65rem' : '0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box 
                component="span" 
                sx={{ 
                  display: 'inline-block', 
                  width: isMobile ? 6 : 8, 
                  height: isMobile ? 6 : 8, 
                  borderRadius: '50%', 
                  backgroundColor: entry.color, 
                  mr: 1 
                }} 
              />
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };
  
  // Custom Legend - simplificado para móvil
  const renderLegend = (props: LegendProps) => {
    const { payload } = props;
    if (!payload) return null;
    return (
      <Box 
        component={motion.ul}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: isMobile ? 0.2 : 0.5, duration: isMobile ? 0.3 : 0.5 }}
        sx={{ 
          listStyle: 'none', 
          p: 0, 
          m: '10px 0 0', 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: isMobile ? '8px' : '15px' 
        }}
      >
        {payload.map((entry: { color?: string; value?: string }, index: number) => (
          <Box 
            component="li" 
            key={`item-${index}`} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: isMobile ? '0.65rem' : '0.75rem', 
              fontFamily: 'Inter, sans-serif', 
              color: theme.palette.text.secondary,
            }}
          >
            <Box 
              sx={{ 
                width: isMobile ? 8 : 10, 
                height: isMobile ? 8 : 10, 
                backgroundColor: entry.color, 
                mr: 0.5, 
                borderRadius: '50%', 
                display: 'inline-block' 
              }}
            />
            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: isMobile ? '0.65rem' : '0.75rem'
              }}
            >
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <ChartWrapper title="Tendencia de Ventas Mensual" loading={loading}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={processedData}
          margin={{
            top: 5,
            right: isMobile ? 10 : 30,
            left: isMobile ? 0 : 20,
            bottom: 5,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={alpha(theme.palette.divider, 0.2)} 
            vertical={false} 
            // Reducir densidad de líneas en móvil
            horizontalPoints={isMobile ? [40, 80, 120] : undefined}
          />
          <XAxis 
            dataKey="month" 
            tick={{ 
              fill: theme.palette.text.secondary, 
              fontFamily: 'Inter, sans-serif',
              fontSize: isMobile ? 10 : 12
            }}
            axisLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
            tickLine={false}
            // Reducir número de ticks en móvil
            interval={isMobile ? 1 : 0}
          />
          <YAxis 
            tick={{ 
              fill: theme.palette.text.secondary, 
              fontFamily: 'Inter, sans-serif',
              fontSize: isMobile ? 10 : 12
            }}
            axisLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
            tickLine={false}
            // Reducir número de ticks en móvil
            tickCount={isMobile ? 3 : 5}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={(props) => renderLegend(props as LegendProps)} />
          
          {/* Área para nuevas pólizas */}
          <Area 
            type="monotone" 
            dataKey="new" 
            name="Nuevas" 
            fill={alpha(newColor, 0.2)} 
            stroke={newColor} 
            activeDot={{ r: isMobile ? 4 : 8 }}
            strokeWidth={isMobile ? 1 : 2}
          />
          
          {/* Línea para renovaciones */}
          <Line 
            type="monotone" 
            dataKey="renewals" 
            name="Renovaciones" 
            stroke={renewalsColor} 
            activeDot={{ r: isMobile ? 4 : 8 }}
            strokeWidth={isMobile ? 1 : 2}
            // Reducir puntos en móvil
            dot={isMobile ? false : { r: 3 }}
          />
          
          {/* Línea para total - ocultar en móvil para simplificar */}
          {!isMobile && (
            <Line 
              type="monotone" 
              dataKey="total" 
              name="Total" 
              stroke={totalColor} 
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};