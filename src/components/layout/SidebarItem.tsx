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
import { usePathname, useRouter } from 'next/navigation';
import { useRole } from '@/hooks/useRole';

interface SidebarItemProps {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  onClick?: () => void;
  adminOnly?: boolean;
  description?: string;
}

export default function SidebarItem({ 
  icon: Icon, 
  label, 
  path, 
  onClick,
  adminOnly = false,
  description 
}: SidebarItemProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useRole();
  
  const isActive = pathname === path || (path !== '/dashboard' && pathname.startsWith(path));
  const isAdminRoute = path === '/dashboard/ceo';

  const handleClick = () => {
    router.push(path);
    onClick?.();
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
        background: isActive 
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.15)} 100%)`
          : 'transparent',
        border: isActive 
          ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          : '1px solid transparent',
        color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': isActive ? {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          borderRadius: '0 2px 2px 0',
        } : {},
        '&:hover': {
          background: isActive 
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`
            : alpha(theme.palette.primary.main, 0.08),
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
                fontWeight: isActive ? 600 : 500,
                fontFamily: '"Inter", sans-serif',
                flex: 1,
              }}
            >
              {label}
            </Typography>
            
            {/* Chip especial para Panel Ejecutivo */}
            {isAdminRoute && role === 'admin' && (
              <Chip
                label="CEO"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  background: `linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)`,
                  color: 'white',
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
            )}
            
            {/* Chip para rutas solo admin */}
            {adminOnly && !isAdminRoute && role === 'admin' && (
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
          description && isAdminRoute ? (
            <Typography
              variant="caption"
              sx={{
                color: alpha(theme.palette.text.secondary, 0.8),
                fontStyle: 'italic',
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
            mb: description && isAdminRoute ? 0.5 : 0,
          },
        }}
      />
    </ListItemButton>
  );
}