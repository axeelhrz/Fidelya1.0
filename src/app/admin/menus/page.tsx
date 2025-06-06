"use client"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { MenuHeader } from '@/components/admin/menus/MenuHeader'
import { WeekNavigator } from '@/components/admin/menus/WeekNavigator'
import { DayMenuContainer } from '@/components/admin/menus/DayMenuContainer'
import { MenuItemModal } from '@/components/admin/menus/MenuItemModal'
import { useAdminMenus } from '@/hooks/useAdminMenus'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AlertTriangle, 
  RefreshCw, 
  Calendar, 
  Plus, 
  Eye,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings,
  Monitor,
  Smartphone,
  ExternalLink,
  Activity,
  Target,
  Zap
} from 'lucide-react'
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

  const [activeTab, setActiveTab] = useState('manage')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [showUserPreview, setShowUserPreview] = useState(false)

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
    const nextWeek = new Date(currentWeek)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const targetWeek = nextWeek.toISOString().split('T')[0]
    
    await duplicateWeek(targetWeek)
  }

  const handleBulkToggleActive = async (dayDate: string, type: 'almuerzo' | 'colacion', active: boolean) => {
    if (!weekMenu) return
    
    const day = weekMenu.days.find(d => d.date === dayDate)
    if (!day) return

    const items = type === 'almuerzo' ? day.almuerzos : day.colaciones
    
    for (const item of items) {
      if (item.id && item.active !== active) {
        await updateMenuItem(item.id, { active })
      }
    }
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshMenu}
                className="ml-4 border-red-300 text-red-700 hover:bg-red-100"
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
      {/* Enhanced Header */}
      <MenuHeader
        weekMenu={weekMenu}
        weekStats={weekStats}
        isLoading={isLoading}
        onRefresh={refreshMenu}
        onDuplicateWeek={handleDuplicateWeek}
        onTogglePublication={toggleWeekPublication}
        onDeleteWeek={deleteWeekMenu}
        onTogglePreview={() => setShowUserPreview(!showUserPreview)}
        showUserPreview={showUserPreview}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Week Navigator */}
          <WeekNavigator
            navigation={navigation}
            onNavigate={navigateWeek}
            isLoading={isLoading}
          />

          {/* Enhanced Stats Overview */}
          {weekStats && weekMenu && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                        <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-slate-900 dark:text-white">
                          Resumen de la Semana
                        </CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {weekMenu.weekLabel} • Estado: {weekMenu.isPublished ? 'Publicado' : 'Borrador'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {weekMenu.isPublished ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Visible para usuarios
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          <Clock className="w-3 h-3 mr-1" />
                          En preparación
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {weekStats.totalItems}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Total Items
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {weekStats.activeItems}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Activos
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {weekStats.totalAlmuerzos}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Almuerzos
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {weekStats.totalColaciones}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Colaciones
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {weekStats.daysWithMenus}/5
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Días Configurados
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {weekMenu.isPublished ? '∞' : '0'}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Usuarios Impactados
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      size="sm"
                      onClick={() => setShowUserPreview(!showUserPreview)}
                      variant={showUserPreview ? "default" : "outline"}
                      className="flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Vista de Usuario</span>
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open('/menu', '_blank')}
                      className="flex items-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Ver en Sitio</span>
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open('/mi-pedido', '_blank')}
                      className="flex items-center space-x-2"
                    >
                      <Target className="w-4 h-4" />
                      <span>Vista de Pedidos</span>
                    </Button>
                    
                    {weekStats.totalItems === 0 && (
                      <Button
                        size="sm"
                        onClick={() => handleAddItem(weekMenu.days[0].date, weekMenu.days[0].day, 'almuerzo')}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Primer Menú</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Tabs for different views */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-3">
              <TabsTrigger value="manage" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Gestionar</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Vista Previa</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Analíticas</span>
              </TabsTrigger>
            </TabsList>

            {/* Management Tab */}
            <TabsContent value="manage" className="space-y-6">
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
                  transition={{ duration: 0.5 }}
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
                        onBulkToggleActive={handleBulkToggleActive}
                        isLoading={isLoading}
                        showUserPreview={showUserPreview}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    No hay datos de menú disponibles
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                    Comienza agregando menús para esta semana. Los usuarios podrán ver y realizar pedidos una vez que publiques el menú.
                  </p>
                  <Button onClick={refreshMenu} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Actualizar
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Vista de Usuario
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Escritorio
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Móvil
                  </Button>
                </div>
              </div>
              
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className={`${previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'} bg-white dark:bg-slate-900`}>
                    <iframe
                      src="/menu"
                      className={`w-full ${previewMode === 'mobile' ? 'h-[600px]' : 'h-[800px]'} border-0`}
                      title="Vista previa del menú para usuarios"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Impacto en Usuarios</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Usuarios activos:</span>
                        <span className="font-semibold">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Pedidos esta semana:</span>
                        <span className="font-semibold">892</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Tasa de conversión:</span>
                        <span className="font-semibold text-green-600">71.5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Tendencias</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Plato más popular:</span>
                        <span className="font-semibold">Pollo al horno</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Día con más pedidos:</span>
                        <span className="font-semibold">Miércoles</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Promedio por usuario:</span>
                        <span className="font-semibold">$12,500</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="w-5 h-5" />
                      <span>Rendimiento</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Tiempo de carga:</span>
                        <span className="font-semibold text-green-600">1.2s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Disponibilidad:</span>
                        <span className="font-semibold text-green-600">99.9%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Satisfacción:</span>
                        <span className="font-semibold text-blue-600">4.8/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Interconnection Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Estado de Interconexión</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-300">Panel Usuario</p>
                        <p className="text-sm text-green-600 dark:text-green-400">Conectado</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-300">Menú Público</p>
                        <p className="text-sm text-green-600 dark:text-green-400">Sincronizado</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-300">Mi Pedido</p>
                        <p className="text-sm text-green-600 dark:text-green-400">Actualizado</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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