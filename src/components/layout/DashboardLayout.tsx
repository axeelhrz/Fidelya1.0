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
  alpha,
  Fade,
  Slide,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Settings,
  Logout,
  Psychology,
  AccountCircle,
  Close,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/hooks/useRole';
import SidebarItem from './SidebarItem';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import { navigationItems } from '@/constants/navigation';

const drawerWidth = 300;

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
    <Box 
      sx={{ 
        height: '100%',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(180deg, #1a1d29 0%, #252a3a 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: theme.palette.mode === 'dark' 
            ? 'radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      {/* Logo del centro */}
      <Fade in timeout={600}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          py={4}
          px={3}
          position="relative"
          zIndex={1}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              boxShadow: theme.shadows[4],
            }}
          >
            <Psychology sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Poppins' }}>
              Centro
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Poppins', mt: -0.5 }}>
              Psicológico
            </Typography>
          </Box>
        </Box>
      </Fade>

      <Divider sx={{ mx: 2, opacity: 0.3 }} />

      {/* Información del usuario */}
      <Slide direction="right" in timeout={800}>
        <Box p={3} position="relative" zIndex={1}>
          <Box 
            display="flex" 
            alignItems="center" 
            p={2}
            sx={{
              borderRadius: 3,
              background: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.08),
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Avatar
              src={user?.profileImage}
              sx={{ 
                width: 48, 
                height: 48, 
                mr: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                boxShadow: theme.shadows[2],
              }}
            >
              {user?.displayName?.charAt(0)}
            </Avatar>
            <Box flexGrow={1}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 0.5 }}>
                {user?.displayName}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {role === 'admin' ? 'Administrador' : 
                 role === 'psychologist' ? 'Psicólogo' : 'Paciente'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Slide>

      <Divider sx={{ mx: 2, opacity: 0.3 }} />

      {/* Navegación */}
      <Box sx={{ px: 2, py: 3, position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="overline" 
          sx={{ 
            px: 2, 
            mb: 2, 
            display: 'block',
            fontWeight: 600,
            color: 'text.secondary',
            letterSpacing: '0.1em',
          }}
        >
          Navegación
        </Typography>
        <List sx={{ p: 0 }}>
          {filteredNavItems.map((item, index) => (
            <Fade in timeout={600 + index * 100} key={item.path}>
              <Box>
                <SidebarItem
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  onClick={() => isMobile && setMobileOpen(false)}
                />
              </Box>
            </Fade>
          ))}
        </List>
      </Box>

      {/* Footer del sidebar */}
      <Box 
        sx={{ 
          mt: 'auto', 
          p: 3, 
          position: 'relative', 
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: alpha(theme.palette.info.main, 0.05),
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Versión 2.0.0
          </Typography>
          <Typography variant="caption" color="text.secondary">
            © 2024 Centro Psicológico
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box display="flex" sx={{ minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: theme.palette.mode === 'dark' 
            ? 'rgba(26, 29, 41, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: 'none',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              background: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box flexGrow={1}>
            <Typography variant="h6" fontWeight="600" sx={{ fontFamily: 'Poppins' }}>
              Dashboard
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Panel de control inteligente
            </Typography>
          </Box>

          {/* Notificaciones */}
          <IconButton 
            color="inherit" 
            sx={{ 
              mr: 1,
              background: alpha(theme.palette.warning.main, 0.1),
              '&:hover': {
                background: alpha(theme.palette.warning.main, 0.2),
              }
            }}
          >
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Configuración */}
          <IconButton 
            color="inherit" 
            sx={{ 
              mr: 1,
              background: alpha(theme.palette.info.main, 0.1),
              '&:hover': {
                background: alpha(theme.palette.info.main, 0.2),
              }
            }}
          >
            <Settings />
          </IconButton>

          {/* Perfil del usuario */}
          <IconButton
            color="inherit"
            onClick={handleProfileMenuOpen}
            sx={{
              background: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <Avatar
              src={user?.profileImage}
              sx={{ 
                width: 36, 
                height: 36,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              }}
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
            PaperProps={{
              sx: {
                borderRadius: 3,
                mt: 1,
                minWidth: 200,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
                boxShadow: theme.shadows[8],
              }
            }}
          >
            <MenuItem 
              onClick={handleProfileMenuClose}
              sx={{ 
                borderRadius: 2, 
                mx: 1, 
                my: 0.5,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.1),
                }
              }}
            >
              <AccountCircle sx={{ mr: 2, color: 'primary.main' }} />
              Mi Perfil
            </MenuItem>
            <MenuItem 
              onClick={handleProfileMenuClose}
              sx={{ 
                borderRadius: 2, 
                mx: 1, 
                my: 0.5,
                '&:hover': {
                  background: alpha(theme.palette.info.main, 0.1),
                }
              }}
            >
              <Settings sx={{ mr: 2, color: 'info.main' }} />
              Configuración
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem 
              onClick={handleSignOut}
              sx={{ 
                borderRadius: 2, 
                mx: 1, 
                my: 0.5,
                '&:hover': {
                  background: alpha(theme.palette.error.main, 0.1),
                }
              }}
            >
              <Logout sx={{ mr: 2, color: 'error.main' }} />
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
              border: 'none',
            },
          }}
        >
          <Box display="flex" justifyContent="flex-end" p={1}>
            <IconButton onClick={handleDrawerToggle}>
              <Close />
            </IconButton>
          </Box>
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: 'calc(100vh - 64px)',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #0f0f23 0%, #1a1d29 100%)'
            : 'linear-gradient(135deg, #fafbff 0%, #f0f4ff 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.palette.mode === 'dark' 
              ? 'radial-gradient(circle at 70% 30%, rgba(120, 119, 198, 0.05) 0%, transparent 50%)'
              : 'radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)',
            pointerEvents: 'none',
          }
        }}
      >
        {/* Banner de verificación de email */}
        <EmailVerificationBanner />
        
        <Box position="relative" zIndex={1}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}