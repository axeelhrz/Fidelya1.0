'use client';

import React from 'react';
import { motion } from 'framer-motion';
import KPICard from './KPICard';
import { useKPIMetrics } from '@/hooks/useDashboardData';
import { KPIMetric } from '@/types/dashboard';
import { BarChart3, TrendingUp } from 'lucide-react';

// Datos mock mejorados para desarrollo
const mockKPIs: KPIMetric[] = [
  {
    id: '1',
    name: 'Ingresos Netos MTD',
    value: 125000,
    previousValue: 118000,
    trend: 'up',
    status: 'success',
    unit: '$',
    sparklineData: [110000, 115000, 118000, 120000, 125000, 123000, 125000],
    target: 130000
  },
  {
    id: '2',
    name: 'EBITDA Rolling-12',
    value: 28.5,
    previousValue: 25.2,
    trend: 'up',
    status: 'success',
    unit: '%',
    sparklineData: [22, 24, 25.2, 26, 27, 28, 28.5],
    target: 30
  },
  {
    id: '3',
    name: 'Ocupación Consultorios',
    value: 87,
    previousValue: 82,
    trend: 'up',
    status: 'success',
    unit: '%',
    sparklineData: [78, 80, 82, 84, 85, 86, 87],
    target: 90
  },
  {
    id: '4',
    name: 'Cancelaciones/No-shows',
    value: 12.3,
    previousValue: 15.8,
    trend: 'down',
    status: 'success',
    unit: '%',
    sparklineData: [18, 17, 15.8, 14, 13, 12.5, 12.3],
    target: 10
  },
  {
    id: '5',
    name: 'Mejoría Sintomática',
    value: 73.2,
    previousValue: 68.9,
    trend: 'up',
    status: 'success',
    unit: '%',
    sparklineData: [65, 67, 68.9, 70, 71, 72, 73.2],
    target: 75
  },
  {
    id: '6',
    name: 'CAC vs LTV (90d)',
    value: 3.2,
    previousValue: 2.8,
    trend: 'up',
    status: 'warning',
    unit: 'x',
    sparklineData: [2.5, 2.6, 2.8, 2.9, 3.0, 3.1, 3.2],
    target: 4
  },
  {
    id: '7',
    name: 'Stock Tests (<15d)',
    value: 23,
    previousValue: 18,
    trend: 'up',
    status: 'error',
    unit: 'items',
    sparklineData: [15, 16, 18, 19, 20, 22, 23],
    target: 10
  },
  {
    id: '8',
    name: 'Cuentas por Cobrar >30d',
    value: 45000,
    previousValue: 52000,
    trend: 'down',
    status: 'warning',
    unit: '$',
    sparklineData: [58000, 55000, 52000, 50000, 48000, 46000, 45000],
    target: 30000
  }
];

export default function KPIGrid() {
  const { metrics, loading } = useKPIMetrics();
  
  // Usar datos mock si no hay datos de Firebase
  const displayMetrics = metrics.length > 0 ? metrics : mockKPIs;

  const handleKPIClick = (metric: KPIMetric) => {
    console.log('KPI clicked:', metric);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="h-8 bg-surface-elevated rounded-xl loading-futuristic w-64" />
          <div className="h-5 bg-surface-elevated rounded-lg loading-futuristic w-80" />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="h-64 bg-surface-glass backdrop-blur-xl rounded-card loading-futuristic border border-light"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-8 particle-container"
    >
      {/* Header mejorado */}
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-accent/10 rounded-xl border border-accent/20">
            <BarChart3 className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-space-grotesk text-primary text-gradient-accent">
              Métricas Clave de Rendimiento
            </h2>
            <p className="text-sm text-secondary font-medium">
              Indicadores principales del rendimiento del centro psicológico
            </p>
          </div>
        </div>
        
        {/* Resumen estadístico */}
        <motion.div 
          className="flex items-center space-x-6 mt-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center space-x-2 bg-success-bg px-4 py-2 rounded-full border border-success/20">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm font-bold text-success">
              {displayMetrics.filter(m => m.status === 'success').length} métricas en verde
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-warning-bg px-4 py-2 rounded-full border border-warning/20">
            <span className="w-2 h-2 bg-warning rounded-full animate-pulse" />
            <span className="text-sm font-bold text-warning">
              {displayMetrics.filter(m => m.status === 'warning').length} requieren atención
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-error-bg px-4 py-2 rounded-full border border-error/20">
            <span className="w-2 h-2 bg-error rounded-full animate-pulse" />
            <span className="text-sm font-bold text-error">
              {displayMetrics.filter(m => m.status === 'error').length} críticas
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayMetrics.map((metric, index) => (
          <KPICard
            key={metric.id}
            metric={metric}
            index={index}
            onClick={() => handleKPIClick(metric)}
          />
        ))}
      </div>

      {/* Insights automáticos */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-surface-glass backdrop-blur-xl rounded-card border border-light p-6 mt-8"
      >
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-accent/10 rounded-xl border border-accent/20">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-primary font-space-grotesk mb-2">
              Insights Automáticos del Rendimiento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-success-bg p-4 rounded-lg border border-success/20">
                <p className="font-semibold text-success mb-1">Excelente Rendimiento</p>
                <p className="text-success/80">
                  Los ingresos superan las expectativas en un 5.9% este mes
                </p>
              </div>
              <div className="bg-warning-bg p-4 rounded-lg border border-warning/20">
                <p className="font-semibold text-warning mb-1">Oportunidad de Mejora</p>
                <p className="text-warning/80">
                  El stock de tests requiere reposición en los próximos 7 días
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}