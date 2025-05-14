import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme, alpha } from '@mui/material/styles';
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
  isMobile?: boolean;
}

// Iconos asociados a tipos
const typeIcons: { [key: string]: React.ReactNode } = {
  'Salud': <HeartPulse size={16} />,
  'Vida': <Briefcase size={16} />,
  'Auto': <Car size={16} />,
  'Hogar': <Home size={16} />,
  'Empresa': <Building size={16} />,
};

// Exportar como componente por defecto para lazy loading
const PolicyTypePieChart: React.FC<PolicyTypePieChartProps> = ({ data, loading, isMobile = false }) => {
  const theme = useTheme();
  
  // Memoizar cálculos para evitar recálculos innecesarios
  const totalValue = React.useMemo(() => 
    data.reduce((sum, entry) => sum + entry.value, 0), 
    [data]
  );

  // Añadir porcentaje a los datos para el tooltip - Memoizado
  const dataWithPercentage = React.useMemo(() => 
    data.map(entry => ({
      ...entry,
      percentage: totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(1) : 0,
    })), 
    [data, totalValue]
  );

  // Custom Tooltip - Optimizado para móvil
  const CustomTooltip = React.useCallback(({ 
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
              fontFamily: 'Inter, sans-serif',
              fontSize: isMobile ? '0.75rem' : '0.875rem'
            }}
          >
            {entry.name}
          </Typography>
          <Typography 
            sx={{ 
              mt: 0.5, 
              color: theme.palette.text.secondary,
              fontFamily: 'Inter, sans-serif',
              fontSize: isMobile ? '0.7rem' : '0.75rem'
            }}
          >
            Cantidad: {entry.value} ({entry.percentage}%)
          </Typography>
        </Box>
      );
    }
    return null;
  }, [theme, isMobile]);

  // Custom Legend - Optimizado para móvil
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
        {payload.map((entry, index) => (
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
                color: theme.palette.text.primary,
              }
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
  }, [theme, isMobile]);

  return (
    <ChartWrapper 
      title="Distribución por Tipo" 
      loading={loading}
      height={isMobile ? 250 : 350}
      isMobile={isMobile}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={isMobile ? { top: 0, right: 0, bottom: 0, left: 0 } : undefined}>
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
            // Reducir animación en móvil para mejorar rendimiento
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

export { PolicyTypePieChart };
export default PolicyTypePieChart;