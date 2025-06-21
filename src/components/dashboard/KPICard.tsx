'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, MoreHorizontal, Target, Sparkles } from 'lucide-react';
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
        return 'from-success/20 to-success-light/20';
      case 'warning':
        return 'from-warning/20 to-warning-light/20';
      case 'error':
        return 'from-error/20 to-error-light/20';
      default:
        return 'from-accent/20 to-accent-light/20';
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      className="group relative card-hover premium-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getStatusGradient()} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[1.25rem]`} />
      
      {/* Status indicator with glow */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getStatusGradient()} rounded-t-[1.25rem]`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${getStatusGradient()} blur-sm opacity-50`} />
      </div>
      
      <div className="relative p-6 z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-sm font-medium text-secondary truncate">
                {metric.name}
              </h3>
              {metric.status === 'success' && (
                <Sparkles className="w-3 h-3 text-success opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-display text-primary">
                {metric.value.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-tertiary">
                {metric.unit}
              </span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl hover:bg-surface-hover transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-4 h-4 text-secondary" />
          </motion.button>
        </div>

        {/* Trend and Change */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getStatusColor()} bg-current/10`}>
              {getTrendIcon()}
            </div>
            <div>
              <span className={`text-lg font-semibold ${getStatusColor()}`}>
                {Math.abs(parseFloat(getTrendPercentage()))}%
              </span>
              <p className="text-xs text-tertiary">vs. período anterior</p>
            </div>
          </div>
        </div>

        {/* Sparkline with enhanced styling */}
        <div className="h-12 mb-6 -mx-2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent rounded-lg" />
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={`var(--color-${metric.status === 'success' ? 'success' : 
                       metric.status === 'warning' ? 'warning' : 
                       metric.status === 'error' ? 'error' : 'accent'})`}
                strokeWidth={2.5}
                dot={false}
                activeDot={false}
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Target Progress with modern styling */}
        {metric.target && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-accent/10">
                  <Target className="w-3 h-3 text-accent" />
                </div>
                <span className="font-medium text-secondary">Meta</span>
              </div>
              <span className="font-semibold text-primary">
                {metric.target.toLocaleString()} {metric.unit}
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
                  transition={{ duration: 1.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                  className={`h-2 rounded-full bg-gradient-to-r ${
                    getProgressPercentage() >= 100 ? 'from-success to-success-light' :
                    getProgressPercentage() >= 75 ? 'from-warning to-warning-light' : 
                    'from-accent to-accent-light'
                  }`}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        )}

        {/* Hover overlay with call-to-action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.95
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-light/5 rounded-[1.25rem] flex items-center justify-center backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <span className="text-sm font-semibold text-accent">
              Ver análisis detallado
            </span>
          </div>
        </motion.div>
      </div>

      {/* Floating elements for premium feel */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-accent/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-accent-light/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200" />
    </motion.div>
  );
}