'use client';

import React, { useState, useEffect } from 'react';
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
  Collapse,
  Paper,
  LinearProgress,
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
  ExpandLess,
  ExpandMore,
  BusinessCenter,
  Work,
  Brightness4,
  Brightness7,
  Dashboard as DashboardIcon,
  TrendingUp,
  LocalHospital,
  Security,
  AccountBalance,
  People,
  EventNote,
  Assessment,
  Warning,
  Campaign,
  Star,
  AutoAwesome,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/hooks/useRole';
import { useAlerts, useRecentAlerts } from '@/hooks/useAlerts';
import SidebarItem from './SidebarItem';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import { getNavigationItemsForRole, getNavigationItemsByCategory } from '@/constants/navigation';
import { AlertType, AlertUrgency } from '@/types/alert';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const drawerWidth = 380; // Aumentado para mejor espaciado

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Componente para el botón de notificaciones flotante mejorado
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
      <Zoom in timeout={800}>
        <Tooltip title="Centro de Notificaciones" placement="left">
          <Fab
            color="primary"
            aria-label="notifications"
            onClick={handleClick}
            className="animate-float"
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              width: 64,
              height: 64,
              background: activeAlertsCount > 0 
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
              boxShadow: activeAlertsCount > 0
                ? '0 8px 32px rgba(239, 68, 68, 0.4)'
                : '0 8px 32px rgba(93, 79, 176, 0.4)',
              '&:hover': {
                transform: 'scale(1.1) translateY(-2px)',
                boxShadow: activeAlertsCount > 0
                  ? '0 12px 40px rgba(239, 68, 68, 0.5)'
                  : '0 12px 40px rgba(93, 79, 176, 0.5)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 1300,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                background: activeAlertsCount > 0
                  ? 'linear-gradient(135deg, #ef4444, #dc2626, #ef4444)'
                  : 'linear-gradient(135deg, #5D4FB0, #A593F3, #A5CAE6)',
                borderRadius: '50%',
                zIndex: -1,
                opacity: 0.3,
                animation: activeAlertsCount > 0 ? 'pulse 2s infinite' : 'none',
              },
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
                  fontFamily: '"Outfit", sans-serif',
                  animation: activeAlertsCount > 0 ? 'pulse 2s infinite' : 'none',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  color: '#dc2626',
                  border: '2px solid #ffffff',
                }
              }}
            >
              {activeAlertsCount > 0 ? (
                <NotificationsActive sx={{ fontSize: 32, color: 'white' }} />
              ) : (
                <Notifications sx={{ fontSize: 32, color: 'white' }} />
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
            width: { xs: '90vw', sm: 440 },
            maxHeight: 640,
            borderRadius: 6,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(145deg, #1A1B2E 0%, #252640 100%)'
              : 'linear-gradient(145deg, #FFFFFF 0%, #FAFBFF 100%)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            boxShadow: theme.shadows[24],
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }
        }}
      >
        {/* Header del panel de notificaciones mejorado */}
        <Box
          sx={{
            p: 4,
            background: 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
            color: 'white',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              pointerEvents: 'none',
            },
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" position="relative" zIndex={1}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', mb: 0.5 }}>
                Centro de Notificaciones
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontFamily: '"Inter", sans-serif' }}>
                {activeAlertsCount > 0 ? `${activeAlertsCount} alertas requieren atención` : 'Todo está bajo control'}
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
                color: 'white',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.25)',
                  transform: 'scale(1.1)',
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
            <Box sx={{ p: 4 }}>
              <Stack spacing={2}>
                <LinearProgress sx={{ borderRadius: 1 }} />
                <Typography color="text.secondary" textAlign="center" fontFamily='"Inter", sans-serif'>
                  Cargando notificaciones...
                </Typography>
              </Stack>
            </Box>
          ) : recentAlerts.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 3, opacity: 0.8 }} />
              <Typography variant="h6" color="text.primary" sx={{ mb: 1, fontFamily: '"Outfit", sans-serif', fontWeight: 600 }}>
                ¡Excelente trabajo!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: '"Inter", sans-serif' }}>
                No hay alertas pendientes en este momento.<br />
                El centro está funcionando perfectamente.
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {recentAlerts.map((alert, index) => (
                <Fade in timeout={300 + index * 100} key={alert.id}>
                  <Box>
                    <ListItemButton
                      sx={{
                        py: 3,
                        px: 4,
                        borderLeft: `4px solid ${getUrgencyColor(alert.urgency)}`,
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '100%',
                          background: `linear-gradient(90deg, ${alpha(getUrgencyColor(alert.urgency), 0.05)} 0%, transparent 100%)`,
                          pointerEvents: 'none',
                        },
                        '&:hover': {
                          background: alpha(getUrgencyColor(alert.urgency), 0.08),
                          transform: 'translateX(4px)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 48 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${alpha(getUrgencyColor(alert.urgency), 0.1)} 0%, ${alpha(getUrgencyColor(alert.urgency), 0.2)} 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {getAlertIcon(alert.type)}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 600,
                                fontFamily: '"Outfit", sans-serif',
                                flex: 1,
                                color: 'text.primary',
                              }}
                            >
                              {alert.title}
                            </Typography>
                            <Chip
                              label={getUrgencyLabel(alert.urgency)}
                              size="small"
                              sx={{
                                background: `linear-gradient(135deg, ${getUrgencyColor(alert.urgency)} 0%, ${alpha(getUrgencyColor(alert.urgency), 0.8)} 100%)`,
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                height: 24,
                                fontFamily: '"Outfit", sans-serif',
                                '& .MuiChip-label': {
                                  px: 1.5,
                                },
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
                                mb: 2,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                fontFamily: '"Inter", sans-serif',
                                lineHeight: 1.5,
                              }}
                            >
                              {alert.description}
                            </Typography>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ 
                                  fontFamily: '"Inter", sans-serif',
                                  fontWeight: 500,
                                }}
                              >
                                {formatTimeAgo(alert.createdAt)}
                              </Typography>
                              <Chip
                                label={alert.status === 'activa' ? 'Activa' : 'Resuelta'}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: '0.65rem',
                                  height: 20,
                                  fontFamily: '"Outfit", sans-serif',
                                  fontWeight: 500,
                                  color: alert.status === 'activa' ? 'primary.main' : 'success.main',
                                  borderColor: alert.status === 'activa' ? 'primary.main' : 'success.main',
                                  background: alert.status === 'activa' 
                                    ? alpha(theme.palette.primary.main, 0.05)
                                    : alpha(theme.palette.success.main, 0.05),
                                }}
                              />
                            </Stack>
                          </Box>
                        }
                      />
                    </ListItemButton>
                    {index < recentAlerts.length - 1 && (
                      <Divider sx={{ ml: 8, opacity: 0.2 }} />
                    )}
                  </Box>
                </Fade>
              ))}
            </List>
          )}
        </Box>

        {/* Footer con acciones mejorado */}
        {recentAlerts.length > 0 && (
          <Box
            sx={{
              p: 3,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              background: alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <Stack direction="row" spacing={2}>
              <Button
                size="medium"
                startIcon={<MarkEmailRead />}
                variant="contained"
                sx={{
                  flex: 1,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontFamily: '"Outfit", sans-serif',
                  background: 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #A593F3 0%, #5D4FB0 100%)',
                  },
                }}
              >
                Marcar como leídas
              </Button>
              <Button
                size="medium"
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontFamily: '"Outfit", sans-serif',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  },
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
  const [ceoSectionOpen, setCeoSectionOpen] = useState(true);
  const [operativeSectionOpen, setOperativeSectionOpen] = useState(true);
  
  const { user, signOut } = useAuth();
  const { role } = useRole();
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

  // Obtener elementos de navegación por categoría
  const principalItems = getNavigationItemsByCategory(role || 'patient', 'principal');
  const ceoItems = getNavigationItemsByCategory(role || 'patient', 'ceo');
  const operativeItems = getNavigationItemsByCategory(role || 'patient', 'operativo');

  const drawer = (
    <Box 
      sx={{ 
        height: '100%',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(180deg, #0F0F1A 0%, #1A1B2E 100%)'
          : 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: theme.palette.mode === 'dark' 
            ? 'radial-gradient(circle at 20% 20%, rgba(124, 111, 220, 0.15) 0%, transparent 60%)'
            : 'radial-gradient(circle at 20% 20%, rgba(93, 79, 176, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '60%',
          height: '40%',
          background: theme.palette.mode === 'dark' 
            ? 'radial-gradient(circle at 80% 80%, rgba(165, 147, 243, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 80% 80%, rgba(165, 202, 230, 0.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      {/* Logo del centro mejorado */}
      <Fade in timeout={600}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          py={4}
          px={4}
          position="relative"
          zIndex={1}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 3,
              boxShadow: '0 8px 32px rgba(93, 79, 176, 0.3)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                background: 'linear-gradient(135deg, #5D4FB0, #A593F3, #A5CAE6)',
                borderRadius: 5,
                zIndex: -1,
                opacity: 0.3,
              },
            }}
          >
            <Psychology sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Box>
            <Typography 
              variant="h5" 
              fontWeight="800" 
              sx={{ 
                fontFamily: '"Outfit", sans-serif',
                background: 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2,
              }}
            >
              Centro
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight="800" 
              sx={{ 
                fontFamily: '"Outfit", sans-serif',
                background: 'linear-gradient(135deg, #A593F3 0%, #A5CAE6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mt: -0.5,
                lineHeight: 1.2,
              }}
            >
              Psicológico
            </Typography>
          </Box>
        </Box>
      </Fade>

      <Divider sx={{ mx: 3, opacity: 0.2 }} />

      {/* Información del usuario mejorada */}
      <Slide direction="right" in timeout={800}>
        <Box p={4} position="relative" zIndex={1}>
          <Paper 
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(124, 111, 220, 0.1) 0%, rgba(165, 147, 243, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(93, 79, 176, 0.08) 0%, rgba(165, 147, 243, 0.04) 100%)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(124, 111, 220, 0.15) 0%, rgba(165, 147, 243, 0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(93, 79, 176, 0.12) 0%, rgba(165, 147, 243, 0.06) 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(93, 79, 176, 0.15)',
              }
            }}
            onClick={handleProfileMenuOpen}
          >
            <Stack direction="row" alignItems="center" spacing={3}>
              <Avatar
                src={user?.profileImage}
                sx={{ 
                  width: 52, 
                  height: 52,
                  background: 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
                  boxShadow: '0 4px 16px rgba(93, 79, 176, 0.3)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  fontFamily: '"Outfit", sans-serif',
                }}
              >
                {user?.displayName?.charAt(0)}
              </Avatar>
              <Box flexGrow={1}>
                <Typography 
                  variant="subtitle1" 
                  fontWeight="700" 
                  sx={{ 
                    mb: 0.5, 
                    fontFamily: '"Outfit", sans-serif',
                    color: 'text.primary',
                  }}
                >
                  {user?.displayName}
                </Typography>
                <Chip
                  label={role === 'admin' ? 'CEO Ejecutivo' : 
                        role === 'psychologist' ? 'Psicólogo Profesional' : 'Paciente'}
                  size="small"
                  sx={{
                    background: role === 'admin' 
                      ? 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)'
                      : role === 'psychologist'
                      ? 'linear-gradient(135deg, #A593F3 0%, #A5CAE6 100%)'
                      : 'linear-gradient(135deg, #A5CAE6 0%, #D97DB7 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 24,
                    fontFamily: '"Outfit", sans-serif',
                  }}
                />
              </Box>
              <Settings 
                sx={{ 
                  color: 'text.secondary', 
                  fontSize: 20,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                    transform: 'rotate(90deg)',
                  }
                }} 
              />
            </Stack>
          </Paper>

          {/* Menú de perfil mejorado */}
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
                borderRadius: 4,
                mt: 1,
                minWidth: 220,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(145deg, #1A1B2E 0%, #252640 100%)'
                  : 'linear-gradient(145deg, #FFFFFF 0%, #FAFBFF 100%)',
                boxShadow: theme.shadows[12],
                border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }
            }}
          >
            <MenuItem 
              onClick={handleProfileMenuClose}
              sx={{ 
                borderRadius: 2, 
                mx: 1, 
                my: 0.5,
                py: 1.5,
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 500,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateX(4px)',
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
                py: 1.5,
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 500,
                '&:hover': {
                  background: alpha(theme.palette.info.main, 0.08),
                  transform: 'translateX(4px)',
                }
              }}
            >
              <Settings sx={{ mr: 2, color: 'info.main' }} />
              Configuración
            </MenuItem>
            <Divider sx={{ my: 1, opacity: 0.3 }} />
            <MenuItem 
              onClick={handleSignOut}
              sx={{ 
                borderRadius: 2, 
                mx: 1, 
                my: 0.5,
                py: 1.5,
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 500,
                '&:hover': {
                  background: alpha(theme.palette.error.main, 0.08),
                  transform: 'translateX(4px)',
                }
              }}
            >
              <Logout sx={{ mr: 2, color: 'error.main' }} />
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Box>
      </Slide>

      <Divider sx={{ mx: 3, opacity: 0.2 }} />

      {/* Navegación mejorada */}
      <Box sx={{ px: 3, py: 2, position: 'relative', zIndex: 1, flex: 1, overflow: 'auto' }}>
        {/* Dashboard Principal */}
        {principalItems.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="overline" 
              sx={{ 
                px: 2, 
                mb: 3, 
                display: 'block',
                fontWeight: 700,
                color: 'text.primary',
                letterSpacing: '0.1em',
                fontFamily: '"Outfit", sans-serif',
                fontSize: '0.8rem',
              }}
            >
              Dashboard Principal
            </Typography>
            <List sx={{ p: 0 }}>
              {principalItems.map((item, index) => (
                <Fade in timeout={600 + index * 100} key={item.path}>
                  <Box>
                    <SidebarItem
                      icon={item.icon}
                      label={item.label}
                      path={item.path}
                      onClick={() => isMobile && setMobileOpen(false)}
                      adminOnly={item.adminOnly}
                      description={item.description}
                      category={item.category}
                    />
                  </Box>
                </Fade>
              ))}
            </List>
          </Box>
        )}

        {/* Secciones CEO (solo para admin) - MEJORADO */}
        {role === 'admin' && ceoItems.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(93, 79, 176, 0.15) 0%, rgba(165, 147, 243, 0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(93, 79, 176, 0.08) 0%, rgba(165, 147, 243, 0.04) 100%)',
                border: `1px solid ${alpha('#5D4FB0', 0.2)}`,
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(90deg, #5D4FB0 0%, #A593F3 50%, #A5CAE6 100%)',
                },
              }}
            >
              <ListItemButton
                onClick={() => setCeoSectionOpen(!ceoSectionOpen)}
                sx={{
                  py: 3,
                  px: 4,
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(93, 79, 176, 0.12) 0%, rgba(165, 147, 243, 0.06) 100%)',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 48 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 20px rgba(93, 79, 176, 0.4)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -1,
                        left: -1,
                        right: -1,
                        bottom: -1,
                        background: 'linear-gradient(135deg, #5D4FB0, #A593F3, #A5CAE6)',
                        borderRadius: 4,
                        zIndex: -1,
                        opacity: 0.3,
                      },
                    }}
                  >
                    <BusinessCenter sx={{ color: 'white', fontSize: 22 }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 800,
                          color: '#5D4FB0',
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: '1rem',
                        }}
                      >
                        Panel Ejecutivo CEO
                      </Typography>
                      <Star sx={{ color: '#FFD700', fontSize: 16 }} />
                    </Box>
                  }
                  secondary={
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: alpha('#5D4FB0', 0.8),
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    >
                      Métricas estratégicas y análisis ejecutivo
                    </Typography>
                  }
                />
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    label={ceoItems.length}
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      minWidth: 24,
                      height: 24,
                    }}
                  />
                  {ceoSectionOpen ? 
                    <ExpandLess sx={{ color: '#5D4FB0', fontSize: 24 }} /> : 
                    <ExpandMore sx={{ color: '#5D4FB0', fontSize: 24 }} />
                  }
                </Box>
              </ListItemButton>
              
              <Collapse in={ceoSectionOpen} timeout="auto" unmountOnExit>
                <Box sx={{ pb: 2 }}>
                  <List sx={{ p: 0, pl: 2 }}>
                    {ceoItems.map((item, index) => (
                      <Fade in timeout={600 + index * 100} key={item.path}>
                        <Box>
                          <SidebarItem
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            onClick={() => isMobile && setMobileOpen(false)}
                            adminOnly={item.adminOnly}
                            description={item.description}
                            category={item.category}
                          />
                        </Box>
                      </Fade>
                    ))}
                  </List>
                </Box>
              </Collapse>
            </Paper>
          </Box>
        )}

        {/* Secciones Operativas */}
        {operativeItems.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(165, 147, 243, 0.12) 0%, rgba(165, 202, 230, 0.06) 100%)'
                  : 'linear-gradient(135deg, rgba(165, 147, 243, 0.08) 0%, rgba(165, 202, 230, 0.04) 100%)',
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(90deg, #A593F3 0%, #A5CAE6 50%, #D97DB7 100%)',
                },
              }}
            >
              <ListItemButton
                onClick={() => setOperativeSectionOpen(!operativeSectionOpen)}
                sx={{
                  py: 3,
                  px: 4,
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(165, 147, 243, 0.12) 0%, rgba(165, 202, 230, 0.06) 100%)',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 48 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #A593F3 0%, #A5CAE6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 20px rgba(165, 147, 243, 0.4)',
                    }}
                  >
                    <Work sx={{ color: 'white', fontSize: 22 }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 800,
                          color: theme.palette.secondary.main,
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: '1rem',
                        }}
                      >
                        Operaciones Clínicas
                      </Typography>
                      <AutoAwesome sx={{ color: theme.palette.secondary.main, fontSize: 16 }} />
                    </Box>
                  }
                  secondary={
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: alpha(theme.palette.secondary.main, 0.8),
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    >
                      Gestión diaria del centro psicológico
                    </Typography>
                  }
                />
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    label={operativeItems.length}
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #A593F3 0%, #A5CAE6 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      minWidth: 24,
                      height: 24,
                    }}
                  />
                  {operativeSectionOpen ? 
                    <ExpandLess sx={{ color: theme.palette.secondary.main, fontSize: 24 }} /> : 
                    <ExpandMore sx={{ color: theme.palette.secondary.main, fontSize: 24 }} />
                  }
                </Box>
              </ListItemButton>
              
              <Collapse in={operativeSectionOpen} timeout="auto" unmountOnExit>
                <Box sx={{ pb: 2 }}>
                  <List sx={{ p: 0, pl: 2 }}>
                    {operativeItems.map((item, index) => (
                      <Fade in timeout={600 + index * 100} key={item.path}>
                        <Box>
                          <SidebarItem
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            onClick={() => isMobile && setMobileOpen(false)}
                            adminOnly={item.adminOnly}
                            description={item.description}
                            category={item.category}
                          />
                        </Box>
                      </Fade>
                    ))}
                  </List>
                </Box>
              </Collapse>
            </Paper>
          </Box>
        )}
      </Box>

      {/* Footer del sidebar mejorado */}
      <Box 
        sx={{ 
          mt: 'auto', 
          p: 4, 
          position: 'relative', 
          zIndex: 1,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(165, 202, 230, 0.1) 0%, rgba(217, 125, 183, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(165, 202, 230, 0.08) 0%, rgba(217, 125, 183, 0.04) 100%)',
            border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
            textAlign: 'center',
          }}
        >
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              display: 'block', 
              mb: 1, 
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 600,
            }}
          >
            Centro Psicológico v2.0
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              fontFamily: '"Inter", sans-serif',
              opacity: 0.7,
            }}
          >
            © 2024 Todos los derechos reservados
          </Typography>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box display="flex" sx={{ minHeight: '100vh' }}>
      {/* Fondo de partículas */}
      <Box className="particles-background" />
      
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Botón de menú móvil flotante mejorado */}
        {isMobile && (
          <Zoom in timeout={600}>
            <Fab
              color="secondary"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{
                position: 'fixed',
                top: 32,
                left: 32,
                zIndex: 1300,
                width: 56,
                height: 56,
                background: 'linear-gradient(135deg, #A593F3 0%, #5D4FB0 100%)',
                boxShadow: '0 8px 32px rgba(165, 147, 243, 0.4)',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 12px 40px rgba(165, 147, 243, 0.5)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <MenuIcon sx={{ fontSize: 28 }} />
            </Fab>
          </Zoom>
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
          <Box display="flex" justifyContent="flex-end" p={2}>
            <IconButton 
              onClick={handleDrawerToggle}
              sx={{
                background: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
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
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenido principal mejorado */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #0F0F1A 0%, #1A1B2E 100%)'
            : 'linear-gradient(135deg, #F2EDEA 0%, #F8F6F4 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.palette.mode === 'dark' 
              ? 'radial-gradient(circle at 70% 30%, rgba(124, 111, 220, 0.08) 0%, transparent 60%)'
              : 'radial-gradient(circle at 70% 30%, rgba(93, 79, 176, 0.05) 0%, transparent 60%)',
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
