'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  IconButton,
  Badge,
  alpha,
  useTheme,
  Collapse,
  Button,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';
import { navItems } from './config';
import { navIcons } from './nav-icons';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { useThemeContext } from '@/context/themeContext';
import { useSubscription } from '@/hooks/use-subscription';

interface NavItemConfig {
  title: string;
  path: string;
  icon: string;
  children?: NavItemConfig[];
  badge?: number;
  requiredPlan?: string;
}

interface MobileNavProps {
  onClose: () => void;
  open: boolean;
  items?: NavItemConfig[];
}

interface NavItemProps extends NavItemConfig {
  pathname: string;
  onClose: () => void;
  level?: number;
}

const NavItem = ({ title, path, icon, children, badge, pathname, onClose, level = 0 }: NavItemProps) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const active = isNavItemActive({ pathname, href: path });
  const hasChildren = children && children.length > 0;
  const Icon = navIcons[icon];

  // Expandir automáticamente si un hijo está activo
  useEffect(() => {
    if (hasChildren && children!.some(child => isNavItemActive({ pathname, href: child.path }))) {
      setOpen(true);
    }
  }, [pathname, hasChildren, children]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClick = () => {
    if (!hasChildren) {
      onClose();
    }
  };

  return (
    <>
      <ListItem 
        disablePadding 
        sx={{ 
          display: 'block',
          mb: 0.5,
          pl: level * 2
        }}
      >
        <ListItemButton
          component={hasChildren ? 'div' : Link}
          href={hasChildren ? undefined : path}
          onClick={hasChildren ? handleToggle : handleClick}
          sx={{
            minHeight: 48,
            px: 2.5,
            py: 1,
            borderRadius: 2,
            backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
            color: active ? theme.palette.primary.main : theme.palette.text.primary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: active ? theme.palette.primary.main : theme.palette.text.secondary,
            }}
          >
            {Icon ? <Icon /> : null}
          </ListItemIcon>
          <ListItemText 
            primary={title} 
            primaryTypographyProps={{ 
              fontWeight: active ? 600 : 400,
              fontFamily: 'Sora',
              fontSize: '0.95rem'
            }} 
          />
          {badge && badge > 0 ? (
            <Badge 
              badgeContent={badge} 
              color="error" 
              sx={{ mr: 1 }}
            />
          ) : null}
          {hasChildren && (
            <motion.div
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRightIcon fontSize="small" />
            </motion.div>
          )}
        </ListItemButton>
      </ListItem>
      
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children!.map((child) => (
              <NavItem
                key={child.path}
                {...child}
                pathname={pathname}
                onClose={onClose}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const renderNavItems = (pathname: string, items: NavItemConfig[], onClose: () => void) => {
  return items.map((item) => (
    <NavItem
      key={item.path}
      {...item}
      pathname={pathname}
      onClose={onClose}
    />
  ));
};

export default function MobileNav({ onClose, open, items = navItems.map(item => {
  const navItem = {
    ...item,
    path: item.href
  };
  
  // Only add children property if it exists in the source
  if ('children' in item && item.children && Array.isArray(item.children)) {
    return {
      ...navItem,
      children: item.children.map((child: { href: string, title: string, icon?: string, badge?: number }) => ({
        ...child,
        path: child.href,
        icon: child.icon || 'Circle' // Provide a default icon if it's undefined
      }))
    };
  }
  
  return navItem;
}) }: MobileNavProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { toggleColorMode } = useThemeContext();
  const { subscription } = useSubscription();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const handleToggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.95)
            : alpha(theme.palette.background.paper, 0.98),
          color: theme.palette.text.primary,
          width: 'min(85vw, 320px)',
          maxWidth: '100%',
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          p: 2,
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      {/* Header con logo y botón de cierre */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box 
          component="img"
          src={theme.palette.mode === 'dark' ? '/logos/logo-light.svg' : '/logos/logo-dark.svg'}
          alt="Assuriva"
          sx={{ height: 32 }}
        />
        <IconButton onClick={onClose} edge="end" aria-label="cerrar menú">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Perfil de usuario */}
      <Box 
        sx={{ 
          mb: 3, 
          p: 2, 
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={profile?.avatarUrl}
            alt={profile?.displayName || 'Usuario'}
            sx={{ 
              width: 48, 
              height: 48,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          />
          <Box sx={{ overflow: 'hidden' }}>
            <Typography 
              variant="subtitle1" 
              fontWeight={600}
              fontFamily="Sora"
              noWrap
            >
              {profile?.displayName || 'Usuario'}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              noWrap
            >
              {profile?.email || ''}
            </Typography>
          </Box>
        </Stack>

        {/* Plan actual */}
        {subscription?.plan && (
          <Box 
            sx={{ 
              mt: 2, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Plan actual:
            </Typography>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 10,
                backgroundColor: 
                  subscription.plan === 'free' 
                    ? alpha(theme.palette.info.main, 0.1)
                    : subscription.plan === 'professional'
                      ? alpha(theme.palette.warning.main, 0.1)
                      : alpha(theme.palette.success.main, 0.1),
                color: 
                  subscription.plan === 'free' 
                    ? theme.palette.info.main
                    : subscription.plan === 'professional'
                      ? theme.palette.warning.main
                      : theme.palette.success.main,
                border: `1px solid ${
                  subscription.plan === 'free' 
                    ? alpha(theme.palette.info.main, 0.2)
                    : subscription.plan === 'professional'
                      ? alpha(theme.palette.warning.main, 0.2)
                      : alpha(theme.palette.success.main, 0.2)
                }`,
                textTransform: 'capitalize',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              {subscription.plan}
            </Box>
          </Box>
        )}
      </Box>

      {/* Navegación principal */}
      <List
        component="nav"
        sx={{
          width: '100%',
          mb: 2,
        }}
      >
        {renderNavItems(pathname, items, onClose)}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Configuración y tema */}
      <List component="nav">
        <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
          <ListItemButton
            onClick={handleToggleSettings}
            sx={{
              minHeight: 48,
              px: 2.5,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: theme.palette.text.secondary,
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Configuración" 
              primaryTypographyProps={{ 
                fontWeight: 400,
                fontFamily: 'Sora',
                fontSize: '0.95rem'
              }} 
            />
            {settingsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>

        <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem disablePadding sx={{ display: 'block', pl: 2 }}>
              <ListItemButton
                onClick={toggleColorMode}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </ListItemIcon>
                <ListItemText 
                  primary={theme.palette.mode === 'dark' ? 'Modo claro' : 'Modo oscuro'} 
                  primaryTypographyProps={{ 
                    fontWeight: 400,
                    fontFamily: 'Sora',
                    fontSize: '0.95rem'
                  }} 
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        {/* Cerrar sesión */}
        <ListItem disablePadding sx={{ display: 'block', mt: 1 }}>
          <ListItemButton
            onClick={handleSignOut}
            sx={{
              minHeight: 48,
              px: 2.5,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.05),
                color: theme.palette.error.main,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: theme.palette.error.main,
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Cerrar sesión" 
              primaryTypographyProps={{ 
                fontWeight: 500,
                fontFamily: 'Sora',
                fontSize: '0.95rem',
                color: theme.palette.error.main,
              }} 
            />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Promoción de versión Pro */}
      {subscription?.plan !== 'enterprise' && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.light, 0.2)}, ${alpha(theme.palette.warning.main, 0.1)})`,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Mejora a Enterprise
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Accede a todas las funciones premium y análisis avanzados.
          </Typography>
          <Button
            component={Link}
            href="/pricing"
            variant="contained"
            color="warning"
            fullWidth
            onClick={onClose}
            sx={{
              borderRadius: 2,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.3)}`,
            }}
          >
            Ver planes
          </Button>
        </Box>
      )}
    </Drawer>
  );
}