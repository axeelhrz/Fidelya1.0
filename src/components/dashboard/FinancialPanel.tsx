'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinancialMetrics } from '@/hooks/useDashboardData';

// Datos mock para desarrollo
const mockFinancialData = {
  burnEarnData: [
    { date: '01/12', ingresos: 45000, egresos: 32000 },
    { date: '02/12', ingresos: 48000, egresos: 35000 },
    { date: '03/12', ingresos: 52000, egresos: 33000 },
    { date: '04/12', ingresos: 47000, egresos: 38000 },
    { date: '05/12', ingresos: 55000, egresos: 36000 },
    { date: '06/12', ingresos: 58000, egresos: 34000 },
    { date: '07/12', ingresos: 62000, egresos: 37000 },
  ],
  therapistProfitability: [
    { name: 'Dr. García', profit: 85, sessions: 24, revenue: 12000 },
    { name: 'Dra. López', profit: 92, sessions: 28, revenue: 14500 },
    { name: 'Dr. Martínez', profit: 78, sessions: 22, revenue: 11200 },
    { name: 'Dra. Rodríguez', profit: 88, sessions: 26, revenue: 13800 },
    { name: 'Dr. Fernández', profit: 65, sessions: 18, revenue: 9500 },
    { name: 'Dra. Sánchez', profit: 95, sessions: 30, revenue: 15200 },
  ]
};

export default function FinancialPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const { metrics, loading } = useFinancialMetrics();

  const getProfitabilityColor = (profit: number) => {
    if (profit >= 90) return 'bg-success text-inverse';
    if (profit >= 75) return 'bg-warning text-inverse';
    return 'bg-error text-inverse';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface p-4 rounded-lg shadow-floating border border-border-light">
          <p className="font-medium text-primary mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm flex items-center justify-between">
              <span className="text-success">Ingresos:</span>
              <span className="font-medium ml-2">${payload[0].value.toLocaleString()}</span>
            </p>
            <p className="text-sm flex items-center justify-between">
              <span className="text-error">Egresos:</span>
              <span className="font-medium ml-2">${payload[1].value.toLocaleString()}</span>
            </p>
            <div className="h-px bg-border-light my-2" />
            <p className="text-sm font-medium flex items-center justify-between">
              <span className="text-primary">Neto:</span>
              <span className={`ml-2 ${payload[0].value > payload[1].value ? 'text-success' : 'text-error'}`}>
                ${(payload[0].value - payload[1].value).toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-card border border-border-light hover:border-border-medium transition-colors"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success-bg rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-primary">Desempeño Financiero</h3>
            <p className="text-sm text-secondary">Análisis de ingresos y rentabilidad</p>
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="p-1 rounded-lg hover:bg-surface-hover"
        >
          <ChevronDown className="w-5 h-5 text-secondary" />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 space-y-6 border-t border-border-light">
          {/* Burn & Earn Chart */}
          <div className="pt-6">
            <h4 className="font-medium text-primary mb-4">Flujo de Caja - Últimos 7 días</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockFinancialData.burnEarnData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="var(--success)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--success)', strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 4, fill: 'var(--success)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="egresos"
                    stroke="var(--error)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--error)', strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 4, fill: 'var(--error)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Proyección 90 días */}
          <div className="bg-surface-elevated rounded-lg p-4">
            <h5 className="font-medium text-primary mb-4">Proyección 90 días</h5>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-secondary mb-1">Optimista</p>
                <p className="text-lg font-semibold text-success">$485k</p>
                <p className="text-xs text-success">+15.5%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-secondary mb-1">Base</p>
                <p className="text-lg font-semibold text-primary">$420k</p>
                <p className="text-xs text-secondary">Esperado</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-secondary mb-1">Conservador</p>
                <p className="text-lg font-semibold text-warning">$365k</p>
                <p className="text-xs text-warning">-13.1%</p>
              </div>
            </div>
          </div>

          {/* Rentabilidad por terapeuta */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-4 h-4 text-secondary" />
              <h4 className="font-medium text-primary">Rentabilidad por Terapeuta</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {mockFinancialData.therapistProfitability.map((therapist, index) => (
                <motion.div
                  key={therapist.name}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all duration-200 border
                    ${selectedTherapist === therapist.name 
                      ? 'border-accent bg-accent/5' 
                      : 'border-border-light hover:border-border-medium bg-surface-elevated'
                    }
                  `}
                  onClick={() => setSelectedTherapist(
                    selectedTherapist === therapist.name ? null : therapist.name
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="font-medium text-primary text-sm truncate">
                      {therapist.name}
                    </h6>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProfitabilityColor(therapist.profit)}`}>
                      {therapist.profit}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-secondary">
                    <span>{therapist.sessions} sesiones</span>
                    <span>${therapist.revenue.toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}