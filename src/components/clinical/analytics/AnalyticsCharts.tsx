'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { TherapistAnalytics } from '@/types/analytics';

interface AnalyticsChartsProps {
  analytics: TherapistAnalytics;
  isDarkMode?: boolean;
}

export default function AnalyticsCharts({ analytics, isDarkMode = false }: AnalyticsChartsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [chartPeriod, setChartPeriod] = useState('6months');

  const theme = {
    background: isDarkMode ? '#1F2937' : '#FFFFFF',
    text: isDarkMode ? '#F9FAFB' : '#1F2937',
    grid: isDarkMode ? '#374151' : '#E5E7EB',
    accent: '#10B981'
  };

  // Colores para gráficos
  const colors = [
    '#10B981', '#3B82F6', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
  ];

  // Datos para gráfico de sesiones mensuales
  const sessionTrendsData = analytics.monthlySessionTrends.map(month => ({
    name: month.month.substring(0, 3),
    completadas: month.completedSessions,
    canceladas: month.cancelledSessions,
    noShow: month.noShowSessions,
    total: month.totalSessions,
    ingresos: month.revenue
  }));

  // Datos para gráfico de distribución emocional
  const emotionalData = Object.entries(analytics.predominantEmotions).map(([emotion, value]) => ({
    name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    value: Math.round(value),
    color: colors[Object.keys(analytics.predominantEmotions).indexOf(emotion)]
  }));

  // Datos para gráfico de motivos de consulta
  const consultationData = analytics.consultationReasons.slice(0, 8).map(reason => ({
    name: reason.reason.length > 20 ? reason.reason.substring(0, 20) + '...' : reason.reason,
    count: reason.count,
    percentage: reason.percentage
  }));

  // Datos para evolución emocional
  const emotionalEvolutionData = analytics.emotionalEvolution.slice(0, 5).map(patient => ({
    name: patient.patientName.split(' ')[0],
    mejora: patient.averageImprovement,
    sesiones: patient.sessions.length,
    tendencia: patient.overallTrend
  }));

  // Custom tooltip para gráficos
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      color: string;
      name: string;
      value: number | string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={8}
          sx={{
            p: 2,
            backgroundColor: theme.background,
            border: `1px solid ${theme.grid}`,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
          }}
        >
          <Typography variant="body2" sx={{ color: theme.text, fontWeight: 600, mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry: { color: string; name: string; value: number | string }, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: entry.color,
                  borderRadius: '50%'
                }}
              />
              <Typography variant="body2" sx={{ color: theme.text }}>
                {entry.name}: {entry.value}
                {entry.name === 'ingresos' && '€'}
                {entry.name === 'percentage' && '%'}
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const renderSessionTrendsChart = () => (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={sessionTrendsData}>
        <defs>
          <linearGradient id="completadas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="canceladas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
        <XAxis 
          dataKey="name" 
          stroke={theme.text}
          fontSize={12}
        />
        <YAxis 
          stroke={theme.text}
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="completadas"
          stackId="1"
          stroke="#10B981"
          fill="url(#completadas)"
          name="Completadas"
        />
        <Area
          type="monotone"
          dataKey="canceladas"
          stackId="1"
          stroke="#F59E0B"
          fill="url(#canceladas)"
          name="Canceladas"
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          name="Total"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderEmotionalDistributionChart = () => (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={emotionalData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={2}
          dataKey="value"
        >
          {emotionalData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderConsultationReasonsChart = () => (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={consultationData} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
        <XAxis 
          type="number"
          stroke={theme.text}
          fontSize={12}
        />
        <YAxis 
          type="category"
          dataKey="name"
          stroke={theme.text}
          fontSize={12}
          width={100}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="count" 
          fill="#10B981"
          radius={[0, 4, 4, 0]}
          name="Casos"
        />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderEmotionalEvolutionChart = () => (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={emotionalEvolutionData}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
        <XAxis 
          dataKey="name"
          stroke={theme.text}
          fontSize={12}
        />
        <YAxis 
          stroke={theme.text}
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="mejora"
          stroke="#10B981"
          strokeWidth={3}
          dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
          name="Mejora Promedio"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const charts = [
    {
      title: 'Tendencia de Sesiones',
      description: 'Evolución mensual de sesiones completadas, canceladas y totales',
      component: renderSessionTrendsChart()
    },
    {
      title: 'Distribución Emocional',
      description: 'Estados emocionales predominantes en las sesiones',
      component: renderEmotionalDistributionChart()
    },
    {
      title: 'Motivos de Consulta',
      description: 'Principales razones por las que los pacientes buscan terapia',
      component: renderConsultationReasonsChart()
    },
    {
      title: 'Evolución Emocional',
      description: 'Progreso emocional promedio por paciente',
      component: renderEmotionalEvolutionChart()
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(229, 231, 235, 0.6)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          mb: 4,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(229, 231, 235, 0.3)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#1C1E21',
                fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              Gráficos Interactivos
            </Typography>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Período</InputLabel>
              <Select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value)}
                label="Período"
              >
                <MenuItem value="3months">3 Meses</MenuItem>
                <MenuItem value="6months">6 Meses</MenuItem>
                <MenuItem value="1year">1 Año</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem'
              },
              '& .Mui-selected': {
                color: '#10B981 !important'
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#10B981'
              }
            }}
          >
            {charts.map((chart, index) => (
              <Tab key={index} label={chart.title} />
            ))}
          </Tabs>
        </Box>

        {/* Chart Content */}
        <Box sx={{ p: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
              mb: 3,
              fontStyle: 'italic'
            }}
          >
            {charts[activeTab].description}
          </Typography>

          {charts[activeTab].component}

          {/* Chart insights */}
          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(229, 231, 235, 0.3)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1C1E21', fontWeight: 600 }}>
              Insights del Gráfico
            </Typography>
            
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {activeTab === 0 && (
                <>
                  <Chip
                    label={`${analytics.sessionCompletionRate.toFixed(1)}% tasa de finalización`}
                    color="success"
                    variant="outlined"
                  />
                  <Chip
                    label={`${analytics.monthlySessionTrends.length} meses de datos`}
                    color="info"
                    variant="outlined"
                  />
                </>
              )}
              
              {activeTab === 1 && (
                <>
                  <Chip
                    label={`${Object.keys(analytics.predominantEmotions).length} estados emocionales`}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label="Distribución balanceada"
                    color="success"
                    variant="outlined"
                  />
                </>
              )}
              
              {activeTab === 2 && (
                <>
                  <Chip
                    label={`${analytics.consultationReasons.length} motivos identificados`}
                    color="info"
                    variant="outlined"
                  />
                  <Chip
                    label="Top 8 más frecuentes"
                    color="primary"
                    variant="outlined"
                  />
                </>
              )}
              
              {activeTab === 3 && (
                <>
                  <Chip
                    label={`${analytics.emotionalEvolution.filter(e => e.overallTrend === 'improving').length} pacientes mejorando`}
                    color="success"
                    variant="outlined"
                  />
                  <Chip
                    label="Tendencia positiva general"
                    color="success"
                    variant="outlined"
                  />
                </>
              )}
            </Stack>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}
