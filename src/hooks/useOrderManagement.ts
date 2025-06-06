import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { useOrderStore } from '@/store/orderStore'
import { MenuIntegrationService } from '@/services/menuIntegrationService'
import { OrderService } from '@/services/orderService'
import { MenuService } from '@/services/menuService'
import { DayMenuDisplay } from '@/types/menu'
import { OrderStateByChild } from '@/services/orderService'

interface UseOrderManagementReturn {
  // Estado del menú
  weekMenu: DayMenuDisplay[]
  isLoadingMenu: boolean
  menuError: string | null
  weekInfo: any
  
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
}

export function useOrderManagement(): UseOrderManagementReturn {
  const { user } = useAuth()
  const { getOrderSummaryByChild } = useOrderStore()
  
  // Estados del menú
  const [weekMenu, setWeekMenu] = useState<DayMenuDisplay[]>([])
  const [isLoadingMenu, setIsLoadingMenu] = useState(true)
  const [menuError, setMenuError] = useState<string | null>(null)
  const [weekInfo, setWeekInfo] = useState<any>(null)
  
  // Estados del pedido
  const [existingOrder, setExistingOrder] = useState<OrderStateByChild | null>(null)
  const [isLoadingOrder, setIsLoadingOrder] = useState(true)
  const [orderError, setOrderError] = useState<string | null>(null)
  
  // Estados del pago
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Cargar datos del menú
  const loadMenuData = useCallback(async () => {
    if (!user) return

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
    } finally {
      setIsLoadingMenu(false)
    }
  }, [user])

  // Cargar pedido existente
  const loadExistingOrder = useCallback(async () => {
    if (!user || !weekInfo) return

    try {
      setIsLoadingOrder(true)
      setOrderError(null)

      const order = await OrderService.getUserOrder(user.id, weekInfo.weekStart)
      setExistingOrder(order)

    } catch (error) {
      console.error('Error loading existing order:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar el pedido'
      setOrderError(errorMessage)
    } finally {
      setIsLoadingOrder(false)
    }
  }, [user, weekInfo])

  // Procesar pago
  const processPayment = useCallback(async () => {
    if (!user || !weekInfo) return

    try {
      setIsProcessingPayment(true)
      setPaymentError(null)

      const summary = getOrderSummaryByChild()
      
      // Usar el servicio de integración para procesar el pedido completo
      const result = await MenuIntegrationService.processCompleteOrder(
        user,
        summary.selections,
        weekInfo.weekStart
      )

      if (result.success && result.paymentUrl) {
        // Actualizar el pedido existente
        if (result.orderId) {
          const updatedOrder = await OrderService.getOrderById(result.orderId)
          setExistingOrder(updatedOrder)
        }

        // Redirigir a la página de pago
        window.location.href = result.paymentUrl
      } else {
        throw new Error(result.error || 'Error al procesar el pago')
      }

    } catch (error) {
      console.error('Error processing payment:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pago'
      setPaymentError(errorMessage)
    } finally {
      setIsProcessingPayment(false)
    }
  }, [user, weekInfo, getOrderSummaryByChild])

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
    }
  }, [user, loadMenuData])

  useEffect(() => {
    if (user && weekInfo) {
      loadExistingOrder()
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
    clearErrors
  }
}