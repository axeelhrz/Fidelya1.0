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
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  hover: { y: -5, scale: 1.03, transition: { duration: 0.2 } }
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
  const defaultColor = color || theme.palette.primary.main;

  const formattedValue = isCurrency
    ? formatCurrency(value)
    : isPercentage
    ? formatPercentage(value)
    : formatNumber(value);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = getTrendColor(trend, theme);

  const cardContent = (
    <Card
      component={motion.div}
      variants={cardVariants}
      whileHover="hover"
      sx={{
        ...createPremiumCardStyle(theme, defaultColor),
        minWidth: 200,
        flexGrow: 1,
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Inter, sans-serif' }}>
            {title}
          </Typography>
          {icon}
        </Box>
        <Typography variant="h4" component="div" sx={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: defaultColor }}>
          {formattedValue}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          <TrendIcon size={16} color={trendColor} />
          <Typography variant="caption" color={trendColor} sx={{ fontFamily: 'Inter, sans-serif' }}>
            {trend === 'up' ? 'Incremento' : trend === 'down' ? 'Decremento' : 'Estable'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return tooltip ? (
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
