'use client';

import { Chip } from '@mui/material';
import { 
  AlertUrgency, 
  AlertStatus, 
  ALERT_URGENCY_LABELS, 
  ALERT_STATUS_LABELS,
  ALERT_URGENCY_COLORS,
  ALERT_STATUS_COLORS 
} from '@/types/alert';

interface AlertBadgeProps {
  urgency?: AlertUrgency;
  status?: AlertStatus;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined';
}

export default function AlertBadge({ 
  urgency, 
  status, 
  size = 'small',
  variant = 'filled' 
}: AlertBadgeProps) {
  if (urgency) {
    return (
      <Chip
        label={ALERT_URGENCY_LABELS[urgency]}
        size={size}
        variant={variant}
        sx={{
          backgroundColor: variant === 'filled' ? ALERT_URGENCY_COLORS[urgency] : 'transparent',
          color: variant === 'filled' ? 'white' : ALERT_URGENCY_COLORS[urgency],
          borderColor: variant === 'outlined' ? ALERT_URGENCY_COLORS[urgency] : undefined,
          fontWeight: 'bold',
          fontSize: '0.75rem',
        }}
      />
    );
  }

  if (status) {
    return (
      <Chip
        label={ALERT_STATUS_LABELS[status]}
        size={size}
        variant={variant}
        sx={{
          backgroundColor: variant === 'filled' ? ALERT_STATUS_COLORS[status] : 'transparent',
          color: variant === 'filled' ? 'white' : ALERT_STATUS_COLORS[status],
          borderColor: variant === 'outlined' ? ALERT_STATUS_COLORS[status] : undefined,
          fontWeight: 'bold',
          fontSize: '0.75rem',
        }}
      />
    );
  }

  return null;
}
