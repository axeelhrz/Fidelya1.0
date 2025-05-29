import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Logout,
  Settings,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import NotificationPanel from './NotificationPanel';

const DRAWER_WIDTH = 280;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema Contable - Frutería
          </Typography>

          {/* Theme Toggle */}
          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>

          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={() => setNotificationOpen(true)}
          >
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user?.name.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <AccountCircle sx={{ mr: 1 }} />
          Perfil
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <Settings sx={{ mr: 1 }} />
          Configuración
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 1 }} />
          Cerrar Sesión
        </MenuItem>
      </Menu>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          <Sidebar onItemClick={() => isMobile && setMobileOpen(false)} />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        </motion.div>
      </Box>

      {/* Notification Panel */}
      <NotificationPanel
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </Box>
  );
};

export default Layout;