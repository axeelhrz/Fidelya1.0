'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BarChart3,
  Activity,
  Calendar,
  Target,
  Download,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  UserCheck,
  UserPlus,
  Award,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart as RechartsPieChart, 
  Cell,
} from 'recharts';
import { useStyles } from '@/lib/useStyles';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface PatientAnalytics {
  totalPatients: number;
  activePatients: number;
  newPatients: number;
  dischargedPatients: number;
  averageAge: number;
  genderDistribution: { male: number; female: number; other: number };
  riskDistribution: { low: number; medium: number; high: number; critical: number };
  diagnosisDistribution: { [key: string]: number };
  therapistWorkload: { [therapist: string]: number };
  sessionMetrics: {
    averageSessionsPerPatient: number;
    totalSessions: number;
    completionRate: number;
    noShowRate: number;
  };
  outcomeMetrics: {
    averagePhq9Improvement: number;
    averageGad7Improvement: number;
    improvementRate: number;
    recoveryRate: number;
  };
  monthlyTrends: Array<{
    month: string;
    newPatients: number;
    activePatients: number;
    dischargedPatients: number;
    averagePhq9: number;
    averageGad7: number;
  }>;
  ageGroups: Array<{
    group: string;
    count: number;
    percentage: number;
  }>;
  treatmentDuration: Array<{
    duration: string;
    count: number;
    percentage: number;
  }>;
}

