'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, DollarSign, TrendingUp, TrendingDown, Users, Zap, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinancialMetrics } from '@/hooks/useDashboardData';

// Datos mock mejorados para desarrollo
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
    if (profit >= 90) return 'gradient-success text-inverse';
    if (profit >= 75) return 'gradient-warning text-inverse';
    return 'gradient-error text-inverse';
  };

  const getProfitabilityBorder = (profit: number) => {
    if (profit >= 90) return 'border-success/30';
    if (profit >= 75) return 'border-warning/30';
    return 'border-error/30';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-glass backdrop-blur-xl p-5 rounded-xl shadow-floating border border-glow"
        >
          <p className="font-bold text-primary mb-3 font-space-grotesk">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full" />
                <span className="text-sm font-medium text-success">Ingresos:</span>
              </div>
              <span className="font-bold ml-4">${payload[0].value.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error rounded-full" />
                <span className="text-sm font-medium text-error">Egresos:</span>
              </div>
              <span className="font-bold ml-4">${payload[1].value.toLocaleString()}</span>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-border-light to-transparent my-3" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-primary">Neto:</span>
              <span className={`font-bold ml-4 ${payload[0].value > payload[1].value ? 'text-success' : 'text-error'}`}>
                ${(payload[0].value - payload[1].value).toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card-futuristic hover-lift"
    >
      {/* Header futurista */}
      <div 
        className="flex items-center justify-between p-8 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <motion.div 
            className="w-14 h-14 gradient-success rounded-2xl flex items-center justify-center shadow-glow relative overflow-hidden"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <DollarSign className="w-7 h-7 text-inverse" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-futuristic" />
          </motion.div>
          <div>
            <h3 className="font-bold text-primary text-xl font-space-grotesk">Desempeño Financiero</h3>
            <p className="text-sm text-secondary font-medium">Análisis de ingresos y rentabilidad en tiempo real</p>
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
          className="p-3 rounded-xl hover:bg-surface-hover border border-light hover:border-glow transition-all duration-300"
        >
          <ChevronDown className="w-6 h-6 text-secondary" />
        </motion.div>
      </div>

      {/* Content expandible */}
      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0 
        }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <div className="px-8 pb-8 space-y-8 border-t border-light/50">
          {/* Métricas rápidas */}
          <motion.div 
            className="pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-surface-glass backdrop-blur-xl rounded-xl p-5 border border-light text-center hover-glow">
                <div className="text-2xl font-bold text-success font-space-grotesk mb-1">$62k</div>
                <div className="text-xs text-secondary font-medium">Ingresos Hoy</div>
                <div className="flex items-center justify-center mt-2">
                  <TrendingUp className="w-3 h-3 text-success mr-1" />
                  <span className="text-xs text-success font-bold">+12.5%</span>
                </div>
              </div>
              <div className="bg-surface-glass backdrop-blur-xl rounded-xl p-5 border border-light text-center hover-glow">
                <div className="text-2xl font-bold text-primary font-space-grotesk mb-1">$37k</div>
                <div className="text-xs text-secondary font-medium">Egresos Hoy</div>
                <div className="flex items-center justify-center mt-2">
                  <TrendingDown className="w-3 h-3 text-error mr-1" />
                  <span className="text-xs text-error font-bold">-3.2%</span>
                </div>
              </div>
              <div className="bg-surface-glass backdrop-blur-xl rounded-xl p-5 border border-light text-center hover-glow">
                <div className="text-2xl font-bold text-accent font-space-grotesk mb-1">$25k</div>
                <div className="text-xs text-secondary font-medium">Margen Neto</div>
                <div className="flex items-center justify-center mt-2">
                  <Zap className="w-3 h-3 text-accent mr-1" />
                  <span className="text-xs text-accent font-bold">40.3%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gráfico de flujo de caja mejorado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
              <h4 className="font-bold text-primary font-space-grotesk">Flujo de Caja - Últimos 7 días</h4>
            </div>
            <div className="h-64 bg-surface-glass backdrop-blur-xl rounded-xl border border-light p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockFinancialData.burnEarnData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--color-text-secondary)', fontWeight: 500 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--color-text-secondary)', fontWeight: 500 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="var(--color-success)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-success)', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: 'var(--color-success)', stroke: 'white', strokeWidth: 2 }}
                    filter="drop-shadow(0 2px 8px rgba(0,200,150,0.3))"
                  />
                  <Line
                    type="monotone"
                    dataKey="egresos"
                    stroke="var(--color-error)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-error)', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: 'var(--color-error)', stroke: 'white', strokeWidth: 2 }}
                    filter="drop-shadow(0 2px 8px rgba(255,71,87,0.3))"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Proyección futurista */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-accent/5 via-transparent to-accent/10 rounded-xl p-6 border border-accent/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Target className="w-4 h-4 text-accent" />
              </div>
              <h5 className="font-bold text-primary font-space-grotesk">Proyección Inteligente 90 días</h5>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <motion.div 
                className="text-center bg-surface-glass backdrop-blur-xl rounded-xl p-5 border border-success/30"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <p className="text-xs text-secondary mb-2 font-medium">Escenario Optimista</p>
                <p className="text-2xl font-bold text-success font-space-grotesk">$485k</p>
                <div className="flex items-center justify-center mt-2">
                  <TrendingUp className="w-3 h-3 text-success mr-1" />
                  <p className="text-xs text-success font-bold">+15.5%</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center bg-surface-glass backdrop-blur-xl rounded-xl p-5 border border-accent/30"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <p className="text-xs text-secondary mb-2 font-medium">Escenario Base</p>
                <p className="text-2xl font-bold text-accent font-space-grotesk">$420k</p>
                <p className="text-xs text-secondary font-medium mt-2">Más Probable</p>
              </motion.div>
              
              <motion.div 
                className="text-center bg-surface-glass backdrop-blur-xl rounded-xl p-5 border border-warning/30"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <p className="text-xs text-secondary mb-2 font-medium">Escenario Conservador</p>
                <p className="text-2xl font-bold text-warning font-space-grotesk">$365k</p>
                <div className="flex items-center justify-center mt-2">
                  <TrendingDown className="w-3 h-3 text-warning mr-1" />
                  <p className="text-xs text-warning font-bold">-13.1%</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Rentabilidad por terapeuta mejorada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Users className="w-4 h-4 text-accent" />
              </div>
              <h4 className="font-bold text-primary font-space-grotesk">Rentabilidad por Terapeuta</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {mockFinancialData.therapistProfitability.map((therapist, index) => (
                <motion.div
                  key={therapist.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`
                    p-5 rounded-xl cursor-pointer transition-all duration-400 border backdrop-blur-xl
                    ${selectedTherapist === therapist.name 
                      ? 'border-accent bg-accent/10 shadow-glow' 
                      : 'border-light hover:border-glow bg-surface-glass hover:shadow-elevated'
                    }
                  `}
                  onClick={() => setSelectedTherapist(
                    selectedTherapist === therapist.name ? null : therapist.name
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h6 className="font-bold text-primary text-sm truncate font-space-grotesk">
                      {therapist.name}
                    </h6>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getProfitabilityColor(therapist.profit)} ${getProfitabilityBorder(therapist.profit)}`}>
                      {therapist.profit}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-secondary">
                    <div className="text-center">
                      <div className="font-bold text-primary">{therapist.sessions}</div>
                      <div>Sesiones</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-primary">${therapist.revenue.toLocaleString()}</div>
                      <div>Ingresos</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}