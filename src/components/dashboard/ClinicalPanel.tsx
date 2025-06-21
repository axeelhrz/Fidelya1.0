'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Heart, AlertTriangle, Calendar, Activity, Users, TrendingUp, Shield, Brain } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useClinicalMetrics } from '@/hooks/useDashboardData';

// Datos mock mejorados para desarrollo
const mockClinicalData = {
  riskRadar: [
    { subject: 'PHQ-9 Alto', A: 12, fullMark: 20 },
    { subject: 'GAD-7 Alto', A: 8, fullMark: 20 },
    { subject: 'Sin Progreso', A: 15, fullMark: 20 },
    { subject: 'Faltas Recurrentes', A: 6, fullMark: 20 },
    { subject: 'Medicación', A: 9, fullMark: 20 },
    { subject: 'Crisis Recientes', A: 4, fullMark: 20 },
  ],
  capacityForecast: [
    { day: 'Lun', morning: 85, afternoon: 92, evening: 78 },
    { day: 'Mar', morning: 90, afternoon: 88, evening: 82 },
    { day: 'Mié', morning: 78, afternoon: 95, evening: 85 },
    { day: 'Jue', morning: 88, afternoon: 90, evening: 80 },
    { day: 'Vie', morning: 95, afternoon: 85, evening: 75 },
    { day: 'Sáb', morning: 60, afternoon: 70, evening: 45 },
  ],
  adherenceStats: {
    completed: 73.2,
    pending: 18.5,
    cancelled: 8.3
  },
  riskPatients: 54,
  wellnessScore: 87.3
};

