'use client';

import React, { useState, useEffect, useMemo, useCallback, memo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Store,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  UserPlus,
  BarChart3,
  Activity,
  Clock,
  DollarSign,
  Zap,
  ArrowUpRight,
  Shield,
  Minus,
  Eye,
  Building2,
  UserCheck,
  UserX,
  Gift
} from 'lucide-react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useOptimizedSocioData } from '@/hooks/useOptimizedSocioData';
import { useOptimizedComercioData } from '@/hooks/useOptimizedComercioData';
import { useDebounce } from '@/hooks/useDebounce';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

// Lazy load heavy components
const ModernActivityTimeline = lazy(() => import('./ModernActivityTimeline'));
const ModernSystemStatusCard = lazy(() => import('./ModernSystemStatusCard'));

interface OverviewDashboardProps {
  onNavigate: (section: string) => void;
  onAddMember: () => void;
}

interface ActivityLog {
  id: string;
  type: 'member_added' | 'member_updated' | 'payment_received' | 'backup_completed' | 'import_completed' | 'system_alert';
  title: string;
  description: string;
  timestamp: Timestamp;
  metadata?: Record<string, unknown>;
  userId?: string;
  userName?: string;
}

interface SystemHealth {
  status: 'excellent' | 'good' | 'warning' | 'critical';
  lastBackup: Date | null;
  storageUsed: number;
  storageLimit: number;
  uptime: number;
  responseTime: number;
}

// Memoized KPI Card Component - Optimized for mobile
const OptimizedKPICard = memo<{
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  gradient: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
  loading?: boolean;
  badge?: string;
  delay?: number;
}>(({
  title,
  value,
  change,
  icon,
  gradient,
  subtitle,
  trend = 'neutral',
  onClick,
  loading = false,
  badge,
  delay = 0
}) => {
  const handleClick = useCallback(() => {
    if (onClick && !loading) {
      onClick();
    }
  }, [onClick, loading]);

  const trendIcon = useMemo(() => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'down': return <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <Minus className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  }, [trend]);

  const trendColor = useMemo(() => {
    switch (trend) {
      case 'up': return 'bg-emerald-100 text-emerald-600';
      case 'down': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  }, [trend]);

  const changeColor = useMemo(() => {
    switch (trend) {
      case 'up': return 'text-emerald-600';
      case 'down': return 'text-red-600';
      default: return 'text-slate-500';
    }
  }, [trend]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-white/30 p-4 sm:p-6 lg:p-8 cursor-pointer transition-all duration-300 hover:shadow-xl sm:hover:shadow-2xl group overflow-hidden"
      onClick={handleClick}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl sm:rounded-3xl`} />
      
      {/* Badge */}
      {badge && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4"
        >
          <div className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-lg">
            {badge}
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.1, type: "spring", stiffness: 200 }}
          className={`
            relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl transition-all duration-300
            bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl group-hover:scale-110
          `}
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white animate-spin" />
          ) : (
            <div className="text-white group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
        </motion.div>
        
        {/* Trend Indicator */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.3 }}
          className="flex items-center space-x-1 sm:space-x-2"
        >
          <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${trendColor}`}>
            {trendIcon}
          </div>
          <span className={`text-xs sm:text-sm font-bold ${changeColor}`}>
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="space-y-2 sm:space-y-3">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.2 }}
          className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider"
        >
          {title}
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3 }}
          className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors duration-300"
        >
          {loading ? (
            <div className="flex space-x-1">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-200 rounded animate-pulse" />
              <div className="w-8 h-6 sm:w-12 sm:h-8 bg-slate-200 rounded animate-pulse" />
            </div>
          ) : value}
        </motion.p>
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.4 }}
            className="text-xs sm:text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Action Arrow */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0, scale: 1 }}
        whileHover={{ opacity: 1, scale: 1.1 }}
        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 transition-all duration-300"
      >
        <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg sm:rounded-xl group-hover:bg-slate-200 transition-colors duration-300">
          <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
        </div>
      </motion.div>
    </motion.div>
  );
});

OptimizedKPICard.displayName = 'OptimizedKPICard';

