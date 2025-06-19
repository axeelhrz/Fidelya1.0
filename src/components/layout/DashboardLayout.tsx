'use client';

import React, { useState } from 'react';
import {
  Box,
  Fab,
  Badge,
  Popover,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  IconButton,
  Chip,
  Stack,
  Button,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Tooltip,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  Warning,
  Info,
  Error,
  CheckCircle,
  Close,
  MarkEmailRead,
  Schedule,
  Person,
  Psychology,
  Emergency,
  Medication,
  Event,
  AssignmentTurnedIn,
  Custom,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { useAlerts, useRecentAlerts } from '@/hooks/useAlerts';
import { ClinicalAlert, AlertType, AlertUrgency } from '@/types/alert';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Componente para el botón de notificaciones flotante
function FloatingNotificationButton() {
  const theme = useTheme();
  const { user } = useAuth();
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
      case 'followup': return <AssignmentTurnedIn {...iconProps} sx={{ color: theme.palette.info.main }} />;
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
  const theme = useTheme();

  return (
    <Box
      sx={{
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
      {/* Contenido principal sin navbar */}
      <Box
        component="main"
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>

      {/* Botón de notificaciones flotante */}
      <FloatingNotificationButton />
    </Box>
  );
}