import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { 
  Schedule, 
  CheckCircle, 
  PlayArrow, 
  Done, 
  Cancel 
} from '@mui/icons-material';
import { SessionStatus } from '../../types/session';

interface StatusBadgeProps extends Omit<ChipProps, 'label' | 'color'> {
  status: SessionStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, ...props }) => {
  const getStatusConfig = (status: SessionStatus) => {
    switch (status) {
      case 'pendiente':
        return {
          label: 'Pendiente',
          color: 'default' as const,
          icon: <Schedule fontSize="small" />,
        };
      case 'confirmada':
        return {
          label: 'Confirmada',
          color: 'info' as const,
          icon: <CheckCircle fontSize="small" />,
        };
      case 'en_curso':
        return {
          label: 'En Curso',
          color: 'warning' as const,
          icon: <PlayArrow fontSize="small" />,
        };
      case 'finalizada':
        return {
          label: 'Finalizada',
          color: 'success' as const,
          icon: <Done fontSize="small" />,
        };
      case 'cancelada':
        return {
          label: 'Cancelada',
          color: 'error' as const,
          icon: <Cancel fontSize="small" />,
        };
      default:
        return {
          label: 'Desconocido',
          color: 'default' as const,
          icon: <Schedule fontSize="small" />,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      icon={config.icon}
      size="small"
      variant="outlined"
      {...props}
    />
  );
};

export default StatusBadge;
