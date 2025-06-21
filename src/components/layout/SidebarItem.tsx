'use client';

import React from 'react';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  useTheme,
  alpha,
  Chip,
  Tooltip,
} from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { Star, AutoAwesome, TrendingUp } from '@mui/icons-material';

interface SidebarItemProps {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  onClick?: () => void;
  adminOnly?: boolean;
  description?: string;
  category?: string;
}

export default function SidebarItem({
  icon: Icon,
  label,
  path,
  onClick,
  adminOnly = false,
  description,
  category,
}: SidebarItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  
  const isActive = pathname === path;
  const isCEOItem = category === 'ceo';
  const isOperativeItem = category === 'operativo';
  const isPrincipalItem = category === 'principal';

  const handleClick = () => {
    router.push(path);
    onClick?.();
  };

  // Colores según la categoría
  const getItemColors = () => {
    if (isCEOItem) {
      return {
        primary: '#5D4FB0',
        secondary: '#A593F3',
        accent: '#A5CAE6',
      };
    } else if (isOperativeItem) {
      return {
        primary: '#A593F3',
        secondary: '#A5CAE6',
        accent: '#D97DB7',
      };
    } else {
      return {
        primary: theme.palette.primary.main,
        secondary: theme.palette.secondary.main,
        accent: theme.palette.info.main,
      };
    }
  };

  const colors = getItemColors();

  return (
    <Tooltip 
      title={description || label} 
      placement="right" 
      arrow
      enterDelay={500}
    >
      <ListItemButton
        onClick={handleClick}
        sx={{
          borderRadius: 3,
          mb: 1,
          mx: 1,
          py: 2,
          px: 3,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isActive 
            ? `linear-gradient(135deg, ${alpha(colors.primary, 0.15)} 0%, ${alpha(colors.secondary, 0.08)} 100%)`
            : 'transparent',
          border: isActive 
            ? `1px solid ${alpha(colors.primary, 0.2)}`
            : '1px solid transparent',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: isActive ? 4 : 0,
            background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            borderRadius: '0 2px 2px 0',
            transition: 'width 0.3s ease',
          },
          '&:hover': {
            background: isActive 
              ? `linear-gradient(135deg, ${alpha(colors.primary, 0.2)} 0%, ${alpha(colors.secondary, 0.12)} 100%)`
              : `linear-gradient(135deg, ${alpha(colors.primary, 0.08)} 0%, ${alpha(colors.secondary, 0.04)} 100%)`,
            transform: 'translateX(4px)',
            boxShadow: `0 4px 20px ${alpha(colors.primary, 0.15)}`,
            '&::before': {
              width: 4,
            },
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 48 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2.5,
              background: isActive 
                ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
                : `linear-gradient(135deg, ${alpha(colors.primary, 0.1)} 0%, ${alpha(colors.secondary, 0.05)} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: isActive 
                ? `0 4px 16px ${alpha(colors.primary, 0.3)}`
                : `0 2px 8px ${alpha(colors.primary, 0.1)}`,
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: `0 6px 20px ${alpha(colors.primary, 0.4)}`,
              },
            }}
          >
            <Icon 
              sx={{ 
                fontSize: 20,
                color: isActive ? 'white' : colors.primary,
                transition: 'color 0.3s ease',
              }} 
            />
          </Box>
        </ListItemIcon>
        
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? colors.primary : theme.palette.text.primary,
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                }}
              >
                {label}
              </Typography>
              
              {/* Badges especiales */}
              {adminOnly && (
                <Star sx={{ 
                  color: '#FFD700', 
                  fontSize: 14,
                  filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))',
                }} />
              )}
              
              {isCEOItem && (
                <Chip
                  label="CEO"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
                    color: 'white',
                    fontFamily: '"Outfit", sans-serif',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              )}
              
              {path.includes('pipeline') && (
                <Chip
                  label="BETA"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
                    color: 'white',
                    fontFamily: '"Outfit", sans-serif',
                    animation: 'pulse 2s infinite',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              )}
            </Box>
          }
          secondary={
            description && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mt: 0.5,
                }}
              >
                {description}
              </Typography>
            )
          }
        />

        {/* Indicador de actividad */}
        {isActive && (
          <Box
            sx={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              boxShadow: `0 0 12px ${alpha(colors.primary, 0.6)}`,
              animation: 'pulse 2s infinite',
            }}
          />
        )}
      </ListItemButton>
    </Tooltip>
  );
}