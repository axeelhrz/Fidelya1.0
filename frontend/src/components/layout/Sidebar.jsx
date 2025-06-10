import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Badge,
  Switch,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  ChevronLeft,
  Store as StoreIcon,
  Brightness4,
  Brightness7,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  navigationConfig, 
  adminMenuConfig, 
  userMenuConfig, 
  systemControlsConfig,
  hasPermission,
  getBadgeCount
} from '../../config/navigation';
import NotificationBell from './NotificationBell';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

const Sidebar = ({ open, onClose, collapsed, onToggleCollapse, darkMode, onToggleDarkMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [badges, setBadges] = useState({
    notifications: 0
  });

  const [showAdminSection, setShowAdminSection] = useState(false);

  useEffect(() => {
    loadBadges();
    // Verificar si el usuario es admin para mostrar la sección de administración
    setShowAdminSection(hasPermission(user?.rol, ['admin']));
  }, [user]);
    
  const loadBadges = async () => {
    try {
      // Aquí puedes hacer llamadas a la API para obtener los conteos reales
      setBadges({
        notifications: 3 // Ejemplo
      });
    } catch (error) {
      console.error('Error cargando badges:', error);
    }
  };

  const handleNavigation = (item) => {
    if (item.action === 'logout') {
      logout();
      return;
    }
    
    if (item.url) {
      navigate(item.url);
      if (isMobile) {
        onClose();
      }
    }
  };

  const isActiveRoute = (url) => {
    if (!url) return false;
    const basePath = url.split('?')[0];
    return location.pathname === basePath || location.pathname.startsWith(basePath + '/');
  };

  const renderNavItem = (item, isAdmin = false) => {
    if (!hasPermission(user?.rol, item.roles)) return null;

    const isActive = isActiveRoute(item.url);
    const badgeCount = item.badge ? getBadgeCount(item.badge, badges) : 0;
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ListItem disablePadding sx={{ px: collapsed ? 1 : 2, mb: 0.5 }}>
          <Tooltip title={collapsed ? item.title : item.description || item.title} placement="right">
          <ListItemButton
            onClick={() => handleNavigation(item)}
            selected={isActive}
            sx={{
              minHeight: 48,
                borderRadius: 3,
                backgroundColor: isActive 
                  ? alpha(isAdmin ? theme.palette.warning.main : theme.palette.primary.main, 0.12) 
                  : 'transparent',
                border: isActive 
                  ? `1px solid ${alpha(isAdmin ? theme.palette.warning.main : theme.palette.primary.main, 0.2)}` 
                  : '1px solid transparent',
                '&:hover': {
                  backgroundColor: isActive 
                    ? alpha(isAdmin ? theme.palette.warning.main : theme.palette.primary.main, 0.16)
                    : alpha(isAdmin ? theme.palette.warning.main : theme.palette.primary.main, 0.08),
                  transform: 'translateY(-1px)',
                  boxShadow: `0 4px 12px ${alpha(isAdmin ? theme.palette.warning.main : theme.palette.primary.main, 0.15)}`,
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(isAdmin ? theme.palette.warning.main : theme.palette.primary.main, 0.12),
              },
                transition: 'all 0.2s ease-in-out',
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 1 : 2,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 'auto' : 40,
                justifyContent: 'center',
                  color: isActive 
                    ? (isAdmin ? theme.palette.warning.main : theme.palette.primary.main)
                    : theme.palette.text.secondary,
                  transition: 'color 0.2s ease-in-out',
              }}
            >
              {item.badge && badgeCount > 0 ? (
                <Badge badgeContent={badgeCount} color="error" max={99}>
                    <item.icon sx={{ fontSize: 22 }} />
                </Badge>
              ) : (
                  <item.icon sx={{ fontSize: 22 }} />
              )}
            </ListItemIcon>
            
            {!collapsed && (
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive 
                      ? (isAdmin ? theme.palette.warning.main : theme.palette.primary.main)
                      : theme.palette.text.primary,
                    transition: 'all 0.2s ease-in-out',
                }}
              />
            )}
          </ListItemButton>
          </Tooltip>
          </ListItem>
            </motion.div>
    );
  };

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
    }}>
      {/* Header */}
      <Box
        sx={{
          p: collapsed ? 2 : 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          minHeight: 80,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`,
        }}
      >
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                <StoreIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} color="primary" sx={{ lineHeight: 1.2 }}>
                  Frutería Nina
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  Sistema de Gestión
                </Typography>
              </Box>
            </Box>
          </motion.div>
        )}
        
        {collapsed && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <StoreIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
        )}

        {!isMobile && (
          <Tooltip title={collapsed ? 'Expandir' : 'Contraer'}>
            <IconButton
              onClick={onToggleCollapse}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ChevronLeft
                sx={{
                  transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                  color: theme.palette.primary.main,
                }}
              />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* User Info */}
      {!collapsed && (
        <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  width: 48,
                  height: 48,
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                {user?.nombre?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ mb: 0.5 }}>
                  {user?.nombre}
                </Typography>
                <Chip
                  label={user?.rol || 'Usuario'}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                    color: theme.palette.primary.main,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                />
              </Box>
            </Box>
          </motion.div>
        </Box>
      )}

      {/* Main Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        <List sx={{ px: 0 }}>
          {/* Módulos principales */}
          {!collapsed && (
            <Box sx={{ px: 3, mb: 2 }}>
              <Typography 
                variant="overline" 
                sx={{ 
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: theme.palette.text.secondary,
                  letterSpacing: 1.2
                }}
              >
                MÓDULOS PRINCIPALES
              </Typography>
              </Box>
        )}
          
          {navigationConfig.map(item => renderNavItem(item))}

          {/* Sección de Administración */}
          {showAdminSection && (
            <>
              <Divider sx={{ my: 3, mx: 2 }} />
              {!collapsed && (
                <Box sx={{ px: 3, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AdminIcon sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                    <Typography 
                      variant="overline" 
                      sx={{ 
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: theme.palette.warning.main,
                        letterSpacing: 1.2
        }}
      >
                      ADMINISTRACIÓN
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {adminMenuConfig.map(item => renderNavItem(item, true))}
            </>
          )}
        </List>
      </Box>

      {/* Controls Footer */}
      <Box sx={{ 
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`, 
        p: collapsed ? 1 : 2,
        background: alpha(theme.palette.background.default, 0.5),
      }}>
        {!collapsed ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Theme Toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Brightness4 sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                <Typography variant="body2" color="text.secondary">
                  Modo Oscuro
                </Typography>
              </Box>
              <Switch
                checked={darkMode}
                onChange={onToggleDarkMode}
                size="small"
      sx={{
                  '& .MuiSwitch-thumb': {
                    boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.2)}`,
        },
      }}
              />
            </Box>

            {/* Notifications */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationBell />
                <Typography variant="body2" color="text.secondary">
                  Notificaciones
                </Typography>
              </Box>
            </Box>

            {/* User Menu */}
            <Divider sx={{ my: 1 }} />
            <List sx={{ p: 0 }}>
              {userMenuConfig.map(item => (
                <ListItem key={item.id} disablePadding>
                  <Tooltip title={item.description || item.title} placement="top">
                    <ListItemButton
                      onClick={() => handleNavigation(item)}
                      sx={{
                        borderRadius: 2,
                        minHeight: 40,
                        '&:hover': {
                          backgroundColor: item.id === 'logout' 
                            ? alpha(theme.palette.error.main, 0.1)
                            : alpha(theme.palette.primary.main, 0.05),
                        },
                      }}
    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                          color: item.id === 'logout' ? theme.palette.error.main : theme.palette.text.secondary,
                        }}
                      >
                        <item.icon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: item.id === 'logout' ? theme.palette.error.main : theme.palette.text.primary,
                        }}
                      />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            <Tooltip title="Modo Oscuro" placement="right">
              <IconButton onClick={onToggleDarkMode} size="small">
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
            <NotificationBell />
            {userMenuConfig.map(item => (
              <Tooltip key={item.id} title={item.title} placement="right">
                <IconButton 
                  onClick={() => handleNavigation(item)} 
                  size="small"
                  sx={{
                    color: item.id === 'logout' ? theme.palette.error.main : theme.palette.text.secondary,
                  }}
                >
                  <item.icon fontSize="small" />
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            borderRight: 'none',
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          boxShadow: `0 0 20px ${alpha(theme.palette.common.black, 0.05)}`,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;