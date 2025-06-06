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
  getDoc
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { AdminOrderView, OrderFilters, OrderMetrics, OrderUpdateRequest, OrderDetailView } from '@/types/adminOrder'
import { format, parseISO, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

export class AdminOrderService {
  static async getOrdersWithFilters(filters: OrderFilters): Promise<AdminOrderView[]> {
    try {
      const ordersRef = collection(db, 'orders')
      let q = query(ordersRef, orderBy('createdAt', 'desc'))

      // Aplicar filtros
      if (filters.weekStart) {
        q = query(q, where('weekStart', '==', filters.weekStart))
      }

      if (filters.status && filters.status !== 'all') {
        q = query(q, where('status', '==', filters.status))
      }

      const ordersSnapshot = await getDocs(q)
      const orders: AdminOrderView[] = []

      for (const orderDoc of ordersSnapshot.docs) {
        const orderData = orderDoc.data()
        
        // Obtener datos del usuario
        const userDoc = await getDoc(doc(db, 'users', orderData.userId))
        if (!userDoc.exists()) continue

        const userData = userDoc.data()

        // Filtrar por tipo de usuario
        if (filters.userType && filters.userType !== 'all' && userData.userType !== filters.userType) {
          continue
        }

        // Filtrar por término de búsqueda
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase()
          const fullName = `${userData.firstName} ${userData.lastName}`.toLowerCase()
          const email = userData.email.toLowerCase()
          
          if (!fullName.includes(searchLower) && !email.includes(searchLower)) {
            continue
          }
        }

        const order: AdminOrderView = {
          id: orderDoc.id,
          userId: orderData.userId,
          weekStart: orderData.weekStart,
          selections: orderData.selections || [],
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
          itemsCount: (orderData.selections || []).length,
          hasColaciones: (orderData.selections || []).some((s: any) => s.colacion)
        }

        // Filtrar por día específico
        if (filters.day) {
          const hasSelectionForDay = order.selections.some(s => s.date === filters.day)
          if (!hasSelectionForDay) continue
        }

        orders.push(order)
      }

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
        totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
        totalByDay: {},
        totalByUserType: { estudiante: 0, funcionario: 0 },
        averageOrderValue: 0,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        paidOrders: orders.filter(o => o.status === 'paid').length
      }

      // Calcular totales por día
      orders.forEach(order => {
        order.selections.forEach(selection => {
          const dayKey = format(parseISO(selection.date), 'EEEE', { locale: es })
          metrics.totalByDay[dayKey] = (metrics.totalByDay[dayKey] || 0) + 1
        })
        
        // Totales por tipo de usuario
        metrics.totalByUserType[order.user.userType] += order.total
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
      const updateData: any = {
        updatedAt: Timestamp.now()
      }

      if (request.status) {
        updateData.status = request.status
        
        if (request.status === 'paid') {
          updateData.paidAt = Timestamp.now()
        }
      }

      if (request.notes) {
        updateData.adminNotes = request.notes
      }

      await updateDoc(orderRef, updateData)
    } catch (error) {
      console.error('Error updating order:', error)
      throw new Error('No se pudo actualizar el pedido')
    }
  }

  static async deleteOrder(orderId: string): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', orderId)
      await deleteDoc(orderRef)
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

      const detail: OrderDetailView = {
        id: orderDoc.id,
        userId: orderData.userId,
        weekStart: orderData.weekStart,
        selections: (orderData.selections || []).map((s: any) => ({
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
        })),
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
        itemsCount: (orderData.selections || []).length,
        hasColaciones: (orderData.selections || []).some((s: any) => s.colacion),
        paymentHistory: [
          {
            date: orderData.createdAt?.toDate() || new Date(),
            status: 'created',
            amount: orderData.total || 0
          },
          ...(orderData.paidAt ? [{
            date: orderData.paidAt.toDate(),
            status: 'paid',
            amount: orderData.total || 0,
            method: 'online'
          }] : [])
        ]
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
    
    // Generar opciones para las últimas 4 semanas y las próximas 2
    for (let i = -4; i <= 2; i++) {
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
    
    return options
  }
}
