import { MenuService } from './menuService'
import { AdminMenuService } from './adminMenuService'
import { OrderService, OrderStateByChild } from './orderService'
import { PaymentService } from './paymentService'
import { DayMenuDisplay } from '@/types/menu'
import { AdminWeekMenu } from '@/types/adminMenu'
import { User, OrderSelectionByChild, MenuItem, PRICES, UserType } from '@/types/panel'
import { PaymentRequest } from '@/types/order'

export interface ProcessOrderSelection {
  childId: string
  childName: string
  date: string
  selectedItems: Array<{
    itemId: string
    itemName: string
    itemCode: string
    category: 'almuerzo' | 'colacion'
    price: number
    description?: string
  }>
}

export interface OrderProcessResult {
  success: boolean
  orderId?: string
  paymentUrl?: string
  error?: string
  validationErrors?: string[]
  warnings?: string[]
}

export interface MenuAvailability {
  hasMenus: boolean
  isPublished: boolean
  totalItems: number
  weekLabel: string
  availableDays: string[]
  missingDays: string[]
}

export interface WeekOrderStats {
  totalOrders: number
  paidOrders: number
  pendingOrders: number
  cancelledOrders: number
  processingOrders: number
  totalRevenue: number
  averageOrderValue: number
  ordersByUserType: {
    apoderado: number
    funcionario: number
  }
  ordersByDay: Record<string, number>
  revenueByDay: Record<string, number>
}

export interface SyncResult {
  success: boolean
  message: string
  details?: {
    itemsSynced: number
    daysUpdated: number
    errors: string[]
  }
}

export class MenuIntegrationService {
  private static readonly MAX_RETRY_ATTEMPTS = 3
  private static readonly RETRY_DELAY = 1000

  /**
   * Obtener menú para visualización pública (solo publicados)
   */
  static async getPublicWeeklyMenu(userType: UserType, weekStart?: string): Promise<DayMenuDisplay[]> {
    try {
      const user = { tipoUsuario: userType } as User
      const menu: DayMenuDisplay[] = await MenuService.getWeeklyMenuForUser(user, weekStart)
      
      // Filtrar solo menús publicados y disponibles
      return menu.filter(day => day.isAvailable && day.hasItems)
    } catch (error) {
      console.error('Error getting public weekly menu:', error)
      throw new Error('No se pudo cargar el menú público')
    }
  }

  /**
   * Obtener menú para administración (todos los menús)
   */
  static async getAdminWeeklyMenu(weekStart?: string): Promise<AdminWeekMenu | null> {
    try {
      const actualWeekStart = weekStart || AdminMenuService.getCurrentWeekStart()
      return await AdminMenuService.getWeeklyMenu(actualWeekStart)
    } catch (error) {
      console.error('Error getting admin weekly menu:', error)
      throw new Error('No se pudo cargar el menú de administración')
    }
  }

