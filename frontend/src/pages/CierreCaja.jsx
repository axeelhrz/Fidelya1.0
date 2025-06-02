import React, { useState, useEffect } from 'react';
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
} from '@mui/icons-material';
import { motion } from 'framer-motion';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estados para control de interfaz
  const [tabActiva, setTabActiva] = useState('cierre');
  const [puedeRealizarCierre, setPuedeRealizarCierre] = useState(false);

  useEffect(() => {
    // Verificar permisos al cargar
    if (!cierreCajaService.validarPermisosCierreCaja()) {
      setError('No tienes permisos para acceder al módulo de cierre de caja');
      return;
    }
    
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [resumenData, historialData] = await Promise.all([
        cierreCajaService.obtenerResumenVentasHoy(),
        cierreCajaService.obtenerHistorialCierres({ limite: 10 })
      ]);
      
      setResumenVentas(resumenData.resumen_ventas);
      setCierreExistente(resumenData.cierre_existente);
      setPuedeRealizarCierre(resumenData.puede_cerrar);
      setHistorialCierres(historialData);
      
    } catch (error) {
      console.error('Error cargando datos de cierre de caja:', error);
      setError(error.message || 'Error al cargar los datos de cierre de caja');
    } finally {
      setLoading(false);
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
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: '#1565C0', boxShadow: 2 }}>
        <Toolbar>
          <AccountBalanceIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Frutería Nina - Cierre de Caja Diario
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" onClick={cargarDatos}>
              <RefreshIcon />
            </IconButton>
            
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
            
            <Chip
              label={user?.rol || 'Usuario'}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 500
              }}
              size="small"
            />
            
            <IconButton
              size="large"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF9800', fontWeight: 600 }}>
                {user?.nombre?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { mt: 1, minWidth: 180 }
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
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Encabezado */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
              Cierre de Caja Diario
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Registra el efectivo contado, compara con las ventas esperadas y genera reportes de cierre
            </Typography>
          </Box>

          {/* Navegación por pestañas */}
          <Paper sx={{ mb: 3, borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1, p: 1 }}>
                <Chip
                  icon={<MoneyIcon />}
                  label="Cierre del Día"
                  onClick={() => setTabActiva('cierre')}
                  color={tabActiva === 'cierre' ? 'primary' : 'default'}
                  variant={tabActiva === 'cierre' ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 500 }}
                />
                <Chip
                  icon={<HistoryIcon />}
                  label="Historial"
                  onClick={() => setTabActiva('historial')}
                  color={tabActiva === 'historial' ? 'primary' : 'default'}
                  variant={tabActiva === 'historial' ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Contenido según pestaña activa */}
          {tabActiva === 'cierre' && (
            <Grid container spacing={3}>
              {/* Resumen de ventas del día */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ height: 'fit-content', borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" fontWeight={600}>
                        Resumen de Ventas del Día
                      </Typography>
                    </Box>
                    <ResumenVentasDelDia 
                      resumenVentas={resumenVentas}
                      loading={loading}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Formulario de cierre */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ height: 'fit-content', borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" fontWeight={600}>
                        Registro de Cierre
                      </Typography>
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
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Comparación de Caja
                      </Typography>
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
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <ExportarCierrePDF cierreId={cierreExistente.id} />
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}

          {/* Historial de cierres */}
          {tabActiva === 'historial' && (
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <HistorialCierres
                historialCierres={historialCierres}
                loading={loading}
                onRefresh={cargarDatos}
              />
            </Paper>
          )}
        </motion.div>
      </Container>

      {/* Snackbars para notificaciones */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CierreCajaPage;