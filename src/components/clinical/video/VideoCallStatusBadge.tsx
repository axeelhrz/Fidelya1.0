'use client';

import React from 'react';
import { Chip, Box } from '@mui/material';
import {
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  PlayCircleFilled as PlayIcon,
  Stop as StopIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { VideoCallStatus } from '../../../types/videocall';

interface VideoCallStatusBadgeProps {
  status: VideoCallStatus;
  size?: 'small' | 'medium';
}

const statusConfig = {
  programada: {
    label: 'Programada',
    color: '#2196f3',
    backgroundColor: '#e3f2fd',
    icon: ScheduleIcon
  },
  confirmada: {
    label: 'Confirmada',
    color: '#4caf50',
    backgroundColor: '#e8f5e8',
    icon: CheckCircleIcon
  },
  en_curso: {
    label: 'En Curso',
    color: '#ff9800',
    backgroundColor: '#fff3e0',
    icon: PlayIcon
  },
  finalizada: {
    label: 'Finalizada',
    color: '#9e9e9e',
    backgroundColor: '#f5f5f5',
    icon: StopIcon
  },
  cancelada: {
    label: 'Cancelada',
    color: '#f44336',
    backgroundColor: '#ffebee',
    icon: CancelIcon
  }
};

export const VideoCallStatusBadge: React.FC<VideoCallStatusBadgeProps> = ({
  status,
  size = 'medium'
}) => {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <Chip
      icon={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconComponent sx={{ fontSize: size === 'small' ? 16 : 18 }} />
        </Box>
      }
      label={config.label}
      size={size}
      sx={{
        backgroundColor: config.backgroundColor,
        color: config.color,
        fontWeight: 500,
        '& .MuiChip-icon': {
          color: config.color
        }
      }}
    />
  );
};
