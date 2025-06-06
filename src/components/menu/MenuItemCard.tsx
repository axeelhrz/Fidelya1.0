"use client"

import { motion } from 'framer-motion'
import { DollarSign, AlertCircle, CheckCircle } from 'lucide-react'
import { MenuItemDisplay } from '@/types/menu'

interface MenuItemCardProps {
  item: MenuItemDisplay
  userType: 'funcionario' | 'estudiante'
  index: number
}

export function MenuItemCard({ item, userType, index }: MenuItemCardProps) {
  const getPrice = () => {
    if (item.type === 'almuerzo') {
      return userType === 'funcionario' ? 4875 : 5500
    } else {
      return userType === 'funcionario' ? 1800 : 2000
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getTypeColor = () => {
    if (item.type === 'almuerzo') {
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    } else {
      return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
    }
  }

  const getTypeIcon = () => {
    if (item.type === 'almuerzo') {
      return '🍽️'
    } else {
      return '🥪'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative p-4 rounded-lg border transition-all duration-200 ${
        item.available
          ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60'
      }`}
    >
      {/* Estado de disponibilidad */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor()}`}>
            <span className="mr-1">{getTypeIcon()}</span>
            {item.type === 'almuerzo' ? 'Almuerzo' : 'Colación'}
          </span>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
            {item.code}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {item.available ? (
            <CheckCircle size={16} className="text-emerald-500" />
          ) : (
            <AlertCircle size={16} className="text-amber-500" />
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="space-y-2">
        <h3 className={`font-medium text-clean ${
          item.available 
            ? 'text-slate-800 dark:text-slate-100' 
            : 'text-slate-500 dark:text-slate-400'
        }`}>
          {item.name}
        </h3>
        
        <p className={`text-sm text-clean ${
          item.available 
            ? 'text-slate-600 dark:text-slate-400' 
            : 'text-slate-400 dark:text-slate-500'
        }`}>
          {item.description}
        </p>

        {/* Precio y estado */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-1">
            <DollarSign size={14} className="text-slate-500 dark:text-slate-400" />
            <span className={`text-sm font-medium ${
              item.available 
                ? 'text-slate-700 dark:text-slate-300' 
                : 'text-slate-400 dark:text-slate-500'
            }`}>
              {formatPrice(getPrice())}
            </span>
          </div>

          <span className={`text-xs px-2 py-1 rounded-full ${
            item.available
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
          }`}>
            {item.available ? 'Disponible' : 'No disponible'}
          </span>
        </div>
      </div>

      {/* Overlay para items no disponibles */}
      {!item.available && (
        <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={24} className="text-amber-500 mx-auto mb-1" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Temporalmente no disponible
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
