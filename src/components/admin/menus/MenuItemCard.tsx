"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Trash2, Eye, EyeOff, DollarSign, Clock } from 'lucide-react'
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        whileHover={{ y: -2 }}
        className="group w-full"
      >
        <Card className={`transition-all duration-300 hover:shadow-lg w-full ${
          item.active 
            ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600' 
            : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 opacity-75'
        }`}>
          <CardContent className="p-5">
            {/* Header con código y estado */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2 flex-wrap">
                <Badge 
                  variant={item.type === 'almuerzo' ? 'default' : 'secondary'}
                  className={`text-xs font-medium ${
                    item.type === 'almuerzo' 
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
                >
                  {item.code}
                </Badge>
                
                <Badge 
                  variant="outline"
                  className={`text-xs ${
                    item.active 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {item.active ? (
                    <Eye className="w-2.5 h-2.5 mr-1" />
                  ) : (
                    <EyeOff className="w-2.5 h-2.5 mr-1" />
                  )}
                  {item.active ? 'Activo' : 'Inactivo'}
                </Badge>

                {hasCustomPrice && (
                  <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                    <DollarSign className="w-2.5 h-2.5 mr-1" />
                    Precio especial
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  disabled={isLoading}
                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="space-y-4">
              {/* Título */}
              <div>
                <h4 className={`font-semibold text-base leading-tight break-words ${
                  item.active 
                    ? 'text-slate-900 dark:text-slate-100' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {item.title}
                </h4>
              </div>

              {/* Descripción (si existe) */}
              {item.description && (
                <div>
                  <p className={`text-sm leading-relaxed break-words ${
                    item.active 
                      ? 'text-slate-600 dark:text-slate-400' 
                      : 'text-slate-500 dark:text-slate-500'
                  }`}>
                    {item.description}
                  </p>
                </div>
              )}

              {/* Footer con precio y tipo */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      item.type === 'almuerzo' 
                        ? 'text-blue-600 border-blue-200 bg-blue-50' 
                        : 'text-emerald-600 border-emerald-200 bg-emerald-50'
                    }`}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {item.type === 'almuerzo' ? 'Almuerzo' : 'Colación'}
                  </Badge>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className={`font-bold text-base ${
                    item.active 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-slate-500 dark:text-slate-500'
                  }`}>
                    ${displayPrice.toLocaleString('es-CL')}
                  </p>
                  {hasCustomPrice && (
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      Precio especial
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
              Esta acción eliminará permanentemente el menú &quot;{item.title}&quot; ({item.code}).
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