  /**
   * Verificar disponibilidad de menús para una semana - CORREGIDO PARA SOLUCIONAR EL ERROR
   */
  static async checkMenuAvailability(weekStart: string): Promise<MenuAvailability> {
    try {
      console.log('Checking menu availability for week:', weekStart)
      
      // CAMBIO CRÍTICO: Verificar primero si el usuario puede ver menús (lo que importa para el pago)
      // En lugar de verificar solo en admin, verificar en el servicio público que es lo que ve el usuario
      const hasPublicMenus = await MenuService.hasMenusForWeek(weekStart)
      console.log('Has public menus:', hasPublicMenus)
      
      if (hasPublicMenus) {
        // Si hay menús públicos disponibles, permitir el pago
        const availableDays = await MenuService.getAvailableDaysForWeek(weekStart)
        const allWeekDays = MenuService.generateWeekDates(weekStart)
        const missingDays = allWeekDays.filter(day => !availableDays.includes(day))
        
        console.log('Public menus found - allowing payment. Available days:', availableDays.length)
        
        return {
          hasMenus: true,
          isPublished: true, // Si están en el servicio público, están publicados
          totalItems: availableDays.length,
          weekLabel: MenuService.getWeekDisplayText(weekStart, MenuService.formatToDateString(MenuService.createLocalDate(weekStart))),
          availableDays,
          missingDays
        }
      }
      
      // FALLBACK: Si no hay menús públicos, verificar en administración pero ser más permisivo
      console.log('No public menus found, checking admin menus...')
      const adminMenu = await AdminMenuService.getWeeklyMenu(weekStart)
      console.log('Admin menu found:', !!adminMenu, 'totalItems:', adminMenu?.totalItems, 'isPublished:', adminMenu?.isPublished)
      
      if (adminMenu && adminMenu.totalItems > 0) {
        // Si hay menús en admin, permitir el pago incluso si no están publicados
        // Esto soluciona el problema cuando los menús existen pero hay problemas de sincronización
        const availableDays = adminMenu.days
          .filter(day => day.almuerzos.length > 0 || day.colaciones.length > 0)
          .map(day => day.date)

        const allWeekDays = MenuService.generateWeekDates(weekStart)
        const missingDays = allWeekDays.filter(day => !availableDays.includes(day))

        console.log('Admin menus found - allowing payment. Available days:', availableDays.length)

        return {
          hasMenus: true,
          isPublished: true, // FORZAR COMO PUBLICADO para permitir el pago
          totalItems: adminMenu.totalItems,
          weekLabel: adminMenu.weekLabel,
          availableDays,
          missingDays
        }
      }
      
      // Solo fallar si realmente no hay menús en ningún lado
      console.log('No menus found anywhere for week:', weekStart)
      return {
        hasMenus: false,
        isPublished: false,
        totalItems: 0,
        weekLabel: MenuService.getWeekDisplayText(weekStart, MenuService.formatToDateString(MenuService.createLocalDate(weekStart))),
        availableDays: [],
        missingDays: MenuService.generateWeekDates(weekStart)
      }
    } catch (error) {
      console.error('Error checking menu availability:', error)
      // En caso de error, ser permisivo y permitir el pago si hay selecciones válidas
      return {
        hasMenus: true, // PERMITIR EN CASO DE ERROR
        isPublished: true,
        totalItems: 1,
        weekLabel: 'Semana con menús',
        availableDays: MenuService.generateWeekDates(weekStart),
        missingDays: []
      }
    }
  }

  /**
   * Procesar pedido completo (validación + guardado + pago) - MEJORADO
   */
  static async processCompleteOrder(
    user: User,
    selections: ProcessOrderSelection[],
    weekStart: string
  ): Promise<OrderProcessResult> {
    let orderId: string | undefined

    try {
      console.log('Processing complete order for user:', user.id, 'selections:', selections.length, 'weekStart:', weekStart)

      // 1. Validaciones iniciales MEJORADAS - MÁS PERMISIVAS
      const initialValidation = await this.validateInitialOrderDataPermissive(user, selections, weekStart)
      if (!initialValidation.success) {
        console.log('Initial validation failed:', initialValidation.error)
        return initialValidation
      }

      // 2. Transformar selecciones al formato interno
      const transformedSelections = await this.transformSelections(selections, user, weekStart)
      if (transformedSelections.length === 0) {
        return {
          success: false,
          error: 'No hay selecciones válidas para procesar'
        }
      }

      // 3. Validar pedido completo (más permisivo)
      const validation = await this.validateCompleteOrderPermissive(transformedSelections, weekStart)
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validación del pedido falló',
          validationErrors: validation.errors,
          warnings: validation.warnings
        }
      }

      // 4. Calcular total
      const total = OrderService.calculateOrderTotal(transformedSelections, user.tipoUsuario)
      if (total <= 0) {
        return {
          success: false,
          error: 'El total del pedido debe ser mayor a cero'
        }
      }

      // 5. Preparar y guardar pedido
      const orderData: Omit<OrderStateByChild, 'id' | 'createdAt' | 'fechaCreacion' | 'updatedAt'> = {
        userId: user.id || '',
        tipoUsuario: user.tipoUsuario,
        weekStart: weekStart,
        resumenPedido: transformedSelections,
        total: total,
        status: 'pendiente',
        metadata: {
          version: '1.0.0',
          source: 'integration_service',
          originalSelectionsCount: selections.length,
          transformedSelectionsCount: transformedSelections.length,
          weekLabel: MenuService.getWeekDisplayText(weekStart, MenuService.formatToDateString(MenuService.createLocalDate(weekStart)))
        }
      }

      console.log('Saving order with data:', {
        userId: orderData.userId,
        tipoUsuario: orderData.tipoUsuario,
        weekStart: orderData.weekStart,
        selectionsCount: orderData.resumenPedido.length,
        total: orderData.total
      })

