'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  PieChart,
  BarChart3,
  Target,
  Wallet,
  Receipt,
  Calculator,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPieChart, Cell } from 'recharts';
import { useStyles } from '@/lib/useStyles';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useFinancialMetrics } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface FinancialData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  growth: number;
  sessions: number;
  avgSessionCost: number;
}

interface PaymentData {
  id: string;
  amount: number;
  date: Date;
  status: 'paid' | 'pending' | 'overdue';
  patientName: string;
  sessionType: string;
}

interface ExpenseData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export default function FinancialPanel() {
  const { user } = useAuth();
  const { theme } = useStyles();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [paymentsData, setPaymentsData] = useState<PaymentData[]>([]);
  const [expensesBreakdown, setExpensesBreakdown] = useState<ExpenseData[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    totalProfit: 0,
    averageGrowth: 0,
    pendingPayments: 0,
    overduePayments: 0,
    totalSessions: 0,
    avgSessionValue: 0
  });

  // Datos mock mejorados para desarrollo
  const mockFinancialData: FinancialData[] = [
    { period: 'Ene', revenue: 45000, expenses: 32000, profit: 13000, growth: 8.5, sessions: 180, avgSessionCost: 250 },
    { period: 'Feb', revenue: 52000, expenses: 35000, profit: 17000, growth: 15.6, sessions: 208, avgSessionCost: 250 },
    { period: 'Mar', revenue: 48000, expenses: 33000, profit: 15000, growth: 6.7, sessions: 192, avgSessionCost: 250 },
    { period: 'Abr', revenue: 58000, expenses: 38000, profit: 20000, growth: 20.8, sessions: 232, avgSessionCost: 250 },
    { period: 'May', revenue: 62000, expenses: 40000, profit: 22000, growth: 6.9, sessions: 248, avgSessionCost: 250 },
    { period: 'Jun', revenue: 67000, expenses: 42000, profit: 25000, growth: 8.1, sessions: 268, avgSessionCost: 250 },
  ];

  const mockPaymentsData: PaymentData[] = [
    { id: '1', amount: 250, date: new Date(), status: 'paid', patientName: 'Ana García', sessionType: 'Individual' },
    { id: '2', amount: 180, date: new Date(Date.now() - 86400000), status: 'pending', patientName: 'Carlos López', sessionType: 'Pareja' },
    { id: '3', amount: 300, date: new Date(Date.now() - 172800000), status: 'overdue', patientName: 'María Rodríguez', sessionType: 'Familiar' },
    { id: '4', amount: 250, date: new Date(Date.now() - 259200000), status: 'paid', patientName: 'Juan Martínez', sessionType: 'Individual' },
    { id: '5', amount: 200, date: new Date(Date.now() - 345600000), status: 'pending', patientName: 'Laura Sánchez', sessionType: 'Grupal' },
  ];

  const mockExpensesBreakdown: ExpenseData[] = [
    { category: 'Salarios', amount: 25000, percentage: 59.5, color: '#3B82F6' },
    { category: 'Alquiler', amount: 8000, percentage: 19.0, color: '#10B981' },
    { category: 'Suministros', amount: 4500, percentage: 10.7, color: '#F59E0B' },
    { category: 'Marketing', amount: 3000, percentage: 7.1, color: '#EF4444' },
    { category: 'Otros', amount: 1500, percentage: 3.6, color: '#8B5CF6' },
  ];

  // Cargar datos financieros desde Firebase
  useEffect(() => {
    const loadFinancialData = async () => {
      if (!user?.centerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Cargar sesiones completadas y pagadas
        const sessionsQuery = query(
          collection(db, 'centers', user.centerId, 'sessions'),
          where('status', '==', 'completed'),
          orderBy('date', 'desc'),
          limit(100)
        );

        const sessionsSnapshot = await getDocs(sessionsQuery);
        const sessions = sessionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        }));

        // Cargar pagos
        const paymentsQuery = query(
          collection(db, 'centers', user.centerId, 'payments'),
          orderBy('date', 'desc'),
          limit(50)
        );

        const paymentsSnapshot = await getDocs(paymentsQuery);
        const payments = paymentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        })) as PaymentData[];

        // Procesar datos por mes
        const monthlyData = processMonthlyData(sessions);
        const stats = calculateStats(sessions, payments);

        setFinancialData(monthlyData.length > 0 ? monthlyData : mockFinancialData);
        setPaymentsData(payments.length > 0 ? payments : mockPaymentsData);
        setExpensesBreakdown(mockExpensesBreakdown); // Usar mock para gastos por ahora
        setTotalStats(stats);

      } catch (error) {
        console.warn('Error loading financial data from Firebase, using mock data:', error);
        // En caso de error, usar datos mock
        setFinancialData(mockFinancialData);
        setPaymentsData(mockPaymentsData);
        setExpensesBreakdown(mockExpensesBreakdown);
        setTotalStats(calculateMockStats());
      } finally {
        setLoading(false);
      }
    };

    loadFinancialData();
  }, [user?.centerId]);

  const processMonthlyData = (sessions: any[]): FinancialData[] => {
    const monthlyMap = new Map();
    
    sessions.forEach(session => {
      const month = session.date.toLocaleDateString('es-ES', { month: 'short' });
      const monthKey = session.date.getMonth();
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          period: month,
          revenue: 0,
          expenses: 0,
          profit: 0,
          growth: 0,
          sessions: 0,
          avgSessionCost: 0
        });
      }
      
      const monthData = monthlyMap.get(monthKey);
      monthData.revenue += session.cost || 250;
      monthData.sessions += 1;
      monthData.avgSessionCost = monthData.revenue / monthData.sessions;
      monthData.expenses = monthData.revenue * 0.65; // Estimar gastos como 65% de ingresos
      monthData.profit = monthData.revenue - monthData.expenses;
    });

    const result = Array.from(monthlyMap.values());
    
    // Calcular crecimiento
    for (let i = 1; i < result.length; i++) {
      const current = result[i];
      const previous = result[i - 1];
      current.growth = previous.revenue > 0 ? 
        ((current.revenue - previous.revenue) / previous.revenue) * 100 : 0;
    }

    return result;
  };

  const calculateStats = (sessions: any[], payments: PaymentData[]) => {
    const totalRevenue = sessions.reduce((sum, session) => sum + (session.cost || 250), 0);
    const totalExpenses = totalRevenue * 0.65; // Estimar gastos
    const totalProfit = totalRevenue - totalExpenses;
    const pendingPayments = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const overduePayments = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      averageGrowth: 12.5,
      pendingPayments,
      overduePayments,
      totalSessions: sessions.length,
      avgSessionValue: sessions.length > 0 ? totalRevenue / sessions.length : 250
    };
  };

  const calculateMockStats = () => {
    const totalRevenue = mockFinancialData.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpenses = mockFinancialData.reduce((sum, item) => sum + item.expenses, 0);
    const totalProfit = mockFinancialData.reduce((sum, item) => sum + item.profit, 0);
    const averageGrowth = mockFinancialData.reduce((sum, item) => sum + item.growth, 0) / mockFinancialData.length;
    const pendingPayments = mockPaymentsData.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const overduePayments = mockPaymentsData.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      averageGrowth,
      pendingPayments,
      overduePayments,
      totalSessions: mockFinancialData.reduce((sum, item) => sum + item.sessions, 0),
      avgSessionValue: 250
    };
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Simular recarga de datos
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };

  const handleExport = () => {
    const exportData = {
      financialData,
      totalStats,
      paymentsData,
      expensesBreakdown,
      exportDate: new Date().toISOString()
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

  const CustomTooltip = ({ active, payload, label }: any) => {
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
          {payload.map((entry: any, index: number) => (
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
              margin: '0.25rem 0 0 0'
            }}>
              Análisis predictivo de ingresos y rentabilidad
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
            loading={loading}
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
            value: totalStats.totalRevenue,
            change: 12.5,
            icon: TrendingUp,
            color: '#10B981',
            bgColor: '#ECFDF5'
          },
          {
            title: 'Gastos Totales',
            value: totalStats.totalExpenses,
            change: 8.2,
            icon: TrendingDown,
            color: '#F59E0B',
            bgColor: '#FFFBEB'
          },
          {
            title: 'Beneficio Neto',
            value: totalStats.totalProfit,
            change: 18.7,
            icon: DollarSign,
            color: '#3B82F6',
            bgColor: '#EFF6FF'
          },
          {
            title: 'Pagos Pendientes',
            value: totalStats.pendingPayments,
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
                  {loading ? (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #E5E7EB',
                      borderTop: '2px solid #2463EB',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  ) : (
                    <>
                      {getTrendIcon(metric.change)}
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: getTrendColor(metric.change)
                      }}>
                        {Math.abs(metric.change).toFixed(1)}%
                      </span>
                    </>
                  )}
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
                  {loading ? '...' : formatCurrency(metric.value)}
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
                  Evolución Financiera
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
                {loading ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      border: '3px solid #E5E7EB',
                      borderTop: '3px solid #2463EB',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      Cargando datos financieros...
                    </span>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financialData}>
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
                )}
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
                Distribución de Gastos
              </h3>
              
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value), 'Importe']}
                      labelFormatter={(label) => `Categoría: ${label}`}
                    />
                    <RechartsPieChart data={expensesBreakdown}>
                      {expensesBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                {expensesBreakdown.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                    borderBottom: index < expensesBreakdown.length - 1 ? '1px solid #E5E7EB' : 'none'
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
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Pagos Recientes */}
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
              Pagos Recientes
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
                {paymentsData.slice(0, 5).map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ borderBottom: '1px solid #F3F4F6' }}
                  >
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#1C1E21' }}>
                      {payment.patientName}
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6B7280' }}>
                      {payment.sessionType}
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