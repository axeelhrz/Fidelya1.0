import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp,
  doc,
  getDoc,
  countFromServer
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { AdminStats, WeeklyOrderData, UserTypeStats, MenuPopularity } from '@/types/admin'
import { startOfWeek, endOfWeek, format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

export class AdminService {
  static async getWeeklyStats(weekStart: string): Promise<AdminStats> {
    try {
      const weekEnd = format(addDays(new Date(weekStart), 6), 'yyyy-MM-dd')
      
      // Consultar pedidos de la semana
      const ordersRef = collection(db, 'orders')
      const weekQuery = query(
        ordersRef,
        where('weekStart', '==', weekStart),
        orderBy('createdAt', 'desc')
      )
      
      const ordersSnapshot = await getDocs(weekQuery)
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Calcular estadísticas
      const totalOrdersWeek = orders.length
      const paidOrders = orders.filter(order => order.status === 'paid').length
      const pendingOrders = orders.filter(order => order.status === 'pending').length
      
      const totalRevenueWeek = orders
        .filter(order => order.status === 'paid')
        .reduce((sum, order) => sum + (order.total || 0), 0)

      // Obtener usuarios únicos con pedidos
      const usersWithOrders = [...new Set(orders.map(order => order.userId))]
      
      // Consultar tipos de usuario
      const userTypeStats = await this.getUserTypeStats(usersWithOrders)
      
      const averageOrderValue = totalRevenueWeek > 0 ? totalRevenueWeek / paidOrders : 0
      
      // Obtener items más populares
      const popularMenuItems = await this.getPopularMenuItems(orders)

      return {
        totalOrdersWeek,
        totalStudentsWithOrder: userTypeStats.estudiantes.withOrders,
        totalStaffWithOrder: userTypeStats.funcionarios.withOrders,
        totalRevenueWeek,
        pendingOrders,
        paidOrders,
        averageOrderValue,
        popularMenuItems
      }
    } catch (error) {
      console.error('Error fetching weekly stats:', error)
      throw new Error('No se pudieron cargar las estadísticas semanales')
    }
  }

  static async getWeeklyOrderData(weekStart: string): Promise<WeeklyOrderData[]> {
    try {
      const weekData: WeeklyOrderData[] = []
      const dayNames = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes']
      
      for (let i = 0; i < 5; i++) {
        const currentDay = addDays(new Date(weekStart), i)
        const dateStr = format(currentDay, 'yyyy-MM-dd')
        
        // Consultar pedidos del día
        const ordersRef = collection(db, 'orders')
        const dayQuery = query(
          ordersRef,
          where('weekStart', '==', weekStart),
          where('status', '==', 'paid')
        )
        
        const snapshot = await getDocs(dayQuery)
        const dayOrders = snapshot.docs.map(doc => doc.data())
        
        // Filtrar pedidos que incluyan este día específico
        const dayOrderCount = dayOrders.filter(order => 
          order.selections?.some((selection: any) => selection.date === dateStr)
        ).length
        
        const dayRevenue = dayOrders
          .filter(order => 
            order.selections?.some((selection: any) => selection.date === dateStr)
          )
          .reduce((sum, order) => {
            const daySelections = order.selections?.filter((s: any) => s.date === dateStr) || []
            return sum + daySelections.reduce((daySum: number, selection: any) => {
              const almuerzoPrice = selection.almuerzo?.price || 0
              const colacionPrice = selection.colacion?.price || 0
              return daySum + almuerzoPrice + colacionPrice
            }, 0)
          }, 0)

        weekData.push({
          date: dateStr,
          day: dayNames[i],
          orderCount: dayOrderCount,
          revenue: dayRevenue
        })
      }
      
      return weekData
    } catch (error) {
      console.error('Error fetching weekly order data:', error)
      return []
    }
  }

  static async getUserTypeStats(userIds: string[]): Promise<UserTypeStats> {
    try {
      const stats: UserTypeStats = {
        estudiantes: { total: 0, withOrders: 0, revenue: 0 },
        funcionarios: { total: 0, withOrders: 0, revenue: 0 }
      }

      // Obtener totales de usuarios por tipo
      const usersRef = collection(db, 'users')
      const estudiantesQuery = query(usersRef, where('userType', '==', 'estudiante'))
      const funcionariosQuery = query(usersRef, where('userType', '==', 'funcionario'))
      
      const [estudiantesSnapshot, funcionariosSnapshot] = await Promise.all([
        countFromServer(estudiantesQuery),
        countFromServer(funcionariosQuery)
      ])
      
      stats.estudiantes.total = estudiantesSnapshot.data().count
      stats.funcionarios.total = funcionariosSnapshot.data().count

      // Calcular usuarios con pedidos
      for (const userId of userIds) {
        const userDoc = await getDoc(doc(db, 'users', userId))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          if (userData.userType === 'estudiante') {
            stats.estudiantes.withOrders++
          } else if (userData.userType === 'funcionario') {
            stats.funcionarios.withOrders++
          }
        }
      }

      return stats
    } catch (error) {
      console.error('Error fetching user type stats:', error)
      return {
        estudiantes: { total: 0, withOrders: 0, revenue: 0 },
        funcionarios: { total: 0, withOrders: 0, revenue: 0 }
      }
    }
  }

  static async getPopularMenuItems(orders: any[]): Promise<MenuPopularity[]> {
    try {
      const itemCounts: { [key: string]: { name: string; count: number } } = {}
      
      orders.forEach(order => {
        if (order.selections) {
          order.selections.forEach((selection: any) => {
            if (selection.almuerzo) {
              const key = selection.almuerzo.code
              if (!itemCounts[key]) {
                itemCounts[key] = { name: selection.almuerzo.name, count: 0 }
              }
              itemCounts[key].count++
            }
            if (selection.colacion) {
              const key = selection.colacion.code
              if (!itemCounts[key]) {
                itemCounts[key] = { name: selection.colacion.name, count: 0 }
              }
              itemCounts[key].count++
            }
          })
        }
      })

      const totalSelections = Object.values(itemCounts).reduce((sum, item) => sum + item.count, 0)
      
      return Object.entries(itemCounts)
        .map(([code, data]) => ({
          itemCode: code,
          itemName: data.name,
          orderCount: data.count,
          percentage: totalSelections > 0 ? (data.count / totalSelections) * 100 : 0
        }))
        .sort((a, b) => b.orderCount - a.orderCount)
        .slice(0, 5)
    } catch (error) {
      console.error('Error calculating popular menu items:', error)
      return []
    }
  }

  static async checkMenuStatus(weekStart: string): Promise<boolean> {
    try {
      const menusRef = collection(db, 'menus')
      const menuQuery = query(
        menusRef,
        where('weekStart', '==', weekStart),
        limit(1)
      )
      
      const snapshot = await getDocs(menuQuery)
      return !snapshot.empty
    } catch (error) {
      console.error('Error checking menu status:', error)
      return false
    }
  }

  static getCurrentWeekInfo() {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
    
    // Deadline: miércoles a las 13:00
    const wednesday = addDays(weekStart, 2)
    const orderDeadline = new Date(wednesday)
    orderDeadline.setHours(13, 0, 0, 0)
    
    return {
      start: format(weekStart, 'yyyy-MM-dd'),
      end: format(weekEnd, 'yyyy-MM-dd'),
      orderDeadline
    }
  }
}
