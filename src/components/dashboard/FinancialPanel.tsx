'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const { metrics, loading } = useFinancialMetrics();

  const getProfitabilityColor = (profit: number) => {
    if (profit >= 90) return 'bg-success';
    if (profit >= 75) return 'bg-warning';
    return 'bg-error';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-primary mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-success">Ingresos: </span>
              <span className="font-medium">${payload[0].value.toLocaleString()}</span>
            </p>
            <p className="text-sm">
              <span className="text-error">Egresos: </span>
              <span className="font-medium">${payload[1].value.toLocaleString()}</span>
            </p>
            <p className="text-sm font-medium">
              <span className="text-primary">Neto: </span>
              <span className={payload[0].value > payload[1].value ? 'text-success' : 'text-error'}>
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-card shadow-card"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-6 border-b border-gray-100 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary">Desempeño Financiero</h3>
            <p className="text-sm text-secondary">Análisis de ingresos y rentabilidad</p>
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-secondary" />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-6 space-y-6">
          {/* Burn & Earn Chart */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Burn & Earn - Últimos 7 días</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockFinancialData.burnEarnData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#10B981' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="egresos"
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#EF4444' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Proyección 90 días */}
          <div className="bg-secondary rounded-xl p-4">
            <h5 className="font-medium text-primary mb-3">Proyección 90 días</h5>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-secondary">Escenario Optimista</p>
                <p className="text-lg font-bold text-success">$485k</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-secondary">Escenario Base</p>
                <p className="text-lg font-bold text-primary">$420k</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-secondary">Escenario Pesimista</p>
                <p className="text-lg font-bold text-warning">$365k</p>
              </div>
            </div>
          </div>

          {/* Mapa de calor - Rentabilidad por terapeuta */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Rentabilidad por Terapeuta</h4>
            <div className="grid grid-cols-2 gap-3">
              {mockFinancialData.therapistProfitability.map((therapist, index) => (
                <motion.div
                  key={therapist.name}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    p-4 rounded-xl cursor-pointer transition-all duration-200
                    ${selectedTherapist === therapist.name ? 'ring-2 ring-primary' : ''}
                  `}
                  style={{
                    backgroundColor: therapist.profit >= 90 ? '#10B981' : 
                                   therapist.profit >= 75 ? '#F59E0B' : '#EF4444',
                    opacity: 0.1 + (therapist.profit / 100) * 0.9
                  }}
                  onClick={() => setSelectedTherapist(
                    selectedTherapist === therapist.name ? null : therapist.name
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="font-medium text-primary text-sm">{therapist.name}</h6>
                    <span className="text-xs font-bold text-primary">
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
