"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Trash2, Eye, EyeOff, DollarSign, Utensils, Coffee, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-700 dark:text-blue-300',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    },
    colacion: {
      icon: Coffee,
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
    }
  }

  const config = typeConfig[item.type]
  const TypeIcon = config.icon

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="group w-full"
      >
        <Card className={`relative overflow-hidden transition-all duration-200 hover:shadow-md w-full ${
          item.active 
            ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600' 
            : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 opacity-75'
        }`}>
          <CardContent className="p-3">
            {/* Header compacto */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className={`p-1.5 rounded-lg ${config.bgColor} ${config.borderColor} border flex-shrink-0`}>
                  <TypeIcon className={`w-3 h-3 ${config.textColor}`} />
                </div>
                <Badge className={`text-xs font-bold ${config.badgeColor} flex-shrink-0`}>
                  {item.code}
                </Badge>
              </div>
              
              {/* Menú de acciones */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    disabled={isLoading}
                  >
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="w-3 h-3 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="w-3 h-3 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Título compacto */}
            <div className="mb-2">
              <h4 className={`font-semibold text-sm leading-tight ${
                item.active 
                  ? 'text-slate-900 dark:text-slate-100' 
                  : 'text-slate-600 dark:text-slate-400'
              } text-truncate-2`} title={title}>
                {title}
              </h4>
            </div>

            {/* Descripción compacta (si existe y es diferente) */}
            {description && (
              <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-2 mb-2`}>
                <p className={`text-xs leading-relaxed ${
                  item.active 
                    ? 'text-slate-700 dark:text-slate-300' 
                    : 'text-slate-500 dark:text-slate-500'
                } text-truncate-2`} title={description}>
                  {description}
                </p>
              </div>
            )}

            {/* Footer con estado y precio */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Badge className={`text-xs ${
                  item.active 
                    ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                    : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600'
                }`}>
                  {item.active ? (
                    <>
                      <Eye className="w-2 h-2 mr-1" />
                      Activo
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-2 h-2 mr-1" />
                      Inactivo
                    </>
                  )}
                </Badge>
                
                {hasCustomPrice && (
                  <Badge className="text-xs bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">
                    <DollarSign className="w-2 h-2 mr-1" />
                    Especial
                  </Badge>
                )}
              </div>
              
              <div className="text-right">
                <span className={`text-sm font-bold ${
                  item.active 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-slate-500 dark:text-slate-500'
                }`}>
                  ${displayPrice.toLocaleString('es-CL')}
                </span>
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