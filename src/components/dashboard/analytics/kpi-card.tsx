import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip, useTheme, useMediaQuery } from '@mui/material';
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
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  hover: { y: -5, scale: 1.03, transition: { duration: 0.2 } }
};

// Variantes simplificadas para móvil
const mobileCardVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  hover: {} // Sin efecto hover en móvil
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
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultColor = color || theme.palette.primary.main;

  const formattedValue = isCurrency
    ? formatCurrency(value)
    : isPercentage
    ? formatPercentage(value)
    : formatNumber(value);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = getTrendColor(trend, theme);

  // Usar variantes según dispositivo
  const variants = isMobile ? mobileCardVariants : cardVariants;
  
  // Reducir tamaño de icono en móvil
  const iconSize = isMobile ? 20 : 28;
  const iconComponent = React.cloneElement(icon as React.ReactElement, { size: iconSize });

  const cardContent = (
    <Card
      component={motion.div}
      variants={variants}
      whileHover={isMobile ? undefined : "hover"}
      sx={{
        ...createPremiumCardStyle(theme, defaultColor, isMobile),
        minWidth: isMobile ? 150 : 200,
        flexGrow: 1,
      }}
    >
      <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1,
        padding: isMobile ? '12px !important' : undefined // Reducir padding en móvil
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography 
            variant={isMobile ? "caption" : "body2"} 
            color="text.secondary" 
            sx={{ fontFamily: 'Inter, sans-serif' }}
          >
            {title}
          </Typography>
          {iconComponent}
        </Box>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="div" 
          sx={{ 
            fontFamily: 'Sora, sans-serif', 
            fontWeight: 700, 
            color: defaultColor,
            fontSize: isMobile ? '1.25rem' : undefined // Ajustar tamaño en móvil
          }}
        >
          {formattedValue}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          <TrendIcon size={isMobile ? 12 : 16} color={trendColor} />
          <Typography 
            variant="caption" 
            color={trendColor} 
            sx={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: isMobile ? '0.65rem' : '0.75rem' // Reducir tamaño en móvil
            }}
          >
            {trend === 'up' ? 'Incremento' : trend === 'down' ? 'Decremento' : 'Estable'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  // Deshabilitar tooltips en móvil para mejorar rendimiento
  return (tooltip && !isMobile) ? (
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
  ) : (
    cardContent
  );
};