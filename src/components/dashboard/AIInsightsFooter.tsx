'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Download, 
  Play, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  BarChart3, 
  Shield,
  RefreshCw,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useStyles } from '@/lib/useStyles';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface AIInsight {
  id: string;
  type: 'recommendation' | 'simulation' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  estimatedValue?: string;
}

interface AIInsightsPanelProps {
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
}

export default function AIInsightsFooter({ 
  loading = false, 
  onRefresh, 
  onExport 
}: AIInsightsPanelProps) {
  const { theme } = useStyles();
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock data mejorado
  const mockInsights: AIInsight[] = [
    {
      id: '1',
      type: 'recommendation',
      title: 'Incrementar tarifas 5% en julio',
      description: 'Análisis histórico sugiere que un aumento del 5% en tarifas durante julio tendría mínimo impacto en retención de pacientes.',
      impact: 'high',
      confidence: 87,
      actionable: true,
      estimatedValue: '+$12.5k/mes'
    },
    {
      id: '2',
      type: 'alert',
      title: 'Patrón de cancelaciones detectado',
      description: 'Se detectó un aumento del 23% en cancelaciones los viernes por la tarde en las últimas 4 semanas.',
      impact: 'medium',
      confidence: 92,
      actionable: true,
      estimatedValue: '-$3.2k/mes'
    },
    {
      id: '3',
      type: 'simulation',
      title: 'Proyección de capacidad Q2',
      description: 'Con el crecimiento actual, se alcanzará 95% de capacidad en abril. Considerar expansión o contratación.',
      impact: 'high',
      confidence: 78,
      actionable: true,
      estimatedValue: '+$25k/mes'
    }
  ];

  const complianceMetrics = [
    { name: 'Backups automáticos', value: 98, description: 'Respaldos diarios completados', status: 'success' },
    { name: 'Consentimientos firmados', value: 94, description: 'Documentos legales actualizados', status: 'success' },
    { name: 'Verificación de accesos', value: 89, description: 'Auditoría de permisos pendiente', status: 'warning' },
    { name: 'Cifrado de datos', value: 96, description: 'Protección de información activa', status: 'success' },
  ];

  const overallCompliance = Math.round(complianceMetrics.reduce((sum, metric) => sum + metric.value, 0) / complianceMetrics.length);

  const styles = {
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: theme.spacing.md,
    },
    
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
      flexWrap: 'wrap' as const,
      gap: theme.spacing.md,
    },
    
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    
    headerIcon: {
      width: '3rem',
      height: '3rem',
      background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
      borderRadius: theme.borderRadius.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
    },
    
    headerContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.25rem',
    },
    
    title: {
      fontSize: '1.5rem',
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.textPrimary,
      fontFamily: theme.fonts.heading,
      margin: 0,
    },
    
    subtitle: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary,
      fontWeight: theme.fontWeights.medium,
      margin: 0,
    },
    
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      flexWrap: 'wrap' as const,
    },
    
    filterContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: '0.5rem',
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.borderLight}`,
    },
    
    filterButton: {
      padding: '0.5rem 1rem',
      borderRadius: theme.borderRadius.md,
      border: 'none',
      backgroundColor: 'transparent',
      color: theme.colors.textSecondary,
      fontSize: '0.875rem',
      fontWeight: theme.fontWeights.medium,
      cursor: 'pointer',
      transition: theme.animations.transition,
      outline: 'none',
    },
    
    filterButtonActive: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.primary,
      boxShadow: theme.shadows.card,
    },
    
    insightsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    
    insightCard: {
      padding: theme.spacing.md,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem',
      cursor: 'pointer',
      transition: theme.animations.transition,
      position: 'relative' as const,
      overflow: 'hidden',
    },
    
    insightHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    
    insightBadge: {
      padding: '0.25rem 0.5rem',
      borderRadius: theme.borderRadius.sm,
      fontSize: '0.75rem',
      fontWeight: theme.fontWeights.semibold,
    },
    
    insightContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
    },
    
    insightTitle: {
      fontSize: '0.875rem',
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textPrimary,
      margin: 0,
    },
    
    insightDescription: {
      fontSize: '0.75rem',
      color: theme.colors.textSecondary,
      lineHeight: '1.4',
      margin: 0,
    },
    
    insightFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    
    complianceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: theme.spacing.md,
    },
    
    complianceCard: {
      padding: theme.spacing.md,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
    },
    
    complianceHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    
    complianceTitle: {
      fontSize: '1rem',
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textPrimary,
      fontFamily: theme.fonts.heading,
      margin: 0,
    },
    
    complianceContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
    },
    
    complianceItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem',
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.borderRadius.md,
    },
    
    complianceItemLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    
    complianceItemRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    
    complianceProgress: {
      width: '80px',
      height: '6px',
      backgroundColor: theme.colors.borderLight,
      borderRadius: theme.borderRadius.full,
      overflow: 'hidden',
    },
    
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '200px',
      flexDirection: 'column' as const,
      gap: theme.spacing.md,
    },
    
    loadingSpinner: {
      width: '2rem',
      height: '2rem',
      border: `3px solid ${theme.colors.borderLight}`,
      borderTop: `3px solid ${theme.colors.primary}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    
    loadingText: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary,
      fontWeight: theme.fontWeights.medium,
    },
  };

  // Funciones de utilidad
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return theme.colors.error;
      case 'medium': return theme.colors.warning;
      default: return theme.colors.info;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <TrendingUp size={16} />;
      case 'simulation': return <BarChart3 size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 size={16} color={theme.colors.success} />;
      case 'warning': return <AlertCircle size={16} color={theme.colors.warning} />;
      case 'error': return <AlertTriangle size={16} color={theme.colors.error} />;
      default: return <Clock size={16} color={theme.colors.textSecondary} />;
    }
  };

  const handleSimulate = async (insight: AIInsight) => {
    setIsSimulating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSimulating(false);
    console.log('Simulando:', insight);
  };

  const generateDailyCEOBrief = () => {
    console.log('Generando Daily CEO Brief...');
  };

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.container}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}>
              <Brain size={24} color={theme.colors.textInverse} />
            </div>
            <div style={styles.headerContent}>
              <h2 style={styles.title}>IA & Predicciones</h2>
              <p style={styles.subtitle}>Inteligencia artificial avanzada con modelos predictivos y recomendaciones automáticas</p>
            </div>
          </div>
          
          <div style={styles.headerActions}>
            <div style={styles.filterContainer}>
              {['day', 'week', 'month', 'quarter'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  style={{
                    ...styles.filterButton,
                    ...(selectedPeriod === period ? styles.filterButtonActive : {})
                  }}
                >
                  {period === 'day' ? 'Día' : 
                   period === 'week' ? 'Semana' :
                   period === 'month' ? 'Mes' : 'Trimestre'}
                </button>
              ))}
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={onRefresh}
              loading={loading}
            >
              Actualizar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={onExport}
            >
              Exportar
            </Button>
          </div>
        </div>

        {/* Insights de IA */}
        <Card variant="default" style={{ marginBottom: theme.spacing.lg }}>
          <div style={{ padding: theme.spacing.md }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: theme.spacing.md 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <div style={{
                  padding: '0.5rem',
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: `${theme.colors.primary}20`,
                }}>
                  <Sparkles size={20} color={theme.colors.primary} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: theme.fontWeights.semibold,
                    color: theme.colors.textPrimary,
                    fontFamily: theme.fonts.heading,
                    margin: 0,
                  }}>
                    Insights de IA
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: theme.colors.textSecondary,
                    margin: 0,
                  }}>
                    Recomendaciones basadas en análisis predictivo
                  </p>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: theme.fontWeights.semibold,
                  color: theme.colors.textPrimary,
                }}>
                  3 insights activos
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: theme.colors.textSecondary,
                }}>
                  Última actualización: hace 2h
                </div>
              </div>
            </div>

            <div style={styles.insightsGrid}>
              {mockInsights.map((insight) => (
                <Card 
                  key={insight.id} 
                  variant="default" 
                  hover
                  style={{
                    border: selectedInsight?.id === insight.id 
                      ? `2px solid ${theme.colors.primary}` 
                      : undefined
                  }}
                >
                  <div 
                    style={styles.insightCard}
                    onClick={() => setSelectedInsight(
                      selectedInsight?.id === insight.id ? null : insight
                    )}
                  >
                    <div style={styles.insightHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          padding: '0.25rem',
                          borderRadius: theme.borderRadius.sm,
                          backgroundColor: `${getImpactColor(insight.impact)}20`,
                          color: getImpactColor(insight.impact),
                        }}>
                          {getTypeIcon(insight.type)}
                        </div>
                        <div style={{
                          ...styles.insightBadge,
                          backgroundColor: `${getImpactColor(insight.impact)}20`,
                          color: getImpactColor(insight.impact),
                        }}>
                          {insight.impact === 'high' ? 'Alto' : 
                           insight.impact === 'medium' ? 'Medio' : 'Bajo'}
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: theme.fontWeights.bold,
                          color: theme.colors.textPrimary,
                        }}>
                          {insight.confidence}%
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: theme.colors.textSecondary,
                        }}>
                          confianza
                        </div>
                      </div>
                    </div>
                    
                    <div style={styles.insightContent}>
                      <h4 style={styles.insightTitle}>{insight.title}</h4>
                      <p style={styles.insightDescription}>{insight.description}</p>
                    </div>
                    
                    <div style={styles.insightFooter}>
                      {insight.estimatedValue && (
                        <div style={{ fontSize: '0.75rem' }}>
                          <span style={{ color: theme.colors.textSecondary }}>Impacto: </span>
                          <span style={{ 
                            fontWeight: theme.fontWeights.semibold, 
                            color: theme.colors.textPrimary 
                          }}>
                            {insight.estimatedValue}
                          </span>
                        </div>
                      )}
                      
                      {insight.actionable && (
                        <Button
                          variant="primary"
                          size="sm"
                          icon={isSimulating ? undefined : Play}
                          loading={isSimulating}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSimulate(insight);
                          }}
                        >
                          {isSimulating ? 'Simulando...' : 'Simular'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Daily CEO Brief */}
            <div style={{
              padding: theme.spacing.md,
              backgroundColor: theme.colors.surfaceElevated,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.borderLight}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <div style={{
                  padding: '0.5rem',
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: `${theme.colors.primary}20`,
                }}>
                  <Download size={20} color={theme.colors.primary} />
                </div>
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: theme.fontWeights.semibold,
                    color: theme.colors.textPrimary,
                    margin: 0,
                  }}>
                    Daily CEO Brief
                  </h4>
                  <p style={{
                    fontSize: '0.875rem',
                    color: theme.colors.textSecondary,
                    margin: 0,
                  }}>
                    Resumen ejecutivo personalizado
                  </p>
                </div>
              </div>
              
              <Button
                variant="primary"
                size="sm"
                icon={Download}
                onClick={generateDailyCEOBrief}
              >
                Generar PDF
              </Button>
            </div>
          </div>
        </Card>

        {/* Indicador de Cumplimiento */}
        <Card variant="default">
          <div style={{ padding: theme.spacing.md }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: theme.spacing.md 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <div style={{
                  padding: '0.5rem',
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: `${theme.colors.success}20`,
                }}>
                  <Shield size={20} color={theme.colors.success} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: theme.fontWeights.semibold,
                    color: theme.colors.textPrimary,
                    fontFamily: theme.fonts.heading,
                    margin: 0,
                  }}>
                    Indicador de Cumplimiento
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: theme.colors.textSecondary,
                    margin: 0,
                  }}>
                    Estado de procesos críticos y seguridad
                  </p>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.success,
                  fontFamily: theme.fonts.heading,
                }}>
                  {overallCompliance}%
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: theme.colors.textSecondary,
                }}>
                  Cumplimiento general
                </div>
              </div>
            </div>

            <div style={styles.complianceContent}>
              {complianceMetrics.map((metric, index) => (
                <motion.div
                  key={metric.name}
                  style={styles.complianceItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div style={styles.complianceItemLeft}>
                    {getStatusIcon(metric.status)}
                    <div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: theme.fontWeights.semibold,
                        color: theme.colors.textPrimary,
                      }}>
                        {metric.name}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: theme.colors.textSecondary,
                      }}>
                        {metric.description}
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.complianceItemRight}>
                    <div style={styles.complianceProgress}>
                      <motion.div
                        style={{
                          height: '100%',
                          backgroundColor: metric.status === 'success' ? theme.colors.success :
                                          metric.status === 'warning' ? theme.colors.warning : theme.colors.error,
                          borderRadius: theme.borderRadius.full,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: theme.fontWeights.semibold,
                      color: theme.colors.textPrimary,
                      minWidth: '40px',
                      textAlign: 'right',
                    }}>
                      {metric.value}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Resumen de Cumplimiento */}
            <div style={{
              marginTop: theme.spacing.md,
              padding: theme.spacing.md,
              backgroundColor: `${theme.colors.success}10`,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.success}30`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <CheckCircle2 size={20} color={theme.colors.success} />
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: theme.fontWeights.semibold,
                    color: theme.colors.success,
                    margin: 0,
                  }}>
                    Estado de Cumplimiento: Excelente
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: theme.colors.textSecondary,
                    margin: 0,
                    marginTop: '0.25rem',
                  }}>
                    Todos los procesos críticos están funcionando correctamente. 
                    Próxima auditoría programada para el 15 de enero.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </>
  );
}