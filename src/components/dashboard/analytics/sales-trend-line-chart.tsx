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
  
  // Colores para las líneas
  const newColor = theme.palette.primary.main;
  const renewalsColor = theme.palette.success.main;
  const totalColor = theme.palette.info.main;
  
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
            p: 1.5,
            borderRadius: '8px',
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography 
            sx={{ 
              m: 0, 
              fontWeight: 600, 
              color: theme.palette.text.primary,
              fontFamily: 'Sora, sans-serif',
              fontSize: '0.875rem'
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
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box 
                component="span" 
                sx={{ 
                  display: 'inline-block', 
                  width: 8, 
                  height: 8, 
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
  
  // Custom Legend
  const renderLegend = (props: LegendProps) => {
    const { payload } = props;
    if (!payload) return null;
    return (
      <Box 
        component={motion.ul}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        sx={{ 
          listStyle: 'none', 
          p: 0, 
          m: '10px 0 0', 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: '15px' 
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
              fontSize: '0.75rem', 
              fontFamily: 'Inter, sans-serif', 
              color: theme.palette.text.secondary,
              '&:hover': {
                color: entry.color,
              }
            }}
          >
            <Box 
              sx={{ 
                width: 10, 
                height: 10, 
                backgroundColor: entry.color, 
                mr: 0.75, 
                borderRadius: '50%', 
                display: 'inline-block' 
              }}
            />
            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500
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
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={alpha(theme.palette.divider, 0.2)} 
            vertical={false} 
          />
          <XAxis 
            dataKey="month" 
            tick={{ fill: theme.palette.text.secondary, fontFamily: 'Inter, sans-serif' }}
            axisLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: theme.palette.text.secondary, fontFamily: 'Inter, sans-serif' }}
            axisLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
          <Legend content={(props) => renderLegend(props as LegendProps)} />
          {/* Área para nuevas pólizas */}
          <Area 
            type="monotone" 
            dataKey="new" 
            name="Nuevas" 
            fill={alpha(newColor, 0.2)} 
            stroke={newColor} 
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          
          {/* Línea para renovaciones */}
          <Line 
            type="monotone" 
            dataKey="renewals" 
            name="Renovaciones" 
            stroke={renewalsColor} 
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          
          {/* Línea para total */}
          <Line 
            type="monotone" 
            dataKey="total" 
            name="Total" 
            stroke={totalColor} 
            strokeDasharray="5 5"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};