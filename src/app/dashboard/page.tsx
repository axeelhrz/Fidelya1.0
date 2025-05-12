'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  Box, 
  Stack, 
  Typography, 
  useTheme, 
  alpha, 
  Chip, 
  CircularProgress,
  Paper,
  Fade,
  Divider,
  IconButton,
  Tooltip,
  Container,
  Grid
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { useDashboardKpis } from '@/hooks/use-dashboard-kpis';
import { 
  SignalWifi4Bar, 
  SignalWifiOff, 
  WifiTethering,
  Bolt,
  Insights,
  Refresh,
} from '@mui/icons-material';
import Link from 'next/link';

// Dashboard Components
import SummaryCards from '@/components/dashboard/summary-card';
import PoliciesChart from '@/components/dashboard/policies-chart';
import PolicyDistributionChart from '@/components/dashboard/policy-distribution-chart';
import RecentClientList from '@/components/dashboard/recent-client-list';
import RecentPoliciesList from '@/components/dashboard/recent-policies-list';
import NotificationsCard from '@/components/dashboard/notification-card';
import DashboardWelcomeCard from '@/components/dashboard/dashboard-welcome-card';
import TasksProgress from '@/components/dashboard/tasks-progress';
import RecommendationCard from '@/components/dashboard/recommendation-cards';
import RecentActivityList from '@/components/dashboard/recent-activity-list';
import ChatNotifications from '@/components/dashboard/chat-notifications';
import QuickActions from '@/components/dashboard/quick-actions';
import ROICalculator from '@/components/dashboard/ROI-calculator';

// Animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
      duration: 0.2
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

