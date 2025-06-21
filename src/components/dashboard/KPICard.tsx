'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, MoreHorizontal, Target } from 'lucide-react';
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
        return <TrendingUp className="w-3.5 h-3.5 text-success" />;
      case 'down':
        return <TrendingDown className="w-3.5 h-3.5 text-error" />;
      default:
        return <Minus className="w-3.5 h-3.5 text-secondary" />;
    }
  };

  const getStatusIndicator = () => {
    switch (metric.status) {
      case 'success':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'error':
        return 'bg-error';
      default:
        return 'bg-border-medium';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="group relative bg-surface rounded-card border border-border-light hover:border-border-medium hover:shadow-elevated transition-all duration-300 cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Status indicator */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${getStatusIndicator()}`} />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-secondary mb-1 truncate">
              {metric.name}
            </h3>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-semibold font-space-grotesk text-primary">
                {metric.value.toLocaleString()}
              </span>
              <span className="text-sm text-tertiary">
                {metric.unit}
              </span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-4 h-4 text-secondary" />
          </motion.button>
        </div>

        {/* Trend and Change */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${
              metric.trend === 'up' ? 'text-success' : 
              metric.trend === 'down' ? 'text-error' : 'text-secondary'
            }`}>
              {Math.abs(parseFloat(getTrendPercentage()))}%
            </span>
          </div>
          <span className="text-xs text-tertiary">vs. anterior</span>
        </div>

        {/* Sparkline */}
        <div className="h-8 mb-4 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={metric.status === 'success' ? 'var(--success)' : 
                       metric.status === 'warning' ? 'var(--warning)' : 
                       metric.status === 'error' ? 'var(--error)' : 'var(--accent)'}
                strokeWidth={1.5}
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Target Progress */}
        {metric.target && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <Target className="w-3 h-3 text-secondary" />
                <span className="text-secondary">Meta</span>
              </div>
              <span className="font-medium text-primary">
                {metric.target.toLocaleString()} {metric.unit}
              </span>
            </div>
            <div className="w-full bg-surface-elevated rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  getProgressPercentage() >= 100 ? 'bg-success' :
                  getProgressPercentage() >= 75 ? 'bg-warning' : 'bg-accent'
                }`}
                style={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-card flex items-center justify-center"
        >
          <span className="text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
            Ver detalles →
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}