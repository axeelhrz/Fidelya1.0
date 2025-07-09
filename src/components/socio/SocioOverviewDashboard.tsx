'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Gift,
  ScanLine as QrCodeScanner,
  Bell,
  Star,
  Heart,
  RefreshCw,
  Activity,
  Target,
  Clock,
  Sparkles,
  Crown,
  Users,
  ShoppingBag,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Info,
  Minus,
  Award,
  ArrowUpRight,
  Flame,
  ChevronRight
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useNotifications } from '@/hooks/useNotifications';
import { useSocioProfile } from '@/hooks/useSocioProfile';
import { format, subDays, isToday, isYesterday, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface SocioOverviewDashboardProps {
  onNavigate?: (section: string) => void;
  onScanQR?: () => void;
}

interface ActivityLog {
  id: string;
  type: 'benefit_used' | 'benefit_available' | 'membership_renewed' | 'profile_updated' | 'notification_received';
  title: string;
  description: string;
  timestamp: Timestamp;
  metadata?: Record<string, unknown>;
  userId?: string;
  userName?: string;
}

interface SocioMetrics {
  beneficiosDisponibles: number;
  beneficiosUsados: number;
  ahorroTotal: number;
  ahorroMensual: number;
  beneficiosEsteMes: number;
  crecimientoMensual: number;
  recentActivities: ActivityLog[];
  membershipHealth: 'excellent' | 'good' | 'warning' | 'critical';
  lastActivity: Date | null;
  avgBeneficiosMensuales: number;
  categoriaFavorita: string;
  streakDias: number;
  proximoVencimiento: Date | null;
  estado: string;
  nivelSocio: string;
  progresoMensual: number;
  tiempoComoSocio: number;
  diasHastaVencimiento: number;
}

// Enhanced KPI Card Component
const KPICard: React.FC<{
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
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
      benefit_used: <Gift className="w-4 h-4" />,
      benefit_available: <Sparkles className="w-4 h-4" />,
      membership_renewed: <Crown className="w-4 h-4" />,
      profile_updated: <Users className="w-4 h-4" />,
      notification_received: <Bell className="w-4 h-4" />,
    };
    return icons[type] || <Info className="w-4 h-4" />;
  };

  const getActivityGradient = (type: ActivityLog['type']) => {
    const gradients = {
      benefit_used: 'from-emerald-500 to-teal-600',
      benefit_available: 'from-amber-500 to-orange-600',
      membership_renewed: 'from-purple-500 to-indigo-600',
      profile_updated: 'from-sky-500 to-blue-600',
      notification_received: 'from-pink-500 to-rose-600',
    };
    return gradients[type] || 'from-gray-500 to-gray-600';
  };

  const formatActivityTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    if (isToday(date)) {
      return `Hoy ${format(date, 'HH:mm')}`;
    } else if (isYesterday(date)) {
      return `Ayer ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd/MM HH:mm', { locale: es });
    }
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
              <p className="text-gray-600">Tus últimas acciones y logros</p>
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
                <p className="text-gray-400 text-sm mt-1">¡Comienza a usar beneficios para ver tu actividad!</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Membership Status Card
const MembershipStatusCard: React.FC<{
  health: SocioMetrics['membershipHealth'];
  lastActivity: Date | null;
  streakDias: number;
  proximoVencimiento: Date | null;
  estado: string;
  nivelSocio: string;
  progresoMensual: number;
  tiempoComoSocio: number;
  diasHastaVencimiento: number;
  loading: boolean;
}> = ({ health, lastActivity, streakDias, proximoVencimiento, estado, nivelSocio, progresoMensual, tiempoComoSocio, diasHastaVencimiento, loading }) => {
  
  const getHealthConfig = () => {
    const configs = {
      excellent: {
        color: 'text-emerald-600',
        gradient: 'from-emerald-500 to-teal-600',
        icon: <CheckCircle className="w-6 h-6" />,
        label: 'Excelente',
        description: 'Socio muy activo y comprometido'
      },
      good: {
        color: 'text-sky-600',
        gradient: 'from-sky-500 to-blue-600',
        icon: <Target className="w-6 h-6" />,
        label: 'Bueno',
        description: 'Socio activo con buen rendimiento'
      },
      warning: {
        color: 'text-amber-600',
        gradient: 'from-amber-500 to-orange-600',
        icon: <Clock className="w-6 h-6" />,
        label: 'Regular',
        description: 'Puede mejorar su actividad'
      },
      critical: {
        color: 'text-red-600',
        gradient: 'from-red-500 to-rose-600',
        icon: <AlertCircle className="w-6 h-6" />,
        label: 'Inactivo',
        description: 'Requiere atención inmediata'
      }
    };
    return configs[health];
  };

  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case 'activo':
        return {
          color: 'text-emerald-600',
          gradient: 'from-emerald-500 to-teal-600',
          label: 'Activo',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case 'vencido':
        return {
          color: 'text-red-600',
          gradient: 'from-red-500 to-rose-600',
          label: 'Vencido',
          icon: <AlertCircle className="w-4 h-4" />
        };
      case 'inactivo':
        return {
          color: 'text-gray-600',
          gradient: 'from-gray-500 to-gray-600',
          label: 'Inactivo',
          icon: <Clock className="w-4 h-4" />
        };
      case 'pendiente':
        return {
          color: 'text-amber-600',
          gradient: 'from-amber-500 to-orange-600',
          label: 'Pendiente',
          icon: <Clock className="w-4 h-4" />
        };
      default:
        return {
          color: 'text-gray-600',
          gradient: 'from-gray-500 to-gray-600',
          label: 'Desconocido',
          icon: <Info className="w-4 h-4" />
        };
    }
  };

  const getNivelConfig = (nivel: string) => {
    const configs = {
      'Bronze': { color: 'text-amber-700', gradient: 'from-amber-600 to-orange-700', stars: 1 },
      'Silver': { color: 'text-gray-500', gradient: 'from-gray-400 to-gray-600', stars: 2 },
      'Gold': { color: 'text-yellow-500', gradient: 'from-yellow-400 to-amber-600', stars: 3 },
      'Platinum': { color: 'text-purple-600', gradient: 'from-purple-500 to-indigo-600', stars: 4 },
      'Diamond': { color: 'text-blue-600', gradient: 'from-blue-500 to-indigo-600', stars: 5 },
      'Premium': { color: 'text-violet-600', gradient: 'from-violet-500 to-purple-600', stars: 5 }
    };
    return configs[nivel as keyof typeof configs] || { color: 'text-gray-500', gradient: 'from-gray-500 to-gray-600', stars: 1 };
  };

  const getVencimientoUrgencia = (dias: number) => {
    if (dias < 0) return { color: 'text-red-600', label: 'Vencido', urgente: true };
    if (dias <= 7) return { color: 'text-red-600', label: 'Muy urgente', urgente: true };
    if (dias <= 30) return { color: 'text-amber-600', label: 'Próximo', urgente: false };
    return { color: 'text-emerald-600', label: 'Vigente', urgente: false };
  };

  const config = getHealthConfig();
  const estadoConfig = getEstadoConfig(estado);
  const nivelConfig = getNivelConfig(nivelSocio);
  const vencimientoConfig = getVencimientoUrgencia(diasHastaVencimiento);

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
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${config.gradient}`}>
              {loading ? <RefreshCw className="w-8 h-8 animate-spin" /> : config.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Estado de Socio</h3>
              <p className="text-gray-600">{config.description}</p>
            </div>
          </div>
          
          <div className={`bg-gradient-to-r ${config.gradient} text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg`}>
            {config.label}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div 
            className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-4 border border-sky-100/50"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-sky-700 mb-1 text-center font-medium">Última actividad</p>
            <p className="font-bold text-sky-900 text-sm text-center">
              {loading ? '...' : lastActivity ? format(lastActivity, 'dd/MM', { locale: es }) : 'Sin actividad'}
            </p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100/50"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-amber-700 mb-1 text-center font-medium">Racha de días</p>
            <p className="font-bold text-amber-900 text-sm text-center">
              {loading ? '...' : `${streakDias} días`}
            </p>
          </motion.div>
        </div>

        {/* Membership Info */}
        <div className="space-y-6">
          {/* Estado de membresía */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Estado de membresía</span>
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r ${estadoConfig.gradient} text-white shadow-lg`}>
              {estadoConfig.icon}
              <span className="text-sm font-bold capitalize">
                {loading ? '...' : estadoConfig.label}
              </span>
            </div>
          </div>
          
          {/* Tiempo como socio */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Tiempo como socio</span>
            <div className="text-right">
              <span className="text-gray-900 font-bold">
                {loading ? '...' : `${tiempoComoSocio} días`}
              </span>
              <p className="text-xs text-gray-500">
                {loading ? '' : `${Math.floor(tiempoComoSocio / 30)} meses`}
              </p>
            </div>
          </div>

          {/* Próximo vencimiento */}
          {proximoVencimiento && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Próximo vencimiento</span>
              <div className="text-right">
                <div className="text-gray-900 font-bold">
                  {loading ? '...' : format(proximoVencimiento, 'dd/MM/yyyy', { locale: es })}
                </div>
                <div className={`text-xs font-medium ${vencimientoConfig.color}`}>
                  {loading ? '' : 
                    diasHastaVencimiento < 0 ? 
                      `Vencido hace ${Math.abs(diasHastaVencimiento)} días` :
                      `${diasHastaVencimiento} días restantes`
                  }
                </div>
              </div>
            </div>
          )}

          {/* Nivel de socio */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Nivel de socio</span>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {Array.from({ length: nivelConfig.stars }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${nivelConfig.color} fill-current`} />
                ))}
              </div>
              <span className={`font-bold ${nivelConfig.color}`}>
                {loading ? '...' : nivelSocio}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600 font-medium">Progreso mensual</span>
            <span className="text-gray-900 font-bold">
              {loading ? '...' : `${progresoMensual}%`}
            </span>
          </div>
          <div className="w-full bg-gray-200/50 rounded-full h-3">
            <motion.div 
              className={`h-3 rounded-full bg-gradient-to-r ${config.gradient} shadow-lg`}
              initial={{ width: 0 }}
              animate={{ width: loading ? '0%' : `${progresoMensual}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>Meta: 100%</span>
          </div>
        </div>

        {/* Alertas de vencimiento */}
        {vencimientoConfig.urgente && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-6 p-4 rounded-2xl border ${
              diasHastaVencimiento < 0 ? 
                'bg-gradient-to-br from-red-50 to-rose-50 border-red-200' : 
                'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                diasHastaVencimiento < 0 ? 'bg-red-500' : 'bg-amber-500'
              }`}>
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className={`font-bold ${vencimientoConfig.color}`}>
                  {diasHastaVencimiento < 0 ? 
                    'Membresía vencida' : 
                    'Membresía por vencer'
                  }
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {diasHastaVencimiento < 0 ? 
                    'Contacta a tu asociación para renovar tu membresía y seguir disfrutando de los beneficios.' :
                    'Renueva tu membresía pronto para no perder el acceso a los beneficios exclusivos.'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Quick Stats Component
const QuickStats: React.FC<{
  beneficiosDisponibles: number;
  ahorroMensual: number;
  categoriaFavorita: string;
  loading: boolean;
}> = ({ beneficiosDisponibles, ahorroMensual, categoriaFavorita, loading }) => {
  const stats = [
    {
      label: 'Beneficios disponibles',
      value: beneficiosDisponibles,
      icon: <Gift className="w-5 h-5" />,
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      label: 'Ahorro este mes',
      value: `$${ahorroMensual.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5" />,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      label: 'Categoría favorita',
      value: categoriaFavorita,
      icon: <Heart className="w-5 h-5" />,
      gradient: 'from-pink-500 to-rose-600'
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
                  {loading ? '...' : stat.value}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const SocioOverviewDashboard: React.FC<SocioOverviewDashboardProps> = ({
  onNavigate,
  onScanQR
}) => {
  const { user } = useAuth();
  const { beneficios, beneficiosUsados, loading: beneficiosLoading } = useBeneficios();
  const { stats: notificationStats } = useNotifications();
  const { socio, stats, asociaciones, activity, loading: socioLoading } = useSocioProfile();
  
  const [socioMetrics, setSocioMetrics] = useState<SocioMetrics>({
    beneficiosDisponibles: 0,
    beneficiosUsados: 0,
    ahorroTotal: 0,
    ahorroMensual: 0,
    beneficiosEsteMes: 0,
    crecimientoMensual: 0,
    recentActivities: [],
    membershipHealth: 'good',
    lastActivity: null,
    avgBeneficiosMensuales: 0,
    categoriaFavorita: 'General',
    streakDias: 0,
    proximoVencimiento: null,
    estado: 'activo',
    nivelSocio: 'Premium',
    progresoMensual: 75,
    tiempoComoSocio: 0,
    diasHastaVencimiento: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate metrics from real data
  const calculateMetrics = useCallback(() => {
    if (!user || beneficiosLoading || socioLoading) {
      return null;
    }

    try {
      const now = new Date();
      const monthAgo = subDays(now, 30);

      // Use real stats if available
      interface StatsType {
        ahorroTotal?: number;
        ahorroEsteMes?: number;
        beneficiosUsados?: number;
        beneficiosEsteMes?: number;
        racha?: number;
        beneficiosPorCategoria?: Record<string, number>;
      }
      const realStats: StatsType = stats && typeof stats === 'object' && 'ahorroTotal' in stats
        ? {
            ahorroTotal: (stats as StatsType).ahorroTotal,
            ahorroEsteMes: (stats as StatsType).ahorroEsteMes,
            beneficiosUsados: (stats as StatsType).beneficiosUsados,
            beneficiosEsteMes: (stats as StatsType).beneficiosEsteMes,
            racha: (stats as StatsType).racha,
            beneficiosPorCategoria: (stats as StatsType).beneficiosPorCategoria,
          }
        : {};
      
      // Filter beneficios used this month
      const beneficiosEsteMes = beneficiosUsados.filter(b => 
        b.fechaUso.toDate() >= monthAgo
      ).length;

      const beneficiosMesAnterior = beneficiosUsados.filter(b => {
        const date = b.fechaUso.toDate();
        return date >= subDays(monthAgo, 30) && date < monthAgo;
      }).length;

      // Calculate growth rate
      const crecimientoMensual = beneficiosMesAnterior > 0 
        ? ((beneficiosEsteMes - beneficiosMesAnterior) / beneficiosMesAnterior) * 100
        : beneficiosEsteMes > 0 ? 100 : 0;

      // Use real data from stats or calculate from beneficios
      const ahorroTotal = realStats.ahorroTotal ?? beneficiosUsados.reduce((total, b) => total + (b.montoDescuento || 0), 0);
      const ahorroMensual = realStats.ahorroEsteMes ?? beneficiosUsados
        .filter(b => b.fechaUso.toDate() >= monthAgo)
        .reduce((total, b) => total + (b.montoDescuento || 0), 0);

      // Calculate average monthly benefits
      const avgBeneficiosMensuales = realStats.beneficiosUsados ? realStats.beneficiosUsados / 3 : beneficiosUsados.length / 3;

      // Determine membership health based on real activity
      let membershipHealth: SocioMetrics['membershipHealth'] = 'good';
      if (avgBeneficiosMensuales > 5) membershipHealth = 'excellent';
      else if (avgBeneficiosMensuales > 2) membershipHealth = 'good';
      else if (avgBeneficiosMensuales > 0) membershipHealth = 'warning';
      else membershipHealth = 'critical';

      // Get last activity from real data
      const lastActivity = beneficiosUsados.length > 0 
        ? beneficiosUsados.sort((a, b) => b.fechaUso.toDate().getTime() - a.fechaUso.toDate().getTime())[0].fechaUso.toDate()
        : null;

      // Use real streak from stats or calculate
      const streakDias = realStats.racha || 0;

      // Get favorite category from real stats with proper error handling
      let categoriaFavorita = 'General';
      if (realStats.beneficiosPorCategoria && typeof realStats.beneficiosPorCategoria === 'object') {
        const categorias = Object.keys(realStats.beneficiosPorCategoria);
        if (categorias.length > 0) {
          categoriaFavorita = categorias.reduce((a, b) => 
            (realStats.beneficiosPorCategoria![a] || 0) > (realStats.beneficiosPorCategoria![b] || 0) ? a : b
          );
        }
      }

      // Get próximo vencimiento from asociaciones
      const proximoVencimiento = asociaciones.length > 0 && asociaciones[0]?.fechaVencimiento
        ? asociaciones[0].fechaVencimiento
        : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

      // Calculate days until expiration
      const diasHastaVencimiento = proximoVencimiento ? differenceInDays(proximoVencimiento, now) : 0;

      // Calculate time as socio
      const tiempoComoSocio = socio?.creadoEn
        ? differenceInDays(
            now,
            socio.creadoEn && typeof socio.creadoEn === 'object' && 'toDate' in socio.creadoEn && typeof ((socio.creadoEn as unknown as Timestamp).toDate) === 'function'
              ? (socio.creadoEn as unknown as Timestamp).toDate()
              : (socio.creadoEn as Date)
          )
        : 0;

      // Convert real activity to ActivityLog format
      const recentActivities: ActivityLog[] = Array.isArray(activity)
        ? activity.slice(0, 5).map((act) => ({
            id: act.id,
            type: act.tipo === 'beneficio' ? 'benefit_used' as const : 
                  act.tipo === 'actualizacion' ? 'profile_updated' as const :
                  act.tipo === 'configuracion' ? 'profile_updated' as const :
                  'benefit_used' as const,
            title: act.titulo,
            description: act.descripcion,
            timestamp: act.fecha,
            metadata: act.metadata,
          }))
        : [];

      // Calculate monthly progress based on activity and goals
      const metaMensual = 10; // Meta de 10 beneficios por mes
      const progresoMensual = Math.min(Math.round((beneficiosEsteMes / metaMensual) * 100), 100);

      return {
        beneficiosDisponibles: beneficios.length,
        beneficiosUsados: realStats.beneficiosUsados || beneficiosUsados.length,
        ahorroTotal,
        ahorroMensual,
        beneficiosEsteMes: realStats.beneficiosEsteMes || beneficiosEsteMes,
        crecimientoMensual: Math.round(crecimientoMensual * 100) / 100,
        recentActivities,
        membershipHealth,
        lastActivity,
        avgBeneficiosMensuales: Math.round(avgBeneficiosMensuales * 100) / 100,
        categoriaFavorita,
        streakDias,
        proximoVencimiento,
        estado: socio?.estado || 'activo',
        nivelSocio: (socio && typeof ((socio as unknown as { nivelSocio?: string }).nivelSocio) === 'string'
          ? (socio as unknown as { nivelSocio: string }).nivelSocio
          : 'Premium'),
        progresoMensual,
        tiempoComoSocio,
        diasHastaVencimiento,
      };
    } catch (err) {
      console.error('Error calculating socio metrics:', err);
      throw new Error('Error al cargar las métricas del socio');
    }
  }, [user, beneficios, beneficiosUsados, beneficiosLoading, socioLoading, stats, socio, asociaciones, activity]);

  // Calculate metrics with proper dependencies
  useEffect(() => {
    const metrics = calculateMetrics();
    
    if (metrics) {
      setSocioMetrics(metrics);
      setLoading(false);
      setError(null);
    } else if (!beneficiosLoading && !socioLoading) {
      setLoading(false);
    }
  }, [calculateMetrics, beneficiosLoading, socioLoading]);

  const kpiMetrics = useMemo(() => [
    {
      title: 'Beneficios Disponibles',
      value: socioMetrics.beneficiosDisponibles.toLocaleString(),
      change: socioMetrics.beneficiosDisponibles > 5 ? 25 : 0,
      icon: <Gift className="w-8 h-8" />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      delay: 0,
      subtitle: 'Listos para usar',
      trend: socioMetrics.beneficiosDisponibles > 5 ? 'up' as const : 'neutral' as const,
      onClick: () => onNavigate?.('beneficios'),
      loading: loading
    },
    {
      title: 'Total Ahorrado',
      value: `$${socioMetrics.ahorroTotal.toLocaleString()}`,
      change: socioMetrics.crecimientoMensual,
      icon: <DollarSign className="w-8 h-8" />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      delay: 0.1,
      subtitle: 'En todos los beneficios',
      trend: socioMetrics.crecimientoMensual > 0 ? 'up' as const : socioMetrics.crecimientoMensual < 0 ? 'down' as const : 'neutral' as const,
      onClick: () => onNavigate?.('beneficios'),
      loading: loading
    },
    {
      title: 'Este Mes',
      value: socioMetrics.beneficiosEsteMes.toString(),
      change: socioMetrics.crecimientoMensual,
      icon: <ShoppingBag className="w-8 h-8" />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      delay: 0.2,
      subtitle: 'Beneficios usados',
      trend: socioMetrics.crecimientoMensual > 0 ? 'up' as const : socioMetrics.crecimientoMensual < 0 ? 'down' as const : 'neutral' as const,
      onClick: () => onNavigate?.('beneficios'),
      loading: loading
    },
    {
      title: 'Notificaciones',
      value: notificationStats.unread.toString(),
      change: notificationStats.unread > 0 ? 100 : 0,
      icon: <Bell className="w-8 h-8" />,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      delay: 0.3,
      subtitle: 'Sin leer',
      trend: notificationStats.unread > 3 ? 'up' as const : 'neutral' as const,
      onClick: () => onNavigate?.('notificaciones'),
      loading: false,
      badge: notificationStats.unread > 0 ? notificationStats.unread.toString() : undefined
    }
  ], [socioMetrics, notificationStats, loading, onNavigate]);

  if (error) {
    return (
      <div className="relative min-h-screen">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-white to-celestial-50/30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-100/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-8 flex items-center justify-center min-h-screen">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 max-w-md w-full">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-lg">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-red-900 font-bold text-xl">Error al cargar el dashboard</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
            <motion.button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reintentar</span>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

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
                    <span className="text-3xl">👋</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 via-celestial-600 to-sky-700 bg-clip-text text-transparent">
                      ¡Hola, {user?.nombre || 'Socio'}!
                    </h1>
                    <p className="text-xl text-gray-600 mt-1">
                      Bienvenido a tu panel de beneficios
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    socioMetrics.estado === 'activo' ? 'bg-emerald-500' :
                    socioMetrics.estado === 'vencido' ? 'bg-red-500' :
                    socioMetrics.estado === 'pendiente' ? 'bg-amber-500' :
                    'bg-gray-500'
                  }`} />
                  <span className={`text-sm font-medium capitalize ${
                    socioMetrics.estado === 'activo' ? 'text-emerald-600' :
                    socioMetrics.estado === 'vencido' ? 'text-red-600' :
                    socioMetrics.estado === 'pendiente' ? 'text-amber-600' :
                    'text-gray-600'
                  }`}>
                    Socio {socioMetrics.estado}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600 font-medium">
                    {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: es })}
                  </span>
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
                  onClick={onScanQR}
                  className="bg-gradient-to-r from-sky-500 to-celestial-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-sky-600 hover:to-celestial-700 transition-all duration-200 flex items-center space-x-3 shadow-xl hover:shadow-2xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <QrCodeScanner className="w-6 h-6" />
                  <span>Escanear QR</span>
                  <Sparkles className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <QuickStats
          beneficiosDisponibles={socioMetrics.beneficiosDisponibles}
          ahorroMensual={socioMetrics.ahorroMensual}
          categoriaFavorita={socioMetrics.categoriaFavorita}
          loading={loading}
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
              activities={socioMetrics.recentActivities}
              loading={loading}
              onViewAll={() => onNavigate?.('beneficios')}
            />
          </div>
          <div>
            <MembershipStatusCard
              health={socioMetrics.membershipHealth}
              lastActivity={socioMetrics.lastActivity}
              streakDias={socioMetrics.streakDias}
              proximoVencimiento={socioMetrics.proximoVencimiento}
              estado={socioMetrics.estado}
              nivelSocio={socioMetrics.nivelSocio}
              progresoMensual={socioMetrics.progresoMensual}
              tiempoComoSocio={socioMetrics.tiempoComoSocio}
              diasHastaVencimiento={socioMetrics.diasHastaVencimiento}
              loading={loading}
            />
          </div>
        </div>

        {/* Achievement Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <motion.div 
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Award className="w-10 h-10" />
                </motion.div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">
                    ¡Excelente progreso!
                  </h3>
                  <p className="text-amber-100 text-lg mb-2">
                    Has ahorrado {`$${socioMetrics.ahorroTotal.toLocaleString()}`} hasta ahora
                  </p>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-200" />
                    <span className="text-amber-200 font-medium">
                      ¡Sigue así para alcanzar nuevos niveles!
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <motion.div 
                    className="text-5xl font-bold mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring", stiffness: 200 }}
                  >
                    {socioMetrics.beneficiosUsados}
                  </motion.div>
                  <div className="text-amber-100 font-medium">Beneficios Usados</div>
                  <div className="w-20 bg-white/20 rounded-full h-2 mt-2">
                    <motion.div 
                      className="bg-white rounded-full h-2"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((socioMetrics.beneficiosUsados / 50) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 1.2 }}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <motion.div 
                    className="text-5xl font-bold mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                  >
                    {socioMetrics.streakDias}
                  </motion.div>
                  <div className="text-orange-100 font-medium">Días de Racha</div>
                  <div className="w-20 bg-white/20 rounded-full h-2 mt-2">
                    <motion.div 
                      className="bg-white rounded-full h-2"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((socioMetrics.streakDias / 30) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 1.3 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
