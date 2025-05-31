import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  Dashboard as DashboardIcon,
  Notifications
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

// Importar componentes del dashboard
import UserGreetingBanner from './components/UserGreetingBanner';
import InventorySummaryCard from './components/InventorySummaryCard';
import DailySalesCard from './components/DailySalesCard';
import LowStockAlertCard from './components/LowStockAlertCard';
import RecentPurchasesCard from './components/RecentPurchasesCard';
import MonthlySalesChart from './components/MonthlySalesChart';
import StockDistributionChart from './components/StockDistributionChart';
import RecentActivityList from './components/RecentActivityList';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para los datos del dashboard
  const [dashboardData, setDashboardData] = useState({
    resumen: null,
    stockBajo: null,
    comprasRecientes: null,
    ventasMensuales: null,
    stockDistribucion: null,
    ultimosMovimientos: null
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Cargar todos los datos del dashboard en paralelo
      const [
        resumen,
        stockBajo,
        comprasRecientes,
        ventasMensuales,
        stockDistribucion,
        ultimosMovimientos
      ] = await Promise.all([
        authService.getDashboardResumen(),
        authService.getStockBajo(),
        authService.getComprasRecientes(),
        authService.getVentasMensuales(),
        authService.getStockDistribucion(),
        authService.getUltimosMovimientos()
      ]);

      setDashboardData({
        resumen,
        stockBajo,
        comprasRecientes,
        ventasMensuales,
        stockDistribucion,
        ultimosMovimientos
      });
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      setError('Error al cargar los datos del dashboard. Por favor, intenta nuevamente.');
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

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: '#4CAF50', boxShadow: 2 }}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Frutería Nina - Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Box sx={{ p: 3 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Banner de saludo */}
          <UserGreetingBanner user={user} />

          {/* Grid principal del dashboard */}
          <Grid container spacing={3}>
            {/* Fila 1: Tarjetas de resumen */}
            <Grid item xs={12} sm={6} md={3}>
              <InventorySummaryCard 
                data={dashboardData.resumen} 
                loading={loading} 
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <DailySalesCard 
                data={dashboardData.resumen} 
                loading={loading} 
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <LowStockAlertCard 
                data={dashboardData.stockBajo} 
                loading={loading} 
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <RecentPurchasesCard 
                data={dashboardData.comprasRecientes} 
                loading={loading} 
              />
            </Grid>

            {/* Fila 2: Gráficos */}
            <Grid item xs={12} md={8}>
              <MonthlySalesChart 
                data={dashboardData.ventasMensuales} 
                loading={loading} 
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <StockDistributionChart 
                data={dashboardData.stockDistribucion} 
                loading={loading} 
              />
            </Grid>

            {/* Fila 3: Lista de actividad */}
            <Grid item xs={12}>
              <RecentActivityList 
                data={dashboardData.ultimosMovimientos} 
                loading={loading} 
              />
            </Grid>
          </Grid>
        </motion.div>
      </Box>

      {/* Snackbar para errores */}
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
    </Box>
  );
};

export default Dashboard;