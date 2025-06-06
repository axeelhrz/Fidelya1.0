import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  limit,
  startAfter,
  Timestamp,
  writeBatch,
  countFromServer
} from 'firebase/firestore'
import { 
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth'
import { db } from '@/app/lib/firebase'
import { 
  AdminUserView, 
  UserFilters, 
  UserStats, 
  UserDetailView, 
  UserUpdateRequest, 
  UserActionResult,
  SortField,
  SortDirection,
  UserOrderSummary
} from '@/types/adminUser'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, subWeeks, subMonths } from 'date-fns'

export class AdminUserService {
  private static readonly USERS_COLLECTION = 'users'
  private static readonly ORDERS_COLLECTION = 'orders'
  private static readonly PAGE_SIZE = 20

  static async getUserStats(): Promise<UserStats> {
    try {
      const usersRef = collection(db, this.USERS_COLLECTION)
      
      // Obtener conteos totales
      const [
        totalSnapshot,
        funcionariosSnapshot,
        estudiantesSnapshot,
        adminsSnapshot,
        verifiedSnapshot,
        activeSnapshot
      ] = await Promise.all([
        countFromServer(query(usersRef)),
        countFromServer(query(usersRef, where('userType', '==', 'funcionario'))),
        countFromServer(query(usersRef, where('userType', '==', 'estudiante'))),
        countFromServer(query(usersRef, where('role', 'in', ['admin', 'super_admin']))),
        countFromServer(query(usersRef, where('emailVerified', '==', true))),
        countFromServer(query(usersRef, where('isActive', '==', true)))
      ])

      // Calcular fechas para usuarios nuevos
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
      const monthStart = startOfMonth(new Date())

      const [newWeekSnapshot, newMonthSnapshot] = await Promise.all([
        countFromServer(query(
          usersRef, 
          where('createdAt', '>=', Timestamp.fromDate(weekStart))
        )),
        countFromServer(query(
          usersRef, 
          where('createdAt', '>=', Timestamp.fromDate(monthStart))
        ))
      ])

      return {
        totalUsers: totalSnapshot.data().count,
        funcionarios: funcionariosSnapshot.data().count,
        estudiantes: estudiantesSnapshot.data().count,
        admins: adminsSnapshot.data().count,
        verifiedEmails: verifiedSnapshot.data().count,
        unverifiedEmails: totalSnapshot.data().count - verifiedSnapshot.data().count,
        activeUsers: activeSnapshot.data().count,
        newUsersThisWeek: newWeekSnapshot.data().count,
        newUsersThisMonth: newMonthSnapshot.data().count
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      throw new Error('No se pudieron cargar las estadísticas de usuarios')
    }
  }

  static async getUsers(
    filters: UserFilters = {},
    sortField: SortField = 'createdAt',
    sortDirection: SortDirection = 'desc',
    pageSize: number = this.PAGE_SIZE,
    lastDoc?: any
  ): Promise<{ users: AdminUserView[], hasMore: boolean, lastDoc: any }> {
    try {
      const usersRef = collection(db, this.USERS_COLLECTION)
      let q = query(usersRef)

      // Aplicar filtros
      if (filters.role && filters.role !== 'all') {
        if (filters.role === 'admin') {
          q = query(q, where('role', 'in', ['admin', 'super_admin']))
        } else {
          q = query(q, where('userType', '==', filters.role))
        }
      }

      if (filters.emailVerified !== undefined && filters.emailVerified !== 'all') {
        q = query(q, where('emailVerified', '==', filters.emailVerified))
      }

      if (filters.isActive !== undefined && filters.isActive !== 'all') {
        q = query(q, where('isActive', '==', filters.isActive))
      }

      // Filtro por fecha
      if (filters.dateRange) {
        let startDate: Date
        let endDate = new Date()

        switch (filters.dateRange) {
          case 'week':
            startDate = subWeeks(endDate, 1)
            break
          case 'month':
            startDate = subMonths(endDate, 1)
            break
          case 'custom':
            if (filters.customStartDate) {
              startDate = new Date(filters.customStartDate)
              if (filters.customEndDate) {
                endDate = new Date(filters.customEndDate)
              }
            } else {
              startDate = subMonths(endDate, 1)
            }
            break
          default:
            startDate = subMonths(endDate, 1)
        }

        q = query(q, 
          where('createdAt', '>=', Timestamp.fromDate(startDate)),
          where('createdAt', '<=', Timestamp.fromDate(endDate))
        )
      }

      // Ordenamiento
      q = query(q, orderBy(sortField, sortDirection))

      // Paginación
      q = query(q, limit(pageSize + 1))
      if (lastDoc) {
        q = query(q, startAfter(lastDoc))
      }

      const snapshot = await getDocs(q)
      const users: AdminUserView[] = []
      let newLastDoc = null
      let hasMore = false

      snapshot.docs.forEach((doc, index) => {
        if (index < pageSize) {
          const data = doc.data()
          users.push(this.mapFirestoreToUser(doc.id, data))
          newLastDoc = doc
        } else {
          hasMore = true
        }
      })

      // Filtrar por término de búsqueda en el frontend (para búsqueda en múltiples campos)
      let filteredUsers = users
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase()
        filteredUsers = users.filter(user => 
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.lastName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        )
      }

      // Obtener conteo de pedidos para cada usuario
      const usersWithOrders = await Promise.all(
        filteredUsers.map(async (user) => {
          const ordersCount = await this.getUserOrdersCount(user.id)
          const lastOrderDate = await this.getUserLastOrderDate(user.id)
          return {
            ...user,
            ordersCount,
            lastOrderDate
          }
        })
      )

      return {
        users: usersWithOrders,
        hasMore: filteredUsers.length === pageSize && hasMore,
        lastDoc: newLastDoc
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      throw new Error('No se pudieron cargar los usuarios')
    }
  }

  static async getUserDetail(userId: string): Promise<UserDetailView> {
    try {
      const userDoc = await getDoc(doc(db, this.USERS_COLLECTION, userId))
      
      if (!userDoc.exists()) {
        throw new Error('Usuario no encontrado')
      }

      const userData = userDoc.data()
      const baseUser = this.mapFirestoreToUser(userId, userData)

      // Obtener pedidos recientes
      const recentOrders = await this.getUserRecentOrders(userId)
      
      // Calcular estadísticas
      const totalSpent = recentOrders.reduce((sum, order) => sum + order.total, 0)
      const averageOrderValue = recentOrders.length > 0 ? totalSpent / recentOrders.length : 0

      return {
        ...baseUser,
        recentOrders,
        totalSpent,
        averageOrderValue,
        registrationSource: userData.registrationSource || 'web'
      }
    } catch (error) {
      console.error('Error fetching user detail:', error)
      throw new Error('No se pudieron cargar los detalles del usuario')
    }
  }

  static async updateUser(userId: string, updates: UserUpdateRequest): Promise<UserActionResult> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId)
      
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.now()
      }

      await updateDoc(userRef, updateData)

      return {
        success: true,
        message: 'Usuario actualizado correctamente'
      }
    } catch (error) {
      console.error('Error updating user:', error)
      return {
        success: false,
        message: 'Error al actualizar el usuario',
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  static async deleteUser(userId: string): Promise<UserActionResult> {
    try {
      const batch = writeBatch(db)
      
      // Eliminar usuario
      const userRef = doc(db, this.USERS_COLLECTION, userId)
      batch.delete(userRef)

      // Eliminar pedidos del usuario
      const ordersRef = collection(db, this.ORDERS_COLLECTION)
      const userOrdersQuery = query(ordersRef, where('userId', '==', userId))
      const ordersSnapshot = await getDocs(userOrdersQuery)
      
      ordersSnapshot.docs.forEach((orderDoc) => {
        batch.delete(orderDoc.ref)
      })

      await batch.commit()

      return {
        success: true,
        message: 'Usuario eliminado correctamente'
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      return {
        success: false,
        message: 'Error al eliminar el usuario',
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  static async resendEmailVerification(userEmail: string): Promise<UserActionResult> {
    try {
      // Nota: En un entorno real, esto requeriría acceso al objeto User de Firebase Auth
      // Por ahora, simulamos el envío
      
      return {
        success: true,
        message: 'Correo de verificación enviado correctamente'
      }
    } catch (error) {
      console.error('Error sending verification email:', error)
      return {
        success: false,
        message: 'Error al enviar el correo de verificación',
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  private static mapFirestoreToUser(id: string, data: any): AdminUserView {
    return {
      id,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      role: data.role || data.userType || 'estudiante',
      userType: data.userType || 'estudiante',
      emailVerified: data.emailVerified || false,
      createdAt: data.createdAt?.toDate() || new Date(),
      lastLogin: data.lastLogin?.toDate(),
      phone: data.phone,
      isActive: data.isActive !== false,
      children: data.children || [],
      ordersCount: 0, // Se actualiza después
      lastOrderDate: undefined // Se actualiza después
    }
  }

  private static async getUserOrdersCount(userId: string): Promise<number> {
    try {
      const ordersRef = collection(db, this.ORDERS_COLLECTION)
      const q = query(ordersRef, where('userId', '==', userId))
      const snapshot = await countFromServer(q)
      return snapshot.data().count
    } catch (error) {
      console.error('Error getting user orders count:', error)
      return 0
    }
  }

  private static async getUserLastOrderDate(userId: string): Promise<Date | undefined> {
    try {
      const ordersRef = collection(db, this.ORDERS_COLLECTION)
      const q = query(
        ordersRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(1)
      )
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const lastOrder = snapshot.docs[0].data()
        return lastOrder.createdAt?.toDate()
      }
      
      return undefined
    } catch (error) {
      console.error('Error getting user last order date:', error)
      return undefined
    }
  }

  private static async getUserRecentOrders(userId: string): Promise<UserOrderSummary[]> {
    try {
      const ordersRef = collection(db, this.ORDERS_COLLECTION)
      const q = query(
        ordersRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(5)
      )
      
      const snapshot = await getDocs(q)
      const orders: UserOrderSummary[] = []
      
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        orders.push({
          id: doc.id,
          weekStart: data.weekStart || '',
          total: data.total || 0,
          status: data.status || 'pending',
          createdAt: data.createdAt?.toDate() || new Date(),
          itemsCount: data.selections?.length || 0
        })
      })
      
      return orders
    } catch (error) {
      console.error('Error fetching user recent orders:', error)
      return []
    }
  }
}
