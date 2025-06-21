'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Download, Play, CheckCircle, AlertCircle, Clock, Sparkles, BarChart3, Shield } from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'recommendation' | 'simulation' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  estimatedValue?: string;
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
    actionable: true,
    estimatedValue: '+$12.5k/mes'
  },
  {
    id: '2',
    type: 'alert',
    title: 'Patrón de cancelaciones detectado',
    description: 'Se detectó un aumento del 23% en cancelaciones los viernes por la tarde en las últimas 4 semanas.',
    impact: 'medium',
    confidence: 92,
    actionable: true,
    estimatedValue: '-$3.2k/mes'
  },
  {
    id: '3',
    type: 'simulation',
    title: 'Proyección de capacidad Q2',
    description: 'Con el crecimiento actual, se alcanzará 95% de capacidad en abril. Considerar expansión o contratación.',
    impact: 'high',
    confidence: 78,
    actionable: true,
    estimatedValue: '+$25k/mes'
  }
];

const complianceMetrics = {
  backups: 98,
  consents: 94,
  accessVerification: 89,
  dataEncryption: 96,
  overall: 94
};

export default function AIInsightsFooter() {
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-error bg-error-bg border-error/20';
      case 'medium':
        return 'text-warning bg-warning-bg border-warning/20';
      default:
        return 'text-info bg-info-bg border-info/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recommendation':
        return <TrendingUp className="w-4 h-4" />;
      case 'simulation':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recommendation':
        return 'text-success bg-success-bg';
      case 'simulation':
        return 'text-accent bg-accent/10';
      default:
        return 'text-warning bg-warning-bg';
    }
  };

  const handleSimulate = async (insight: AIInsight) => {
    setIsSimulating(true);
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSimulating(false);
    console.log('Simulando:', insight);
  };

  const generateDailyCEOBrief = () => {
    console.log('Generando Daily CEO Brief...');
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* AI Insights */}
      <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-card border border-purple-100/50 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-inverse" />
              </div>
              <div>
                <h3 className="font-semibold text-primary flex items-center space-x-2">
                  <span>Insights de IA</span>
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </h3>
                <p className="text-sm text-secondary">Recomendaciones basadas en análisis predictivo</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium text-primary">3 insights activos</div>
              <div className="text-xs text-secondary">Última actualización: hace 2h</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {mockInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className={`
                  group relative p-4 rounded-lg border cursor-pointer transition-all duration-300
                  ${selectedInsight?.id === insight.id 
                    ? 'border-accent bg-surface shadow-elevated' 
                    : 'border-border-light bg-surface/70 hover:bg-surface hover:border-border-medium hover:shadow-card'
                  }
                `}
                onClick={() => setSelectedInsight(insight)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-md ${getTypeColor(insight.type)}`}>
                      {getTypeIcon(insight.type)}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(insight.impact)}`}>
                      {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Medio' : 'Bajo'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-primary">{insight.confidence}%</div>
                    <div className="text-xs text-secondary">confianza</div>
                  </div>
                </div>
                
                {/* Content */}
                <h4 className="font-medium text-primary text-sm mb-2 line-clamp-2">
                  {insight.title}
                </h4>
                
                <p className="text-xs text-secondary mb-3 line-clamp-3">
                  {insight.description}
                </p>

                {/* Value and Action */}
                <div className="flex items-center justify-between">
                  {insight.estimatedValue && (
                    <div className="text-xs">
                      <span className="text-secondary">Impacto: </span>
                      <span className="font-medium text-primary">{insight.estimatedValue}</span>
                    </div>
                  )}
                  
                  {insight.actionable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSimulate(insight);
                      }}
                      disabled={isSimulating}
                      className="ml-auto bg-accent text-inverse text-xs px-3 py-1.5 rounded-md hover:bg-accent-light transition-colors disabled:opacity-50 flex items-center space-x-1"
                    >
                      {isSimulating ? (
                        <>
                          <div className="w-3 h-3 border border-inverse border-t-transparent rounded-full animate-spin" />
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
                </div>

                {/* Selection indicator */}
                {selectedInsight?.id === insight.id && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Daily CEO Brief */}
          <div className="bg-surface/80 backdrop-blur-sm rounded-lg border border-border-light p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Download className="w-4 h-4 text-inverse" />
                </div>
                <div>
                  <h4 className="font-medium text-primary">Daily CEO Brief</h4>
                  <p className="text-sm text-secondary">Resumen ejecutivo personalizado</p>
                </div>
              </div>
              <button
                onClick={generateDailyCEOBrief}
                className="flex items-center space-x-2 bg-primary text-inverse px-4 py-2 rounded-lg hover:bg-primary-light transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Generar PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de Cumplimiento Mejorado */}
      <div className="bg-surface rounded-card border border-border-light shadow-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success-bg rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">Indicador de Cumplimiento</h3>
                <p className="text-sm text-secondary">Estado de procesos críticos y seguridad</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-primary">{complianceMetrics.overall}%</div>
              <div className="text-sm text-secondary">Cumplimiento general</div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Backups automáticos', value: complianceMetrics.backups, icon: CheckCircle, description: 'Respaldos diarios completados' },
              { name: 'Consentimientos firmados', value: complianceMetrics.consents, icon: CheckCircle, description: 'Documentos legales actualizados' },
              { name: 'Verificación de accesos', value: complianceMetrics.accessVerification, icon: Clock, description: 'Auditoría de permisos pendiente' },
              { name: 'Cifrado de datos', value: complianceMetrics.dataEncryption, icon: CheckCircle, description: 'Protección de información activa' },
            ].map((metric, index) => (
              <motion.div 
                key={metric.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <metric.icon className={`w-4 h-4 ${
                    metric.value >= 95 ? 'text-success' : 
                    metric.value >= 85 ? 'text-warning' : 'text-error'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-primary">{metric.name}</div>
                    <div className="text-xs text-secondary">{metric.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 bg-surface rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className={`h-2 rounded-full ${
                        metric.value >= 95 ? 'bg-success' : 
                        metric.value >= 85 ? 'bg-warning' : 'bg-error'
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium text-primary w-10 text-right">
                    {metric.value}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Compliance Summary */}
          <div className="mt-6 p-4 bg-gradient-to-r from-success-bg to-info-bg rounded-lg border border-success/20">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="font-medium text-success">Estado de Cumplimiento: Excelente</p>
                <p className="text-sm text-success/80">
                  Todos los procesos críticos están funcionando correctamente. 
                  Próxima auditoría programada para el 15 de enero.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}