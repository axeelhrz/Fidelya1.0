'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Download,
  ArrowRight,
  X,
} from 'lucide-react';
// TODO: Replace the following import with the correct path where Assessment and Patient are exported
// import { Assessment, Patient } from '@/types/clinical';

// Temporary type definitions (replace with your actual types)
type Assessment = {
  testName: string;
  date: string | Date;
  score: number;
  status: string;
  percentile?: number;
};

type Patient = {
  firstName: string;
  lastName: string;
};

interface AssessmentComparisonProps {
  patient: Patient;
  assessments: Assessment[];
  onClose: () => void;
}

interface ComparisonData {
  testName: string;
  baseline: Assessment;
  latest: Assessment;
  change: number;
  percentChange: number;
  isImprovement: boolean;
  sessions: number;
  timespan: number; // days
}

export function AssessmentComparison({
  patient,
  assessments,
  onClose
}: AssessmentComparisonProps) {
  const [comparisonType, setComparisonType] = useState<'pre-post' | 'timeline' | 'percentile'>('pre-post');
  const [timeframe, setTimeframe] = useState<'all' | '3months' | '6months' | '1year'>('all');

  const comparisonData = useMemo(() => {
    const testGroups = assessments.reduce((groups, assessment) => {
      if (!groups[assessment.testName]) {
        groups[assessment.testName] = [];
      }
      groups[assessment.testName].push(assessment);
      return groups;
    }, {} as { [key: string]: Assessment[] });

    const comparisons: ComparisonData[] = [];

    Object.entries(testGroups).forEach(([testName, testAssessments]) => {
      if (testAssessments.length < 2) return;

      const sortedAssessments = testAssessments
        .filter(a => a.status === 'completed')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (sortedAssessments.length < 2) return;

      const baseline = sortedAssessments[0];
      const latest = sortedAssessments[sortedAssessments.length - 1];
      
      const change = latest.score - baseline.score;
      const percentChange = Math.abs((change / baseline.score) * 100);
      
      // For depression/anxiety tests, lower scores are better
      const isImprovement = testName.toLowerCase().includes('depression') || 
                           testName.toLowerCase().includes('anxiety') || 
                           testName.toLowerCase().includes('phq') || 
                           testName.toLowerCase().includes('gad')
                           ? change < 0 
                           : change > 0;

      const timespan = Math.floor(
        (new Date(latest.date).getTime() - new Date(baseline.date).getTime()) / (1000 * 60 * 60 * 24)
      );

      comparisons.push({
        testName,
        baseline,
        latest,
        change: Math.abs(change),
        percentChange: Math.round(percentChange),
        isImprovement,
        sessions: sortedAssessments.length,
        timespan
      });
    });

    return comparisons.sort((a, b) => b.percentChange - a.percentChange);
  }, [assessments]);

  const filteredComparisons = useMemo(() => {
    let filtered = comparisonData;

    if (timeframe !== 'all') {
      const cutoffDate = new Date();
      const days = timeframe === '3months' ? 90 : timeframe === '6months' ? 180 : 365;
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filtered = filtered.filter(comp => new Date(comp.latest.date) >= cutoffDate);
    }

    return filtered;
  }, [comparisonData, timeframe]);
  const overallStats = useMemo(() => {
    if (filteredComparisons.length === 0) return null;

    const improvements = filteredComparisons.filter(comp => comp.isImprovement).length;
    const deteriorations = filteredComparisons.filter(comp => !comp.isImprovement).length;
    const avgChange = filteredComparisons.reduce((sum, comp) => sum + comp.percentChange, 0) / filteredComparisons.length;
    const avgTimespan = filteredComparisons.reduce((sum, comp) => sum + comp.timespan, 0) / filteredComparisons.length;

    return {
      improvements,
      deteriorations,
      improvementRate: Math.round((improvements / filteredComparisons.length) * 100),
      avgChange: Math.round(avgChange),
      avgTimespan: Math.round(avgTimespan)
    };
  }, [filteredComparisons]);

  const getScoreInterpretation = (score: number, testName: string) => {
    const interpretations: { [key: string]: { ranges: Array<{ min: number; max: number; label: string; color: string }> } } = {
      'phq-9': {
        ranges: [
          { min: 0, max: 4, label: 'Mínima', color: '#10B981' },
          { min: 5, max: 9, label: 'Leve', color: '#F59E0B' },
          { min: 10, max: 14, label: 'Moderada', color: '#EF4444' },
          { min: 15, max: 19, label: 'Moderadamente severa', color: '#DC2626' },
          { min: 20, max: 27, label: 'Severa', color: '#991B1B' }
        ]
      },
      'gad-7': {
        ranges: [
          { min: 0, max: 4, label: 'Mínima', color: '#10B981' },
          { min: 5, max: 9, label: 'Leve', color: '#F59E0B' },
          { min: 10, max: 14, label: 'Moderada', color: '#EF4444' },
          { min: 15, max: 21, label: 'Severa', color: '#DC2626' }
        ]
      }
    };

    const testKey = testName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const testRanges = interpretations[testKey];
    if (!testRanges) return { label: 'No disponible', color: '#6B7280' };

    const range = testRanges.ranges.find(r => score >= r.min && score <= r.max);
    return range || { label: 'Fuera de rango', color: '#6B7280' };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Comparación de Evaluaciones
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Análisis de progreso para {patient.firstName} {patient.lastName}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#6366F1',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <Download size={16} />
              Exportar Reporte
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                padding: '0.5rem',
                backgroundColor: '#F3F4F6',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <X size={16} color="#6B7280" />
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#F9FAFB',
          borderRadius: '0.75rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.25rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Tipo de Comparación
            </label>
            <select
              value={comparisonType}
              onChange={(e) => setComparisonType(e.target.value as 'pre-post' | 'timeline' | 'percentile')}
              style={{
                padding: '0.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="pre-post">Pre/Post Tratamiento</option>
              <option value="timeline">Línea de Tiempo</option>
              <option value="percentile">Percentiles</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.25rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Período de Tiempo
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as 'all' | '3months' | '6months' | '1year')}
              style={{
                padding: '0.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="all">Todo el período</option>
              <option value="3months">Últimos 3 meses</option>
              <option value="6months">Últimos 6 meses</option>
              <option value="1year">Último año</option>
            </select>
          </div>
        </div>

        {/* Overall Stats */}
        {overallStats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#F0FDF4',
              borderRadius: '0.75rem',
              border: '1px solid #BBF7D0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <TrendingUp size={20} color="#16A34A" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#15803D',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Mejoras
                </span>
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#16A34A',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {overallStats.improvements}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#166534',
                fontFamily: 'Inter, sans-serif'
              }}>
                {overallStats.improvementRate}% de las evaluaciones
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#FEF2F2',
              borderRadius: '0.75rem',
              border: '1px solid #FECACA'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <TrendingDown size={20} color="#DC2626" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#991B1B',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Deterioros
                </span>
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#DC2626',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {overallStats.deteriorations}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#991B1B',
                fontFamily: 'Inter, sans-serif'
              }}>
                {100 - overallStats.improvementRate}% de las evaluaciones
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#EFF6FF',
              borderRadius: '0.75rem',
              border: '1px solid #DBEAFE'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <BarChart3 size={20} color="#2563EB" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#1E40AF',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Cambio Promedio
                </span>
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#2563EB',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {overallStats.avgChange}%
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#1E3A8A',
                fontFamily: 'Inter, sans-serif'
              }}>
                En {overallStats.avgTimespan} días promedio
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#F0F9FF',
              borderRadius: '0.75rem',
              border: '1px solid #E0F2FE'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <Calendar size={20} color="#0369A1" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#0C4A6E',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Evaluaciones
                </span>
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#0369A1',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {filteredComparisons.length}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#0C4A6E',
                fontFamily: 'Inter, sans-serif'
              }}>
                Tests comparables
              </div>
            </div>
          </div>
        )}

        {/* Comparisons List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {filteredComparisons.map((comparison, index) => {
            const baselineInterpretation = getScoreInterpretation(comparison.baseline.score, comparison.testName);
            const latestInterpretation = getScoreInterpretation(comparison.latest.score, comparison.testName);

            return (
              <motion.div
                key={comparison.testName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  padding: '2rem',
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}
              >
                {/* Test Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '2rem'
                }}>
                  <div>
                    <h4 style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#1F2937',
                      margin: 0,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      {comparison.testName}
                    </h4>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      margin: '0.25rem 0 0 0',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {comparison.sessions} evaluaciones • {comparison.timespan} días de seguimiento
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: comparison.isImprovement ? '#F0FDF4' : '#FEF2F2',
                    borderRadius: '0.75rem',
                    border: `1px solid ${comparison.isImprovement ? '#BBF7D0' : '#FECACA'}`
                  }}>
                    {comparison.isImprovement ? (
                      <TrendingUp size={20} color="#16A34A" />
                    ) : (
                      <TrendingDown size={20} color="#DC2626" />
                    )}
                    <div>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: comparison.isImprovement ? '#16A34A' : '#DC2626',
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}>
                        {comparison.percentChange}%
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: comparison.isImprovement ? '#15803D' : '#991B1B',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {comparison.isImprovement ? 'Mejora' : 'Deterioro'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Comparison */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: '2rem',
                  alignItems: 'center'
                }}>
                  {/* Baseline Score */}
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '0.75rem',
                    border: '1px solid #E5E7EB',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Evaluación Inicial
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginBottom: '1rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {new Date(comparison.baseline.date).toLocaleDateString('es-ES')}
                    </div>
                    <div style={{
                      fontSize: '3rem',
                      fontWeight: 700,
                      color: baselineInterpretation.color,
                      marginBottom: '0.5rem',
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      {comparison.baseline.score}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: baselineInterpretation.color,
                      marginBottom: '0.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {baselineInterpretation.label}
                    </div>
                    {comparison.baseline.percentile && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Percentil {comparison.baseline.percentile}
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <ArrowRight size={24} color="#6B7280" />
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      textAlign: 'center',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {comparison.change} puntos
                    </div>
                  </div>

                  {/* Latest Score */}
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: comparison.isImprovement ? '#F0FDF4' : '#FEF2F2',
                    borderRadius: '0.75rem',
                    border: `1px solid ${comparison.isImprovement ? '#BBF7D0' : '#FECACA'}`,
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Evaluación Actual
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginBottom: '1rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {new Date(comparison.latest.date).toLocaleDateString('es-ES')}
                    </div>
                    <div style={{
                      fontSize: '3rem',
                      fontWeight: 700,
                      color: latestInterpretation.color,
                      marginBottom: '0.5rem',
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      {comparison.latest.score}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: latestInterpretation.color,
                      marginBottom: '0.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {latestInterpretation.label}
                    </div>
                    {comparison.latest.percentile && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Percentil {comparison.latest.percentile}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                  marginTop: '2rem',
                  padding: '1rem',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '0.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Progreso del Tratamiento
                    </span>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: comparison.isImprovement ? '#16A34A' : '#DC2626',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {comparison.isImprovement ? '+' : '-'}{comparison.percentChange}%
                    </span>
                  </div>
                  
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(comparison.percentChange, 100)}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      style={{
                        height: '100%',
                        backgroundColor: comparison.isImprovement ? '#16A34A' : '#DC2626',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>

                {/* Clinical Interpretation */}
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#EFF6FF',
                  borderRadius: '0.5rem',
                  border: '1px solid #DBEAFE'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <Target size={16} color="#2563EB" />
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1E40AF',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Interpretación Clínica
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#1E3A8A',
                    margin: 0,
                    lineHeight: '1.5',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {comparison.isImprovement ? (
                      `El paciente muestra una mejora significativa del ${comparison.percentChange}% en ${comparison.testName.toLowerCase()}. 
                       La puntuación ha disminuido de ${comparison.baseline.score} (${baselineInterpretation.label.toLowerCase()}) 
                       a ${comparison.latest.score} (${latestInterpretation.label.toLowerCase()}) durante ${comparison.timespan} días de tratamiento.`
                    ) : (
                      `Se observa un deterioro del ${comparison.percentChange}% en ${comparison.testName.toLowerCase()}. 
                       La puntuación ha aumentado de ${comparison.baseline.score} (${baselineInterpretation.label.toLowerCase()}) 
                       a ${comparison.latest.score} (${latestInterpretation.label.toLowerCase()}). Se recomienda revisar el plan de tratamiento.`
                    )}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* No Data Message */}
        {filteredComparisons.length === 0 && (
          <div style={{
            padding: '3rem',
            backgroundColor: '#F9FAFB',
            borderRadius: '0.75rem',
            border: '1px dashed #E5E7EB',
            textAlign: 'center'
          }}>
            <BarChart3 size={48} color="#9CA3AF" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 0.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              No hay datos suficientes para comparar
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Se necesitan al menos 2 evaluaciones completadas del mismo test para realizar comparaciones.
            </p>
          </div>
        )}

        {/* Clinical Recommendations */}
        {overallStats && overallStats.improvements > 0 && (
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#F0FDF4',
            borderRadius: '0.75rem',
            border: '1px solid #BBF7D0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Award size={20} color="#16A34A" />
              <h4 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#15803D',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Recomendaciones Clínicas
              </h4>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {overallStats.improvementRate >= 75 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#166534',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <CheckCircle size={16} color="#16A34A" />
                  <span>Excelente progreso terapéutico. Considerar espaciar las sesiones o avanzar a objetivos más complejos.</span>
                </div>
              )}
              
              {overallStats.improvementRate >= 50 && overallStats.improvementRate < 75 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#166534',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <Target size={16} color="#16A34A" />
                  <span>Progreso satisfactorio. Mantener el enfoque terapéutico actual y monitorear evolución.</span>
                </div>
              )}
              
              {overallStats.improvementRate < 50 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#991B1B',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <AlertTriangle size={16} color="#DC2626" />
                  <span>Progreso limitado. Revisar plan de tratamiento y considerar ajustes en la intervención.</span>
                </div>
              )}
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#166534',
                fontFamily: 'Inter, sans-serif'
              }}>
                <Calendar size={16} color="#16A34A" />
                <span>Próxima evaluación recomendada en 4-6 semanas para monitorear continuidad del progreso.</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
