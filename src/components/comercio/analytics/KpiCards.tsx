'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Box,
  Chip,
  alpha,
} from '@mui/material';
import {
  CheckCircle,
  CalendarToday,
  Business,
  LocalOffer,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { AnalyticsData } from '@/hooks/useAnalytics';

interface KpiCardsProps {
  data: AnalyticsData;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ data }) => {
  const kpiData = [
    {
      title: 'Validaciones Totales',
      value: data.totalValidaciones,
      icon: <CheckCircle />,
      color: '#06b6d4',
      change: '+12%',
      subtitle: 'del período seleccionado',
      trend: 'up' as const,
    },
    {
      title: 'Promedio Diario',
      value: data.promedioDiario.toFixed(1),
      icon: <CalendarToday />,
      color: '#10b981',
      change: '+8%',
      subtitle: 'validaciones por día',
      trend: 'up' as const,
    },
    {
      title: 'Asociaciones Activas',
      value: data.asociacionesActivas,
      icon: <Business />,
      color: '#8b5cf6',
      change: '0%',
      subtitle: 'con validaciones',
      trend: 'neutral' as const,
    },
    {
      title: 'Beneficio Más Usado',
      value: data.beneficioMasUsado?.nombre || 'N/A',
      displayValue: data.beneficioMasUsado?.usos || 0,
      icon: <LocalOffer />,
      color: '#f59e0b',
      change: '+15%',
      subtitle: `${data.beneficioMasUsado?.usos || 0} usos`,
      trend: 'up' as const,
    },
  ];

  return (
    <Grid container spacing={3}>
      {kpiData.map((kpi, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card
              elevation={0}
              sx={{
                background: 'white',
                border: '1px solid #f1f5f9',
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  borderColor: kpi.color,
                  boxShadow: `0 10px 40px ${alpha(kpi.color, 0.15)}`,
                  transform: 'translateY(-2px)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${kpi.color} 0%, ${alpha(kpi.color, 0.7)} 100%)`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(kpi.color, 0.1),
                        color: kpi.color,
                        width: 56,
                        height: 56,
                        border: `2px solid ${alpha(kpi.color, 0.2)}`,
                      }}
                    >
                      {kpi.icon}
                    </Avatar>
                  </motion.div>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#64748b', 
                        fontWeight: 600,
                        mb: 1,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontSize: '0.75rem',
                      }}
                    >
                      {kpi.title}
                    </Typography>
                    
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 900, 
                        color: '#0f172a',
                        mb: 1,
                        lineHeight: 1.2,
                        fontSize: typeof kpi.value === 'string' && kpi.value.length > 10 ? '1.5rem' : '2rem',
                      }}
                      title={typeof kpi.value === 'string' ? kpi.value : undefined}
                    >
                      {typeof kpi.value === 'string' && kpi.value.length > 15 
                        ? `${kpi.value.substring(0, 15)}...` 
                        : kpi.displayValue || kpi.value
                      }
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Chip
                        icon={kpi.trend === 'up' ? <TrendingUp sx={{ fontSize: 14 }} /> : 
                              kpi.trend === 'down' ? <TrendingDown sx={{ fontSize: 14 }} /> : undefined}
                        label={kpi.change}
                        size="small"
                        sx={{
                          bgcolor: kpi.trend === 'up' ? alpha('#10b981', 0.1) : 
                                   kpi.trend === 'down' ? alpha('#ef4444', 0.1) : 
                                   alpha('#64748b', 0.1),
                          color: kpi.trend === 'up' ? '#059669' : 
                                 kpi.trend === 'down' ? '#dc2626' : 
                                 '#475569',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          height: 24,
                          '& .MuiChip-icon': {
                            fontSize: 14,
                          }
                        }}
                      />
                    </Stack>

                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#94a3b8',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    >
                      {kpi.subtitle}
                    </Typography>
                  </Box>
                </Stack>

                {/* Decorative elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    background: `radial-gradient(circle, ${alpha(kpi.color, 0.1)} 0%, transparent 70%)`,
                    borderRadius: '50%',
                    pointerEvents: 'none',
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};
