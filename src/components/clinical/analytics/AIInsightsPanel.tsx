'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  IconButton,
  Stack,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Settings,
  RefreshCw,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import { AIInsight } from '@/types/analytics';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AIInsightsPanelProps {
  insights: AIInsight[];
  loading?: boolean;
  onRefreshInsights?: () => void;
}

export default function AIInsightsPanel({ 
  insights, 
  loading = false, 
  onRefreshInsights 
}: AIInsightsPanelProps) {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'recommendation': return Lightbulb;
      case 'alert': return AlertTriangle;
      case 'trend': return TrendingUp;
      case 'optimization': return Settings;
      default: return Brain;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'recommendation': return '#10B981';
      case 'alert': return '#EF4444';
      case 'trend': return '#3B82F6';
      case 'optimization': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getImpactColor = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getImpactLabel = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high': return 'Alto Impacto';
      case 'medium': return 'Impacto Medio';
      case 'low': return 'Bajo Impacto';
      default: return 'Impacto Desconocido';
    }
  };

  const getTypeLabel = (type: AIInsight['type']) => {
    switch (type) {
      case 'recommendation': return 'Recomendación';
      case 'alert': return 'Alerta';
      case 'trend': return 'Tendencia';
      case 'optimization': return 'Optimización';
      default: return 'Insight';
    }
  };

  const getCategoryLabel = (category: AIInsight['category']) => {
    switch (category) {
      case 'clinical': return 'Clínico';
      case 'operational': return 'Operacional';
      case 'patient-care': return 'Cuidado del Paciente';
      default: return 'General';
    }
  };

  const handleToggleExpand = (insightId: string) => {
    setExpandedInsight(expandedInsight === insightId ? null : insightId);
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(229, 231, 235, 0.6)',
          p: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              backgroundColor: '#F3F4F6',
              borderRadius: 2
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                height: 20,
                backgroundColor: '#F3F4F6',
                borderRadius: 1,
                mb: 1
              }}
            />
            <Box
              sx={{
                height: 16,
                backgroundColor: '#F3F4F6',
                borderRadius: 1,
                width: '60%'
              }}
            />
          </Box>
        </Box>

        {[...Array(3)].map((_, index) => (
          <Box
            key={index}
            sx={{
              height: 80,
              backgroundColor: '#F3F4F6',
              borderRadius: 2,
              mb: 2
            }}
          />
        ))}
      </Paper>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.1)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Efectos de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />

        {/* Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(139, 92, 246, 0.2)', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Brain size={24} color="white" />
                </Box>
              </motion.div>

              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: '#1C1E21',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  AI Insights
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6B7280',
                    fontWeight: 500
                  }}
                >
                  Sugerencias inteligentes para optimizar tu práctica
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<Zap size={14} />}
                label={`${insights.length} insights`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  color: '#8B5CF6',
                  fontWeight: 600,
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}
              />

              {onRefreshInsights && (
                <Tooltip title="Regenerar insights">
                  <IconButton
                    onClick={onRefreshInsights}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)'
                      }
                    }}
                  >
                    <RefreshCw size={16} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Box>

        {/* Insights List */}
        <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          {insights.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Brain size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
              <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                No hay insights disponibles
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                Los insights se generarán automáticamente basados en tus datos clínicos
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {insights.map((insight, index) => {
                const IconComponent = getInsightIcon(insight.type);
                const isExpanded = expandedInsight === insight.id;

                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(229, 231, 235, 0.4)',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.15)',
                          border: '1px solid rgba(139, 92, 246, 0.3)'
                        }
                      }}
                    >
                      {/* Insight Header */}
                      <Box
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}
                        onClick={() => handleToggleExpand(insight.id)}
                      >
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1.5,
                            backgroundColor: `${getInsightColor(insight.type)}15`,
                            border: `1px solid ${getInsightColor(insight.type)}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <IconComponent size={18} color={getInsightColor(insight.type)} />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                color: '#1C1E21'
                              }}
                            >
                              {insight.title}
                            </Typography>

                            <Chip
                              label={getTypeLabel(insight.type)}
                              size="small"
                              sx={{
                                backgroundColor: `${getInsightColor(insight.type)}10`,
                                color: getInsightColor(insight.type),
                                fontSize: '0.7rem',
                                height: 20,
                                fontWeight: 500
                              }}
                            />

                            <Chip
                              label={getImpactLabel(insight.impact)}
                              size="small"
                              sx={{
                                backgroundColor: `${getImpactColor(insight.impact)}10`,
                                color: getImpactColor(insight.impact),
                                fontSize: '0.7rem',
                                height: 20,
                                fontWeight: 500
                              }}
                            />
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{
                              color: '#6B7280',
                              lineHeight: 1.4
                            }}
                          >
                            {insight.description}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                              Confianza: {Math.round(insight.confidence * 100)}%
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                              {getCategoryLabel(insight.category)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                              {format(insight.createdAt, 'dd MMM yyyy', { locale: es })}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {insight.actionable && (
                            <Chip
                              label="Accionable"
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                color: '#10B981',
                                fontSize: '0.7rem',
                                height: 20,
                                fontWeight: 600
                              }}
                            />
                          )}

                          <IconButton size="small">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Insight Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Box
                              sx={{
                                px: 2,
                                pb: 2,
                                borderTop: '1px solid rgba(229, 231, 235, 0.3)',
                                backgroundColor: 'rgba(249, 250, 251, 0.5)'
                              }}
                            >
                              {/* Acciones sugeridas */}
                              {insight.suggestedActions.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontWeight: 600,
                                      color: '#1C1E21',
                                      mb: 1,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1
                                    }}
                                  >
                                    <CheckCircle size={16} color="#10B981" />
                                    Acciones Recomendadas
                                  </Typography>

                                  <List dense sx={{ py: 0 }}>
                                    {insight.suggestedActions.map((action, actionIndex) => (
                                      <ListItem key={actionIndex} sx={{ py: 0.5, px: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 24 }}>
                                          <ArrowRight size={14} color="#6B7280" />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={action}
                                          primaryTypographyProps={{
                                            variant: 'body2',
                                            color: '#374151'
                                          }}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Box>
                              )}

                              {/* Pacientes relacionados */}
                              {insight.relatedPatients && insight.relatedPatients.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontWeight: 600,
                                      color: '#1C1E21',
                                      mb: 1
                                    }}
                                  >
                                    Pacientes Relacionados ({insight.relatedPatients.length})
                                  </Typography>
                                  <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {insight.relatedPatients.slice(0, 3).map((patientId, idx) => (
                                      <Chip
                                        key={idx}
                                        label={`Paciente ${idx + 1}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                          fontSize: '0.7rem',
                                          height: 24
                                        }}
                                      />
                                    ))}
                                    {insight.relatedPatients.length > 3 && (
                                      <Chip
                                        label={`+${insight.relatedPatients.length - 3} más`}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                          fontSize: '0.7rem',
                                          height: 24,
                                          color: '#6B7280'
                                        }}
                                      />
                                    )}
                                  </Stack>
                                </Box>
                              )}

                              {/* Botones de acción */}
                              {insight.actionable && (
                                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    sx={{
                                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      fontSize: '0.8rem',
                                      borderRadius: 1.5,
                                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                                    }}
                                  >
                                    Aplicar Sugerencia
                                  </Button>

                                  <Button
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      fontSize: '0.8rem',
                                      borderRadius: 1.5,
                                      borderColor: 'rgba(107, 114, 128, 0.3)',
                                      color: '#6B7280'
                                    }}
                                  >
                                    Más Tarde
                                  </Button>
                                </Box>
                              )}
                            </Box>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Paper>
                  </motion.div>
                );
              })}
            </Stack>
          )}

          {/* Footer con información adicional */}
          {insights.length > 0 && (
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <Alert
                severity="info"
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: '#3B82F6'
                  }
                }}
              >
                <AlertTitle sx={{ fontWeight: 600, color: '#1C1E21' }}>
                  Sobre los AI Insights
                </AlertTitle>
                <Typography variant="body2" sx={{ color: '#374151' }}>
                  Estos insights se generan automáticamente analizando patrones en tus datos clínicos. 
                  Se actualizan diariamente para proporcionarte las recomendaciones más relevantes.
                </Typography>
              </Alert>
            </Box>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
}
