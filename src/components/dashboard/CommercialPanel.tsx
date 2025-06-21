'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Target, TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Datos mock para desarrollo
const mockCommercialData = {
  conversionByChannel: [
    { channel: 'Google Ads', leads: 145, conversions: 32, rate: 22.1, color: 'var(--accent)' },
    { channel: 'Facebook', leads: 89, conversions: 18, rate: 20.2, color: 'var(--success)' },
    { channel: 'Referidos', leads: 67, conversions: 28, rate: 41.8, color: 'var(--warning)' },
    { channel: 'Orgánico', leads: 234, conversions: 45, rate: 19.2, color: 'var(--info)' },
    { channel: 'Email', leads: 56, conversions: 12, rate: 21.4, color: 'var(--error)' },
  ],
  campaignEffectiveness: [
    { name: 'Ansiedad Jóvenes', spent: 2500, leads: 45, cac: 55.6, status: 'active', roi: 2.8 },
    { name: 'Terapia Parejas', spent: 1800, leads: 28, cac: 64.3, status: 'active', roi: 3.2 },
    { name: 'Depresión Adultos', spent: 3200, leads: 52, cac: 61.5, status: 'paused', roi: 2.1 },
    { name: 'Mindfulness', spent: 1200, leads: 18, cac: 66.7, status: 'active', roi: 3.5 },
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
    ratio: 3.2
  }
};

export default function CommercialPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success bg-success-bg border-success/20';
      case 'paused': return 'text-warning bg-warning-bg border-warning/20';
      case 'stopped': return 'text-error bg-error-bg border-error/20';
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface p-3 rounded-lg shadow-floating border border-border-light">
          <p className="font-medium text-primary mb-2">{label}</p>
          <p className="text-sm">
            <span className="text-secondary">CAC: </span>
            <span className="font-medium">${payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-surface rounded-card border border-border-light hover:border-border-medium transition-colors"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-primary">Pipeline Comercial & Marketing</h3>
            <p className="text-sm text-secondary">Análisis de conversión y adquisición</p>
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
          {/* Resumen de métricas clave */}
          <div className="pt-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-surface-elevated rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-primary">
                  ${mockCommercialData.summary.avgCAC}
                </div>
                <div className="text-xs text-secondary">CAC Promedio</div>
              </div>
              <div className="bg-surface-elevated rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-success">
                  ${mockCommercialData.summary.avgLTV}
                </div>
                <div className="text-xs text-secondary">LTV Promedio</div>
              </div>
              <div className="bg-surface-elevated rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-accent">
                  {mockCommercialData.summary.ratio}x
                </div>
                <div className="text-xs text-secondary">Ratio LTV/CAC</div>
              </div>
            </div>
          </div>

          {/* Tasa de Conversión por Canal */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-4 h-4 text-secondary" />
              <h4 className="font-medium text-primary">Conversión por Canal</h4>
            </div>
            <div className="space-y-2">
              {mockCommercialData.conversionByChannel.map((channel, index) => (
                <div key={channel.channel} className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: channel.color }}
                    />
                    <span className="font-medium text-primary text-sm">{channel.channel}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-secondary">{channel.leads}</span>
                    <span className="text-secondary">{channel.conversions}</span>
                    <span className="font-semibold text-primary min-w-[3rem] text-right">
                      {channel.rate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Efectividad de Campañas */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-4 h-4 text-secondary" />
              <h4 className="font-medium text-primary">Campañas Recientes</h4>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {mockCommercialData.campaignEffectiveness.map((campaign, index) => (
                <motion.div
                  key={campaign.name}
                  whileHover={{ scale: 1.01 }}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all duration-200
                    ${selectedCampaign === campaign.name 
                      ? 'border-accent bg-accent/5' 
                      : 'border-border-light hover:border-border-medium bg-surface-elevated'
                    }
                  `}
                  onClick={() => setSelectedCampaign(
                    selectedCampaign === campaign.name ? null : campaign.name
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-primary text-sm">{campaign.name}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                      {getStatusText(campaign.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 text-xs">
                    <div>
                      <p className="text-secondary">Invertido</p>
                      <p className="font-semibold text-primary">${campaign.spent}</p>
                    </div>
                    <div>
                      <p className="text-secondary">Leads</p>
                      <p className="font-semibold text-primary">{campaign.leads}</p>
                    </div>
                    <div>
                      <p className="text-secondary">CAC</p>
                      <p className="font-semibold text-primary">${campaign.cac}</p>
                    </div>
                    <div>
                      <p className="text-secondary">ROI</p>
                      <p className={`font-semibold ${campaign.roi >= 3 ? 'text-success' : campaign.roi >= 2 ? 'text-warning' : 'text-error'}`}>
                        {campaign.roi}x
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CAC Histórico */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-4 h-4 text-secondary" />
              <h4 className="font-medium text-primary">Evolución CAC - 6 meses</h4>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockCommercialData.cacHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="cac"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--accent)', strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 4, fill: 'var(--accent)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}