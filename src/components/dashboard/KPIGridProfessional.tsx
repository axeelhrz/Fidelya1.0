'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Grid, Box } from '@mui/material';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp,
  Heart,
  Clock,
  Target,
  AlertTriangle
} from 'lucide-react';
import KPICardProfessional from './KPICardProfessional';

const KPIGridProfessional: React.FC = () => {
  const kpiData = [
    {
      title: 'Ingresos Mensuales',
      value: '€45,280',
      subtitle: 'vs €42,150 mes anterior',
      trend: { value: 7.4, direction: 'up' as const, period: 'vs mes anterior' },
      icon: DollarSign,
      status: 'success' as const,
      sparklineData: [32, 45, 38, 52, 48, 55, 62, 58, 65, 72, 68, 75],
    },
    {
      title: 'Pacientes Activos',
      value: '1,247',
      subtitle: '89 nuevos este mes',
      trend: { value: 12.3, direction: 'up' as const, period: 'crecimiento mensual' },
      icon: Users,
      status: 'success' as const,
      sparklineData: [1180, 1195, 1210, 1225, 1235, 1247],
    },
    {
      title: 'Citas Programadas',
      value: '324',
      subtitle: 'Esta semana',
      trend: { value: -2.1, direction: 'down' as const, period: 'vs semana anterior' },
      icon: Calendar,
      status: 'warning' as const,
      sparklineData: [340, 335, 330, 325, 324],
    },
    {
      title: 'Tasa de Ocupación',
      value: '87.5%',
      subtitle: 'Capacidad utilizada',
      trend: { value: 5.2, direction: 'up' as const, period: 'vs mes anterior' },
      icon: TrendingUp,
      status: 'success' as const,
      sparklineData: [82, 84, 85, 86, 87, 87.5],
    },
    {
      title: 'Satisfacción Pacientes',
      value: '4.8/5',
      subtitle: 'Promedio últimos 30 días',
      trend: { value: 0, direction: 'neutral' as const, period: 'estable' },
      icon: Heart,
      status: 'success' as const,
      sparklineData: [4.7, 4.8, 4.8, 4.9, 4.8, 4.8],
    },
    {
      title: 'Tiempo Promedio Espera',
      value: '12 min',
      subtitle: 'Tiempo de espera',
      trend: { value: -15.3, direction: 'up' as const, period: 'mejora vs mes anterior' },
      icon: Clock,
      status: 'success' as const,
      sparklineData: [18, 16, 15, 14, 13, 12],
    },
    {
      title: 'Conversión Consultas',
      value: '68.4%',
      subtitle: 'Consultas → Tratamientos',
      trend: { value: 3.7, direction: 'up' as const, period: 'vs mes anterior' },
      icon: Target,
      status: 'info' as const,
      sparklineData: [64, 65, 66, 67, 68, 68.4],
    },
    {
      title: 'Alertas Críticas',
      value: '3',
      subtitle: 'Requieren atención',
      trend: { value: -40, direction: 'up' as const, period: 'reducción vs semana anterior' },
      icon: AlertTriangle,
      status: 'error' as const,
      sparklineData: [8, 6, 5, 4, 3],
    },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} lg={3} key={kpi.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <KPICardProfessional
                title={kpi.title}
                value={kpi.value}
                subtitle={kpi.subtitle}
                trend={kpi.trend}
                icon={kpi.icon}
                status={kpi.status}
                sparklineData={kpi.sparklineData}
                onClick={() => console.log(`Clicked on ${kpi.title}`)}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KPIGridProfessional;
