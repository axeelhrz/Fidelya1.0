'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Target, TrendingUp, Users, DollarSign, BarChart3, Zap, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Datos mock mejorados para desarrollo
const mockCommercialData = {
  conversionByChannel: [
    { channel: 'Google Ads', leads: 145, conversions: 32, rate: 22.1, color: 'var(--color-accent)', trend: 'up' },
    { channel: 'Facebook', leads: 89, conversions: 18, rate: 20.2, color: 'var(--color-success)', trend: 'up' },
    { channel: 'Referidos', leads: 67, conversions: 28, rate: 41.8, color: 'var(--color-warning)', trend: 'up' },
    { channel: 'Orgánico', leads: 234, conversions: 45, rate: 19.2, color: 'var(--color-info)', trend: 'stable' },
    { channel: 'Email', leads: 56, conversions: 12, rate: 21.4, color: 'var(--color-error)', trend: 'down' },
  ],
  campaignEffectiveness: [
    { name: 'Ansiedad Jóvenes', spent: 2500, leads: 45, cac: 55.6, status: 'active', roi: 2.8, performance: 'excellent' },
    { name: 'Terapia Parejas', spent: 1800, leads: 28, cac: 64.3, status: 'active', roi: 3.2, performance: 'excellent' },
    { name: 'Depresión Adultos', spent: 3200, leads: 52, cac: 61.5, status: 'paused', roi: 2.1, performance: 'good' },
    { name: 'Mindfulness', spent: 1200, leads: 18, cac: 66.7, status: 'active', roi: 3.5, performance: 'excellent' },
  ],
  cacHistory: [
    { month: 'Jul', cac: 58.2 },
    { month: 'Ago', cac: 62.1 },
    { month: 'Sep', cac: 59.8 },
    { month: 'Oct', cac: 61.5 },
    { month: 'Nov', cac: 58.9 },
    { month: 'Dic', cac: 60.3 },
  ],
  summary: {
    avgCAC: 60.13,
    avgLTV: 192.40,
    ratio: 3.2,
    totalLeads: 591,
    conversionRate: 22.8
  }
};

