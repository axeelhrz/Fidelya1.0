import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  Timestamp,
  getDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { AdminOrderView, OrderFilters, OrderMetrics, OrderUpdateRequest, OrderDetailView } from '@/types/adminOrder'
import { format, parseISO, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

export class AdminOrderService {
  // Cache para mejorar rendimiento
  private static cache = new Map<string, { data: AdminOrderView[]; timestamp: number }>()
  private static CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

  private static getCacheKey(filters: OrderFilters): string {
    return JSON.stringify(filters)
  }

  private static isValidCache(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.CACHE_DURATION
  }

  static async getOrdersWithFilters(filters: OrderFilters): Promise<AdminOrderView[]> {
    try {
      const cacheKey = this.getCacheKey(filters)
      
      // Verificar cache
      if (this.isValidCache(cacheKey)) {
        return this.cache.get(cacheKey)!.data
      }

      const ordersRef = collection(db, 'orders')
      let q = query(ordersRef, orderBy('createdAt', 'desc'))

      // Aplicar filtros de Firestore
      if (filters.weekStart) {
        q = query(q, where('weekStart', '==', filters.weekStart))
      }

      if (filters.status && filters.status !== 'all') {
        q = query(q, where('status', '==', filters.status))
      }

      const ordersSnapshot = await getDocs(q)
      const orders: AdminOrderView[] = []

      // Procesar pedidos en lotes para mejor rendimiento
      const batchSize = 10
      const orderDocs = ordersSnapshot.docs
      
      for (let i = 0; i < orderDocs.length; i += batchSize) {
        const batch = orderDocs.slice(i, i + batchSize)
        const batchPromises = batch.map(async (orderDoc) => {
          try {
            const orderData = orderDoc.data()
            
            // Obtener datos del usuario
            const userDoc = await getDoc(doc(db, 'users', orderData.userId))
            if (!userDoc.exists()) return null

            const userData = userDoc.data()

            // Aplicar filtros del lado del cliente
            if (filters.userType && filters.userType !== 'all' && userData.userType !== filters.userType) {
              return null
            }

            if (filters.searchTerm) {
              const searchLower = filters.searchTerm.toLowerCase()
              const fullName = `${userData.firstName} ${userData.lastName}`.toLowerCase()
              const email = userData.email.toLowerCase()
              
              if (!fullName.includes(searchLower) && !email.includes(searchLower)) {
                return null
              }
            }

            // Calcular estadísticas del pedido
            const selections = orderData.selections || []
            const itemsCount = selections.length
            const hasColaciones = selections.some((s: { colacion?: unknown }) => s.colacion)
            const total = orderData.total || 0

            const order: AdminOrderView = {
              id: orderDoc.id,
              userId: orderData.userId,
              weekStart: orderData.weekStart,
              selections: selections,
              total: total,
              status: orderData.status,
              createdAt: orderData.createdAt?.toDate() || new Date(),
              paidAt: orderData.paidAt?.toDate(),
              paymentId: orderData.paymentId,
              user: {
                id: userData.id || orderData.userId,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                userType: userData.userType || 'estudiante'
              },
              dayName: format(orderData.createdAt?.toDate() || new Date(), 'EEEE', { locale: es }),
              formattedDate: format(orderData.createdAt?.toDate() || new Date(), 'dd/MM/yyyy HH:mm'),
              itemsCount: itemsCount,
              hasColaciones: hasColaciones
            }

            // Filtrar por día específico
            if (filters.day) {
              const hasSelectionForDay = order.selections.some(s => s.date === filters.day)
              if (!hasSelectionForDay) return null
            }

            return order
          } catch (error) {
            console.error('Error processing order:', orderDoc.id, error)
            return null
          }
        })

        const batchResults = await Promise.all(batchPromises)
        orders.push(...batchResults.filter(order => order !== null) as AdminOrderView[])
      }

      // Guardar en cache
      this.cache.set(cacheKey, {
        data: orders,
        timestamp: Date.now()
      })

      return orders
    } catch (error) {
      console.error('Error fetching admin orders:', error)
      throw new Error('No se pudieron cargar los pedidos')
    }
  }

  static async getOrderMetrics(filters: OrderFilters): Promise<OrderMetrics> {
    try {
      const orders = await this.getOrdersWithFilters(filters)
      
      const metrics: OrderMetrics = {
        totalOrders: orders.length,
        totalRevenue: 0,
        totalByDay: {},
        totalByUserType: { estudiante: 0, funcionario: 0 },
        averageOrderValue: 0,
        pendingOrders: 0,
        paidOrders: 0,
        cancelledOrders: 0,
        criticalPendingOrders: 0,
        totalByStatus: { pending: 0, paid: 0, cancelled: 0 },
        revenueByStatus: { pending: 0, paid: 0, cancelled: 0 }
      }

      // Calcular métricas
      orders.forEach(order => {
        // Revenue total
        metrics.totalRevenue += order.total

        // Contadores por estado
        if (order.status === 'pending') metrics.pendingOrders++
        if (order.status === 'paid') metrics.paidOrders++

        // Totales por tipo de usuario
        metrics.totalByUserType[order.user.userType] += order.total

        // Totales por día
        order.selections.forEach(selection => {
          try {
            const dayKey = format(parseISO(selection.date), 'EEEE', { locale: es })
            metrics.totalByDay[dayKey] = (metrics.totalByDay[dayKey] || 0) + 1
          } catch {
            console.error('Error parsing date:', selection.date)
          }
        })
      })

      // Valor promedio
      metrics.averageOrderValue = metrics.totalOrders > 0 
        ? metrics.totalRevenue / metrics.totalOrders 
        : 0

      return metrics
    } catch (error) {
      console.error('Error calculating metrics:', error)
      throw new Error('No se pudieron calcular las métricas')
    }
  }

  static async updateOrderStatus(request: OrderUpdateRequest): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', request.orderId)
      
      // Verificar que el pedido existe
      const orderDoc = await getDoc(orderRef)
      if (!orderDoc.exists()) {
        throw new Error('El pedido no existe')
      }

      const updateData: Record<string, Timestamp | string> = {
        updatedAt: Timestamp.now()
      }

      if (request.status) {
        updateData.status = request.status
        
        // Agregar timestamp específico según el estado
        if (request.status === 'paid') {
          updateData.paidAt = Timestamp.now()
        } else if (request.status === 'cancelled') {
          updateData.cancelledAt = Timestamp.now()
        }
      }

      if (request.notes) {
        updateData.adminNotes = request.notes
      }

      await updateDoc(orderRef, updateData)
      
      // Limpiar cache relacionado
      this.clearCache()
    } catch (error) {
      console.error('Error updating order:', error)
      throw new Error('No se pudo actualizar el pedido')
    }
  }

  static async deleteOrder(orderId: string): Promise<void> {
    try {
      // Verificar que el pedido existe
      const orderRef = doc(db, 'orders', orderId)
      const orderDoc = await getDoc(orderRef)
      
      if (!orderDoc.exists()) {
        throw new Error('El pedido no existe')
      }

      await deleteDoc(orderRef)
      
      // Limpiar cache
      this.clearCache()
    } catch (error) {
      console.error('Error deleting order:', error)
      throw new Error('No se pudo eliminar el pedido')
    }
  }

  static async getOrderDetail(orderId: string): Promise<OrderDetailView | null> {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId))
      if (!orderDoc.exists()) return null

      const orderData = orderDoc.data()
      const userDoc = await getDoc(doc(db, 'users', orderData.userId))
      
      if (!userDoc.exists()) return null
      const userData = userDoc.data()

      // Procesar selecciones con manejo de errores
      const processedSelections = (orderData.selections || []).map((s: { date: string; almuerzo?: { code: string; name: string; price: number }; colacion?: { code: string; name: string; price: number } }) => {
        try {
          return {
            date: s.date,
            dayName: format(parseISO(s.date), 'EEEE', { locale: es }),
            almuerzo: s.almuerzo ? {
              code: s.almuerzo.code,
              name: s.almuerzo.name,
              price: s.almuerzo.price
            } : undefined,
            colacion: s.colacion ? {
              code: s.colacion.code,
              name: s.colacion.name,
              price: s.colacion.price
            } : undefined
          }
        } catch (error) {
          console.error('Error processing selection:', s, error)
          return {
            date: s.date,
            dayName: 'Fecha inválida',
            almuerzo: s.almuerzo,
            colacion: s.colacion
          }
        }
      })

      // Construir historial de pagos
      const paymentHistory = [
        {
          date: orderData.createdAt?.toDate() || new Date(),
          status: 'created',
          amount: orderData.total || 0
        }
      ]

      if (orderData.paidAt) {
        paymentHistory.push({
          date: orderData.paidAt.toDate(),
          status: 'paid',
          amount: orderData.total || 0
        })
      }

      if (orderData.cancelledAt) {
        paymentHistory.push({
          date: orderData.cancelledAt.toDate(),
          status: 'cancelled',
          amount: 0
        })
      }

      const detail: OrderDetailView = {
        id: orderDoc.id,
        userId: orderData.userId,
        weekStart: orderData.weekStart,
        selections: processedSelections,
        total: orderData.total || 0,
        status: orderData.status,
        createdAt: orderData.createdAt?.toDate() || new Date(),
        paidAt: orderData.paidAt?.toDate(),
        paymentId: orderData.paymentId,
        user: {
          id: userData.id || orderData.userId,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          userType: userData.userType || 'estudiante'
        },
        dayName: format(orderData.createdAt?.toDate() || new Date(), 'EEEE', { locale: es }),
        formattedDate: format(orderData.createdAt?.toDate() || new Date(), 'dd/MM/yyyy HH:mm'),
        itemsCount: processedSelections.length,
        hasColaciones: processedSelections.some((s: { colacion?: unknown }) => s.colacion),
        paymentHistory: paymentHistory
      }

      return detail
    } catch (error) {
      console.error('Error fetching order detail:', error)
      throw new Error('No se pudo cargar el detalle del pedido')
    }
  }

  static generateWeekOptions(): Array<{ value: string; label: string; isCurrent: boolean }> {
    const options = []
    const today = new Date()
    
    // Generar opciones para las últimas 8 semanas y las próximas 4
    for (let i = -8; i <= 4; i++) {
      const weekDate = addDays(today, i * 7)
      const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 })
      
      const weekStartStr = format(weekStart, 'yyyy-MM-dd')
      const isCurrent = i === 0
      
      options.push({
        value: weekStartStr,
        label: `Semana del ${format(weekStart, 'd')} al ${format(weekEnd, 'd')} de ${format(weekEnd, 'MMMM', { locale: es })}`,
        isCurrent
      })
    }
    
    return options.reverse() // Mostrar más recientes primero
  }

  // Método para limpiar cache
  static clearCache(): void {
    this.cache.clear()
  }

  // Método para obtener estadísticas en tiempo real
  static subscribeToOrdersRealtime(
    filters: OrderFilters,
    callback: (orders: AdminOrderView[]) => void
  ): () => void {
    const ordersRef = collection(db, 'orders')
    let q = query(ordersRef, orderBy('createdAt', 'desc'))

    if (filters.weekStart) {
      q = query(q, where('weekStart', '==', filters.weekStart))
    }

    if (filters.status && filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status))
    }

    return onSnapshot(q, () => {
      // Procesar cambios en tiempo real
      this.clearCache() // Limpiar cache cuando hay cambios
      this.getOrdersWithFilters(filters).then(callback).catch(console.error)
    })
  }
}