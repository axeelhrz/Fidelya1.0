'use client';

import { Check, X, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type FeatureItem = {
  name: string;
  basic: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
  tooltip: string;
};

const features: Array<{ category: string; features: FeatureItem[] }> = [
  {
    category: 'Gestión de Pólizas',
    features: [
      {
        name: 'Número de pólizas',
        basic: '50 pólizas',
        pro: '200 pólizas',
        enterprise: 'Ilimitadas',
        tooltip: 'Cantidad máxima de pólizas que puedes gestionar'
      },
      {
        name: 'Documentos adjuntos',
        basic: '100 MB',
        pro: '1 GB',
        enterprise: '5 GB',
        tooltip: 'Espacio de almacenamiento para documentos'
      },
      {
        name: 'Recordatorios de vencimiento',
        basic: true,
        pro: true,
        enterprise: true,
        tooltip: 'Notificaciones automáticas de vencimientos'
      }
    ]
  },
  {
    category: 'Dashboard y Reportes',
    features: [
      {
        name: 'Dashboard personalizable',
        basic: false,
        pro: true,
        enterprise: true,
        tooltip: 'Personaliza la visualización de tu dashboard'
      },
      {
        name: 'Reportes avanzados',
        basic: false,
        pro: true,
        enterprise: true,
        tooltip: 'Genera reportes detallados y personalizados'
      },
      {
        name: 'Exportación de datos',
        basic: 'Básica (CSV)',
        pro: 'Avanzada (CSV, Excel)',
        enterprise: 'Completa (CSV, Excel, PDF)',
        tooltip: 'Formatos disponibles para exportar datos'
      }
    ]
  },
  {
    category: 'Soporte y Atención',
    features: [
      {
        name: 'Soporte técnico',
        basic: 'Email',
        pro: 'Email + Chat',
        enterprise: '24/7 Prioritario',
        tooltip: 'Canales y tiempos de respuesta del soporte'
      },
      {
        name: 'Capacitación',
        basic: 'Documentación',
        pro: 'Webinars grupales',
        enterprise: 'Sesiones 1:1',
        tooltip: 'Recursos de aprendizaje disponibles'
      },
      {
        name: 'Implementación',
        basic: 'Auto-servicio',
        pro: 'Asistida',
        enterprise: 'Dedicada',
        tooltip: 'Nivel de asistencia en la implementación'
      }
    ]
  }
]

export function ComparisonTable() {
  return (
    <TooltipProvider>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          Compará en detalle los planes
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-gray-200">
                <th className="py-5 px-4 text-left text-sm font-medium text-gray-500 w-1/4">
                  Características
                </th>
                <th className="py-5 px-4 text-center text-sm font-medium text-gray-500">
                  Básico
                </th>
                <th className="py-5 px-4 text-center text-sm font-medium text-gray-500">
                  Pro
                </th>
                <th className="py-5 px-4 text-center text-sm font-medium text-gray-500">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((section) => (
                <>
                  <tr key={section.category}>
                    <td 
                      colSpan={4} 
                      className="py-4 px-4 bg-gray-50 font-semibold text-gray-900"
                    >
                      {section.category}
                    </td>
                  </tr>
                  {section.features.map((feature) => (
                    <tr key={feature.name} className="border-t border-gray-200">
                      <td className="py-5 px-4 text-sm text-gray-900 flex items-center">
                        {feature.name}
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{feature.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      {['basic', 'pro', 'enterprise'].map((plan) => (
                        <td key={plan} className="py-5 px-4 text-center">
                          {typeof feature[plan as keyof FeatureItem] === 'boolean' ? (
                            feature[plan as keyof FeatureItem] ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-gray-700">
                              {feature[plan as keyof FeatureItem]}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}