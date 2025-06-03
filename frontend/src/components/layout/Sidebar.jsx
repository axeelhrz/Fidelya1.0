import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  Store as StoreIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { navigationConfig, userMenuConfig } from '../../config/navigation';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

const Sidebar = ({ open, onClose, collapsed, onToggleCollapse }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [expandedGroups, setExpandedGroups] = useState({});
  const [badges, setBadges] = useState({
    notifications: 0,
    stockAlerts: 0
  });

  useEffect(() => {
    // Cargar badges/contadores
    loadBadges();
    
    // Expandir automáticamente el grupo que contiene la ruta actual
    const currentPath = location.pathname;
    navigationConfig.forEach(item => {
      if (item.type === 'group' && item.children) {
        const hasActiveChild = item.children.some(child => 
          currentPath.startsWith(child.url.split('?')[0])
        );
        if (hasActiveChild) {
          setExpandedGroups(prev => ({ ...prev, [item.id]: true }));
        }
      }
    });
  }, [location.pathname]);

  const loadBadges = async () => {
    try {
      // Aquí cargarías los contadores reales desde tu API
      // Por ahora uso valores de ejemplo
      setBadges({
        notifications: 3,
        stockAlerts: 5
      });
    } catch (error) {
      console.error('Error cargando badges:', error);
    }
  };

  const handleGroupToggle = (groupId) => {
    if (collapsed) return;
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
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
    const basePath = url.split('?')[0];
    return location.pathname === basePath || location.pathname.startsWith(basePath + '/');
  };

  const hasPermission = (roles) => {
    if (!roles || roles.length === 0) return true;
    return roles.includes(user?.rol);
  };

  const renderNavItem = (item, level = 0) => {
    if (!hasPermission(item.roles)) return null;

    const isActive = isActiveRoute(item.url || '');
    const badgeCount = badges[item.badge] || 0;

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ListItem disablePadding sx={{ pl: level * 2 }}>
          <ListItemButton
            onClick={() => handleNavigation(item)}
            selected={isActive}
            sx={{
              minHeight: 48,
              borderRadius: collapsed ? 0 : 2,
              mx: collapsed ? 0 : 1,
              mb: 0.5,
              backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              '&:hover': {
                backgroundColor: isActive 
                  ? alpha(theme.palette.primary.main, 0.15)
                  : alpha(theme.palette.primary.main, 0.05),
              },
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 'auto' : 40,
                justifyContent: 'center',
                color: isActive ? theme.palette.primary.main : 'inherit',
              }}
            >
              {item.badge && badgeCount > 0 ? (
                <Badge badgeContent={badgeCount} color="error" max={99}>
                  <item.icon />
                </Badge>
              ) : (
                <item.icon />
              )}
            </ListItemIcon>
            
            {!collapsed && (
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? theme.palette.primary.main : 'inherit',
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
      </motion.div>
    );
  };

  const renderNavGroup = (group) => {
    if (!hasPermission(group.roles)) return null;

    const isExpanded = expandedGroups[group.id];
    const hasActiveChild = group.children?.some(child => isActiveRoute(child.url || ''));

    return (
      <Box key={group.id}>
        {!collapsed && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleGroupToggle(group.id)}
              sx={{
                minHeight: 48,
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
                backgroundColor: hasActiveChild ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
              }}
            >
              <ListItemText
                primary={group.title}
                primaryTypographyProps={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              />
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
        )}
        
        <AnimatePresence>
          {(isExpanded || collapsed) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Collapse in={isExpanded || collapsed} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {group.children?.map(child => renderNavItem(child, 1))}
                </List>
              </Collapse>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    );
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: collapsed ? 1 : 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
          minHeight: 64,
        }}
      >
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StoreIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
            <Typography variant="h6" fontWeight={700} color="primary">
              Frutería Nina
            </Typography>
          </Box>
        )}
        
        {collapsed && (
          <StoreIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
        )}

        {!isMobile && (
          <IconButton
            onClick={onToggleCollapse}
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <ChevronLeft
              sx={{
                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          </IconButton>
        )}
      </Box>

      {/* User Info */}
      {!collapsed && (
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 40,
                height: 40,
                fontWeight: 600,
              }}
            >
              {user?.nombre?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={600} noWrap>
                {user?.nombre}
              </Typography>
              <Chip
                label={user?.rol || 'Usuario'}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.75rem',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List>
          {navigationConfig.map(item => {
            if (item.type === 'group') {
              return renderNavGroup(item);
            } else {
              return renderNavItem(item);
            }
          })}
        </List>
      </Box>

      {/* User Menu */}
      {!collapsed && (
        <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 1 }}>
          <List>
            {userMenuConfig.map(item => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
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
                      color: item.id === 'logout' ? theme.palette.error.main : 'inherit',
                    }}
                  >
                    <item.icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      color: item.id === 'logout' ? theme.palette.error.main : 'inherit',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
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
            borderRight: `1px solid ${theme.palette.divider}`,
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
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;