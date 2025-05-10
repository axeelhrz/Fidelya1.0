import React, { useEffect, useState, useCallback, useRef, ReactNode } from 'react';
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
  newCustomerAdded?: boolean;
  onRefresh?: () => Promise<boolean>;
}

export const CustomerStats: React.FC<CustomerStatsProps> = ({
  stats,
  loading,
  newCustomerAdded = false,
  onRefresh
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const prevStatsRef = useRef<CustomerStatsType | null>(null);
  
  // Calculate percentages
  const activePercentage = stats.totalCustomers > 0
    ? Math.round((stats.activeCustomers / stats.totalCustomers) * 100)
    : 0;
  
  const withPoliciesPercentage = stats.totalCustomers > 0
    ? Math.round((stats.customersWithPolicies / stats.totalCustomers) * 100)
    : 0;
  
  // Función para actualizar las estadísticas
  const refreshStats = useCallback(async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        const success = await onRefresh();
        if (success) {
          setLastRefreshed(new Date());
        }
      } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [onRefresh, isRefreshing]);
  
  // Detectar cambios en las estadísticas
  useEffect(() => {
    // Si es la primera carga, guardar las estadísticas actuales
    if (!prevStatsRef.current) {
      prevStatsRef.current = { ...stats };
      return;
    }
    
    // Verificar si hay cambios en las estadísticas
    const hasChanges = 
      stats.totalCustomers !== prevStatsRef.current.totalCustomers ||
      stats.activeCustomers !== prevStatsRef.current.activeCustomers ||
      stats.newCustomersThisMonth !== prevStatsRef.current.newCustomersThisMonth ||
      stats.customersWithPolicies !== prevStatsRef.current.customersWithPolicies;
    
    // Si hay cambios, actualizar la hora de última actualización
    if (hasChanges) {
      setLastRefreshed(new Date());
      
      // Si se agregó un nuevo cliente, expandir la sección
      if (stats.totalCustomers > prevStatsRef.current.totalCustomers) {
        setExpanded(true);
      }
    }
    
    // Actualizar la referencia a las estadísticas actuales
    prevStatsRef.current = { ...stats };
  }, [stats]);
  
  // Actualizar cuando se agrega un nuevo cliente
  useEffect(() => {
    if (newCustomerAdded) {
      // Expandir la sección cuando se agrega un nuevo cliente
      setExpanded(true);
      
      // Actualizar las estadísticas
      refreshStats();
    }
  }, [newCustomerAdded, refreshStats]);
  
  // Group stats into categories for better organization
  const primaryStats = [
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
  ];
  
  const policyStats = [
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
  ];
  
  // Render a stat card
  const renderStatCard = (stat: StatCardData, index: number, isPolicy: boolean = false) => (
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
          {loading || isRefreshing ? (
            <Skeleton variant="rectangular" width="60%" height={40} sx={{ borderRadius: 1, mb: 1 }} />
          ) : (
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
          )}
          
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
  
  // Formatear la hora de última actualización
  const formatLastRefreshed = () => {
    const now = new Date();
    const diff = now.getTime() - lastRefreshed.getTime();
    
    // Si fue hace menos de un minuto
    if (diff < 60000) {
      return 'hace unos segundos';
    }
    
    // Si fue hace menos de una hora
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }
    
    // Si fue hoy
    if (lastRefreshed.toDateString() === now.toDateString()) {
      return `hoy a las ${lastRefreshed.getHours().toString().padStart(2, '0')}:${lastRefreshed.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // Si fue ayer
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastRefreshed.toDateString() === yesterday.toDateString()) {
      return `ayer a las ${lastRefreshed.getHours().toString().padStart(2, '0')}:${lastRefreshed.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // En otro caso, mostrar la fecha completa
    return `${lastRefreshed.getDate()}/${lastRefreshed.getMonth() + 1}/${lastRefreshed.getFullYear()} ${lastRefreshed.getHours().toString().padStart(2, '0')}:${lastRefreshed.getMinutes().toString().padStart(2, '0')}`;
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
          cursor: 'pointer', // Añadir cursor pointer para indicar que es clickeable
        }}
        onClick={() => setExpanded(!expanded)} // Expandir/contraer al hacer clic en el header
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            size="small"
            sx={{ mr: 1 }}
            onClick={(e) => {
              e.stopPropagation(); // Evitar que el clic se propague al header
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
                sx={{ ml: 2, fontWeight: 500, animation: 'pulse 2s infinite' }}
              />
            )}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ mr: 1, fontStyle: 'italic' }}
          >
            Actualizado {formatLastRefreshed()}
          </Typography>
          
          <Tooltip title="Actualizar manualmente">
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation(); // Evitar que el clic se propague al header
                refreshStats();
              }}
              disabled={isRefreshing || loading}
              sx={{
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Collapsible content */}
      <Collapse in={expanded} timeout="auto">
        <Box sx={{ p: 2 }}>
          {/* Primary Stats Section */}
          <Typography
            variant="subtitle2"
            fontWeight={500}
            sx={{ mb: 1, color: theme.palette.text.secondary }}
          >
            Información General
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              mx: { xs: 0, sm: -1 },
              mb: 3 
            }}
          >
            {primaryStats.map((stat, index) => renderStatCard(stat, index))}
          </Box>
          
          {/* Policy Stats Section */}
          <Typography
            variant="subtitle2"
            fontWeight={500}
            sx={{ mb: 1, color: theme.palette.text.secondary }}
          >
            Información de Pólizas
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              mx: { xs: 0, sm: -1 }
            }}
          >
            {policyStats.map((stat, index) => renderStatCard(stat, index, true))}
          </Box>
          
          {/* New Customer Notification */}
          <AnimatePresence>
            {newCustomerAdded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: `linear-gradient(90deg, ${alpha(theme.palette.success.main, 0.15)}, ${alpha(theme.palette.success.main, 0.05)})`,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.success.main, 0.2),
                        color: theme.palette.success.main,
                        mr: 2,
                      }}
                    >
                      <PersonAddIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        ¡Nuevo cliente añadido con éxito!
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Las estadísticas se han actualizado automáticamente
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label="Actualizado"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Collapse>
      
      {/* Collapsed summary (visible when collapsed) */}
      {!expanded && (
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              p: 1,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <PeopleIcon 
              sx={{ 
                color: theme.palette.primary.main,
                mr: 1,
                fontSize: '1.2rem'
              }} 
            />
            <Typography variant="body2" fontWeight={600}>
              {loading || isRefreshing ? (
                <Skeleton width={30} />
              ) : (
                `${stats.totalCustomers} clientes`
              )}
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              p: 1,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.success.main, 0.1),
            }}
          >
            <CheckCircleIcon 
              sx={{ 
                color: theme.palette.success.main,
                mr: 1,
                fontSize: '1.2rem'
              }} 
            />
            <Typography variant="body2" fontWeight={600}>
              {loading || isRefreshing ? (
                <Skeleton width={30} />
              ) : (
                `${stats.activeCustomers} activos`
              )}
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              p: 1,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.info.main, 0.1),
            }}
          >
            <AssignmentIcon 
              sx={{ 
                color: theme.palette.info.main,
                mr: 1,
                fontSize: '1.2rem'
              }} 
            />
            <Typography variant="body2" fontWeight={600}>
              {loading || isRefreshing ? (
                <Skeleton width={30} />
              ) : (
                `${stats.customersWithPolicies} con pólizas`
              )}
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              p: 1,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.warning.main, 0.1),
            }}
          >
            <AutorenewIcon 
              sx={{ 
                color: theme.palette.warning.main,
                mr: 1,
                fontSize: '1.2rem'
              }} 
            />
            <Typography variant="body2" fontWeight={600}>
              {loading || isRefreshing ? (
                <Skeleton width={30} />
              ) : (
                `${stats.customersWithRenewingPolicies} por renovar`
              )}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
