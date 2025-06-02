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
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkReadIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import NotificationCenter from '../Notificaciones/NotificationCenter';
import NotificationSettings from '../Notificaciones/NotificationSettings';
import notificationService from '../../services/notificationService';

const NotificationBell = () => {
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

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IconButton
          onClick={handleClick}
          sx={{
            color: 'inherit',
            '&:hover': {
              bgcolor: alpha(theme.palette.common.white, 0.1),
            },
          }}
        >
          <Badge 
            badgeContent={unreadCount} 
            color="error"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' },
                  '100%': { transform: 'scale(1)' },
                },
              },
            }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </motion.div>

      {/* Quick Preview Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
            borderRadius: 2,
            mt: 1,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Notificaciones
          </Typography>
          {unreadCount > 0 && (
            <Typography variant="caption" color="text.secondary">
              {unreadCount} sin leer
            </Typography>
          )}
        </Box>

        <Divider />

        {recentNotifications.length > 0 ? (
          recentNotifications.map((notif, index) => (
            <MenuItem key={notif.id} sx={{ py: 1.5, px: 2 }}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle2" fontWeight={600} noWrap>
                  {notif.titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {truncateText(notif.mensaje)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notif.creada).toLocaleTimeString()}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No hay notificaciones recientes
            </Typography>
          </MenuItem>
        )}

        <Divider />

        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            variant="text"
            onClick={handleOpenCenter}
            sx={{ mb: 1 }}
          >
            Ver Todas las Notificaciones
          </Button>
          
          {unreadCount > 0 && (
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<MarkReadIcon />}
              onClick={handleMarkAllRead}
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