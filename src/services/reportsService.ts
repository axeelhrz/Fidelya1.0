import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { 
  ReportsFilters, 
  ReportsStats, 
  ChartDataPoint, 
  MenuDistribution, 
  UserTypeData, 
  DailyMetrics,
  ReportsData 
} from '@/types/reports'
import { format, parseISO, eachDayOfInterval, startOfDay, endOfDay } from 'date-fns'
import { es } from 'date-fns/locale'

export class ReportsService {
  static async getReportsData(filters: ReportsFilters): Promise<ReportsData> {
    try {
      const [orders, users] = await Promise.all([
        this.getFilteredOrders(filters),
        this.getUsers()
      ])

      const stats = this.calculateStats(orders, users, filters)
      const dailyData = this.generateDailyData(orders, filters)
      const revenueData = this.generateRevenueData(orders, filters)
      const menuDistribution = this.calculateMenuDistribution(orders)
      const userTypeData = this.calculateUserTypeData(orders, users)
      const dailyMetrics = this.calculateDailyMetrics(orders, filters)
      const topMenuItems = this.getTopMenuItems(orders)

      return {
        stats,
        dailyData,
        revenueData,
        menuDistribution,
        userTypeData,
        dailyMetrics,
        topMenuItems,
        isLoading: false,
        lastUpdated: new Date()
      }
    } catch (error) {
      console.error('Error fetching reports data:', error)
      throw new Error('No se pudieron cargar los datos de reportes')
    }
  }

  private static async getFilteredOrders(filters: ReportsFilters): Promise<any[]> {
    try {
      const ordersRef = collection(db, 'orders')
      let q = query(ordersRef, orderBy('createdAt', 'desc'))

      // Filtrar por estado si no es 'all'
      if (filters.orderStatus !== 'all') {
        q = query(q, where('status', '==', filters.orderStatus))
      }

      const ordersSnapshot = await getDocs(q)
      const orders = []

      for (const orderDoc of ordersSnapshot.docs) {
        const orderData = orderDoc.data()
        const orderDate = orderData.createdAt?.toDate()

        // Filtrar por rango de fechas
        if (orderDate) {
          const orderDateStr = format(orderDate, 'yyyy-MM-dd')
          if (orderDateStr >= filters.dateRange.start && orderDateStr <= filters.dateRange.end) {
            // Obtener datos del usuario para filtrar por tipo
            if (filters.userType !== 'all') {
              const userDoc = await getDoc(doc(db, 'users', orderData.userId))
              if (userDoc.exists()) {
                const userData = userDoc.data()
                if (userData.userType === filters.userType) {
                  orders.push({
                    id: orderDoc.id,
                    ...orderData,
                    user: userData
                  })
                }
              }
            } else {
              const userDoc = await getDoc(doc(db, 'users', orderData.userId))
              const userData = userDoc.exists() ? userDoc.data() : {}
              orders.push({
                id: orderDoc.id,
                ...orderData,
                user: userData
              })
            }
          }
        }
      }

      return orders
    } catch (error) {
      console.error('Error fetching filtered orders:', error)
      return []
    }
  }

  private static async getUsers(): Promise<any[]> {
    try {
      const usersRef = collection(db, 'users')
      const usersSnapshot = await getDocs(usersRef)
      return usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  private static calculateStats(orders: any[], users: any[], filters: ReportsFilters): ReportsStats {
    const totalOrders = orders.length
    const totalRevenue = orders
      .filter(order => order.status === 'paid')
      .reduce((sum, order) => sum + (order.total || 0), 0)
    
    const uniqueUserIds = [...new Set(orders.map(order => order.userId))]
    const totalUsers = uniqueUserIds.length

    // Calcular total de items de menú seleccionados
    const totalMenuItems = orders.reduce((sum, order) => {
      return sum + (order.selections?.length || 0)
    }, 0)

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calcular crecimiento (simulado - en producción compararía con período anterior)
    const growthPercentage = Math.random() * 20 - 10 // -10% a +10%

    // Tasa de conversión (pedidos pagados vs total)
    const conversionRate = totalOrders > 0 ? (orders.filter(o => o.status === 'paid').length / totalOrders) * 100 : 0

    return {
      totalOrders,
      totalRevenue,
      totalUsers,
      totalMenuItems,
      growthPercentage,
      averageOrderValue,
      conversionRate
    }
  }

  private static generateDailyData(orders: any[], filters: ReportsFilters): ChartDataPoint[] {
    const startDate = parseISO(filters.dateRange.start)
    const endDate = parseISO(filters.dateRange.end)
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayOrders = orders.filter(order => {
        const orderDate = order.createdAt?.toDate()
        return orderDate && format(orderDate, 'yyyy-MM-dd') === dayStr
      })

      const dayRevenue = dayOrders
        .filter(order => order.status === 'paid')
        .reduce((sum, order) => sum + (order.total || 0), 0)

      const uniqueUsers = [...new Set(dayOrders.map(order => order.userId))].length

      return {
        date: dayStr,
        day: format(day, 'dd/MM'),
        orders: dayOrders.length,
        revenue: dayRevenue,
        users: uniqueUsers
      }
    })
  }

