"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  User, 
  Calendar, 
  CreditCard, 
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AdminOrderService } from '@/services/adminOrderService'
import { OrderDetailView } from '@/types/adminOrder'
import { formatAdminCurrency, formatAdminDate, formatAdminTime } from '@/lib/adminUtils'
import { Skeleton } from '@/components/ui/skeleton'

interface OrderDetailModalProps {
  orderId: string | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (orderId: string, status: 'pending' | 'paid' | 'cancelled') => Promise<void>
}

export function OrderDetailModal({ 
  orderId, 
  isOpen, 
  onClose, 
  onStatusUpdate 
}: OrderDetailModalProps) {
  const [orderDetail, setOrderDetail] = useState<OrderDetailView | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && orderId) {
      loadOrderDetail()
    }
  }, [isOpen, orderId])

  const loadOrderDetail = async () => {
    if (!orderId) return

    setIsLoading(true)
    setError(null)
    
    try {
      const detail = await AdminOrderService.getOrderDetail(orderId)
      setOrderDetail(detail)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el detalle')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: 'pending' | 'paid' | 'cancelled') => {
    if (!orderId) return

    setIsUpdating(true)
    try {
      await onStatusUpdate(orderId, newStatus)
      await loadOrderDetail() // Recargar detalles
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estado')
    } finally {
      setIsUpdating(false)
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Detalle del Pedido</span>
            {orderDetail && (
              <Badge className={getStatusColor(orderDetail.status)}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(orderDetail.status)}
                  <span className="capitalize">{orderDetail.status}</span>
                </div>
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button onClick={loadOrderDetail} className="mt-4">
              Reintentar
            </Button>
          </div>
        ) : orderDetail ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Información del cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Información del Cliente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Nombre completo</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {orderDetail.user.firstName} {orderDetail.user.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {orderDetail.user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Tipo de usuario</p>
                    <Badge variant="secondary" className="capitalize">
                      {orderDetail.user.userType}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">ID del pedido</p>
                    <p className="font-mono text-sm text-slate-900 dark:text-white">
                      {orderDetail.id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalles del pedido */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Detalles del Pedido</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetail.selections.map((selection, index) => (
                    <div key={selection.date} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900 dark:text-white capitalize">
                          {selection.dayName} - {formatAdminDate(selection.date)}
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selection.almuerzo && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Almuerzo
                            </p>
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {selection.almuerzo.code}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {selection.almuerzo.name}
                              </p>
                              <p className="text-sm font-semibold text-emerald-600">
                                {formatAdminCurrency(selection.almuerzo.price)}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {selection.colacion && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Colación
                            </p>
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-
