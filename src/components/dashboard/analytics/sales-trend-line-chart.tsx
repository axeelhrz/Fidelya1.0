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
import { useTheme, alpha } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ChartWrapper } from '@/components/dashboard/analytics/chart-wrapper';
import { createOptimizedChartStyle } from '@/styles/theme/themeAnalytics';

interface MonthlyTrendData {
  month: string;
  new: number;
  renewals: number;
  total: number;
}

interface SalesTrendLineChartProps {
  data: MonthlyTrendData[];
  loading?: boolean;
  isMobile?: boolean;
}

// Exportar como componente por defecto para lazy loading
const SalesTrendLineChart: React.FC<SalesTrendLineChartProps> = ({ data, loading, isMobile = false }) => {
  const theme = useTheme();
  // Colores para las líneas
  const newColor = theme.palette.primary.main;
  const renewalsColor = theme.palette.success.main;
  const totalColor = theme.palette.info.main;
  
  // Optimización: Reducir datos en móvil si hay muchos puntos
  const optimizedData = React.useMemo(() => {
    if (isMobile && data.length > 6) {
      // En móvil, mostrar solo los últimos 6 meses si hay muchos datos
      return data.slice(-6);
    }
    return data;
  }, [data, isMobile]);

  // Custom Tooltip - Memoizado
  const CustomTooltip = React.useCallback(({ 
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
            boxShadow: isMobile ? theme.shadows[1] : theme.shadows[3],
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
                fontSize: isMobile ? '0.7rem' : '0.75rem',
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
  }, [theme, isMobile]);
  
  // Custom Legend - Memoizado
  const renderLegend = React.useCallback((props: LegendProps) => {
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
          m: isMobile ? '5px 0 0' : '10px 0 0', 
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
              cursor: 'pointer', 
              fontSize: isMobile ? '0.65rem' : '0.75rem', 
              fontFamily: 'Inter, sans-serif', 
              color: theme.palette.text.secondary,
              '&:hover': {
                color: entry.color,
              }
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
  }, [theme, isMobile]);
  return (
    <ChartWrapper 
      title="Tendencia de Ventas" 
      loading={loading}
      height={isMobile ? 250 : 350}
      isMobile={isMobile}
        >
      <Box sx={createOptimizedChartStyle(theme, isMobile)}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={optimizedData}
            margin={{
              top: 5,
              right: isMobile ? 5 : 30,
              left: isMobile ? 5 : 20,
              bottom: 5,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={alpha(theme.palette.divider, isMobile ? 0.1 : 0.2)} 
              vertical={!isMobile} // Eliminar líneas verticales en móvil
            />
            <XAxis 
              dataKey="month" 
              tick={{ 
                fill: theme.palette.text.secondary, 
              fontFamily: 'Inter, sans-serif',
                fontSize: isMobile ? '0.65rem' : undefined
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
                fontSize: isMobile ? '0.65rem' : undefined
              }}
              axisLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
              tickLine={false}
              // Reducir número de ticks en móvil
              interval={isMobile ? 1 : 0}
              // Ocultar algunos ticks en móvil
              tickCount={isMobile ? 3 : 5}
          />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={(props) => renderLegend(props as LegendProps)} />
          
            {/* En móvil, simplificar el gráfico mostrando solo las líneas más importantes */}
          {!isMobile && (
              <Area 
                type="monotone" 
                dataKey="new" 
                name="Nuevas" 
                fill={alpha(newColor, 0.2)} 
                stroke={newColor} 
                activeDot={{ r: isMobile ? 6 : 8 }}
                strokeWidth={isMobile ? 1.5 : 2}
            />
          )}
            
            <Line 
              type="monotone" 
              dataKey="renewals" 
              name="Renovaciones" 
              stroke={renewalsColor} 
              activeDot={{ r: isMobile ? 6 : 8 }}
              strokeWidth={isMobile ? 1.5 : 2}
              // Simplificar curva en móvil
              connectNulls={true}
            />
            
            <Line 
              type="monotone" 
              dataKey="total" 
              name="Total" 
              stroke={totalColor} 
              strokeDasharray={isMobile ? "3 3" : "5 5"}
              strokeWidth={isMobile ? 1.5 : 2}
              // Simplificar curva en móvil
              connectNulls={true}
            />
        </ComposedChart>
      </ResponsiveContainer>
      </Box>
    </ChartWrapper>
  );
};

export { SalesTrendLineChart };
export default SalesTrendLineChart;