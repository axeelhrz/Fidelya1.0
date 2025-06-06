"use client"
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { MenuHeader } from '@/components/admin/menus/MenuHeader'
import { WeekNavigator } from '@/components/admin/menus/WeekNavigator'
import { DayMenuContainer } from '@/components/admin/menus/DayMenuContainer'
import { MenuItemModal } from '@/components/admin/menus/MenuItemModal'
import { useAdminMenus } from '@/hooks/useAdminMenus'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw, Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AdminMenuItem } from '@/types/adminMenu'

export default function AdminMenusPage() {
  const {
    currentWeek,
    weekMenu,
    weekStats,
    isLoading,
    error,
    modalState,
    navigateWeek,
    getWeekNavigation,
    openModal,
    closeModal,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    duplicateWeek,
    toggleWeekPublication,
    deleteWeekMenu,
    refreshMenu
  } = useAdminMenus()

  const navigation = getWeekNavigation()

  // Obtener códigos existentes para validación
  const existingCodes = weekMenu?.days.flatMap(day => 
    [...day.almuerzos, ...day.colaciones].map(item => item.code)
  ) || []

  const handleAddItem = (date: string, day: string, type: 'almuerzo' | 'colacion') => {
    openModal('create', date, day, type)
  }

  const handleEditItem = (item: AdminMenuItem) => {
    openModal('edit', item.date, item.day, item.type, item)
  }

  const handleDuplicateWeek = async () => {
    // Calcular semana siguiente
    const nextWeek = new Date(currentWeek)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const targetWeek = nextWeek.toISOString().split('T')[0]
    
    await duplicateWeek(targetWeek)
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshMenu}
                className="ml-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Header */}
      <MenuHeader
        weekMenu={weekMenu}
        weekStats={weekStats}
        isLoading={isLoading}
        onRefresh={refreshMenu}
        onDuplicateWeek={handleDuplicateWeek}
        onTogglePublication={toggleWeekPublication}
        onDeleteWeek={deleteWeekMenu}
      />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Navegador de semanas */}
          <WeekNavigator
            navigation={navigation}
            onNavigate={navigateWeek}
            isLoading={isLoading}
          />

          {/* Contenido de la semana */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-96" />
              ))}
            </div>
          ) : weekMenu ? (
            <>
              {/* Resumen rápido */}
              {weekStats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              Resumen de la Semana
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {weekStats.totalItems} items totales • {weekStats.activeItems} activos • {weekStats.daysWithMenus}/5 días configurados
                            </p>
                          </div>
                        </div>
                        
                        {weekStats.totalItems === 0 && (
                          <div className="text-right">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              ¡Comienza agregando menús!
                            </p>
                            <Button
                              size="sm"
                              onClick={() => handleAddItem(weekMenu.days[0].date, weekMenu.days[0].day, 'almuerzo')}
                              className="flex items-center space-x-2"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Agregar Primer Menú</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Grid de días */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
              >
                {weekMenu.days.map((dayMenu, index) => (
                  <motion.div
                    key={dayMenu.date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <DayMenuContainer
                      dayMenu={dayMenu}
                      onAddItem={(type) => handleAddItem(dayMenu.date, dayMenu.day, type)}
                      onEditItem={handleEditItem}
                      onDeleteItem={deleteMenuItem}
                      isLoading={isLoading}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                No hay datos de menú disponibles
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Comienza agregando menús para esta semana
              </p>
              <Button onClick={refreshMenu} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal para agregar/editar menús */}
      <MenuItemModal
        modalState={modalState}
        onClose={closeModal}
        onSave={createMenuItem}
        onUpdate={updateMenuItem}
        existingCodes={existingCodes}
        weekStart={currentWeek}
      />
    </AdminLayout>
  )
}