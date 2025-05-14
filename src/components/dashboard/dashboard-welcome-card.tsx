'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Stack, 
  useTheme, 
  alpha, 
  Button,
  Skeleton,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  Tooltip,
  TextField,
  InputAdornment,
  IconButton,
  Badge,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  ArrowForward as ArrowForwardIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Insights as InsightsIcon
} from '@mui/icons-material';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import KpiRefreshButton from '../ui/kpi-refresh-button';
import { useKpiUpdater } from '@/hooks/use-kpi-updater';
import { getKpis } from '@/lib/generate-kpis';
import { useRouter } from 'next/navigation';

interface DashboardWelcomeCardProps {
  timeOfDay: 'morning' | 'afternoon' | 'evening';
}

const DashboardWelcomeCard: React.FC<DashboardWelcomeCardProps> = ({ timeOfDay }) => {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { updateKpis, isUpdating, error: kpiError } = useKpiUpdater();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  useEffect(() => {
    // Determine greeting based on timeOfDay received as prop
    const getGreeting = () => {
      switch (timeOfDay) {
        case 'morning':
          return 'Buenos días';
        case 'afternoon':
          return 'Buenas tardes';
        case 'evening':
          return 'Buenas noches';
        default:
          return 'Hola';
      }
    };

    // Format current time
    const formatTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return now.toLocaleDateString('es-ES', options);
    };

    setGreeting(getGreeting());
    setCurrentTime(formatTime());
    setLoading(false);

    // Update current time periodically
    const interval = setInterval(() => {
      setCurrentTime(formatTime());
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [timeOfDay]);

  // Get last updated date for KPIs
  useEffect(() => {
    const fetchLastUpdated = async () => {
      if (user?.uid) {
        const kpis = await getKpis(user.uid);
        if (kpis?.lastUpdated) {
          setLastUpdated(kpis.lastUpdated.toDate());
        }
      }
    };
    
    fetchLastUpdated();
  }, [user?.uid]);

  // Effect to show KPI errors
  useEffect(() => {
    if (kpiError) {
      setSnackbar({
        open: true,
        message: kpiError,
        severity: 'error'
      });
    }
  }, [kpiError]);

  const handleRefreshKpis = async () => {
    try {
      const success = await updateKpis();
      
      if (success) {
        setSnackbar({
          open: true,
          message: 'KPIs actualizados correctamente',
          severity: 'success'
        });
        
        // Update last updated date
        if (user?.uid) {
          const kpis = await getKpis(user.uid);
          if (kpis?.lastUpdated) {
            setLastUpdated(kpis.lastUpdated.toDate());
          }
        }
      }
    } catch (error) {
      console.error('Error updating KPIs:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar KPIs',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      // For now, just show a snackbar
      setSnackbar({
        open: true,
        message: `Buscando: ${searchQuery}`,
        severity: 'info'
      });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const toggleSearch = () => {
    setShowSearch(prev => !prev);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  const handleViewAnalytics = () => {
    router.push('/dashboard/analisis');
  };

  return (
    <>
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          p: 3,
          borderRadius: 4,
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)}, ${alpha(theme.palette.primary.main, 0.05)})`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.primary.main, 0.05)})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0)} 70%)`,
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0)} 70%)`,
            zIndex: 0
          }}
        />

        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {loading || profileLoading ? (
              <Skeleton variant="circular" width={60} height={60} />
            ) : (
              <Avatar
                src={profile?.avatarUrl || user?.photoURL || undefined}
                alt={profile?.displayName || user?.displayName || 'Usuario'}
                sx={{ 
                  width: 60, 
                  height: 60,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              />
            )}
            <Box>
              {loading ? (
                <>
                  <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width={150} height={24} />
                </>
              ) : (
                <>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    fontWeight={700} 
                    fontFamily="Sora"
                    sx={{ mb: 0.5 }}
                  >
                    {greeting}, {profile?.firstName || user?.displayName?.split(' ')[0] || 'Corredor'}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      fontFamily="Sora"
                    >
                      {currentTime}
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Dashboard" 
                      color="primary" 
                      variant="outlined"
                      sx={{ 
                        height: 22, 
                        fontWeight: 500,
                        borderRadius: '6px',
                        backgroundColor: alpha(theme.palette.primary.main, 0.1)
                      }} 
                    />
                  </Stack>
                </>
              )}
            </Box>
          </Stack>

          {showSearch ? (
            <Box 
              component="form" 
              onSubmit={handleSearchSubmit}
              sx={{ 
                width: { xs: '100%', md: 300 },
                mt: { xs: 2, md: 0 }
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar pólizas, clientes, tareas..."
                value={searchQuery}
                onChange={handleSearchChange}
                variant="outlined"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(8px)',
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
                    }
                  }
                }}
              />
            </Box>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              <Tooltip title="Buscar" arrow>
                <IconButton
                  onClick={toggleSearch}
                  sx={{
                    p: 1,
                    borderRadius: '12px',
                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.9)
                    }
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Notificaciones" arrow>
                <IconButton
                  sx={{
                    p: 1,
                    borderRadius: '12px',
                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.9)
                    }
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Actualizar KPIs" arrow>
                <Box>
                  <KpiRefreshButton 
                    tooltip="Actualizar KPIs del dashboard"
                    size="medium"
                    onRefresh={handleRefreshKpis}
                    isRefreshing={isUpdating}
                    lastUpdated={lastUpdated}
                  />
                </Box>
              </Tooltip>
              
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleViewAnalytics}
                startIcon={<InsightsIcon />}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontFamily: 'Sora',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                  }
                }}
              >
                Ver análisis completo
              </Button>
            </Stack>
          )}
        </Stack>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DashboardWelcomeCard;