'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Target,
  BarChart3,
  Heart,
  Download,
  ArrowRight,
  Lightbulb,
  Shield,
  Star,
  Award,
  Gauge,
  RefreshCw,
  Settings,
  ChevronRight,
  Play,
  MoreVertical
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AIInsight } from '@/types/dashboard';

interface AIAnalysisData {
  overallMetrics: {
    totalSessions: number;
    averageImprovement: number;
    riskPatients: number;
    adherenceRate: number;
    satisfactionScore: number;
  };
  trendAnalysis: {
    improvementTrend: Array<{ month: string; improvement: number; sessions: number }>;
    emotionalStates: Array<{ session: string; before: number; after: number; improvement: number }>;
    interventionEffectiveness: Array<{ intervention: string; successRate: number; usage: number }>;
  };
  predictions: {
    riskPredictions: Array<{ patientId: string; riskLevel: number; factors: string[] }>;
    outcomeForecasts: Array<{ timeframe: string; expectedImprovement: number; confidence: number }>;
    capacityOptimization: Array<{ day: string; recommendedSessions: number; currentSessions: number }>;
  };
  insights: AIInsight[];
  recommendations: Array<{
    id: string;
    type: 'clinical' | 'operational' | 'financial';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
    effort: string;
    timeline: string;
  }>;
}

