import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  TextField,
  InputAdornment,
  Stack,
  Divider,
  Avatar,
  Tooltip,
  Fab,
  Collapse,
  Paper,
  LinearProgress,
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
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Star as StarIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import notificationService from '../../services/notificationService';

const NotificationCenter = ({ open, onClose, onOpenSettings }) => {
  const theme = useTheme();
  
  // Estados principales
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados de UI
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [sortBy, setSortBy] = useState('fecha_desc');
  const [expandedStats, setExpandedStats] = useState(false);
  
  // Estados de estadísticas
  const [estadisticas, setEstadisticas] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Cargar notificaciones
  const cargarNotificaciones = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const filtros = {
        limite: 100,
        busqueda: searchTerm,
        tipo: filtroTipo || undefined,
        leida: tabValue === 1 ? false : undefined,
        orden: sortBy,
      };
      
      const data = await notificationService.obtenerNotificaciones(filtros, isRefresh);
      setNotificaciones(data);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
      setError('Error al cargar las notificaciones');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchTerm, filtroTipo, tabValue, sortBy]);

  // Cargar estadísticas
  const cargarEstadisticas = useCallback(async () => {
    setLoadingStats(true);
    try {
      const stats = await notificationService.obtenerEstadisticas();
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Efectos
  useEffect(() => {
    if (open) {
      cargarNotificaciones();
      cargarEstadisticas();
    }
  }, [open, cargarNotificaciones, cargarEstadisticas]);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (open) {
        cargarNotificaciones();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Suscripción a notificaciones en tiempo real
  useEffect(() => {
    if (!open) return;

    const unsubscribe = notificationService.suscribirseNotificaciones((nuevaNotificacion) => {
      setNotificaciones(prev => [nuevaNotificacion, ...prev]);
      cargarEstadisticas();
    });

    return unsubscribe;
  }, [open, cargarEstadisticas]);

  // Handlers
  const handleRefresh = useCallback(() => {
    cargarNotificaciones(true);
    cargarEstadisticas();
  }, [cargarNotificaciones, cargarEstadisticas]);

  const handleMarcarTodasLeidas = useCallback(async () => {
    try {
      await notificationService.marcarComoLeidas();
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
      cargarEstadisticas();
    } catch (error) {
      console.error('Error marcando notificaciones como leídas:', error);
      setError('Error al marcar notificaciones como leídas');
    }
  }, [cargarEstadisticas]);

  const handleMarcarLeida = useCallback(async (notificacionId) => {
    try {
      await notificationService.marcarComoLeidas([notificacionId]);
      setNotificaciones(prev => 
        prev.map(n => n.id === notificacionId ? { ...n, leida: true } : n)
      );
      cargarEstadisticas();
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    }
  }, [cargarEstadisticas]);

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  // Datos computados
  const notificacionesFiltradas = useMemo(() => {
    return notificaciones.filter(notif => {
      const matchSearch = !searchTerm || 
        notif.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.mensaje.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchType = !filtroTipo || notif.tipo === filtroTipo;
      const matchTab = tabValue === 0 || (tabValue === 1 && !notif.leida);
      
      return matchSearch && matchType && matchTab;
    });
  }, [notificaciones, searchTerm, filtroTipo, tabValue]);

  const contadores = useMemo(() => {
    const total = notificaciones.length;
    const noLeidas = notificaciones.filter(n => !n.leida).length;
    const porTipo = {
      stock: notificaciones.filter(n => n.tipo === 'stock' && !n.leida).length,
      pago: notificaciones.filter(n => n.tipo === 'pago' && !n.leida).length,
      cobro: notificaciones.filter(n => n.tipo === 'cobro' && !n.leida).length,
      sistema: notificaciones.filter(n => n.tipo === 'sistema' && !n.leida).length,
    };
    
    return { total, noLeidas, porTipo };
  }, [notificaciones]);

  // Funciones auxiliares
  const getNotificationIcon = (tipo) => {
    const iconProps = { fontSize: 'small' };
    switch (tipo) {
      case 'stock':
        return <StockIcon {...iconProps} />;
      case 'pago':
        return <PaymentIcon {...iconProps} />;
      case 'cobro':
        return <ReceiptIcon {...iconProps} />;
      case 'sistema':
        return <NotificationsIcon {...iconProps} />;
      default:
        return <InfoIcon {...iconProps} />;
    }
  };

  const getNotificationColor = (tipo, prioridad) => {
    if (prioridad === 'alta') return theme.palette.error.main;
    if (prioridad === 'media') return theme.palette.warning.main;
    
    switch (tipo) {
      case 'stock':
        return theme.palette.warning.main;
      case 'pago':
        return theme.palette.error.main;
      case 'cobro':
        return theme.palette.info.main;
      case 'sistema':
        return theme.palette.primary.main;
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
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 420, md: 480 },
          maxWidth: '100vw',
          borderRadius: { sm: '16px 0 0 16px' },
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header Mejorado */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 40,
                  height: 40,
                }}
              >
                <NotificationsIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Centro de Notificaciones
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {contadores.total} notificaciones
                </Typography>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={1}>
              <Tooltip title="Actualizar">
                <IconButton
                  size="small"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                  }}
                >
                  <RefreshIcon sx={{ 
                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    }
                  }} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Configuración">
                <IconButton
                  size="small"
                  onClick={onOpenSettings}
                  sx={{ 
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.2) }
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>

          {/* Barra de progreso */}
          {(loading || refreshing) && (
            <LinearProgress 
              sx={{ 
                borderRadius: 2,
                height: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }} 
            />
          )}

          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mt: 2 }}
          >
            <Tab 
              label={
                <Badge 
                  badgeContent={contadores.total} 
                  color="primary"
                  max={99}
                >
                  Todas
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge 
                  badgeContent={contadores.noLeidas} 
                  color="error"
                  max={99}
                >
                  No leídas
                </Badge>
              } 
            />
          </Tabs>
        </Paper>

        {/* Estadísticas Expandibles */}
        <Paper elevation={0} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box
            sx={{ 
              p: 2, 
              cursor: 'pointer',
              '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.5) }
            }}
            onClick={() => setExpandedStats(!expandedStats)}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2" fontWeight={600}>
                Resumen de Notificaciones
              </Typography>
              {expandedStats ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
          </Box>
          
          <Collapse in={expandedStats}>
            <Box sx={{ p: 2, pt: 0 }}>
              <Stack spacing={2}>
                {/* Contadores por tipo */}
                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Por Tipo (No leídas)
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      icon={<StockIcon fontSize="small" />}
                      label={`Stock: ${contadores.porTipo.stock}`}
                      size="small"
                      color="warning"
                      variant={contadores.porTipo.stock > 0 ? "filled" : "outlined"}
                    />
                    <Chip
                      icon={<PaymentIcon fontSize="small" />}
                      label={`Pagos: ${contadores.porTipo.pago}`}
                      size="small"
                      color="error"
                      variant={contadores.porTipo.pago > 0 ? "filled" : "outlined"}
                    />
                    <Chip
                      icon={<ReceiptIcon fontSize="small" />}
                      label={`Cobros: ${contadores.porTipo.cobro}`}
                      size="small"
                      color="info"
                      variant={contadores.porTipo.cobro > 0 ? "filled" : "outlined"}
                    />
                  </Stack>
                </Box>

                {/* Estadísticas adicionales */}
                {estadisticas && !loadingStats && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Tendencia (7 días)
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      {estadisticas.tendencia?.direccion === 'up' ? (
                        <TrendingUpIcon color="error" fontSize="small" />
                      ) : (
                        <TrendingDownIcon color="success" fontSize="small" />
                      )}
                      <Typography variant="body2">
                        {estadisticas.tendencia?.porcentaje || 0}% vs semana anterior
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Stack>
            </Box>
          </Collapse>
        </Paper>

        {/* Búsqueda y Filtros */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <TextField
            fullWidth
            placeholder="Buscar notificaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              label="Todas"
              variant={filtroTipo === '' ? 'filled' : 'outlined'}
              onClick={() => setFiltroTipo('')}
              size="small"
              color="primary"
            />
            <Chip
              label="Stock"
              variant={filtroTipo === 'stock' ? 'filled' : 'outlined'}
              onClick={() => setFiltroTipo(filtroTipo === 'stock' ? '' : 'stock')}
              size="small"
              color="warning"
            />
            <Chip
              label="Pagos"
              variant={filtroTipo === 'pago' ? 'filled' : 'outlined'}
              onClick={() => setFiltroTipo(filtroTipo === 'pago' ? '' : 'pago')}
              size="small"
              color="error"
            />
            <Chip
              label="Cobros"
              variant={filtroTipo === 'cobro' ? 'filled' : 'outlined'}
              onClick={() => setFiltroTipo(filtroTipo === 'cobro' ? '' : 'cobro')}
              size="small"
              color="info"
            />
          </Stack>
        </Box>

        {/* Acciones Rápidas */}
        {contadores.noLeidas > 0 && (
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Button
              startIcon={<MarkReadIcon />}
              onClick={handleMarcarTodasLeidas}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ borderRadius: 3 }}
            >
              Marcar todas como leídas ({contadores.noLeidas})
            </Button>
          </Box>
        )}

        {/* Lista de Notificaciones */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          )}

          {loading && notificaciones.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 200 }}>
              <CircularProgress />
            </Box>
          ) : notificacionesFiltradas.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ height: 300, p: 3 }}
            >
              <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" textAlign="center" gutterBottom>
                {searchTerm || filtroTipo ? 'No se encontraron notificaciones' : 'No hay notificaciones'}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {searchTerm || filtroTipo 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Las nuevas notificaciones aparecerán aquí'
                }
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0, overflow: 'auto' }}>
              <AnimatePresence>
                {notificacionesFiltradas.map((notificacion, index) => (
                  <motion.div
                    key={notificacion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                  >
                    <ListItem
                      sx={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        bgcolor: notificacion.leida 
                          ? 'transparent' 
                          : alpha(getNotificationColor(notificacion.tipo, notificacion.prioridad), 0.05),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.action.hover, 0.5),
                        },
                        cursor: notificacion.leida ? 'default' : 'pointer',
                        py: 2,
                      }}
                      onClick={() => !notificacion.leida && handleMarcarLeida(notificacion.id)}
                    >
                      <ListItemIcon sx={{ minWidth: 48 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: alpha(getNotificationColor(notificacion.tipo, notificacion.prioridad), 0.1),
                            color: getNotificationColor(notificacion.tipo, notificacion.prioridad),
                          }}
                        >
                          {getNotificationIcon(notificacion.tipo)}
                        </Avatar>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Typography
                              variant="subtitle2"
                              fontWeight={notificacion.leida ? 400 : 600}
                              sx={{ 
                                flex: 1,
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {notificacion.titulo}
                            </Typography>
                            {!notificacion.leida && (
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  bgcolor: getNotificationColor(notificacion.tipo, notificacion.prioridad),
                                  flexShrink: 0,
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
                                mb: 1,
                                lineHeight: 1.3,
                              }}
                            >
                              {notificacion.mensaje}
                            </Typography>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Typography variant="caption" color="text.secondary">
                                {formatearFecha(notificacion.creada)}
                              </Typography>
                              <Stack direction="row" spacing={0.5}>
                                {notificacion.prioridad === 'alta' && (
                                  <Chip
                                    label="Alta"
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    sx={{ fontSize: '0.6rem', height: 16 }}
                                  />
                                )}
                                <Chip
                                  label={notificacion.tipo}
                                  size="small"
                                  variant="outlined"
                                  sx={{ 
                                    textTransform: 'capitalize',
                                    fontSize: '0.6rem',
                                    height: 16,
                                  }}
                                />
                              </Stack>
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

        {/* Footer con acciones */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.background.default, 0.8),
          }}
        >
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              Actualizar
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<SettingsIcon />}
              onClick={onOpenSettings}
            >
              Configurar
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Drawer>
  );
};

export default NotificationCenter;