import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Badge,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Inventory as StockIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Info as InfoIcon,
  MarkEmailRead as MarkReadIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import notificationService from '../../services/notificationService';

const NotificationCenter = ({ open, onClose, onOpenSettings }) => {
  const theme = useTheme();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    if (open) {
      cargarNotificaciones();
    }
  }, [open, filtroTipo]);

  const cargarNotificaciones = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filtros = {
        limite: 50
      };
      
      if (filtroTipo) {
        filtros.tipo = filtroTipo;
      }
      
      if (tabValue === 1) {
        filtros.leida = false;
      }
      
      const data = await notificationService.obtenerNotificaciones(filtros);
      setNotificaciones(data);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
      setError('Error al cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarTodasLeidas = async () => {
    try {
      await notificationService.marcarComoLeidas();
      await cargarNotificaciones();
    } catch (error) {
      console.error('Error marcando notificaciones como leídas:', error);
      setError('Error al marcar notificaciones como leídas');
    }
  };

  const handleMarcarLeida = async (notificacionId) => {
    try {
      await notificationService.marcarComoLeidas([notificacionId]);
      await cargarNotificaciones();
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setFiltroTipo('');
    } else if (newValue === 1) {
      setFiltroTipo('');
    }
  };

  const getNotificationIcon = (tipo) => {
    const iconProps = { fontSize: 'small' };
    switch (tipo) {
      case 'stock':
        return <StockIcon {...iconProps} />;
      case 'pago':
        return <PaymentIcon {...iconProps} />;
      case 'cobro':
        return <ReceiptIcon {...iconProps} />;
      default:
        return <InfoIcon {...iconProps} />;
    }
  };

  const getNotificationColor = (tipo) => {
    switch (tipo) {
      case 'stock':
        return theme.palette.warning.main;
      case 'pago':
        return theme.palette.error.main;
      case 'cobro':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString();
  };

  const notificacionesFiltradas = notificaciones.filter(notif => {
    if (tabValue === 1) return !notif.leida;
    return true;
  });

  const contarPorTipo = (tipo) => {
    return notificaciones.filter(n => n.tipo === tipo && !n.leida).length;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100vw',
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <NotificationsIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Notificaciones
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                size="small"
                onClick={cargarNotificaciones}
                disabled={loading}
              >
                <RefreshIcon />
              </IconButton>
              
              <IconButton
                size="small"
                onClick={onOpenSettings}
              >
                <SettingsIcon />
              </IconButton>
              
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mt: 1 }}
          >
            <Tab 
              label={
                <Badge 
                  badgeContent={notificaciones.filter(n => !n.leida).length} 
                  color="error"
                  max={99}
                >
                  Todas
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge 
                  badgeContent={notificaciones.filter(n => !n.leida).length} 
                  color="error"
                  max={99}
                >
                  No leídas
                </Badge>
              } 
            />
          </Tabs>
        </Box>

        {/* Filtros por tipo */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Chip
              label="Todas"
              variant={filtroTipo === '' ? 'filled' : 'outlined'}
              onClick={() => setFiltroTipo('')}
              size="small"
            />
            <Chip
              label={`Stock (${contarPorTipo('stock')})`}
              variant={filtroTipo === 'stock' ? 'filled' : 'outlined'}
              onClick={() => setFiltroTipo('stock')}
              color="warning"
              size="small"
            />
            <Chip
              label={`Pagos (${contarPorTipo('pago')})`}
              variant={filtroTipo === 'pago' ? 'filled' : 'outlined'}
              onClick={() => setFiltroTipo('pago')}
              color="error"
              size="small"
            />
            <Chip
              label={`Cobros (${contarPorTipo('cobro')})`}
              variant={filtroTipo === 'cobro' ? 'filled' : 'outlined'}
              onClick={() => setFiltroTipo('cobro')}
              color="info"
              size="small"
            />
          </Box>
        </Box>

        {/* Actions */}
        {notificacionesFiltradas.some(n => !n.leida) && (
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Button
              startIcon={<MarkReadIcon />}
              onClick={handleMarcarTodasLeidas}
              variant="outlined"
              size="small"
              fullWidth
            >
              Marcar todas como leídas
            </Button>
          </Box>
        )}

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 200 }}>
              <CircularProgress />
            </Box>
          ) : notificacionesFiltradas.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ height: 200, p: 3 }}
            >
              <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" textAlign="center">
                {tabValue === 1 ? 'No tienes notificaciones sin leer' : 'No hay notificaciones'}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              <AnimatePresence>
                {notificacionesFiltradas.map((notificacion, index) => (
                  <motion.div
                    key={notificacion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <ListItem
                      sx={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        bgcolor: notificacion.leida 
                          ? 'transparent' 
                          : alpha(getNotificationColor(notificacion.tipo), 0.05),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.action.hover, 0.5),
                        },
                        cursor: notificacion.leida ? 'default' : 'pointer',
                      }}
                      onClick={() => !notificacion.leida && handleMarcarLeida(notificacion.id)}
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: '50%',
                            bgcolor: alpha(getNotificationColor(notificacion.tipo), 0.1),
                            color: getNotificationColor(notificacion.tipo),
                          }}
                        >
                          {getNotificationIcon(notificacion.tipo)}
                        </Box>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                              variant="subtitle2"
                              fontWeight={notificacion.leida ? 400 : 600}
                              sx={{ flex: 1 }}
                            >
                              {notificacion.titulo}
                            </Typography>
                            {!notificacion.leida && (
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: getNotificationColor(notificacion.tipo),
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ 
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mb: 0.5,
                              }}
                            >
                              {notificacion.mensaje}
                            </Typography>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Typography variant="caption" color="text.secondary">
                                {formatearFecha(notificacion.creada)}
                              </Typography>
                              <Chip
                                label={notificacion.tipo}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  textTransform: 'capitalize',
                                  fontSize: '0.7rem',
                                  height: 20,
                                }}
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </List>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default NotificationCenter;