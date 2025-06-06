"use client"
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Calendar,
  Download,
  Copy,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminWeekMenu } from '@/types/adminMenu'
import { getWeekSummary, exportWeekMenuToCSV, downloadCSV } from '@/lib/adminMenuUtils'

interface MenuHeaderProps {
  weekMenu: AdminWeekMenu | null
  isLoading: boolean
  onRefresh: () => void
  onDuplicateWeek: () => void
}

export function MenuHeader({ 
  weekMenu, 
  isLoading, 
  onRefresh, 
  onDuplicateWeek 
}: MenuHeaderProps) {
  const summary = weekMenu ? getWeekSummary(weekMenu) : null

  const handleExportCSV = () => {
    if (!weekMenu) return
    
    const csvContent = exportWeekMenuToCSV(weekMenu)
    const filename = `menu-${weekMenu.weekStart}.csv`
    downloadCSV(csvContent, filename)
  }

  return (
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
              
              {weekMenu && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCSV}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Exportar CSV</span>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
