'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, MoreHorizontal, Target, Sparkles, Zap, ArrowUpRight, Activity, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, Area, AreaChart } from 'recharts';
import { KPIMetric } from '@/types/dashboard';
import { useStyles } from '@/lib/useStyles';

interface KPICardProfessionalProps {
  metric: KPIMetric;
  index: number;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
  showSparkline?: boolean;
  showProgress?: boolean;
}

export default function KPICardProfessional({ 
  metric, 
  index, 
  onClick,
  variant = 'default',
  showSparkline = true,
  showProgress = true
}: KPICardProfessionalProps) {
  const { theme } = useStyles();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const styles = {
    container: {
      position: 'relative' as const,
      cursor: onClick ? 'pointer' : 'default',
      height: variant === 'compact' ? '12rem' : variant === 'detailed' ? '24rem' : '18rem',
    },
    
    card: {
      position: 'relative' as const,
      height: '100%',
      background: theme.colors.surfaceGlass,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${theme.colors.borderLight}`,
      borderRadius: theme.borderRadius.xxl,
      overflow: 'hidden',
      transition: theme.animations.transition,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    
    cardHover: {
      borderColor: theme.colors.borderPrimary,
      boxShadow: theme.shadows.glowStrong,
      transform: 'translateY(-8px) scale(1.02)',
    },
    
    cardPressed: {
      transform: 'translateY(-4px) scale(1.01)',
    },
    
    statusBar: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: isHovered ? '6px' : '3px',
      background: getStatusGradient(),
      opacity: isHovered ? 1 : 0.8,
      transition: theme.animations.transition,
    },
    
    statusBarGlow: {
      position: 'absolute' as const,
      inset: 0,
      background: getStatusGradient(),
      filter: 'blur(8px)',
      opacity: 0.3,
    },
    
    glowEffect: {
      position: 'absolute' as const,
      inset: 0,
      background: `radial-gradient(circle at 50% 0%, ${getStatusColor()}15, transparent 70%)`,
      opacity: isHovered ? 1 : 0,
      transition: theme.animations.transition,
    },
    
    content: {
      position: 'relative' as const,
      padding: variant === 'compact' ? theme.spacing.md : theme.spacing.lg,
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: variant === 'compact' ? theme.spacing.sm : theme.spacing.md,
      zIndex: 10,
    },
    
    header: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: variant === 'compact' ? theme.spacing.sm : theme.spacing.md,
    },
    
    titleSection: {
      flex: 1,
      minWidth: 0,
    },
    
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: '0.5rem',
    },
    
    statusIcon: {
      width: '1.5rem',
      height: '1.5rem',
      borderRadius: '50%',
      backgroundColor: `${getStatusColor()}20`,
      border: `2px solid ${getStatusColor()}40`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    
    title: {
      fontSize: variant === 'compact' ? '0.75rem' : '0.875rem',
      fontWeight: theme.fontWeights.semibold,
      color: isHovered ? theme.colors.textAccent : theme.colors.textSecondary,
      fontFamily: theme.fonts.heading,
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
      transition: theme.animations.transition,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    },
    
    valueSection: {
      display: 'flex',
      alignItems: 'baseline',
      gap: theme.spacing.sm,
      marginBottom: '0.5rem',
    },
    
    value: {
      fontSize: variant === 'compact' ? '2rem' : variant === 'detailed' ? '3.5rem' : '2.5rem',
      fontWeight: theme.fontWeights.bold,
      color: isHovered ? theme.colors.textAccent : theme.colors.textPrimary,
      fontFamily: theme.fonts.heading,
      lineHeight: 1,
      transition: theme.animations.transition,
    },
    
    unit: {
      fontSize: variant === 'compact' ? '0.875rem' : '1rem',
      fontWeight: theme.fontWeights.medium,
      color: theme.colors.textTertiary,
      backgroundColor: theme.colors.surfaceElevated,
      padding: '0.25rem 0.5rem',
      borderRadius: theme.borderRadius.md,
      flexShrink: 0,
    },
    
    menuButton: {
      padding: '0.5rem',
      borderRadius: theme.borderRadius.lg,
      backgroundColor: `${theme.colors.surfaceElevated}60`,
      backdropFilter: 'blur(8px)',
      border: `1px solid ${theme.colors.borderLight}`,
      cursor: 'pointer',
      opacity: isHovered ? 1 : 0,
      transition: theme.animations.transition,
      outline: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    trendSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: variant === 'compact' ? theme.spacing.sm : theme.spacing.md,
    },
    
    trendLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    
    trendIconContainer: {
      padding: '0.5rem',
      borderRadius: theme.borderRadius.lg,
      backgroundColor: `${getStatusColor()}15`,
      border: `1px solid ${getStatusColor()}25`,
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    trendInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.125rem',
    },
    
    trendValue: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
    },
    
    trendPercentage: {
      fontSize: variant === 'compact' ? '1rem' : '1.25rem',
      fontWeight: theme.fontWeights.bold,
      color: getStatusColor(),
      fontFamily: theme.fonts.heading,
    },
    
    trendLabel: {
      fontSize: '0.75rem',
      color: theme.colors.textTertiary,
      fontWeight: theme.fontWeights.medium,
    },
    
    performanceBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: `${theme.colors.textAccent}12`,
      padding: '0.5rem 0.75rem',
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.textAccent}20`,
      backdropFilter: 'blur(4px)',
      opacity: isHovered ? 1 : 0,
      transform: isHovered ? 'scale(1)' : 'scale(0.9)',
      transition: theme.animations.transition,
    },
    
    performanceText: {
      fontSize: '0.75rem',
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textAccent,
    },
    
    sparklineContainer: {
      height: variant === 'compact' ? '3rem' : '4rem',
      margin: `0 -${theme.spacing.sm}`,
      position: 'relative' as const,
      marginBottom: variant === 'compact' ? theme.spacing.sm : theme.spacing.md,
    },
    
    sparklineBackground: {
      position: 'absolute' as const,
      inset: 0,
      background: `linear-gradient(to right, transparent, ${getStatusColor()}08, transparent)`,
      borderRadius: theme.borderRadius.lg,
    },
    
    progressSection: {
      marginTop: 'auto',
    },
    
    progressHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.75rem',
    },
    
    progressLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    
    progressIcon: {
      padding: '0.375rem',
      borderRadius: theme.borderRadius.md,
      backgroundColor: `${theme.colors.textAccent}12`,
      border: `1px solid ${theme.colors.textAccent}20`,
    },
    
    progressLabel: {
      fontSize: '0.75rem',
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textSecondary,
      fontFamily: theme.fonts.heading,
    },
    
    progressTarget: {
      fontSize: '0.875rem',
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.textPrimary,
      backgroundColor: theme.colors.surfaceElevated,
      padding: '0.25rem 0.75rem',
      borderRadius: theme.borderRadius.md,
    },
    
    progressBarContainer: {
      position: 'relative' as const,
    },
    
    progressBar: {
      width: '100%',
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.borderRadius.lg,
      height: '0.75rem',
      overflow: 'hidden',
      border: `1px solid ${theme.colors.borderLight}`,
      boxShadow: theme.shadows.inner,
    },
    
    progressFill: {
      height: '100%',
      borderRadius: theme.borderRadius.lg,
      background: getProgressGradient(),
      position: 'relative' as const,
      overflow: 'hidden',
      transition: 'width 2s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    progressShimmer: {
      position: 'absolute' as const,
      inset: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      animation: 'shimmer 2s infinite',
    },
    
    interactionOverlay: {
      position: 'absolute' as const,
      inset: 0,
      background: `linear-gradient(135deg, ${theme.colors.textAccent}08, transparent, ${theme.colors.textAccent}12)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(8px)',
      opacity: isHovered && onClick ? 1 : 0,
      transition: theme.animations.transition,
      borderRadius: 'inherit',
    },
    
    interactionContent: {
      textAlign: 'center' as const,
      transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
      opacity: isHovered ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDelay: '0.1s',
    },
    
    interactionIcon: {
      width: '3rem',
      height: '3rem',
      backgroundColor: `${theme.colors.textAccent}20`,
      borderRadius: theme.borderRadius.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 0.5rem auto',
      backdropFilter: 'blur(4px)',
      border: `1px solid ${theme.colors.textAccent}30`,
    },
    
    interactionText: {
      fontSize: '0.875rem',
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textAccent,
      fontFamily: theme.fonts.heading,
    },
  };

  function getStatusGradient() {
    switch (metric.status) {
      case 'success':
        return theme.gradients.success;
      case 'warning':
        return theme.gradients.warning;
      case 'error':
        return theme.gradients.error;
      default:
        return theme.gradients.primary;
    }
  }

  function getStatusColor() {
    switch (metric.status) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.textAccent;
    }
  }

  function getProgressGradient() {
    const percentage = getProgressPercentage();
    if (percentage >= 100) return theme.gradients.success;
    if (percentage >= 75) return theme.gradients.warning;
    return theme.gradients.primary;
  }

  function getStatusIcon() {
    switch (metric.status) {
      case 'success':
        return <Sparkles size={12} color={theme.colors.success} />;
      case 'warning':
        return <AlertTriangle size={12} color={theme.colors.warning} />;
      case 'error':
        return <AlertTriangle size={12} color={theme.colors.error} />;
      default:
        return <Activity size={12} color={theme.colors.textAccent} />;
    }
  }

  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp size={16} color={theme.colors.success} />;
      case 'down':
        return <TrendingDown size={16} color={theme.colors.error} />;
      default:
        return <Minus size={16} color={theme.colors.textSecondary} />;
    }
  };

  const getTrendPercentage = () => {
    if (metric.previousValue === 0) return '0.0';
    return ((metric.value - metric.previousValue) / metric.previousValue * 100).toFixed(1);
  };

  const getProgressPercentage = () => {
    if (!metric.target) return 0;
    return Math.min((metric.value / metric.target) * 100, 100);
  };

  const getPerformanceLabel = () => {
    const percentage = parseFloat(getTrendPercentage());
    if (percentage > 15) return 'Excelente';
    if (percentage > 5) return 'Bueno';
    if (percentage > -5) return 'Estable';
    return 'Necesita atención';
  };

  const sparklineData = metric.sparklineData.map((value, index) => ({
    index,
    value,
    smoothValue: value + Math.sin(index * 0.3) * (value * 0.03)
  }));

  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          delay: index * 0.1,
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1]
        }}
        style={styles.container}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={onClick}
      >
        <motion.div
          style={{
            ...styles.card,
            ...(isHovered ? styles.cardHover : {}),
            ...(isPressed ? styles.cardPressed : {}),
          }}
          animate={{
            rotateX: isHovered ? 2 : 0,
            rotateY: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Barra de estado superior */}
          <div style={styles.statusBar}>
            <div style={styles.statusBarGlow} />
          </div>
          
          {/* Efecto de brillo */}
          <div style={styles.glowEffect} />
          
          <div style={styles.content}>
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.titleSection}>
                <div style={styles.titleContainer}>
                  <div style={styles.statusIcon}>
                    {getStatusIcon()}
                  </div>
                  <h3 style={styles.title}>
                    {metric.name}
                  </h3>
                </div>
                
                <div style={styles.valueSection}>
                  <span style={styles.value}>
                    {metric.value.toLocaleString()}
                  </span>
                  <span style={styles.unit}>
                    {metric.unit}
                  </span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                style={styles.menuButton}
              >
                <MoreHorizontal size={16} color={theme.colors.textSecondary} />
              </motion.button>
            </div>

            {/* Sección de tendencia */}
            {variant !== 'compact' && (
              <div style={styles.trendSection}>
                <div style={styles.trendLeft}>
                  <motion.div 
                    style={styles.trendIconContainer}
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getTrendIcon()}
                  </motion.div>
                  <div style={styles.trendInfo}>
                    <div style={styles.trendValue}>
                      <span style={styles.trendPercentage}>
                        {Math.abs(parseFloat(getTrendPercentage()))}%
                      </span>
                      <ArrowUpRight size={12} color={getStatusColor()} />
                    </div>
                    <p style={styles.trendLabel}>vs. anterior</p>
                  </div>
                </div>
                
                <div style={styles.performanceBadge}>
                  <Zap size={12} color={theme.colors.textAccent} />
                  <span style={styles.performanceText}>
                    {getPerformanceLabel()}
                  </span>
                </div>
              </div>
            )}

            {/* Sparkline */}
            {showSparkline && (
              <div style={styles.sparklineContainer}>
                <div style={styles.sparklineBackground} />
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                  style={{ height: '100%' }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklineData}>
                      <defs>
                        <linearGradient id={`gradient-prof-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={getStatusColor()} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={getStatusColor()} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="smoothValue"
                        stroke={getStatusColor()}
                        strokeWidth={2}
                        fill={`url(#gradient-prof-${metric.id})`}
                        dot={false}
                        activeDot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            )}

            {/* Progreso hacia meta */}
            {showProgress && metric.target && (
              <div style={styles.progressSection}>
                <div style={styles.progressHeader}>
                  <div style={styles.progressLeft}>
                    <div style={styles.progressIcon}>
                      <Target size={12} color={theme.colors.textAccent} />
                    </div>
                    <span style={styles.progressLabel}>Meta</span>
                  </div>
                  <span style={styles.progressTarget}>
                    {metric.target.toLocaleString()}
                  </span>
                </div>
                
                <div style={styles.progressBarContainer}>
                  <div style={styles.progressBar}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
                      transition={{ duration: 1.5, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
                      style={styles.progressFill}
                    >
                      <div style={styles.progressShimmer} />
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Overlay de interacción */}
          {onClick && (
            <div style={styles.interactionOverlay}>
              <div style={styles.interactionContent}>
                <div style={styles.interactionIcon}>
                  <TrendingUp size={20} color={theme.colors.textAccent} />
                </div>
                <span style={styles.interactionText}>
                  Ver detalles
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}