export default function PatientsAnalyticsPage() {
  const { theme } = useStyles();
  const [analytics, setAnalytics] = useState<PatientAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('patients');

  // Mock data para desarrollo
  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockAnalytics: PatientAnalytics = {
        totalPatients: 247,
        activePatients: 189,
        newPatients: 23,
        dischargedPatients: 35,
        averageAge: 34.5,
        genderDistribution: { male: 89, female: 142, other: 16 },
        riskDistribution: { low: 98, medium: 87, high: 45, critical: 17 },
        diagnosisDistribution: {
          'Trastorno de Ansiedad Generalizada': 67,
          'Episodio Depresivo Mayor': 54,
          'Trastorno de Pánico': 32,
          'Trastorno Bipolar': 28,
          'Trastorno Obsesivo-Compulsivo': 24,
          'Trastorno de Estrés Postraumático': 19,
          'Trastorno Alimentario': 15,
          'Otros': 8
        },
        therapistWorkload: {
          'Dr. Ana Martín': 42,
          'Dr. Luis Fernández': 38,
          'Dra. Isabel Moreno': 35,
          'Dr. Carlos Ruiz': 33,
          'Dra. María González': 31,
          'Dr. Pedro López': 28,
          'Dra. Carmen Díaz': 25,
          'Dr. José Herrera': 15
        },
        sessionMetrics: {
          averageSessionsPerPatient: 8.5,
          totalSessions: 2098,
          completionRate: 92.3,
          noShowRate: 4.1
        },
        outcomeMetrics: {
          averagePhq9Improvement: 6.8,
          averageGad7Improvement: 5.2,
          improvementRate: 78.9,
          recoveryRate: 45.2
        },
        monthlyTrends: [
          { month: 'Ene', newPatients: 18, activePatients: 156, dischargedPatients: 12, averagePhq9: 14.2, averageGad7: 12.8 },
          { month: 'Feb', newPatients: 22, activePatients: 162, dischargedPatients: 8, averagePhq9: 13.8, averageGad7: 12.1 },
          { month: 'Mar', newPatients: 25, activePatients: 171, dischargedPatients: 15, averagePhq9: 13.2, averageGad7: 11.5 },
          { month: 'Abr', newPatients: 19, activePatients: 175, dischargedPatients: 11, averagePhq9: 12.9, averageGad7: 11.2 },
          { month: 'May', newPatients: 28, activePatients: 183, dischargedPatients: 18, averagePhq9: 12.4, averageGad7: 10.8 },
          { month: 'Jun', newPatients: 23, activePatients: 189, dischargedPatients: 14, averagePhq9: 12.1, averageGad7: 10.5 }
        ],
        ageGroups: [
          { group: 'Niños (0-12)', count: 28, percentage: 11.3 },
          { group: 'Adolescentes (13-17)', count: 45, percentage: 18.2 },
          { group: 'Adultos Jóvenes (18-35)', count: 89, percentage: 36.0 },
          { group: 'Adultos (36-55)', count: 67, percentage: 27.1 },
          { group: 'Adultos Mayores (56+)', count: 18, percentage: 7.3 }
        ],
        treatmentDuration: [
          { duration: '1-3 meses', count: 67, percentage: 27.1 },
          { duration: '4-6 meses', count: 89, percentage: 36.0 },
          { duration: '7-12 meses', count: 54, percentage: 21.9 },
          { duration: '1-2 años', count: 28, percentage: 11.3 },
          { duration: '2+ años', count: 9, percentage: 3.6 }
        ]
      };
      
      setAnalytics(mockAnalytics);
      setLoading(false);
    };

    loadAnalytics();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    // Simular recarga
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const handleExport = () => {
    if (!analytics) {
      alert('No hay datos para exportar');
      return;
    }

    const exportData = {
      analytics,
      exportDate: new Date().toISOString(),
      period: selectedPeriod
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analisis-pacientes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight size={16} color="#10B981" />;
    if (value < 0) return <ArrowDownRight size={16} color="#EF4444" />;
    return <Minus size={16} color="#6B7280" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return '#10B981';
    if (value < 0) return '#EF4444';
    return '#6B7280';
  };

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      color: string;
      name: string;
      value: number | string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: `1px solid ${theme.colors.borderLight}`,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.sm,
          boxShadow: theme.shadows.floating,
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: theme.fontWeights.semibold,
            color: theme.colors.textPrimary,
            margin: '0 0 0.5rem 0',
          }}>
            {label}
          </p>
          {payload.map((entry: { color: string; name: string; value: number | string }, index: number) => (
            <p key={index} style={{
              fontSize: '0.75rem',
              color: entry.color,
              margin: '0.25rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span style={{
                width: '0.75rem',
                height: '0.75rem',
                backgroundColor: entry.color,
                borderRadius: '50%',
              }} />
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Renderizar estado de carga
  if (loading) {
    return (
      <div style={{ 
        padding: '2rem',
        backgroundColor: '#F9FAFB',
        minHeight: '100vh'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '1.5rem'
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              padding: '1.5rem',
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BarChart3 size={48} color="#3B82F6" />
          </motion.div>
          
          <div style={{ textAlign: 'center' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1C1E21',
              marginBottom: '0.5rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Generando Análisis de Pacientes
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#6B7280',
              maxWidth: '400px',
              fontFamily: 'Inter, sans-serif'
            }}>
              Procesando datos clínicos y generando insights inteligentes...
            </p>
          </div>
          
          <div style={{
            width: '200px',
            height: '4px',
            backgroundColor: '#E5E7EB',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <motion.div
              style={{
                width: '50px',
                height: '100%',
                backgroundColor: '#3B82F6',
                borderRadius: '2px'
              }}
              animate={{ x: [0, 150, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ 
        padding: '2rem',
        backgroundColor: '#F9FAFB',
        minHeight: '100vh'
      }}>
        <Card variant="default">
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <div style={{
              padding: '1rem',
              borderRadius: '50%',
              backgroundColor: '#FFFBEB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={48} color="#F59E0B" />
            </div>
            
            <div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#1C1E21',
                marginBottom: '0.5rem',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                No Hay Datos de Pacientes
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6B7280',
                marginBottom: '2rem',
                maxWidth: '400px'
              }}>
                No se encontraron datos de pacientes para generar el análisis.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button
                variant="primary"
                icon={UserPlus}
                onClick={() => window.open('/dashboard/patients', '_blank')}
              >
                Gestionar Pacientes
              </Button>
              <Button
                variant="outline"
                icon={RefreshCw}
                onClick={handleRefresh}
              >
                Actualizar
              </Button>
            </div>
          </div>
        </Card>
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
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            }}>
              <BarChart3 size={24} color="white" />
            </div>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#1F2937',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Análisis de Pacientes
              </h1>
              <p style={{
                fontSize: '1rem',
                color: '#6B7280',
                margin: '0.25rem 0 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                <Activity size={16} color="#10B981" />
                Insights inteligentes y métricas clínicas
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(249, 250, 251, 0.8)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(229, 231, 235, 0.6)',
            }}>
              {['week', 'month', 'quarter', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: selectedPeriod === period ? 'white' : 'transparent',
                    color: selectedPeriod === period ? '#2463EB' : '#6B7280',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxShadow: selectedPeriod === period ? '0 2px 4px rgba(0, 0, 0, 0.05)' : 'none'
                  }}
                >
                  {period === 'week' ? 'Semana' : 
                   period === 'month' ? 'Mes' :
                   period === 'quarter' ? 'Trimestre' : 'Año'}
                </button>
              ))}
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={handleRefresh}
            >
              Actualizar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExport}
            >
              Exportar
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Métricas Principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {[
          {
            title: 'Total Pacientes',
            value: analytics.totalPatients,
            change: 8.2,
            icon: Users,
            color: '#3B82F6',
            bgColor: '#EFF6FF'
          },
          {
            title: 'Pacientes Activos',
            value: analytics.activePatients,
            change: 12.5,
            icon: UserCheck,
            color: '#10B981',
            bgColor: '#ECFDF5'
          },
          {
            title: 'Nuevos Pacientes',
            value: analytics.newPatients,
            change: 15.8,
            icon: UserPlus,
            color: '#8B5CF6',
            bgColor: '#F3E8FF'
          },
          {
            title: 'Altas Médicas',
            value: analytics.dischargedPatients,
            change: 22.1,
            icon: Award,
            color: '#F59E0B',
            bgColor: '#FFFBEB'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -8, scale: 1.02 }}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: '1px solid rgba(229, 231, 235, 0.6)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Fondo decorativo */}
            <div
              style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '100px',
                height: '100px',
                background: `${metric.color}10`,
                borderRadius: '50%',
                opacity: 0.5
              }}
            />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '1rem',
                    backgroundColor: metric.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <metric.icon size={24} color={metric.color} />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getTrendIcon(metric.change)}
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: getTrendColor(metric.change)
                  }}>
                    {Math.abs(metric.change).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div>
                <h3 style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#1C1E21',
                  margin: '0 0 0.5rem 0',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {metric.value}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#6B7280',
                  margin: 0,
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {metric.title}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gráficos Principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Tendencias Mensuales */}
        <Card variant="default">
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1C1E21',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Tendencias de Pacientes
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                backgroundColor: 'rgba(249, 250, 251, 0.8)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(229, 231, 235, 0.6)',
              }}>
                {['newPatients', 'activePatients', 'dischargedPatients'].map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: selectedMetric === metric ? 'white' : 'transparent',
                      color: selectedMetric === metric ? '#2463EB' : '#6B7280',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      boxShadow: selectedMetric === metric ? '0 2px 4px rgba(0, 0, 0, 0.05)' : 'none'
                    }}
                  >
                    {metric === 'newPatients' ? 'Nuevos' : 
                     metric === 'activePatients' ? 'Activos' : 'Altas'}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.monthlyTrends}>
                  <defs>
                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDischarged" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  {selectedMetric === 'newPatients' && (
                    <Area
                      type="monotone"
                      dataKey="newPatients"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      fill="url(#colorNew)"
                      name="Nuevos Pacientes"
                    />
                  )}
                  
                  {selectedMetric === 'activePatients' && (
                    <Area
                      type="monotone"
                      dataKey="activePatients"
                      stroke="#10B981"
                      strokeWidth={3}
                      fill="url(#colorActive)"
                      name="Pacientes Activos"
                    />
                  )}
                  
                  {selectedMetric === 'dischargedPatients' && (
                    <Area
                      type="monotone"
                      dataKey="dischargedPatients"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      fill="url(#colorDischarged)"
                      name="Altas Médicas"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Distribución por Riesgo */}
        <Card variant="default">
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1C1E21',
              margin: '0 0 1.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Distribución por Nivel de Riesgo
            </h3>
            
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Tooltip 
                    formatter={(value: number) => [value, 'Pacientes']}
                    labelFormatter={(label) => `Riesgo: ${label}`}
                  />
                  <RechartsPieChart 
                    data={[
                      { name: 'Bajo', value: analytics.riskDistribution.low, color: '#10B981' },
                      { name: 'Medio', value: analytics.riskDistribution.medium, color: '#F59E0B' },
                      { name: 'Alto', value: analytics.riskDistribution.high, color: '#EF4444' },
                      { name: 'Crítico', value: analytics.riskDistribution.critical, color: '#7C2D12' }
                    ]}
                  >
                    {[
                      { name: 'Bajo', value: analytics.riskDistribution.low, color: '#10B981' },
                      { name: 'Medio', value: analytics.riskDistribution.medium, color: '#F59E0B' },
                      { name: 'Alto', value: analytics.riskDistribution.high, color: '#EF4444' },
                      { name: 'Crítico', value: analytics.riskDistribution.critical, color: '#7C2D12' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              {[
                { name: 'Bajo', value: analytics.riskDistribution.low, color: '#10B981' },
                { name: 'Medio', value: analytics.riskDistribution.medium, color: '#F59E0B' },
                { name: 'Alto', value: analytics.riskDistribution.high, color: '#EF4444' },
                { name: 'Crítico', value: analytics.riskDistribution.critical, color: '#7C2D12' }
              ].map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: index < 3 ? '1px solid #E5E7EB' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: item.color,
                      borderRadius: '50%'
                    }} />
                    <span style={{ fontSize: '0.875rem', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                      {item.name}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C1E21', fontFamily: 'Inter, sans-serif' }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                      {((item.value / analytics.totalPatients) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Métricas Clínicas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Métricas de Sesiones */}
        <Card variant="default">
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                padding: '0.75rem',
                borderRadius: '0.75rem',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Calendar size={20} color="#3B82F6" />
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#1C1E21',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Métricas de Sesiones
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Promedio Sesiones/Paciente', value: analytics.sessionMetrics.averageSessionsPerPatient, unit: 'sesiones' },
                { label: 'Total de Sesiones', value: analytics.sessionMetrics.totalSessions, unit: 'sesiones' },
                { label: 'Tasa de Finalización', value: analytics.sessionMetrics.completionRate, unit: '%' },
                { label: 'Tasa de No Asistencia', value: analytics.sessionMetrics.noShowRate, unit: '%' }
              ].map((metric, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '0.75rem',
                  border: '1px solid #E5E7EB'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    {metric.label}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1C1E21', fontFamily: 'Inter, sans-serif' }}>
                    {metric.value} {metric.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Métricas de Resultados */}
        <Card variant="default">
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                padding: '0.75rem',
                borderRadius: '0.75rem',
                backgroundColor: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Target size={20} color="#10B981" />
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#1C1E21',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Resultados Clínicos
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Mejora Promedio PHQ-9', value: analytics.outcomeMetrics.averagePhq9Improvement, unit: 'puntos' },
                { label: 'Mejora Promedio GAD-7', value: analytics.outcomeMetrics.averageGad7Improvement, unit: 'puntos' },
                { label: 'Tasa de Mejora', value: analytics.outcomeMetrics.improvementRate, unit: '%' },
                { label: 'Tasa de Recuperación', value: analytics.outcomeMetrics.recoveryRate, unit: '%' }
              ].map((metric, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '0.75rem',
                  border: '1px solid #E5E7EB'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    {metric.label}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1C1E21', fontFamily: 'Inter, sans-serif' }}>
                    {metric.value} {metric.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Distribuciones Adicionales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Distribución por Edad */}
        <Card variant="default">
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1C1E21',
              margin: '0 0 1.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Distribución por Grupos de Edad
            </h3>
            
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.ageGroups}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="group" 
                    stroke="#6B7280"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    name="Pacientes"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Duración del Tratamiento */}
        <Card variant="default">
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1C1E21',
              margin: '0 0 1.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Duración del Tratamiento
            </h3>
            
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.treatmentDuration} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    type="number"
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    type="category"
                    dataKey="duration" 
                    stroke="#6B7280"
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count" 
                    fill="#10B981" 
                    radius={[0, 4, 4, 0]}
                    name="Pacientes"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      {/* Carga de Trabajo por Terapeuta */}
      <Card variant="default">
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1C1E21',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Carga de Trabajo por Terapeuta
            </h3>
            <Button variant="outline" size="sm" icon={Eye}>
              Ver detalles
            </Button>
          </div>
          
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={Object.entries(analytics.therapistWorkload).map(([name, count]) => ({ name, count }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6B7280"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="#8B5CF6" 
                  radius={[4, 4, 0, 0]}
                  name="Pacientes Asignados"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
}
