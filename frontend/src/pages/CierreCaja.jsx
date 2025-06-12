import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  useTheme,
  Container,
  Grid,
  Card,
  CardContent,
  Divider,
  Badge,
  Tooltip,
  LinearProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  AccountCircle,
  ExitToApp,
  Dashboard as DashboardIcon,
  Notifications,
  Refresh as RefreshIcon,
  Money as MoneyIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Print as PrintIcon,
  CloudSync as CloudSyncIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { cierreCajaService } from '../services/cierreCajaService';

// Importar componentes específicos de cierre de caja
import FormularioCierre from './components/CierreCaja/FormularioCierre';
import ResumenVentasDelDia from './components/CierreCaja/ResumenVentasDelDia';
import ComparacionCaja from './components/CierreCaja/ComparacionCaja';
import HistorialCierres from './components/CierreCaja/HistorialCierres';
import ExportarCierrePDF from './components/CierreCaja/ExportarCierrePDF';

const CierreCajaPage = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Estados para datos
  const [resumenVentas, setResumenVentas] = useState(null);
  const [cierreExistente, setCierreExistente] = useState(null);
  const [historialCierres, setHistorialCierres] = useState([]);
  const [metricas, setMetricas] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sincronizando, setSincronizando] = useState(false);
  
  // Estados para control de interfaz
  const [tabActiva, setTabActiva] = useState('cierre');
  const [puedeRealizarCierre, setPuedeRealizarCierre] = useState(false);
  const [alertasDialogOpen, setAlertasDialogOpen] = useState(false);
  const [configuracionDialogOpen, setConfiguracionDialogOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    if (!cierreCajaService.validarPermisosCierreCaja()) {
      setError('No tienes permisos para acceder al módulo de cierre de caja');
      return;
    }
    
    cargarDatos();
    
    // Auto-refresh cada 30 segundos si está habilitado
    const interval = autoRefresh ? setInterval(cargarDatos, 30000) : null;
    
    return () => {
      if (interval) clearInterval(interval);
  };
  }, [autoRefresh]);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [resumenData, historialData, metricsData, notificacionesData] = await Promise.all([
        cierreCajaService.obtenerResumenVentasHoy(),
        cierreCajaService.obtenerHistorialCierres({ limite: 10 }),
        cierreCajaService.obtenerMetricasCajero(),
        cierreCajaService.obtenerNotificacionesCierre()
      ]);
      
      setResumenVentas(resumenData.resumen_ventas);
      setCierreExistente(resumenData.cierre_existente);
      setPuedeRealizarCierre(resumenData.puede_cerrar);
      setHistorialCierres(historialData);
      setMetricas(metricsData);
      setNotificaciones(notificacionesData);
      
    } catch (error) {
      console.error('Error cargando datos de cierre de caja:', error);
      setError(error.message || 'Error al cargar los datos de cierre de caja');
    } finally {
      setLoading(false);
    }
  }, []);

  const sincronizarDatos = async () => {
    setSincronizando(true);
    try {
      await cierreCajaService.sincronizarDatos();
      await cargarDatos();
      setSuccess('Datos sincronizados correctamente');
    } catch (error) {
      setError('Error al sincronizar datos');
    } finally {
      setSincronizando(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
};

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleCierreRealizado = async (cierreData) => {
    setSuccess('Cierre de caja registrado exitosamente');
    await cargarDatos();
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  const getEstadoSistema = () => {
    if (!resumenVentas) return { color: 'warning', texto: 'Cargando...' };
    
    if (cierreExistente) {
      return { color: 'success', texto: 'Cierre Completado' };
    }
    
    if (puedeRealizarCierre) {
      return { color: 'info', texto: 'Listo para Cierre' };
    }
    
    return { color: 'warning', texto: 'Pendiente' };
  };

  const estadoSistema = getEstadoSistema();

  // Verificar permisos
  if (!cierreCajaService.validarPermisosCierreCaja()) {
    return (
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#F5F5F5', p: 3 }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <Typography variant="h6">Acceso Denegado</Typography>
          <Typography>
            No tienes permisos para acceder al módulo de cierre de caja. 
            Se requiere rol de administrador o cajero.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      {/* AppBar Mejorado */}
      <AppBar position="static" sx={{ 
        background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
      }}>
        <Toolbar>
          <AccountBalanceIcon sx={{ mr: 2, fontSize: 28 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Frutería Nina - Cierre de Caja Diario
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {new Date().toLocaleDateString('es-UY', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Estado del Sistema */}
            <Chip
              icon={estadoSistema.color === 'success' ? <CheckCircleIcon /> : 
                    estadoSistema.color === 'warning' ? <WarningIcon /> : <InfoIcon />}
              label={estadoSistema.texto}
              color={estadoSistema.color}
              variant="filled"
              sx={{ 
                backgroundColor: `${estadoSistema.color}.main`,
                color: 'white',
                fontWeight: 500 
              }}
            />

            {/* Botón de Sincronización */}
            <Tooltip title="Sincronizar datos">
              <IconButton 
                color="inherit" 
                onClick={sincronizarDatos}
                disabled={sincronizando}
              >
                <CloudSyncIcon sx={{ 
                  animation: sincronizando ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} />
              </IconButton>
            </Tooltip>

            {/* Botón de Refresh */}
            <Tooltip title="Actualizar datos">
              <IconButton color="inherit" onClick={cargarDatos} disabled={loading}>
                <RefreshIcon sx={{ 
                  animation: loading ? 'spin 1s linear infinite' : 'none' 
                }} />
              </IconButton>
            </Tooltip>
            
            {/* Notificaciones */}
            <Tooltip title="Alertas y notificaciones">
              <IconButton 
                color="inherit" 
                onClick={() => setAlertasDialogOpen(true)}
              >
                <Badge badgeContent={notificaciones.length} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Auto-refresh toggle */}
            <Tooltip title={`Auto-actualización ${autoRefresh ? 'activada' : 'desactivada'}`}>
              <IconButton 
                color="inherit" 
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <SpeedIcon sx={{ 
                  color: autoRefresh ? 'success.light' : 'grey.400' 
                }} />
              </IconButton>
            </Tooltip>
            
            {/* Rol del usuario */}
            <Chip
              label={user?.rol || 'Usuario'}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 500
              }}
              size="small"
            />
            
            {/* Menú de usuario */}
            <IconButton
              size="large"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: 'secondary.main', 
                fontWeight: 600,
                border: '2px solid rgba(255,255,255,0.3)'
              }}>
                {user?.nombre?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { 
                mt: 1, 
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <AccountCircle sx={{ mr: 1 }} />
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={() => window.location.href = '/dashboard'}>
              <DashboardIcon sx={{ mr: 1 }} />
              Dashboard
            </MenuItem>
            <MenuItem onClick={() => setConfiguracionDialogOpen(true)}>
              <SettingsIcon sx={{ mr: 1 }} />
              Configuración
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
        
        {/* Barra de progreso para carga */}
        {loading && (
          <LinearProgress 
            sx={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3
            }} 
          />
        )}
      </AppBar>

      {/* Contenido principal */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key="main-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Encabezado con métricas */}
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" component="h1" sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    background: 'linear-gradient(45deg, #1565C0, #0D47A1)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Cierre de Caja Diario
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Registra el efectivo contado, compara con las ventas esperadas y genera reportes de cierre
                  </Typography>
                </Grid>
                
                {/* Métricas rápidas */}
                {metricas && (
                  <Grid item xs={12} md={4}>
                    <Card sx={{ 
                      background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                      borderRadius: 3 
                    }}>
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Precisión Promedio
                        </Typography>
                        <Typography variant="h4" fontWeight={600} color="primary.main">
                          {metricas.precision_promedio}%
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              Cierres
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {metricas.total_cierres}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              Racha
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {metricas.racha_actual}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Navegación por pestañas mejorada */}
            <Paper sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                background: 'linear-gradient(90deg, #F8F9FA 0%, #E9ECEF 100%)'
              }}>
                <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
                  <Chip
                    icon={<MoneyIcon />}
                    label="Cierre del Día"
                    onClick={() => setTabActiva('cierre')}
                    color={tabActiva === 'cierre' ? 'primary' : 'default'}
                    variant={tabActiva === 'cierre' ? 'filled' : 'outlined'}
                    sx={{ 
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <Chip
                    icon={<HistoryIcon />}
                    label="Historial"
                    onClick={() => setTabActiva('historial')}
                    color={tabActiva === 'historial' ? 'primary' : 'default'}
                    variant={tabActiva === 'historial' ? 'filled' : 'outlined'}
                    sx={{ 
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <Chip
                    icon={<AnalyticsIcon />}
                    label="Análisis"
                    onClick={() => setTabActiva('analisis')}
                    color={tabActiva === 'analisis' ? 'primary' : 'default'}
                    variant={tabActiva === 'analisis' ? 'filled' : 'outlined'}
                    sx={{ 
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </Box>
              </Box>
            </Paper>

            {/* Contenido según pestaña activa */}
            <AnimatePresence mode="wait">
              {tabActiva === 'cierre' && (
                <motion.div
                  key="cierre-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Grid container spacing={3}>
                    {/* Resumen de ventas del día */}
                    <Grid item xs={12} lg={6}>
                      <Card sx={{ 
                        height: 'fit-content', 
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                        }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6" fontWeight={600}>
                              Resumen de Ventas del Día
                            </Typography>
                          </Box>
                          {loading ? (
                            <Box>
                              <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                              <Skeleton variant="rectangular" height={120} />
                            </Box>
                          ) : (
                            <ResumenVentasDelDia 
                              resumenVentas={resumenVentas}
                              loading={loading}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Formulario de cierre */}
                    <Grid item xs={12} lg={6}>
                      <Card sx={{ 
                        height: 'fit-content', 
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                        }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <MoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6" fontWeight={600}>
                              Registro de Cierre
                            </Typography>
                            {cierreExistente && (
                              <Chip 
                                label="Completado" 
                                color="success" 
                                size="small" 
                                sx={{ ml: 'auto' }}
                              />
                            )}
                          </Box>
                          <FormularioCierre
                            resumenVentas={resumenVentas}
                            cierreExistente={cierreExistente}
                            puedeRealizarCierre={puedeRealizarCierre}
                            onCierreRealizado={handleCierreRealizado}
                            loading={loading}
                          />
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Comparación de caja */}
                    {(cierreExistente || resumenVentas) && (
                      <Grid item xs={12}>
                        <Card sx={{ 
                          borderRadius: 3,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                              <Typography variant="h6" fontWeight={600}>
                                Comparación de Caja
                              </Typography>
                            </Box>
                            <ComparacionCaja
                              resumenVentas={resumenVentas}
                              cierreExistente={cierreExistente}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    )}

                    {/* Exportar PDF */}
                    {cierreExistente && (
                      <Grid item xs={12}>
                        <Card sx={{ 
                          borderRadius: 3,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                        }}>
                          <CardContent>
                            <ExportarCierrePDF cierreId={cierreExistente.id} />
                          </CardContent>
                        </Card>
                      </Grid>
                    )}
                  </Grid>
                </motion.div>
              )}

              {/* Historial de cierres */}
              {tabActiva === 'historial' && (
                <motion.div
                  key="historial-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper sx={{ 
                    borderRadius: 3, 
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}>
                    <HistorialCierres
                      historialCierres={historialCierres}
                      loading={loading}
                      onRefresh={cargarDatos}
                    />
                  </Paper>
                </motion.div>
              )}

              {/* Nueva pestaña de Análisis */}
              {tabActiva === 'analisis' && (
                <motion.div
                  key="analisis-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Card sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        textAlign: 'center',
                        py: 4
                      }}>
                        <CardContent>
                          <AnalyticsIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                          <Typography variant="h5" fontWeight={600} gutterBottom>
                            Análisis Avanzado
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Próximamente: Análisis de tendencias, predicciones y métricas avanzadas
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </Container>

      {/* FAB para acciones rápidas */}
      {!cierreExistente && puedeRealizarCierre && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(45deg, #1565C0, #0D47A1)',
            '&:hover': {
              background: 'linear-gradient(45deg, #0D47A1, #1565C0)',
            }
          }}
          onClick={() => setTabActiva('cierre')}
        >
          <MoneyIcon />
        </Fab>
      )}

      {/* Dialog de Alertas */}
      <Dialog
        open={alertasDialogOpen}
        onClose={() => setAlertasDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Notifications sx={{ mr: 1 }} />
            Alertas y Notificaciones
          </Box>
        </DialogTitle>
        <DialogContent>
          {notificaciones.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Todo en orden
              </Typography>
              <Typography color="text.secondary">
                No hay alertas pendientes
              </Typography>
            </Box>
          ) : (
            <List>
              {notificaciones.map((notif, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {notif.tipo === 'warning' ? <WarningIcon color="warning" /> : 
                     notif.tipo === 'error' ? <WarningIcon color="error" /> : 
                     <InfoIcon color="info" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={notif.titulo}
                    secondary={notif.mensaje}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertasDialogOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars para notificaciones */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSuccess} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CierreCajaPage;