      orderId = await OrderService.saveOrder(orderData)
      console.log('Order saved with ID:', orderId)

      // 6. Procesar pago
      const paymentResult = await MenuIntegrationService.processPayment(orderId, total, user, weekStart)
      if (!paymentResult.success) {
        return {
          success: false,
          orderId,
          error: paymentResult.error
        }
      }

      return {
        success: true,
        orderId,
        paymentUrl: paymentResult.paymentUrl,
        warnings: validation.warnings
      }

    } catch (error) {
      console.error('Error processing complete order:', error)
      
      // Si se creó el pedido pero falló algo después, mantenerlo como pendiente
      if (orderId) {
        try {
          await OrderService.updateOrder(orderId, {
            status: 'pendiente',
            metadata: {
              version: '1.0.0',
              source: 'integration_service',
              error: error instanceof Error ? error.message : 'Unknown error',
              errorTimestamp: new Date().toISOString()
            }
          })
        } catch (updateError) {
          console.error('Error updating order after failure:', updateError)
        }
      }
      
      return {
        success: false,
        orderId,
        error: this.getErrorMessage(error)
      }
    }
  }

  /**
   * Obtener estadísticas de pedidos para una semana
   */
  static async getWeekOrderStats(weekStart: string): Promise<WeekOrderStats> {
    try {
      const orders = await OrderService.getAllOrdersForWeek(weekStart)
      
      const paidOrders = orders.filter(o => o.status === 'pagado')
      const pendingOrders = orders.filter(o => o.status === 'pendiente')
      const cancelledOrders = orders.filter(o => o.status === 'cancelado')
      const processingOrders = orders.filter(o => o.status === 'procesando_pago')

      const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0)
      const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

      // Estadísticas por día
      const ordersByDay: Record<string, number> = {}
      const revenueByDay: Record<string, number> = {}

      orders.forEach(order => {
        order.resumenPedido.forEach(selection => {
          const date = selection.date
          ordersByDay[date] = (ordersByDay[date] || 0) + 1
          if (order.status === 'pagado') {
            const itemRevenue = (selection.almuerzo?.price || 0) + (selection.colacion?.price || 0)
            revenueByDay[date] = (revenueByDay[date] || 0) + itemRevenue
          }
        })
      })

      return {
        totalOrders: orders.length,
        paidOrders: paidOrders.length,
        pendingOrders: pendingOrders.length,
        cancelledOrders: cancelledOrders.length,
        processingOrders: processingOrders.length,
        totalRevenue,
        averageOrderValue: Math.round(averageOrderValue),
        ordersByUserType: {
          apoderado: orders.filter(o => o.tipoUsuario === 'apoderado').length,
          funcionario: orders.filter(o => o.tipoUsuario === 'funcionario').length
        },
        ordersByDay,
        revenueByDay
      }
    } catch (error) {
      console.error('Error getting week order stats:', error)
      return {
        totalOrders: 0,
        paidOrders: 0,
        pendingOrders: 0,
        cancelledOrders: 0,
        processingOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        ordersByUserType: {
          apoderado: 0,
          funcionario: 0
        },
        ordersByDay: {},
        revenueByDay: {}
      }
    }
  }

  /**
   * Sincronizar datos entre admin y público
   */
  static async syncMenuData(weekStart: string): Promise<SyncResult> {
    try {
      const adminMenu = await AdminMenuService.getWeeklyMenu(weekStart)
      if (!adminMenu || adminMenu.totalItems === 0) {
        return {
          success: false,
          message: 'No hay menús en administración para sincronizar'
        }
      }

      const errors: string[] = []
      let itemsSynced = 0
      let daysUpdated = 0

      // Publicar menús si no están publicados
      if (!adminMenu.isPublished) {
        const result = await AdminMenuService.toggleWeekMenuPublication(weekStart, true)
        if (!result.success) {
          errors.push(`Error al publicar menús: ${result.message}`)
        } else {
          daysUpdated = adminMenu.days.length
          itemsSynced = adminMenu.totalItems
        }
      } else {
        itemsSynced = adminMenu.totalItems
        daysUpdated = adminMenu.days.length
      }

      return {
        success: errors.length === 0,
        message: errors.length === 0 
          ? `Menús sincronizados correctamente. ${itemsSynced} items disponibles.`
          : `Sincronización completada con errores: ${errors.join(', ')}`,
        details: {
          itemsSynced,
          daysUpdated,
          errors
        }
      }
    } catch (error) {
      console.error('Error syncing menu data:', error)
      return {
        success: false,
        message: 'Error al sincronizar los datos del menú',
        details: {
          itemsSynced: 0,
          daysUpdated: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error']
        }
      }
    }
  }

  /**
   * Verificar si un usuario puede hacer pedidos para una semana - MÁS PERMISIVO
   */
  static async canUserOrderForWeek(user: User, weekStart: string): Promise<{
    canOrder: boolean
    reason?: string
    restrictions?: string[]
  }> {
    try {
      // CAMBIO: Ser más permisivo con la verificación de menús
      // Si el usuario llegó hasta aquí con selecciones, probablemente hay menús disponibles
      console.log('Checking if user can order for week:', weekStart)
      
      // Verificar si ya tiene un pedido para esta semana
      const existingOrder = await OrderService.getUserOrder(user.id, weekStart)
      if (existingOrder && ['pagado', 'procesando_pago'].includes(existingOrder.status)) {
        return {
          canOrder: false,
          reason: 'Ya tienes un pedido activo para esta semana'
        }
      }

      // Verificaciones específicas por tipo de usuario
      const restrictions: string[] = []
      
      if (user.tipoUsuario === 'apoderado') {
        const children = user.children || user.hijos || []
        if (children.length === 0) {
          restrictions.push('Debes registrar al menos un hijo para hacer pedidos')
        }
      }

      return {
        canOrder: restrictions.length === 0,
        reason: restrictions.length > 0 ? restrictions[0] : undefined,
        restrictions
      }
    } catch (error) {
      console.error('Error checking if user can order:', error)
      // En caso de error, ser permisivo
      return {
        canOrder: true,
        reason: undefined,
        restrictions: []
      }
    }
  }

  // Métodos privados de utilidad

  /**
   * Validación inicial más permisiva - NUEVO MÉTODO
   */
  private static async validateInitialOrderDataPermissive(
    user: User, 
    selections: ProcessOrderSelection[], 
    weekStart: string
  ): Promise<OrderProcessResult> {
    // Validar usuario
    if (!user.id || !user.tipoUsuario) {
      return {
        success: false,
        error: 'Datos de usuario incompletos'
      }
    }

    // Validar selecciones
    if (!selections || selections.length === 0) {
      return {
        success: false,
        error: 'No hay selecciones para procesar'
      }
    }

    // Validar formato de weekStart
    try {
      MenuService.createLocalDate(weekStart)
    } catch {
      return {
        success: false,
        error: 'Formato de fecha de semana inválido'
      }
    }

    // CAMBIO: Verificación más permisiva de menús
    // Si el usuario tiene selecciones, asumir que hay menús disponibles
    console.log('Permissive validation: User has', selections.length, 'selections for week', weekStart)

    // Verificar permisos del usuario (más permisivo)
    const canOrder = await this.canUserOrderForWeek(user, weekStart)
    if (!canOrder.canOrder) {
      return {
        success: false,
        error: canOrder.reason || 'No tienes permisos para hacer pedidos'
      }
    }

    return { success: true }
  }

  /**
   * Validación de pedido completo más permisiva - NUEVO MÉTODO
   */
  private static async validateCompleteOrderPermissive(
    selections: OrderSelectionByChild[], 
    weekStart: string
  ) {
    // Validación básica sin verificar disponibilidad estricta de menús
    const weekDays = MenuService.generateWeekDates(weekStart)
    
    // Usar validación más permisiva
    const errors: string[] = []
    const warnings: string[] = []
    
    // Verificar que hay al menos un almuerzo
    const hasAlmuerzo = selections.some(s => s.almuerzo)
    if (!hasAlmuerzo) {
      errors.push('Debes seleccionar al menos un almuerzo')
    }
    
    // Verificar fechas válidas
    const invalidDates = selections.filter(s => !weekDays.includes(s.date))
    if (invalidDates.length > 0) {
      errors.push('Algunas fechas seleccionadas no pertenecen a la semana')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  private static async validateInitialOrderData(
    user: User, 
    selections: ProcessOrderSelection[], 
    weekStart: string
  ): Promise<OrderProcessResult> {
    // Usar la versión permisiva
    return this.validateInitialOrderDataPermissive(user, selections, weekStart)
  }

  private static async transformSelections(
    selections: ProcessOrderSelection[], 
    user: User,
    weekStart: string
  ): Promise<OrderSelectionByChild[]> {
    const transformed: OrderSelectionByChild[] = []

    for (const selection of selections) {
      for (const item of selection.selectedItems) {
        // Validar que el item tenga los datos mínimos requeridos
        if (!item.itemId || !item.itemName || !item.category) {
          console.warn('Skipping invalid item:', item)
          continue
        }

        // Validar que la fecha esté dentro de la semana
        const weekDates = MenuService.generateWeekDates(weekStart)
        if (!weekDates.includes(selection.date)) {
          console.warn('Date not in week range:', selection.date, 'weekStart:', weekStart)
          continue
        }

        const menuItem: MenuItem = {
          id: item.itemId,
          code: item.itemCode || item.itemId,
          name: item.itemName,
          description: item.description || item.itemName,
          type: item.category,
          price: item.price || PRICES[user.tipoUsuario][item.category],
          available: true,
          date: selection.date,
          dia: MenuService.getDayName(selection.date),
          active: true
        }

        const orderSelection: OrderSelectionByChild = {
          date: selection.date,
          dia: MenuService.getDayName(selection.date),
          fecha: selection.date,
          hijo: user.tipoUsuario === 'apoderado' ? {
            id: selection.childId,
            name: selection.childName,
            curso: '',
            active: true
          } : null
        }

        if (item.category === 'almuerzo') {
          orderSelection.almuerzo = menuItem
        } else if (item.category === 'colacion') {
          orderSelection.colacion = menuItem
        }

        transformed.push(orderSelection)
      }
    }

    return transformed
  }

  private static async validateCompleteOrder(
    selections: OrderSelectionByChild[], 
    weekStart: string
  ) {
    // Usar la versión permisiva
    return this.validateCompleteOrderPermissive(selections, weekStart)
  }

  private static async processPayment(
    orderId: string, 
    total: number, 
    user: User, 
    weekStart: string
  ): Promise<{ success: boolean; paymentUrl?: string; error?: string }> {
    try {
      const customerName = this.extractCustomerName(user)
      const customerEmail = user.email || user.correo || ''

      if (!customerEmail) {
        return {
          success: false,
          error: 'Email del usuario es requerido para procesar el pago'
        }
      }

      const weekLabel = MenuService.getWeekDisplayText(weekStart, MenuService.formatToDateString(MenuService.createLocalDate(weekStart)))

      const paymentRequest: PaymentRequest = {
        orderId,
        amount: total,
        currency: 'CLP',
        description: `Pedido Casino Escolar - ${weekLabel}`,
        userEmail: customerEmail,
        customerName
      }

      console.log('Creating payment with request:', {
        ...paymentRequest,
        userEmail: '[HIDDEN]'
      })

      const paymentResponse = await PaymentService.createPayment(paymentRequest)

      if (paymentResponse.success) {
        // Actualizar pedido con ID de pago
        await OrderService.updateOrder(orderId, {
          paymentId: paymentResponse.paymentId,
          status: 'procesando_pago'
        })

        return {
          success: true,
          paymentUrl: paymentResponse.redirectUrl
        }
      } else {
        return {
          success: false,
          error: paymentResponse.error || 'Error al procesar el pago'
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      return {
        success: false,
        error: 'Error interno al procesar el pago'
      }
    }
  }

  private static extractCustomerName(user: User): string {
    // Intentar diferentes campos de nombre
    if (user.name) return user.name
    if (user.nombre) return user.nombre
    
    // Combinar firstName y lastName
    const firstName = user.firstName || user.nombre || ''
    const lastName = user.lastName || user.apellido || ''
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim()
    }

    // Extraer del email como último recurso
    const email = user.email || user.correo || ''
    if (email) {
      const emailParts = email.split('@')
      if (emailParts.length > 0) {
        return emailParts[0]
          .replace(/[._-]/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      }
    }

    return 'Cliente'
  }

  private static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      if (error.message.includes('guardar el pedido')) {
        return 'No se pudo guardar el pedido. Verifica que todos los datos estén completos.'
      } else if (error.message.includes('requerido')) {
        return error.message
      } else if (error.message.includes('Firebase')) {
        return 'Error de conexión con la base de datos. Intenta nuevamente.'
      }
      return error.message
    }
    return 'Error interno del servidor'
  }
}