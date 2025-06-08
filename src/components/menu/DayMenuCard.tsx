"use client"

import { motion } from 'framer-motion'
import { Calendar, Clock, AlertTriangle } from 'lucide-react'
import { DayMenuDisplay } from '@/types/menu'
import { MenuItemCard } from './MenuItemCard'

interface DayMenuCardProps {
  dayMenu: DayMenuDisplay
  userType: 'apoderado' | 'funcionario'
  index: number
}

export function DayMenuCard({ dayMenu, userType, index }: DayMenuCardProps) {
  const isToday = () => {
    const today = new Date().toISOString().split('T')[0]
    return dayMenu.date === today
  }

  const isPastDay = () => {
    const today = new Date().toISOString().split('T')[0]
    return dayMenu.date < today
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`card-enhanced ${
        isToday()
          ? 'border-blue-300 dark:border-blue-600 ring-2 ring-blue-100 dark:ring-blue-900/30'
          : ''
      } ${isPastDay() ? 'opacity-75' : ''}`}
    >
      {/* Encabezado del día */}
      <div className={`p-4 border-b border-slate-200 dark:border-slate-700 ${
        isToday()
          ? 'bg-blue-50 dark:bg-blue-900/20'
          : 'bg-slate-50 dark:bg-slate-800/50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isToday()
                ? 'bg-blue-100 dark:bg-blue-900/30'
                : 'bg-slate-100 dark:bg-slate-700'
            }`}>
              <Calendar size={18} className={
                isToday()
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400'
              } />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-clean truncate">
                {dayMenu.dayLabel}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-clean truncate">
                {dayMenu.dateFormatted}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            {isToday() && (
              <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                <Clock size={14} />
                <span className="text-xs font-medium">Hoy</span>
              </div>
            )}

            {isPastDay() && (
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full">
                <span className="text-xs font-medium">Pasado</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido del menú */}
      <div className="p-4">
        {!dayMenu.hasItems ? (
          <div className="text-center py-12">
            <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100 mb-3 text-clean">
              Menú no disponible
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-clean max-w-md mx-auto leading-relaxed">
              El menú para este día aún no ha sido publicado por la administración. 
              Te notificaremos cuando esté disponible.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Almuerzos */}
            {dayMenu.almuerzos.length > 0 && (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🍽️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-clean">
                      Almuerzos
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                        12:00 - 14:00
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {dayMenu.almuerzos.length} opción{dayMenu.almuerzos.length !== 1 ? 'es' : ''} disponible{dayMenu.almuerzos.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4">
                  {dayMenu.almuerzos.map((item, itemIndex) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      userType={userType}
                      index={itemIndex}
                      optionNumber={itemIndex + 1}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Separador entre almuerzos y colaciones */}
            {dayMenu.almuerzos.length > 0 && dayMenu.colaciones.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-700"></div>
            )}

            {/* Colaciones */}
            {dayMenu.colaciones.length > 0 && (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🥪</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-clean">
                      Colaciones
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full font-medium">
                        15:30 - 16:30
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {dayMenu.colaciones.length} opción{dayMenu.colaciones.length !== 1 ? 'es' : ''} disponible{dayMenu.colaciones.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4">
                  {dayMenu.colaciones.map((item, itemIndex) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      userType={userType}
                      index={itemIndex}
                      optionNumber={itemIndex + 1}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}