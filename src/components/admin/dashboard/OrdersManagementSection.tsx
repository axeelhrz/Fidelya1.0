"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar,
  Users,
  ShoppingCart,
  Filter,
  Download,
  ChefHat,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  FileSpreadsheet,
  Utensils
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useOrdersDashboard } from '@/hooks/useOrdersDashboard'
import { AdminOrderView } from '@/types/adminOrder'
import { format } from 'date-fns'

export function OrdersManagementSection() {
  const {
    orders,
    isLoading,
    error,
    isExporting,
    filters,
    updateFilters,
    refreshOrders,
    updateOrderStatus,
    exportOrders,
    exportKitchenData,
    dashboardStats,
    ordersByDay
  } = useOrdersDashboard()

  const [selectedOrder, setSelectedOrder] = useState<AdminOrderView | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const handleStatusUpdate = async (orderId: string, newStatus: 'pending' | 'paid' | 'cancelled') => {
    try {
      await updateOrderStatus(orderId, newStatus)
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handleExport = async (type: 'complete' | 'kitchen' | 'summary') => {
    try {
      if (type === 'kitchen') {
        await exportKitchenData()
      } else {
        await exportOrders({
          format: 'excel',
          includeDetails: type === 'complete',
          groupByDay: type !== 'summary',
          includeMetrics: type === 'complete'
        })
      }
    } catch (error) {
      console.error('Error exporting:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          Pagado
        </Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
          <Clock className="w-3 h-3 mr-1" />
          Pendiente
        </Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelado
        </Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getUserTypeBadge = (userType: string) => {
    return userType === 'estudiante' ? (
      <Badge variant="outline" className="text-blue-600 border-blue-200">
        <Users className="w-3 h-3 mr-1" />
        Estudiante
      </Badge>
    ) : (
      <Badge variant="outline" className="text-purple-600 border-purple-200">
        <Users className="w-3 h-3 mr-1" />
        Funcionario
      </Badge>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={refreshOrders}>
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Pedidos</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboardStats.totalFiltered}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Hoy</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboardStats.todayOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Críticos</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboardStats.criticalOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Utensils className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Con Colaciones</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboardStats.byMenuType.colacion}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles y filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <ChefHat className="w-5 h-5 text-blue-600" />
              <span>Gestión de Pedidos</span>
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isExporting}>
                    <Download className="w-4 h-4 mr-2" />
                    {isExporting ? 'Exportando...' : 'Exportar'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('kitchen')}>
                    <ChefHat className="w-4 h-4 mr-2" />
                    Para Cocina
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('summary')}>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Resumen
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('complete')}>
                    <Download className="w-4 h-4 mr-2" />
                    Completo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="sm" onClick={refreshOrders}>
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>

        {showFilters && (
          <CardContent className="border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Buscar
                </label>
                <Input
                  placeholder="Nombre, email..."
                  value={filters.searchTerm || ''}
                  onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Estado
                </label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) =>
                    updateFilters({
                      status: value as 'all' | 'pending' | 'paid' | 'cancelled'
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="paid">Pagados</SelectItem>
                    <SelectItem value="cancelled">Cancelados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Tipo Usuario
                </label>
                <Select
                  value={filters.userType || 'all'}
                  onValueChange={(value) => updateFilters({ userType: value as 'all' | 'estudiante' | 'funcionario' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="estudiante">Estudiantes</SelectItem>
                    <SelectItem value="funcionario">Funcionarios</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Tipo Menú
                </label>
                <Select
                  value={filters.menuType || 'all'}
                  onValueChange={(value) => updateFilters({ menuType: value as 'all' | 'almuerzo' | 'colacion' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="almuerzo">Solo Almuerzo</SelectItem>
                    <SelectItem value="colacion">Solo Colación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        )}

        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No hay pedidos
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                No se encontraron pedidos con los filtros aplicados
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {order.user.firstName} {order.user.lastName}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {order.user.email}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {getUserTypeBadge(order.user.userType)}
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {format(order.createdAt, 'dd/MM/yyyy')}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {format(order.createdAt, 'HH:mm')}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          {order.itemsSummary.totalAlmuerzos > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {order.itemsSummary.totalAlmuerzos} Almuerzo{order.itemsSummary.totalAlmuerzos > 1 ? 's' : ''}
                            </Badge>
                          )}
                          {order.itemsSummary.totalColaciones > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {order.itemsSummary.totalColaciones} Colación{order.itemsSummary.totalColaciones > 1 ? 'es' : ''}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          {getStatusBadge(order.status)}
                          {order.status === 'pending' && order.daysSincePending && order.daysSincePending > 3 && (
                            <Badge variant="destructive" className="text-xs">
                              {order.daysSincePending} días
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-medium text-slate-900 dark:text-white">
                          ${order.total.toLocaleString('es-CL')}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalle
                            </DropdownMenuItem>
                            {order.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(order.id!, 'paid')}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Marcar Pagado
                              </DropdownMenuItem>
                            )}
                            {order.status !== 'cancelled' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(order.id!, 'cancelled')}>
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancelar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen por días */}
      {ordersByDay.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <span>Resumen por Días</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ordersByDay.map((day) => (
                <Card key={day.date} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900 dark:text-white capitalize">
                        {day.dayName}
                      </h4>
                      <Badge variant="outline">
                        {format(new Date(day.date), 'dd/MM')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Total pedidos:</span>
                        <span className="font-medium">{day.totalOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Almuerzos:</span>
                        <span className="font-medium">{day.totalAlmuerzos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Colaciones:</span>
                        <span className="font-medium">{day.totalColaciones}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de detalle de pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Detalle del Pedido
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Usuario
                    </label>
                    <p className="text-slate-900 dark:text-white">
                      {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Tipo
                    </label>
                    <div className="mt-1">
                      {getUserTypeBadge(selectedOrder.user.userType)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Estado
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Total
                    </label>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      ${selectedOrder.total.toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                    Detalle de Items
                  </label>
                  <div className="space-y-3">
                    {selectedOrder.itemsSummary.itemsDetail.map((detail, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-900 dark:text-white capitalize">
                            {detail.dayName}
                          </h4>
                          <Badge variant="outline">
                            {format(new Date(detail.date), 'dd/MM/yyyy')}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          {detail.almuerzo && (
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-sm font-medium text-blue-600">
                                  {detail.almuerzo.code}
                                </span>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {detail.almuerzo.name}
                                </p>
                              </div>
                              <span className="font-medium">
                                ${detail.almuerzo.price.toLocaleString('es-CL')}
                              </span>
                            </div>
                          )}
                          
                          {detail.colacion && (
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-sm font-medium text-purple-600">
                                  {detail.colacion.code}
                                </span>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {detail.colacion.name}
                                </p>
                              </div>
                              <span className="font-medium">
                                ${detail.colacion.price.toLocaleString('es-CL')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
