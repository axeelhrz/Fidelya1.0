'use client';

import { Chip, useTheme } from '@mui/material';
import { 
  AlertUrgency, 
  AlertStatus, 
  ALERT_URGENCY_LABELS, 
  ALERT_STATUS_LABELS 
} from '@/types/alert';

interface AlertBadgeProps {
  urgency?: AlertUrgency;
  status?: AlertStatus;
  size?: 'small' | 'medium';
}

export default function AlertBadge({ 
  urgency, 
  status, 
  size = 'small'
}: AlertBadgeProps) {
  const theme = useTheme();

  if (urgency) {
    const urgencyConfig = {
      low: { color: theme.palette.success.main, label: 'Baja' },
      medium: { color: theme.palette.warning.main, label: 'Media' },
      high: { color: theme.palette.error.main, label: 'Alta' },
      critical: { color: theme.palette.error.dark, label: 'Crítica' },
    };

    const config = urgencyConfig[urgency];
    
    return (
      <Chip
        label={config.label}
        size={size}
        sx={{
          bgcolor: config.color,
          color: 'white',
          fontWeight: 600,
          fontSize: size === 'small' ? '0.7rem' : '0.75rem',
          height: size === 'small' ? 20 : 24,
          '& .MuiChip-label': {
            px: 1,
          }
        }}
      />
    );
  }

  if (status) {
    const statusConfig = {
      active: { color: theme.palette.info.main, label: 'Activa' },
      resolved: { color: theme.palette.success.main, label: 'Resuelta' },
      cancelled: { color: theme.palette.grey[500], label: 'Cancelada' },
      expired: { color: theme.palette.grey[400], label: 'Expirada' },
    };

    const config = statusConfig[status];
    
    return (
      <Chip
        label={config.label}
        size={size}
        variant="outlined"
        sx={{
          borderColor: config.color,
          color: config.color,
          fontWeight: 500,
          fontSize: size === 'small' ? '0.7rem' : '0.75rem',
          height: size === 'small' ? 20 : 24,
          '& .MuiChip-label': {
            px: 1,
          }
        }}
      />
    );
  }

  return null;
}