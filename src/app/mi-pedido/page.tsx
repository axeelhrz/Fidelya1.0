"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useOrderStore } from '@/store/orderStore'
import { useWeeklyMenuData } from '@/hooks/useWeeklyMenuData'
import { OrderService } from '@/services/orderService'
import { PaymentService } from '@/services/paymentService'
import { Navbar } from '@/components/panel/Navbar'
import { ChildSelector } from '@/components/mi-pedido/ChildSelector'
import { DaySelector } from '@/components/mi-pedido/DaySelector'
import { OrderSummary } from '@/components/mi-pedido/OrderSummary'
import { OrderHeader } from '@/components/mi-pedido/OrderHeader'
import { PaymentButton } from '@/components/mi-pedido/PaymentButton'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  RefreshCw,
  Calendar,
  Users,
  User as UserIcon,
  Info,
  CalendarDays,
  Utensils,
  CreditCard,
  ExternalLink
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// Helper function to create local date from YYYY-MM-DD string
function createLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day) // month is 0-indexed
}

export default function MiPedidoPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { 
    selectionsByChild, 
    setUserType, 
    setChildren,
    loadExistingSelections,
    clearSelectionsByChild,
    getOrderSummaryByChild
  } = useOrderStore()

  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [existingOrder, setExistingOrder] = useState<any>(null)
  const [isLoadingOrder, setIsLoadingOrder] = useState(true)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Obtener datos del menú semanal desde admin/menus
  const { weekMenu, isLoading: menuLoading, error: menuError, weekInfo, refetch } = useWeeklyMenuData({ 
    user,
    useAdminData: true // Usar datos de admin/menus
  })

  // Cargar pedido existente
  useEffect(() => {
    const loadExistingOrder = async () => {
      if (!user || !weekInfo) return

      try {
        setIsLoadingOrder(true)
        const order = await OrderService.getUserOrder(user.id, weekInfo.weekStart)
        
        if (order) {
          setExistingOrder(order)
          loadExistingSelections(order.resumenPedido)
        } else {
          setExistingOrder(null)
          clearSelectionsByChild()
        }
      } catch (error) {
        console.error('Error loading existing order:', error)
      } finally {
        setIsLoadingOrder(false)
      }
    }

    loadExistingOrder()
  }, [user, weekInfo, loadExistingSelections, clearSelectionsByChild])

  // Configurar tipo de usuario y hijos
  useEffect(() => {
    if (user) {
      setUserType(user.tipoUsuario)
      if (user.tipoUsuario === 'apoderado' && user.children) {
        setChildren(user.children.filter(child => child.active))
      }
    }
  }, [user, setUserType, setChildren])

  const handleProceedToPayment = async () => {
    if (!user || !weekInfo) return

    try {
      setIsProcessingPayment(true)
      setPaymentError(null)
      
      const summary = getOrderSummaryByChild()
      
      // Validar pedido
      const validation = OrderService.validateOrderByChild(
        summary.selections,
        weekMenu.map(day => day.date),
        true, // Siempre permitir pedidos (sin restricción de horario)
        user
      )

      if (!validation.isValid) {
        throw new Error(validation.errors[0])
      }

      // Crear o actualizar pedido
      const orderData = {
        userId: user.id,
        tipoUsuario: user.tipoUsuario,
        weekStart: weekInfo.weekStart,
        resumenPedido: summary.selections,
        total: summary.total,
        status: 'pendiente' as const
      }

      let orderId: string
      if (existingOrder) {
        await OrderService.updateOrder(existingOrder.id, orderData)
        orderId = existingOrder.id
      } else {
        orderId = await OrderService.saveOrder(orderData)
        setExistingOrder({ ...orderData, id: orderId })
      }

      // Procesar pago con NetGet
      console.log('Initiating NetGet payment for order:', orderId)
      
      const paymentRequest = {
        amount: summary.total,
        orderId: orderId,
        description: `Pedido Casino Escolar - Semana ${weekInfo.weekLabel}`,
        customerEmail: user.email || user.correo || '',
        customerName: user.name || user.nombre || `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }

      console.log('Payment request:', paymentRequest)

      const paymentResponse = await PaymentService.createPayment(paymentRequest)
      
      if (paymentResponse.success && paymentResponse.redirectUrl) {
        console.log('NetGet payment created, redirecting to:', paymentResponse.redirectUrl)
        
        // Actualizar pedido con ID de pago
        await OrderService.updateOrder(orderId, {
          paymentId: paymentResponse.paymentId,
          status: 'procesando_pago'
        })

        // Redirigir a NetGet para completar el pago
        window.location.href = paymentResponse.redirectUrl
      } else {
        throw new Error(paymentResponse.error || 'Error al inicializar el pago')
      }

    } catch (error) {
      console.error('Error processing payment:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pago'
      setPaymentError(errorMessage)
      alert(errorMessage)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleLogout = () => {
    clearSelectionsByChild()
  }

  const isReadOnly = existingOrder?.status === 'pagado'
  const summary = getOrderSummaryByChild()

  // Separar días laborales y fines de semana usando el índice en lugar del día de la semana
  const weekDays = weekMenu.filter((day, index) => {
    // Los primeros 5 días (índices 0-4) son días laborales (lunes a viernes)
    return index < 5
  })
  
  const weekendDays = weekMenu.filter((day, index) => {
    // Los últimos 2 días (índices 5-6) son fin de semana (sábado y domingo)
    return index >= 5
  })

  console.log('Week days (should be Mon-Fri):', weekDays.map(d => `${d.dayLabel} ${d.date}`))
  console.log('Weekend days (should be Sat-Sun):', weekendDays.map(d => `${d.dayLabel} ${d.date}`))

  if (authLoading || menuLoading || isLoadingOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <Skeleton className="h-32 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <Skeleton key={i} className="h-96 w-full" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Requerido</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Debes iniciar sesión para acceder a esta página
            </p>
            <Button onClick={() => window.location.href = '/auth/login'}>
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (menuError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error al cargar el menú</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">{menuError}</p>
              <Button onClick={refetch} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Reintentar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <CalendarDays className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                Mi Pedido Semanal
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Planifica tus comidas de la semana con menús actualizados
              </p>
            </div>
          </div>
          
          {weekInfo && (
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="text-sm px-3 py-1">
                <Calendar className="w-3 h-3 mr-1" />
                {weekInfo.weekLabel}
              </Badge>
              
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-3 py-1">
                <CheckCircle className="w-3 h-3 mr-1" />
                Menús desde Admin
              </Badge>

              {existingOrder?.status === 'pagado' && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-3 py-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Pedido Pagado
                </Badge>
              )}

              {existingOrder?.status === 'procesando_pago' && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 px-3 py-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Procesando Pago
                </Badge>
              )}
            </div>
          )}
        </motion.div>

        {/* Información sobre integración */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>Menús actualizados:</strong> Los menús se obtienen directamente desde la administración. 
              Los pagos se procesan de forma segura con NetGet. Puedes hacer pedidos para hoy y días futuros.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Error de pago */}
        {paymentError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{paymentError}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPaymentError(null)}
                  className="ml-4"
                >
                  Cerrar
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-3 space-y-8">
            {/* Selector de hijo (solo para apoderados) */}
            {user.tipoUsuario === 'apoderado' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ChildSelector user={user} isReadOnly={isReadOnly} />
              </motion.div>
            )}

            {/* Información del usuario funcionario */}
            {user.tipoUsuario === 'funcionario' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                          Pedido Personal
                        </span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ml-2">
                          Funcionario
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Menús por día */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Días laborales */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <Utensils className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Días Laborales
                  </h2>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    Lunes a Viernes
                  </Badge>
                </div>
                
                {weekDays.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                        No hay menús disponibles
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        El menú para esta semana aún no ha sido publicado por el administrador.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => window.open('/admin/menus', '_blank')}
                        className="gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Ver Panel Admin
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {weekDays.map((dayMenu, index) => (
                      <motion.div
                        key={dayMenu.date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <DaySelector
                          dayMenu={dayMenu}
                          user={user}
                          isReadOnly={isReadOnly}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fines de semana */}
              {weekendDays.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Fin de Semana
                    </h2>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      Sábado y Domingo
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {weekendDays.map((dayMenu, index) => (
                      <motion.div
                        key={dayMenu.date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <DaySelector
                          dayMenu={dayMenu}
                          user={user}
                          isReadOnly={isReadOnly}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Resumen del pedido */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <OrderSummary
              user={user}
              onProceedToPayment={handleProceedToPayment}
              isProcessingPayment={isProcessingPayment}
            />

            {/* Botón de pago */}
            {weekMenu.length > 0 && (
              <PaymentButton
                summary={summary}
                weekDays={weekMenu.map(day => day.date)}
                isOrderingAllowed={true} // Siempre permitir pedidos
                onProceedToPayment={handleProceedToPayment}
                isProcessingPayment={isProcessingPayment}
                isReadOnly={isReadOnly}
                user={user}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}