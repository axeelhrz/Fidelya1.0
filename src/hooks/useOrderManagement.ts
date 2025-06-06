import { useState, useEffect } from 'react'
import { useOrderStore } from '@/store/orderStore'
import { OrderService } from '@/services/orderService'
import { OrderState, OrderValidation } from '@/types/order'
import { User } from '@/types/panel'

interface UseOrderManagementProps {
  user: User | null
  weekStart: string
  weekDays: string[]
  isOrderingAllowed: boolean
}

export function useOrderManagement({ 
  user, 
  weekStart, 
  weekDays, 
  isOrderingAllowed 
}: UseOrderManagementProps) {
  const [existingOrder, setExistingOrder] = useState<OrderState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [validation, setValidation] = useState<OrderValidation>({
    isValid: false,
    errors: [],
    warnings: [],
    missingDays: [],
    canProceedToPayment: false
  })

  const { 
    selections, 
    setUserType, 
    updateSelection, 
    getOrderSummary 
  } = useOrderStore()

  // Cargar pedido existente
  useEffect(() => {
    async function loadExistingOrder() {
      if (!user) return

      setIsLoading(true)
      try {
        const order = await OrderService.getUserOrder(user.id, weekStart)
        setExistingOrder(order)
        
        if (order && order.status === 'draft') {
          // Cargar selecciones del pedido existente
          order.selections.forEach(selection => {
            if (selection.almuerzo) {
              updateSelection(selection.date, 'almuerzo', selection.almuerzo)
            }
            if (selection.colacion) {
              updateSelection(selection.date, 'colacion', selection.colacion)
            }
          })
        }
      } catch (error) {
        console.error('Error loading existing order:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadExistingOrder()
  }, [user, weekStart])

  // Establecer tipo de usuario
  useEffect(() => {
    if (user) {
      setUserType(user.userType === 'funcionario' ? 'funcionario' : 'estudiante')
    }
  }, [user, setUserType])

  // Validar pedido cuando cambian las selecciones
  useEffect(() => {
    const newValidation = OrderService.validateOrder(
      selections, 
      weekDays, 
      isOrderingAllowed
    )
    setValidation(newValidation)
  }, [selections, weekDays, isOrderingAllowed])

  const saveOrder = async (): Promise<string | null> => {
    if (!user || !validation.canProceedToPayment) {
      return null
    }

    setIsSaving(true)
    try {
      const summary = getOrderSummary()
      
      const orderData: Omit<OrderState, 'id' | 'createdAt'> = {
        userId: user.id,
        weekStart,
        selections: summary.selections,
        total: summary.total,
        status: 'pending'
      }

      let orderId: string

      if (existingOrder?.id) {
        await OrderService.updateOrder(existingOrder.id, orderData)
        orderId = existingOrder.id
      } else {
        orderId = await OrderService.saveOrder(orderData)
      }

      return orderId
    } catch (error) {
      console.error('Error saving order:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const isReadOnly = existingOrder?.status === 'paid' || !isOrderingAllowed

  return {
    existingOrder,
    isLoading,
    isSaving,
    validation,
    isReadOnly,
    saveOrder,
    orderSummary: getOrderSummary()
  }
}
