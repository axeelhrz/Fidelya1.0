import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Alert,
  Snackbar,
  Container,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
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
  const theme = useTheme();
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
};

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '300px',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 3 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Banner de saludo */}
          <motion.div variants={itemVariants}>
            <UserGreetingBanner user={user} />
          </motion.div>

          {/* Grid principal del dashboard */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Fila 1: Tarjetas de resumen principales - Altura fija y uniforme */}
            <Grid item xs={12} sm={6} lg={3}>
              <motion.div variants={itemVariants}>
                <Box sx={{ height: 180 }}>
                  <InventorySummaryCard 
                    data={dashboardData.resumen} 
                    loading={loading} 
                />
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <motion.div variants={itemVariants}>
                <Box sx={{ height: 180 }}>
                  <DailySalesCard 
                    data={dashboardData.resumen} 
                    loading={loading} 
                />
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <motion.div variants={itemVariants}>
                <Box sx={{ height: 180 }}>
                  <LowStockAlertCard 
                    data={dashboardData.stockBajo} 
                    loading={loading} 
                />
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <motion.div variants={itemVariants}>
                <Box sx={{ height: 180 }}>
                  <RecentPurchasesCard 
                    data={dashboardData.comprasRecientes} 
                    loading={loading} 
                />
                </Box>
              </motion.div>
          </Grid>

            {/* Fila 2: Gráficos principales - Altura uniforme y misma proporción */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Box sx={{ height: 450 }}>
                  <MonthlySalesChart 
                    data={dashboardData.ventasMensuales} 
                    loading={loading} 
                  />
    </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Box sx={{ height: 450 }}>
                  <StockDistributionChart 
                    data={dashboardData.stockDistribucion} 
                    loading={loading} 
                  />
                </Box>
              </motion.div>
            </Grid>

            {/* Fila 3: Actividad reciente - Extensión horizontal completa */}
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <Box sx={{ height: 320 }}>
                  <RecentActivityList 
                    data={dashboardData.ultimosMovimientos} 
                    loading={loading} 
                />
                </Box>
              </motion.div>
          </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Snackbar para errores con mejor diseño */}
      <AnimatePresence>
        {error && (
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={handleCloseError}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <Alert 
                onClose={handleCloseError} 
                severity="error" 
                sx={{ 
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: theme.shadows[4]
                }}
              >
                {error}
              </Alert>
            </motion.div>
          </Snackbar>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Dashboard;