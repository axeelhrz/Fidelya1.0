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
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-4 shadow-lg">
          <p className="font-semibold text-slate-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {entry.value}
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
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-slate-200/50"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Validaciones por día
            </h3>
            <p className="text-sm text-slate-600">
              Últimos {selectedPeriod === '7d' ? '7 días' : '30 días'}
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-xl p-1">
            {[
              { value: '7d', label: '7 días' },
              { value: '30d', label: '30 días' },
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value as '7d' | '30d')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  selectedPeriod === period.value
                    ? 'bg-white text-cyan-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalValidaciones}</p>
              <p className="text-sm text-slate-600">Total validaciones</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalExitosas}</p>
              <p className="text-sm text-slate-600">Exitosas</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{tasaExito.toFixed(1)}%</p>
              <p className="text-sm text-slate-600">Tasa de éxito</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
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
    </motion.div>
  );
};
