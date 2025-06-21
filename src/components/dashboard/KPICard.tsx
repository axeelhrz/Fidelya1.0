'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, MoreHorizontal, Target, Sparkles, Zap, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { KPIMetric } from '@/types/dashboard';

interface KPICardProps {
  metric: KPIMetric;
  index: number;
  onClick?: () => void;
}

export default function KPICard({ metric, index, onClick }: KPICardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-success" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-error" />;
      default:
        return <Minus className="w-5 h-5 text-secondary" />;
    }
  };

  const getStatusGradient = () => {
    switch (metric.status) {
      case 'success':
        return 'from-success/20 via-success/10 to-transparent';
      case 'warning':
        return 'from-warning/20 via-warning/10 to-transparent';
      case 'error':
        return 'from-error/20 via-error/10 to-transparent';
      default:
        return 'from-accent/20 via-accent/10 to-transparent';
    }
  };

  const getStatusColor = () => {
    switch (metric.status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-accent';
    }
  };

  const getStatusBorder = () => {
    switch (metric.status) {
      case 'success':
        return 'border-success/30';
      case 'warning':
        return 'border-warning/30';
      case 'error':
        return 'border-error/30';
      default:
        return 'border-accent/30';
    }
  };

  const getTrendPercentage = () => {
    if (metric.previousValue === 0) return 0;
    return ((metric.value - metric.previousValue) / metric.previousValue * 100).toFixed(1);
  };

  const getProgressPercentage = () => {
    if (!metric.target) return 0;
    return Math.min((metric.value / metric.target) * 100, 100);
  };

  const sparklineData = metric.sparklineData.map((value, index) => ({
    index,
    value,
    smoothValue: value + Math.sin(index * 0.5) * (value * 0.05) // Suavizado para mejor visualización
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.15,
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ 
        y: -16,
        scale: 1.03,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
      }}
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Fondo principal con glassmorphism mejorado */}
      <div className="relative bg-surface-glass backdrop-blur-2xl border border-light rounded-3xl overflow-hidden transition-all duration-500 group-hover:border-glow group-hover:shadow-glow-strong">
        
        {/* Gradiente de estado superior animado */}
        <motion.div 
          className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${getStatusGradient()}`}
          animate={{
            opacity: isHovered ? 1 : 0.7,
            height: isHovered ? 8 : 2
          }}
          transition={{ duration: 0.3 }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${getStatusGradient()} blur-sm opacity-50`} />
        </motion.div>
        
        {/* Efecto de brillo dinámico */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 0.4 : 0,
            scale: isHovered ? 1.2 : 0.8
          }}
          transition={{ duration: 0.4 }}
          className={`absolute inset-0 bg-gradient-to-br ${getStatusGradient()} blur-xl`}
        />
        
        {/* Partículas decorativas animadas */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0,
            rotate: isHovered ? 360 : 0
          }}
          transition={{ duration: 2, ease: "linear", repeat: isHovered ? Infinity : 0 }}
          className="absolute top-6 right-6 w-3 h-3 bg-accent/40 rounded-full"
        />
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? [0, -10, 0] : 0
          }}
          transition={{ duration: 3, ease: "easeInOut", repeat: isHovered ? Infinity : 0 }}
          className="absolute bottom-8 left-6 w-2 h-2 bg-accent/30 rounded-full"
        />
        
        <div className="relative p-8 z-10">
          {/* Header con animaciones mejoradas */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4 mb-4">
                <motion.h3 
                  className="text-sm font-medium text-secondary truncate font-space-grotesk tracking-wide uppercase"
                  animate={{ 
                    color: isHovered ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    scale: isHovered ? 1.05 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {metric.name}
                </motion.h3>
                {metric.status === 'success' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ 
                      scale: isHovered ? 1.2 : 0,
                      rotate: isHovered ? 0 : -180
                    }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <Sparkles className="w-5 h-5 text-success" />
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-baseline space-x-4 mb-2">
                <motion.span 
                  className="text-5xl font-bold text-display-futuristic text-primary"
                  animate={{ 
                    scale: isHovered ? 1.08 : 1,
                    color: isHovered ? 'var(--color-accent)' : 'var(--color-text-primary)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {metric.value.toLocaleString()}
                </motion.span>
                <motion.span 
                  className="text-lg font-semibold text-tertiary bg-surface-elevated px-3 py-1.5 rounded-xl"
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {metric.unit}
                </motion.span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.3, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 rounded-2xl bg-surface-elevated/50 backdrop-blur-sm hover:bg-surface-hover transition-all duration-300 opacity-0 group-hover:opacity-100 border border-light hover:border-glow"
            >
              <MoreHorizontal className="w-5 h-5 text-secondary" />
            </motion.button>
          </div>

          {/* Tendencia con efectos premium */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-5">
              <motion.div 
                className={`p-4 rounded-2xl ${getStatusColor()} bg-current/10 backdrop-blur-sm border ${getStatusBorder()}`}
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {getTrendIcon()}
              </motion.div>
              <div>
                <motion.div
                  className="flex items-center space-x-2"
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className={`text-2xl font-bold ${getStatusColor()} font-space-grotesk`}>
                    {Math.abs(parseFloat(getTrendPercentage()))}%
                  </span>
                  <ArrowUpRight className={`w-4 h-4 ${getStatusColor()}`} />
                </motion.div>
                <p className="text-sm text-tertiary font-medium">vs. período anterior</p>
              </div>
            </div>
            
            {/* Indicador de rendimiento mejorado */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isHovered ? 1 : 0,
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center space-x-3 bg-accent/10 px-4 py-3 rounded-2xl border border-accent/20 backdrop-blur-sm"
            >
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">Excelente</span>
            </motion.div>
          </div>

          {/* Sparkline mejorado con área */}
          <div className="h-20 mb-10 -mx-2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent rounded-2xl" />
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <defs>
                    <linearGradient id={`gradient-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={`var(--color-${metric.status === 'success' ? 'success' : 
                             metric.status === 'warning' ? 'warning' : 
                             metric.status === 'error' ? 'error' : 'accent'})`} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={`var(--color-${metric.status === 'success' ? 'success' : 
                             metric.status === 'warning' ? 'warning' : 
                             metric.status === 'error' ? 'error' : 'accent'})`} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="smoothValue"
                    stroke={`var(--color-${metric.status === 'success' ? 'success' : 
                           metric.status === 'warning' ? 'warning' : 
                           metric.status === 'error' ? 'error' : 'accent'})`}
                    strokeWidth={3}
                    fill={`url(#gradient-${metric.id})`}
                    dot={false}
                    activeDot={false}
                    filter="drop-shadow(0 4px 12px rgba(0,212,255,0.3))"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Progreso hacia meta con diseño premium */}
          {metric.target && (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                    <Target className="w-4 h-4 text-accent" />
                  </div>
                  <span className="font-semibold text-secondary font-space-grotesk text-base">Meta</span>
                </div>
                <span className="font-bold text-primary bg-surface-elevated px-4 py-2 rounded-xl text-lg">
                  {metric.target.toLocaleString()} {metric.unit}
                </span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-surface-elevated rounded-2xl h-4 overflow-hidden border border-light shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
                    transition={{ duration: 2.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                    className={`h-4 rounded-2xl ${
                      getProgressPercentage() >= 100 ? 'gradient-success' :
                      getProgressPercentage() >= 75 ? 'gradient-warning' : 
                      'gradient-accent'
                    } relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-futuristic" />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl"
                />
              </div>
            </div>
          )}
        </div>

        {/* Overlay de interacción mejorado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/15 flex items-center justify-center backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ 
              y: isHovered ? 0 : 30,
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-accent/30 shadow-glow">
              <TrendingUp className="w-10 h-10 text-accent" />
            </div>
            <span className="text-base font-bold text-accent font-space-grotesk tracking-wide">
              Ver Análisis Detallado
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}