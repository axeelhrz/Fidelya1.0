'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  ArrowForward,
  Remove,
} from 'lucide-react';

export interface UnifiedMetricProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  gradient?: string;
  delay?: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xl';
  variant?: 'default' | 'compact' | 'detailed';
  showProgress?: boolean;
  progressValue?: number;
  badge?: string | number;
  description?: string;
}

const UnifiedMetricsCard: React.FC<UnifiedMetricProps> = ({
  title,
  value,
  change = 0,
  icon,
  color,
  gradient,
  delay = 0,
  subtitle,
  trend = 'neutral',
  onClick,
  loading = false,
  size = 'large',
  variant = 'detailed',
  showProgress = true,
  progressValue,
  badge,
  description,
}) => {
  // Tamaños más grandes y generosos
  const sizeConfig = {
    small: {
      cardHeight: 'h-44',
      iconSize: 'w-12 h-12',
      titleFontSize: 'text-xs',
      valueFontSize: 'text-2xl',
      padding: 'p-3',
      subtitleFontSize: 'text-sm',
      descriptionFontSize: 'text-xs',
    },
    medium: {
      cardHeight: 'h-56',
      iconSize: 'w-16 h-16',
      titleFontSize: 'text-sm',
      valueFontSize: 'text-3xl',
      padding: 'p-4',
      subtitleFontSize: 'text-sm',
      descriptionFontSize: 'text-sm',
    },
    large: {
      cardHeight: 'h-64',
      iconSize: 'w-18 h-18',
      titleFontSize: 'text-sm',
      valueFontSize: 'text-4xl',
      padding: 'p-4',
      subtitleFontSize: 'text-base',
      descriptionFontSize: 'text-sm',
    },
    xl: {
      cardHeight: 'h-72',
      iconSize: 'w-22 h-22',
      titleFontSize: 'text-base',
      valueFontSize: 'text-5xl',
      padding: 'p-6',
      subtitleFontSize: 'text-lg',
      descriptionFontSize: 'text-base',
    },
  };

  const config = sizeConfig[size];
  const calculatedProgressValue = progressValue !== undefined ? progressValue : Math.min(Math.abs(change) * 10, 100);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Remove className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatValue = (val: string | number) => {
    if (loading) return '...';
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    // Truncar texto largo pero mostrar más caracteres
    if (typeof val === 'string' && val.length > 25) {
      return `${val.substring(0, 22)}...`;
    }
    return val;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getColorWithOpacity = (hexColor: string, opacity: number) => {
    const rgb = hexToRgb(hexColor);
    return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})` : hexColor;
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
      whileHover={{ 
        y: onClick ? -8 : -4,
        transition: { duration: 0.2 }
      }}
      className="h-full"
    >
      <div
        onClick={onClick}
        className={`
          relative overflow-hidden border border-slate-200 rounded-2xl 
          bg-gradient-to-br from-white to-slate-50 
          transition-all duration-300 ease-out
          ${config.cardHeight} flex flex-col
          ${onClick ? 'cursor-pointer hover:border-opacity-60 hover:shadow-2xl' : 'cursor-default'}
          group
        `}
        style={{
          borderColor: onClick ? getColorWithOpacity(color, 0.4) : undefined,
          boxShadow: onClick ? `0 25px 80px -20px ${getColorWithOpacity(color, 0.3)}` : undefined,
        }}
      >
        {/* Top glow effect */}
        <div
          className="absolute top-0 left-0 right-0 h-1 opacity-70 group-hover:opacity-100 group-hover:h-1 transition-all duration-300"
          style={{ background: gradient || `linear-gradient(135deg, ${color} 0%, ${getColorWithOpacity(color, 0.8)} 100%)` }}
        />

        {/* Badge */}
        {badge && (
          <div className="absolute top-4 right-4 z-10">
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: getColorWithOpacity(color, 0.15),
                color: color,
              }}
            >
              {badge}
            </span>
          </div>
        )}
        
        <div className={`${config.padding} h-full flex flex-col relative`}>
          {/* Header Section */}
          <div className="flex items-start justify-between mb-3">
            <div
              className={`
                ${config.iconSize} rounded-xl flex items-center justify-center
                transition-all duration-300 ease-out border-2
                group-hover:scale-110 group-hover:rotate-2
              `}
              style={{
                backgroundColor: getColorWithOpacity(color, 0.12),
                color: color,
                borderColor: getColorWithOpacity(color, 0.1),
                boxShadow: `0 8px 24px ${getColorWithOpacity(color, 0.25)}`,
              }}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: color }} />
              ) : (
                <div className="flex items-center justify-center">
                  {icon}
                </div>
              )}
            </div>
            
            {/* Trend indicator */}
            {change !== 0 && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-sm font-bold">
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
          
          {/* Content Section */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div
                className={`
                  text-slate-400 font-bold uppercase tracking-wider mb-2 block leading-tight
                  ${config.titleFontSize}
                `}
              >
                {title}
              </div>
              
              <div
                className={`
                  font-black text-slate-900 leading-none mb-2 break-words
                  ${config.valueFontSize}
                `}
                title={typeof value === 'string' ? value : undefined}
              >
                {formatValue(value)}
              </div>
              
              {subtitle && (
                <div
                  className={`
                    text-slate-600 font-semibold leading-tight mb-1
                    ${config.subtitleFontSize}
                  `}
                >
                  {subtitle}
                </div>
              )}

              {description && variant === 'detailed' && (
                <div
                  className={`
                    text-slate-400 leading-tight font-medium
                    ${config.descriptionFontSize}
                  `}
                >
                  {description}
                </div>
              )}
            </div>
            
            {/* Footer Section */}
            <div className="mt-auto pt-2">
              {/* Progress indicator */}
              {showProgress && (
                <div className={`${onClick ? 'mb-3' : 'mb-0'}`}>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${loading ? 0 : calculatedProgressValue}%`,
                        background: gradient || color,
                      }}
                    />
                  </div>
                  <div className="text-slate-400 text-xs font-semibold mt-1">
                    {calculatedProgressValue.toFixed(0)}% completado
                  </div>
                </div>
              )}
              
              {/* Action button */}
              {onClick && (
                <div className="flex justify-end">
                  <button
                    className="
                      w-11 h-11 rounded-xl flex items-center justify-center
                      opacity-80 group-hover:opacity-100 group-hover:scale-110
                      transition-all duration-300 ease-out
                      hover:shadow-lg
                    "
                    style={{
                      backgroundColor: getColorWithOpacity(color, 0.12),
                      color: color,
                    }}
                  >
                    <ArrowForward className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UnifiedMetricsCard;