"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Trash2, Eye, EyeOff, DollarSign, Clock, Utensils, Coffee, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AdminMenuItem } from '@/types/adminMenu'
import { PRICES } from '@/types/panel'

interface MenuItemCardProps {
  item: AdminMenuItem
  onEdit: (item: AdminMenuItem) => void
  onDelete: (item: AdminMenuItem) => void
  isLoading?: boolean
}

export function MenuItemCard({ 
  item, 
  onEdit, 
  onDelete, 
  isLoading = false
}: MenuItemCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleEdit = () => {
    onEdit(item)
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    onDelete(item)
    setShowDeleteDialog(false)
  }

  // Determinar el precio a mostrar
  const getDisplayPrice = () => {
    if (item.price && item.price > 0) {
      return item.price
    }
    return item.type === 'almuerzo' 
      ? PRICES.apoderado.almuerzo 
      : PRICES.apoderado.colacion
  }

  const hasCustomPrice = item.price && item.price > 0
  const displayPrice = getDisplayPrice()

  // Obtener título y descripción correctamente
  const title = item.title || item.description || 'Sin título'
  const description = item.title && item.description && item.title !== item.description 
    ? item.description 
    : undefined

  // Verificar si el contenido es largo
  const isLongTitle = title.length > 50
  const isLongDescription = description && description.length > 100
  const shouldShowExpandButton = isLongTitle || isLongDescription

  // Configuración de colores por tipo
  const typeConfig = {
    almuerzo: {
      icon: Utensils,
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-700 dark:text-blue-300',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
      label: 'Almuerzo'
    },
    colacion: {
      icon: Coffee,
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
      label: 'Colación'
    }
  }

  const config = typeConfig[item.type]
  const TypeIcon = config.icon

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2 }}
        className="group w-full"
      >
        <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg w-full ${
          item.active 
            ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600' 
            : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 opacity-75'
        }`}>
          {/* Indicador de tipo en la parte superior */}
          <div className={`h-1 bg-gradient-to-r ${config.gradient}`} />

          <CardContent className="p-5">
            {/* Header con código y controles */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Icono del tipo */}
                <div className={`p-2 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
                  <TypeIcon className={`w-4 h-4 ${config.textColor}`} />
                </div>
                
                {/* Código y tipo */}
                <div className="space-y-1">
                  <Badge className={`text-sm font-bold ${config.badgeColor}`}>
                    {item.code}
                  </Badge>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {config.label}
                  </div>
                </div>
              </div>
              
              {/* Controles de acción */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  disabled={isLoading}
                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="space-y-3">
              {/* Título */}
              <div>
                <h4 className={`font-bold text-lg leading-tight ${
                  item.active 
                    ? 'text-slate-900 dark:text-slate-100' 
                    : 'text-slate-600 dark:text-slate-400'
                } ${!isExpanded && isLongTitle ? 'text-truncate-2' : ''}`}>
                  {title}
                </h4>
              </div>

              {/* Descripción adicional */}
              {description && (
                <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3`}>
                  <p className={`text-sm leading-relaxed ${
                    item.active 
                      ? 'text-slate-700 dark:text-slate-300' 
                      : 'text-slate-500 dark:text-slate-500'
                  } ${!isExpanded && isLongDescription ? 'text-truncate-3' : ''}`}>
                    {description}
                  </p>
                </div>
              )}

              {/* Botón para expandir/contraer */}
              {shouldShowExpandButton && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp size={12} />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown size={12} />
                      Ver más
                    </>
                  )}
                </button>
              )}

              {/* Estados y badges */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Estado activo/inactivo */}
                <Badge className={`text-xs ${
                  item.active 
                    ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                    : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600'
                }`}>
                  {item.active ? (
                    <>
                      <Eye className="w-3 h-3 mr-1" />
                      Disponible
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3 mr-1" />
                      No disponible
                    </>
                  )}
                </Badge>

                {/* Precio especial */}
                {hasCustomPrice && (
                  <Badge className="text-xs bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Precio especial
                  </Badge>
                )}

                {/* Horario */}
                <Badge className={`text-xs ${config.badgeColor}`}>
                  <Clock className="w-3 h-3 mr-1" />
                  {item.type === 'almuerzo' ? '12:00-14:00' : '15:30-16:30'}
                </Badge>
              </div>
            </div>

            {/* Footer con precio */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Precio:
                </span>
                
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className={`text-xl font-bold ${
                      item.active 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-slate-500 dark:text-slate-500'
                    }`}>
                      ${displayPrice.toLocaleString('es-CL')}
                    </span>
                    {hasCustomPrice && (
                      <Badge className="text-xs bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400">
                        Especial
                      </Badge>
                    )}
                  </div>
                  {!hasCustomPrice && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Precio base
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar menú?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el menú &quot;{title}&quot; ({item.code}).
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}