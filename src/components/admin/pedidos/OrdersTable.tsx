"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, 
  MoreHorizontal, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AdminOrderView } from '@/types/adminOrder'
import { formatAdminCurrency, formatAdminDate, formatAdminTime } from '@/lib/adminUtils'

interface OrdersTableProps {
  orders: AdminOrderView[]
  isLoading: boolean
  onViewDetail: (orderId: string) => void
  onUpdateStatus: (orderId: string, status: 'pending' | 'paid' | 'cancelled') => Promise<void>
}

export function OrdersTable({ 
  orders, 
  isLoading, 
  onViewDetail, 
  onUpdateStatus 
}: OrdersTableProps) {
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set())

  const handleStatusUpdate = async (orderId: string, status: 'pending' | 'paid' | 'cancelled') => {
    setUpdatingOrders(prev => new Set(prev).add(orderId))
    try {
      await onUpdateStatus(orderId, status)
    } finally {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev)
        newSet.delete(orderId)
        return newSet
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      case 'pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300'
    }
  }

  const getUserTypeColor = (userType: string) => {
    return userType === 'estudiante' 
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
  }

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No hay pedidos
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              No se encontraron pedidos con los filtros aplicados.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tabla de Pedidos</span>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
              {orders.length} pedidos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha del Pedido</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {order.user.firstName.charAt(0)}{order.user.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {order.user.firstName} {order.user.lastName}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {order.user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getUserTypeColor(order.user.userType)}>
                        {order.user.userType === 'estudiante' ? 'Estudiante' : 'Funcionario'}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {formatAdminDate(order.createdAt)}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {formatAdminTime(order.createdAt)}
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {order.itemsCount}
                        </span>
                        {order.hasColaciones && (
                          <Badge variant="secondary" className="text-xs">
                            +Col
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">
                            {order.status === 'paid' ? 'Pagado' : 
                             order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                          </span>
                        </div>
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatAdminCurrency(order.total)}
                      </span>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetail(order.id!)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={updatingOrders.has(order.id!)}
                              className="text-slate-600 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {order.status === 'pending' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(order.id!, 'paid')}
                                className="text-emerald-600 focus:text-emerald-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Marcar como Pagado
                              </DropdownMenuItem>
                            )}
                            
                            {order.status === 'paid' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(order.id!, 'pending')}
                                className="text-amber-600 focus:text-amber-700"
                              >
                                <Clock className="w-4 h-4 mr-2" />
                                Marcar como Pendiente
                              </DropdownMenuItem>
                            )}
                            
                            {order.status !== 'cancelled' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(order.id!, 'cancelled')}
                                className="text-red-600 focus:text-red-700"
                              >
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Cancelar Pedido
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
