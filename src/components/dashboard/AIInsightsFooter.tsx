'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Download, Play, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'recommendation' | 'simulation' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
}

// Datos mock para desarrollo
const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'recommendation',
    title: 'Incrementar tarifas 5% en julio',
    description: 'Análisis histórico sugiere que un aumento del 5% en tarifas durante julio tendría mínimo impacto en retención de pacientes.',
    impact: 'high',
    confidence: 87,
    actionable: true
  },
  {
    id: '2',
    type: 'alert',
    title: 'Patrón de cancelaciones detectado',
    description: 'Se detectó un aumento del 23% en cancelaciones los viernes por la tarde en las últimas 4 semanas.',
    impact: 'medium',
    confidence: 92,
    actionable: true
  },
  {
    id: '3',
    type: 'simulation',
    title: 'Proyección de capacidad Q2',
    description: 'Con el crecimiento actual, se alcanzará 95% de capacidad en abril. Considerar expansión o contratación.',
    impact: 'high',
    confidence: 78,
    actionable: true
  }
];

const complianceMetrics = {
  backups: 98,
  consents: 94,
  accessVerification: 89,
  overall: 94
};

export default function AIInsightsFooter() {
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-error bg-red-50 border-red-200';
      case 'medium':
        return 'text-warning bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recommendation':
        return <TrendingUp className="w-4 h-4" />;
      case 'simulation':
        return <Play className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleSimulate = async (insight: AIInsight) => {
    setIsSimulating(true);
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSimulating(false);
    // Aquí se abriría el modal de simulación
    console.log('Simulando:', insight);
  };

  const generateDailyCEOBrief = () => {
    // Aquí se generaría y descargaría el PDF
    console.log('Generando Daily CEO Brief...');
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 space-y-6"
    >
      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-card p-6 border border-purple-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary">Insights de IA</h3>
            <p className="text-sm text-secondary">Recomendaciones basadas en análisis predictivo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {mockInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`
                p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${selectedInsight?.id === insight.id ? 'border-primary bg-white' : 'border-gray-100 bg-white/50'}
              `}
              onClick={() => setSelectedInsight(insight)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(insight.type)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(insight.impact)}`}>
                    {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Medio' : 'Bajo'}
                  </span>
                </div>
                <span className="text-xs text-secondary">{insight.confidence}% confianza</span>
              </div>
              
              <h4 className="font-semibold text-primary text-sm mb-2">
                {insight.title}
              </h4>
              
              <p className="text-xs text-secondary mb-3 line-clamp-2">
                {insight.description}
              </p>
              
              {insight.actionable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSimulate(insight);
                  }}
                  disabled={isSimulating}
                  className="w-full bg-primary text-white text-xs py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSimulating ? (
                    <>
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      <span>Simulando...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Simular</span>
                    </>
                  )}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Daily CEO Brief */}
        <div className="flex items-center justify-between bg-white/70 rounded-xl p-4">
          <div>
            <h4 className="font-semibold text-primary">Daily CEO Brief</h4>
            <p className="text-sm text-secondary">Resumen ejecutivo personalizado</p>
          </div>
          <button
            onClick={generateDailyCEOBrief}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Generar PDF</span>
          </button>
        </div>
      </div>

      {/* Indicador de Cumplimiento */}
      <div className="bg-white rounded-card shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg text-primary">Indicador de Cumplimiento (MSP)</h3>
            <p className="text-sm text-secondary">Estado de procesos críticos y seguridad</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{complianceMetrics.overall}%</div>
            <div className="text-sm text-secondary">Cumplimiento general</div>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Backups automáticos', value: complianceMetrics.backups, icon: CheckCircle },
            { name: 'Consentimientos firmados', value: complianceMetrics.consents, icon: CheckCircle },
            { name: 'Verificación de accesos', value: complianceMetrics.accessVerification, icon: Clock },
          ].map((metric, index) => (
            <div key={metric.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <metric.icon className={`w-4 h-4 ${metric.value >= 95 ? 'text-success' : metric.value >= 85 ? 'text-warning' : 'text-error'}`} />
                <span className="text-sm text-primary">{metric.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${metric.value >= 95 ? 'bg-success' : metric.value >= 85 ? 'bg-warning' : 'bg-error'}`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-primary w-10 text-right">
                  {metric.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.footer>
  );
}
