"use client"
import { motion } from 'framer-motion'
import { Plus, Calendar, Clock, ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AdminDayMenu, AdminMenuItem } from '@/types/adminMenu'
import { MenuItemCard } from './MenuItemCard'

interface DayMenuContainerProps {
  dayMenu: AdminDayMenu
  onAddItem: (type: 'almuerzo' | 'colacion') => void
  onEditItem: (item: AdminMenuItem) => void
  onDeleteItem: (item: AdminMenuItem) => void
  isLoading?: boolean
}

export function DayMenuContainer({ 
  dayMenu, 
  onAddItem, 
  onEditItem, 
  onDeleteItem,
  isLoading = false 
}: DayMenuContainerProps) {
  const totalItems = dayMenu.almuerzos.length + dayMenu.colaciones.length
  const activeItems = [...dayMenu.almuerzos, ...dayMenu.colaciones].filter(item => item.active).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white capitalize">
                  {dayMenu.dayName}
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {new Date(dayMenu.date).toLocaleDateString('es-CL', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </p>
              </div>
            </div>
            
            {totalItems > 0 && (
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                >
                  {activeItems}/{totalItems}
                </Badge>
                {!dayMenu.isEditable && (
                  <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                    Solo lectura
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-6">
          {/* Sección de Almuerzos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <ChefHat className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Almuerzos
                </h3>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                  {dayMenu.almuerzos.length}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddItem('almuerzo')}
                disabled={isLoading || !dayMenu.isEditable}
                className="h-7 px-3 text-xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
              >
                <Plus className="w-3 h-3 mr-1" />
                Agregar
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
                <div className="p-4 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-lg text-center bg-blue-50/30 dark:bg-blue-900/10">
                  <ChefHat className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-2 font-medium">
                    Sin almuerzos disponibles
                  </p>
                  <p className="text-xs text-blue-500 dark:text-blue-500 mb-3">
                    Agrega opciones de almuerzo para este día
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddItem('almuerzo')}
                    disabled={isLoading || !dayMenu.isEditable}
                    className="h-8 px-3 text-xs text-blue-600 hover:bg-blue-100"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Agregar Almuerzo
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sección de Colaciones */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Colaciones
                </h3>
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600 border-emerald-200">
                  {dayMenu.colaciones.length}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddItem('colacion')}
                disabled={isLoading || !dayMenu.isEditable}
                className="h-7 px-3 text-xs hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
              >
                <Plus className="w-3 h-3 mr-1" />
                Agregar
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
                <div className="p-4 border-2 border-dashed border-emerald-200 dark:border-emerald-800 rounded-lg text-center bg-emerald-50/30 dark:bg-emerald-900/10">
                  <Clock className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-2 font-medium">
                    Sin colaciones disponibles
                  </p>
                  <p className="text-xs text-emerald-500 dark:text-emerald-500 mb-3">
                    Agrega opciones de colación para este día
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddItem('colacion')}
                    disabled={isLoading || !dayMenu.isEditable}
                    className="h-8 px-3 text-xs text-emerald-600 hover:bg-emerald-100"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Agregar Colación
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}