// Memoized Quick Stats Component - Mobile Optimized (Only show if vencidos > 0)
const OptimizedQuickStats = memo<{
  totalSocios: number;
  activosSocios: number;
  vencidosSocios: number;
  totalComercios: number;
  loading: boolean;
}>(({ totalSocios, activosSocios, vencidosSocios, totalComercios, loading }) => {
  const stats = useMemo(() => {
    const baseStats = [
      {
        label: 'Total Socios',
        value: totalSocios,
        icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
        gradient: 'from-blue-500 to-cyan-500',
        bgGradient: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-100'
      },
      {
        label: 'Socios Activos',
        value: activosSocios,
        icon: <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />,
        gradient: 'from-emerald-500 to-teal-500',
        bgGradient: 'from-emerald-50 to-teal-50',
        borderColor: 'border-emerald-100'
      },
      {
        label: 'Comercios Activos',
        value: totalComercios,
        icon: <Store className="w-4 h-4 sm:w-5 sm:h-5" />,
        gradient: 'from-purple-500 to-violet-500',
        bgGradient: 'from-purple-50 to-violet-50',
        borderColor: 'border-purple-100'
      }
    ];

    // Only add vencidos if there are any
    if (vencidosSocios > 0) {
      baseStats.splice(2, 0, {
        label: 'Socios Vencidos',
        value: vencidosSocios,
        icon: <UserX className="w-4 h-4 sm:w-5 sm:h-5" />,
        gradient: 'from-red-500 to-pink-500',
        bgGradient: 'from-red-50 to-pink-50',
        borderColor: 'border-red-100'
      });
    }

    return baseStats;
  }, [totalSocios, activosSocios, vencidosSocios, totalComercios]);

  const gridCols = vencidosSocios > 0 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3';

  return (
    <div className={`grid ${gridCols} gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`bg-gradient-to-br ${stat.bgGradient} rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-md sm:shadow-lg border ${stat.borderColor} p-3 sm:p-4 lg:p-6 transition-all duration-300 hover:shadow-lg sm:hover:shadow-xl`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${stat.gradient} shadow-lg mx-auto sm:mx-0`}>
              {stat.icon}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-1">{stat.label}</p>
              <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900">
                {loading ? (
                  <div className="w-12 h-6 sm:w-16 sm:h-8 bg-slate-200 rounded animate-pulse mx-auto sm:mx-0" />
                ) : (
                  stat.value.toLocaleString()
                )}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

OptimizedQuickStats.displayName = 'OptimizedQuickStats';

// Loading Skeleton Component - Mobile Optimized
const LoadingSkeleton = memo(() => (
  <div className="space-y-6 sm:space-y-8">
    {/* Header Skeleton */}
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-slate-200 rounded-2xl sm:rounded-3xl animate-pulse" />
          <div>
            <div className="w-32 sm:w-48 h-6 sm:h-8 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="w-40 sm:w-64 h-4 sm:h-6 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex space-x-2 sm:space-x-4">
          <div className="w-24 sm:w-32 h-10 sm:h-12 bg-slate-200 rounded-xl sm:rounded-2xl animate-pulse" />
          <div className="w-24 sm:w-32 h-10 sm:h-12 bg-slate-200 rounded-xl sm:rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>

    {/* Quick Stats Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-slate-50 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-md sm:shadow-lg p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-slate-200 rounded-xl sm:rounded-2xl animate-pulse mx-auto sm:mx-0" />
            <div className="text-center sm:text-left">
              <div className="w-16 sm:w-24 h-3 sm:h-4 bg-slate-200 rounded animate-pulse mb-2 mx-auto sm:mx-0" />
              <div className="w-12 sm:w-16 h-6 sm:h-8 bg-slate-200 rounded animate-pulse mx-auto sm:mx-0" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* KPI Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-slate-200 rounded-xl sm:rounded-2xl animate-pulse" />
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-200 rounded-lg sm:rounded-xl animate-pulse" />
              <div className="w-8 sm:w-12 h-3 sm:h-4 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="w-20 sm:w-24 h-3 sm:h-4 bg-slate-200 rounded animate-pulse" />
            <div className="w-24 sm:w-32 h-8 sm:h-10 bg-slate-200 rounded animate-pulse" />
            <div className="w-28 sm:w-40 h-3 sm:h-4 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Main Component
const OptimizedOverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigate,
  onAddMember
}) => {
  const { user } = useAuth();
  const { 
    stats: socioStats, 
    loading: sociosLoading, 
    refreshStats: refreshSocioStats,
    lastUpdated: socioLastUpdated 
  } = useOptimizedSocioData();
  
  const { 
    stats: comercioStats, 
    loading: comerciosLoading,
    refreshStats: refreshComercioStats,
    lastUpdated: comercioLastUpdated 
  } = useOptimizedComercioData();
  
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const debouncedRefresh = useDebounce(() => {
    handleRefresh();
  }, 1000);

  const systemHealth = useMemo<SystemHealth>(() => ({
    status: 'good',
    lastBackup: subDays(new Date(), 1),
    storageUsed: 1024,
    storageLimit: 5120,
    uptime: 99.9,
    responseTime: 120,
  }), []);

  // Memoized growth metrics calculation
  const growthMetrics = useMemo(() => {
    const memberGrowth = activities.filter(a => a.type === 'member_added').length;
    const growthRate = socioStats.total > 0 ? (memberGrowth / socioStats.total) * 100 : 0;
    const retentionRate = socioStats.total > 0 ? (socioStats.activos / socioStats.total) * 100 : 0;

    return {
      growthRate: Math.round(growthRate * 100) / 100,
      retentionRate: Math.round(retentionRate * 100) / 100,
    };
  }, [activities, socioStats]);

  // Memoized KPI metrics - Only show relevant metrics, exclude vencidos if 0
  const kpiMetrics = useMemo(() => {
    const activosPercentage = socioStats.total > 0 ? (socioStats.activos / socioStats.total) * 100 : 0;
    const comerciosGrowth = comercioStats.comerciosActivos > 0 ? 5.2 : 0; // Simulated growth
    
    const metrics = [
      {
        title: 'Socios Activos',
        value: `${socioStats.activos.toLocaleString()}`,
        change: activosPercentage,
        icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />,
        gradient: 'from-emerald-500 to-teal-500',
        subtitle: `${activosPercentage.toFixed(1)}% del total`,
        trend: activosPercentage > 80 ? 'up' as const : activosPercentage > 60 ? 'neutral' as const : 'down' as const,
        onClick: () => onNavigate('socios'),
        loading: sociosLoading
      },
      {
        title: 'Comercios Vinculados',
        value: `${comercioStats.comerciosActivos.toLocaleString()}`,
        change: comerciosGrowth,
        icon: <Building2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />,
        gradient: 'from-purple-500 to-violet-500',
        subtitle: 'Red de comercios activa',
        trend: comerciosGrowth > 0 ? 'up' as const : 'neutral' as const,
        onClick: () => onNavigate('comercios'),
        loading: comerciosLoading
      }
    ];

    // Only add vencidos metric if there are vencidos > 0
    if (socioStats.vencidos > 0) {
      const vencidosPercentage = (socioStats.vencidos / socioStats.total) * 100;
      metrics.splice(1, 0, {
        title: 'Socios Vencidos',
        value: `${socioStats.vencidos.toString()}`,
        change: vencidosPercentage,
        icon: <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />,
        gradient: 'from-red-500 to-pink-500',
        subtitle: `${vencidosPercentage.toFixed(1)}% requieren atención`,
        trend: vencidosPercentage > 20 ? 'up' as const : vencidosPercentage > 10 ? 'neutral' as const : 'down' as const,
        onClick: () => onNavigate('socios'),
        loading: sociosLoading,
        badge: vencidosPercentage > 15 ? 'Crítico' : undefined
      });
    }

    return metrics;
  }, [socioStats, comercioStats, sociosLoading, comerciosLoading, onNavigate]);

  // Optimized refresh handler
  const handleRefresh = useCallback(async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    try {
      await Promise.all([
        refreshSocioStats(),
        refreshComercioStats()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, refreshSocioStats, refreshComercioStats]);

  // Optimized activities listener
  useEffect(() => {
    if (!user?.uid) return;

    const activitiesRef = collection(db, 'activities');
    const activitiesQuery = query(
      activitiesRef,
      where('asociacionId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(activitiesQuery, (snapshot) => {
      const activitiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityLog[];
      
      setActivities(activitiesData);
      setActivitiesLoading(false);
    }, (error) => {
      console.error('Error listening to activities:', error);
      setActivitiesLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Show loading skeleton while initial data loads
  if (sociosLoading && comerciosLoading && activitiesLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-white/30 p-4 sm:p-6 lg:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl sm:shadow-2xl">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                  Vista General
                </h1>
                <p className="text-sm sm:text-lg lg:text-xl text-slate-600 mt-1">
                  Panel de control • {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: es })}
                </p>
                {(socioLastUpdated || comercioLastUpdated) && (
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Última actualización: {format(
                      socioLastUpdated || comercioLastUpdated || new Date(), 
                      'HH:mm:ss'
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={debouncedRefresh}
              disabled={refreshing}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddMember}
              className="bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900 text-white px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl text-sm sm:text-base"
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Nuevo Socio</span>
              <span className="sm:hidden">Nuevo</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <OptimizedQuickStats
        totalSocios={socioStats.total}
        activosSocios={socioStats.activos}
        vencidosSocios={socioStats.vencidos}
        totalComercios={comercioStats.comerciosActivos}
        loading={sociosLoading || comerciosLoading}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <AnimatePresence mode="wait">
          {kpiMetrics.map((metric, index) => (
            <OptimizedKPICard key={metric.title} {...metric} delay={index * 0.1} />
          ))}
        </AnimatePresence>
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="xl:col-span-2">
          <Suspense fallback={
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
              <div className="flex justify-center py-8 sm:py-12">
                <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
              </div>
            </div>
          }>
            <ModernActivityTimeline
              activities={activities}
              loading={activitiesLoading}
              onViewAll={() => onNavigate('notificaciones')}
            />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
              <div className="flex justify-center py-8 sm:py-12">
                <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
              </div>
            </div>
          }>
            <ModernSystemStatusCard
              health={systemHealth}
              loading={false}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default memo(OptimizedOverviewDashboard);