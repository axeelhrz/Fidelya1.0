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

interface ExpirationData {
  range: string;
  value: number;
  color: string;
}

interface ExpirationAnalysisBarChartProps {
  data: ExpirationData[];
  loading?: boolean;
}

export const ExpirationAnalysisBarChart: React.FC<ExpirationAnalysisBarChartProps> = ({ data, loading }) => {
  const theme = useTheme();
  
  // Custom Tooltip
  const CustomTooltip = ({ 
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
          <Typography 
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
            Pólizas por vencer: {entry.value}
          </Typography>
        </Box>
      );
    }
    return null;
  };
  
  // Interface for label props
  interface LabelProps {
    x?: string | number;
    y?: string | number;
    width?: string | number;
    value?: string | number;
  }
  
  // Renderizado personalizado para las etiquetas de las barras
  const renderCustomizedLabel = (props: LabelProps) => {
    const { x, y, width, value } = props;
    if (x === undefined || y === undefined || width === undefined || value === undefined) {
      return null;
    }
    return (
      <g>
        <text 
          x={Number(x) + Number(width) / 2} 
          y={Number(y) - 10} 
          fill={theme.palette.text.primary} 
          textAnchor="middle" 
          dominantBaseline="middle"
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        >
          {value}
        </text>
      </g>
    );
  };

  return (
    <ChartWrapper title="Análisis de Vencimientos" loading={loading}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
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
            dataKey="range" 
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
          <Bar 
            dataKey="value" 
            name="Pólizas" 
            radius={[4, 4, 0, 0]}
            animationBegin={0}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={entry.color || `hsl(${index * 45}, 70%, 50%)`} 
              />
            ))}
            <LabelList dataKey="value" content={renderCustomizedLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
