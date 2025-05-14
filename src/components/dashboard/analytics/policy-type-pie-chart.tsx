import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme, alpha, useMediaQuery } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ChartWrapper } from '@/components/dashboard/analytics/chart-wrapper';
import { Home, Car, HeartPulse, Building, Briefcase } from 'lucide-react';
import { Props as LegendProps } from 'recharts/types/component/DefaultLegendContent';

interface PolicyTypeData {
  name: string;
  value: number;
  color?: string;
}

interface PolicyTypePieChartProps {
  data: PolicyTypeData[];
  loading?: boolean;
}

// Iconos asociados a tipos
const typeIcons: { [key: string]: React.ReactNode } = {
  'Salud': <HeartPulse size={16} />,
  'Vida': <Briefcase size={16} />,
  'Auto': <Car size={16} />,
  'Hogar': <Home size={16} />,
  'Empresa': <Building size={16} />,
};

export const PolicyTypePieChart: React.FC<PolicyTypePieChartProps> = ({ data, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);

  // Simplificar datos para móvil si hay demasiados elementos
  const optimizedData = isMobile && data.length > 4 
    ? [...data.slice(0, 3), {
        name: 'Otros',
        value: data.slice(3).reduce((sum, entry) => sum + entry.value, 0),
      }]
    : data;

  // Añadir porcentaje a los datos para el tooltip
  const dataWithPercentage = optimizedData.map(entry => ({
    ...entry,
    percentage: totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(1) : 0,
  }));

  // Custom Tooltip
  const CustomTooltip = ({ 
    active, 
    payload 
  }: {
    active?: boolean;
    payload?: Array<{
      payload: {
        name: string;
        value: number;
        percentage: number | string;
      };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      return (
        <Box
          sx={{
            background: alpha(theme.palette.background.paper, 0.9),
            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            p: 1.5,
            borderRadius: '8px',
            boxShadow: isMobile ? 'none' : theme.shadows[3],
          }}
        >
          <Typography 
            sx={{ 
              m: 0, 
              fontWeight: 600, 
              color: theme.palette.text.primary,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem'
            }}
          >
            {entry.name}
          </Typography>
          <Typography 
            sx={{ 
              mt: 0.5, 
              color: theme.palette.text.secondary,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem'
            }}
          >
            Cantidad: {entry.value} ({entry.percentage}%)
          </Typography>
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
        {payload.map((entry, index) => (
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
                backgroundColor: entry.color ?? '#ccc', 
                mr: 0.5, 
                borderRadius: '50%', 
                display: 'inline-block' 
              }}
            />
            {/* Mostrar iconos solo en desktop */}
            {!isMobile && typeIcons[entry.value?.toString()] && (
              <Box sx={{ mr: 0.5 }}>
                {typeIcons[entry.value?.toString()]}
              </Box>
            )}
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
    <ChartWrapper title="Distribución por Tipo de Póliza" loading={loading}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithPercentage}
            cx="50%"
            cy="50%"
            innerRadius={isMobile ? "40%" : "50%"}
            outerRadius={isMobile ? "70%" : "80%"}
            fill="#8884d8"
            paddingAngle={isMobile ? 1 : 2}
            dataKey="value"
            labelLine={false}
            animationBegin={0}
            animationDuration={isMobile ? 800 : 1500}
          >
            {dataWithPercentage.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || `hsl(${index * 45}, 70%, 50%)`} 
                stroke={theme.palette.background.paper}
                strokeWidth={isMobile ? 1 : 2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};