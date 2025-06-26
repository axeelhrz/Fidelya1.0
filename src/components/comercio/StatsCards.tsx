'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  alpha,
  Avatar,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Receipt,
  CardGiftcard,
  Group,
  AccessTime,
  ArrowForward,
} from '@mui/icons-material';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useComercios } from '@/hooks/useComercios';
import { format, subDays, startOfMonth } from 'date-fns';
import { useRouter } from 'next/navigation';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  delay: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  delay,
  subtitle,
  trend = 'neutral',
  onClick
}) => {
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
    >
      <Card
        elevation={0}
        onClick={onClick}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #f1f5f9',
          borderRadius: 6,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: onClick ? 'pointer' : 'default',
          '&:hover': {
            borderColor: alpha(color, 0.3),
            transform: onClick ? 'translateY(-8px)' : 'translateY(-4px)',
            boxShadow: `0 25px 80px -15px ${alpha(color, 0.25)}`,
            '& .kpi-icon': {
              transform: 'scale(1.15) rotate(5deg)',
              bgcolor: alpha(color, 0.2),
            },
            '& .kpi-glow': {
              opacity: 0.8,
            }
          },
        }}
      >
        {/* Glow effect */}
        <Box
          className="kpi-glow"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.6)}, ${color})`,
            opacity: 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
            <Avatar
              className="kpi-icon"
              sx={{
                width: 64,
                height: 64,
                bgcolor: alpha(color, 0.12),
                color: color,
                borderRadius: 5,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 8px 32px ${alpha(color, 0.2)}`,
              }}
            >
              {icon}
            </Avatar>
            {/* Trend indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {trend === 'up' && <TrendingUp sx={{ fontSize: 20, color: '#10b981' }} />}
              {trend === 'down' && <TrendingDown sx={{ fontSize: 20, color: '#ef4444' }} />}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280',
                  fontSize: '0.9rem'
                }}
              >
                {change > 0 ? '+' : ''}{change}%
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: '#94a3b8',
                fontWeight: 800,
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                mb: 1,
                display: 'block'
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: '#0f172a',
                fontSize: '2.8rem',
                letterSpacing: '-0.03em',
                lineHeight: 0.9,
                mb: subtitle ? 1 : 0,
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {/* Progress indicator */}
          <Box sx={{ mt: 3 }}>
            <LinearProgress
              variant="determinate"
              value={Math.abs(change) > 100 ? 100 : Math.abs(change)}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: alpha(color, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                  borderRadius: 2,
                }
              }}
            />
          </Box>
          {onClick && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                size="small"
                sx={{
                  color: color,
                  bgcolor: alpha(color, 0.1),
                  '&:hover': {
                    bgcolor: alpha(color, 0.2),
                  }
                }}
              >
                <ArrowForward sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const StatsCards: React.FC = () => {
  const { activeBeneficios, beneficios } = useBeneficios();
  const { validaciones } = useValidaciones();
  const { comercio } = useComercios();
  const router = useRouter();

  // Calculate stats
  const now = new Date();
  const startOfThisMonth = startOfMonth(now);
  const validacionesEsteMes = validaciones.filter(v => 
    v.fechaHora.toDate() >= startOfThisMonth
  );

  const ultimaValidacion = validaciones.length > 0 
    ? validaciones.sort((a, b) => b.fechaHora.toDate().getTime() - a.fechaHora.toDate().getTime())[0]
    : null;

  const tiempoUltimaValidacion = ultimaValidacion 
    ? getTimeAgo(ultimaValidacion.fechaHora.toDate())
    : 'Nunca';

  const asociacionesVinculadas = comercio?.asociacionesVinculadas?.length || 0;

  const kpiMetrics = [
    {
      title: 'Validaciones este mes',
      value: validacionesEsteMes.length.toLocaleString(),
      change: 12.5,
      icon: <Receipt sx={{ fontSize: 32 }} />,
      color: '#06b6d4',
      delay: 0,
      subtitle: `${(validacionesEsteMes.length / new Date().getDate()).toFixed(1)} por día`,
      trend: 'up' as const,
      onClick: () => router.push('/dashboard/comercio/validaciones')
    },
    {
      title: 'Beneficios activos',
      value: activeBeneficios.length.toLocaleString(),
      change: 0,
      icon: <CardGiftcard sx={{ fontSize: 32 }} />,
      color: '#10b981',
      delay: 0.1,
      subtitle: `${beneficios.length} total`,
      trend: 'neutral' as const,
      onClick: () => router.push('/dashboard/comercio/beneficios')
    },
    {
      title: 'Asociaciones vinculadas',
      value: asociacionesVinculadas.toLocaleString(),
      change: 5.2,
      icon: <Group sx={{ fontSize: 32 }} />,
      color: '#8b5cf6',
      delay: 0.2,
      subtitle: 'Activas',
      trend: 'up' as const,
      onClick: () => router.push('/dashboard/comercio/perfil')
    },
    {
      title: 'Última validación',
      value: tiempoUltimaValidacion,
      change: 0,
      icon: <AccessTime sx={{ fontSize: 32 }} />,
      color: '#f59e0b',
      delay: 0.3,
      subtitle: ultimaValidacion ? format(ultimaValidacion.fechaHora.toDate(), 'dd/MM HH:mm') : '',
      trend: 'neutral' as const,
    }
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: 4
      }}
    >
      {kpiMetrics.map((metric, index) => (
        <KPICard
          key={index}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          icon={metric.icon}
          color={metric.color}
          delay={metric.delay}
          subtitle={metric.subtitle}
          trend={metric.trend}
          onClick={metric.onClick}
        />
      ))}
    </Box>
  );
};

// Helper function to get time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Ahora mismo';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
}