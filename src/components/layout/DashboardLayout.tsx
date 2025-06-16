'use client';

import { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
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
  Settings,
  Logout,
  Psychology,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/hooks/useRole';
import SidebarItem from './SidebarItem';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import { navigationItems } from '@/constants/navigation';

const drawerWidth = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const { user, signOut } = useAuth();
  const { role, canAccessAdminFeatures } = useRole();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      handleProfileMenuClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const filteredNavItems = navigationItems.filter(item => {
    if (item.adminOnly && !canAccessAdminFeatures()) {
      return false;
    }
    return true;
  });

  const drawer = (
    <Box>
      {/* Logo del centro */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={3}
        px={2}
      >
        <Psychology sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          Centro Psicológico
        </Typography>
      </Box>

      <Divider />

      {/* Información del usuario */}
      <Box p={2}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={user?.profileImage}
            sx={{ width: 40, height: 40, mr: 2 }}
          >
            {user?.displayName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {user?.displayName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {role === 'admin' ? 'Administrador' : 
               role === 'psychologist' ? 'Psicólogo' : 'Paciente'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Navegación */}
      <List sx={{ px: 1, py: 2 }}>
        {filteredNavItems.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            badge={item.badge}
            onClick={() => isMobile && setMobileOpen(false)}
          />
        ))}
      </List>
    </Box>
  );

  return (
    <Box display="flex">
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>

          {/* Notificaciones */}
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Configuración */}
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Settings />
          </IconButton>

          {/* Perfil del usuario */}
          <IconButton
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <Avatar
              src={user?.profileImage}
              sx={{ width: 32, height: 32 }}
            >
              {user?.displayName?.charAt(0)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <AccountCircle sx={{ mr: 2 }} />
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <Settings sx={{ mr: 2 }} />
              Configuración
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSignOut}>
              <Logout sx={{ mr: 2 }} />
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default',
        }}
      >
        {/* Banner de verificación de email */}
        <EmailVerificationBanner />
        
        {children}
      </Box>
    </Box>
  );
}