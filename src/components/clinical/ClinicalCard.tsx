'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ClinicalCardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  backgroundColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function ClinicalCard({
  title,
  subtitle,
  value,
  icon: Icon,
  iconColor = '#2563EB',
  backgroundColor = 'white',
  trend,
  onClick,
  children,
  className = '',
  size = 'medium'
}: ClinicalCardProps) {
  const sizeStyles = {
    small: {
      padding: '1rem',
      titleSize: '0.875rem',
      valueSize: '1.5rem'
    },
    medium: {
      padding: '1.5rem',
      titleSize: '1rem',
      valueSize: '2rem'
    },
    large: {
      padding: '2rem',
      titleSize: '1.125rem',
      valueSize: '2.5rem'
    }
  };

  const currentSize = sizeStyles[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      style={{
        padding: currentSize.padding,
        backgroundColor,
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease'
      }}
      className={className}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: value || children ? '1rem' : '0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {Icon && (
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.75rem',
              backgroundColor: `${iconColor}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon size={20} color={iconColor} />
            </div>
          )}
          
          <div>
            <h3 style={{
              fontSize: currentSize.titleSize,
              fontWeight: 600,
              color: '#374151',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              {title}
            </h3>
            
            {subtitle && (
              <p style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                margin: '0.25rem 0 0 0',
                fontFamily: 'Inter, sans-serif'
              }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {trend && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.5rem',
            backgroundColor: trend.isPositive ? '#ECFDF5' : '#FEF2F2',
                        fontSize: '0.75rem',
            fontWeight: 600,
            color: trend.isPositive ? '#10B981' : '#EF4444'
          }}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {/* Content */}
      {value && (
        <div style={{
          fontSize: currentSize.valueSize,
          fontWeight: 700,
          color: '#1F2937',
          fontFamily: 'Space Grotesk, sans-serif',
          lineHeight: 1
        }}>
          {value}
        </div>
      )}

      {children && (
        <div style={{ marginTop: value ? '1rem' : '0' }}>
          {children}
        </div>
      )}
    </motion.div>
  );
}

