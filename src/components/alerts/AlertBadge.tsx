'use client';

import { Chip, useTheme, alpha } from '@mui/material';
import { 
  AlertUrgency, 
  AlertStatus, 
  ALERT_URGENCY_LABELS, 
  ALERT_STATUS_LABELS 
} from '@/types/alert';
import {
  PriorityHigh as PriorityHighIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Block as BlockIcon,
} from '@mui/icons-material';

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
  const theme = useTheme();

  const getUrgencyConfig = (urgency: AlertUrgency) => {
    switch (urgency) {
      case 'critical':
        return {
          gradient: 'linear-gradient(135deg, #ff1744 0%, #d50000 100%)',
          color: '#ffffff',
          icon: <PriorityHighIcon sx={{ fontSize: '0.9rem', color: 'inherit' }} />,
          glow: alpha('#ff1744', 0.3),
        };
      case 'high':
        return {
          gradient: 'linear-gradient(135deg, #ff5722 0%, #e64a19 100%)',
          color: '#ffffff',
          icon: <WarningIcon sx={{ fontSize: '0.9rem', color: 'inherit' }} />,
          glow: alpha('#ff5722', 0.3),
        };
      case 'medium':
        return {
          gradient: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          color: '#ffffff',
          icon: <InfoIcon sx={{ fontSize: '0.9rem', color: 'inherit' }} />,
          glow: alpha('#ff9800', 0.3),
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
          color: '#ffffff',
          icon: <CheckCircleIcon sx={{ fontSize: '0.9rem', color: 'inherit' }} />,
          glow: alpha('#4caf50', 0.3),
        };
    }
  };

  const getStatusConfig = (status: AlertStatus) => {
    switch (status) {
      case 'active':
        return {
          gradient: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
          color: '#ffffff',
          icon: <ScheduleIcon sx={{ fontSize: '0.9rem', color: 'inherit' }} />,
          glow: alpha('#2196f3', 0.3),
        };
      case 'resolved':
        return {
          gradient: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
          color: '#ffffff',
          icon: <CheckCircleIcon sx={{ fontSize: '0.9rem', color: 'inherit' }} />,
          glow: alpha('#4caf50', 0.3),
        };
      case 'cancelled':
        return {
          gradient: 'linear-gradient(135deg, #9e9e9e 0%, #616161 100%)',
          color: '#ffffff',
          icon: <CancelIcon sx={{ fontSize: '0.9rem', color: 'inherit' }} />,
          glow: alpha('#9e9e9e', 0.3),
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #757575 0%, #424242 100%)',
          color: '#ffffff',
          icon: <BlockIcon sx={{ fontSize: '0.9rem', color: 'inherit' }} />,
          glow: alpha('#757575', 0.3),
        };
    }
  };

  if (urgency) {
    const config = getUrgencyConfig(urgency);
    return (
      <Chip
        icon={config.icon}
        label={ALERT_URGENCY_LABELS[urgency]}
        size={size}
        sx={{
          background: variant === 'filled' ? config.gradient : 'transparent',
          color: variant === 'filled' ? config.color : config.gradient,
          border: variant === 'outlined' ? `2px solid transparent` : 'none',
          backgroundImage: variant === 'outlined' ? config.gradient : undefined,
          backgroundOrigin: 'border-box',
          backgroundClip: variant === 'outlined' ? 'padding-box, border-box' : undefined,
          fontWeight: 700,
          fontSize: size === 'small' ? '0.7rem' : '0.8rem',
          height: size === 'small' ? 24 : 28,
          borderRadius: 2,
          boxShadow: variant === 'filled' ? `0 4px 12px ${config.glow}` : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: variant === 'filled' ? `0 8px 20px ${config.glow}` : `0 4px 12px ${config.glow}`,
          },
          '& .MuiChip-icon': {
            color: 'inherit',
            marginLeft: 1,
          },
          '& .MuiChip-label': {
            paddingLeft: 1,
            paddingRight: 2,
            fontWeight: 'inherit',
          }
        }}
      />
    );
  }

  if (status) {
    const config = getStatusConfig(status);
    return (
      <Chip
        icon={config.icon}
        label={ALERT_STATUS_LABELS[status]}
        size={size}
        sx={{
          background: variant === 'filled' ? config.gradient : 'transparent',
          color: variant === 'filled' ? config.color : config.gradient,
          border: variant === 'outlined' ? `2px solid transparent` : 'none',
          backgroundImage: variant === 'outlined' ? config.gradient : undefined,
          backgroundOrigin: 'border-box',
          backgroundClip: variant === 'outlined' ? 'padding-box, border-box' : undefined,
          fontWeight: 700,
          fontSize: size === 'small' ? '0.7rem' : '0.8rem',
          height: size === 'small' ? 24 : 28,
          borderRadius: 2,
          boxShadow: variant === 'filled' ? `0 4px 12px ${config.glow}` : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: variant === 'filled' ? `0 8px 20px ${config.glow}` : `0 4px 12px ${config.glow}`,
          },
          '& .MuiChip-icon': {
            color: 'inherit',
            marginLeft: 1,
          },
          '& .MuiChip-label': {
            paddingLeft: 1,
            paddingRight: 2,
            fontWeight: 'inherit',
          }
        }}
      />
    );
  }

  return null;
}