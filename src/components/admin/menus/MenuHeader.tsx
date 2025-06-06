"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Calendar,
  Download,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AdminWeekMenu } from '@/types/adminMenu'
import { getWeekSummary, exportWeekMenuToCSV, downloadCSV } from '@/lib/adminMenuUtils'

interface MenuHeaderProps {
  weekMenu: AdminWeekMenu | null
  weekStats: any
  isLoading: boolean
  onRefresh: () => void
  onDuplicateWeek: () => void
  onTogglePublication: (publish: boolean) => void
  onDeleteWeek: () => void
}

export function MenuHeader({ 
  weekMenu, 
  weekStats,
  isLoading, 
  onRefresh, 
  onDuplicateWeek,
  onTogglePublication,
  onDeleteWeek
}: MenuHeaderProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatsDialog, setShowStatsDialog] = useState(false)
  const summary = weekMenu ? getWeekSummary(weekMenu) : null

  const handleExportCSV = () => {
    if (!weekMenu) return
    
    const csvContent = exportWeekMenuToCSV(weekMenu)
    const filename = `menu-${weekMenu.weekStart}.csv`
    downloadCSV(csvContent, filename)
  }

  const handleTogglePublication = () => {
    if (!weekMenu) return
    onTogglePublication(!weekMenu.isPublished)
  }

  const handleDeleteWeek = () => {
    setShowDeleteDialog(true)
  }

  const confirmDeleteWeek = () => {
    onDeleteWeek()
    setShowDeleteDialog(false)
  }

  return (
    <>
      <motion.div 
        className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Información principal */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                    Gestión de Menús Semanales
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Administra las opciones de almuerzos y colaciones para cada día
                  </p>
                </div>
              </div>
              
              {/* Información de la semana actual */}
              {weekMenu && (
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{weekMenu.weekLabel}</span>
                  </div>
                  
                  {summary && (
                    <div className="flex items-center space-x-4">
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        {summary.totalAlmuerzos} Almuerzos
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      >
                        {summary.totalColaciones} Colaciones
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      >
                        {summary.activeDays} Días activos
                      </Badge>
                      {weekMenu.isPublished ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          <Eye className="w-3 h-3 mr-1" />
                          Publicado
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <EyeOff className="w-3 h-3 mr-1" />
                          No publicado
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Controles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Actualizar</span>
                </Button>
                
                {weekStats && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowStatsDialog(true)}
                    className="flex items-center space-x-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Estadísticas</span>
                  </Button>
                )}
                
                {weekMenu && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportCSV}
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Exportar</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onDuplicateWeek}
                      className="flex items-center space-x-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="hidden sm:inline">Duplicar</span>
                    </Button>

                    <Button
                      variant={weekMenu.isPublished ? "secondary" : "default"}
                      size="sm"
                      onClick={handleTogglePublication}
                      className="flex items-center space-x-2"
                    >
                      {weekMenu.isPublished ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span className="hidden sm:inline">Despublicar</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">Publicar</span>
                        </>
                      )}
                    </Button>

                    {weekMenu.totalItems > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteWeek}
                        className="flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dialog de estadísticas */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Estadísticas de la Semana</DialogTitle>
          </DialogHeader>
          {weekStats && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {weekStats.totalItems}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Total Items
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {weekStats.activeItems}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Items Activos
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {weekStats.totalAlmuerzos}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    Almuerzos
                  </div>
                </div>
                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {weekStats.totalColaciones}
                  </div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400">
                    Colaciones
                  </div>
                </div>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-xl font-bold text-slate-600 dark:text-slate-400">
                  {weekStats.daysWithMenus}/5
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Días con Menús
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar menú semanal?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente todos los menús de esta semana.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteWeek}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Eliminar Todo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}