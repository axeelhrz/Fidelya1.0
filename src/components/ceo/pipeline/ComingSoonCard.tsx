'use client';

import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Schedule,
  Star,
} from '@mui/icons-material';

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

interface ComingSoonCardProps {
  title: string;
  description: string;
  icon: React.ComponentType;
  priority: 'alta' | 'media' | 'baja';
  estimatedDate: string;
}

export default function ComingSoonCard({ 
  title, 
  description, 
  icon: IconComponent, 
  priority, 
  estimatedDate 
}: ComingSoonCardProps) {
  const theme = useTheme();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return '#F44336';
      case 'media':
        return '#FF9800';
      case 'baja':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  const priorityColor = getPriorityColor(priority);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 3,
        border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          borderColor: ceoBrandColors.primary,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${priorityColor} 0%, ${alpha(priorityColor, 0.7)} 100%)`,
        },
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <IconComponent sx={{ fontSize: 24 }} />
        </Box>
        
        <Chip
          label={priority.toUpperCase()}
          size="small"
          sx={{
            backgroundColor: alpha(priorityColor, 0.1),
            color: priorityColor,
            fontFamily: '"Neris", sans-serif',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      </Box>

      {/* Title */}
      <Typography 
        variant="h6" 
        sx={{ 
          fontFamily: '"Neris", sans-serif',
          fontWeight: 600,
          color: ceoBrandColors.text,
          mb: 1,
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography 
        variant="body2" 
        sx={{ 
          fontFamily: '"Neris", sans-serif',
          color: alpha(ceoBrandColors.text, 0.7),
          mb: 3,
          lineHeight: 1.4,
        }}
      >
        {description}
      </Typography>

      {/* Footer */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mt="auto">
        <Box display="flex" alignItems="center" gap={1}>
          <Schedule sx={{ fontSize: 16, color: ceoBrandColors.accentBlue }} />
          <Typography 
            variant="caption" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              color: ceoBrandColors.accentBlue,
              fontWeight: 600,
            }}
          >
            {estimatedDate}
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" gap={0.5}>
          <Star sx={{ fontSize: 14, color: '#FFD700' }} />
          <Typography 
            variant="caption" 
            sx={{ 
              fontFamily: '"Neris", sans-serif',
              color: alpha(ceoBrandColors.text, 0.6),
            }}
          >
            Próximamente
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
