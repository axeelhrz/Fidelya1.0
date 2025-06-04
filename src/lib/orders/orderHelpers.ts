import { supabase } from '@/lib/supabase/client'
import { Student, Almuerzo, Colacion, Pedido, PedidoInsert } from '@/lib/supabase/types'

// Tipo unión para productos del menú
export type MenuProduct = Almuerzo | Colacion

export interface OrderData {
  studentId: string
  products: {
    productId: string
    quantity: number
    type: 'almuerzo' | 'colacion'
  }[]
  deliveryDate: string
  dayOfWeek: string
}

export interface OrderValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface OrderSummary {
  student: Student
  products: (MenuProduct & { quantity: number; type: 'almuerzo' | 'colacion' })[]
  totalAmount: number
  deliveryDate: string
  dayOfWeek: string
}

export class OrderService {
  /**
   * Validar si se puede crear un pedido
   */
  static async validateOrder(orderData: OrderData): Promise<OrderValidation> {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // 1. Verificar horario de corte
      const { data: canOrder } = await supabase
        .rpc('can_make_order', { delivery_date: orderData.deliveryDate })

      if (!canOrder) {
        errors.push('Ya pasó la hora límite para hacer pedidos para este día')
      }

      // 2. Verificar si ya existe un pedido para este estudiante y fecha
      const { data: existingOrder } = await supabase
        .from('pedidos')
        .select('id')
        .eq('student_id', orderData.studentId)
        .eq('fecha_entrega', orderData.deliveryDate)
        .eq('dia_entrega', orderData.dayOfWeek)
        .single()

      if (existingOrder) {
        errors.push('Ya existe un pedido para este estudiante en esta fecha')
      }

      // 3. Verificar que los productos existan y estén disponibles
      const almuerzos = orderData.products.filter(p => p.type === 'almuerzo')
      const colaciones = orderData.products.filter(p => p.type === 'colacion')

      // Verificar almuerzos
      if (almuerzos.length > 0) {
        const almuerzoIds = almuerzos.map(p => p.productId)
        const { data: almuerzoProducts } = await supabase
          .from('almuerzos')
        .select('*')
          .in('id', almuerzoIds)
        .eq('fecha', orderData.deliveryDate)
        if (!almuerzoProducts || almuerzoProducts.length !== almuerzoIds.length) {
          errors.push('Algunos almuerzos no están disponibles para esta fecha')
      }
      }

      // Verificar colaciones
      if (colaciones.length > 0) {
        const colacionIds = colaciones.map(p => p.productId)
        const { data: colacionProducts } = await supabase
          .from('colaciones')
        .select('*')
          .in('id', colacionIds)
          .eq('fecha', orderData.deliveryDate)

        if (!colacionProducts || colacionProducts.length !== colacionIds.length) {
          errors.push('Algunas colaciones no están disponibles para esta fecha')
        }
      }

      // 4. Verificar cantidades válidas
      const invalidQuantities = orderData.products.filter(p => p.quantity <= 0)
      if (invalidQuantities.length > 0) {
        errors.push('Las cantidades deben ser mayores a 0')
      }
        return {
        isValid: errors.length === 0,
        errors,
        warnings
        }
    } catch (error) {
      console.error('Error validating order:', error)
      return {
        isValid: false,
        errors: ['Error validando el pedido'],
        warnings
      }
    }
  }

  /**
   * Crear un nuevo pedido
   */
  static async createOrder(
    guardianId: string,
    orderData: OrderData
  ): Promise<{ success: boolean; order?: Pedido; error?: string }> {
    try {
      // 1. Validar pedido
      const validation = await this.validateOrder(orderData)
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        }
      }

      // 2. Obtener productos con precios
      const almuerzos = orderData.products.filter(p => p.type === 'almuerzo')
      const colaciones = orderData.products.filter(p => p.type === 'colacion')

      let almuerzoProducts: Almuerzo[] = []
      let colacionProducts: Colacion[] = []

      // Obtener almuerzos
      if (almuerzos.length > 0) {
        const almuerzoIds = almuerzos.map(p => p.productId)
        const { data, error } = await supabase
          .from('almuerzos')
          .select('*')
          .in('id', almuerzoIds)

        if (error || !data) {
      return {
            success: false,
            error: 'Error obteniendo almuerzos'
          }
        }
        almuerzoProducts = data
      }

      // Obtener colaciones
      if (colaciones.length > 0) {
        const colacionIds = colaciones.map(p => p.productId)
        const { data, error } = await supabase
          .from('colaciones')
          .select('*')
          .in('id', colacionIds)

        if (error || !data) {
          return {
            success: false,
            error: 'Error obteniendo colaciones'
      }
    }
        colacionProducts = data
  }

      // 3. Obtener datos del estudiante para determinar precio
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', orderData.studentId)
        .single()

      if (studentError || !student) {
        return {
          success: false,
          error: 'Error obteniendo datos del estudiante'
      }
      }

      // 4. Obtener guardian para verificar si es funcionario
      const { data: guardian, error: guardianError } = await supabase
        .from('guardians')
        .select('is_staff')
        .eq('id', guardianId)
        .single()

      if (guardianError || !guardian) {
        return {
          success: false,
          error: 'Error obteniendo datos del guardian'
      }
      }

      // 5. Calcular total
      let totalAmount = 0
      const pedidoItems: PedidoInsert[] = []

      for (const orderProduct of orderData.products) {
        let product: MenuProduct | undefined
        let unitPrice = 0

        if (orderProduct.type === 'almuerzo') {
          product = almuerzoProducts.find(p => p.id === orderProduct.productId)
          if (product) {
            unitPrice = guardian.is_staff 
              ? product.precio_funcionario 
              : product.precio_estudiante
    }
        } else {
          product = colacionProducts.find(p => p.id === orderProduct.productId)
          if (product) {
            unitPrice = guardian.is_staff 
              ? product.precio_funcionario 
              : product.precio_estudiante
  }
}

        if (!product) continue

        const totalPrice = unitPrice * orderProduct.quantity

        pedidoItems.push({
          guardian_id: guardianId,
          student_id: orderData.studentId,
          almuerzo_id: orderProduct.type === 'almuerzo' ? product.id : null,
          colacion_id: orderProduct.type === 'colacion' ? product.id : null,
          fecha_entrega: orderData.deliveryDate,
          dia_entrega: orderData.dayOfWeek,
          total_amount: totalPrice,
          estado_pago: 'PENDIENTE'
        })

        totalAmount += totalPrice
      }

      // 6. Crear pedidos (uno por cada item)
      const { data: orders, error: orderError } = await supabase
        .from('pedidos')
        .insert(pedidoItems)
        .select()

      if (orderError || !orders || orders.length === 0) {
        return {
          success: false,
          error: 'Error creando el pedido'
        }
      }

      return {
        success: true,
        order: orders[0] // Retornar el primer pedido creado
      }
    } catch (error) {
      console.error('Error creating order:', error)
      return {
        success: false,
        error: 'Error interno creando el pedido'
      }
    }
  }

  /**
   * Obtener resumen de pedido antes de confirmar
   */
  static async getOrderSummary(orderData: OrderData): Promise<OrderSummary | null> {
    try {
      // Obtener estudiante
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', orderData.studentId)
        .single()

      if (studentError || !student) {
        throw new Error('Error obteniendo datos del estudiante')
      }

      // Obtener productos
      const almuerzos = orderData.products.filter(p => p.type === 'almuerzo')
      const colaciones = orderData.products.filter(p => p.type === 'colacion')

      let almuerzoProducts: Almuerzo[] = []
      let colacionProducts: Colacion[] = []

      // Obtener almuerzos
      if (almuerzos.length > 0) {
        const almuerzoIds = almuerzos.map(p => p.productId)
        const { data, error } = await supabase
          .from('almuerzos')
          .select('*')
          .in('id', almuerzoIds)

        if (error || !data) {
          throw new Error('Error obteniendo almuerzos')
        }
        almuerzoProducts = data
      }

      // Obtener colaciones
      if (colaciones.length > 0) {
        const colacionIds = colaciones.map(p => p.productId)
        const { data, error } = await supabase
          .from('colaciones')
          .select('*')
          .in('id', colacionIds)

        if (error || !data) {
          throw new Error('Error obteniendo colaciones')
        }
        colacionProducts = data
      }

      // Calcular total y preparar productos con cantidad
      let totalAmount = 0
      const productsWithQuantity: (MenuProduct & { quantity: number; type: 'almuerzo' | 'colacion' })[] = []

      for (const orderProduct of orderData.products) {
        let product: MenuProduct | undefined

        if (orderProduct.type === 'almuerzo') {
          product = almuerzoProducts.find(p => p.id === orderProduct.productId)
        } else {
          product = colacionProducts.find(p => p.id === orderProduct.productId)
        }

        if (!product) throw new Error('Producto no encontrado')

        // Para determinar el precio, necesitamos saber si es funcionario
        // Por simplicidad, asumimos precio de estudiante aquí
        const unitPrice = product.precio_estudiante
        totalAmount += unitPrice * orderProduct.quantity

        productsWithQuantity.push({
          ...product,
          quantity: orderProduct.quantity,
          type: orderProduct.type
        })
      }

      return {
        student,
        products: productsWithQuantity,
        totalAmount,
        deliveryDate: orderData.deliveryDate,
        dayOfWeek: orderData.dayOfWeek
      }
    } catch (error) {
      console.error('Error getting order summary:', error)
      return null
    }
  }

  /**
   * Obtener pedidos de un guardian
   */
  static async getGuardianOrders(guardianId: string) {
    try {
      const { data: orders, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          students (
            id,
            name,
            grade,
            section
          ),
          almuerzos (
            codigo,
            descripcion
          ),
          colaciones (
            codigo,
            descripcion
          )
        `)
        .eq('guardian_id', guardianId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return orders
    } catch (error) {
      console.error('Error getting guardian orders:', error)
      return []
    }
  }

  /**
   * Cancelar pedido (solo si está pendiente)
   */
  static async cancelOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: order, error: getError } = await supabase
        .from('pedidos')
        .select('estado_pago')
        .eq('id', orderId)
        .single()

      if (getError || !order) {
        return { success: false, error: 'Pedido no encontrado' }
      }

      if (order.estado_pago !== 'PENDIENTE') {
        return { success: false, error: 'Solo se pueden cancelar pedidos pendientes' }
      }

      const { error: updateError } = await supabase
        .from('pedidos')
        .update({ estado_pago: 'CANCELADO' })
        .eq('id', orderId)

      if (updateError) {
        return { success: false, error: 'Error cancelando el pedido' }
      }

      return { success: true }
    } catch (error) {
      console.error('Error canceling order:', error)
      return { success: false, error: 'Error interno cancelando el pedido' }
    }
  }

  /**
   * Formatear precio en pesos chilenos
   */
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  /**
   * Obtener opciones de menú para una fecha específica
   */
  static async getMenuOptionsForDate(date: string): Promise<{
    almuerzos: Almuerzo[]
    colaciones: Colacion[]
  }> {
    try {
      const [almuerzoResult, colacionResult] = await Promise.all([
        supabase
          .from('almuerzos')
          .select('*')
          .eq('fecha', date)
          .order('codigo'),
        supabase
          .from('colaciones')
          .select('*')
          .eq('fecha', date)
          .order('codigo')
      ])

      return {
        almuerzos: almuerzoResult.data || [],
        colaciones: colacionResult.data || []
      }
    } catch (error) {
      console.error('Error getting menu options:', error)
      return {
        almuerzos: [],
        colaciones: []
      }
    }
  }
}