export default function ClinicalPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { metrics, loading } = useClinicalMetrics();

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return 'var(--color-error)';
    if (percentage >= 75) return 'var(--color-warning)';
    return 'var(--color-success)';
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
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm font-medium" style={{ color: entry.color }}>{entry.name}:</span>
                </div>
                <span className="font-bold ml-4">{entry.value}%</span>
              </div>
            ))}
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
      transition={{ delay: 0.1, duration: 0.6 }}
      className="card-futuristic hover-lift"
    >
      {/* Header futurista */}
      <div 
        className="flex items-center justify-between p-8 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <motion.div 
            className="w-14 h-14 gradient-error rounded-2xl flex items-center justify-center shadow-glow relative overflow-hidden"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Heart className="w-7 h-7 text-inverse" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-futuristic" />
          </motion.div>
          <div>
            <h3 className="font-bold text-primary text-xl font-space-grotesk">Salud Clínica & Operativa</h3>
            <p className="text-sm text-secondary font-medium">Monitoreo inteligente de riesgos y capacidad</p>
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
          {/* Métricas de bienestar */}
          <motion.div 
            className="pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-surface-glass backdrop-blur-xl rounded-xl p-5 border border-light text-center hover-glow">
                <div className="flex items-center justify-center mb-3">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-accent font-space-grotesk mb-1">{mockClinicalData.wellnessScore}%</div>
                <div className="text-xs text-secondary font-medium">Índice de Bienestar</div>
              </div>
              <div className="bg-surface-glass backdrop-blur-xl rounded-xl p-5 border border-light text-center hover-glow">
                <div className="flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <div className="text-2xl font-bold text-success font-space-grotesk mb-1">92%</div>
                <div className="text-xs text-secondary font-medium">Pacientes Estables</div>
              </div>
              <div className="bg-surface-glass backdrop-blur-xl rounded-xl p-5 border border-light text-center hover-glow">
                <div className="flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6 text-error" />
                </div>
                <div className="text-2xl font-bold text-error font-space-grotesk mb-1">{mockClinicalData.riskPatients}</div>
                <div className="text-xs text-secondary font-medium">En Riesgo</div>
              </div>
            </div>
          </motion.div>

          {/* Alerta de riesgo mejorada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-br from-error/10 via-error/5 to-transparent rounded-xl p-6 border border-error/30 mb-6">
              <div className="flex items-start space-x-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-3 bg-error/20 rounded-xl"
                >
                  <AlertTriangle className="w-6 h-6 text-error" />
                </motion.div>
                <div className="flex-1">
                  <p className="font-bold text-error text-lg font-space-grotesk mb-2">
                    {mockClinicalData.riskPatients} pacientes requieren atención prioritaria
                  </p>
                  <p className="text-sm text-error/80 font-medium">
                    Sistema de alerta temprana activado - Revisión inmediata recomendada
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-3 px-4 py-2 bg-error text-white rounded-lg font-semibold text-sm hover:shadow-glow transition-all duration-300"
                  >
                    Ver Lista de Pacientes
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Radar de riesgo mejorado */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-error/10 rounded-lg border border-error/20">
                <AlertTriangle className="w-4 h-4 text-error" />
              </div>
              <h4 className="font-bold text-primary font-space-grotesk">Distribución de Factores de Riesgo</h4>
            </div>
            <div className="h-64 bg-surface-glass backdrop-blur-xl rounded-xl border border-light p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={mockClinicalData.riskRadar}>
                  <PolarGrid stroke="var(--color-border-light)" opacity={0.3} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fontSize: 11, fill: 'var(--color-text-secondary)', fontWeight: 500 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 20]} 
                    tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }}
                  />
                  <Radar
                    name="Pacientes en Riesgo"
                    dataKey="A"
                    stroke="var(--color-error)"
                    fill="var(--color-error)"
                    fillOpacity={0.2}
                    strokeWidth={3}
                    filter="drop-shadow(0 2px 8px rgba(255,71,87,0.3))"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Forecast de capacidad mejorado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Calendar className="w-4 h-4 text-accent" />
              </div>
              <h4 className="font-bold text-primary font-space-grotesk">Capacidad Operativa - Próximos 7 días</h4>
            </div>
            <div className="h-48 bg-surface-glass backdrop-blur-xl rounded-xl border border-light p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockClinicalData.capacityForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--color-text-secondary)', fontWeight: 500 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--color-text-secondary)', fontWeight: 500 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="morning" fill="var(--color-success)" name="Mañana" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="afternoon" fill="var(--color-warning)" name="Tarde" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="evening" fill="var(--color-accent)" name="Noche" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Adherencia al tratamiento mejorada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Activity className="w-4 h-4 text-accent" />
              </div>
              <h4 className="font-bold text-primary font-space-grotesk">Adherencia al Tratamiento</h4>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <motion.div 
                className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-5 text-center border border-success/30"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="text-3xl font-bold text-success font-space-grotesk mb-2">
                  {mockClinicalData.adherenceStats.completed}%
                </div>
                <div className="text-xs text-success font-medium">Completadas</div>
                <div className="mt-2 w-full bg-success/20 rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${mockClinicalData.adherenceStats.completed}%` }}
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl p-5 text-center border border-warning/30"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="text-3xl font-bold text-warning font-space-grotesk mb-2">
                  {mockClinicalData.adherenceStats.pending}%
                </div>
                <div className="text-xs text-warning font-medium">Pendientes</div>
                <div className="mt-2 w-full bg-warning/20 rounded-full h-2">
                  <div 
                    className="bg-warning h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${mockClinicalData.adherenceStats.pending}%` }}
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-error/10 to-error/5 rounded-xl p-5 text-center border border-error/30"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="text-3xl font-bold text-error font-space-grotesk mb-2">
                  {mockClinicalData.adherenceStats.cancelled}%
                </div>
                <div className="text-xs text-error font-medium">Canceladas</div>
                <div className="mt-2 w-full bg-error/20 rounded-full h-2">
                  <div 
                    className="bg-error h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${mockClinicalData.adherenceStats.cancelled}%` }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Recomendación IA */}
            <div className="bg-gradient-to-br from-accent/5 via-transparent to-accent/10 rounded-xl p-6 border border-accent/20">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-accent/20 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-primary mb-2 font-space-grotesk">Recomendación del Sistema IA</p>
                  <p className="text-xs text-secondary leading-relaxed">
                    Implementar recordatorios automáticos vía WhatsApp para reducir cancelaciones en un 23%. 
                    Considerar sesiones de seguimiento telefónico para pacientes con baja adherencia. 
                    Proyección de mejora: +15% en adherencia general.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-3 px-4 py-2 bg-accent text-white rounded-lg font-semibold text-sm hover:shadow-glow transition-all duration-300"
                  >
                    Implementar Sugerencias
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}