import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTheme, alpha } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ChartWrapper } from '@/components/dashboard/analytics/chart-wrapper';
import { Smile, Meh, Frown } from 'lucide-react';

interface ClientSatisfactionGaugeProps {
  value: number; // 0-100
  loading?: boolean;
}

export const ClientSatisfactionGauge: React.FC<ClientSatisfactionGaugeProps> = ({ value, loading }) => {
  const theme = useTheme();
  const [animatedValue, setAnimatedValue] = useState(0);
  
  // Colores para el gauge
  const getColor = (value: number) => {
    if (value >= 80) return theme.palette.success.main;
    if (value >= 60) return theme.palette.info.main;
    if (value >= 40) return theme.palette.warning.main;
    return theme.palette.error.main;
  };
  
  const color = getColor(value);
  
  // Datos para el gauge
  const data = [
    { name: 'Satisfacción', value: animatedValue },
    { name: 'Resto', value: 100 - animatedValue }
  ];
  
  // Icono según el valor
  const getIcon = (value: number) => {
    if (value >= 80) return <Smile size={32} color={color} />;
    if (value >= 40) return <Meh size={32} color={color} />;
    return <Frown size={32} color={color} />;
  };
  
  // Animación del valor
  useEffect(() => {
    if (loading) return;
    
    const timer = setTimeout(() => {
      if (animatedValue < value) {
        setAnimatedValue(Math.min(animatedValue + 1, value));
      }
    }, 20);
    
    return () => clearTimeout(timer);
  }, [animatedValue, value, loading]);

  return (
    <ChartWrapper title="Satisfacción de Clientes" loading={loading}>
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius="70%"
              outerRadius="90%"
              paddingAngle={0}
              dataKey="value"
              cornerRadius={5}
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill={alpha(theme.palette.divider, 0.2)} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {getIcon(value)}
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Typography 
              variant="h3" 
              component="div" 
              sx={{ 
                fontFamily: 'Sora, sans-serif', 
                fontWeight: 700, 
                color: color,
                mt: 1
              }}
            >
              {animatedValue}%
            </Typography>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: 'Inter, sans-serif',
                color: theme.palette.text.secondary,
                mt: 0.5
              }}
            >
              Índice de Satisfacción
            </Typography>
          </motion.div>
        </Box>
      </Box>
    </ChartWrapper>
  );
};