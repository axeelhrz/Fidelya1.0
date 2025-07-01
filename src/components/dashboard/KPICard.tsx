'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, MoreHorizontal, Target, Sparkles, Zap, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, Area, AreaChart } from 'recharts';
import { KPIMetric } from '@/types/dashboard';
import { useStyles } from '@/lib/useStyles';

interface KPICardProps {
  metric: KPIMetric;
  index: number;
  onClick?: () => void;
}

export default function KPICard({ metric, index, onClick }: KPICardProps) {
  const { theme } = useStyles();
  const [isHovered, setIsHovered] = useState(false);

  // Estilos autocontenidos
  const styles = {
    container: {
      position: 'relative' as const,
      cursor: 'pointer',
    },
    
    card: {
      position: 'relative' as const,
      background: theme.colors.surfaceGlass,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${theme.colors.borderLight}`,
      borderRadius: theme.borderRadius.xxl,
      overflow: 'hidden',
      transition: theme.animations.transition,
    },
    
    cardHover: {
      borderColor: theme.colors.borderPrimary,
      boxShadow: theme.shadows.glowStrong,
    },
    
    statusGradient: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: isHovered ? '8px' : '2px',
      background: getStatusGradient(),
      opacity: isHovered ? 1 : 0.7,
      transition: theme.animations.transition,
    },
    
    glowEffect: {
      position: 'absolute' as const,
      inset: 0,
      background: getStatusGradient(),
      filter: 'blur(12px)',
      opacity: isHovered ? 0.4 : 0,
      transition: theme.animations.transition,
    },
    
    content: {
      position: 'relative' as const,
      padding: theme.spacing.lg,
      zIndex: 10,
    },
    
    header: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    
    titleContainer: {
      flex: 1,
      minWidth: 0,
    },
    
    title: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    
    titleText: {
      fontSize: '0.875rem',
      fontWeight: theme.fontWeights.medium,
      color: isHovered ? theme.colors.textAccent : theme.colors.textSecondary,
      fontFamily: theme.fonts.heading,
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
      transition: theme.animations.transition,
    },
    
    valueContainer: {
      display: 'flex',
      alignItems: 'baseline',
      gap: theme.spacing.sm,
      marginBottom: '0.5rem',
    },
    
    value: {
      fontSize: '3rem',
      fontWeight: theme.fontWeights.bold,
      color: isHovered ? theme.colors.textAccent : theme.colors.textPrimary,
      fontFamily: theme.fonts.heading,
      lineHeight: 1,
      transition: theme.animations.transition,
    },
    
    unit: {
      fontSize: '1.125rem',
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textTertiary,
      backgroundColor: theme.colors.surfaceElevated,
      padding: '0.375rem 0.75rem',
      borderRadius: theme.borderRadius.lg,
      transition: theme.animations.transition,
    },
    
    menuButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      backgroundColor: `${theme.colors.surfaceElevated}80`,
      backdropFilter: 'blur(4px)',
      border: `1px solid ${theme.colors.borderLight}`,
      cursor: 'pointer',
      opacity: isHovered ? 1 : 0,
      transition: theme.animations.transition,
      outline: 'none',
    },
    
    menuButtonHover: {
      backgroundColor: theme.colors.surfaceHover,
      borderColor: theme.colors.borderPrimary,
    },
    
    trendContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '2.5rem',
    },
    
    trendLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
    },
    
    trendIcon: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      backgroundColor: `${getStatusColor()}20`,
      border: `1px solid ${getStatusColor()}30`,
      backdropFilter: 'blur(4px)',
      transition: theme.animations.transition,
    },
    
    trendInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.25rem',
    },
    
    trendValue: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    
    trendPercentage: {
      fontSize: '1.5rem',
      fontWeight: theme.fontWeights.bold,
      color: getStatusColor(),
      fontFamily: theme.fonts.heading,
    },
    
    trendLabel: {
      fontSize: '0.875rem',
      color: theme.colors.textTertiary,
      fontWeight: theme.fontWeights.medium,
    },
    
    performanceIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      backgroundColor: `${theme.colors.textAccent}10`,
      padding: '0.75rem 1rem',
      borderRadius: theme.borderRadius.xl,
      border: `1px solid ${theme.colors.textAccent}20`,
      backdropFilter: 'blur(4px)',
      opacity: isHovered ? 1 : 0,
      transform: isHovered ? 'scale(1)' : 'scale(0)',
      transition: theme.animations.transition,
    },
    
    performanceText: {
      fontSize: '0.875rem',
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textAccent,
    },
    
    sparklineContainer: {
      height: '5rem',
      margin: '0 -0.5rem 2.5rem -0.5rem',
      position: 'relative' as const,
    },
    
    sparklineBackground: {
      position: 'absolute' as const,
      inset: 0,
      background: `linear-gradient(to right, transparent, ${theme.colors.textAccent}05, transparent)`,
      borderRadius: theme.borderRadius.xl,
    },
    
    progressSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1.25rem',
    },
    
    progressHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '0.875rem',
    },
    
    progressLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    
    progressIcon: {
      padding: '0.75rem',
      borderRadius: theme.borderRadius.lg,
      backgroundColor: `${theme.colors.textAccent}10`,
      border: `1px solid ${theme.colors.textAccent}20`,
    },
    
    progressLabel: {
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textSecondary,
      fontFamily: theme.fonts.heading,
      fontSize: '1rem',
    },
    
    progressTarget: {
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.textPrimary,
      backgroundColor: theme.colors.surfaceElevated,
      padding: '0.5rem 1rem',
      borderRadius: theme.borderRadius.lg,
      fontSize: '1.125rem',
    },
    
    progressBarContainer: {
      position: 'relative' as const,
    },
    
    progressBar: {
      width: '100%',
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.borderRadius.xl,
      height: '1rem',
      overflow: 'hidden',
      border: `1px solid ${theme.colors.borderLight}`,
      boxShadow: theme.shadows.inner,
    },
    
    progressFill: {
      height: '1rem',
      borderRadius: theme.borderRadius.xl,
      background: getProgressGradient(),
      position: 'relative' as const,
      overflow: 'hidden',
      transition: 'width 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    progressShimmer: {
      position: 'absolute' as const,
      inset: 0,
      background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)',
      animation: 'shimmer 2s infinite',
    },
    
    progressOverlay: {
      position: 'absolute' as const,
      inset: 0,
      background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
      borderRadius: theme.borderRadius.xl,
      opacity: isHovered ? 1 : 0,
      transition: theme.animations.transition,
    },
    
    interactionOverlay: {
      position: 'absolute' as const,
      inset: 0,
      background: `linear-gradient(135deg, ${theme.colors.textAccent}10, transparent, ${theme.colors.textAccent}15)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)',
      opacity: isHovered ? 1 : 0,
      transition: theme.animations.transition,
    },
    
    interactionContent: {
      textAlign: 'center' as const,
      transform: isHovered ? 'translateY(0)' : 'translateY(30px)',
      opacity: isHovered ? 1 : 0,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDelay: '0.1s',
    },
    
    interactionIcon: {
      width: '5rem',
      height: '5rem',
      backgroundColor: `${theme.colors.textAccent}20`,
      borderRadius: theme.borderRadius.xl,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem auto',
      backdropFilter: 'blur(4px)',
      border: `1px solid ${theme.colors.textAccent}30`,
      boxShadow: theme.shadows.glow,
    },
    
    interactionText: {
      fontSize: '1rem',
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.textAccent,
      fontFamily: theme.fonts.heading,
      letterSpacing: '0.05em',
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

  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp size={20} color={theme.colors.success} />;
      case 'down':
        return <TrendingDown size={20} color={theme.colors.error} />;
      default:
        return <Minus size={20} color={theme.colors.textSecondary} />;
    }
  };

  const getTrendPercentage = () => {
    if (metric.previousValue === 0) return "0";
    return ((metric.value - metric.previousValue) / metric.previousValue * 100).toFixed(1);
  };

  const getProgressPercentage = () => {
    if (!metric.target) return 0;
    return Math.min((metric.value / metric.target) * 100, 100);
  };

  const sparklineData = metric.sparklineData.map((value, index) => ({
    index,
    value,
    smoothValue: value + Math.sin(index * 0.5) * (value * 0.05)
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
        style={styles.container}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <div style={{
          ...styles.card,
          ...(isHovered ? styles.cardHover : {})
        }}>
          
          {/* Gradiente de estado superior */}
          <div style={styles.statusGradient}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: getStatusGradient(),
              filter: 'blur(4px)',
              opacity: 0.5,
            }} />
          </div>
          
          {/* Efecto de brillo */}
          <div style={styles.glowEffect} />
          
          {/* Partículas decorativas */}
          <motion.div
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0,
              rotate: isHovered ? 360 : 0
            }}
            transition={{ duration: 2, ease: "linear", repeat: isHovered ? Infinity : 0 }}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              width: '0.75rem',
              height: '0.75rem',
              backgroundColor: `${theme.colors.textAccent}40`,
              borderRadius: '50%',
            }}
          />
          
          <div style={styles.content}>
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.titleContainer}>
                <div style={styles.title}>
                  <h3 style={styles.titleText}>
                    {metric.name}
                  </h3>
                  {metric.status === 'success' && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ 
                        scale: isHovered ? 1.2 : 0,
                        rotate: isHovered ? 0 : -180
                      }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                    >
                      <Sparkles size={20} color={theme.colors.success} />
                    </motion.div>
                  )}
                </div>
                
                <div style={styles.valueContainer}>
                  <span style={styles.value}>
                    {metric.value.toLocaleString()}
                  </span>
                  <span style={styles.unit}>
                    {metric.unit}
                  </span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.3, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  ...styles.menuButton,
                  ...(isHovered ? styles.menuButtonHover : {})
                }}
              >
                <MoreHorizontal size={20} color={theme.colors.textSecondary} />
              </motion.button>
            </div>

            {/* Tendencia */}
            <div style={styles.trendContainer}>
              <div style={styles.trendLeft}>
                <motion.div 
                  style={styles.trendIcon}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {getTrendIcon()}
                </motion.div>
                <div style={styles.trendInfo}>
                  <div style={styles.trendValue}>
                    <span style={styles.trendPercentage}>
                      {Math.abs(parseFloat(getTrendPercentage()))}%
                    </span>
                    <ArrowUpRight size={16} color={getStatusColor()} />
                  </div>
                  <p style={styles.trendLabel}>vs. período anterior</p>
                </div>
              </div>
              
              <div style={styles.performanceIndicator}>
                <Zap size={16} color={theme.colors.textAccent} />
                <span style={styles.performanceText}>Excelente</span>
              </div>
            </div>

            {/* Sparkline */}
            <div style={styles.sparklineContainer}>
              <div style={styles.sparklineBackground} />
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                style={{ height: '100%' }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineData}>
                    <defs>
                      <linearGradient id={`gradient-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getStatusColor()} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={getStatusColor()} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="smoothValue"
                      stroke={getStatusColor()}
                      strokeWidth={3}
                      fill={`url(#gradient-${metric.id})`}
                      dot={false}
                      activeDot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Progreso hacia meta */}
            {metric.target && (
              <div style={styles.progressSection}>
                <div style={styles.progressHeader}>
                  <div style={styles.progressLeft}>
                    <div style={styles.progressIcon}>
                      <Target size={16} color={theme.colors.textAccent} />
                    </div>
                    <span style={styles.progressLabel}>Meta</span>
                  </div>
                  <span style={styles.progressTarget}>
                    {metric.target.toLocaleString()} {metric.unit}
                  </span>
                </div>
                
                <div style={styles.progressBarContainer}>
                  <div style={styles.progressBar}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
                      transition={{ duration: 2.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                      style={styles.progressFill}
                    >
                      <div style={styles.progressShimmer} />
                    </motion.div>
                  </div>
                  <div style={styles.progressOverlay} />
                </div>
              </div>
            )}
          </div>

          {/* Overlay de interacción */}
          <div style={styles.interactionOverlay}>
            <div style={styles.interactionContent}>
              <div style={styles.interactionIcon}>
                <TrendingUp size={40} color={theme.colors.textAccent} />
              </div>
              <span style={styles.interactionText}>
                Ver Análisis Detallado
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}