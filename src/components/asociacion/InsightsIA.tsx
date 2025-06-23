'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  alpha,
  Avatar,
  Stack,
  Chip,
  Button,
  IconButton,
  Paper,
  LinearProgress,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  AutoGraph,
  Psychology,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Warning,
  CheckCircle,
  Info,
  Star,
  Speed,
  Timeline,
  SmartToy,
  Memory,
  Refresh,
  Visibility,
  ArrowForward,
  Group,
  Schedule,
  AttachMoney,
  DataUsage,
  AutoAwesome,
  Recommend,
} from '@mui/icons-material';
import { Socio, SocioStats } from '@/types/socio';

interface InsightsIAProps {
  socios: Socio[];
  stats: SocioStats;
  loading: boolean;
}

interface InsightCardProps {
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: 'prediction' | 'recommendation' | 'alert' | 'opportunity';
  icon: React.ReactNode;
  color: string;
  delay: number;
  onViewDetails: () => void;
  onApply?: () => void;
  data?: {
    growth?: number;
    timeframe?: string;
    at_risk?: number;
    action?: string;
    day?: string;
    time?: string;
    improvement?: number;
    segment_size?: number;
    revenue_potential?: number;
    age_group?: string;
    increase?: number;
    content_type?: string;
    retention_boost?: number;
  };
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  confidence,
  impact,
  category,
  icon,
  color,
  delay,
  onViewDetails,
  onApply,
}) => {
  const getImpactColor = () => {
    switch (impact) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6366f1';
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'prediction': return <AutoGraph sx={{ fontSize: 16 }} />;
      case 'recommendation': return <Lightbulb sx={{ fontSize: 16 }} />;
      case 'alert': return <Warning sx={{ fontSize: 16 }} />;
      case 'opportunity': return <Star sx={{ fontSize: 16 }} />;
      default: return <Info sx={{ fontSize: 16 }} />;
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'prediction': return 'Predicción';
      case 'recommendation': return 'Recomendación';
      case 'alert': return 'Alerta';
      case 'opportunity': return 'Oportunidad';
      default: return 'Insight';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        elevation={0}
        sx={{
          border: '1px solid #f1f5f9',
          borderRadius: 5,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: alpha(color, 0.3),
            transform: 'translateY(-4px)',
            boxShadow: `0 20px 60px -10px ${alpha(color, 0.25)}`,
            '& .insight-icon': {
              transform: 'scale(1.1)',
              bgcolor: alpha(color, 0.2),
            },
            '& .insight-glow': {
              opacity: 0.8,
            }
          },
        }}
      >
        {/* Glow effect */}
        <Box
          className="insight-glow"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.6)}, ${color})`,
            opacity: 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />
        
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
            <Avatar
              className="insight-icon"
              sx={{
                width: 56,
                height: 56,
                bgcolor: alpha(color, 0.12),
                color: color,
                borderRadius: 3,
                transition: 'all 0.3s ease',
              }}
            >
              {icon}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
                  {title}
                </Typography>
                <Chip
                  icon={getCategoryIcon()}
                  label={getCategoryLabel()}
                  size="small"
                  sx={{
                    bgcolor: alpha(color, 0.1),
                    color: color,
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 20,
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.5, mb: 2 }}>
                {description}
              </Typography>
              
              {/* Confidence and Impact */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                      Confianza
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#1e293b', fontWeight: 700 }}>
                      {confidence}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={confidence}
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
                <Chip
                  label={`Impacto ${impact.toUpperCase()}`}
                  size="small"
                  sx={{
                    bgcolor: alpha(getImpactColor(), 0.1),
                    color: getImpactColor(),
                    fontWeight: 600,
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              onClick={onViewDetails}
              size="small"
              startIcon={<Visibility />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: '#64748b',
                '&:hover': {
                  color: color,
                  bgcolor: alpha(color, 0.05),
                }
              }}
            >
              Ver detalles
            </Button>
            {onApply && (
              <Button
                onClick={onApply}
                size="small"
                variant="contained"
                startIcon={<ArrowForward />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  bgcolor: color,
                  '&:hover': {
                    bgcolor: alpha(color, 0.8),
                  }
                }}
              >
                Aplicar
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AIMetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  processing?: boolean;
}> = ({ title, value, subtitle, icon, color, trend, processing = false }) => {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #f1f5f9',
        borderRadius: 4,
        background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          bgcolor: color,
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: alpha(color, 0.1),
              color: color,
              borderRadius: 2,
            }}
          >
            {processing ? <CircularProgress size={20} sx={{ color }} /> : icon}
          </Avatar>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend === 'up' ? (
                <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />
              ) : trend === 'down' ? (
                <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />
              ) : (
                <Timeline sx={{ fontSize: 16, color: '#6366f1' }} />
              )}
            </Box>
          )}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

const PredictionChart: React.FC<{
  title: string;
  data: Array<{ month: string; actual?: number; predicted: number }>;
  color: string;
}> = ({ title, data, color }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.actual || 0, d.predicted)));

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #f1f5f9',
        borderRadius: 5,
        background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: alpha(color, 0.1),
              color: color,
              borderRadius: 2,
            }}
          >
            <AutoGraph />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Predicción basada en IA
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 1, px: 2 }}>
          {data.map((item, index) => (
            <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              {item.actual && (
                <Box
                  sx={{
                    width: '40%',
                    height: `${(item.actual / maxValue) * 100}%`,
                    bgcolor: alpha(color, 0.5),
                    borderRadius: '2px 2px 0 0',
                    minHeight: 4,
                  }}
                />
              )}
              <Box
                sx={{
                  width: item.actual ? '40%' : '80%',
                  height: `${(item.predicted / maxValue) * 100}%`,
                  bgcolor: color,
                  borderRadius: '2px 2px 0 0',
                  minHeight: 4,
                  border: item.actual ? `2px dashed ${color}` : 'none',
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.7rem',
                  color: '#94a3b8',
                  fontWeight: 600,
                  transform: 'rotate(-45deg)',
                  transformOrigin: 'center',
                  mt: 1,
                }}
              >
                {item.month}
              </Typography>
            </Box>
          ))}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: alpha(color, 0.5), borderRadius: 1 }} />
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Datos reales
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: color, borderRadius: 1, border: `1px dashed ${color}` }} />
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Predicción IA
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const InsightsIA: React.FC<InsightsIAProps> = ({
  stats,
  loading
}) => {
  const [aiProcessing, setAiProcessing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock AI insights data
  const aiInsights = [
    {
      id: 'growth-prediction',
      title: 'Crecimiento Acelerado Detectado',
      description: 'El modelo predice un crecimiento del 23% en los próximos 3 meses basado en tendencias actuales.',
      confidence: 87,
      impact: 'high' as const,
      category: 'prediction' as const,
      icon: <TrendingUp sx={{ fontSize: 28 }} />,
      color: '#10b981',
      data: { growth: 23, timeframe: '3 meses' }
    },
    {
      id: 'retention-alert',
      title: 'Riesgo de Abandono Identificado',
      description: '15 miembros muestran patrones de baja actividad. Se recomienda campaña de re-engagement.',
      confidence: 92,
      impact: 'high' as const,
      category: 'alert' as const,
      icon: <Warning sx={{ fontSize: 28 }} />,
      color: '#ef4444',
      data: { at_risk: 15, action: 'campaign' }
    },
    {
      id: 'optimal-timing',
      title: 'Momento Óptimo para Comunicaciones',
      description: 'Los martes a las 10:00 AM muestran 34% más engagement. Optimiza tus campañas.',
      confidence: 78,
      impact: 'medium' as const,
      category: 'recommendation' as const,
      icon: <Schedule sx={{ fontSize: 28 }} />,
      color: '#6366f1',
      data: { day: 'martes', time: '10:00', improvement: 34 }
    },
    {
      id: 'revenue-opportunity',
      title: 'Oportunidad de Ingresos Adicionales',
      description: 'Segmento premium identificado: 28 miembros dispuestos a pagar servicios adicionales.',
      confidence: 85,
      impact: 'high' as const,
      category: 'opportunity' as const,
      icon: <AttachMoney sx={{ fontSize: 28 }} />,
      color: '#f59e0b',
      data: { segment_size: 28, revenue_potential: 1200 }
    },
    {
      id: 'demographic-insight',
      title: 'Patrón Demográfico Emergente',
      description: 'Incremento del 45% en miembros de 25-35 años. Ajusta estrategias de marketing.',
      confidence: 73,
      impact: 'medium' as const,
      category: 'prediction' as const,
      icon: <Group sx={{ fontSize: 28 }} />,
      color: '#8b5cf6',
      data: { age_group: '25-35', increase: 45 }
    },
    {
      id: 'engagement-boost',
      title: 'Estrategia de Engagement Personalizada',
      description: 'Contenido educativo aumenta retención en 67%. Implementa programa de capacitación.',
      confidence: 89,
      impact: 'high' as const,
      category: 'recommendation' as const,
      icon: <Psychology sx={{ fontSize: 28 }} />,
      color: '#06b6d4',
      data: { content_type: 'educational', retention_boost: 67 }
    }
  ];

  const aiMetrics = [
    {
      title: 'Insights Generados',
      value: aiInsights.length,
      subtitle: 'Últimas 24 horas',
      icon: <AutoAwesome sx={{ fontSize: 24 }} />,
      color: '#6366f1',
      trend: 'up' as const
    },
    {
      title: 'Precisión del Modelo',
      value: '94.2%',
      subtitle: 'Promedio histórico',
      icon: <Psychology sx={{ fontSize: 24 }} />,
      color: '#10b981',
      trend: 'up' as const
    },
    {
      title: 'Procesamiento IA',
      value: '2.3s',
      subtitle: 'Tiempo promedio',
      icon: <Speed sx={{ fontSize: 24 }} />,
      color: '#f59e0b',
      processing: aiProcessing
    },
    {
      title: 'Datos Analizados',
      value: '847K',
      subtitle: 'Puntos de datos',
      icon: <DataUsage sx={{ fontSize: 24 }} />,
      color: '#8b5cf6',
      trend: 'neutral' as const
    }
  ];

  const predictionData = [
    { month: 'Ene', actual: 45, predicted: 48 },
    { month: 'Feb', actual: 52, predicted: 55 },
    { month: 'Mar', actual: 48, predicted: 51 },
    { month: 'Abr', actual: 61, predicted: 63 },
    { month: 'May', predicted: 68 },
    { month: 'Jun', predicted: 75 },
    { month: 'Jul', predicted: 82 },
  ];

  const handleViewDetails = (insightId: string) => {
    console.log('Viewing details for:', insightId);
  };

  const handleApplyInsight = (insightId: string) => {
    console.log('Applying insight:', insightId);
  };

  const handleRefreshAI = () => {
    setAiProcessing(true);
    setTimeout(() => setAiProcessing(false), 3000);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 4,
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 5 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: '#f1f5f9',
                      borderRadius: 3,
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                      },
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ width: '80%', height: 16, bgcolor: '#f1f5f9', borderRadius: 1, mb: 1 }} />
                    <Box sx={{ width: '60%', height: 14, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                  </Box>
                </Box>
                <Box sx={{ width: '100%', height: 8, bgcolor: '#f1f5f9', borderRadius: 1, mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Box sx={{ width: 80, height: 32, bgcolor: '#f1f5f9', borderRadius: 2 }} />
                  <Box sx={{ width: 80, height: 32, bgcolor: '#f1f5f9', borderRadius: 2 }} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
                  boxShadow: '0 12px 40px rgba(236, 72, 153, 0.3)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -2,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #6366f1)',
                    zIndex: -1,
                    opacity: 0.3,
                    filter: 'blur(8px)',
                  }
                }}
              >
                <AutoGraph sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    fontSize: '2.5rem',
                    background: 'linear-gradient(135deg, #0f172a 0%, #ec4899 40%, #8b5cf6 70%, #6366f1 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.03em',
                    lineHeight: 0.9,
                    mb: 1,
                  }}
                >
                  Insights IA
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                  }}
                >
                  Inteligencia artificial para decisiones estratégicas
                </Typography>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-thumb': {
                        bgcolor: '#ec4899',
                      },
                      '& .MuiSwitch-track': {
                        bgcolor: alpha('#ec4899', 0.3),
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                    Auto-refresh
                  </Typography>
                }
              />
              
              <IconButton
                onClick={handleRefreshAI}
                disabled={aiProcessing}
                sx={{
                  bgcolor: alpha('#ec4899', 0.1),
                  color: '#ec4899',
                  '&:hover': {
                    bgcolor: alpha('#ec4899', 0.2),
                    transform: 'rotate(180deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {aiProcessing ? <CircularProgress size={20} /> : <Refresh />}
              </IconButton>
              
              <Button
                variant="contained"
                startIcon={<SmartToy />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 4,
                  textTransform: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                  boxShadow: '0 8px 32px rgba(236, 72, 153, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #db2777 0%, #7c3aed 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(236, 72, 153, 0.4)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Entrenar Modelo
              </Button>
            </Stack>
          </Box>

          {/* AI Status */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: alpha('#ec4899', 0.05),
              border: `1px solid ${alpha('#ec4899', 0.15)}`,
              borderRadius: 4,
              p: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #6366f1)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: '#10b981',
                  borderRadius: '50%',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.5, transform: 'scale(1.1)' },
                  },
                }}
              />
              <Typography variant="body1" sx={{ color: '#475569', fontWeight: 700, fontSize: '1.1rem' }}>
                <Box component="span" sx={{ fontWeight: 900 }}>IA Activa</Box> - Modelo entrenado con {stats.total.toLocaleString()} registros de miembros
              </Typography>
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  icon={<Memory />}
                  label="Modelo v2.1.0"
                  sx={{
                    bgcolor: alpha('#ec4899', 0.1),
                    color: '#ec4899',
                    fontWeight: 600,
                  }}
                />
                <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 700 }}>
                  Última actualización: Hace 2 horas
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </motion.div>

      {/* AI Metrics */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 4,
          mb: 6,
        }}
      >
        {aiMetrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <AIMetricCard
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              icon={metric.icon}
              color={metric.color}
              trend={metric.trend}
              processing={metric.processing}
            />
          </motion.div>
        ))}
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '2fr 1fr',
          },
          gap: 6,
        }}
      >
        {/* Insights Grid */}
        <Box>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
              Insights Inteligentes
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
              Recomendaciones y predicciones generadas por IA
            </Typography>
          </Box>
          
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                lg: 'repeat(2, 1fr)',
              },
              gap: 4,
            }}
          >
            {aiInsights.map((insight, index) => (
              <InsightCard
                key={insight.id}
                title={insight.title}
                description={insight.description}
                confidence={insight.confidence}
                impact={insight.impact}
                category={insight.category}
                icon={insight.icon}
                color={insight.color}
                delay={index * 0.1}
                onViewDetails={() => handleViewDetails(insight.id)}
                onApply={insight.category === 'recommendation' ? () => handleApplyInsight(insight.id) : undefined}
                data={insight.data}
              />
            ))}
          </Box>
        </Box>

        {/* Predictions Panel */}
        <Stack spacing={4}>
          {/* Growth Prediction */}
          <PredictionChart
            title="Predicción de Crecimiento"
            data={predictionData}
            color="#10b981"
          />

          {/* AI Recommendations */}
          <Card
            elevation={0}
            sx={{
              border: '1px solid #f1f5f9',
              borderRadius: 5,
              background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: alpha('#6366f1', 0.1),
                    color: '#6366f1',
                    borderRadius: 2,
                  }}
                >
                  <Recommend />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Acciones Recomendadas
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Prioridad alta
                  </Typography>
                </Box>
              </Box>
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Campaña de retención"
                    secondary="Para 15 miembros en riesgo"
                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Schedule sx={{ color: '#f59e0b', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Optimizar horarios"
                    secondary="Martes 10:00 AM (+34% engagement)"
                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <AttachMoney sx={{ color: '#06b6d4', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Segmento premium"
                    secondary="28 miembros potenciales"
                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
};