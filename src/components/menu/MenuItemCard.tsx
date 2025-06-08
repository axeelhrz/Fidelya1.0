"use client"

import { motion } from 'framer-motion'
import { Check, X, Info } from 'lucide-react'
import { MenuItem } from '@/types/menu'
import { useState } from 'react'

interface MenuItemCardProps {
  item: MenuItem
  userType: 'apoderado' | 'funcionario'
  index: number
  optionNumber: number // Nuevo prop para el número de opción
}

export function MenuItemCard({ item, userType, index, optionNumber }: MenuItemCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Determinar si el título o descripción son largos
  const isLongTitle = item.name.length > 40
  const isLongDescription = item.description.length > 80
  const shouldTruncateDescription = isLongDescription && !showFullDescription

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`card-enhanced ${
        item.available
          ? 'hover:border-blue-300 dark:hover:border-blue-600'
          : 'opacity-60 cursor-not-allowed'
      }`}
    >
      <div className="card-content-enhanced">
        {/* Header con número de opción y estado */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`badge-enhanced ${
              item.type === 'almuerzo' ? 'badge-almuerzo' : 'badge-colacion'
            }`}>
              Opción {optionNumber}
            </span>
            <div className={`flex items-center gap-1 badge-enhanced ${
              item.available ? 'badge-available' : 'badge-unavailable'
            }`}>
              {item.available ? (
                <>
                  <Check size={12} />
                  <span>Disponible</span>
                </>
              ) : (
                <>
                  <X size={12} />
                  <span>No disponible</span>
                </>
              )}
            </div>
          </div>

          {/* Precio */}
          <div className="text-right flex-shrink-0">
            <div className={`price-display ${
              item.available 
                ? 'text-slate-900 dark:text-slate-100' 
                : 'text-slate-500 dark:text-slate-500'
            }`}>
              {formatPrice(item.price)}
            </div>
            <div className={`price-label ${
              userType === 'funcionario' 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-blue-600 dark:text-blue-400'
            }`}>
              {userType === 'funcionario' ? 'Precio funcionario' : 'Precio apoderado'}
            </div>
          </div>
        </div>
        
        {/* Título */}
        <div className="mb-3">
          <h4 className={`card-title-enhanced text-base ${
            isLongTitle ? 'text-truncate-2' : ''
          }`} title={isLongTitle ? item.name : undefined}>
            {item.name}
          </h4>
        </div>
        
        {/* Descripción */}
        <div className="space-y-2">
          <p className={`card-description-enhanced ${
            shouldTruncateDescription ? 'text-truncate-3' : ''
          }`}>
            {item.description}
          </p>
          
          {/* Botón para mostrar más descripción si es necesaria */}
          {isLongDescription && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <Info size={12} />
              {showFullDescription ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>

        {/* Información adicional del tipo de usuario */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {item.type === 'almuerzo' ? '🍽️ Almuerzo' : '🥪 Colación'}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {item.type === 'almuerzo' ? '12:00 - 14:00' : '15:30 - 16:30'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}