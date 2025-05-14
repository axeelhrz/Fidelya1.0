import React, { useEffect, useState, useCallback, useRef, ReactNode, memo } from 'react';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  alpha,
  Skeleton,
  Tooltip,
  Chip,
  IconButton,
  Collapse,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Autorenew as AutorenewIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  PersonAdd as PersonAddIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomerStats as CustomerStatsType } from '@/types/customer';

interface StatCardData {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  subtitle: string;
  change: string | null;
  highlight: boolean;
  tooltip: string;
  category: string;
}

interface CustomerStatsProps {
  stats: CustomerStatsType;
  loading: boolean;
  isRefreshing?: boolean;
  newCustomerAdded?: boolean;
  onRefresh?: () => Promise<boolean>;
}

// Memoized stat card component for better performance
const StatCard = memo(({ stat, index, isPolicy = false }: { 
  stat: StatCardData; 
  index: number; 
  isPolicy?: boolean;
}) => {
  const theme = useTheme();
  
  return (
    <Tooltip key={`${isPolicy ? 'policy' : 'primary'}-${index}`} title={stat.tooltip} arrow placement="top">
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: (isPolicy ? index + 4 : index) * 0.1 }}
        elevation={0}
        sx={{
          p: 2.5,
          width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          background: stat.highlight
            ? `linear-gradient(135deg, ${alpha(stat.color, 0.15)}, ${alpha(stat.color, 0.05)})`
            : theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.8)
              : alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(stat.color, stat.highlight ? 0.3 : 0.1)}`,
          boxShadow: stat.highlight
            ? `0 8px 32px -8px ${alpha(stat.color, 0.35)}`
            : 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 10px 30px -10px ${alpha(stat.color, 0.25)}`,
            border: `1px solid ${alpha(stat.color, 0.3)}`,
          },
          mb: 2,
          mx: { xs: 0, sm: 1 },
        }}
      >
        {/* Decorative element */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            bgcolor: stat.color,
            opacity: stat.highlight ? 1 : 0.7,
          }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            fontFamily="'Sora', sans-serif"
            sx={{ color: theme.palette.text.primary }}
          >
            {stat.title}
          </Typography>
          
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(stat.color, 0.15),
              color: stat.color,
            }}
          >
            {stat.icon}
          </Box>
        </Box>
        
        <Box sx={{ mt: 'auto' }}>
          <Typography
            variant="h3"
            fontWeight={700}
            fontFamily="'Sora', sans-serif"
            sx={{
              mb: 0.5,
              color: theme.palette.text.primary,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {stat.value}
            
            {stat.change && (
              <Chip
                size="small"
                label={stat.change}
                color="success"
                sx={{
                  ml: 1,
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              />
            )}
          </Typography>
          
          <Typography
            variant="caption"
            color="text.secondary"
            fontFamily="'Sora', sans-serif"
            sx={{ display: 'block' }}
          >
            {stat.subtitle}
          </Typography>
        </Box>
        
        {stat.highlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: `radial-gradient(circle at center, ${alpha(stat.color, 0.2)} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
        )}
      </Paper>
    </Tooltip>
  );
});

StatCard.displayName = 'StatCard';

// Memoized loading skeleton for better performance
const StatCardSkeleton = memo(({ index, isPolicy = false }: { index: number; isPolicy?: boolean }) => {
  const theme = useTheme();
  
  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (isPolicy ? index + 4 : index) * 0.1 }}
      elevation={0}
      sx={{
        p: 2.5,
        width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: theme.palette.mode === 'dark'
          ? alpha(theme.palette.background.paper, 0.8)
          : alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(8px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        mb: 2,
        mx: { xs: 0, sm: 1 },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
      
      <Box sx={{ mt: 'auto' }}>
        <Skeleton variant="rectangular" width="60%" height={40} sx={{ borderRadius: 1, mb: 1 }} />
        <Skeleton variant="text" width="40%" height={16} />
      </Box>
    </Paper>
  );
});

StatCardSkeleton.displayName = 'StatCardSkeleton';

// Main component with performance optimizations
export const CustomerStats: React.FC<CustomerStatsProps> = memo(({
  stats,
  loading,
  isRefreshing = false,
  newCustomerAdded = false,
  onRefresh
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [localIsRefreshing, setLocalIsRefreshing] = useState(false);
  const prevStatsRef = useRef<CustomerStatsType | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const updateInProgressRef = useRef<boolean>(false);
  const statsUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate percentages with memoization
  const activePercentage = stats.totalCustomers > 0
    ? Math.round((stats.activeCustomers / stats.totalCustomers) * 100)
    : 0;
  
  const withPoliciesPercentage = stats.totalCustomers > 0
    ? Math.round((stats.customersWithPolicies / stats.totalCustomers) * 100)
    : 0;
  
  // Improved debounced refresh function with better handling
  const debouncedRefresh = useCallback(() => {
    // Si ya hay una actualización en progreso, no hacemos nada
    if (updateInProgressRef.current) return;

    // Limpiamos cualquier timeout pendiente
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    // Marcamos que hay una actualización en progreso
    updateInProgressRef.current = true;

    // Establecemos un nuevo timeout
    refreshTimeoutRef.current = setTimeout(async () => {
      if (onRefresh && !localIsRefreshing && !isRefreshing) {
        setLocalIsRefreshing(true);
        try {
          const success = await onRefresh();
          if (success) {
            setLastRefreshed(new Date());
          }
        } catch (error) {
          console.error('Error refreshing statistics:', error);
        } finally {
          setLocalIsRefreshing(false);
          // Después de completar la actualización, permitimos otra después de un tiempo
          setTimeout(() => {
            updateInProgressRef.current = false;
          }, 1000); // Esperar 1 segundo antes de permitir otra actualización
        }
      } else {
        // Si no se pudo actualizar, permitimos intentarlo de nuevo
        updateInProgressRef.current = false;
      }
    }, 500); // Aumentamos el tiempo de debounce para evitar múltiples actualizaciones
  }, [onRefresh, localIsRefreshing, isRefreshing]);
  
  // Detect changes in statistics - optimizado para evitar actualizaciones múltiples
  useEffect(() => {
    // Si estamos cargando o actualizando, no hacemos nada
    if (loading || isRefreshing || localIsRefreshing) return;
    
    // Si es la primera carga, guardamos las estadísticas actuales
    if (!prevStatsRef.current) {
      prevStatsRef.current = { ...stats };
      return;
    }
    
    // Limpiamos cualquier timeout pendiente para la actualización de estadísticas
    if (statsUpdateTimeoutRef.current) {
      clearTimeout(statsUpdateTimeoutRef.current);
    }

    // Usamos un timeout para agrupar múltiples actualizaciones cercanas
    statsUpdateTimeoutRef.current = setTimeout(() => {
      // Verificamos si hay cambios en las estadísticas
    const hasChanges = 
        stats.totalCustomers !== prevStatsRef.current!.totalCustomers ||
        stats.activeCustomers !== prevStatsRef.current!.activeCustomers ||
        stats.newCustomersThisMonth !== prevStatsRef.current!.newCustomersThisMonth ||
        stats.customersWithPolicies !== prevStatsRef.current!.customersWithPolicies;
    
      // Si hay cambios, actualizamos la hora de la última actualización
    if (hasChanges) {
      setLastRefreshed(new Date());
      
        // Si se agregó un nuevo cliente, expandimos la sección
        if (stats.totalCustomers > prevStatsRef.current!.totalCustomers) {
        setExpanded(true);
      }
    }
    
      // Actualizamos la referencia a las estadísticas actuales
    prevStatsRef.current = { ...stats };
    }, 300);

    // Limpiamos el timeout al desmontar
    return () => {
      if (statsUpdateTimeoutRef.current) {
        clearTimeout(statsUpdateTimeoutRef.current);
      }
    };
  }, [stats, loading, isRefreshing, localIsRefreshing]);

  // Handle new customer added - optimizado para evitar múltiples actualizaciones
  useEffect(() => {
    if (newCustomerAdded && !updateInProgressRef.current) {
      // Expandimos la sección cuando se agrega un nuevo cliente
      setExpanded(true);

      // Actualizamos las estadísticas una sola vez
      if (!updateInProgressRef.current) {
                debouncedRefresh();
      }
    }
  }, [newCustomerAdded, debouncedRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (statsUpdateTimeoutRef.current) {
        clearTimeout(statsUpdateTimeoutRef.current);
      }
    };
  }, []);

  // Memoize stat data to prevent unnecessary re-renders
  const primaryStats = React.useMemo(() => [
    {
      title: 'Total Clientes',
      value: stats.totalCustomers,
      icon: <PeopleIcon />,
      color: theme.palette.primary.main,
      subtitle: `${activePercentage}% activos`,
      change: null,
      highlight: newCustomerAdded,
      tooltip: 'Número total de clientes registrados en el sistema',
      category: 'primary',
    },
    {
      title: 'Clientes Activos',
      value: stats.activeCustomers,
      icon: <CheckCircleIcon />,
                        color: theme.palette.success.main,
      subtitle: `${activePercentage}% del total`,
      change: null,
      highlight: false,
      tooltip: 'Clientes con estado activo',
      category: 'primary',
    },
    {
      title: 'Nuevos este mes',
      value: stats.newCustomersThisMonth,
      icon: <PersonAddIcon />,
      color: theme.palette.info.main,
      subtitle: 'desde el inicio del mes',
      change: stats.newCustomersThisMonth > 0 ? '+' + stats.newCustomersThisMonth : '0',
      highlight: newCustomerAdded,
      tooltip: 'Clientes añadidos durante el mes actual',
      category: 'primary',
    },
    {
      title: 'Oportunidades',
      value: stats.leadCustomers,
      icon: <TrendingUpIcon />,
      color: theme.palette.secondary.main,
      subtitle: 'leads potenciales',
      change: null,
      highlight: false,
      tooltip: 'Clientes potenciales en estado de lead',
      category: 'primary',
    },
  ], [stats, activePercentage, newCustomerAdded, theme.palette]);

  const policyStats = React.useMemo(() => [
    {
      title: 'Con Pólizas',
      value: stats.customersWithPolicies,
      icon: <AssignmentIcon />,
      color: theme.palette.info.main,
      subtitle: `${withPoliciesPercentage}% del total`,
      change: null,
      highlight: false,
      tooltip: 'Clientes que tienen al menos una póliza',
      category: 'policy',
    },
    {
      title: 'Pólizas Activas',
      value: stats.customersWithActivePolicies,
      icon: <CheckCircleIcon />,
      color: theme.palette.success.main,
      subtitle: 'clientes con pólizas activas',
      change: null,
      highlight: false,
      tooltip: 'Clientes con al menos una póliza activa',
      category: 'policy',
    },
    {
      title: 'Por Renovar',
      value: stats.customersWithRenewingPolicies,
      icon: <AutorenewIcon />,
      color: theme.palette.warning.main,
      subtitle: 'en los próximos 30 días',
      change: null,
      highlight: false,
      tooltip: 'Clientes con pólizas que vencen en los próximos 30 días',
      category: 'policy',
    },
    {
      title: 'Vencidas',
      icon: <WarningIcon />,
      value: stats.customersWithExpiredPolicies,
      color: theme.palette.error.main,
      subtitle: 'clientes con pólizas vencidas',
      change: null,
      highlight: false,
      tooltip: 'Clientes con pólizas que ya han vencido',
      category: 'policy',
    },
  ], [stats, withPoliciesPercentage, theme.palette]);

  // Format the last refreshed time
  const formatLastRefreshed = useCallback(() => {
    const now = new Date();
    const diff = now.getTime() - lastRefreshed.getTime();

    // If it was less than a minute ago
    if (diff < 60000) {
      return 'hace unos segundos';
    }

    // If it was less than an hour ago
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }

    // If it was today
    if (lastRefreshed.toDateString() === now.toDateString()) {
      return `hoy a las ${lastRefreshed.getHours().toString().padStart(2, '0')}:${lastRefreshed.getMinutes().toString().padStart(2, '0')}`;
    }

    // If it was yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastRefreshed.toDateString() === yesterday.toDateString()) {
      return `ayer a las ${lastRefreshed.getHours().toString().padStart(2, '0')}:${lastRefreshed.getMinutes().toString().padStart(2, '0')}`;
    }

    // Otherwise, show the full date
    return `${lastRefreshed.getDate()}/${lastRefreshed.getMonth() + 1}/${lastRefreshed.getFullYear()} ${lastRefreshed.getHours().toString().padStart(2, '0')}:${lastRefreshed.getMinutes().toString().padStart(2, '0')}`;
  }, [lastRefreshed]);

  // Memoized collapsed summary stats
  const collapsedSummaryStats = React.useMemo(() => [
    {
      icon: <PeopleIcon />,
      color: theme.palette.primary.main,
      value: `${stats.totalCustomers} clientes`,
    },
    {
      icon: <CheckCircleIcon />,
      color: theme.palette.success.main,
      value: `${stats.activeCustomers} activos`,
    },
    {
      icon: <AssignmentIcon />,
      color: theme.palette.info.main,
      value: `${stats.customersWithPolicies} con pólizas`,
    },
    {
      icon: <AutorenewIcon />,
      color: theme.palette.warning.main,
      value: `${stats.customersWithRenewingPolicies} por renovar`,
    },
  ], [stats, theme.palette]);

  // Función para manejar la actualización manual
  const handleManualRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Solo permitimos la actualización si no hay una en progreso
    if (!updateInProgressRef.current && !isRefreshing && !localIsRefreshing && !loading) {
      debouncedRefresh();
    }
  };

  return (
        <Box 
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
          sx={{ 
        mb: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: expanded ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}` : 'none',
        transition: 'box-shadow 0.3s ease',
          }}
        >
      {/* Header with toggle */}
              <Box 
                sx={{ 
          p: 2,
                  display: 'flex', 
          justifyContent: 'space-between',
                  alignItems: 'center',
          borderBottom: expanded ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
          bgcolor: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: 'blur(10px)',
          cursor: 'pointer',
                }}
        onClick={() => setExpanded(!expanded)}
              >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="small"
            sx={{ mr: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>

          <Typography
            variant="h6"
            fontWeight={600}
            fontFamily="'Sora', sans-serif"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: theme.palette.text.primary,
            }}
          >
            Estadísticas de Clientes
            {newCustomerAdded && (
              <Chip
                label="¡Nuevo cliente añadido!"
                color="success"
                size="small"
                sx={{
                  ml: 2,
                  fontWeight: 500,
                  '@keyframes pulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' },
                  },
                  animation: 'pulse 2s infinite',
                }}
              />
          )}
          </Typography>
    </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={`Actualizado ${formatLastRefreshed()}`} arrow>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
              {formatLastRefreshed()}
            </Typography>
          </Tooltip>
          
          <Tooltip title="Actualizar estadísticas" arrow>
            <IconButton
              size="small"
              onClick={handleManualRefresh}
              disabled={loading || isRefreshing || localIsRefreshing}
              sx={{
                position: 'relative',
                color: (loading || isRefreshing || localIsRefreshing) ? 'text.disabled' : 'primary.main',
              }}
            >
              <RefreshIcon sx={{ 
                animation: (isRefreshing || localIsRefreshing) ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                }
              }} />
              {(isRefreshing || localIsRefreshing) && (
                <CircularProgress
                  size={20}
                  thickness={5}
                  sx={{
                    color: 'primary.main',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-10px',
                    marginLeft: '-10px',
                  }}
                />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Collapsible content */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2 }}>
          {/* Primary Stats */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: theme.palette.text.secondary }}>
            Resumen General
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              mx: { xs: 0, sm: -1 },
            }}
          >
            {loading
              ? Array.from(new Array(4)).map((_, index) => (
                  <StatCardSkeleton key={`primary-skeleton-${index}`} index={index} />
                ))
              : primaryStats.map((stat, index) => (
                  <StatCard key={`primary-${index}`} stat={stat} index={index} />
                ))}
          </Box>

          {/* Policy Stats */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3, mb: 2, color: theme.palette.text.secondary }}>
            Estado de Pólizas
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              mx: { xs: 0, sm: -1 },
            }}
          >
            {loading
              ? Array.from(new Array(4)).map((_, index) => (
                  <StatCardSkeleton key={`policy-skeleton-${index}`} index={index} isPolicy />
                ))
              : policyStats.map((stat, index) => (
                  <StatCard key={`policy-${index}`} stat={stat} index={index} isPolicy />
                ))}
          </Box>
        </Box>
      </Collapse>

      {/* Collapsed Summary */}
      <AnimatePresence>
        {!expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box 
              sx={{ 
                p: 1.5, 
                display: 'flex', 
                justifyContent: 'space-around', 
                alignItems: 'center',
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(10px)',
              }}
            >
              {collapsedSummaryStats.map((item, index) => (
                <Tooltip key={`summary-${index}`} title={item.value} arrow placement="top">
                  <Box sx={{ display: 'flex', alignItems: 'center', color: item.color }}>
                    <Box sx={{ fontSize: 18, mr: 0.5, display: 'flex' }}>
                      {item.icon}
                    </Box>
                    <Typography variant="caption" fontWeight={500} sx={{ display: { xs: 'none', sm: 'block' } }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
});

CustomerStats.displayName = 'CustomerStats';