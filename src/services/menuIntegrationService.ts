import { MenuService } from './menuService'
import { AdminMenuService } from './adminMenuService'
import { OrderService } from './orderService'
import { PaymentService } from './paymentService'
import { DayMenuDisplay } from '@/types/menu'
import { AdminWeekMenu } from '@/types/adminMenu'
import { User } from '@/types/panel'

export class MenuIntegrationService {
  // Obtener menú para visualización pública (solo publicados)
  static async getPublicWeeklyMenu(userType: 'apoderado' | 'funcionario', weekStart?: string): Promise<DayMenuDisplay[]> {
    try {
      const user = { tipoUsuario: userType } as User
      return await MenuService.getWeeklyMenuForUser(user, weekStart)
    } catch (error) {
      console.error('Error getting public weekly menu:', error)
      throw new Error('No se pudo cargar el menú público')
    }
  }

  // Obtener menú para administración (todos los menús)
  static async getAdminWeeklyMenu(weekStart?: string): Promise<AdminWeekMenu | null> {
    try {
      const actualWeekStart = weekStart || AdminMenuService.getCurrentWeekStart()
      return await AdminMenuService.getWeeklyMenu(actualWeekStart)
    } catch (error) {
      console.error('Error getting admin weekly menu:', error)
      throw new Error('No se pudo cargar el menú de administración')
    }
  }

  // Verificar disponibilidad de menús para una semana
  static async checkMenuAvailability(weekStart: string): Promise<{
    hasMenus: boolean
    isPublished: boolean
    totalItems: number
    weekLabel: string
  }> {
    try {
      const adminMenu = await AdminMenuService.getWeeklyMenu(weekStart)
      
      if (!adminMenu) {
        return {
          hasMenus: false,
          isPublished: false,
          totalItems: 0,
          weekLabel: MenuService.getWeekDisplayText(weekStart, weekStart)
        }
      }

      return {
        hasMenus: adminMenu.totalItems > 0,
        isPublished: adminMenu.isPublished,
        totalItems: adminMenu.totalItems,
        weekLabel: adminMenu.weekLabel
      }
    } catch (error) {
      console.error('Error checking menu availability:', error)
      return {
        hasMenus: false,
        isPublished: false,
        totalItems: 0,
        weekLabel: 'Error'
      }
    }
  }

  // Procesar pedido completo (validación + guardado + pago)
  static async processCompleteOrder(
    user: User,
    selections: any[],
    weekStart: string
  ): Promise<{
    success: boolean
    orderId?: string
    paymentUrl?: string
    error?: string
  }> {
    try {
      // 1. Validar que hay menús disponibles
      const availability = await this.checkMenuAvailability(weekStart)
      if (!availability.hasMenus || !availability.isPublished) {
        return {
          success: false,
          error: 'No hay menús disponibles para esta semana'
        }
      }

      // 2. Validar pedido
      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(weekStart)
        date.setDate(date.getDate() + i)
        return date.toISOString().split('T')[0]
      })

      const validation = OrderService.validateOrderByChild(
        selections,
        weekDays,
        true, // Siempre permitir pedidos
        user
      )

      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        }
      }

      // 3. Calcular total
      const total = OrderService.calculateOrderTotal(selections, user.tipoUsuario)

      // 4. Guardar pedido
      const orderData = {
        userId: user.id,
        tipoUsuario: user.tipoUsuario,
        weekStart,
        resumenPedido: selections,
        total,
        status: 'pendiente' as const
      }

      const orderId = await OrderService.saveOrder(orderData)

      // 5. Crear pago
      const paymentRequest = {
        amount: total,
        orderId,
        description: `Pedido Casino Escolar - ${availability.weekLabel}`,
        customerEmail: user.email || user.correo || '',
        customerName: user.name || user.nombre || `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }

      const paymentResponse = await PaymentService.createPayment(paymentRequest)

      if (paymentResponse.success) {
        // Actualizar pedido con ID de pago
        await OrderService.updateOrder(orderId, {
          paymentId: paymentResponse.paymentId,
          status: 'procesando_pago'
        })

        return {
          success: true,
          orderId,
          paymentUrl: paymentResponse.redirectUrl
        }
      } else {
        return {
          success: false,
          error: paymentResponse.error || 'Error al procesar el pago'
        }
      }

    } catch (error) {
      console.error('Error processing complete order:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      }
    }
  }

  // Obtener estadísticas de pedidos para una semana
  static async getWeekOrderStats(weekStart: string): Promise<{
    totalOrders: number
    paidOrders: number
    pendingOrders: number
    totalRevenue: number
    ordersByUserType: {
      apoderado: number
      funcionario: number
    }
  }> {
    try {
      const orders = await OrderService.getAllOrdersForWeek(weekStart)
      
      const stats = {
        totalOrders: orders.length,
        paidOrders: orders.filter(o => o.status === 'pagado').length,
        pendingOrders: orders.filter(o => o.status === 'pendiente' || o.status === 'procesando_pago').length,
        totalRevenue: orders.filter(o => o.status === 'pagado').reduce((sum, o) => sum + o.total, 0),
        ordersByUserType: {
          apoderado: orders.filter(o => o.tipoUsuario === 'apoderado').length,
          funcionario: orders.filter(o => o.tipoUsuario === 'funcionario').length
        }
      }

      return stats
    } catch (error) {
      console.error('Error getting week order stats:', error)
      return {
        totalOrders: 0,
        paidOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        ordersByUserType: {
          apoderado: 0,
          funcionario: 0
        }
      }
    }
  }

  // Sincronizar datos entre admin y público
  static async syncMenuData(weekStart: string): Promise<{
    success: boolean
    message: string
  }> {
    try {
      // Verificar que el menú de admin existe
      const adminMenu = await AdminMenuService.getWeeklyMenu(weekStart)
      if (!adminMenu || adminMenu.totalItems === 0) {
        return {
          success: false,
          message: 'No hay menús en administración para sincronizar'
        }
      }

      // Publicar menús si no están publicados
      if (!adminMenu.isPublished) {
        const result = await AdminMenuService.toggleWeekMenuPublication(weekStart, true)
        if (!result.success) {
          return {
            success: false,
            message: `Error al publicar menús: ${result.message}`
          }
        }
      }

      return {
        success: true,
        message: `Menús sincronizados correctamente. ${adminMenu.totalItems} items disponibles.`
      }
    } catch (error) {
      console.error('Error syncing menu data:', error)
      return {
        success: false,
        message: 'Error al sincronizar los datos del menú'
      }
    }
  }
}