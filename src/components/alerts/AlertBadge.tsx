'use client';

import { Chip, useTheme } from '@mui/material';
import { 
  AlertUrgency, 
  AlertStatus,
  AlertTrigger,
  ALERT_URGENCY_LABELS, 
  ALERT_STATUS_LABELS,
  ALERT_TRIGGER_LABELS,
  ALERT_URGENCY_COLORS,
  ALERT_STATUS_COLORS
} from '@/types/alert';

interface AlertBadgeProps {
  urgency?: AlertUrgency;
  status?: AlertStatus;
  trigger?: AlertTrigger;
  size?: 'small' | 'medium';
}

export default function AlertBadge({ 
  urgency, 
  status, 
  trigger,
  size = 'small'
}: AlertBadgeProps) {
  const theme = useTheme();

  if (urgency) {
    const color = ALERT_URGENCY_COLORS[urgency];
    const label = ALERT_URGENCY_LABELS[urgency];
    
    return (
      <Chip
        label={label}
        size={size}
        sx={{
          bgcolor: color,
          color: 'white',
          fontWeight: 600,
          fontSize: size === 'small' ? '0.7rem' : '0.75rem',
          height: size === 'small' ? 22 : 26,
          '& .MuiChip-label': {
            px: 1.5,
          },
          borderRadius: 2,
        }}
      />
    );
  }

  if (status) {
    const color = ALERT_STATUS_COLORS[status];
    const label = ALERT_STATUS_LABELS[status];
    
    return (
      <Chip
        label={label}
        size={size}
        variant="outlined"
        sx={{
          borderColor: color,
          color: color,
          fontWeight: 500,
          fontSize: size === 'small' ? '0.7rem' : '0.75rem',
          height: size === 'small' ? 22 : 26,
          '& .MuiChip-label': {
            px: 1.5,
          },
          borderRadius: 2,
        }}
      />
    );
  }

  if (trigger) {
    const triggerColors = {
      manual: theme.palette.grey[600],
      fecha_programada: theme.palette.info.main,
      texto_IA: theme.palette.primary.main,
      falta_sesión: theme.palette.warning.main,
    };

    const color = triggerColors[trigger];
    const label = ALERT_TRIGGER_LABELS[trigger];
    
    return (
      <Chip
        label={label}
        size={size}
        variant="outlined"
        sx={{
          borderColor: color,
          color: color,
          fontWeight: 500,
          fontSize: size === 'small' ? '0.65rem' : '0.7rem',
          height: size === 'small' ? 20 : 24,
          '& .MuiChip-label': {
            px: 1,
          },
          borderRadius: 1.5,
        }}
      />
    );
  }

  return null;
}