'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, Clock, Home, Receipt, ArrowLeft } from 'lucide-react'
import { useOrderDetails } from '@/hooks/useOrders'
import { useRequireAuth } from '@/hooks/useAuth'
import { Navbar } from '@/components/navbar'
import { OrderService } from '@/lib/orders/orderService'
import { ProductService } from '@/lib/products/productService'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
export default function PaymentResultPage() {
  const { isLoading: authLoading } = useRequireAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('order_id')
  
  const { order, isLoading, refreshOrder } = useOrderDetails(orderId || '')
  const [isRefreshing, setIsRefreshing] = useState(false)
  useEffect(() => {
    if (!orderId) {
      router.push('/dashboard')
      return
    }

    // Refresh order status every 5 seconds for up to 2 minutes
    const interval = setInterval(async () => {
      if (order?.status === 'pending') {
        setIsRefreshing(true)
        await refreshOrder()
        setIsRefreshing(false)
      }
    }, 5000)

    // Clear interval after 2 minutes
    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 120000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [orderId, order?.status, refreshOrder, router])

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Pedido no encontrado</h3>
              <p className="text-muted-foreground mb-6">
                No se pudo encontrar el pedido solicitado
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const getStatusIcon = () => {
    switch (order.status) {
      case 'paid':
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-16 w-16 text-red-500" />
      case 'pending':
      default:
        return <Clock className="h-16 w-16 text-yellow-500" />
    }
  }

  const getStatusMessage = () => {
    switch (order.status) {
      case 'paid':
        return {
          title: '¡Pago Exitoso!',
          description: 'Tu pedido ha sido confirmado y será entregado en la fecha programada.',
          color: 'text-green-600'
        }
      case 'cancelled':
        return {
          title: 'Pago Cancelado',
          description: 'El pago fue cancelado o rechazado. Puedes intentar nuevamente.',
          color: 'text-red-600'
        }
      case 'pending':
      default:
        return {
          title: 'Procesando Pago...',
          description: 'Estamos verificando tu pago. Esto puede tomar unos minutos.',
          color: 'text-yellow-600'
        }
    }
  }

  const statusInfo = getStatusMessage()
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Status Card */}
          <Card>
            <CardContent className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="mb-6"
              >
                {getStatusIcon()}
              </motion.div>
              
              <h1 className={`text-2xl font-bold mb-2 ${statusInfo.color}`}>
                {statusInfo.title}
              </h1>
              <p className="text-muted-foreground mb-6">
                {statusInfo.description}
              </p>

              {order.status === 'pending' && isRefreshing && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Actualizando estado...
                </div>
              )}
          </CardContent>
        </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Detalles del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Número de Pedido</p>
                  <p className="font-medium">{OrderService.formatOrderNumber(order.order_number)}</p>
      </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge className={OrderService.getOrderStatusColor(order.status)}>
                    {OrderService.getOrderStatusLabel(order.status)}
                  </Badge>
    </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estudiante</p>
                  <p className="font-medium">{order.student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Entrega</p>
                  <p className="font-medium">
                    {format(new Date(order.delivery_date), "EEEE, d 'de' MMMM", { locale: es })}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Productos</h4>
                <div className="space-y-2">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x {ProductService.formatPrice(item.unit_price)}
                        </p>
                      </div>
                      <p className="font-medium">
                        {ProductService.formatPrice(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary">
                  {OrderService.formatPrice(order.total_amount)}
                </span>
              </div>

              {order.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Notas</p>
                    <p className="text-sm">{order.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Ir al Dashboard
            </Button>
            
            {order.status === 'cancelled' && (
              <Button
                onClick={() => router.push('/pedidos/nuevo')}
                className="flex-1"
              >
                Intentar Nuevamente
              </Button>
            )}
            
            {order.status === 'paid' && (
              <Button
                onClick={() => router.push('/pedidos/nuevo')}
                className="flex-1"
              >
                Realizar Otro Pedido
              </Button>
            )}
          </div>

          {/* Additional Information */}
          {order.status === 'paid' && (
            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  ¿Qué sigue?
                </h4>
                <ul className="text-sm text-green-600 dark:text-green-300 space-y-1">
                  <li>• Recibirás un email de confirmación</li>
                  <li>• El pedido será preparado para la fecha indicada</li>
                  <li>• Se entregará durante el horario de almuerzo/colación</li>
                  <li>• Puedes ver el estado en tu dashboard</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}