"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Trash2, Eye, EyeOff, DollarSign, Clock, Utensils, Coffee } from 'lucide-react'
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

  // Configuración de colores por tipo
  const typeConfig = {
    almuerzo: {
      icon: Utensils,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      darkBgGradient: 'from-blue-900/20 to-indigo-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-700 dark:text-blue-300',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      label: 'Almuerzo'
    },
    colacion: {
      icon: Coffee,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      darkBgGradient: 'from-emerald-900/20 to-teal-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
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
        whileHover={{ y: -4, scale: 1.02 }}
        className="group w-full"
      >
        <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl w-full ${
          item.active 
            ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600' 
            : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 opacity-75'
        }`}>
          {/* Gradiente decorativo superior */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`} />
          
          {/* Indicador de estado lateral */}
          <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-all duration-300 ${
            item.active 
              ? `bg-gradient-to-b ${config.gradient}` 
              : 'bg-slate-300 dark:bg-slate-600'
          }`} />

          <CardContent className="p-6 pl-8">
            {/* Header con código y controles */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center space-x-3">
                {/* Icono del tipo */}
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
                  <TypeIcon className="w-4 h-4 text-white" />
                </div>
                
                {/* Código */}
                <Badge 
                  variant="outline"
                  className={`text-sm font-bold px-3 py-1 ${config.badgeColor}`}
                >
                  {item.code}
                </Badge>
              </div>
              
              {/* Controles de acción */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  disabled={isLoading}
                  className="h-9 w-9 p-0 hover:bg-blue-100 hover:text-blue-700 rounded-xl"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="h-9 w-9 p-0 hover:bg-red-100 hover:text-red-700 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="space-y-4">
              {/* Título principal */}
              <div>
                <h4 className={`font-bold text-lg leading-tight break-words ${
                  item.active 
                    ? 'text-slate-900 dark:text-slate-100' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {title}
                </h4>
              </div>

              {/* Descripción adicional (si existe y es diferente del título) */}
              {description && (
                <div className={`p-3 rounded-lg bg-gradient-to-r ${config.bgGradient} dark:${config.darkBgGradient} ${config.borderColor} border`}>
                  <p className={`text-sm leading-relaxed break-words ${
                    item.active 
                      ? 'text-slate-700 dark:text-slate-300' 
                      : 'text-slate-500 dark:text-slate-500'
                  }`}>
                    {description}
                  </p>
                </div>
              )}

              {/* Badges de estado */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Estado activo/inactivo */}
                <Badge 
                  variant="outline"
                  className={`text-xs font-medium ${
                    item.active 
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                      : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600'
                  }`}
                >
                  {item.active ? (
                    <Eye className="w-3 h-3 mr-1" />
                  ) : (
                    <EyeOff className="w-3 h-3 mr-1" />
                  )}
                  {item.active ? 'Disponible' : 'No disponible'}
                </Badge>

                {/* Precio especial */}
                {hasCustomPrice && (
                  <Badge variant="outline" className="text-xs font-medium bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Precio especial
                  </Badge>
                )}

                {/* Tipo de menú */}
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium ${config.badgeColor} dark:bg-opacity-20`}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
            </div>

            {/* Footer con precio */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Precio:
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <p className={`font-bold text-xl ${
                      item.active 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-slate-500 dark:text-slate-500'
                    }`}>
                      ${displayPrice.toLocaleString('es-CL')}
                    </p>
                    {hasCustomPrice && (
                      <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
                        Especial
                      </Badge>
                    )}
                  </div>
                  {!hasCustomPrice && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Precio base
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          {/* Overlay de hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
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