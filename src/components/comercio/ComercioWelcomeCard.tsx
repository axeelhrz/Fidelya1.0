'use client';

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  TrendingUp, 
  Users, 
  Gift, 
  QrCode, 
  UserCheck,
  LogOut,
  Sparkles,
  Activity,
  Crown,
  Zap,
  ArrowRight,
  Bell
} from 'lucide-react';

interface ComercioWelcomeCardProps {
  user: any;
  comercio?: any;
  stats?: {
    validacionesHoy?: number;
    beneficiosActivos?: number;
    clientesUnicos?: number;
    qrEscaneos?: number;
    validacionesMes?: number;
  };
  onQuickAction?: (action: string) => void;
  onViewProfile?: () => void;
  onLogout?: () => void;
}

// Quick action button component
const QuickActionButton = memo<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  gradient: string;
  onClick: () => void;
  badge?: number;
  isNew?: boolean;
  isPro?: boolean;
}>(({ icon: Icon, label, description, gradient, onClick, badge, isNew, isPro }) => (
  <motion.button
    onClick={onClick}
    className={`
      relative group p-4 lg:p-6 rounded-2xl text-white shadow-xl transition-all duration-300
      bg-gradient-to-br ${gradient} hover:shadow-2xl overflow-hidden
      border border-white/10 backdrop-blur-sm
    `}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
  >
    {/* Animated background pattern */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-0 right-0 w-16 h-16 bg-white rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-white rounded-full translate-y-6 -translate-x-6 group-hover:scale-110 transition-transform duration-500" />
    </div>

    {/* Shimmer effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

    {/* Content */}
    <div className="relative z-10">
      {/* Badges */}
      <div className="absolute -top-2 -right-2 flex gap-1">
        {isNew && (
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold border border-white/20"
          >
            <Sparkles className="w-3 h-3 inline mr-1" />
            Nuevo
          </motion.div>
        )}
        {isPro && (
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold border border-white/20"
          >
            <Crown className="w-3 h-3 inline mr-1" />
            Pro
          </motion.div>
        )}
      </div>

      {/* Icon */}
      <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-3 mx-auto transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
        <Icon className="w-6 h-6" />
      </div>

      {/* Title */}
      <h3 className="font-bold text-lg mb-1 group-hover:scale-105 transition-transform duration-300">
        {label}
      </h3>

      {/* Description */}
      <p className="text-sm opacity-90 mb-3">
        {description}
      </p>

      {/* Badge and Arrow */}
      <div className="flex items-center justify-between">
        {badge !== undefined && badge > 0 && (
          <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
        <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ml-auto" />
      </div>
    </div>
  </motion.button>
));

QuickActionButton.displayName = 'QuickActionButton';

// Stats card component
const StatsCard = memo<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  gradient: string;
  trend?: string;
}>(({ icon: Icon, label, value, gradient, trend }) => (
  <motion.div 
    className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 text-white shadow-lg border border-white/10`}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 bg-white/20 rounded-xl">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
    <p className="text-sm opacity-90 font-medium">{label}</p>
    {trend && (
      <p className="text-xs opacity-75 mt-1">{trend}</p>
    )}
  </motion.div>
));

StatsCard.displayName = 'StatsCard';

export const ComercioWelcomeCard = memo<ComercioWelcomeCardProps>(({
  user,
  comercio,
  stats = {},
  onQuickAction,
  onViewProfile,
  onLogout
}) => {
  // Get current time for greeting
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Buenos días' : currentHour < 18 ? 'Buenas tardes' : 'Buenas noches';

  // Memoized quick actions
  const quickActions = useMemo(() => [
    {
      id: 'beneficios',
      label: 'Beneficios',
      description: 'Gestionar ofertas',
      icon: Gift,
      gradient: 'from-emerald-500 to-teal-500',
      badge: stats.beneficiosActivos
    },
    {
      id: 'validaciones',
      label: 'Validaciones',
      description: 'Ver historial',
      icon: UserCheck,
      gradient: 'from-blue-500 to-indigo-500',
      badge: stats.validacionesHoy
    },
    {
      id: 'qr',
      label: 'Código QR',
      description: 'Gestión QR',
      icon: QrCode,
      gradient: 'from-orange-500 to-red-500',
      badge: stats.qrEscaneos
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      description: 'Centro de avisos',
      icon: Bell,
      gradient: 'from-amber-500 to-orange-500',
      isNew: true
    }
  ], [stats]);

  // Memoized stats cards
  const statsCards = useMemo(() => [
    {
      icon: UserCheck,
      label: 'Validaciones Hoy',
      value: stats.validacionesHoy || 0,
      gradient: 'from-blue-500 to-indigo-500',
      trend: 'Actividad diaria'
    },
    {
      icon: Gift,
      label: 'Beneficios Activos',
      value: stats.beneficiosActivos || 0,
      gradient: 'from-emerald-500 to-teal-500',
      trend: 'Ofertas disponibles'
    },
    {
      icon: Users,
      label: 'Clientes Únicos',
      value: stats.clientesUnicos || 0,
      gradient: 'from-purple-500 to-pink-500',
      trend: 'Base de clientes'
    },
    {
      icon: TrendingUp,
      label: 'Este Mes',
      value: stats.validacionesMes || 0,
      gradient: 'from-amber-500 to-orange-500',
      trend: 'Validaciones totales'
    }
  ], [stats]);

  const handleQuickAction = (actionId: string) => {
    if (onQuickAction) {
      onQuickAction(actionId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-white via-slate-50 to-white rounded-3xl shadow-xl border border-slate-200/50 p-6 lg:p-8 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full translate-y-16 -translate-x-16" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Welcome Section */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative"
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Store className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-white shadow-lg"
              />
            </motion.div>
            
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl lg:text-4xl font-bold text-slate-900 mb-1"
              >
                {greeting}, {comercio?.nombreComercio || user?.nombre || 'Comercio'}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base lg:text-lg text-slate-600 flex items-center"
              >
                <Zap className="w-4 h-4 mr-2 text-emerald-500" />
                Panel de control optimizado para tu negocio
              </motion.p>
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center space-x-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewProfile}
              className="w-12 h-12 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Store className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAction('beneficios')}
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-xl hover:shadow-2xl"
            >
              <Gift className="w-5 h-5" />
              <span className="hidden sm:inline">Beneficios</span>
              <span className="sm:hidden">Ofertas</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="w-12 h-12 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl flex items-center justify-center text-red-600 hover:text-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Acciones Rápidas
            </h3>
            <div className="flex items-center text-sm text-slate-500">
              <Sparkles className="w-4 h-4 mr-1" />
              Optimizado
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <QuickActionButton
                  {...action}
                  onClick={() => handleQuickAction(action.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});

ComercioWelcomeCard.displayName = 'ComercioWelcomeCard';

export default ComercioWelcomeCard;