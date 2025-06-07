'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, Clock, AlertCircle, ArrowLeft, Receipt } from 'lucide-react'
import { OrderService, OrderStateByChild } from '@/services/orderService'

type PaymentStatus = 'success' | 'failed' | 'pending' | 'cancelled' | 'unknown'

interface PaymentResult {
  status: PaymentStatus
  orderId?: string
  requestId?: string
  message?: string
  order?: OrderStateByChild
}

export default function PaymentReturnPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processPaymentReturn = async () => {
      try {
        // Obtener parámetros de la URL
        const status = searchParams.get('status')
        const orderId = searchParams.get('reference') || searchParams.get('orderId')
        const requestId = searchParams.get('requestId')
        const message = searchParams.get('message')

        console.log('Payment return params:', { status, orderId, requestId, message })

        if (!orderId) {
          setError('No se encontró información del pedido')
          setLoading(false)
          return
        }

        // Obtener el pedido actualizado de Firebase
        const order = await OrderService.getOrderById(orderId)
        if (!order) {
          setError('No se pudo encontrar el pedido')
          setLoading(false)
          return
        }

        // Determinar el estado del pago basado en el estado del pedido
        let paymentStatus: PaymentStatus = 'unknown'
        
        if (order.status === 'pagado') {
          paymentStatus = 'success'
        } else if (order.status === 'cancelado') {
          paymentStatus = 'failed'
        } else if (order.status === 'procesando_pago') {
          paymentStatus = 'pending'
        } else if (status === 'cancelled') {
          paymentStatus = 'cancelled'
        }

        setPaymentResult({
          status: paymentStatus,
          orderId,
          requestId: requestId || undefined,
          message: message || getStatusMessage(paymentStatus),
          order
        })

      } catch (err) {
        console.error('Error processing payment return:', err)
        setError('Error al procesar el resultado del pago')
      } finally {
        setLoading(false)
      }
    }

    processPaymentReturn()
  }, [searchParams])

  const getStatusMessage = (status: PaymentStatus): string => {
    switch (status) {
      case 'success':
        return 'Tu pago ha sido procesado exitosamente'
      case 'failed':
        return 'El pago no pudo ser procesado'
      case 'pending':
        return 'Tu pago está siendo procesado'
      case 'cancelled':
        return 'El pago fue cancelado'
      default:
        return 'Estado del pago desconocido'
    }
  }

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case 'failed':
        return <XCircle className="h-16 w-16 text-red-500" />
      case 'pending':
        return <Clock className="h-16 w-16 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="h-16 w-16 text-gray-500" />
      default:
        return <AlertCircle className="h-16 w-16 text-gray-500" />
    }
  }

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Pagado</Badge>
      case 'failed':
        return <Badge variant="destructive">Fallido</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500">Pendiente</Badge>
      case 'cancelled':
        return <Badge variant="outline">Cancelado</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando resultado del pago...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => router.push('/panel')} className="w-full">
                Volver al Panel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!paymentResult) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          {getStatusIcon(paymentResult.status)}
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
            {paymentResult.status === 'success' ? '¡Pago Exitoso!' : 
             paymentResult.status === 'pending' ? 'Pago Pendiente' :
             paymentResult.status === 'cancelled' ? 'Pago Cancelado' : 'Pago Fallido'}
          </h1>
          <p className="text-gray-600">{paymentResult.message}</p>
        </div>

        {/* Payment Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Estado del Pago</span>
              {getStatusBadge(paymentResult.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentResult.orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ID del Pedido:</span>
                  <span className="font-mono text-sm">{paymentResult.orderId}</span>
                </div>
              )}
              {paymentResult.requestId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Transacción:</span>
                  <span className="font-mono text-sm">{paymentResult.requestId}</span>
                </div>
              )}
              {paymentResult.order && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha del Pedido:</span>
                  <span>{formatDate(paymentResult.order.createdAt)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        {paymentResult.order && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Resumen del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Week Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Semana del Menú</h4>
                  <p className="text-gray-600">{paymentResult.order.weekStart}</p>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Selecciones</h4>
                  <div className="space-y-3">
                    {paymentResult.order.resumenPedido.map((selection, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{selection.dia}</p>
                            <p className="text-sm text-gray-600">{selection.fecha}</p>
                            {selection.hijo && (
                              <p className="text-sm text-blue-600">Para: {selection.hijo.name}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          {selection.almuerzo && (
                            <div className="flex justify-between text-sm">
                              <span>🍽️ {selection.almuerzo.name}</span>
                              <span>{formatCurrency(selection.almuerzo.price)}</span>
                            </div>
                          )}
                          {selection.colacion && (
                            <div className="flex justify-between text-sm">
                              <span>🥪 {selection.colacion.name}</span>
                              <span>{formatCurrency(selection.colacion.price)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Pagado:</span>
                  <span>{formatCurrency(paymentResult.order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={() => router.push('/panel')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Panel
          </Button>
          
          {paymentResult.status === 'success' && (
            <Button 
              onClick={() => router.push('/menu')}
              className="flex-1"
            >
              Ver Menú de la Semana
            </Button>
          )}
          
          {paymentResult.status === 'failed' && (
            <Button 
              onClick={() => router.push('/mi-pedido')}
              className="flex-1"
            >
              Intentar Nuevamente
            </Button>
          )}
        </div>

        {/* Additional Info */}
        {paymentResult.status === 'pending' && (
          <Card className="mt-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Pago en Proceso</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Tu pago está siendo procesado. Recibirás una confirmación por email una vez que se complete. 
                    Puedes revisar el estado en tu panel de usuario.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentResult.status === 'failed' && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Pago No Procesado</h4>
                  <p className="text-red-700 text-sm mt-1">
                    Tu pago no pudo ser procesado. Puedes intentar nuevamente o contactar con soporte si el problema persiste.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
