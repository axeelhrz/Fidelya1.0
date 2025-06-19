'use client';

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Fab,
  Badge,
  Popover,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Chip,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Slide,
  Zoom,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  NotificationsActive,
  Settings,
  Logout,
  Psychology,
  AccountCircle,
  Close,
  MarkEmailRead,
  Schedule,
  Emergency,
  Medication,
  Event,
  Info,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/hooks/useRole';
import { useAlerts, useRecentAlerts } from '@/hooks/useAlerts';
import SidebarItem from './SidebarItem';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import { navigationItems } from '@/constants/navigation';
import { AlertType, AlertUrgency } from '@/types/alert';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const drawerWidth = 300;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Componente para el botón de notificaciones flotante
function FloatingNotificationButton() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { alerts: recentAlerts, loading } = useRecentAlerts(10);
  const { alerts: activeAlerts } = useAlerts({ status: 'activa' });

  const open = Boolean(anchorEl);
  const activeAlertsCount = activeAlerts.length;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getAlertIcon = (type: AlertType) => {
    const iconProps = { fontSize: 'small' as const };
    switch (type) {
      case 'emergency': return <Emergency {...iconProps} sx={{ color: theme.palette.error.main }} />;
      case 'appointment': return <Event {...iconProps} sx={{ color: theme.palette.primary.main }} />;
      case 'medication': return <Medication {...iconProps} sx={{ color: theme.palette.success.main }} />;
      case 'followup': return <Event {...iconProps} sx={{ color: theme.palette.info.main }} />;
      case 'síntoma': return <Psychology {...iconProps} sx={{ color: theme.palette.warning.main }} />;
      case 'inactividad': return <Schedule {...iconProps} sx={{ color: theme.palette.secondary.main }} />;
      default: return <Info {...iconProps} sx={{ color: theme.palette.text.secondary }} />;
    }
  };

  const getUrgencyColor = (urgency: AlertUrgency) => {
    switch (urgency) {
      case 'crítica': return theme.palette.error.main;
      case 'alta': return theme.palette.warning.main;
      case 'media': return theme.palette.info.main;
      case 'baja': return theme.palette.success.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getUrgencyLabel = (urgency: AlertUrgency) => {
    switch (urgency) {
      case 'crítica': return 'Crítica';
      case 'alta': return 'Alta';
      case 'media': return 'Media';
      case 'baja': return 'Baja';
      default: return urgency;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return format(date, 'dd/MM', { locale: es });
  };

  return (
    <>
      <Zoom in timeout={600}>
        <Tooltip title="Notificaciones y alertas" placement="left">
          <Fab
            color="primary"
            aria-label="notifications"
            onClick={handleClick}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: activeAlertsCount > 0 
                ? `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.error.main} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              boxShadow: `0 8px 32px ${alpha(
                activeAlertsCount > 0 ? theme.palette.warning.main : theme.palette.primary.main, 
                0.3
              )}`,
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: `0 12px 40px ${alpha(
                  activeAlertsCount > 0 ? theme.palette.warning.main : theme.palette.primary.main, 
                  0.4
                )}`,
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 1300,
            }}
          >
            <Badge 
              badgeContent={activeAlertsCount} 
              color="error"
              max={99}
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  animation: activeAlertsCount > 0 ? 'pulse 2s infinite' : 'none',
                }
              }}
            >
              {activeAlertsCount > 0 ? (
                <NotificationsActive sx={{ fontSize: 28 }} />
              ) : (
                <Notifications sx={{ fontSize: 28 }} />
              )}
            </Badge>
          </Fab>
        </Tooltip>
      </Zoom>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: { xs: '90vw', sm: 420 },
            maxHeight: 600,
            borderRadius: 4,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            boxShadow: theme.shadows[20],
            overflow: 'hidden',
          }
        }}
      >
        {/* Header del panel de notificaciones */}
        <Box
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: theme.palette.primary.contrastText,
            position: 'relative',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: '"Inter", sans-serif' }}>
                Notificaciones
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {activeAlertsCount > 0 ? `${activeAlertsCount} alertas activas` : 'Todo al día'}
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
                color: theme.palette.primary.contrastText,
                background: alpha(theme.palette.primary.contrastText, 0.1),
                '&:hover': {
                  background: alpha(theme.palette.primary.contrastText, 0.2),
                }
              }}
            >
              <Close />
            </IconButton>
          </Stack>
        </Box>

        {/* Contenido de notificaciones */}
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">Cargando notificaciones...</Typography>
            </Box>
          ) : recentAlerts.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Sin notificaciones
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No hay alertas pendientes en este momento
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {recentAlerts.map((alert, index) => (
                <Fade in timeout={300 + index * 100} key={alert.id}>
                  <Box>
                    <ListItemButton
                      sx={{
                        py: 2,
                        px: 3,
                        borderLeft: `4px solid ${getUrgencyColor(alert.urgency)}`,
                        '&:hover': {
                          background: alpha(getUrgencyColor(alert.urgency), 0.05),
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {getAlertIcon(alert.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 600,
                                fontFamily: '"Inter", sans-serif',
                                flex: 1
                              }}
                            >
                              {alert.title}
                            </Typography>
                            <Chip
                              label={getUrgencyLabel(alert.urgency)}
                              size="small"
                              sx={{
                                backgroundColor: alpha(getUrgencyColor(alert.urgency), 0.1),
                                color: getUrgencyColor(alert.urgency),
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                height: 20,
                              }}
                            />
                          </Stack>
                        }
                        secondary={
                          <Box>
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ 
                                mb: 1,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {alert.description}
                            </Typography>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Typography variant="caption" color="text.secondary">
                                {formatTimeAgo(alert.createdAt)}
                              </Typography>
                              <Chip
                                label={alert.status}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: '0.65rem',
                                  height: 18,
                                  color: alert.status === 'activa' ? 'primary.main' : 'success.main',
                                  borderColor: alert.status === 'activa' ? 'primary.main' : 'success.main',
                                }}
                              />
                            </Stack>
                          </Box>
                        }
                      />
                    </ListItemButton>
                    {index < recentAlerts.length - 1 && (
                      <Divider sx={{ ml: 7, opacity: 0.3 }} />
                    )}
                  </Box>
                </Fade>
              ))}
            </List>
          )}
        </Box>

        {/* Footer con acciones */}
        {recentAlerts.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                startIcon={<MarkEmailRead />}
                sx={{
                  flex: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Marcar como leídas
              </Button>
              <Button
                size="small"
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
                onClick={handleClose}
              >
                Ver todas
              </Button>
            </Stack>
          </Box>
        )}
      </Popover>

      {/* Estilos para animación de pulso */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
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
            <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: '"Inter", "Poppins", sans-serif' }}>
              Centro
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: '"Inter", "Poppins", sans-serif', mt: -0.5 }}>
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
              cursor: 'pointer',
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.08),
                transform: 'translateY(-2px)',
              }
            }}
            onClick={handleProfileMenuOpen}
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
            <Settings sx={{ color: 'text.secondary', fontSize: 20 }} />
          </Box>

          {/* Menú de perfil */}
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
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Botón de menú móvil flotante */}
        {isMobile && (
          <Fab
            color="secondary"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{
              position: 'fixed',
              top: 24,
              left: 24,
              zIndex: 1300,
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
              '&:hover': {
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <MenuIcon />
          </Fab>
        )}

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
          minHeight: '100vh',
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

      {/* Botón de notificaciones flotante */}
      <FloatingNotificationButton />
    </Box>
  );
}