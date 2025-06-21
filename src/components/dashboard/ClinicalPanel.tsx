'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Heart, AlertTriangle, Calendar, Activity } from 'lucide-react';
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
  }
};

export default function ClinicalPanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { metrics, loading } = useClinicalMetrics();

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return '#EF4444'; // Rojo - sobrecarga
    if (percentage >= 75) return '#F59E0B'; // Amarillo - alta ocupación
    return '#10B981'; // Verde - capacidad disponible
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-card shadow-card"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-6 border-b border-gray-100 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary">Salud Clínica & Operativa</h3>
            <p className="text-sm text-secondary">Monitoreo de riesgos y capacidad</p>
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
          {/* Radar de Riesgo Activo */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h4 className="font-semibold text-primary">Radar de Riesgo Activo</h4>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={mockClinicalData.riskRadar}>
                  <PolarGrid stroke="#f0f0f0" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 20]} 
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                  />
                  <Radar
                    name="Pacientes en Riesgo"
                    dataKey="A"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-red-50 rounded-xl p-4 mt-4">
              <p className="text-sm text-red-800">
                <strong>54 pacientes</strong> requieren atención prioritaria
              </p>
            </div>
          </div>

          {/* Forecast de Capacidad */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-primary">Forecast de Capacidad - Próximos 7 días</h4>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockClinicalData.capacityForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Ocupación']}
                    labelStyle={{ color: '#1C1E21' }}
                  />
                  <Bar dataKey="morning" fill="#10B981" name="Mañana" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="afternoon" fill="#F59E0B" name="Tarde" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="evening" fill="#6366F1" name="Noche" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Adherencia */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-success" />
              <h4 className="font-semibold text-primary">Adherencia al Tratamiento</h4>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-success mb-1">
                  {mockClinicalData.adherenceStats.completed}%
                </div>
                <div className="text-sm text-green-700">Completadas</div>
              </div>
              
              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-warning mb-1">
                  {mockClinicalData.adherenceStats.pending}%
                </div>
                <div className="text-sm text-yellow-700">Pendientes</div>
              </div>
              
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-error mb-1">
                  {mockClinicalData.adherenceStats.cancelled}%
                </div>
                <div className="text-sm text-red-700">Canceladas</div>
              </div>
            </div>

            <div className="mt-4 bg-secondary rounded-xl p-4">
              <p className="text-sm text-primary">
                <strong>Recomendación:</strong> Implementar recordatorios automáticos para reducir cancelaciones. 
                Considerar sesiones de seguimiento telefónico para pacientes con baja adherencia.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
