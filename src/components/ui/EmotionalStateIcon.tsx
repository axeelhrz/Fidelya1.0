import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { EmotionalState } from '../../types/session';
import { AIService } from '../../lib/services/aiService';

interface EmotionalStateIconProps {
  state: EmotionalState;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const EmotionalStateIcon: React.FC<EmotionalStateIconProps> = ({ 
  state, 
  size = 'medium', 
  showLabel = false 
}) => {
  const icon = AIService.getEmotionalStateIcon(state);
  const label = AIService.getEmotionalStateLabel(state);
  const color = AIService.getEmotionalStateColor(state);

  const sizeMap = {
    small: '16px',
    medium: '24px',
    large: '32px',
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: showLabel ? 1 : 0,
      }}
    >
      <Box
        sx={{
          fontSize: sizeMap[size],
          lineHeight: 1,
        }}
      >
        {icon}
      </Box>
      {showLabel && (
        <Typography
          variant="caption"
          sx={{
            color,
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );

  return (
    <Tooltip title={label} arrow>
      {content}
    </Tooltip>
  );
};

export default EmotionalStateIcon;
