"use client"
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, ArrowLeft, Receipt } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Order, Payment, Student } from '@/lib/supabase/types'

interface PaymentResult {
  order: Order & {
    students: Student
    payments: Payment[]
  }
  status: 'success' | 'pending' | 'failed' | 'not_found'
}
export default function PaymentResultPage() {
  const [result, setResult] = useState<PaymentResult | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()

  const orderId = searchParams.get('orderId')
  const status = searchParams.get('status')
  useEffect(() => {
    if (orderId) {
      checkPaymentStatus()
    } else {
      setLoading(false)
    }
  }, [orderId])

  const checkPaymentStatus = async () => {
    try {
      setLoading(true)

      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          students (
            id,
            name,
            grade,
            section
          ),
          payments (
            id,
            status,
            amount,
            getnet_transaction_id,
            processed_at
          )
        `)
        .eq('id', orderId)
        .single()

      if (error || !order) {
        setResult({ order: null as any, status: 'not_found' })
        return
      }

      // Determinar estado basado en el pedido y pagos
      let paymentStatus: 'success' | 'pending' | 'failed' = 'pending'

      if (order.status === 'PAGADO') {
        paymentStatus = 'success'
      } else if (order.status === 'CANCELADO') {
        paymentStatus = 'failed'
      } else if (order.payments && order.payments.length > 0) {
        const latestPayment = order.payments[order.payments.length - 1]
        if (latestPayment.status === 'APPROVED') {
          paymentStatus = 'success'
        } else if (latestPayment.status === 'REJECTED') {
          paymentStatus = 'failed'
        }
      }

      setResult({
        order: order as any,
        status: paymentStatus
      })

    } catch (error) {
      console.error('Error checking payment status:', error)
      setResult({ order: null as any, status: 'not_found' })
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Verificando estado del pago...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!result || result.status === 'not_found') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-500" />
              Pedido no encontrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              No se pudo encontrar información sobre este pedido.
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { order, status: paymentStatus } = result

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {paymentStatus === 'success' && (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  ¡Pago exitoso!
                </>
              )}
              {paymentStatus === 'pending' && (
                <>
                  <Clock className="h-6 w-6 text-yellow-500" />
                  Pago pendiente
                </>
              )}
              {paymentStatus === 'failed' && (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  Pago fallido
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Estado del pago */}
            <div className="text-center">
              <Badge 
                variant={
                  paymentStatus === 'success' ? 'default' :
                  paymentStatus === 'pending' ? 'secondary' : 'destructive'
                }
                className="text-lg px-4 py-2"
              >
                {paymentStatus === 'success' && 'Pagado'}
                {paymentStatus === 'pending' && 'Pendiente'}
                {paymentStatus === 'failed' && 'Fallido'}
              </Badge>
            </div>

            {/* Mensaje según estado */}
            <div className="text-center">
              {paymentStatus === 'success' && (
                <p className="text-green-600">
                  Tu pedido ha sido confirmado y será preparado para la fecha de entrega.
                </p>
              )}
              {paymentStatus === 'pending' && (
                <p className="text-yellow-600">
                  Tu pago está siendo procesado. Te notificaremos cuando se confirme.
                </p>
              )}
              {paymentStatus === 'failed' && (
                <p className="text-red-600">
                  Hubo un problema con tu pago. Por favor intenta nuevamente.
                </p>
              )}
            </div>

            {/* Detalles del pedido */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Detalles del pedido</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pedido #:</span>
                  <span className="font-mono">{order.id.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estudiante:</span>
                  <span>{order.students.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Curso:</span>
                  <span>{order.students.grade} {order.students.section}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de entrega:</span>
                  <span>{formatDate(order.fecha_pedido)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Día:</span>
                  <span>{order.dia_entrega}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Información de transacción */}
            {order.payments && order.payments.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Información de transacción</h3>
                <div className="space-y-2 text-sm">
                  {order.payments.map((payment, index) => (
                    <div key={payment.id} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID Transacción:</span>
                        <span className="font-mono text-xs">
                          {payment.getnet_transaction_id?.substring(0, 16)}...
                        </span>
                      </div>
                      {payment.processed_at && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Procesado:</span>
                          <span>{new Date(payment.processed_at).toLocaleString('es-CL')}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="border-t pt-6 space-y-3">
              {paymentStatus === 'success' && (
                <Button asChild className="w-full">
                  <Link href="/dashboard">
                    <Receipt className="h-4 w-4 mr-2" />
                    Ver mis pedidos
                  </Link>
                </Button>
              )}
              
              {paymentStatus === 'failed' && (
                <Button asChild className="w-full">
                  <Link href="/pedidos/nuevo">
                    Intentar nuevamente
                  </Link>
                </Button>
              )}

              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al inicio
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}