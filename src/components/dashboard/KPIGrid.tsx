'use client';

import React from 'react';
import { motion } from 'framer-motion';
import KPICard from './KPICard';
import { useKPIMetrics } from '@/hooks/useDashboardData';
import { KPIMetric } from '@/types/dashboard';

// Datos mock para desarrollo
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
    // Aquí se abriría el modal con detalles del KPI
    console.log('KPI clicked:', metric);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-40 bg-white rounded-card shadow-card animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-8"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold font-space-grotesk text-primary mb-2">
          Métricas Clave
        </h2>
        <p className="text-sm text-secondary">
          Indicadores principales del rendimiento del centro
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayMetrics.map((metric, index) => (
          <KPICard
            key={metric.id}
            metric={metric}
            index={index}
            onClick={() => handleKPIClick(metric)}
          />
        ))}
      </div>
    </motion.section>
  );
}
