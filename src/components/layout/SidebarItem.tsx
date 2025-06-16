'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  alpha,
} from '@mui/material';
import { createElement } from 'react';

interface SidebarItemProps {
  icon: React.ComponentType | React.ReactNode;
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

  // Render the icon properly - if it's a component, create an element
  const renderIcon = () => {
    if (typeof icon === 'function') {
      return createElement(icon as React.ComponentType);
    }
    return icon;
  };

  const iconElement = renderIcon();

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