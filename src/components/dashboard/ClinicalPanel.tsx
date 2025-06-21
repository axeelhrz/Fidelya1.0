'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Heart, AlertTriangle, Calendar, Activity, Users, TrendingUp } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useClinicalMetrics } from '@/hooks/useDashboardData';

// Datos mock para desarrollo
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
  riskPatients: 54
};

export default function ClinicalPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { metrics, loading } = useClinicalMetrics();

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return 'var(--error)';
    if (percentage >= 75) return 'var(--warning)';
    return 'var(--success)';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface p-3 rounded-lg shadow-floating border border-border-light">
          <p className="font-medium text-primary mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm flex items-center justify-between">
                <span style={{ color: entry.color }}>{entry.name}:</span>
                <span className="font-medium ml-2">{entry.value}%</span>
              </p>
            ))}
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
      transition={{ delay: 0.1 }}
      className="bg-surface rounded-card border border-border-light hover:border-border-medium transition-colors"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-info-bg rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-info" />
          </div>
          <div>
            <h3 className="font-semibold text-primary">Salud Clínica & Operativa</h3>
            <p className="text-sm text-secondary">Monitoreo de riesgos y capacidad</p>
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
          {/* Resumen de riesgos */}
          <div className="pt-6">
            <div className="bg-error-bg rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-error" />
                <div>
                  <p className="font-medium text-error">
                    {mockClinicalData.riskPatients} pacientes en riesgo
                  </p>
                  <p className="text-sm text-error/80">
                    Requieren atención prioritaria inmediata
                  </p>
                </div>
              </div>
            </div>

            {/* Radar de Riesgo Activo */}
            <h4 className="font-medium text-primary mb-4">Distribución de Riesgos</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={mockClinicalData.riskRadar}>
                  <PolarGrid stroke="var(--border-light)" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 20]} 
                    tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }}
                  />
                  <Radar
                    name="Pacientes en Riesgo"
                    dataKey="A"
                    stroke="var(--error)"
                    fill="var(--error)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Forecast de Capacidad */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-4 h-4 text-secondary" />
              <h4 className="font-medium text-primary">Capacidad - Próximos 7 días</h4>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockClinicalData.capacityForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="morning" fill="var(--success)" name="Mañana" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="afternoon" fill="var(--warning)" name="Tarde" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="evening" fill="var(--accent)" name="Noche" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Adherencia al Tratamiento */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-4 h-4 text-secondary" />
              <h4 className="font-medium text-primary">Adherencia al Tratamiento</h4>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-success-bg rounded-lg p-3 text-center">
                <div className="text-xl font-semibold text-success mb-1">
                  {mockClinicalData.adherenceStats.completed}%
                </div>
                <div className="text-xs text-success/80">Completadas</div>
              </div>
              
              <div className="bg-warning-bg rounded-lg p-3 text-center">
                <div className="text-xl font-semibold text-warning mb-1">
                  {mockClinicalData.adherenceStats.pending}%
                </div>
                <div className="text-xs text-warning/80">Pendientes</div>
              </div>
              
              <div className="bg-error-bg rounded-lg p-3 text-center">
                <div className="text-xl font-semibold text-error mb-1">
                  {mockClinicalData.adherenceStats.cancelled}%
                </div>
                <div className="text-xs text-error/80">Canceladas</div>
              </div>
            </div>

            <div className="bg-surface-elevated rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary mb-1">Recomendación</p>
                  <p className="text-xs text-secondary">
                    Implementar recordatorios automáticos para reducir cancelaciones. 
                    Considerar sesiones de seguimiento telefónico para pacientes con baja adherencia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}