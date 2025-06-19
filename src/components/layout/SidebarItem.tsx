'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  alpha,
  SvgIconProps,
} from '@mui/material';
import React from 'react';

interface SidebarItemProps {
  icon: React.ComponentType<SvgIconProps> | React.ReactElement;
  label: string;
  path: string;
  badge?: number;
  onClick?: () => void;
}

export default function SidebarItem({ 
  icon, 
  label, 
  path, 
  badge,
  onClick 
}: SidebarItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === path;

  const handleClick = () => {
    router.push(path);
    onClick?.();
  };

  // Create the icon element - handle Material-UI icon components
  const iconElement = React.isValidElement(icon) 
    ? icon 
    : React.createElement(icon as React.ComponentType<SvgIconProps>);

  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={handleClick}
        sx={{
          borderRadius: 2,
          mx: 1,
          bgcolor: isActive ? alpha('#2563eb', 0.1) : 'transparent',
          color: isActive ? 'primary.main' : 'text.primary',
          '&:hover': {
            bgcolor: isActive 
              ? alpha('#2563eb', 0.15) 
              : alpha('#000000', 0.04),
          },
        }}
      >
        <ListItemIcon
          sx={{
            color: isActive ? 'primary.main' : 'text.secondary',
            minWidth: 40,
          }}
        >
          {badge ? (
            <Badge badgeContent={badge} color="error">
              {iconElement}
            </Badge>
          ) : (
            iconElement
          )}
        </ListItemIcon>
        <ListItemText 
          primary={label}
          primaryTypographyProps={{
            fontWeight: isActive ? 600 : 400,
            fontSize: '0.875rem',
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}