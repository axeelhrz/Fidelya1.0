import { useState, useEffect, useCallback } from 'react'
import { useOrderStore } from '@/store/orderStore'
import { useAuth } from '@/hooks/useAuth'
import { useMultiWeekMenu } from '@/hooks/useMultiWeekMenu'
import { MenuIntegrationService } from '@/services/menuIntegrationService'
import { OrderService } from '@/services/orderService'
import { MenuService } from '@/services/menuService'
import { DayMenuDisplay } from '@/types/menu'
import { WeekInfo } from '@/types/order'
import { OrderStateByChild } from '@/services/orderService'

interface UseOrderManagementReturn {
  // Estado del menú - ahora incluye múltiples semanas
  currentWeekMenu: DayMenuDisplay[]
  allWeeks: Array<{
    weekInfo: WeekInfo & { weekLabel: string }
    weekMenu: DayMenuDisplay[]
    isLoading: boolean
    error: string | null
    hasMenus: boolean
  }>
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
  refreshWeek: (weekStart: string) => Promise<void>
  processPayment: () => Promise<void>
  clearErrors: () => void
  retryPayment: () => Promise<void>
}

export function useOrderManagement(): UseOrderManagementReturn {
  const { getOrderSummaryByChild } = useOrderStore()
  const { user } = useAuth()
  
  // Usar el nuevo hook de múltiples semanas
  const { 
    weeks: allWeeks, 
    isLoading: isLoadingMultiWeek, 
    error: multiWeekError,
    refreshWeek,
    refreshAll
  } = useMultiWeekMenu(user, 4) // Mostrar 4 semanas próximas
  
  // Estados del pedido
  const [existingOrder, setExistingOrder] = useState<OrderStateByChild | null>(null)
  const [isLoadingOrder, setIsLoadingOrder] = useState(true)
  const [orderError, setOrderError] = useState<string | null>(null)
  
  // Estados del pago
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Obtener la semana actual y su menú
  const currentWeek = allWeeks.find(week => week.weekInfo.isCurrentWeek)
  const currentWeekMenu = currentWeek?.weekMenu || []
  const weekInfo = currentWeek?.weekInfo || null
  const isLoadingMenu = isLoadingMultiWeek || (currentWeek?.isLoading ?? true)
  const menuError = multiWeekError || currentWeek?.error || null

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

  // Procesar pago con mejor manejo de errores - CORREGIDO PARA MÚLTIPLES SEMANAS
  const processPayment = useCallback(async () => {
    if (!user) {
      setPaymentError('Información de usuario no disponible')
      return
    }

    try {
      setIsProcessingPayment(true)
      setPaymentError(null)

      const summary = getOrderSummaryByChild()
      
      console.log('Order summary from store:', summary)
      
      // Validar que hay selecciones
      if (!summary.selections || summary.selections.length === 0) {
        throw new Error('No hay elementos seleccionados para procesar el pago')
      }

      // NUEVO: Agrupar selecciones por semana para procesarlas correctamente
      const selectionsByWeek = new Map<string, typeof summary.selections>()
      
      for (const selection of summary.selections) {
        // Determinar a qué semana pertenece esta fecha
        const weekStart = MenuService.getWeekStartFromDate(MenuService.createLocalDate(selection.date))
        
        if (!selectionsByWeek.has(weekStart)) {
          selectionsByWeek.set(weekStart, [])
        }
        selectionsByWeek.get(weekStart)!.push(selection)
      }

      console.log('Selections grouped by week:', Object.fromEntries(selectionsByWeek))

      // Procesar cada semana por separado
      const processResults: Array<{
        weekStart: string
        success: boolean
        orderId?: string
        paymentUrl?: string
        error?: string
      }> = []

      for (const [weekStart, weekSelections] of selectionsByWeek) {
        console.log(`Processing week ${weekStart} with ${weekSelections.length} selections`)

        // Transformar selecciones al formato requerido para esta semana específica
        const processOrderSelections = weekSelections.map(selection => {
          const selectedItems: Array<{
            itemId: string
            itemName: string
            itemCode: string
            category: 'almuerzo' | 'colacion'
            price: number
            description?: string
          }> = []

          // Agregar almuerzo si existe
          if (selection.almuerzo) {
            selectedItems.push({
              itemId: selection.almuerzo.id,
              itemName: selection.almuerzo.name,
              itemCode: selection.almuerzo.code,
              category: 'almuerzo',
              price: selection.almuerzo.price,
              description: selection.almuerzo.description
            })
          }

          // Agregar colación si existe
          if (selection.colacion) {
            selectedItems.push({
              itemId: selection.colacion.id,
              itemName: selection.colacion.name,
              itemCode: selection.colacion.code,
              category: 'colacion',
              price: selection.colacion.price,
              description: selection.colacion.description
            })
          }

          return {
            childId: selection.hijo?.id || 'funcionario',
            childName: selection.hijo?.name || 'Funcionario',
            date: selection.date,
            selectedItems
          }
        }).filter(selection => selection.selectedItems.length > 0)

        console.log(`Transformed selections for week ${weekStart}:`, processOrderSelections)

        // Validar que hay selecciones transformadas para esta semana
        if (processOrderSelections.length === 0) {
          console.warn(`No valid selections for week ${weekStart}`)
          continue
        }

        // Procesar el pedido para esta semana específica
        try {
          const result = await MenuIntegrationService.processCompleteOrder(
            user,
            processOrderSelections,
            weekStart
          )

          processResults.push({
            weekStart,
            success: result.success,
            orderId: result.orderId,
            paymentUrl: result.paymentUrl,
            error: result.error
          })

          // Si es exitoso, redirigir inmediatamente al primer pago
          if (result.success && result.paymentUrl) {
            console.log(`Redirecting to payment URL for week ${weekStart}:`, result.paymentUrl)
            window.location.href = result.paymentUrl
            return // Salir después de la primera redirección exitosa
          }

        } catch (weekError) {
          console.error(`Error processing week ${weekStart}:`, weekError)
          processResults.push({
            weekStart,
            success: false,
            error: weekError instanceof Error ? weekError.message : 'Error desconocido'
          })
        }
      }

      // Si llegamos aquí, ningún pago fue exitoso
      const failedResults = processResults.filter(r => !r.success)
      if (failedResults.length > 0) {
        const errorMessages = failedResults.map(r => `Semana ${r.weekStart}: ${r.error}`).join('; ')
        throw new Error(`Error procesando pagos: ${errorMessages}`)
      } else if (processResults.length === 0) {
        throw new Error('No hay selecciones válidas para procesar el pago')
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
        } else if (error.message.includes('seleccionados') || error.message.includes('selecciones válidas')) {
          errorMessage = 'Debes seleccionar al menos un elemento antes de proceder al pago.'
        } else {
          errorMessage = error.message
        }
      }
      
      setPaymentError(errorMessage)
    } finally {
      setIsProcessingPayment(false)
    }
  }, [user, getOrderSummaryByChild])

  // Reintentar pago
  const retryPayment = useCallback(async () => {
    setPaymentError(null)
    await processPayment()
  }, [processPayment])

  // Refrescar menú (todas las semanas)
  const refreshMenu = useCallback(async () => {
    await refreshAll()
  }, [refreshAll])

  // Limpiar errores
  const clearErrors = useCallback(() => {
    setOrderError(null)
    setPaymentError(null)
  }, [])

  // Efectos
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
    // Estado del menú - ahora incluye múltiples semanas
    currentWeekMenu,
    allWeeks,
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
    refreshWeek,
    processPayment,
    clearErrors,
    retryPayment
  }
}