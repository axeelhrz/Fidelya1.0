'use client';

import React, { useState } from 'react';
import { 
  IconButton, 
  Tooltip, 
  CircularProgress, 
  useTheme,
  alpha,
  Badge,
  Zoom
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface KpiRefreshButtonProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  tooltip?: string;
  onRefresh?: () => Promise<void> | void;
  isRefreshing?: boolean;
  lastUpdated?: Date | null;
  showBadge?: boolean;
}

const KpiRefreshButton: React.FC<KpiRefreshButtonProps> = ({
  size = 'medium',
  color,
  tooltip = 'Actualizar KPIs',
  onRefresh,
  isRefreshing = false,
  lastUpdated = null,
  showBadge = true
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      await onRefresh();
    }
  };

  const buttonColor = color || theme.palette.primary.main;
  
  // Determinar si los datos son "antiguos" (más de 1 hora)
  const isStale = lastUpdated ? 
    (new Date().getTime() - lastUpdated.getTime()) > (60 * 60 * 1000) : 
    false;

  // Texto del tooltip con información de última actualización
  const tooltipText = lastUpdated ? 
    `${tooltip} (Última actualización: ${formatDistanceToNow(lastUpdated, { addSuffix: true, locale: es })})` : 
    tooltip;

  return (
    <Tooltip 
      title={tooltipText} 
      placement="top"
      TransitionComponent={Zoom}
      arrow
    >
      <Badge
        variant="dot"
        invisible={!showBadge || !isStale}
        color="error"
        overlap="circular"
        sx={{
          '& .MuiBadge-badge': {
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
          }
        }}
      >
        <IconButton
          onClick={handleRefresh}
          disabled={isRefreshing}
          size={size}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            color: buttonColor,
            backgroundColor: alpha(buttonColor, isHovered ? 0.15 : 0.1),
            '&:hover': {
              backgroundColor: alpha(buttonColor, 0.2),
            },
            position: 'relative',
            transition: 'all 0.3s ease',
            boxShadow: isHovered ? `0 4px 12px ${alpha(buttonColor, 0.3)}` : 'none',
          }}
        >
          {isRefreshing ? (
            <CircularProgress
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
              color="inherit"
              sx={{ 
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }}
            />
          ) : (
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <RefreshIcon 
                fontSize={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'} 
                sx={{ 
                  transition: 'transform 0.3s ease',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                }}
              />
            </motion.div>
          )}
        </IconButton>
      </Badge>
    </Tooltip>
  );
};

export default KpiRefreshButton;