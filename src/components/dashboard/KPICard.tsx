'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, MoreHorizontal } from 'lucide-react';
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

  const getStatusColor = () => {
    switch (metric.status) {
      case 'success':
        return 'border-l-success bg-green-50';
      case 'warning':
        return 'border-l-warning bg-yellow-50';
      case 'error':
        return 'border-l-error bg-red-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  const getTrendPercentage = () => {
    if (metric.previousValue === 0) return 0;
    return ((metric.value - metric.previousValue) / metric.previousValue * 100).toFixed(1);
  };

  const sparklineData = metric.sparklineData.map((value, index) => ({
    index,
    value
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={`
        relative p-6 rounded-card shadow-card border-l-4 cursor-pointer
        transition-smooth hover-scale ${getStatusColor()}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-secondary mb-1">
            {metric.name}
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-space-grotesk text-primary">
              {metric.value.toLocaleString()}
            </span>
            <span className="text-sm text-secondary">
              {metric.unit}
            </span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1 rounded-lg hover:bg-white/50 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4 text-secondary" />
        </motion.button>
      </div>

      {/* Trend */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${
            metric.trend === 'up' ? 'text-success' : 
            metric.trend === 'down' ? 'text-error' : 'text-secondary'
          }`}>
            {getTrendPercentage()}%
          </span>
          <span className="text-xs text-secondary">vs. período anterior</span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="h-12 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparklineData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={metric.status === 'success' ? '#10B981' : 
                     metric.status === 'warning' ? '#F59E0B' : '#EF4444'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: '#4F46E5' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Target indicator */}
      {metric.target && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-secondary">Meta:</span>
          <span className="font-medium text-primary">
            {metric.target.toLocaleString()} {metric.unit}
          </span>
        </div>
      )}

      {/* Hover overlay */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-primary/5 rounded-card flex items-center justify-center"
        >
          <span className="text-sm font-medium text-primary">
            Ver detalles →
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
