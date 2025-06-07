import { useState, useEffect, useCallback } from 'react'
import { useOrderStore } from '@/store/orderStore'
import { useAuth } from '@/hooks/useAuth'
import { MenuIntegrationService } from '@/services/menuIntegrationService'
import { OrderService } from '@/services/orderService'
import { MenuService } from '@/services/menuService'
import { DayMenuDisplay } from '@/types/menu'
import { WeekInfo } from '@/types/order'
import { OrderStateByChild } from '@/services/orderService'

interface UseOrderManagementReturn {
  // Estado del menú
  weekMenu: DayMenuDisplay[]
  isLoadingMenu: boolean
  menuError: string | null
  weekInfo: WeekInfo | null
  
  // Estado del pedido
  existingOrder: OrderStateByChild | null
  isLoadingOrder: boolean
  orderError: string | null
  
  // Estado del pago
  isProcessingPayment: boolean
  paymentError: string | null
  
  // Acciones
  refreshMenu: () => Promise<void>
  processPayment: () => Promise<void>
  clearErrors: () => void
  retryPayment: () => Promise<void>
}

export function useOrderManagement(): UseOrderManagementReturn {
  const { getOrderSummaryByChild } = useOrderStore()
  const { user } = useAuth() // Corregido: usar useAuth en lugar de useAuthStore
  
  // Estados del menú
  const [weekMenu, setWeekMenu] = useState<DayMenuDisplay[]>([])
  const [isLoadingMenu, setIsLoadingMenu] = useState(true)
  const [menuError, setMenuError] = useState<string | null>(null)
  const [weekInfo, setWeekInfo] = useState<WeekInfo | null>(null)
  
  // Estados del pedido
  const [existingOrder, setExistingOrder] = useState<OrderStateByChild | null>(null)
  const [isLoadingOrder, setIsLoadingOrder] = useState(true)
  const [orderError, setOrderError] = useState<string | null>(null)
  
  // Estados del pago
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Cargar datos del menú
  const loadMenuData = useCallback(async () => {
    if (!user) {
      setIsLoadingMenu(false)
      return
    }

    try {
      setIsLoadingMenu(true)
      setMenuError(null)

      // Obtener información de la semana actual
      const currentWeekInfo = MenuService.getCurrentWeekInfo()
      setWeekInfo(currentWeekInfo)

      // Cargar menú con precios según tipo de usuario
      const menuData = await MenuIntegrationService.getPublicWeeklyMenu(
        user.tipoUsuario,
        currentWeekInfo.weekStart
      )
      
      setWeekMenu(menuData)

    } catch (error) {
      console.error('Error loading menu data:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar el menú'
      setMenuError(errorMessage)
      setWeekMenu([]) // Asegurar que weekMenu esté vacío en caso de error
    } finally {
      setIsLoadingMenu(false)
    }
  }, [user])

  // Cargar pedido existente
  const loadExistingOrder = useCallback(async () => {
    if (!user || !weekInfo) {
      setIsLoadingOrder(false)
      return
    }

    try {
      setIsLoadingOrder(true)
      setOrderError(null)

      const order = await OrderService.getUserOrder(user.id, weekInfo.weekStart)
      setExistingOrder(order)

    } catch (error) {
      console.error('Error loading existing order:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar el pedido'
      setOrderError(errorMessage)
      setExistingOrder(null)
    } finally {
      setIsLoadingOrder(false)
    }
  }, [user, weekInfo])

  // Procesar pago con mejor manejo de errores
  const processPayment = useCallback(async () => {
    if (!user || !weekInfo) {
      setPaymentError('Información de usuario o semana no disponible')
      return
    }

    try {
      setIsProcessingPayment(true)
      setPaymentError(null)

      const summary = getOrderSummaryByChild()
      
      // Validar que hay selecciones
      if (!summary.selections || summary.selections.length === 0) {
        throw new Error('No hay elementos seleccionados para procesar el pago')
      }

      // Usar el servicio de integración para procesar el pedido completo
      const result = await MenuIntegrationService.processCompleteOrder(
        user,
        summary.selections,
        weekInfo.weekStart
      )

      if (result.success && result.paymentUrl) {
        // Actualizar el pedido existente
        if (result.orderId) {
          try {
            const updatedOrder = await OrderService.getOrderById(result.orderId)
            setExistingOrder(updatedOrder)
          } catch (orderError) {
            console.warn('Could not fetch updated order:', orderError)
            // No es crítico, continuar con el pago
          }
        }

        // Redirigir a la página de pago
        console.log('Redirecting to payment URL:', result.paymentUrl)
        window.location.href = result.paymentUrl
      } else {
        throw new Error(result.error || 'Error al procesar el pago')
      }

    } catch (error) {
      console.error('Error processing payment:', error)
      
      // Proporcionar mensajes de error más específicos
      let errorMessage = 'Error al procesar el pago'
      
      if (error instanceof Error) {
        if (error.message.includes('no disponible')) {
          errorMessage = 'El servicio de pagos no está disponible temporalmente. Por favor, intenta más tarde.'
        } else if (error.message.includes('conexión')) {
          errorMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente.'
        } else if (error.message.includes('configuración')) {
          errorMessage = 'Error de configuración del sistema. Contacta al administrador.'
        } else if (error.message.includes('seleccionados')) {
          errorMessage = 'Debes seleccionar al menos un elemento antes de proceder al pago.'
        } else {
          errorMessage = error.message
        }
      }
      
      setPaymentError(errorMessage)
    } finally {
      setIsProcessingPayment(false)
    }
  }, [user, weekInfo, getOrderSummaryByChild])

  // Reintentar pago
  const retryPayment = useCallback(async () => {
    setPaymentError(null)
    await processPayment()
  }, [processPayment])

  // Refrescar menú
  const refreshMenu = useCallback(async () => {
    await loadMenuData()
  }, [loadMenuData])

  // Limpiar errores
  const clearErrors = useCallback(() => {
    setMenuError(null)
    setOrderError(null)
    setPaymentError(null)
  }, [])

  // Efectos
  useEffect(() => {
    if (user) {
      loadMenuData()
    } else {
      // Si no hay usuario, limpiar estados
      setWeekMenu([])
      setWeekInfo(null)
      setIsLoadingMenu(false)
    }
  }, [user, loadMenuData])

  useEffect(() => {
    if (user && weekInfo) {
      loadExistingOrder()
    } else {
      // Si no hay usuario o weekInfo, limpiar estado del pedido
      setExistingOrder(null)
      setIsLoadingOrder(false)
    }
  }, [user, weekInfo, loadExistingOrder])

  return {
    // Estado del menú
    weekMenu,
    isLoadingMenu,
    menuError,
    weekInfo,
    
    // Estado del pedido
    existingOrder,
    isLoadingOrder,
    orderError,
    
    // Estado del pago
    isProcessingPayment,
    paymentError,
    
    // Acciones
    refreshMenu,
    processPayment,
    clearErrors,
    retryPayment
  }
}