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
  Building2
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

// Memoized KPI Card Component
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
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
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
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl group overflow-hidden"
      onClick={handleClick}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
      
      {/* Badge */}
      {badge && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="absolute top-4 right-4"
        >
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {badge}
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.1, type: "spring", stiffness: 200 }}
          className={`
            relative flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-2xl transition-all duration-300
            bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl group-hover:scale-110
          `}
        >
          {loading ? (
            <RefreshCw className="w-6 h-6 lg:w-7 lg:h-7 text-white animate-spin" />
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
          className="flex items-center space-x-2"
        >
          <div className={`p-2 rounded-xl transition-all duration-300 ${trendColor}`}>
            {trendIcon}
          </div>
          <span className={`text-sm font-bold ${changeColor}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.2 }}
          className="text-sm font-semibold text-slate-500 uppercase tracking-wider"
        >
          {title}
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3 }}
          className="text-3xl lg:text-4xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors duration-300"
        >
          {loading ? (
            <div className="flex space-x-1">
              <div className="w-8 h-8 bg-slate-200 rounded animate-pulse" />
              <div className="w-12 h-8 bg-slate-200 rounded animate-pulse" />
            </div>
          ) : value}
        </motion.p>
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.4 }}
            className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300"
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
        className="absolute bottom-4 right-4 transition-all duration-300"
      >
        <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-slate-200 transition-colors duration-300">
          <ArrowUpRight className="w-4 h-4 text-slate-600" />
        </div>
      </motion.div>
    </motion.div>
  );
});

OptimizedKPICard.displayName = 'OptimizedKPICard';

// Memoized Quick Stats Component
const OptimizedQuickStats = memo<{
  totalSocios: number;
  activosSocios: number;
  totalComercios: number;
  loading: boolean;
}>(({ totalSocios, activosSocios, totalComercios, loading }) => {
  const stats = useMemo(() => [
    {
      label: 'Total Socios',
      value: totalSocios,
      icon: <Users className="w-5 h-5" />,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-100'
    },
    {
      label: 'Socios Activos',
      value: activosSocios,
      icon: <CheckCircle className="w-5 h-5" />,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-100'
    },
    {
      label: 'Comercios Activos',
      value: totalComercios,
      icon: <Store className="w-5 h-5" />,
      gradient: 'from-purple-500 to-violet-500',
      bgGradient: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-100'
    }
  ], [totalSocios, activosSocios, totalComercios]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl lg:rounded-3xl shadow-lg border ${stat.borderColor} p-6 transition-all duration-300 hover:shadow-xl`}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${stat.gradient} shadow-lg`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-1">{stat.label}</p>
              <p className="text-2xl lg:text-3xl font-bold text-slate-900">
                {loading ? (
                  <div className="w-16 h-8 bg-slate-200 rounded animate-pulse" />
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

// Loading Skeleton Component
const LoadingSkeleton = memo(() => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-200 rounded-3xl animate-pulse" />
          <div>
            <div className="w-48 h-8 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="w-64 h-6 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="w-32 h-12 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="w-32 h-12 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>

    {/* Quick Stats Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-slate-50 rounded-2xl lg:rounded-3xl shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-slate-200 rounded-2xl animate-pulse" />
            <div>
              <div className="w-24 h-4 bg-slate-200 rounded animate-pulse mb-2" />
              <div className="w-16 h-8 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* KPI Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-slate-200 rounded-2xl animate-pulse" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-200 rounded-xl animate-pulse" />
              <div className="w-12 h-4 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
            <div className="w-32 h-10 bg-slate-200 rounded animate-pulse" />
            <div className="w-40 h-4 bg-slate-200 rounded animate-pulse" />
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

  // Memoized KPI metrics
  const kpiMetrics = useMemo(() => {
    const activosPercentage = socioStats.total > 0 ? Math.round((socioStats.activos / socioStats.total) * 100) : 0;
    const vencidosPercentage = socioStats.total > 0 ? Math.round((socioStats.vencidos / socioStats.total) * 100) : 0;
    
    return [
      {
        title: 'Total Socios',
        value: socioStats.total.toLocaleString(),
        change: growthMetrics.growthRate,
        icon: <Users className="w-6 h-6 lg:w-7 lg:h-7" />,
        gradient: 'from-blue-500 to-cyan-500',
        subtitle: 'Miembros registrados',
        trend: growthMetrics.growthRate > 0 ? 'up' as const : 'neutral' as const,
        onClick: () => onNavigate('socios'),
        loading: sociosLoading
      },
      {
        title: 'Socios Activos',
        value: `${socioStats.activos.toLocaleString()} (${activosPercentage}%)`,
        change: activosPercentage,
        icon: <CheckCircle className="w-6 h-6 lg:w-7 lg:h-7" />,
        gradient: 'from-emerald-500 to-teal-500',
        subtitle: 'Estado vigente',
        trend: activosPercentage > 80 ? 'up' as const : activosPercentage > 60 ? 'neutral' as const : 'down' as const,
        onClick: () => onNavigate('socios'),
        loading: sociosLoading
      },
      {
        title: 'Socios Vencidos',
        value: `${socioStats.vencidos.toString()} (${vencidosPercentage}%)`,
        change: vencidosPercentage > 0 ? -vencidosPercentage : 0,
        icon: <AlertCircle className="w-6 h-6 lg:w-7 lg:h-7" />,
        gradient: 'from-red-500 to-pink-500',
        subtitle: 'Requieren atención',
        trend: vencidosPercentage > 20 ? 'up' as const : vencidosPercentage > 10 ? 'neutral' as const : 'down' as const,
        onClick: () => onNavigate('socios'),
        loading: sociosLoading,
        badge: vencidosPercentage > 15 ? 'Crítico' : undefined
      }
    ];
  }, [socioStats, growthMetrics, sociosLoading, onNavigate]);

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
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-slate-600 to-slate-800 rounded-3xl flex items-center justify-center shadow-2xl">
                <BarChart3 className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                  Vista General
                </h1>
                <p className="text-lg lg:text-xl text-slate-600 mt-1">
                  Panel de control • {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: es })}
                </p>
                {(socioLastUpdated || comercioLastUpdated) && (
                  <p className="text-sm text-slate-500 mt-1">
                    Última actualización: {format(
                      socioLastUpdated || comercioLastUpdated || new Date(), 
                      'HH:mm:ss'
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={debouncedRefresh}
              disabled={refreshing}
              className="w-12 h-12 bg-white/80 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-2xl flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddMember}
              className="bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-xl hover:shadow-2xl"
            >
              <UserPlus className="w-5 h-5" />
              <span>Nuevo Socio</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <OptimizedQuickStats
        totalSocios={socioStats.total}
        activosSocios={socioStats.activos}
        totalComercios={comercioStats.comerciosActivos}
        loading={sociosLoading || comerciosLoading}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        <AnimatePresence mode="wait">
          {kpiMetrics.map((metric, index) => (
            <OptimizedKPICard key={metric.title} {...metric} delay={index * 0.1} />
          ))}
        </AnimatePresence>
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="xl:col-span-2">
          <Suspense fallback={
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8">
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
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
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8">
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
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
