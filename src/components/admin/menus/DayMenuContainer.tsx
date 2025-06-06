"use client"
import { motion } from 'framer-motion'
import { Plus, Calendar, Eye, MoreVertical, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { AdminDayMenu, AdminMenuItem } from '@/types/adminMenu'
import { MenuItemCard } from './MenuItemCard'
import { getEmptyDayMessage } from '@/lib/adminMenuUtils'

interface DayMenuContainerProps {
  dayMenu: AdminDayMenu
  onAddItem: (type: 'almuerzo' | 'colacion') => void
  onEditItem: (item: AdminMenuItem) => void
  onDeleteItem: (item: AdminMenuItem) => void
  onBulkToggleActive?: (dayDate: string, type: 'almuerzo' | 'colacion', active: boolean) => void
  isLoading?: boolean
  showUserPreview?: boolean
}

export function DayMenuContainer({ 
  dayMenu, 
  onAddItem, 
  onEditItem, 
  onDeleteItem,
  onBulkToggleActive,
  isLoading = false,
  showUserPreview = false
}: DayMenuContainerProps) {
  const totalItems = dayMenu.almuerzos.length + dayMenu.colaciones.length
  const activeItems = [...dayMenu.almuerzos, ...dayMenu.colaciones].filter(item => item.active).length
  const completionPercentage = totalItems > 0 ? Math.round((activeItems / totalItems) * 100) : 0

  const handleBulkToggle = (type: 'almuerzo' | 'colacion', active: boolean) => {
    if (onBulkToggleActive) {
      onBulkToggleActive(dayMenu.date, type, active)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-full transition-all duration-300 hover:shadow-lg ${showUserPreview ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white capitalize">
                  {dayMenu.dayName}
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {dayMenu.date}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {showUserPreview && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300">
                  <Eye className="w-3 h-3 mr-1" />
                  Vista Usuario
                </Badge>
              )}
              
              {totalItems > 0 && (
                <>
                  <Badge 
                    variant="secondary" 
                    className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                  >
                    {totalItems} items
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className={`${completionPercentage === 100 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}
                  >
                    {completionPercentage}% activo
                  </Badge>
                </>
              )}

              {/* Dropdown Menu for Bulk Actions */}
              {totalItems > 0 && onBulkToggleActive && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkToggle('almuerzo', true)}>
                      <ToggleRight className="mr-2 h-4 w-4" />
                      Activar todos los almuerzos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkToggle('almuerzo', false)}>
                      <ToggleLeft className="mr-2 h-4 w-4" />
                      Desactivar todos los almuerzos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkToggle('colacion', true)}>
                      <ToggleRight className="mr-2 h-4 w-4" />
                      Activar todas las colaciones
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkToggle('colacion', false)}>
                      <ToggleLeft className="mr-2 h-4 w-4" />
                      Desactivar todas las colaciones
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {totalItems > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Completado</span>
                <span>{activeItems}/{totalItems}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    completionPercentage === 100 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Sección de Almuerzos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                Almuerzos ({dayMenu.almuerzos.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddItem('almuerzo')}
                disabled={isLoading || !dayMenu.isEditable}
                className="flex items-center space-x-1 text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
              >
                <Plus className="w-3 h-3" />
                <span>Agregar</span>
              </Button>
            </div>
            
            <div className="space-y-2">
              {dayMenu.almuerzos.length > 0 ? (
                dayMenu.almuerzos.map((item, index) => (
                  <MenuItemCard
                    key={item.id || index}
                    item={item}
                    onEdit={onEditItem}
                    onDelete={onDeleteItem}
                    isLoading={isLoading}
                  />
                ))
              ) : (
                <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {getEmptyDayMessage('almuerzo')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-slate-200 dark:border-slate-700"></div>

          {/* Sección de Colaciones */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                Colaciones ({dayMenu.colaciones.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddItem('colacion')}
                disabled={isLoading || !dayMenu.isEditable}
                className="flex items-center space-x-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/20"
              >
                <Plus className="w-3 h-3" />
                <span>Agregar</span>
              </Button>
            </div>
            
            <div className="space-y-2">
              {dayMenu.colaciones.length > 0 ? (
                dayMenu.colaciones.map((item, index) => (
                  <MenuItemCard
                    key={item.id || index}
                    item={item}
                    onEdit={onEditItem}
                    onDelete={onDeleteItem}
                    isLoading={isLoading}
                  />
                ))
              ) : (
                <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {getEmptyDayMessage('colacion')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}