'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Datos mock para desarrollo
const mockCommercialData = {
  conversionByChannel: [
    { channel: 'Google Ads', leads: 145, conversions: 32, rate: 22.1 },
    { channel: 'Facebook', leads: 89, conversions: 18, rate: 20.2 },
    { channel: 'Referidos', leads: 67, conversions: 28, rate: 41.8 },
    { channel: 'Orgánico', leads: 234, conversions: 45, rate: 19.2 },
    { channel: 'Email', leads: 56, conversions: 12, rate: 21.4 },
  ],
  campaignEffectiveness: [
    { name: 'Ansiedad Jóvenes', spent: 2500, leads: 45, cac: 55.6, status: 'active' },
    { name: 'Terapia Parejas', spent: 1800, leads: 28, cac: 64.3, status: 'active' },
    { name: 'Depresión Adultos', spent: 3200, leads: 52, cac: 61.5, status: 'paused' },
    { name: 'Mindfulness', spent: 1200, leads: 18, cac: 66.7, status: 'active' },
  ],
  cacHistory: [
    { month: 'Jul', cac: 58.2 },
    { month: 'Ago', cac: 62.1 },
    { month: 'Sep', cac: 59.8 },
    { month: 'Oct', cac: 61.5 },
    { month: 'Nov', cac: 58.9 },
    { month: 'Dic', cac: 60.3 },
  ]
};

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6'];

export default function CommercialPanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success bg-green-50';
      case 'paused': return 'text-warning bg-yellow-50';
      case 'stopped': return 'text-error bg-red-50';
      default: return 'text-secondary bg-gray-50';
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-card shadow-card"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-6 border-b border-gray-100 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary">Pipeline Comercial & Marketing</h3>
            <p className="text-sm text-secondary">Análisis de conversión y adquisición</p>
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
          {/* Tasa de Conversión por Canal */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Tasa de Conversión por Canal</h4>
            <div className="space-y-3">
              {mockCommercialData.conversionByChannel.map((channel, index) => (
                <div key={channel.channel} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-primary">{channel.channel}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-secondary">{channel.leads} leads</span>
                    <span className="text-secondary">{channel.conversions} conv.</span>
                    <span className="font-bold text-primary">{channel.rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Efectividad de Campañas */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Efectividad de Campañas Recientes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCommercialData.campaignEffectiveness.map((campaign, index) => (
                <motion.div
                  key={campaign.name}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                    ${selectedCampaign === campaign.name ? 'border-primary bg-blue-50' : 'border-gray-100 bg-white'}
                  `}
                  onClick={() => setSelectedCampaign(
                    selectedCampaign === campaign.name ? null : campaign.name
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-primary text-sm">{campaign.name}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {getStatusText(campaign.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-secondary">Invertido</p>
                      <p className="font-bold text-primary">${campaign.spent}</p>
                    </div>
                    <div>
                      <p className="text-secondary">Leads</p>
                      <p className="font-bold text-primary">{campaign.leads}</p>
                    </div>
                    <div>
                      <p className="text-secondary">CAC</p>
                      <p className="font-bold text-primary">${campaign.cac}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CAC Histórico */}
          <div>
            <h4 className="font-semibold text-primary mb-4">CAC Histórico - Últimos 6 meses</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockCommercialData.cacHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`$${value}`, 'CAC']}
                    labelStyle={{ color: '#1C1E21' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cac"
                    stroke="#6366F1"
                    strokeWidth={3}
                    dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#6366F1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 bg-secondary rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">CAC Promedio</p>
                  <p className="text-lg font-bold text-primary">$60.13</p>
                </div>
                <div>
                  <p className="text-sm text-secondary">LTV Promedio</p>
                  <p className="text-lg font-bold text-success">$192.40</p>
                </div>
                <div>
                  <p className="text-sm text-secondary">Ratio LTV/CAC</p>
                  <p className="text-lg font-bold text-primary">3.2x</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