export default function CommercialPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10 border-success/30';
      case 'paused': return 'text-warning bg-warning/10 border-warning/30';
      case 'stopped': return 'text-error bg-error/10 border-error/30';
      default: return 'text-secondary bg-surface-elevated border-border-light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'paused': return 'Pausada';
      case 'stopped': return 'Detenida';
      default: return 'Desconocido';
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'excellent': return <Star className="w-4 h-4 text-success" />;
      case 'good': return <TrendingUp className="w-4 h-4 text-warning" />;
      default: return <BarChart3 className="w-4 h-4 text-secondary" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-success" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-error rotate-180" />;
      default: return <div className="w-3 h-3 bg-secondary rounded-full" />;
    }
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
          <p className="text-sm">
            <span className="text-secondary">CAC: </span>
            <span className="font-bold">${payload[0].value}</span>
          </p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="card-futuristic hover-lift"
    >
      {/* Header futurista */}
      <div 
        className="flex items-center justify-between p-8 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <motion.div 
            className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow relative overflow-hidden"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Target className="w-7 h-7 text-inverse" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-futuristic" />
          </motion.div>
          <div>
            <h3 className="font-bold text-primary text-xl font-space-grotesk">Pipeline Comercial & Marketing</h3>
            <p className="text-sm text-secondary font-medium">Análisis inteligente de conversión y adquisición</p>
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
          {/* Métricas clave mejoradas */}
          <motion.div 
            className="pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-5 gap-4 mb-8">
              <div className="bg-surface-glass backdrop-blur-xl rounded-xl p-4 border border-light text-center hover-glow">
                <div className="text-lg font-bold text-accent font-space-grotesk">
                  ${mockCommercialData.summary.avgCAC}
                </div>
                <div className="text-xs text-secondary font-medium">CAC Promedio</div>
              </div>
              <div className="bg-surface-glass backdrop-blur-xl rounded-xl p-4 border border-light text-center hover-glow">
                <div className="text-lg font-bold text-success font-space-grotesk">
                  ${mockCommercialData.summary.avgLTV}
                </div>
                <div className="text-xs text-secondary font-medium">LTV Promedio</div>
              </div>
              <div className="bg-surface-glass backdrop-blur-xl rounded-xl p-4 border border-light text-center hover-glow">
                <div className="text-lg font-bold text-warning font-space-grotesk">
                  {mockCommercialData.summary.ratio}x
                </div>
                <div className="text-xs text-secondary font-medium">Ratio LTV/CAC</div>
              </div>
              <div className="bg-surface-glass backdrop-blur-xl rounded-xl p-4 border border-light text-center hover-glow">
                <div className="text-lg font-bold text-primary font-space-grotesk">
                  {mockCommercialData.summary.totalLeads}
                </div>
                <div className="text-xs text-secondary font-medium">Total Leads</div>
              </div>
              <div className="bg-surface-glass backdrop-blur-xl rounded-xl p-4 border border-light text-center hover-glow">
                <div className="text-lg font-bold text-info font-space-grotesk">
                  {mockCommercialData.summary.conversionRate}%
                </div>
                <div className="text-xs text-secondary font-medium">Conversión</div>
              </div>
            </div>
          </motion.div>

          {/* Conversión por canal mejorada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <BarChart3 className="w-4 h-4 text-accent" />
              </div>
              <h4 className="font-bold text-primary font-space-grotesk">Rendimiento por Canal</h4>
            </div>
            <div className="space-y-3">
              {mockCommercialData.conversionByChannel.map((channel, index) => (
                <motion.div 
                  key={channel.channel} 
                  className="flex items-center justify-between p-5 bg-surface-glass backdrop-blur-xl rounded-xl border border-light hover:border-glow hover:shadow-elevated transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.01, y: -1 }}
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-4 h-4 rounded-full shadow-glow"
                      style={{ backgroundColor: channel.color }}
                    />
                    <div>
                      <span className="font-bold text-primary text-sm font-space-grotesk">{channel.channel}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        {getTrendIcon(channel.trend)}
                        <span className="text-xs text-secondary">Tendencia</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-primary">{channel.leads}</div>
                      <div className="text-xs text-secondary">Leads</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-success">{channel.conversions}</div>
                      <div className="text-xs text-secondary">Conversiones</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-accent text-lg">{channel.rate}%</div>
                      <div className="text-xs text-secondary">Tasa</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Campañas mejoradas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Users className="w-4 h-4 text-accent" />
              </div>
              <h4 className="font-bold text-primary font-space-grotesk">Campañas Activas</h4>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {mockCommercialData.campaignEffectiveness.map((campaign, index) => (
                <motion.div
                  key={campaign.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className={`
                    p-6 rounded-xl border cursor-pointer transition-all duration-400 backdrop-blur-xl
                    ${selectedCampaign === campaign.name 
                      ? 'border-accent bg-accent/10 shadow-glow' 
                      : 'border-light hover:border-glow bg-surface-glass hover:shadow-elevated'
                    }
                  `}
                  onClick={() => setSelectedCampaign(
                    selectedCampaign === campaign.name ? null : campaign.name
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h5 className="font-bold text-primary text-sm font-space-grotesk">{campaign.name}</h5>
                      {getPerformanceIcon(campaign.performance)}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(campaign.status)}`}>
                        {getStatusText(campaign.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-xs">
                    <div className="text-center bg-surface-elevated rounded-lg p-3">
                      <p className="text-secondary mb-1">Invertido</p>
                      <p className="font-bold text-primary text-lg">${campaign.spent}</p>
                    </div>
                    <div className="text-center bg-surface-elevated rounded-lg p-3">
                      <p className="text-secondary mb-1">Leads</p>
                      <p className="font-bold text-primary text-lg">{campaign.leads}</p>
                    </div>
                    <div className="text-center bg-surface-elevated rounded-lg p-3">
                      <p className="text-secondary mb-1">CAC</p>
                      <p className="font-bold text-primary text-lg">${campaign.cac}</p>
                    </div>
                    <div className="text-center bg-surface-elevated rounded-lg p-3">
                      <p className="text-secondary mb-1">ROI</p>
                      <p className={`font-bold text-lg ${campaign.roi >= 3 ? 'text-success' : campaign.roi >= 2 ? 'text-warning' : 'text-error'}`}>
                        {campaign.roi}x
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CAC histórico mejorado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <DollarSign className="w-4 h-4 text-accent" />
              </div>
              <h4 className="font-bold text-primary font-space-grotesk">Evolución CAC - 6 meses</h4>
            </div>
            <div className="h-48 bg-surface-glass backdrop-blur-xl rounded-xl border border-light p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockCommercialData.cacHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--color-text-secondary)', fontWeight: 500 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--color-text-secondary)', fontWeight: 500 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="cac"
                    stroke="var(--color-accent)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-accent)', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: 'var(--color-accent)', stroke: 'white', strokeWidth: 2 }}
                    filter="drop-shadow(0 2px 8px rgba(0,212,255,0.3))"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recomendación IA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-accent/5 via-transparent to-accent/10 rounded-xl p-6 border border-accent/20"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-accent/20 rounded-xl">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-primary mb-2 font-space-grotesk">Optimización Automática IA</p>
                <p className="text-xs text-secondary leading-relaxed mb-4">
                  Redirigir 30% del presupuesto de "Depresión Adultos" hacia "Mindfulness" podría aumentar 
                  el ROI general en 18%. Los referidos muestran la mejor conversión - considera programa de incentivos.
                </p>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-accent text-white rounded-lg font-semibold text-sm hover:shadow-glow transition-all duration-300"
                  >
                    Aplicar Sugerencias
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-surface-elevated text-primary rounded-lg font-semibold text-sm hover:bg-surface-hover transition-all duration-300"
                  >
                    Ver Detalles
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