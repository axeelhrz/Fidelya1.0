import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Fab,
  useTheme,
  alpha,
  Skeleton,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  Stack,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  MarkEmailRead as MarkReadIcon,
  Search as SearchIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as ViewIcon,
  Sort as SortIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  ViewComfy as ViewComfyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCard from '../components/Notificaciones/NotificationCard';
import NotificationSettings from '../components/Notificaciones/NotificationSettings';
import AlertModal from '../components/Notificaciones/AlertModal';
import NotificationCenter from '../components/Notificaciones/NotificationCenter';
import notificationService from '../services/notificationService';

const Notificaciones = () => {
  const theme = useTheme();
  
  // Estados principales
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados de UI
  const [openSettings, setOpenSettings] = useState(false);
  const [openCenter, setOpenCenter] = useState(false);
  const [alertModal, setAlertModal] = useState({ open: false });
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);
  
  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('fecha_desc');
  const [viewMode, setViewMode] = useState('cards'); // cards, compact, list
  
  // Estados de paginación
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [hasMore, setHasMore] = useState(true);

  // Cargar notificaciones con optimización
  const cargarNotificaciones = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const filtros = {
        limite: pageSize,
        pagina: isRefresh ? 1 : page,
        busqueda: searchTerm,
        tipo: filterType !== 'all' ? filterType : undefined,
        leida: filterStatus === 'unread' ? false : filterStatus === 'read' ? true : undefined,
        prioridad: filterPriority !== 'all' ? filterPriority : undefined,
        orden: sortBy,
      };
      
      const data = await notificationService.obtenerNotificaciones(filtros);
      
      if (isRefresh || page === 1) {
        setNotificaciones(data);
        setPage(1);
      } else {
        setNotificaciones(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === pageSize);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
      setError('Error al cargar las notificaciones');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, pageSize, searchTerm, filterType, filterStatus, filterPriority, sortBy]);

  // Efectos
  useEffect(() => {
    cargarNotificaciones();
  }, [cargarNotificaciones]);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        cargarNotificaciones();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handlers optimizados
  const handleRefresh = useCallback(() => {
    cargarNotificaciones(true);
  }, [cargarNotificaciones]);

  const handleMarcarLeida = useCallback(async (notificacionId) => {
    try {
      await notificationService.marcarComoLeidas([notificacionId]);
      setNotificaciones(prev => 
        prev.map(n => n.id === notificacionId ? { ...n, leida: true } : n)
      );
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
      setAlertModal({
        open: true,
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'No se pudo marcar la notificación como leída',
      });
    }
  }, []);

  const handleMarcarTodasLeidas = useCallback(async () => {
    try {
      await notificationService.marcarComoLeidas();
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
      setAlertModal({
        open: true,
        tipo: 'success',
        titulo: 'Éxito',
        mensaje: 'Todas las notificaciones han sido marcadas como leídas',
        autoClose: true,
      });
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
      setAlertModal({
        open: true,
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'No se pudieron marcar las notificaciones como leídas',
      });
    }
  }, []);

  const handleBulkAction = useCallback(async (action) => {
    setBulkActionAnchor(null);
    
    try {
      switch (action) {
        case 'mark_read':
          await notificationService.marcarComoLeidas(selectedNotifications);
          setNotificaciones(prev => 
            prev.map(n => selectedNotifications.includes(n.id) ? { ...n, leida: true } : n)
          );
          break;
        case 'archive':
          // Implementar archivo
          break;
        case 'delete':
          // Implementar eliminación
          break;
      }
      setSelectedNotifications([]);
    } catch (error) {
      setAlertModal({
        open: true,
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'No se pudo completar la acción',
      });
    }
  }, [selectedNotifications]);

  const handleVerificarAlertas = useCallback(async () => {
    try {
      const resultado = await notificationService.verificarAlertas();
      await handleRefresh();
      
      const totalAlertas = Object.values(resultado.alertas_generadas || {}).reduce((a, b) => a + b, 0);
      
      setAlertModal({
        open: true,
        tipo: totalAlertas > 0 ? 'warning' : 'info',
        titulo: 'Verificación Completada',
        mensaje: totalAlertas > 0 
          ? `Se generaron ${totalAlertas} nuevas alertas del sistema`
          : 'No se encontraron nuevas alertas',
        autoClose: true,
      });
    } catch (error) {
      console.error('Error verificando alertas:', error);
      setAlertModal({
        open: true,
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'No se pudieron verificar las alertas del sistema',
      });
    }
  }, [handleRefresh]);

  // Datos computados
  const estadisticas = useMemo(() => {
    const total = notificaciones.length;
    const noLeidas = notificaciones.filter(n => !n.leida).length;
    const porTipo = {
      stock: notificaciones.filter(n => n.tipo === 'stock').length,
      pago: notificaciones.filter(n => n.tipo === 'pago').length,
      cobro: notificaciones.filter(n => n.tipo === 'cobro').length,
      sistema: notificaciones.filter(n => n.tipo === 'sistema').length,
    };
    const criticas = notificaciones.filter(n => n.prioridad === 'alta').length;
    
    return { total, noLeidas, porTipo, criticas };
  }, [notificaciones]);

  const notificacionesFiltradas = useMemo(() => {
    return notificaciones.filter(notif => {
      const matchSearch = !searchTerm || 
        notif.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.mensaje.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchType = filterType === 'all' || notif.tipo === filterType;
      const matchStatus = filterStatus === 'all' || 
        (filterStatus === 'unread' && !notif.leida) ||
        (filterStatus === 'read' && notif.leida);
      const matchPriority = filterPriority === 'all' || notif.prioridad === filterPriority;
      
      return matchSearch && matchType && matchStatus && matchPriority;
    });
  }, [notificaciones, searchTerm, filterType, filterStatus, filterPriority]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Mejorado */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box display="flex" alignItems="center" gap={3}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  position: 'relative',
                }}
              >
                <NotificationsIcon fontSize="large" />
                {estadisticas.noLeidas > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      bgcolor: 'error.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {estadisticas.noLeidas > 99 ? '99+' : estadisticas.noLeidas}
                  </Box>
                )}
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Centro de Notificaciones
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Gestiona todas tus alertas y notificaciones del sistema de manera eficiente
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Actualizar">
                <IconButton
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
              
              <Tooltip title="Centro de Notificaciones">
                <IconButton
                  onClick={() => setOpenCenter(true)}
                  sx={{ 
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.2) }
                  }}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Configuración">
                <IconButton
                  onClick={() => setOpenSettings(true)}
                  sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) }
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Barra de progreso para carga */}
          {(loading || refreshing) && (
            <LinearProgress 
              sx={{ 
                borderRadius: 2,
                height: 4,
                mb: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }} 
            />
          )}
        </Paper>

        {/* Estadísticas Mejoradas */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h3" fontWeight={700} color="primary.main" gutterBottom>
                        {estadisticas.total}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Notificaciones
                      </Typography>
                    </Box>
                    <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h3" fontWeight={700} color="warning.main" gutterBottom>
                        {estadisticas.noLeidas}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        No Leídas
                      </Typography>
                    </Box>
                    <WarningIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h3" fontWeight={700} color="error.main" gutterBottom>
                        {estadisticas.criticas}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Críticas
                      </Typography>
                    </Box>
                    <ErrorIcon sx={{ fontSize: 40, color: 'error.main', opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h3" fontWeight={700} color="success.main" gutterBottom>
                        {estadisticas.porTipo.stock}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Alertas de Stock
                      </Typography>
                    </Box>
                    <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Barra de Herramientas Avanzada */}
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
          <Grid container spacing={3} alignItems="center">
            {/* Búsqueda */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar notificaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />
            </Grid>

            {/* Filtros */}
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip
                  label="Todas"
                  variant={filterStatus === 'all' ? 'filled' : 'outlined'}
                  onClick={() => setFilterStatus('all')}
                  color="primary"
                />
                <Chip
                  label={`No leídas (${estadisticas.noLeidas})`}
                  variant={filterStatus === 'unread' ? 'filled' : 'outlined'}
                  onClick={() => setFilterStatus('unread')}
                  color="warning"
                />
                <Chip
                  label="Leídas"
                  variant={filterStatus === 'read' ? 'filled' : 'outlined'}
                  onClick={() => setFilterStatus('read')}
                  color="success"
                />
                <Chip
                  label="Stock"
                  variant={filterType === 'stock' ? 'filled' : 'outlined'}
                  onClick={() => setFilterType(filterType === 'stock' ? 'all' : 'stock')}
                  color="info"
                />
                <Chip
                  label="Pagos"
                  variant={filterType === 'pago' ? 'filled' : 'outlined'}
                  onClick={() => setFilterType(filterType === 'pago' ? 'all' : 'pago')}
                  color="error"
                />
              </Stack>
            </Grid>

            {/* Acciones */}
            <Grid item xs={12} md={2}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Tooltip title="Cambiar vista">
                  <IconButton
                    onClick={() => {
                      const modes = ['cards', 'compact', 'list'];
                      const currentIndex = modes.indexOf(viewMode);
                      const nextIndex = (currentIndex + 1) % modes.length;
                      setViewMode(modes[nextIndex]);
                    }}
                    color="info"
                    sx={{ 
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) }
                    }}
                  >
                    {viewMode === 'cards' && <ViewModuleIcon />}
                    {viewMode === 'compact' && <ViewComfyIcon />}
                    {viewMode === 'list' && <ViewListIcon />}
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Ordenar">
                  <IconButton
                    onClick={(e) => setBulkActionAnchor(e.currentTarget)}
                    color="info"
                    sx={{ 
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) }
                    }}
                  >
                    <SortIcon />
                  </IconButton>
                </Tooltip>
                
                {estadisticas.noLeidas > 0 && (
                  <Tooltip title="Marcar todas como leídas">
                    <IconButton
                      onClick={handleMarcarTodasLeidas}
                      color="primary"
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                      }}
                    >
                      <MarkReadIcon />
                    </IconButton>
                  </Tooltip>
                )}
                
                <Tooltip title="Verificar nuevas alertas">
                  <IconButton
                    onClick={handleVerificarAlertas}
                    color="secondary"
                    sx={{ 
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.2) }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Contenido Principal */}
        <Box>
          {/* Loading State Mejorado */}
          {loading && notificaciones.length === 0 && (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} key={index}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" gap={2}>
                        <Skeleton variant="circular" width={56} height={56} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="60%" height={28} />
                          <Skeleton variant="text" width="100%" height={24} sx={{ mt: 1 }} />
                          <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Error State */}
          {!loading && error && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 6, 
                textAlign: 'center', 
                borderRadius: 4,
                border: `2px dashed ${theme.palette.error.main}`,
                bgcolor: alpha(theme.palette.error.main, 0.05),
              }}
            >
              <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} color="error.main" mb={1}>
                Error al cargar notificaciones
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                {error}
              </Typography>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                color="error"
              >
                Reintentar
              </Button>
            </Paper>
          )}

          {/* Empty State */}
          {!loading && !error && notificacionesFiltradas.length === 0 && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 6, 
                textAlign: 'center', 
                borderRadius: 4,
                border: `2px dashed ${theme.palette.divider}`,
                bgcolor: alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <NotificationsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} color="text.secondary" mb={1}>
                {searchTerm || filterStatus !== 'all' || filterType !== 'all' 
                  ? 'No se encontraron notificaciones' 
                  : 'No hay notificaciones'
                }
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Cuando tengas nuevas alertas o notificaciones, aparecerán aquí'
                }
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                {(searchTerm || filterStatus !== 'all' || filterType !== 'all') && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                      setFilterType('all');
                      setFilterPriority('all');
                    }}
                  >
                    Limpiar Filtros
                  </Button>
                )}
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={handleVerificarAlertas}
                >
                  Verificar Alertas
                </Button>
              </Stack>
            </Paper>
          )}

          {/* Lista de Notificaciones */}
          {!loading && !error && notificacionesFiltradas.length > 0 && (
            <Grid container spacing={3}>
              <AnimatePresence>
                {notificacionesFiltradas.map((notificacion, index) => (
                  <Grid item xs={12} key={notificacion.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <NotificationCard
                        notificacion={notificacion}
                        onMarkAsRead={handleMarcarLeida}
                        compact={viewMode === 'compact'}
                        selected={selectedNotifications.includes(notificacion.id)}
                        onSelect={(selected) => {
                          if (selected) {
                            setSelectedNotifications(prev => [...prev, notificacion.id]);
                          } else {
                            setSelectedNotifications(prev => prev.filter(id => id !== notificacion.id));
                          }
                        }}
                      />
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </Box>

        {/* Floating Action Button Mejorado */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
          onClick={handleVerificarAlertas}
        >
          <RefreshIcon />
        </Fab>

        {/* Dialogs */}
        <NotificationCenter
          open={openCenter}
          onClose={() => setOpenCenter(false)}
          onOpenSettings={() => {
            setOpenCenter(false);
            setOpenSettings(true);
          }}
        />

        <NotificationSettings
          open={openSettings}
          onClose={() => setOpenSettings(false)}
          onSave={() => {
            setAlertModal({
              open: true,
              tipo: 'success',
              titulo: 'Configuración Guardada',
              mensaje: 'La configuración de notificaciones se ha actualizado correctamente',
              autoClose: true,
            });
          }}
        />

        <AlertModal
          open={alertModal.open}
          tipo={alertModal.tipo}
          titulo={alertModal.titulo}
          mensaje={alertModal.mensaje}
          autoClose={alertModal.autoClose}
          onClose={() => setAlertModal({ open: false })}
        />

        {/* Menu de acciones en lote y ordenamiento */}
        <Menu
          anchorEl={bulkActionAnchor}
          open={Boolean(bulkActionAnchor)}
          onClose={() => setBulkActionAnchor(null)}
        >
          {selectedNotifications.length > 0 ? (
            <>
              <MenuItem onClick={() => handleBulkAction('mark_read')}>
                <MarkReadIcon sx={{ mr: 1 }} />
                Marcar como leídas
              </MenuItem>
              <MenuItem onClick={() => handleBulkAction('archive')}>
                <ArchiveIcon sx={{ mr: 1 }} />
                Archivar
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleBulkAction('delete')} sx={{ color: 'error.main' }}>
                <DeleteIcon sx={{ mr: 1 }} />
                Eliminar
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={() => { setSortBy('fecha_desc'); setBulkActionAnchor(null); }}>
                <SortIcon sx={{ mr: 1 }} />
                Más recientes primero
              </MenuItem>
              <MenuItem onClick={() => { setSortBy('fecha_asc'); setBulkActionAnchor(null); }}>
                <SortIcon sx={{ mr: 1 }} />
                Más antiguos primero
              </MenuItem>
              <MenuItem onClick={() => { setSortBy('prioridad'); setBulkActionAnchor(null); }}>
                <SortIcon sx={{ mr: 1 }} />
                Por prioridad
              </MenuItem>
              <MenuItem onClick={() => { setSortBy('tipo'); setBulkActionAnchor(null); }}>
                <SortIcon sx={{ mr: 1 }} />
                Por tipo
              </MenuItem>
            </>
          )}
        </Menu>
      </motion.div>
    </Container>
  );
};

export default Notificaciones;