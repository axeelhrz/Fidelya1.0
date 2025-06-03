import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
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
  const { user } = useAuth();
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

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Banner de saludo */}
          <UserGreetingBanner user={user} />

          {/* Grid principal del dashboard */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
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