const DashboardPage = () => {
  const theme = useTheme();
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { kpis, loading: kpisLoading, refreshKpis } = useDashboardKpis();
  
  const [isLoading, setIsLoading] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'degraded' | 'offline'>('good');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [pageReady, setPageReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Check if the user has a premium plan
  const isPremium = useMemo(() => 
    subscription?.plan ? 
      (subscription.plan === 'professional' || subscription.plan === 'enterprise') : 
      false, 
    [subscription?.plan]
  );

  useEffect(() => {
    // Detect time of day for personalized greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      setTimeOfDay('morning');
    } else if (hour < 18) {
      setTimeOfDay('afternoon');
    } else {
      setTimeOfDay('evening');
    }

    // Connection quality detection
    const handleOnline = () => setConnectionQuality('good');
    const handleOffline = () => setConnectionQuality('offline');
    
    // Simulate connection quality detection based on latency
    const checkConnectionQuality = () => {
      if (!navigator.onLine) {
        setConnectionQuality('offline');
        return;
      }
      
      // Simulate latency detection (0-1000ms)
      const latency = Math.random() * 1000;
      if (latency < 200) {
        setConnectionQuality('good');
      } else {
        setConnectionQuality('degraded');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    const connectionInterval = setInterval(checkConnectionQuality, 30000);
    checkConnectionQuality(); // Initial check

    // Simulate loading time for animations
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Add a small delay before showing content for smoother transition
      setTimeout(() => {
        setPageReady(true);
      }, 300);
    }, 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(connectionInterval);
      clearTimeout(timer);
    };
  }, [authLoading, subscriptionLoading, kpisLoading]);

  // Handle refresh all data
  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      await refreshKpis();
      // Add a small delay to simulate refreshing other components
      setTimeout(() => {
        setRefreshing(false);
      }, 1500);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setRefreshing(false);
    }
  };

  // Verify if user has access to dashboard
  if (authLoading || !user || !user.emailVerified) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          gap: 2,
          p: 3,
          textAlign: 'center'
        }}
      >
        {authLoading ? (
          <>
            <CircularProgress size={40} thickness={4} />
            <Typography variant="h6" fontFamily="Sora" fontWeight={500}>
              Verificando credenciales...
            </Typography>
          </>
        ) : !user ? (
          <Typography variant="h6" fontFamily="Sora" fontWeight={500}>
            Debes iniciar sesión para acceder al dashboard
          </Typography>
        ) : (
          <>
            <Box
              component={motion.div}
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ 
                scale: [0.9, 1.05, 1],
                opacity: 1,
                transition: { duration: 0.5 }
              }}
            >
              <Bolt sx={{ fontSize: 60, color: theme.palette.warning.main }} />
            </Box>
            <Typography variant="h5" fontFamily="Sora" fontWeight={600} gutterBottom>
              Verificación de email pendiente
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
              Hemos enviado un correo de verificación a tu dirección de email.
              Por favor, verifica tu cuenta para acceder a todas las funcionalidades.
            </Typography>
          </>
        )}
      </Box>
    );
  }

  // Loading state with animated indicator
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: 3,
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.9)}, ${alpha(theme.palette.background.paper, 0.8)})`
            : `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.9)}, ${alpha(theme.palette.background.paper, 0.8)})`,
          backdropFilter: 'blur(10px)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1, 0.8],
            transition: {
              repeat: Infinity,
              duration: 2
            }
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`
            }}
          />
        </motion.div>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h5"
            fontFamily="Sora"
            fontWeight={600}
            sx={{
              mb: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Preparando tu dashboard
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Cargando datos en tiempo real...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Render connection indicator
  const renderConnectionIndicator = () => {
    if (connectionQuality === 'good') {
      return (
        <Chip
          icon={<SignalWifi4Bar fontSize="small" />}
          label="Online"
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.success.main, 0.1),
            color: theme.palette.success.main,
            border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
            borderRadius: '10px',
            fontWeight: 500,
            '& .MuiChip-icon': {
              color: theme.palette.success.main
            }
          }}
        />
      );
    } else if (connectionQuality === 'degraded') {
      return (
        <Chip
          icon={<WifiTethering fontSize="small" />}
          label="Conexión degradada"
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            color: theme.palette.warning.main,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
            borderRadius: '10px',
            fontWeight: 500,
            '& .MuiChip-icon': {
              color: theme.palette.warning.main
            }
          }}
        />
      );
    } else {
      return (
        <Chip
          icon={<SignalWifiOff fontSize="small" />}
          label="Offline"
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.error.main, 0.1),
            color: theme.palette.error.main,
            border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
            borderRadius: '10px',
            fontWeight: 500,
            '& .MuiChip-icon': {
              color: theme.palette.error.main
            }
          }}
        />
      );
    }
  };

  return (
    <Fade in={pageReady} timeout={500}>
      <Box
        component={motion.div}
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        sx={{
          width: '100%',
          minHeight: '100vh',
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.95)}, ${alpha(theme.palette.background.paper, 0.9)})`
            : `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.95)}, ${alpha(theme.palette.background.paper, 0.9)})`,
          backdropFilter: 'blur(20px)',
          borderRadius: 0
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Stack spacing={4}>
          {/* Header with connection indicator and refresh button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {renderConnectionIndicator()}
            
            <Tooltip title="Actualizar todos los datos" arrow>
                <IconButton 
                onClick={handleRefreshAll}
                disabled={refreshing}
                  sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2)
                  }
                }}
              >
                {refreshing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <Refresh />
                  </motion.div>
                ) : (
                  <Refresh />
                )}
              </IconButton>
            </Tooltip>
          </Box>

            {/* Welcome card */}
          <motion.div variants={sectionVariants}>
            <DashboardWelcomeCard timeOfDay={timeOfDay} />
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={sectionVariants}>
            <QuickActions />
          </motion.div>

          {/* Premium feature highlight for non-premium users */}
          {!isPremium && (
            <motion.div variants={sectionVariants}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.warning.light, 0.15)}, ${alpha(theme.palette.warning.main, 0.05)})`,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 1.5,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.warning.main, 0.2),
                    color: theme.palette.warning.main,
                    mr: 1
                  }}
                >
                  <Insights fontSize="large" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Desbloquea todas las funcionalidades premium
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Mejora tu plan para acceder a análisis avanzados, calculadora de ROI, recomendaciones personalizadas y más.
                  </Typography>
                </Box>
                <Box sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Box
                      component="a"
                      href="/pricing"
                      sx={{
                        display: 'block',
                        py: 1.5,
                        px: 3,
                        borderRadius: 3,
                        bgcolor: theme.palette.warning.main,
                        color: theme.palette.warning.contrastText,
                        fontWeight: 600,
                        textDecoration: 'none',
                        textAlign: 'center',
                        boxShadow: `0 4px 14px ${alpha(theme.palette.warning.main, 0.4)}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: theme.palette.warning.dark,
                          boxShadow: `0 6px 20px ${alpha(theme.palette.warning.main, 0.6)}`
                        }
                      }}
                    >
                      Ver planes
                    </Box>
                  </motion.div>
                </Box>
              </Paper>
            </motion.div>
          )}

          {/* KPI Summary Cards */}
          <motion.div variants={sectionVariants}>
            <SummaryCards />
          </motion.div>

            {/* Main Dashboard Content */}
            <Grid container spacing={3}>
              {/* Main Chart - Full Width */}
              <Grid item xs={12}>
              <motion.div variants={sectionVariants}>
                <PoliciesChart />
              </motion.div>
              </Grid>

              {/* Policy Distribution Chart - Half Width */}
              <Grid item xs={12} md={6}>
                  <motion.div variants={sectionVariants}>
                  <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                      background: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(10px)',
                      boxShadow: theme.palette.mode === 'dark' 
                        ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`
                        : `0 8px 32px ${alpha('#000', 0.05)}`,
                      overflow: 'hidden',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      height: '100%'
              }}
            >
                    <PolicyDistributionChart />
                  </Paper>
          </motion.div>
              </Grid>

              {/* Tasks Progress - Half Width */}
              <Grid item xs={12} md={6}>
                <motion.div variants={sectionVariants}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      background: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(10px)',
                      boxShadow: theme.palette.mode === 'dark' 
                        ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`
                        : `0 8px 32px ${alpha('#000', 0.05)}`,
                      overflow: 'hidden',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      height: '100%'
                    }}
                  >
                    <TasksProgress />
                  </Paper>
                </motion.div>
              </Grid>

              {/* Recent Policies - 2/3 Width */}
              <Grid item xs={12} lg={8}>
                <motion.div variants={sectionVariants}>
                  <RecentPoliciesList />
                </motion.div>
              </Grid>

              {/* Notifications - 1/3 Width */}
              <Grid item xs={12} lg={4}>
                <motion.div variants={sectionVariants}>
                  <NotificationsCard />
                </motion.div>
              </Grid>

              {/* Recent Clients - Half Width */}
              <Grid item xs={12} md={6}>
                <motion.div variants={sectionVariants}>
                  <RecentClientList />
                </motion.div>
              </Grid>

              {/* Recommendations or Chat Notifications - Half Width */}
              <Grid item xs={12} md={6}>
                <motion.div variants={sectionVariants}>
                  {isPremium ? <RecommendationCard /> : <ChatNotifications />}
                </motion.div>
              </Grid>

              {/* ROI Calculator - Full Width for Premium */}
              {isPremium && (
                <Grid item xs={12}>
                  <motion.div variants={sectionVariants}>
                    <ROICalculator open={false} onClose={() => {}} />
                  </motion.div>
                </Grid>
              )}

              {/* Recent Activity - Full Width for Premium */}
              {isPremium && (
                <Grid item xs={12}>
                  <motion.div variants={sectionVariants}>
                    <RecentActivityList />
                  </motion.div>
                </Grid>
              )}
            </Grid>

            {/* Footer section */}
            <motion.div variants={sectionVariants}>
              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  p: 3,
                  borderRadius: 4,
                  background: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
              >
                <Stack 
                  direction={{ xs: 'column', md: 'row' }} 
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  spacing={2}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      © {new Date().getFullYear()} Assuriva - Plataforma para corredores de seguros
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Todos los datos se actualizan en tiempo real. Última sincronización: {kpis?.lastUpdated ? new Date(kpis.lastUpdated.toDate()).toLocaleTimeString() : 'N/A'}
                    </Typography>
      </Box>
                  <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                    <Typography 
                      component={Link}
                      href="/dashboard/soporte" 
                      variant="body2" 
                      color="primary"
                      sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      Soporte
                    </Typography>
                    <Typography 
                      component={Link}
                      href="/dashboard/configuracion" 
                      variant="body2" 
                      color="primary"
                      sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      Configuración
                    </Typography>
                    <Typography 
                      component={Link}
                      href="/ayuda" 
                      variant="body2" 
                      color="primary"
                      sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      Ayuda
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </motion.div>
          </Stack>
        </Container>
      </Box>
    </Fade>
  );
};

export default DashboardPage;