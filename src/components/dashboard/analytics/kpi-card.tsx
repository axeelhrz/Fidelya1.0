import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentage, getTrendColor } from '@/lib/formatters';
import { createPremiumCardStyle } from '@/styles/theme/themeAnalytics';

type TrendDirection = 'up' | 'down' | 'neutral';

interface KpiCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: TrendDirection;
  tooltip?: string;
  isCurrency?: boolean;
  isPercentage?: boolean;
  color?: string;
  isMobile?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  hover: { y: -5, scale: 1.03, transition: { duration: 0.2 } }
};

// Variantes optimizadas para móvil
const mobileCardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  // Sin efecto hover en móvil para mejorar rendimiento
};

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  trend = 'neutral',
  tooltip,
  isCurrency = false,
  isPercentage = false,
  color,
  isMobile = false,
}) => {
  const theme = useTheme();
  const defaultColor = color || theme.palette.primary.main;

  // Optimización: Formatear valores solo cuando es necesario
  const formattedValue = React.useMemo(() => {
    if (isCurrency) return formatCurrency(value);
    if (isPercentage) return formatPercentage(value);
    return formatNumber(value);
  }, [value, isCurrency, isPercentage]);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = getTrendColor(trend, theme);

  const cardContent = (
    <Card
      component={motion.div}
      variants={isMobile ? mobileCardVariants : cardVariants}
      whileHover={isMobile ? undefined : "hover"}
      sx={{
        ...createPremiumCardStyle(theme, defaultColor, isMobile),
        minWidth: isMobile ? 'auto' : 200,
        flexGrow: 1,
      }}
    >
      <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: isMobile ? 0.5 : 1,
        p: isMobile ? 1.5 : 2, // Padding reducido en móvil
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography 
            variant={isMobile ? "caption" : "body2"} 
            color="text.secondary" 
            sx={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: isMobile ? '0.7rem' : undefined
            }}
          >
            {title}
        </Typography>
          {icon}
        </Box>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="div" 
          sx={{ 
            fontFamily: 'Sora, sans-serif', 
            fontWeight: 700, 
            color: defaultColor,
            fontSize: isMobile ? '1.25rem' : undefined
          }}
    >
          {formattedValue}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          <TrendIcon size={isMobile ? 14 : 16} color={trendColor} />
          <Typography 
            variant="caption" 
            color={trendColor} 
            sx={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: isMobile ? '0.65rem' : '0.75rem'
            }}
          >
            {trend === 'up' ? 'Incremento' : trend === 'down' ? 'Decremento' : 'Estable'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  // En móvil, omitir el tooltip para mejorar rendimiento
  return (isMobile || !tooltip) ? cardContent : (
    <Tooltip 
      title={
        <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }}>
          {tooltip}
        </Typography>
      } 
      placement="top" 
      arrow
    >
      {cardContent}
    </Tooltip>
  );
};