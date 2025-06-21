'use client';

import React from 'react';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Chip,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRole } from '@/hooks/useRole';

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
  category 
}: SidebarItemProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { role } = useRole();
  
  // Determinar si está activo basándose en la ruta y parámetros
  const isActive = () => {
    if (path.includes('?section=')) {
      const [basePath, sectionParam] = path.split('?section=');
      const currentSection = searchParams.get('section');
      return pathname === basePath && currentSection === sectionParam;
    }
    return pathname === path || (path !== '/dashboard' && pathname.startsWith(path));
  };

  const active = isActive();
  const isCEOSection = category === 'ceo';

  const handleClick = () => {
    router.push(path);
    onClick?.();
  };

  // Colores del brand kit para secciones CEO
  const ceoBrandColors = {
    primary: '#5D4FB0',
    secondary: '#A593F3', 
    accentBlue: '#A5CAE6',
    accentPink: '#D97DB7',
  };

  const getActiveColor = () => {
    if (isCEOSection) {
      return ceoBrandColors.primary;
    }
    return theme.palette.primary.main;
  };

  const getGradient = () => {
    if (isCEOSection) {
      return `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`;
    }
    return `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`;
  };

  return (
    <Box sx={{ mb: 1, px: 1 }}>
      <ListItemButton
        onClick={handleClick}
        sx={{
          borderRadius: 4,
          py: 2,
          px: 3,
          position: 'relative',
          overflow: 'hidden',
          background: active 
            ? isCEOSection
              ? 'linear-gradient(135deg, rgba(93, 79, 176, 0.15) 0%, rgba(165, 147, 243, 0.08) 100%)'
              : 'linear-gradient(135deg, rgba(93, 79, 176, 0.12) 0%, rgba(165, 147, 243, 0.06) 100%)'
            : 'transparent',
          border: active 
            ? `1px solid ${alpha(getActiveColor(), 0.2)}`
            : '1px solid transparent',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::before': active ? {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 4,
            height: '60%',
            background: getGradient(),
            borderRadius: '0 2px 2px 0',
          } : {},
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover': {
            background: active 
              ? isCEOSection
                ? 'linear-gradient(135deg, rgba(93, 79, 176, 0.2) 0%, rgba(165, 147, 243, 0.12) 100%)'
                : 'linear-gradient(135deg, rgba(93, 79, 176, 0.15) 0%, rgba(165, 147, 243, 0.08) 100%)'
              : alpha(getActiveColor(), 0.08),
            transform: 'translateX(8px)',
            boxShadow: active 
              ? `0 8px 24px ${alpha(getActiveColor(), 0.2)}`
              : `0 4px 12px ${alpha(getActiveColor(), 0.1)}`,
            '&::after': {
              left: '100%',
            },
            '& .sidebar-icon': {
              transform: 'scale(1.1)',
            },
          },
          '&:active': {
            transform: 'translateX(4px) scale(0.98)',
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 48,
            color: active ? getActiveColor() : 'text.secondary',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Box
            className="sidebar-icon"
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: active 
                ? getGradient()
                : 'transparent',
              color: active ? 'white' : 'inherit',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: active 
                ? `0 4px 12px ${alpha(getActiveColor(), 0.3)}`
                : 'none',
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>
        </ListItemIcon>
        
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1.5}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: active ? 700 : 600,
                  fontFamily: '"Outfit", sans-serif',
                  flex: 1,
                  color: active ? getActiveColor() : 'text.primary',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease',
                }}
              >
                {label}
              </Typography>
              
              {/* Chip especial para secciones CEO */}
              {isCEOSection && role === 'admin' && (
                <Chip
                  label="CEO"
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    fontFamily: '"Outfit", sans-serif',
                    background: 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(93, 79, 176, 0.3)',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              )}
              
              {/* Chip para rutas solo admin */}
              {adminOnly && !isCEOSection && role === 'admin' && (
                <Chip
                  label="Admin"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    fontFamily: '"Outfit", sans-serif',
                    background: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                    '& .MuiChip-label': {
                      px: 0.75,
                    },
                  }}
                />
              )}
            </Box>
          }
          secondary={
            description && (isCEOSection || active) ? (
              <Typography
                variant="caption"
                sx={{
                  color: alpha(theme.palette.text.secondary, 0.8),
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 400,
                  fontSize: '0.7rem',
                  mt: 0.5,
                  display: 'block',
                  lineHeight: 1.3,
                }}
              >
                {description}
              </Typography>
            ) : null
          }
          sx={{
            '& .MuiListItemText-primary': {
              mb: description && (isCEOSection || active) ? 0.5 : 0,
            },
          }}
        />
      </ListItemButton>
    </Box>
  );
}