  private static generateRevenueData(orders: any[], filters: ReportsFilters): ChartDataPoint[] {
    return this.generateDailyData(orders, filters)
  }

  private static calculateMenuDistribution(orders: any[]): MenuDistribution[] {
    const menuCounts: { [key: string]: { name: string; count: number; revenue: number } } = {}
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16']

    orders.forEach(order => {
      if (order.selections) {
        order.selections.forEach((selection: any) => {
          if (selection.almuerzo) {
            const key = selection.almuerzo.code
            if (!menuCounts[key]) {
              menuCounts[key] = { 
                name: selection.almuerzo.name, 
                count: 0, 
                revenue: 0 
              }
            }
            menuCounts[key].count++
            menuCounts[key].revenue += selection.almuerzo.price || 0
          }
          if (selection.colacion) {
            const key = selection.colacion.code
            if (!menuCounts[key]) {
              menuCounts[key] = { 
                name: selection.colacion.name, 
                count: 0, 
                revenue: 0 
              }
            }
            menuCounts[key].count++
            menuCounts[key].revenue += selection.colacion.price || 0
          }
        })
      }
    })

    const totalCount = Object.values(menuCounts).reduce((sum, item) => sum + item.count, 0)

    return Object.entries(menuCounts)
      .map(([code, data], index) => ({
        name: data.name,
        code,
        count: data.count,
        percentage: totalCount > 0 ? (data.count / totalCount) * 100 : 0,
        revenue: data.revenue,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }

  private static calculateUserTypeData(orders: any[], users: any[]): UserTypeData[] {
    const userTypeStats = {
      estudiante: { orders: 0, revenue: 0, users: new Set() },
      funcionario: { orders: 0, revenue: 0, users: new Set() }
    }

    orders.forEach(order => {
      const userType = order.user?.userType || 'estudiante'
      if (userTypeStats[userType as keyof typeof userTypeStats]) {
        userTypeStats[userType as keyof typeof userTypeStats].orders++
        if (order.status === 'paid') {
          userTypeStats[userType as keyof typeof userTypeStats].revenue += order.total || 0
        }
        userTypeStats[userType as keyof typeof userTypeStats].users.add(order.userId)
      }
    })

    const totalOrders = orders.length

    return Object.entries(userTypeStats).map(([type, data]) => ({
      type: type === 'estudiante' ? 'Estudiantes' : 'Funcionarios',
      orders: data.orders,
      revenue: data.revenue,
      users: data.users.size,
      percentage: totalOrders > 0 ? (data.orders / totalOrders) * 100 : 0
    }))
  }

  private static calculateDailyMetrics(orders: any[], filters: ReportsFilters): DailyMetrics[] {
    const startDate = parseISO(filters.dateRange.start)
    const endDate = parseISO(filters.dateRange.end)
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayOrders = orders.filter(order => {
        const orderDate = order.createdAt?.toDate()
        return orderDate && format(orderDate, 'yyyy-MM-dd') === dayStr
      })

      const totalRevenue = dayOrders
        .filter(order => order.status === 'paid')
        .reduce((sum, order) => sum + (order.total || 0), 0)

      const uniqueUsers = [...new Set(dayOrders.map(order => order.userId))].length

      let almuerzoOrders = 0
      let colacionOrders = 0

      dayOrders.forEach(order => {
        if (order.selections) {
          order.selections.forEach((selection: any) => {
            if (selection.almuerzo) almuerzoOrders++
            if (selection.colacion) colacionOrders++
          })
        }
      })

      return {
        date: dayStr,
        dayName: format(day, 'EEEE', { locale: es }),
        totalOrders: dayOrders.length,
        totalRevenue,
        uniqueUsers,
        almuerzoOrders,
        colacionOrders,
        averageOrderValue: dayOrders.length > 0 ? totalRevenue / dayOrders.length : 0
      }
    })
  }

  private static getTopMenuItems(orders: any[]): MenuDistribution[] {
    return this.calculateMenuDistribution(orders).slice(0, 5)
  }

  static getDefaultFilters(): ReportsFilters {
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    return {
      dateRange: {
        start: format(thirtyDaysAgo, 'yyyy-MM-dd'),
        end: format(today, 'yyyy-MM-dd')
      },
      userType: 'all',
      orderStatus: 'all',
      menuType: 'all'
    }
  }
}
