import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Alert,
  Snackbar,
  Container,
  Fade,
  useTheme,
  alpha,
  Chip,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Refresh as RefreshIcon,
  Update as UpdateIcon,
  CheckCircle as CheckCircleIcon 
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../context/InventoryContext';
import ConnectionStatus from '../../components/common/ConnectionStatus';
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
  const { 
    dashboardData, 
    isUpdating, 
    lastUpdate, 
    updateTrigger,
    connectionError,
    refreshDashboardData 
  } = useInventory();
  
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        await refreshDashboardData();
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
        if (error.type !== 'NETWORK_ERROR' && error.type !== 'TIMEOUT_ERROR') {
          setError('Error al cargar los datos del dashboard. Por favor, intenta nuevamente.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [refreshDashboardData]);

  // Mostrar notificación cuando se actualicen los datos
  useEffect(() => {
    if (updateTrigger > 0 && !loading && !connectionError) {
      setShowUpdateNotification(true);
      const timer = setTimeout(() => {
        setShowUpdateNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateTrigger, loading, connectionError]);

  const handleManualRefresh = async () => {
    try {
      await refreshDashboardData(true);
    } catch (error) {
      if (error.type !== 'NETWORK_ERROR' && error.type !== 'TIMEOUT_ERROR') {
        setError('Error al actualizar los datos');
      }
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const formatLastUpdate = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Hace unos segundos';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
    return date.toLocaleDateString();
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
          {/* Estado de conexión */}
          <ConnectionStatus 
            isConnected={!connectionError}
            onRetry={handleManualRefresh}
            lastUpdate={lastUpdate}
          />

          {/* Header con indicador de actualización */}
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <UserGreetingBanner user={user} />
              
              {/* Panel de control de actualización */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {lastUpdate && !connectionError && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={`Actualizado: ${formatLastUpdate(lastUpdate)}`}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ 
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      borderColor: alpha(theme.palette.success.main, 0.3)
                    }}
                  />
                )}
                
                <Tooltip title="Actualizar datos">
                  <IconButton
                    onClick={handleManualRefresh}
                    disabled={isUpdating}
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    <RefreshIcon 
                      sx={{ 
                        animation: isUpdating ? 'spin 1s linear infinite' : 'none',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }} 
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </motion.div>

          {/* Grid principal del dashboard */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Fila 1: Tarjetas de resumen principales */}
            <Grid item xs={12} sm={6} lg={3}>
              <motion.div variants={itemVariants}>
                <Box sx={{ height: 180 }}>
                  <InventorySummaryCard 
                    data={dashboardData.resumen} 
                    loading={loading || isUpdating} 
                    updateTrigger={updateTrigger}
                    connectionError={connectionError}
                  />
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <motion.div variants={itemVariants}>
                <Box sx={{ height: 180 }}>
                  <DailySalesCard 
                    data={dashboardData.resumen} 
                    loading={loading || isUpdating}
                    connectionError={connectionError}
                  />
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <motion.div variants={itemVariants}>
                <Box sx={{ height: 180 }}>
                  <LowStockAlertCard 
                    data={dashboardData.stockBajo} 
                    loading={loading || isUpdating}
                    updateTrigger={updateTrigger}
                    connectionError={connectionError}
                  />
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <motion.div variants={itemVariants}>
                <Box sx={{ height: 180 }}>
                  <RecentPurchasesCard 
                    data={dashboardData.comprasRecientes} 
                    loading={loading || isUpdating}
                    connectionError={connectionError}
                  />
                </Box>
              </motion.div>
            </Grid>

            {/* Fila 2: Gráficos principales */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Box sx={{ height: 450 }}>
                  <MonthlySalesChart 
                    data={dashboardData.ventasMensuales} 
                    loading={loading || isUpdating}
                    connectionError={connectionError}
                  />
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Box sx={{ height: 450 }}>
                  <StockDistributionChart 
                    data={dashboardData.stockDistribucion} 
                    loading={loading || isUpdating}
                    connectionError={connectionError}
                  />
                </Box>
              </motion.div>
            </Grid>

            {/* Fila 3: Actividad reciente */}
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <Box sx={{ height: 320 }}>
                  <RecentActivityList 
                    data={dashboardData.ultimosMovimientos} 
                    loading={loading || isUpdating}
                    connectionError={connectionError}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Notificación de actualización automática */}
      <AnimatePresence>
        {showUpdateNotification && !connectionError && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1300
            }}
          >
            <Alert 
              severity="info" 
              icon={<UpdateIcon />}
              sx={{ 
                borderRadius: 2,
                boxShadow: theme.shadows[8],
                bgcolor: alpha(theme.palette.info.main, 0.95),
                color: 'white',
                '& .MuiAlert-icon': {
                  color: 'white'
                }
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                Dashboard actualizado automáticamente
              </Typography>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snackbar para errores */}
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