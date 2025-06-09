import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkReadIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import NotificationCenter from '../Notificaciones/NotificationCenter';
import NotificationSettings from '../Notificaciones/NotificationSettings';
import notificationService from '../../services/notificationService';

const NotificationBell = ({ size = 'medium', showTooltip = true }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCenter, setOpenCenter] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    cargarContadorNoLeidas();
    cargarNotificacionesRecientes();
    
    // Polling cada 30 segundos para actualizar el contador
    const interval = setInterval(() => {
      cargarContadorNoLeidas();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const cargarContadorNoLeidas = async () => {
    try {
      const count = await notificationService.contarNoLeidas();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error cargando contador de no leídas:', error);
    }
  };

  const cargarNotificacionesRecientes = async () => {
    try {
      const notificaciones = await notificationService.obtenerNotificaciones({ 
        limite: 5,
        leida: false 
      });
      setRecentNotifications(notificaciones);
    } catch (error) {
      console.error('Error cargando notificaciones recientes:', error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    cargarNotificacionesRecientes();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenCenter = () => {
    setOpenCenter(true);
    handleClose();
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.marcarComoLeidas();
      setUnreadCount(0);
      setRecentNotifications([]);
      handleClose();
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const iconButton = (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IconButton
          onClick={handleClick}
        size={size}
            sx={{
          color: 'inherit',
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                },
          transition: 'all 0.2s ease-in-out',
        }}
          >
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
              fontWeight: 600,
              fontSize: '0.75rem',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' },
              },
            },
        }}
      >
          <NotificationsIcon sx={{ fontSize: size === 'small' ? 18 : 22 }} />
        </Badge>
      </IconButton>
    </motion.div>
  );

  return (
    <>
      {showTooltip ? (
        <Tooltip title="Notificaciones" placement="bottom">
          {iconButton}
        </Tooltip>
      ) : (
        iconButton
      )}

      {/* Quick Preview Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 450,
            borderRadius: 3,
            mt: 1,
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
            Notificaciones
          </Typography>
          {unreadCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              {unreadCount} sin leer
            </Typography>
          )}
        </Box>

        <Divider />

        <Box sx={{ maxHeight: 280, overflow: 'auto' }}>
          {recentNotifications.length > 0 ? (
            recentNotifications.map((notif, index) => (
              <MenuItem 
                key={notif.id} 
                sx={{ 
                  py: 2, 
                  px: 3,
                  borderBottom: index < recentNotifications.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ mb: 0.5 }}>
                    {notif.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.4 }}>
                    {truncateText(notif.mensaje)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notif.creada).toLocaleTimeString()}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No hay notificaciones recientes
              </Typography>
            </Box>
          )}
        </Box>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleOpenCenter}
            sx={{ 
              mb: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Ver Todas las Notificaciones
          </Button>
          
          {unreadCount > 0 && (
            <Button
              fullWidth
              variant="contained"
              size="small"
              startIcon={<MarkReadIcon />}
              onClick={handleMarkAllRead}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              Marcar Todas como Leídas
            </Button>
          )}
        </Box>
      </Menu>

      {/* Notification Center */}
      <NotificationCenter
        open={openCenter}
        onClose={() => setOpenCenter(false)}
        onOpenSettings={() => setOpenSettings(true)}
      />

      {/* Settings */}
      <NotificationSettings
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </>
  );
};

export default NotificationBell;