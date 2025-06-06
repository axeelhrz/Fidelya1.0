"use client"
import { motion } from 'framer-motion'
import { Plus, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AdminDayMenu, AdminMenuItem } from '@/types/adminMenu'
import { MenuItemCard } from './MenuItemCard'
import { getEmptyDayMessage } from '@/lib/adminMenuUtils'

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
    >
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-full">
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
                    className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  >
                    {activeItems} activos
                  </Badge>
                </>
              )}
            </div>
          </div>
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
