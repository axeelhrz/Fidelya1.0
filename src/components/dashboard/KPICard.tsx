'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, MoreHorizontal, Target, Sparkles, Zap } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
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
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-error" />;
      default:
        return <Minus className="w-4 h-4 text-secondary" />;
    }
  };

  const getStatusGradient = () => {
    switch (metric.status) {
      case 'success':
        return 'from-success/10 via-success/5 to-transparent';
      case 'warning':
        return 'from-warning/10 via-warning/5 to-transparent';
      case 'error':
        return 'from-error/10 via-error/5 to-transparent';
      default:
        return 'from-accent/10 via-accent/5 to-transparent';
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
        return 'border-success/20';
      case 'warning':
        return 'border-warning/20';
      case 'error':
        return 'border-error/20';
      default:
        return 'border-accent/20';
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
    value
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ 
        y: -12,
        scale: 1.02,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
      }}
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Fondo principal con glassmorphism */}
      <div className="relative bg-surface-glass backdrop-blur-xl border border-light rounded-card overflow-hidden transition-all duration-500 group-hover:border-glow group-hover:shadow-glow-strong">
        
        {/* Gradiente de estado superior */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getStatusGradient()}`}>
          <div className={`absolute inset-0 bg-gradient-to-r ${getStatusGradient()} blur-sm opacity-50`} />
        </div>
        
        {/* Efecto de brillo en hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`absolute inset-0 bg-gradient-to-br ${getStatusGradient()} opacity-30`}
        />
        
        {/* Partículas decorativas */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-accent/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 animate-pulse-glow" />
        <div className="absolute bottom-6 left-4 w-1 h-1 bg-accent/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-300 animate-float" />
        
        <div className="relative p-7 z-10">
          {/* Header con animaciones */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-3">
                <motion.h3 
                  className="text-sm font-medium text-secondary truncate font-space-grotesk tracking-wide"
                  animate={{ color: isHovered ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
                  transition={{ duration: 0.3 }}
                >
                  {metric.name}
                </motion.h3>
                {metric.status === 'success' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ 
                      scale: isHovered ? 1 : 0,
                      rotate: isHovered ? 0 : -180
                    }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <Sparkles className="w-4 h-4 text-success" />
                  </motion.div>
                )}
              </div>
              <div className="flex items-baseline space-x-3">
                <motion.span 
                  className="text-4xl font-bold text-display-futuristic text-primary"
                  animate={{ 
                    scale: isHovered ? 1.05 : 1,
                    color: isHovered ? 'var(--color-accent)' : 'var(--color-text-primary)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {metric.value.toLocaleString()}
                </motion.span>
                <span className="text-sm font-semibold text-tertiary bg-surface-elevated px-2 py-1 rounded-full">
                  {metric.unit}
                </span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl bg-surface-elevated/50 backdrop-blur-sm hover:bg-surface-hover transition-all duration-300 opacity-0 group-hover:opacity-100 border border-light hover:border-glow"
            >
              <MoreHorizontal className="w-4 h-4 text-secondary" />
            </motion.button>
          </div>

          {/* Tendencia con efectos mejorados */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <motion.div 
                className={`p-3 rounded-xl ${getStatusColor()} bg-current/10 backdrop-blur-sm border ${getStatusBorder()}`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {getTrendIcon()}
              </motion.div>
              <div>
                <motion.span 
                  className={`text-xl font-bold ${getStatusColor()} font-space-grotesk`}
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {Math.abs(parseFloat(getTrendPercentage()))}%
                </motion.span>
                <p className="text-xs text-tertiary font-medium">vs. período anterior</p>
              </div>
            </div>
            
            {/* Indicador de rendimiento */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center space-x-2 bg-accent/10 px-3 py-2 rounded-full border border-accent/20"
            >
              <Zap className="w-3 h-3 text-accent" />
              <span className="text-xs font-semibold text-accent">Excelente</span>
            </motion.div>
          </div>

          {/* Sparkline mejorado */}
          <div className="h-16 mb-8 -mx-2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent rounded-lg" />
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={`var(--color-${metric.status === 'success' ? 'success' : 
                           metric.status === 'warning' ? 'warning' : 
                           metric.status === 'error' ? 'error' : 'accent'})`}
                    strokeWidth={3}
                    dot={false}
                    activeDot={false}
                    filter="drop-shadow(0 2px 8px rgba(0,212,255,0.3))"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Progreso hacia meta con diseño futurista */}
          {metric.target && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                    <Target className="w-3 h-3 text-accent" />
                  </div>
                  <span className="font-semibold text-secondary font-space-grotesk">Meta</span>
                </div>
                <span className="font-bold text-primary bg-surface-elevated px-3 py-1 rounded-full">
                  {metric.target.toLocaleString()} {metric.unit}
                </span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-surface-elevated rounded-full h-3 overflow-hidden border border-light">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
                    transition={{ duration: 2, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                    className={`h-3 rounded-full ${
                      getProgressPercentage() >= 100 ? 'gradient-success' :
                      getProgressPercentage() >= 75 ? 'gradient-warning' : 
                      'gradient-accent'
                    } relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-futuristic" />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Overlay de interacción */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 flex items-center justify-center backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: isHovered ? 0 : 20,
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-accent/30">
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
            <span className="text-sm font-bold text-accent font-space-grotesk tracking-wide">
              Ver Análisis Detallado
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}