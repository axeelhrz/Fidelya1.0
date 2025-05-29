import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactElement;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  trend?: number;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}) => {
  const theme = useTheme();

  const getTrendColor = (trend: number) => {
    if (trend > 0) return theme.palette.success.main;
    if (trend < 0) return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      style={{ flex: 1 }}
    >
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${theme.palette[color].main}15, ${theme.palette[color].main}05)`,
          border: `1px solid ${theme.palette[color].main}20`,
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
              {title}
            </Typography>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                backgroundColor: `${theme.palette[color].main}20`,
                color: theme.palette[color].main,
              }}
            >
              {icon}
            </Box>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            {value}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            
            {trend !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {trend > 0 ? (
                  <TrendingUp sx={{ fontSize: 16, color: getTrendColor(trend) }} />
                ) : trend < 0 ? (
                  <TrendingDown sx={{ fontSize: 16, color: getTrendColor(trend) }} />
                ) : null}
                <Typography
                  variant="caption"
                  sx={{ color: getTrendColor(trend), fontWeight: 500 }}
                >
                  {trend > 0 ? '+' : ''}{trend}%
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default KPICard;