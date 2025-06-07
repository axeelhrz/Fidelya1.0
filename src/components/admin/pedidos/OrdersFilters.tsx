"use client"
import { motion } from 'framer-motion'
import { Search, Filter, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OrderFilters } from '@/types/adminOrder'
import { AdminOrderService } from '@/services/adminOrderService'
import { format, parseISO, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

interface OrdersFiltersProps {
  filters: OrderFilters
  onFiltersChange: (filters: Partial<OrderFilters>) => void
  totalResults: number
}

export function OrdersFilters({ filters, onFiltersChange, totalResults }: OrdersFiltersProps) {
  const weekOptions = AdminOrderService.generateWeekOptions()
  
  const dayOptions = [
    { value: 'none', label: 'Todos los días' },
    { value: 'monday', label: 'Lunes' },
    { value: 'tuesday', label: 'Martes' },
    { value: 'wednesday', label: 'Miércoles' },
    { value: 'thursday', label: 'Jueves' },
    { value: 'friday', label: 'Viernes' }
  ]

  const userTypeOptions = [
    { value: 'all', label: 'Todos los usuarios' },
    { value: 'estudiante', label: 'Estudiantes' },
    { value: 'funcionario', label: 'Funcionarios' }
  ]

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'paid', label: 'Pagados' }
  ]

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.day && filters.day !== 'none') count++
    if (filters.userType && filters.userType !== 'all') count++
    if (filters.status && filters.status !== 'all') count++
    if (filters.searchTerm) count++
    return count
  }

  const clearAllFilters = () => {
    onFiltersChange({
      day: 'none',
      userType: 'all',
      status: 'all',
      searchTerm: ''
    })
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Encabezado de filtros */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Filtros Avanzados
                </h3>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {activeFiltersCount} activos
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {totalResults} resultados
                </span>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>
            </div>

            {/* Filtros principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Selector de semana */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Semana
                </label>
                <Select
                  value={filters.weekStart || 'none'}
                  onValueChange={(value) => onFiltersChange({ weekStart: value === 'none' ? undefined : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar semana" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Todas las semanas</SelectItem>
                    {weekOptions.map((week) => (
                      <SelectItem key={week.value} value={week.value}>
                        <div className="flex items-center space-x-2">
                          <span>{week.label}</span>
                          {week.isCurrent && (
                            <Badge variant="secondary" className="text-xs">
                              Actual
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por día */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Día específico
                </label>
                <Select
                  value={filters.day || 'none'}
                  onValueChange={(value) => onFiltersChange({ day: value === 'none' ? undefined : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los días" />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOptions.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por tipo de usuario */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tipo de usuario
                </label>
                <Select
                  value={filters.userType || 'all'}
                  onValueChange={(value) => onFiltersChange({ userType: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por estado */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Estado del pedido
                </label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => onFiltersChange({ status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Búsqueda por nombre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Buscar por nombre o email
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar cliente..."
                  value={filters.searchTerm || ''}
                  onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}