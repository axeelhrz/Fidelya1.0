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

  return (
    <ListItemButton
      onClick={handleClick}
      sx={{
        borderRadius: 3,
        mb: 1,
        mx: 1,
        py: 1.5,
        px: 2,
        background: active 
          ? isCEOSection
            ? `linear-gradient(135deg, ${alpha(ceoBrandColors.primary, 0.15)} 0%, ${alpha(ceoBrandColors.secondary, 0.15)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.15)} 100%)`
          : 'transparent',
        border: active 
          ? `1px solid ${alpha(getActiveColor(), 0.2)}`
          : '1px solid transparent',
        color: active ? getActiveColor() : theme.palette.text.primary,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': active ? {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: isCEOSection 
            ? `linear-gradient(180deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`
            : `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          borderRadius: '0 2px 2px 0',
        } : {},
        '&:hover': {
          background: active 
            ? isCEOSection
              ? `linear-gradient(135deg, ${alpha(ceoBrandColors.primary, 0.2)} 0%, ${alpha(ceoBrandColors.secondary, 0.2)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`
            : alpha(getActiveColor(), 0.08),
          transform: 'translateX(4px)',
          '& .MuiListItemIcon-root': {
            transform: 'scale(1.1)',
          },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 40,
          color: 'inherit',
          transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Icon sx={{ fontSize: 22 }} />
      </ListItemIcon>
      
      <ListItemText
        primary={
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: active ? 600 : 500,
                fontFamily: '"Neris", sans-serif',
                flex: 1,
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
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                  color: 'white',
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
                  height: 18,
                  fontSize: '0.6rem',
                  fontWeight: 500,
                  background: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.main,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                  '& .MuiChip-label': {
                    px: 0.5,
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
                fontFamily: '"Neris", sans-serif',
                fontWeight: 300,
                fontSize: '0.7rem',
                mt: 0.5,
                display: 'block',
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
  );
}