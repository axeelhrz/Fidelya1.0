'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Store,
  Bell,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  UserPlus,
  BarChart3,
  Settings,
  FileText,
  Upload,
  Activity,
  Clock,
  Sparkles,
  DollarSign,
  Zap,
  ArrowUpRight,
  ChevronRight,
  Shield,
  Minus
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
import { useSocios } from '@/hooks/useSocios';
import { useNotifications } from '@/hooks/useNotifications';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

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

// Enhanced KPI Card Component
const KPICard: React.FC<{
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
  loading?: boolean;
  badge?: string;
}> = ({
  title,
  value,
  change,
  icon,
  gradient,
  delay,
  subtitle,
  trend = 'neutral',
  onClick,
  loading = false,
  badge
}) => {
  const shineVariants = {
    initial: { x: '-100%' },
    animate: { x: '100%' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Background and Glass Effect */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-50/30 rounded-3xl"></div>
      
      {/* Shine Effect */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={shineVariants}
          initial="initial"
          whileHover="animate"
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>

      {/* Badge */}
      {badge && (
        <motion.div
          className="absolute top-4 right-4 z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
            {badge}
          </div>
        </motion.div>
      )}

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div 
            className="w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
            style={{ background: gradient }}
          >
            {loading ? (
              <RefreshCw className="w-8 h-8 animate-spin" />
            ) : (
              icon
            )}
          </div>
          
          {/* Trend Indicator */}
          <div className="flex items-center space-x-2">
            {trend === 'up' && <TrendingUp className="w-5 h-5 text-emerald-500" />}
            {trend === 'down' && <TrendingDown className="w-5 h-5 text-red-500" />}
            {trend === 'neutral' && <Minus className="w-5 h-5 text-gray-400" />}
            <span className={`text-sm font-bold ${
              trend === 'up' ? 'text-emerald-500' : 
              trend === 'down' ? 'text-red-500' : 
              'text-gray-400'
            }`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-4xl font-bold text-gray-900">
            {loading ? '...' : value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-600 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200/50 rounded-full h-2">
            <motion.div 
              className="h-2 rounded-full"
              style={{ background: gradient }}
              initial={{ width: 0 }}
              animate={{ width: loading ? '0%' : `${Math.min(Math.abs(change) * 2, 100)}%` }}
              transition={{ duration: 1, delay: delay + 0.5 }}
            />
          </div>
        </div>

        {/* Action Arrow */}
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </motion.div>
  );
};

// Activity Timeline Component
const ActivityTimeline: React.FC<{
  activities: ActivityLog[];
  loading: boolean;
  onViewAll?: () => void;
}> = ({ activities, loading, onViewAll }) => {
  const getActivityIcon = (type: ActivityLog['type']) => {
    const icons = {
      member_added: <UserPlus className="w-4 h-4" />,
      member_updated: <Users className="w-4 h-4" />,
      payment_received: <DollarSign className="w-4 h-4" />,
      backup_completed: <Shield className="w-4 h-4" />,
      import_completed: <Upload className="w-4 h-4" />,
      system_alert: <AlertCircle className="w-4 h-4" />,
    };
    return icons[type] || <Activity className="w-4 h-4" />;
  };

  const getActivityGradient = (type: ActivityLog['type']) => {
    const gradients = {
      member_added: 'from-emerald-500 to-teal-600',
      member_updated: 'from-blue-500 to-indigo-600',
      payment_received: 'from-green-500 to-emerald-600',
      backup_completed: 'from-purple-500 to-indigo-600',
      import_completed: 'from-sky-500 to-blue-600',
      system_alert: 'from-red-500 to-pink-600',
    };
    return gradients[type] || 'from-gray-500 to-gray-600';
  };

  const formatActivityTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return format(date, 'dd/MM HH:mm', { locale: es });
  };

  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-50/30 rounded-3xl"></div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-celestial-600 rounded-3xl flex items-center justify-center shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Actividad Reciente</h3>
              <p className="text-gray-600">Últimas acciones del sistema</p>
            </div>
          </div>
          {onViewAll && (
            <motion.button
              onClick={onViewAll}
              className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-2xl font-medium text-sm flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Ver todo</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {activities.slice(0, 5).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  
                  <div className="relative z-10 flex items-start space-x-4 p-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${getActivityGradient(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 mb-1">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-500 font-medium">
                          {formatActivityTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ArrowUpRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {activities.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">No hay actividad reciente</p>
                <p className="text-gray-400 text-sm mt-1">Las acciones del sistema aparecerán aquí</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// System Status Card
const SystemStatusCard: React.FC<{
  health: SystemHealth;
  loading: boolean;
}> = ({ health, loading }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Operativo';
      case 'warning': return 'Advertencia';
      case 'critical': return 'Crítico';
      default: return 'Desconocido';
    }
  };

  const storagePercentage = (health.storageUsed / health.storageLimit) * 100;

  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-50/30 rounded-3xl"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${getStatusColor(health.status)}, ${getStatusColor(health.status)}dd)` }}
            >
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Estado del Sistema</h3>
              <p className="text-gray-600">Monitoreo en tiempo real</p>
            </div>
          </div>
          
          <div 
            className="px-4 py-2 rounded-2xl text-white text-sm font-bold shadow-lg"
            style={{ background: `linear-gradient(135deg, ${getStatusColor(health.status)}, ${getStatusColor(health.status)}dd)` }}
          >
            {getStatusText(health.status)}
          </div>
        </div>

        <div className="space-y-6">
          {/* Uptime */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-700 font-semibold">Tiempo de actividad</span>
              <span className="text-gray-900 font-bold">
                {loading ? '...' : `${health.uptime}%`}
              </span>
            </div>
            <div className="w-full bg-gray-200/50 rounded-full h-3">
              <motion.div 
                className="h-3 rounded-full shadow-lg"
                style={{ 
                  background: health.uptime > 99 ? 'linear-gradient(90deg, #10b981, #059669)' : 
                             health.uptime > 95 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 
                             'linear-gradient(90deg, #ef4444, #dc2626)'
                }}
                initial={{ width: 0 }}
                animate={{ width: loading ? '0%' : `${health.uptime}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Storage */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-700 font-semibold">Almacenamiento</span>
              <span className="text-gray-900 font-bold">
                {loading ? '...' : `${storagePercentage.toFixed(1)}%`}
              </span>
            </div>
            <div className="w-full bg-gray-200/50 rounded-full h-3">
              <motion.div 
                className="h-3 rounded-full shadow-lg"
                style={{ 
                  background: storagePercentage > 80 ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 
                             storagePercentage > 60 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 
                             'linear-gradient(90deg, #10b981, #059669)'
                }}
                initial={{ width: 0 }}
                animate={{ width: loading ? '0%' : `${storagePercentage}%` }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </div>
            <p className="text-gray-600 text-sm mt-2 font-medium">
              {loading ? '...' : `${(health.storageUsed / 1024).toFixed(1)} GB de ${(health.storageLimit / 1024).toFixed(1)} GB utilizados`}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-100/50"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <p className="text-sky-700 text-xs font-bold mb-1">Último Respaldo</p>
              <p className="text-sky-900 font-black text-sm">
                {loading ? '...' : health.lastBackup ? format(health.lastBackup, 'dd/MM HH:mm') : 'Nunca'}
              </p>
            </motion.div>

            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100/50"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <p className="text-emerald-700 text-xs font-bold mb-1">Respuesta</p>
              <p className="text-emerald-900 font-black text-sm">
                {loading ? '...' : `${health.responseTime}ms`}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Quick Stats Component
const QuickStats: React.FC<{
  totalSocios: number;
  activosSocios: number;
  totalComercios: number;
  notificacionesPendientes: number;
  loading: boolean;
}> = ({ totalSocios, activosSocios, totalComercios, loading }) => {
  const stats = [
    {
      label: 'Total Socios',
      value: totalSocios,
      icon: <Users className="w-5 h-5" />,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      label: 'Socios Activos',
      value: activosSocios,
      icon: <CheckCircle className="w-5 h-5" />,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      label: 'Comercios',
      value: totalComercios,
      icon: <Store className="w-5 h-5" />,
      gradient: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-50/30 rounded-2xl"></div>
          
          <div className="relative z-10 p-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${stat.gradient} group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">
                  {loading ? '...' : stat.value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Main Component
const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigate,
  onAddMember
}) => {
  const { user } = useAuth();
  const { stats, loading: sociosLoading } = useSocios();
  const { stats: notificationStats } = useNotifications();
  
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const systemHealth = useMemo<SystemHealth>(() => ({
    status: 'good',
    lastBackup: subDays(new Date(), 1),
    storageUsed: 1024,
    storageLimit: 5120,
    uptime: 99.9,
    responseTime: 120,
  }), []);
  const [loading, setLoading] = useState(true);

  // Fetch real-time activities from Firebase
  useEffect(() => {
    if (!user) return;

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
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Calculate growth metrics
  const growthMetrics = useMemo(() => {
    const memberGrowth = activities.filter(a => a.type === 'member_added').length;
    const growthRate = stats.total > 0 ? (memberGrowth / stats.total) * 100 : 0;
    const retentionRate = stats.total > 0 ? (stats.activos / stats.total) * 100 : 0;

    return {
      growthRate: Math.round(growthRate * 100) / 100,
      retentionRate: Math.round(retentionRate * 100) / 100,
    };
  }, [activities, stats]);

  // System health calculation
  const healthStatus = useMemo(() => {
    const storagePercentage = (systemHealth.storageUsed / systemHealth.storageLimit) * 100;
    const backupAge = systemHealth.lastBackup 
      ? (Date.now() - systemHealth.lastBackup.getTime()) / (1000 * 60 * 60 * 24)
      : 999;

    if (storagePercentage > 90 || backupAge > 7 || systemHealth.uptime < 95) {
      return 'critical';
    } else if (storagePercentage > 75 || backupAge > 3 || systemHealth.uptime < 98) {
      return 'warning';
    } else if (systemHealth.uptime > 99.5 && backupAge < 1) {
      return 'excellent';
    }
    return 'good';
  }, [systemHealth]);

  const kpiMetrics = useMemo(() => [
    {
      title: 'Total Socios',
      value: stats.total.toLocaleString(),
      change: growthMetrics.growthRate,
      icon: <Users className="w-8 h-8" />,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      delay: 0,
      subtitle: 'Miembros registrados',
      trend: growthMetrics.growthRate > 0 ? 'up' as const : 'neutral' as const,
      onClick: () => onNavigate('socios'),
      loading: sociosLoading
    },
    {
      title: 'Socios Activos',
      value: stats.activos.toLocaleString(),
      change: growthMetrics.retentionRate,
      icon: <CheckCircle className="w-8 h-8" />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      delay: 0.1,
      subtitle: 'Estado vigente',
      trend: growthMetrics.retentionRate > 80 ? 'up' as const : growthMetrics.retentionRate > 60 ? 'neutral' as const : 'down' as const,
      onClick: () => onNavigate('socios'),
      loading: sociosLoading
    },
    {
      title: 'Socios Vencidos',
      value: stats.vencidos.toString(),
      change: stats.vencidos > 0 ? -((stats.vencidos / Math.max(stats.total, 1)) * 100) : 0,
      icon: <AlertCircle className="w-8 h-8" />,
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      delay: 0.2,
      subtitle: 'Requieren atención',
      trend: stats.vencidos > stats.total * 0.2 ? 'up' as const : 'down' as const,
      onClick: () => onNavigate('socios'),
      loading: sociosLoading
    },
    {
      title: 'Notificaciones',
      value: notificationStats.unread.toString(),
      change: notificationStats.unread > 5 ? 25 : 0,
      icon: <Bell className="w-8 h-8" />,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      delay: 0.3,
      subtitle: 'Sin leer',
      trend: notificationStats.unread > 3 ? 'up' as const : 'neutral' as const,
      onClick: () => onNavigate('notificaciones'),
      loading: false,
      badge: notificationStats.unread > 0 ? notificationStats.unread.toString() : undefined
    }
  ], [stats, growthMetrics, notificationStats, sociosLoading, onNavigate]);

  const quickActions = [
    {
      title: 'Nuevo Socio',
      description: 'Agregar nuevo miembro',
      icon: <UserPlus className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-teal-600',
      onClick: onAddMember,
    },
    {
      title: 'Analytics',
      description: 'Ver métricas detalladas',
      icon: <BarChart3 className="w-6 h-6" />,
      gradient: 'from-purple-500 to-indigo-600',
      onClick: () => onNavigate('analytics'),
    },
    {
      title: 'Reportes',
      description: 'Generar informes',
      icon: <FileText className="w-6 h-6" />,
      gradient: 'from-blue-500 to-indigo-600',
      onClick: () => onNavigate('reportes'),
    },
    {
      title: 'Configuración',
      description: 'Ajustes del sistema',
      icon: <Settings className="w-6 h-6" />,
      gradient: 'from-gray-500 to-gray-600',
      onClick: () => onNavigate('configuracion'),
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-white to-celestial-50/30"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-100/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-celestial-100/20 to-transparent rounded-full blur-3xl"></div>

      <div className="relative z-10 p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-50/30 rounded-3xl"></div>
          
          <div className="relative z-10 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-celestial-600 rounded-3xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">📊</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 via-celestial-600 to-sky-700 bg-clip-text text-transparent">
                      Vista General
                    </h1>
                    <p className="text-xl text-gray-600 mt-1">
                      Panel de control • {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: es })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => window.location.reload()}
                  className="w-12 h-12 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  onClick={onAddMember}
                  className="bg-gradient-to-r from-sky-500 to-celestial-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-sky-600 hover:to-celestial-700 transition-all duration-200 flex items-center space-x-3 shadow-xl hover:shadow-2xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <UserPlus className="w-6 h-6" />
                  <span>Nuevo Socio</span>
                  <Sparkles className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <QuickStats
          totalSocios={stats.total}
          activosSocios={stats.activos}
          totalComercios={0} // TODO: Get from comercios hook
          notificacionesPendientes={notificationStats.unread}
          loading={sociosLoading}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiMetrics.map((metric, index) => (
            <KPICard key={index} {...metric} />
          ))}
        </div>

        {/* Secondary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ActivityTimeline
              activities={activities}
              loading={loading}
              onViewAll={() => onNavigate('notificaciones')}
            />
          </div>
          <div>
            <SystemStatusCard
              health={{ ...systemHealth, status: healthStatus }}
              loading={loading}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-50/30 rounded-3xl"></div>
          
          <div className="relative z-10 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={action.onClick}
                  className="group relative overflow-hidden"
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg"></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                  
                  <div className="relative z-10 p-6 text-center">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {action.icon}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>

                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { OverviewDashboard };