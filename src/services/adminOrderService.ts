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
import { format, parseISO, startOfWeek, endOfWeek, addDays, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'

export class AdminOrderService {
  // Cache para mejorar rendimiento
  private static cache = new Map<string, { data: AdminOrderView[]; timestamp: number }>()
  private static CACHE_DURATION = 30 * 1000 // 30 segundos para datos más frescos

  private static getCacheKey(filters: OrderFilters): string {
    return JSON.stringify(filters)
  }

  private static isValidCache(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.CACHE_DURATION
  }

  // Función helper para convertir timestamps de Firebase de forma segura
  private static safeTimestampToDate(timestamp: Date | Timestamp | { seconds: number; nanoseconds?: number } | string | number | null | undefined): Date {
    if (!timestamp) return new Date()
    
    // Si ya es una fecha
    if (timestamp instanceof Date) return timestamp
    
    // Si es un Timestamp de Firebase
    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate()
    }
    
    // Si es un objeto con seconds y nanoseconds
    if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp && typeof timestamp.seconds === 'number') {
      return new Date(timestamp.seconds * 1000)
    }
    
    // Si es un string de fecha
    if (typeof timestamp === 'string') {
      return new Date(timestamp)
    }
    
    // Si es un número (timestamp en ms)
    if (typeof timestamp === 'number') {
      return new Date(timestamp)
    }
    
    console.warn('Unknown timestamp format:', timestamp)
    return new Date()
  }

  // Función helper para procesar selecciones y calcular resumen de items
  private static processOrderSelections(selections: any[]): {
    itemsCount: number
    hasColaciones: boolean
    itemsSummary: AdminOrderView['itemsSummary']
  } {
    let totalAlmuerzos = 0
    let totalColaciones = 0
    let almuerzosPrice = 0
    let colacionesPrice = 0
    const itemsDetail: AdminOrderView['itemsSummary']['itemsDetail'] = []

    selections.forEach((selection: any) => {
      try {
        const dayName = format(parseISO(selection.date), 'EEEE', { locale: es })
        
        const dayDetail: AdminOrderView['itemsSummary']['itemsDetail'][0] = {
          date: selection.date,
          dayName: dayName
        }

        if (selection.almuerzo) {
          totalAlmuerzos++
          const price = Number(selection.almuerzo.price) || 0
          almuerzosPrice += price
          dayDetail.almuerzo = {
            code: selection.almuerzo.code || '',
            name: selection.almuerzo.name || selection.almuerzo.nombre || '',
            price: price
          }
        }

        if (selection.colacion) {
          totalColaciones++
          const price = Number(selection.colacion.price) || 0
          colacionesPrice += price
          dayDetail.colacion = {
            code: selection.colacion.code || '',
            name: selection.colacion.name || selection.colacion.nombre || '',
            price: price
          }
        }

        itemsDetail.push(dayDetail)
      } catch (error) {
        console.error('Error processing selection:', selection, error)
      }
    })

    return {
      itemsCount: totalAlmuerzos + totalColaciones,
      hasColaciones: totalColaciones > 0,
      itemsSummary: {
        totalAlmuerzos,
        totalColaciones,
        almuerzosPrice,
        colacionesPrice,
        itemsDetail
      }
    }
  }

  static async getOrdersWithFilters(filters: OrderFilters): Promise<AdminOrderView[]> {
    try {
      const cacheKey = this.getCacheKey(filters)
      
      // Verificar cache
      if (this.isValidCache(cacheKey)) {
        console.log('Using cached data for filters:', filters)
        return this.cache.get(cacheKey)!.data
      }

      console.log('Fetching fresh data for filters:', filters)
      const ordersRef = collection(db, 'orders')
      
      // Construir query básico - siempre ordenar por fecha de creación
      let q = query(ordersRef, orderBy('createdAt', 'desc'))

      // Aplicar filtro de estado si no es 'all'
      if (filters.status && filters.status !== 'all') {
        q = query(ordersRef, where('status', '==', filters.status), orderBy('createdAt', 'desc'))
      }

      const ordersSnapshot = await getDocs(q)
      const orders: AdminOrderView[] = []

      console.log(`Processing ${ordersSnapshot.docs.length} orders from Firestore`)

      // Procesar pedidos en lotes para mejor rendimiento
      const batchSize = 15
      const orderDocs = ordersSnapshot.docs
      
      for (let i = 0; i < orderDocs.length; i += batchSize) {
        const batch = orderDocs.slice(i, i + batchSize)
        const batchPromises = batch.map(async (orderDoc) => {
          try {
            const orderData = orderDoc.data()
            
            // Aplicar filtro de semana del lado del cliente
            if (filters.weekStart && orderData.weekStart !== filters.weekStart) {
              return null
            }
            
            // Obtener datos del usuario
            const userDoc = await getDoc(doc(db, 'users', orderData.userId))
            if (!userDoc.exists()) {
              console.warn(`User not found for order ${orderDoc.id}: ${orderData.userId}`)
              return null
            }

            const userData = userDoc.data()

            // Normalizar userType
            const userType = userData.userType || userData.tipoUsuario || 'estudiante'

            // Aplicar filtros del lado del cliente
            if (filters.userType && filters.userType !== 'all' && userType !== filters.userType) {
              return null
            }

            if (filters.searchTerm) {
              const searchLower = filters.searchTerm.toLowerCase()
              const fullName = `${userData.firstName || userData.nombre || ''} ${userData.lastName || userData.apellido || ''}`.toLowerCase()
              const email = (userData.email || userData.correo || '').toLowerCase()
              
              if (!fullName.includes(searchLower) && !email.includes(searchLower)) {
                return null
              }
            }

            // Convertir timestamps de forma segura
            const createdAt = this.safeTimestampToDate(orderData.createdAt)
            const paidAt = orderData.paidAt ? this.safeTimestampToDate(orderData.paidAt) : undefined
            const cancelledAt = orderData.cancelledAt ? this.safeTimestampToDate(orderData.cancelledAt) : undefined

            // Procesar selecciones y calcular estadísticas
            const selections = orderData.selections || []
            const { itemsCount, hasColaciones, itemsSummary } = this.processOrderSelections(selections)
            const total = Number(orderData.total) || 0

            // Calcular días desde que está pendiente
            const daysSincePending = orderData.status === 'pending' 
              ? differenceInDays(new Date(), createdAt)
              : 0

            const order: AdminOrderView = {
              id: orderDoc.id,
              userId: orderData.userId,
              weekStart: orderData.weekStart,
              selections: selections,
              total: total,
              status: orderData.status || 'pending',
              createdAt: createdAt,
              paidAt: paidAt,
              cancelledAt: cancelledAt,
              daysSincePending: daysSincePending,
              paymentId: orderData.paymentId,
              user: {
                id: userData.id || orderData.userId,
                firstName: userData.firstName || userData.nombre || '',
                lastName: userData.lastName || userData.apellido || '',
                email: userData.email || userData.correo || '',
                userType: userType
              },
              dayName: format(createdAt, 'EEEE', { locale: es }),
              formattedDate: format(createdAt, 'dd/MM/yyyy HH:mm'),
              itemsCount: itemsCount,
              hasColaciones: hasColaciones,
              itemsSummary: itemsSummary
            }

            // Filtrar por día específico
            if (filters.day && filters.day !== 'none') {
              const hasSelectionForDay = order.selections.some(s => {
                try {
                  const selectionDate = parseISO(s.date)
                  const dayName = format(selectionDate, 'EEEE', { locale: es }).toLowerCase()
                  return dayName === filters.day?.toLowerCase()
                } catch {
                  return false
                }
              })
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

      console.log(`Processed ${orders.length} orders after filtering`)

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
      
      console.log(`Calculating metrics for ${orders.length} orders`)
      
      const metrics: OrderMetrics = {
        totalOrders: orders.length,
        totalRevenue: 0,
        totalByDay: {
          'lunes': 0,
          'martes': 0,
          'miércoles': 0,
          'jueves': 0,
          'viernes': 0
        },
        totalByUserType: { estudiante: 0, funcionario: 0 },
        averageOrderValue: 0,
        pendingOrders: 0,
        paidOrders: 0,
        cancelledOrders: 0,
        criticalPendingOrders: 0,
        totalByStatus: { pending: 0, paid: 0, cancelled: 0 },
        revenueByStatus: { pending: 0, paid: 0, cancelled: 0 },
        itemsMetrics: {
          totalAlmuerzos: 0,
          totalColaciones: 0,
          averageItemsPerOrder: 0,
          mostPopularItems: []
        },
        weeklyTrends: {
          ordersGrowth: 0,
          revenueGrowth: 0,
          conversionRate: 0
        }
      }

      // Mapas para tracking de items populares
      const itemsTracker = new Map<string, {
        code: string
        name: string
        type: 'almuerzo' | 'colacion'
        count: number
        revenue: number
      }>()

      // Calcular métricas
      orders.forEach(order => {
        const orderTotal = Number(order.total) || 0
        
        // Contadores por estado
        switch (order.status) {
          case 'pending':
            metrics.pendingOrders++
            metrics.totalByStatus.pending++
            metrics.revenueByStatus.pending += orderTotal
            
            // Pedidos críticos (más de 3 días pendientes)
            if ((order.daysSincePending || 0) > 3) {
              metrics.criticalPendingOrders++
            }
            break
            
          case 'paid':
            metrics.paidOrders++
            metrics.totalByStatus.paid++
            metrics.revenueByStatus.paid += orderTotal
            metrics.totalRevenue += orderTotal // Solo contar revenue de pedidos pagados
            
            // Totales por tipo de usuario (solo pedidos pagados)
            if (order.user.userType === 'estudiante') {
              metrics.totalByUserType.estudiante += orderTotal
            } else if (order.user.userType === 'funcionario') {
              metrics.totalByUserType.funcionario += orderTotal
            }
            break
            
          case 'cancelled':
            metrics.cancelledOrders++
            metrics.totalByStatus.cancelled++
            metrics.revenueByStatus.cancelled += orderTotal
            break
        }

        // Métricas de items
        metrics.itemsMetrics.totalAlmuerzos += order.itemsSummary.totalAlmuerzos
        metrics.itemsMetrics.totalColaciones += order.itemsSummary.totalColaciones

        // Tracking de items populares
        order.itemsSummary.itemsDetail.forEach(detail => {
          if (detail.almuerzo) {
            const key = `${detail.almuerzo.code}-almuerzo`
            const existing = itemsTracker.get(key) || {
              code: detail.almuerzo.code,
              name: detail.almuerzo.name,
              type: 'almuerzo' as const,
              count: 0,
              revenue: 0
            }
            existing.count++
            existing.revenue += detail.almuerzo.price
            itemsTracker.set(key, existing)
          }

          if (detail.colacion) {
            const key = `${detail.colacion.code}-colacion`
            const existing = itemsTracker.get(key) || {
              code: detail.colacion.code,
              name: detail.colacion.name,
              type: 'colacion' as const,
              count: 0,
              revenue: 0
            }
            existing.count++
            existing.revenue += detail.colacion.price
            itemsTracker.set(key, existing)
          }
        })

        // Totales por día (contar todos los pedidos)
        order.selections.forEach(selection => {
          try {
            const dayKey = format(parseISO(selection.date), 'EEEE', { locale: es }).toLowerCase()
            if (metrics.totalByDay[dayKey] !== undefined) {
              metrics.totalByDay[dayKey] = (metrics.totalByDay[dayKey] || 0) + 1
            }
          } catch (error) {
            console.error('Error parsing date:', selection.date, error)
          }
        })
      })

      // Calcular promedios y tendencias
      metrics.averageOrderValue = metrics.paidOrders > 0 
        ? Math.round(metrics.totalRevenue / metrics.paidOrders)
        : 0

      const totalItems = metrics.itemsMetrics.totalAlmuerzos + metrics.itemsMetrics.totalColaciones
      metrics.itemsMetrics.averageItemsPerOrder = orders.length > 0 
        ? Math.round((totalItems / orders.length) * 100) / 100
        : 0

      // Items más populares (top 10)
      metrics.itemsMetrics.mostPopularItems = Array.from(itemsTracker.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // Tasa de conversión
      metrics.weeklyTrends.conversionRate = metrics.totalOrders > 0 
        ? Math.round((metrics.paidOrders / metrics.totalOrders) * 100)
        : 0

      console.log('Calculated metrics:', {
        total: metrics.totalOrders,
        pending: metrics.pendingOrders,
        paid: metrics.paidOrders,
        cancelled: metrics.cancelledOrders,
        critical: metrics.criticalPendingOrders,
        revenue: metrics.totalRevenue,
        averageValue: metrics.averageOrderValue,
        totalItems: totalItems,
        conversionRate: metrics.weeklyTrends.conversionRate
      })

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

      const currentData = orderDoc.data()
      console.log(`Updating order ${request.orderId} from ${currentData.status} to ${request.status}`)

      const updateData: Record<string, string | Timestamp | null> = {
        status: request.status || 'pending',
        updatedAt: Timestamp.now()
      }

      // Manejar timestamps según el nuevo estado
      switch (request.status) {
        case 'paid':
          updateData.paidAt = Timestamp.now()
          // Limpiar cancelledAt si existía
          if (currentData.cancelledAt) {
            updateData.cancelledAt = null
          }
          break
          
        case 'cancelled':
          updateData.cancelledAt = Timestamp.now()
          // Limpiar paidAt si existía
          if (currentData.paidAt) {
            updateData.paidAt = null
          }
          break
          
        case 'pending':
          // Limpiar ambos timestamps si vuelve a pendiente
          if (currentData.paidAt) {
            updateData.paidAt = null
          }
          if (currentData.cancelledAt) {
            updateData.cancelledAt = null
          }
          break
      }

      if (request.notes) {
        updateData.adminNotes = request.notes
      }

      await updateDoc(orderRef, updateData)
      
      console.log(`Order ${request.orderId} updated successfully to ${request.status}`)
      
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
      
      console.log(`Order ${orderId} deleted successfully`)
      
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

      // Convertir timestamps de forma segura
      const createdAt = this.safeTimestampToDate(orderData.createdAt)
      const paidAt = orderData.paidAt ? this.safeTimestampToDate(orderData.paidAt) : undefined
      const cancelledAt = orderData.cancelledAt ? this.safeTimestampToDate(orderData.cancelledAt) : undefined

      // Procesar selecciones con manejo de errores
      const processedSelections = (orderData.selections || []).map((s: any) => {
        try {
          return {
            date: s.date,
            dayName: format(parseISO(s.date), 'EEEE', { locale: es }),
            almuerzo: s.almuerzo ? {
              code: s.almuerzo.code,
              name: s.almuerzo.name || s.almuerzo.nombre,
              price: s.almuerzo.price,
              description: s.almuerzo.description || s.almuerzo.descripcion
            } : undefined,
            colacion: s.colacion ? {
              code: s.colacion.code,
              name: s.colacion.name || s.colacion.nombre,
              price: s.colacion.price,
              description: s.colacion.description || s.colacion.descripcion
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

      // Calcular resumen financiero
      let subtotalAlmuerzos = 0
      let subtotalColaciones = 0
      let totalItems = 0

      processedSelections.forEach(selection => {
        if (selection.almuerzo) {
          subtotalAlmuerzos += selection.almuerzo.price
          totalItems++
        }
        if (selection.colacion) {
          subtotalColaciones += selection.colacion.price
          totalItems++
        }
      })

      const averageItemPrice = totalItems > 0 ? (subtotalAlmuerzos + subtotalColaciones) / totalItems : 0

      // Construir historial de pagos
      const paymentHistory = [
        {
          date: createdAt,
          status: 'created',
          amount: Number(orderData.total) || 0
        }
      ]

      if (paidAt) {
        paymentHistory.push({
          date: paidAt,
          status: 'paid',
          amount: Number(orderData.total) || 0
        })
      }

      if (cancelledAt) {
        paymentHistory.push({
          date: cancelledAt,
          status: 'cancelled',
          amount: 0
        })
      }

      // Procesar información del usuario
      const userType = userData.userType || userData.tipoUsuario || 'estudiante'
      const { itemsCount, hasColaciones, itemsSummary } = this.processOrderSelections(orderData.selections || [])

      const detail: OrderDetailView = {
        id: orderDoc.id,
        userId: orderData.userId,
        weekStart: orderData.weekStart,
        selections: processedSelections,
        total: Number(orderData.total) || 0,
        status: orderData.status,
        createdAt: createdAt,
        paidAt: paidAt,
        cancelledAt: cancelledAt,
        daysSincePending: orderData.status === 'pending' ? differenceInDays(new Date(), createdAt) : 0,
        paymentId: orderData.paymentId,
        user: {
          id: userData.id || orderData.userId,
          firstName: userData.firstName || userData.nombre || '',
          lastName: userData.lastName || userData.apellido || '',
          email: userData.email || userData.correo || '',
          userType: userType
        },
        dayName: format(createdAt, 'EEEE', { locale: es }),
        formattedDate: format(createdAt, 'dd/MM/yyyy HH:mm'),
        itemsCount: itemsCount,
        hasColaciones: hasColaciones,
        itemsSummary: itemsSummary,
        paymentHistory: paymentHistory,
        financialSummary: {
          subtotalAlmuerzos,
          subtotalColaciones,
          totalItems,
          averageItemPrice: Math.round(averageItemPrice)
        }
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
    console.log('Clearing cache')
    this.cache.clear()
  }

  // Método para obtener estadísticas en tiempo real
  static subscribeToOrdersRealtime(
    filters: OrderFilters,
    callback: (orders: AdminOrderView[]) => void
  ): () => void {
    const ordersRef = collection(db, 'orders')
    let q = query(ordersRef, orderBy('createdAt', 'desc'))

    // Solo aplicar filtros simples para evitar errores de índice
    if (filters.status && filters.status !== 'all') {
      q = query(ordersRef, where('status', '==', filters.status), orderBy('createdAt', 'desc'))
    }

    return onSnapshot(q, () => {
      // Procesar cambios en tiempo real
      this.clearCache() // Limpiar cache cuando hay cambios
      this.getOrdersWithFilters(filters).then(callback).catch(console.error)
    })
  }
}