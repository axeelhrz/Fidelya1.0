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
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ fontSize: '14px', color: entry.color, marginBottom: '4px' }}>
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
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#06b6d4',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BarChart3 style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '2px'
              }}>
                Validaciones por día
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#64748b'
              }}>
                Últimos {selectedPeriod === '7d' ? '7 días' : '30 días'}
              </p>
            </div>
          </div>

          {/* Period Selector */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            borderRadius: '8px',
            padding: '4px'
          }}>
            {[
              { value: '7d', label: '7 días' },
              { value: '30d', label: '30 días' },
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value as '7d' | '30d')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: selectedPeriod === period.value ? 'white' : 'transparent',
                  color: selectedPeriod === period.value ? '#0891b2' : '#64748b',
                  boxShadow: selectedPeriod === period.value ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px'
            }}>
              <Calendar style={{ width: '16px', height: '16px', color: '#06b6d4' }} />
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Total</span>
            </div>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b' }}>{totalValidaciones}</p>
          </div>

          <div style={{
            backgroundColor: '#f0fdf4',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px'
            }}>
              <TrendingUp style={{ width: '16px', height: '16px', color: '#10b981' }} />
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Exitosas</span>
            </div>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b' }}>{totalExitosas}</p>
          </div>

          <div style={{
            backgroundColor: '#faf5ff',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: 700 }}>%</span>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Tasa éxito</span>
            </div>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b' }}>{tasaExito.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '300px' }}>
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
              strokeWidth={2}
              fill="url(#totalGradient)"
              name="Total Validaciones"
            />
            <Area
              type="monotone"
              dataKey="exitosas"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#exitosasGradient)"
              name="Validaciones Exitosas"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};