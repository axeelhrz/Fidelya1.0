import { supabase } from '@/lib/supabase/client'
import { Student, Product, Order, OrderItemInsert } from '@/lib/supabase/types'

export interface OrderData {
  studentId: string
  products: {
    productId: string
    quantity: number
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
  products: (Product & { quantity: number })[]
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
        .from('orders')
        .select('id')
        .eq('student_id', orderData.studentId)
        .eq('fecha_pedido', orderData.deliveryDate)
        .eq('dia_entrega', orderData.dayOfWeek)
        .single()

      if (existingOrder) {
        errors.push('Ya existe un pedido para este estudiante en esta fecha')
      }

      // 3. Verificar que los productos existan y estén disponibles
      const productIds = orderData.products.map(p => p.productId)
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds)
        .eq('fecha', orderData.deliveryDate)
        .eq('is_active', true)

      if (!products || products.length !== productIds.length) {
        errors.push('Algunos productos no están disponibles para esta fecha')
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
  ): Promise<{ success: boolean; order?: Order; error?: string }> {
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
      const productIds = orderData.products.map(p => p.productId)
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds)

      if (productsError || !products) {
        return {
          success: false,
          error: 'Error obteniendo productos'
        }
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

      // 4. Calcular total
      let totalAmount = 0
      const orderItems: OrderItemInsert[] = []

      for (const orderProduct of orderData.products) {
        const product = products.find(p => p.id === orderProduct.productId)
        if (!product) continue

        const unitPrice = student.tipo === 'Funcionario' 
          ? product.precio_funcionario 
          : product.precio_estudiante
        
        const totalPrice = unitPrice * orderProduct.quantity

        orderItems.push({
          guardian_id: guardianId,
          student_id: orderData.studentId,
          fecha_entrega: orderData.deliveryDate,
          tipo_pedido: "ALMUERZO",
          opcion_elegida: product.codigo,
          precio: totalPrice
        })

        totalAmount += totalPrice
      }

      // 5. Crear pedido en transacción
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          guardian_id: guardianId,
          student_id: orderData.studentId,
          fecha_pedido: orderData.deliveryDate,
          dia_entrega: orderData.dayOfWeek,
          total_amount: totalAmount,
          status: 'PENDIENTE'
        })
        .select()
        .single()

      if (orderError || !order) {
        return {
          success: false,
          error: 'Error creando el pedido'
        }
      }

      // 6. Crear items del pedido
      const orderItemsWithOrderId = orderItems.map(item => ({
        ...item,
        order_id: order.id
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsWithOrderId)

      if (itemsError) {
        // Rollback: eliminar el pedido si falló crear los items
        await supabase.from('orders').delete().eq('id', order.id)
        return {
          success: false,
          error: 'Error creando los items del pedido'
        }
      }

      return {
        success: true,
        order
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
      const productIds = orderData.products.map(p => p.productId)
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds)

      if (productsError || !products) {
        throw new Error('Error obteniendo productos')
      }

      // Calcular total y preparar productos con cantidad
      let totalAmount = 0
      const productsWithQuantity = orderData.products.map(orderProduct => {
        const product = products.find(p => p.id === orderProduct.productId)
        if (!product) throw new Error('Producto no encontrado')

        const unitPrice = student.tipo === 'Funcionario' 
          ? product.precio_funcionario 
          : product.precio_estudiante

        totalAmount += unitPrice * orderProduct.quantity

        return {
          ...product,
          quantity: orderProduct.quantity
        }
      })

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
        .from('orders')
        .select(`
          *,
          students (
            id,
            name,
            grade,
            section
          ),
          order_items (
            *,
            products (
              codigo,
              descripcion
            )
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
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single()

      if (getError || !order) {
        return { success: false, error: 'Pedido no encontrado' }
      }

      if (order.status !== 'PENDIENTE') {
        return { success: false, error: 'Solo se pueden cancelar pedidos pendientes' }
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'CANCELADO' })
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
}