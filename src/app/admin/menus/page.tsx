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
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminMenuItem } from '@/types/adminMenu'

export default function AdminMenusPage() {
  const {
    currentWeek,
    weekMenu,
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
    // TODO: Implementar selector de semana destino
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
        isLoading={isLoading}
        onRefresh={refreshMenu}
        onDuplicateWeek={handleDuplicateWeek}
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
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                No hay datos de menú disponibles para esta semana
              </p>
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
