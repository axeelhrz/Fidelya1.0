'use client';

import React from 'react';
import { Box, Typography, Tooltip, useTheme, alpha, Chip } from '@mui/material';
import { Update as UpdateIcon } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { DashboardKPIs } from '@/lib/generate-kpis';
import { motion } from 'framer-motion';

interface KpiLastUpdatedProps {
  kpis: DashboardKPIs | null;
  showIcon?: boolean;
  variant?: 'text' | 'caption' | 'chip';
  color?: string;
  animate?: boolean;
}

const KpiLastUpdated: React.FC<KpiLastUpdatedProps> = ({
  kpis,
  showIcon = true,
  variant = 'caption',
  color,
  animate = true
}) => {
  const theme = useTheme();
  const textColor = color || theme.palette.text.secondary;

  if (!kpis?.lastUpdated) {
    return null;
  }

  // Convertir Timestamp a Date
  const lastUpdated = kpis.lastUpdated.toDate();
  
  // Formatear la fecha relativa (ej: "hace 5 minutos", "hace 2 horas")
  const formattedTime = formatDistanceToNow(lastUpdated, {
    addSuffix: true,
    locale: es
  });

  // Formatear la fecha completa para el tooltip
  const fullDate = new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'full',
    timeStyle: 'medium'
  }).format(lastUpdated);

  // Determinar si los datos son "antiguos" (más de 1 hora)
  const isStale = (new Date().getTime() - lastUpdated.getTime()) > (60 * 60 * 1000);

  // Variantes para animación
  const animationVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  if (variant === 'chip') {
    return (
      <Tooltip title={`Actualizado: ${fullDate}`} arrow placement="top">
        <Chip
          component={animate ? motion.div : 'div'}
          initial={animate ? "initial" : undefined}
          animate={animate ? "animate" : undefined}
          whileHover={animate ? "hover" : undefined}
          variants={animationVariants}
          icon={<UpdateIcon fontSize="small" />}
          label={`Actualizado ${formattedTime}`}
          size="small"
          color={isStale ? "warning" : "default"}
          variant="outlined"
          sx={{ 
            borderRadius: '8px',
            fontWeight: 500,
            backgroundColor: isStale 
              ? alpha(theme.palette.warning.main, 0.1)
              : alpha(theme.palette.action.selected, 0.1),
            '& .MuiChip-icon': { 
              color: isStale ? theme.palette.warning.main : textColor 
            }
          }}
        />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={`Actualizado: ${fullDate}`} arrow placement="top">
      <Box
        component={animate ? motion.div : 'div'}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        whileHover={animate ? "hover" : undefined}
        variants={animationVariants}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: isStale ? theme.palette.warning.main : textColor,
          cursor: 'help',
          borderRadius: '8px',
          px: 1,
          py: 0.5,
          backgroundColor: isStale 
            ? alpha(theme.palette.warning.main, 0.05)
            : 'transparent',
          '&:hover': {
            backgroundColor: isStale 
              ? alpha(theme.palette.warning.main, 0.1)
              : alpha(theme.palette.action.hover, 0.1),
          }
        }}
      >
        {showIcon && (
          <UpdateIcon 
            fontSize="small" 
            sx={{ 
              fontSize: variant === 'caption' ? 14 : 16,
              opacity: 0.7
            }} 
          />
        )}
        <Typography 
          variant={variant === 'caption' ? 'caption' : 'body2'} 
          component="span"
          sx={{ 
            fontStyle: 'italic',
            opacity: 0.9,
            fontWeight: isStale ? 500 : 400
          }}
        >
          Actualizado {formattedTime}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default KpiLastUpdated;