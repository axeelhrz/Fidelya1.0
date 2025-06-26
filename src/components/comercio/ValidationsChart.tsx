'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useValidaciones } from '@/hooks/useValidaciones';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';

const styles = {
  container: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(148, 163, 184, 0.2)'
  },
  header: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  headerLg: {
    '@media (min-width: 1024px)': {
      flexDirection: 'row' as const,
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  iconContainer: {
    width: '3rem',
    height: '3rem',
    background: 'linear-gradient(135deg, #06b6d4 0%, #1e40af 100%)',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
  },
  headerText: {
    flex: 1
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '0.25rem'
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#64748b'
  },
  periodSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  periodContainer: {
    display: 'flex',
    backgroundColor: '#f1f5f9',
    borderRadius: '0.75rem',
    padding: '0.25rem'
  },
  periodButton: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  periodButtonActive: {
    backgroundColor: 'white',
    color: '#0891b2',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  periodButtonInactive: {
    backgroundColor: 'transparent',
    color: '#64748b'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  statsGridMd: {
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(3, 1fr)'
    }
  },
  statCard: {
    borderRadius: '0.75rem',
    padding: '1rem'
  },
  statCardCyan: {
    background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)'
  },
  statCardEmerald: {
    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
  },
  statCardViolet: {
    background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)'
  },
  statContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  statIcon: {
    width: '2rem',
    height: '2rem',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statIconCyan: {
    backgroundColor: '#06b6d4'
  },
  statIconEmerald: {
    backgroundColor: '#10b981'
  },
  statIconViolet: {
    backgroundColor: '#8b5cf6'
  },
  statText: {
    flex: 1
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#0f172a'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#64748b'
  },
  chartContainer: {
    height: '20rem'
  }
};

export const ValidationsChart: React.FC = () => {
  const { validaciones } = useValidaciones();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d'>('7d');

  // Calculate chart data
  const calculateChartData = () => {
    const now = new Date();
    const days = selectedPeriod === '7d' ? 7 : 30;
    const chartData = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(now, i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      const dayValidations = validaciones.filter(v => {
        const vDate = v.fechaHora.toDate();
        return vDate >= dayStart && vDate <= dayEnd;
      });

      const successful = dayValidations.filter(v => v.resultado === 'valido');

      chartData.push({
        date: format(date, selectedPeriod === '7d' ? 'EEE' : 'dd/MM', { locale: es }),
        fullDate: format(date, 'yyyy-MM-dd'),
        total: dayValidations.length,
        exitosas: successful.length,
        fallidas: dayValidations.length - successful.length,
      });
    }

    return chartData;
  };

  const chartData = calculateChartData();
  const totalValidaciones = chartData.reduce((sum, day) => sum + day.total, 0);
  const totalExitosas = chartData.reduce((sum, day) => sum + day.exitosas, 0);
  const tasaExito = totalValidaciones > 0 ? (totalExitosas / totalValidaciones) * 100 : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '0.75rem',
          padding: '1rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ fontSize: '0.875rem', color: entry.color }}>
              <span style={{ fontWeight: 500 }}>{entry.name}:</span> {entry.value}
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
      style={styles.container}
    >
      {/* Header */}
      <div style={{
        ...styles.header,
        '@media (min-width: 1024px)': {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }
      }}>
        <div style={styles.headerContent}>
          <div style={styles.iconContainer}>
            <BarChart3 style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
          </div>
          <div style={styles.headerText}>
            <h3 style={styles.title}>
              Validaciones por día
            </h3>
            <p style={styles.subtitle}>
              Últimos {selectedPeriod === '7d' ? '7 días' : '30 días'}
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div style={styles.periodSelector}>
          <div style={styles.periodContainer}>
            {[
              { value: '7d', label: '7 días' },
              { value: '30d', label: '30 días' },
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value as '7d' | '30d')}
                style={{
                  ...styles.periodButton,
                  ...(selectedPeriod === period.value ? styles.periodButtonActive : styles.periodButtonInactive)
                }}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{
        ...styles.statsGrid,
        '@media (min-width: 768px)': {
          gridTemplateColumns: 'repeat(3, 1fr)'
        }
      }}>
        <div style={{ ...styles.statCard, ...styles.statCardCyan }}>
          <div style={styles.statContent}>
            <div style={{ ...styles.statIcon, ...styles.statIconCyan }}>
              <Calendar style={{ width: '1rem', height: '1rem', color: 'white' }} />
            </div>
            <div style={styles.statText}>
              <p style={styles.statValue}>{totalValidaciones}</p>
              <p style={styles.statLabel}>Total validaciones</p>
            </div>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.statCardEmerald }}>
          <div style={styles.statContent}>
            <div style={{ ...styles.statIcon, ...styles.statIconEmerald }}>
              <TrendingUp style={{ width: '1rem', height: '1rem', color: 'white' }} />
            </div>
            <div style={styles.statText}>
              <p style={styles.statValue}>{totalExitosas}</p>
              <p style={styles.statLabel}>Exitosas</p>
            </div>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.statCardViolet }}>
          <div style={styles.statContent}>
            <div style={{ ...styles.statIcon, ...styles.statIconViolet }}>
              <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>%</span>
            </div>
            <div style={styles.statText}>
              <p style={styles.statValue}>{tasaExito.toFixed(1)}%</p>
              <p style={styles.statLabel}>Tasa de éxito</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="exitosasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#06b6d4"
              strokeWidth={3}
              fill="url(#totalGradient)"
              name="Total Validaciones"
            />
            <Area
              type="monotone"
              dataKey="exitosas"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#exitosasGradient)"
              name="Validaciones Exitosas"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .stats-grid-md {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .header-lg {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
      `}</style>
    </motion.div>
  );
};