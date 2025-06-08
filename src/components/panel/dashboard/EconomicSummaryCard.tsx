"use client"

import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, Calculator, PieChart } from 'lucide-react'
import { EconomicSummary } from '@/types/dashboard'
import { formatCurrency, calculateProjectedTotal } from '@/lib/dashboardUtils'

interface EconomicSummaryCardProps {
  economicSummary: EconomicSummary
}

export function EconomicSummaryCard({ economicSummary }: EconomicSummaryCardProps) {
  const remainingDays = 5 - economicSummary.selectedDays
  const projectedTotal = calculateProjectedTotal(economicSummary, remainingDays)
  const hasSelections = economicSummary.selectedDays > 0

  // Calcular porcentajes para el gráfico visual
  const lunchPercentage = economicSummary.estimatedTotal > 0 
    ? Math.round((economicSummary.totalLunches * economicSummary.lunchPrice / economicSummary.estimatedTotal) * 100)
    : 0
  const snackPercentage = 100 - lunchPercentage

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="panel-card"
    >
      <div className="panel-card-content">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-clean">
              Resumen Económico
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-clean">
              Cálculo automático
            </p>
          </div>
        </div>

        {hasSelections ? (
          <div className="space-y-4">
            {/* Total actual destacado */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300 text-clean">
                  Total actual
                </span>
                <div className="flex items-center space-x-2">
                  <PieChart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 text-clean">
                    {formatCurrency(economicSummary.estimatedTotal)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 text-clean">
                {economicSummary.selectedDays} días seleccionados
              </p>
            </div>

            {/* Desglose detallado */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 text-clean">
                  Desglose por tipo:
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400 text-clean">
                  {economicSummary.totalLunches + economicSummary.totalSnacks} items
                </span>
              </div>
              
              {economicSummary.totalLunches > 0 && (
                <div className="bg-white dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 text-clean">
                        Almuerzos
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100 text-clean">
                      {formatCurrency(economicSummary.totalLunches * economicSummary.lunchPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="text-clean">
                      {economicSummary.totalLunches} × {formatCurrency(economicSummary.lunchPrice)}
                    </span>
                    <span className="text-clean">
                      {lunchPercentage}% del total
                    </span>
                  </div>
                </div>
              )}

              {economicSummary.totalSnacks > 0 && (
                <div className="bg-white dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 text-clean">
                        Colaciones
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100 text-clean">
                      {formatCurrency(economicSummary.totalSnacks * economicSummary.snackPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="text-clean">
                      {economicSummary.totalSnacks} × {formatCurrency(economicSummary.snackPrice)}
                    </span>
                    <span className="text-clean">
                      {snackPercentage}% del total
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Proyección mejorada */}
            {remainingDays > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300 text-clean">
                    Proyección semanal completa
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-blue-600 dark:text-blue-400 text-clean">
                    Si completas los {remainingDays} días restantes con almuerzo:
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700 dark:text-blue-300 text-clean">
                      Total proyectado:
                    </span>
                    <span className="text-lg font-bold text-blue-700 dark:text-blue-300 text-clean">
                      {formatCurrency(projectedTotal)}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 text-clean">
                    Diferencia: +{formatCurrency(projectedTotal - economicSummary.estimatedTotal)}
                  </p>
                </div>
              </div>
            )}

            {/* Información de precios actualizada */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-3">
                <Calculator className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-clean">
                  Precios unitarios vigentes
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-white dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-clean mb-1">Almuerzo</p>
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-clean">
                    {formatCurrency(economicSummary.lunchPrice)}
                  </p>
                </div>
                <div className="text-center p-2 bg-white dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-clean mb-1">Colación</p>
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-clean">
                    {formatCurrency(economicSummary.snackPrice)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Calculator className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-clean mb-2">
              Aún no hay pedido iniciado
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 text-clean mb-4">
              Los cálculos aparecerán cuando selecciones tus menús
            </p>
            
            {/* Mostrar precios base cuando no hay selecciones */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 text-clean mb-2">
                Precios vigentes:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-clean">Almuerzo:</span>
                  <p className="font-medium text-slate-700 dark:text-slate-300 text-clean">
                    {formatCurrency(economicSummary.lunchPrice)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-clean">Colación:</span>
                  <p className="font-medium text-slate-700 dark:text-slate-300 text-clean">
                    {formatCurrency(economicSummary.snackPrice)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}