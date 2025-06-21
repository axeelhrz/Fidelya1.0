'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Download,
  RefreshCw,
  Clock,
  PieChart,
  BarChart3,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Database,
  Wifi,
  WifiOff,
  Plus
} from 'lucide-react';
import {  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPieChart, Cell } from 'recharts';
import { useStyles } from '@/lib/useStyles';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useFinancialData } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';

export default function FinancialPanel() {
  const { user } = useAuth();
  const { theme } = useStyles();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  
  const { data, loading, error } = useFinancialData();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    if (!data || data.monthlyData.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const exportData = {
      financialData: data.monthlyData,
      totalStats: data.totalStats,
      paymentsData: data.paymentsData,
      expensesBreakdown: data.expensesBreakdown,
      exportDate: new Date().toISOString(),
      centerId: user?.centerId
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-financiero-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'overdue': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagado';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencido';
      default: return 'Desconocido';
    }
  };

  interface ChartEntry {
    name: string;
    value: number;
    color: string;
  }

  interface TooltipProps {
    active?: boolean;
    payload?: Array<ChartEntry>;
    label?: string;
  }
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
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
          {payload.map((entry: ChartEntry, index: number) => (
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
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Renderizar estado de error
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '2rem',
        }}
      >
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
              backgroundColor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <WifiOff size={48} color="#EF4444" />
            </div>
            
            <div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#1C1E21',
                marginBottom: '0.5rem',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Error de Conexión
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6B7280',
                marginBottom: '2rem',
                maxWidth: '400px'
              }}>
                {error}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button
                variant="primary"
                icon={RefreshCw}
                onClick={handleRefresh}
              >
                Reintentar
              </Button>
              <Button
                variant="outline"
                icon={Database}
                onClick={() => window.open('https://console.firebase.google.com', '_blank')}
              >
                Configurar Firebase
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Renderizar estado de carga
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '2rem',
        }}
      >
        <Card variant="default">
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                padding: '1rem',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Database size={48} color="#3B82F6" />
            </motion.div>
            
            <div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#1C1E21',
                marginBottom: '0.5rem',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Cargando Datos Financieros
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6B7280',
                maxWidth: '400px'
              }}>
                Conectando con Firebase y procesando información financiera...
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
          </div>
        </Card>
      </motion.div>
    );
  }

  // Renderizar estado sin datos
  if (!data || data.monthlyData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '2rem',
        }}
      >
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
              <BarChart3 size={48} color="#F59E0B" />
            </div>
            
            <div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#1C1E21',
                marginBottom: '0.5rem',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                No Hay Datos Financieros
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6B7280',
                marginBottom: '2rem',
                maxWidth: '400px'
              }}>
                No se encontraron sesiones, pagos o gastos en Firebase. 
                Agrega datos para ver el análisis financiero.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => window.open('/dashboard/sessions', '_blank')}
              >
                Agregar Sesiones
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
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          }}>
            <DollarSign size={24} color="white" />
          </div>
          <div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1C1E21',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Inteligencia Financiera
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#6B7280',
              margin: '0.25rem 0 0 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Wifi size={16} color="#10B981" />
              Datos en tiempo real desde Firebase
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

      {/* Métricas Principales */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {[
          {
            title: 'Ingresos Totales',
            value: data.totalStats.totalRevenue,
            change: data.totalStats.averageGrowth,
            icon: TrendingUp,
            color: '#10B981',
            bgColor: '#ECFDF5'
          },
          {
            title: 'Gastos Totales',
            value: data.totalStats.totalExpenses,
            change: 8.2,
            icon: TrendingDown,
            color: '#F59E0B',
            bgColor: '#FFFBEB'
          },
          {
            title: 'Beneficio Neto',
            value: data.totalStats.totalProfit,
            change: 18.7,
            icon: DollarSign,
            color: '#3B82F6',
            bgColor: '#EFF6FF'
          },
          {
            title: 'Pagos Pendientes',
            value: data.totalStats.pendingPayments,
            change: -5.3,
            icon: Clock,
            color: '#EF4444',
            bgColor: '#FEF2F2'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -8, scale: 1.02 }}
            style={{
              flex: '1',
              minWidth: '280px',
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
                  {formatCurrency(metric.value)}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#6B7280',
                  margin: 0,
                  fontWeight: 500
                }}>
                  {metric.title}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gráficos */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {/* Gráfico Principal */}
        <div style={{ flex: '2', minWidth: '600px' }}>
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
                  Evolución Financiera ({data.monthlyData.length} meses)
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
                  {['revenue', 'expenses', 'profit'].map((metric) => (
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
                      {metric === 'revenue' ? 'Ingresos' : 
                       metric === 'expenses' ? 'Gastos' : 'Beneficios'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.monthlyData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="period" 
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      fontSize={12}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    
                    {selectedMetric === 'revenue' && (
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10B981"
                        strokeWidth={3}
                        fill="url(#colorRevenue)"
                        name="Ingresos"
                      />
                    )}
                    
                    {selectedMetric === 'expenses' && (
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#F59E0B"
                        strokeWidth={3}
                        fill="url(#colorExpenses)"
                        name="Gastos"
                      />
                    )}
                    
                    {selectedMetric === 'profit' && (
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        fill="url(#colorProfit)"
                        name="Beneficios"
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* Gráfico de Gastos */}
        <div style={{ flex: '1', minWidth: '400px' }}>
          <Card variant="default">
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1C1E21',
                margin: '0 0 1.5rem 0',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Distribución de Gastos ({data.expensesBreakdown.length} categorías)
              </h3>
              
              {data.expensesBreakdown.length > 0 ? (
                <>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Tooltip 
                          formatter={(value: number) => [formatCurrency(value), 'Importe']}
                          labelFormatter={(label) => `Categoría: ${label}`}
                        />
                        <RechartsPieChart data={data.expensesBreakdown}>
                          {data.expensesBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </RechartsPieChart>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div style={{ marginTop: '1rem' }}>
                    {data.expensesBreakdown.map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0',
                        borderBottom: index < data.expensesBreakdown.length - 1 ? '1px solid #E5E7EB' : 'none'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: item.color,
                            borderRadius: '50%'
                          }} />
                          <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                            {item.category}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C1E21' }}>
                            {formatCurrency(item.amount)}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                            {item.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{
                  height: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6B7280'
                }}>
                  <PieChart size={48} style={{ marginBottom: '1rem' }} />
                  <p>No hay datos de gastos</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Pagos Recientes */}
      {data.paymentsData.length > 0 && (
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
                Pagos Recientes ({data.paymentsData.length} registros)
              </h3>
              <Button variant="outline" size="sm" icon={FileText}>
                Ver todos
              </Button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>
                      Paciente
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>
                      Tipo de Sesión
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>
                      Importe
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>
                      Fecha
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.paymentsData.slice(0, 5).map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{ borderBottom: '1px solid #F3F4F6' }}
                    >
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#1C1E21' }}>
                        {String(payment.patientName)}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6B7280' }}>
                        {String(payment.sessionType)}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: '#1C1E21' }}>
                        {formatCurrency(payment.amount)}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6B7280' }}>
                        {payment.date.toLocaleDateString('es-ES')}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: `${getPaymentStatusColor(payment.status)}20`,
                          color: getPaymentStatusColor(payment.status)
                        }}>
                          {getPaymentStatusText(payment.status)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* Estilos CSS */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}