export default function AISessionsPage() {
  const [analysisData, setAnalysisData] = useState<AIAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedView, setSelectedView] = useState<'overview' | 'trends' | 'predictions' | 'insights'>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPatientRisk, setSelectedPatientRisk] = useState<string | null>(null);

  // Mock data para desarrollo
  useEffect(() => {
    const loadAnalysisData = async () => {
      setLoading(true);
      
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockData: AIAnalysisData = {
        overallMetrics: {
          totalSessions: 247,
          averageImprovement: 68.5,
          riskPatients: 12,
          adherenceRate: 87.3,
          satisfactionScore: 4.6
        },
        trendAnalysis: {
          improvementTrend: [
            { month: 'Ene', improvement: 62, sessions: 45 },
            { month: 'Feb', improvement: 65, sessions: 52 },
            { month: 'Mar', improvement: 68, sessions: 58 },
            { month: 'Abr', improvement: 71, sessions: 62 },
            { month: 'May', improvement: 69, sessions: 55 },
            { month: 'Jun', improvement: 73, sessions: 67 }
          ],
          emotionalStates: [
            { session: 'S1', before: 8, after: 5, improvement: 37.5 },
            { session: 'S2', before: 7, after: 4, improvement: 42.8 },
            { session: 'S3', before: 9, after: 6, improvement: 33.3 },
            { session: 'S4', before: 6, after: 3, improvement: 50.0 },
            { session: 'S5', before: 8, after: 4, improvement: 50.0 }
          ],
          interventionEffectiveness: [
            { intervention: 'TCC', successRate: 85, usage: 45 },
            { intervention: 'Mindfulness', successRate: 78, usage: 32 },
            { intervention: 'EMDR', successRate: 92, usage: 18 },
            { intervention: 'Terapia Familiar', successRate: 73, usage: 25 },
            { intervention: 'Exposición', successRate: 88, usage: 22 }
          ]
        },
        predictions: {
          riskPredictions: [
            { patientId: 'P001', riskLevel: 85, factors: ['Faltas frecuentes', 'Deterioro emocional', 'Falta de apoyo familiar'] },
            { patientId: 'P002', riskLevel: 72, factors: ['Resistencia al tratamiento', 'Comorbilidad'] },
            { patientId: 'P003', riskLevel: 68, factors: ['Estrés financiero', 'Cambios vitales'] }
          ],
          outcomeForecasts: [
            { timeframe: '1 mes', expectedImprovement: 15, confidence: 87 },
            { timeframe: '3 meses', expectedImprovement: 35, confidence: 82 },
            { timeframe: '6 meses', expectedImprovement: 58, confidence: 75 }
          ],
          capacityOptimization: [
            { day: 'Lun', recommendedSessions: 12, currentSessions: 8 },
            { day: 'Mar', recommendedSessions: 14, currentSessions: 11 },
            { day: 'Mié', recommendedSessions: 13, currentSessions: 15 },
            { day: 'Jue', recommendedSessions: 15, currentSessions: 12 },
            { day: 'Vie', recommendedSessions: 11, currentSessions: 9 }
          ]
        },
        insights: [
          {
            id: '1',
            type: 'recommendation',
            title: 'Optimización de Horarios',
            description: 'Los miércoles muestran sobrecarga mientras que los lunes tienen capacidad disponible. Redistribuir citas podría mejorar la eficiencia en un 23%.',
            confidence: 0.89,
            impact: 'high',
            timeframe: '2 semanas',
            actionable: true,
            category: 'operational',
            createdAt: new Date()
          },
          {
            id: '2',
            type: 'alert',
            title: 'Pacientes en Riesgo',
            description: '3 pacientes muestran patrones de deterioro emocional. Se recomienda intervención inmediata y seguimiento intensivo.',
            confidence: 0.94,
            impact: 'high',
            timeframe: 'Inmediato',
            actionable: true,
            category: 'clinical',
            createdAt: new Date()
          },
          {
            id: '3',
            type: 'prediction',
            title: 'Tendencia de Mejora',
            description: 'El modelo predice un incremento del 12% en las tasas de mejora si se implementan las técnicas de mindfulness recomendadas.',
            confidence: 0.76,
            impact: 'medium',
            timeframe: '1 mes',
            actionable: true,
            category: 'clinical',
            createdAt: new Date()
          }
        ],
        recommendations: [
          {
            id: '1',
            type: 'clinical',
            priority: 'high',
            title: 'Implementar Protocolo de Mindfulness',
            description: 'Integrar técnicas de mindfulness en sesiones de ansiedad para mejorar resultados en un 15%',
            impact: 'Alto - Mejora significativa en outcomes',
            effort: 'Medio - Requiere formación del equipo',
            timeline: '2-4 semanas'
          },
          {
            id: '2',
            type: 'operational',
            priority: 'high',
            title: 'Redistribuir Carga de Trabajo',
            description: 'Optimizar horarios para reducir sobrecarga en días pico y mejorar utilización de recursos',
            impact: 'Medio - Mejora eficiencia operativa',
            effort: 'Bajo - Ajuste de calendario',
            timeline: '1 semana'
          },
          {
            id: '3',
            type: 'financial',
            priority: 'medium',
            title: 'Programa de Retención',
            description: 'Implementar seguimiento proactivo para pacientes con riesgo de abandono',
            impact: 'Alto - Reduce churn en 25%',
            effort: 'Alto - Sistema de alertas automático',
            timeline: '4-6 semanas'
          }
        ]
      };
      
      setAnalysisData(mockData);
      setLoading(false);
    };

    loadAnalysisData();
  }, [selectedTimeframe]);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <TrendingUp size={20} />;
      case 'recommendation': return <Lightbulb size={20} />;
      case 'alert': return <AlertTriangle size={20} />;
      default: return <Brain size={20} />;
    }
  };

  const getInsightColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#F9FAFB'
      }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              width: '64px',
              height: '64px',
              border: '4px solid #E5E7EB',
              borderTop: '4px solid #7C3AED',
              borderRadius: '50%',
              margin: '0 auto 2rem'
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}
          >
            <Brain size={24} color="#7C3AED" />
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1F2937',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Analizando Sesiones con IA
            </h2>
          </motion.div>
          <p style={{
            fontSize: '1rem',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            Procesando datos y generando insights...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#F9FAFB',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#7C3AED',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain size={32} color="white" />
            </div>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#1F2937',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Análisis IA de Sesiones
              </h1>
              <p style={{
                fontSize: '1.125rem',
                color: '#6B7280',
                margin: '0.5rem 0 0 0',
                fontFamily: 'Inter, sans-serif'
              }}>
                Insights inteligentes y predicciones basadas en datos clínicos
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                backgroundColor: 'white'
              }}
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="1y">Último año</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: isAnalyzing ? '#9CA3AF' : '#7C3AED',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {isAnalyzing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw size={18} />
                  </motion.div>
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Ejecutar Análisis
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB'
        }}>
          {[
            { id: 'overview', label: 'Resumen', icon: <BarChart3 size={18} /> },
            { id: 'trends', label: 'Tendencias', icon: <TrendingUp size={18} /> },
            { id: 'predictions', label: 'Predicciones', icon: <Target size={18} /> },
            { id: 'insights', label: 'Insights', icon: <Lightbulb size={18} /> }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as 'overview' | 'trends' | 'predictions' | 'insights')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                border: 'none',
                backgroundColor: selectedView === tab.id ? '#7C3AED' : 'transparent',
                color: selectedView === tab.id ? 'white' : '#6B7280',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Content based on selected view */}
      <AnimatePresence mode="wait">
        {selectedView === 'overview' && analysisData && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Métricas principales */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  padding: '2rem',
                  backgroundColor: 'white',
                  borderRadius: '1.5rem',
                  border: '1px solid #E5E7EB',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #7C3AED, #EC4899)'
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#EDE9FE',
                    borderRadius: '1rem'
                  }}>
                    <Users size={24} color="#7C3AED" />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#6B7280',
                      margin: 0,
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Total Sesiones
                    </h3>
                    <p style={{
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      color: '#1F2937',
                      margin: 0,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      {analysisData.overallMetrics.totalSessions}
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#10B981',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <TrendingUp size={16} />
                  +12% vs mes anterior
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  padding: '2rem',
                  backgroundColor: 'white',
                  borderRadius: '1.5rem',
                  border: '1px solid #E5E7EB',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #10B981, #059669)'
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#ECFDF5',
                    borderRadius: '1rem'
                  }}>
                    <TrendingUp size={24} color="#10B981" />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#6B7280',
                      margin: 0,
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Mejora Promedio
                    </h3>
                    <p style={{
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      color: '#1F2937',
                      margin: 0,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      {analysisData.overallMetrics.averageImprovement}%
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#10B981',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <CheckCircle size={16} />
                  Excelente rendimiento
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  padding: '2rem',
                  backgroundColor: 'white',
                  borderRadius: '1.5rem',
                  border: '1px solid #E5E7EB',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #EF4444, #DC2626)'
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#FEF2F2',
                    borderRadius: '1rem'
                  }}>
                    <AlertTriangle size={24} color="#EF4444" />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#6B7280',
                      margin: 0,
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Pacientes en Riesgo
                    </h3>
                    <p style={{
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      color: '#1F2937',
                      margin: 0,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      {analysisData.overallMetrics.riskPatients}
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#EF4444',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <Shield size={16} />
                  Requiere atención
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  padding: '2rem',
                  backgroundColor: 'white',
                  borderRadius: '1.5rem',
                  border: '1px solid #E5E7EB',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #F59E0B, #D97706)'
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#FFFBEB',
                    borderRadius: '1rem'
                  }}>
                    <Star size={24} color="#F59E0B" />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#6B7280',
                      margin: 0,
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Satisfacción
                    </h3>
                    <p style={{
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      color: '#1F2937',
                      margin: 0,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      {analysisData.overallMetrics.satisfactionScore}
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#F59E0B',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <Award size={16} />
                  Muy satisfactorio
                </div>
              </motion.div>
            </div>

            {/* Gráfico de efectividad de intervenciones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '1.5rem',
                border: '1px solid #E5E7EB',
                padding: '2rem',
                marginBottom: '2rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#1F2937',
                    margin: 0,
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    Efectividad de Intervenciones
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: '#6B7280',
                    margin: '0.5rem 0 0 0',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Análisis de éxito por tipo de intervención terapéutica
                  </p>
                </div>
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#EDE9FE',
                  borderRadius: '1rem'
                }}>
                  <BarChart3 size={24} color="#7C3AED" />
                </div>
              </div>
              
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysisData.trendAnalysis.interventionEffectiveness}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis 
                      dataKey="intervention" 
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.75rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="successRate" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedView === 'trends' && analysisData && (
          <motion.div
            key="trends"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tendencia de mejora */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '1.5rem',
                border: '1px solid #E5E7EB',
                padding: '2rem',
                marginBottom: '2rem'
              }}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1F2937',
                marginBottom: '2rem',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Tendencia de Mejora Mensual
              </h3>
              
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analysisData.trendAnalysis.improvementTrend}>
                    <defs>
                      <linearGradient id="improvementGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.75rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="improvement"
                      stroke="#7C3AED"
                      strokeWidth={3}
                      fill="url(#improvementGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Estados emocionales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '1.5rem',
                border: '1px solid #E5E7EB',
                padding: '2rem'
              }}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1F2937',
                marginBottom: '2rem',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Evolución Estados Emocionales
              </h3>
              
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysisData.trendAnalysis.emotionalStates}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis 
                      dataKey="session" 
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                      domain={[0, 10]}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.75rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="before" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      name="Estado Inicial"
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="after" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="Estado Final"
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedView === 'predictions' && analysisData && (
          <motion.div
            key="predictions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem'
            }}>
              {/* Predicciones de riesgo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1.5rem',
                  border: '1px solid #E5E7EB',
                  padding: '2rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#FEF2F2',
                    borderRadius: '1rem'
                  }}>
                    <AlertTriangle size={24} color="#EF4444" />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#1F2937',
                      margin: 0,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      Predicciones de Riesgo
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      margin: '0.25rem 0 0 0',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Pacientes con mayor probabilidad de abandono
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {analysisData.predictions.riskPredictions.map((prediction, index) => (
                    <motion.div
                      key={prediction.patientId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        padding: '1.5rem',
                        backgroundColor: '#FEF2F2',
                        borderRadius: '1rem',
                        border: '1px solid #FECACA',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedPatientRisk(
                        selectedPatientRisk === prediction.patientId ? null : prediction.patientId
                      )}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '3rem',
                            height: '3rem',
                            backgroundColor: '#EF4444',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 700,
                            fontFamily: 'Space Grotesk, sans-serif'
                          }}>
                            {prediction.riskLevel}%
                          </div>
                          <div>
                            <h4 style={{
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: '#1F2937',
                              margin: 0,
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Paciente {prediction.patientId}
                            </h4>
                            <p style={{
                              fontSize: '0.875rem',
                              color: '#EF4444',
                              margin: '0.25rem 0 0 0',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Riesgo Alto
                            </p>
                          </div>
                        </div>
                        <ChevronRight 
                          size={20} 
                          color="#6B7280"
                          style={{
                            transform: selectedPatientRisk === prediction.patientId ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }}
                        />
                      </div>

                      <AnimatePresence>
                        {selectedPatientRisk === prediction.patientId && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{
                              paddingTop: '1rem',
                              borderTop: '1px solid #FECACA'
                            }}>
                              <h5 style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#374151',
                                marginBottom: '0.5rem',
                                fontFamily: 'Inter, sans-serif'
                              }}>
                                Factores de Riesgo:
                              </h5>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {prediction.factors.map((factor, idx) => (
                                  <span
                                    key={idx}
                                    style={{
                                      padding: '0.25rem 0.75rem',
                                      backgroundColor: '#FEE2E2',
                                      color: '#DC2626',
                                      borderRadius: '1rem',
                                      fontSize: '0.75rem',
                                      fontWeight: 500,
                                      fontFamily: 'Inter, sans-serif'
                                    }}
                                  >
                                    {factor}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Pronósticos de resultados */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1.5rem',
                  border: '1px solid #E5E7EB',
                  padding: '2rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#EDE9FE',
                    borderRadius: '1rem'
                  }}>
                    <Target size={24} color="#7C3AED" />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#1F2937',
                      margin: 0,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      Pronósticos de Mejora
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      margin: '0.25rem 0 0 0',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Expectativas de evolución clínica
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {analysisData.predictions.outcomeForecasts.map((forecast, index) => (
                    <motion.div
                      key={forecast.timeframe}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        padding: '1.5rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '1rem',
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: '#1F2937',
                          margin: 0,
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {forecast.timeframe}
                        </h4>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          backgroundColor: '#EDE9FE',
                          borderRadius: '1rem'
                        }}>
                          <Gauge size={16} color="#7C3AED" />
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#7C3AED',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {forecast.confidence}% confianza
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          fontSize: '2rem',
                          fontWeight: 700,
                          color: '#10B981',
                          fontFamily: 'Space Grotesk, sans-serif'
                        }}>
                          +{forecast.expectedImprovement}%
                        </div>
                        <div style={{
                          flex: 1,
                          height: '0.5rem',
                          backgroundColor: '#E5E7EB',
                          borderRadius: '0.25rem',
                          overflow: 'hidden'
                        }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${forecast.expectedImprovement}%` }}
                            transition={{ duration: 1.5, delay: index * 0.2 }}
                            style={{
                              height: '100%',
                              backgroundColor: '#10B981',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Optimización de capacidad */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '1.5rem',
                border: '1px solid #E5E7EB',
                padding: '2rem',
                marginTop: '2rem'
              }}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1F2937',
                marginBottom: '2rem',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Optimización de Capacidad Semanal
              </h3>
              
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysisData.predictions.capacityOptimization}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.75rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="currentSessions" fill="#94A3B8" name="Sesiones Actuales" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="recommendedSessions" fill="#7C3AED" name="Sesiones Recomendadas" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedView === 'insights' && analysisData && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem'
            }}>
              {/* Insights de IA */}
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  marginBottom: '1.5rem',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Insights Inteligentes
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {analysisData.insights.map((insight, index) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        padding: '2rem',
                        backgroundColor: 'white',
                        borderRadius: '1.5rem',
                        border: '1px solid #E5E7EB',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        backgroundColor: getInsightColor(insight.impact)
                      }} />
                      
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                          padding: '0.75rem',
                          backgroundColor: `${getInsightColor(insight.impact)}20`,
                          borderRadius: '1rem',
                          color: getInsightColor(insight.impact)
                        }}>
                          {getInsightIcon(insight.type)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h4 style={{
                              fontSize: '1.125rem',
                              fontWeight: 600,
                              color: '#1F2937',
                              margin: 0,
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {insight.title}
                            </h4>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: `${getInsightColor(insight.impact)}20`,
                              color: getInsightColor(insight.impact),
                              borderRadius: '1rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {insight.impact === 'high' ? 'Alto Impacto' : 
                               insight.impact === 'medium' ? 'Medio Impacto' : 'Bajo Impacto'}
                            </span>
                          </div>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#6B7280',
                            lineHeight: 1.6,
                            margin: 0,
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {insight.description}
                          </p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            color: '#6B7280',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            <Gauge size={16} />
                            {Math.round(insight.confidence * 100)}% confianza
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            color: '#6B7280',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            <Clock size={16} />
                            {insight.timeframe}
                          </div>
                        </div>
                        
                        {insight.actionable && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.5rem 1rem',
                              backgroundColor: getInsightColor(insight.impact),
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            <ArrowRight size={16} />
                            Actuar
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recomendaciones */}
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  marginBottom: '1.5rem',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Recomendaciones Estratégicas
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {analysisData.recommendations.map((recommendation, index) => (
                    <motion.div
                      key={recommendation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        padding: '2rem',
                        backgroundColor: 'white',
                        borderRadius: '1.5rem',
                        border: '1px solid #E5E7EB',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        backgroundColor: getPriorityColor(recommendation.priority)
                      }} />
                      
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{
                          padding: '0.75rem',
                          backgroundColor: `${getPriorityColor(recommendation.priority)}20`,
                          borderRadius: '1rem'
                        }}>
                          {recommendation.type === 'clinical' && <Heart size={20} color={getPriorityColor(recommendation.priority)} />}
                          {recommendation.type === 'operational' && <Settings size={20} color={getPriorityColor(recommendation.priority)} />}
                          {recommendation.type === 'financial' && <TrendingUp size={20} color={getPriorityColor(recommendation.priority)} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h4 style={{
                              fontSize: '1.125rem',
                              fontWeight: 600,
                              color: '#1F2937',
                              margin: 0,
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {recommendation.title}
                            </h4>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: `${getPriorityColor(recommendation.priority)}20`,
                              color: getPriorityColor(recommendation.priority),
                              borderRadius: '1rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {recommendation.priority === 'high' ? 'Alta Prioridad' : 
                               recommendation.priority === 'medium' ? 'Media Prioridad' : 'Baja Prioridad'}
                            </span>
                          </div>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#6B7280',
                            lineHeight: 1.6,
                            margin: 0,
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {recommendation.description}
                          </p>
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                      }}>
                        <div style={{
                          padding: '1rem',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '0.75rem',
                          border: '1px solid #E2E8F0'
                        }}>
                          <h5 style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6B7280',
                            marginBottom: '0.5rem',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            IMPACTO
                          </h5>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#1F2937',
                            margin: 0,
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {recommendation.impact}
                          </p>
                        </div>
                        
                        <div style={{
                          padding: '1rem',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '0.75rem',
                          border: '1px solid #E2E8F0'
                        }}>
                          <h5 style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6B7280',
                            marginBottom: '0.5rem',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            ESFUERZO
                          </h5>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#1F2937',
                            margin: 0,
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {recommendation.effort}
                          </p>
                        </div>
                        
                        <div style={{
                          padding: '1rem',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '0.75rem',
                          border: '1px solid #E2E8F0'
                        }}>
                          <h5 style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6B7280',
                            marginBottom: '0.5rem',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            TIMELINE
                          </h5>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#1F2937',
                            margin: 0,
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {recommendation.timeline}
                          </p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: getPriorityColor(recommendation.priority),
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          <Play size={16} />
                          Implementar
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            padding: '0.75rem',
                            backgroundColor: '#F3F4F6',
                            border: '1px solid #E5E7EB',
                            borderRadius: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          <MoreVertical size={16} color="#6B7280" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 50
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => console.log('Exportar análisis')}
          style={{
            width: '4rem',
            height: '4rem',
            backgroundColor: '#7C3AED',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.4)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Download size={24} />
        </motion.button>
      </motion.div>

      {/* Background Effects */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: -1,
        background: 'radial-gradient(circle at 20% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
        opacity: 0.5
      }} />
    </div>
  );
}
