"use client"

import { motion } from 'framer-motion'
import { Calendar, CheckCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react'
import { WeeklyMenuInfo } from '@/types/dashboard'
import { getWeekDateRange } from '@/lib/dashboardUtils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface WeeklyMenuInfoCardProps {
  weeklyMenuInfo: WeeklyMenuInfo
}

export function WeeklyMenuInfoCard({ weeklyMenuInfo }: WeeklyMenuInfoCardProps) {
  const isPublished = weeklyMenuInfo.isPublished
  const weekRange = weeklyMenuInfo.weekStart && weeklyMenuInfo.weekEnd 
    ? getWeekDateRange(weeklyMenuInfo.weekStart, weeklyMenuInfo.weekEnd)
    : 'Semana actual'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="panel-card"
    >
      <div className="panel-card-content">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isPublished 
              ? 'bg-gradient-to-br from-emerald-500 to-green-500'
              : 'bg-gradient-to-br from-amber-500 to-orange-500'
          }`}>
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-clean">
              Menú Semanal
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-clean">
              {weekRange}
            </p>
          </div>
        </div>

        {/* Estado del menú */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            {isPublished ? (
              <>
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                    Menú disponible
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-clean mt-1">
                    El menú está publicado y listo para pedidos
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                    Menú no disponible
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-clean mt-1">
                    El menú aún no ha sido publicado
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Información adicional */}
          {isPublished && weeklyMenuInfo.publishedAt && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300 text-clean">
                  Información del menú
                </span>
              </div>
              <div className="space-y-1 text-xs text-emerald-600 dark:text-emerald-400">
                <p className="text-clean">
                  Publicado: {format(weeklyMenuInfo.publishedAt, "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                </p>
                {weeklyMenuInfo.lastUpdated && (
                  <p className="text-clean">
                    Última actualización: {format(weeklyMenuInfo.lastUpdated, "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                  </p>
                )}
              </div>
            </div>
          )}

          {!isPublished && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300 text-clean">
                  Estado del menú
                </span>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 text-clean">
                El equipo de cocina está preparando el menú para esta semana. 
                Te notificaremos cuando esté disponible.
              </p>
            </div>
          )}

          {/* Botón de acción */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href={isPublished ? "/panel" : "/menu"} className="block">
              <Button 
                className={`w-full ${
                  isPublished
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                <span>
                  {isPublished ? 'Ver menú completo' : 'Ver menús anteriores'}
                </span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Información adicional para usuarios */}
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-clean">
              {isPublished 
                ? 'Puedes realizar cambios hasta el miércoles a las 13:00'
                : 'Los menús se publican generalmente los domingos'
              }
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}