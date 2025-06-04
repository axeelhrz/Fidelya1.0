'use client'

import { useState, useEffect } from 'react'
import { OrderWithDetails, OrderFilters } from '@/types'
import { OrderService } from '@/lib/orders/orderService'
import { toast } from 'sonner'

export function useOrders(filters?: OrderFilters) {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await OrderService.getUserOrders(filters)
        setOrders(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading orders'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [filters])

  const refreshOrders = async () => {
    try {
      setIsLoading(true)
      const data = await OrderService.getUserOrders(filters)
      setOrders(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error refreshing orders'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelOrder = async (orderId: string) => {
    try {
      await OrderService.cancelOrder(orderId)
      toast.success('Pedido cancelado exitosamente')
      await refreshOrders()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cancelling order'
      toast.error(errorMessage)
      throw err
    }
  }

  return {
    orders,
    isLoading,
    error,
    refreshOrders,
    cancelOrder,
  }
}

export function useCreateOrder() {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = async (orderData: {
    student_id: string
    delivery_date: string
    products: { product_id: string; quantity: number }[]
    notes?: string
  }) => {
    try {
      setIsCreating(true)
      setError(null)
      const order = await OrderService.createOrder(orderData)
      toast.success('Pedido creado exitosamente')
      return order
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating order'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createOrder,
    isCreating,
    error,
  }
}

export function useOrderDetails(orderId: string) {
  const [order, setOrder] = useState<OrderWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await OrderService.getOrderById(orderId)
        setOrder(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading order details'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const refreshOrder = async () => {
    if (!orderId) return

    try {
      setIsLoading(true)
      const data = await OrderService.getOrderById(orderId)
      setOrder(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error refreshing order'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    order,
    isLoading,
    error,
    refreshOrder,
  }
}