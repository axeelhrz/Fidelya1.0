import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  LabelList,
  Cell,
  Tooltip
} from 'recharts';
import { useTheme, alpha } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { ChartWrapper } from '@/components/dashboard/analytics/chart-wrapper';
import { createOptimizedChartStyle } from '@/styles/theme/themeAnalytics';

interface ExpirationData {
  range: string;
  value: number;
  color: string;
}

interface ExpirationAnalysisBarChartProps {
  data: ExpirationData[];
  loading?: boolean;
  isMobile?: boolean;
}

// Exportar como componente por defecto para lazy loading
const ExpirationAnalysisBarChart: React.FC<ExpirationAnalysisBarChartProps> = ({ 
  data, 
  loading, 
  isMobile = false 
}) => {
  const theme = useTheme();
  
  // Optimización: Reducir datos en móvil si hay muchos puntos
  const optimizedData = React.useMemo(() => {
    if (isMobile && data.length > 5) {
      // En móvil, mostrar solo los primeros 5 rangos si hay muchos datos
      return data.slice(0, 5);
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
      value: number;
      color: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
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
          <Typography 
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
            Pólizas: {entry.value}
          </Typography>
        </Box>
      );
    }
    return null;
  }, [theme, isMobile]);
  // Interface for label props
  interface LabelProps {
    x?: string | number;
    y?: string | number;
    width?: string | number;
    value?: string | number;
  }
  
  // Renderizado personalizado para las etiquetas de las barras - Memoizado
  const renderCustomizedLabel = React.useCallback((props: LabelProps) => {
    const { x, y, width, value } = props;
    if (x === undefined || y === undefined || width === undefined || value === undefined) {
      return null;
    }
    
    // En móvil, ocultar etiquetas para valores pequeños
    if (isMobile && Number(value) < 5) {
      return null;
    }
    
    return (
      <g>
        <text 
          x={Number(x) + Number(width) / 2} 
          y={Number(y) - (isMobile ? 5 : 10)} 
          fill={theme.palette.text.primary} 
          textAnchor="middle" 
          dominantBaseline="middle"
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '0.65rem' : '0.75rem',
            fontWeight: 600
          }}
        >
          {value}
        </text>
      </g>
    );
  }, [theme, isMobile]);
  return (
    <ChartWrapper 
      title="Análisis de Vencimientos" 
      loading={loading}
      height={isMobile ? 250 : 350}
      isMobile={isMobile}
        >
      <Box sx={createOptimizedChartStyle(theme, isMobile)}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={optimizedData}
            margin={{
              top: 20,
              right: isMobile ? 5 : 30,
              left: isMobile ? 5 : 20,
              bottom: 5,
            }}
            barSize={isMobile ? 15 : 20}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={alpha(theme.palette.divider, isMobile ? 0.1 : 0.2)} 
              vertical={!isMobile} // Eliminar líneas verticales en móvil
            />
            <XAxis 
              dataKey="range" 
              tick={{ 
                fill: theme.palette.text.secondary, 
              fontFamily: 'Inter, sans-serif',
                fontSize: isMobile ? '0.65rem' : undefined
            }}
            axisLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
            tickLine={false}
              // Reducir texto en móvil
              tickFormatter={isMobile ? (value) => value.substring(0, 3) : undefined}
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
              tickCount={isMobile ? 3 : 5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              name="Pólizas" 
              radius={[isMobile ? 3 : 4, isMobile ? 3 : 4, 0, 0]}
              animationBegin={0}
              animationDuration={isMobile ? 800 : 1500}
            >
              {optimizedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.color || `hsl(${index * 45}, 70%, 50%)`} 
                />
              ))}
              <LabelList dataKey="value" content={renderCustomizedLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </Box>
    </ChartWrapper>
  );
};

export { ExpirationAnalysisBarChart };
export default ExpirationAnalysisBarChart;