import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  Timestamp,
  getDoc
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { OrderValidation } from '@/types/order'
import { OrderSelectionByChild, Child, User } from '@/types/panel'

export interface OrderStateByChild {
  id?: string
  userId: string
  tipoUsuario: 'apoderado' | 'funcionario'
  weekStart: string
  fechaCreacion: Date
  resumenPedido: OrderSelectionByChild[]
  total: number
  status: 'pendiente' | 'pagado' | 'cancelado' | 'procesando_pago'
  createdAt: Date
  paidAt?: Date
  paymentId?: string
}

export class OrderService {
  private static readonly COLLECTION_NAME = 'orders'

  static async getUserOrder(userId: string, weekStart: string): Promise<OrderStateByChild | null> {
    try {
      const ordersRef = collection(db, this.COLLECTION_NAME)
      const q = query(
        ordersRef,
        where('userId', '==', userId),
        where('weekStart', '==', weekStart),
        where('status', 'in', ['pendiente', 'pagado', 'procesando_pago'])
      )
      
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        return null
      }
      
      const docData = snapshot.docs[0]
      const data = docData.data()
      
      return {
        id: docData.id,
        userId: data.userId,
        tipoUsuario: data.tipoUsuario,
        weekStart: data.weekStart,
        fechaCreacion: data.fechaCreacion?.toDate() || new Date(),
        resumenPedido: data.resumenPedido || [],
        total: data.total || 0,
        status: data.status || 'pendiente',
        createdAt: data.createdAt?.toDate() || new Date(),
        paidAt: data.paidAt?.toDate(),
        paymentId: data.paymentId
      }
    } catch (error) {
      console.error('Error fetching user order:', error)
      throw new Error('No se pudo cargar el pedido del usuario')
    }
  }

  // Función auxiliar para limpiar datos undefined
  private static cleanOrderData(data: any): any {
    const cleaned: any = {}
    
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Limpiar arrays recursivamente
          cleaned[key] = value.map(item => 
            typeof item === 'object' && item !== null 
              ? this.cleanOrderData(item) 
              : item
          ).filter(item => item !== undefined && item !== null)
        } else if (typeof value === 'object' && value !== null) {
          // Limpiar objetos recursivamente
          const cleanedObject = this.cleanOrderData(value)
          if (Object.keys(cleanedObject).length > 0) {
            cleaned[key] = cleanedObject
          }
        } else {
          cleaned[key] = value
        }
      }
    }
    
    return cleaned
  }

  // Función auxiliar para validar y limpiar selecciones
  private static cleanSelections(selections: OrderSelectionByChild[]): OrderSelectionByChild[] {
    return selections.map(selection => {
      const cleanedSelection: any = {
        date: selection.date || '',
        day: selection.day || '',
        fecha: selection.fecha || selection.date || ''
      }

      // Limpiar hijo (puede ser null para funcionarios)
      if (selection.hijo) {
        cleanedSelection.hijo = {
          id: selection.hijo.id || '',
          name: selection.hijo.name || '',
          curso: selection.hijo.curso || '',
          rut: selection.hijo.rut || null,
          active: selection.hijo.active !== undefined ? selection.hijo.active : true
        }
      } else {
        cleanedSelection.hijo = null
      }

      // Limpiar almuerzo
      if (selection.almuerzo) {
        cleanedSelection.almuerzo = {
          id: selection.almuerzo.id || '',
          code: selection.almuerzo.code || '',
          name: selection.almuerzo.name || '',
          description: selection.almuerzo.description || '',
          type: selection.almuerzo.type || 'almuerzo',
          price: selection.almuerzo.price || 0,
          available: selection.almuerzo.available !== undefined ? selection.almuerzo.available : true,
          date: selection.almuerzo.date || selection.date || '',
          day: selection.almuerzo.day || selection.day || '',
          active: selection.almuerzo.active !== undefined ? selection.almuerzo.active : true
        }
      }

      // Limpiar colación
      if (selection.colacion) {
        cleanedSelection.colacion = {
          id: selection.colacion.id || '',
          code: selection.colacion.code || '',
          name: selection.colacion.name || '',
          description: selection.colacion.description || '',
          type: selection.colacion.type || 'colacion',
          price: selection.colacion.price || 0,
          available: selection.colacion.available !== undefined ? selection.colacion.available : true,
          date: selection.colacion.date || selection.date || '',
          day: selection.colacion.day || selection.day || '',
          active: selection.colacion.active !== undefined ? selection.colacion.active : true
        }
      }

      return cleanedSelection as OrderSelectionByChild
    }).filter(selection => 
      // Filtrar selecciones que tengan al menos almuerzo o colación
      selection.almuerzo || selection.colacion
    )
  }

  static async saveOrder(order: Omit<OrderStateByChild, 'id' | 'createdAt' | 'fechaCreacion'>): Promise<string> {
    try {
      console.log('Saving order with data:', order)

      // Validar datos requeridos
      if (!order.userId) {
        throw new Error('userId es requerido')
      }
      if (!order.tipoUsuario) {
        throw new Error('tipoUsuario es requerido')
      }
      if (!order.weekStart) {
        throw new Error('weekStart es requerido')
      }
      if (!order.resumenPedido || order.resumenPedido.length === 0) {
        throw new Error('resumenPedido no puede estar vacío')
      }

      const ordersRef = collection(db, this.COLLECTION_NAME)
      
      // Limpiar y validar las selecciones
      const cleanedSelections = this.cleanSelections(order.resumenPedido)
      
      if (cleanedSelections.length === 0) {
        throw new Error('No hay selecciones válidas para guardar')
      }

      // Preparar datos limpios para Firebase
      const orderData = {
        userId: order.userId,
        tipoUsuario: order.tipoUsuario,
        weekStart: order.weekStart,
        resumenPedido: cleanedSelections,
        total: order.total || 0,
        status: order.status || 'pendiente',
        fechaCreacion: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }

      // Agregar paymentId solo si existe
      if (order.paymentId) {
        orderData.paymentId = order.paymentId
      }

      // Limpiar cualquier undefined restante
      const finalOrderData = this.cleanOrderData(orderData)
      
      console.log('Final order data for Firebase:', finalOrderData)
      
      const docRef = await addDoc(ordersRef, finalOrderData)
      console.log('Order saved successfully with ID:', docRef.id)
      
      return docRef.id
    } catch (error) {
      console.error('Error saving order:', error)
      throw new Error('No se pudo guardar el pedido')
    }
  }

  static async updateOrder(orderId: string, updates: Partial<OrderStateByChild>): Promise<void> {
    try {
      const orderRef = doc(db, this.COLLECTION_NAME, orderId)
      
      // Verificar que el documento existe
      const docSnap = await getDoc(orderRef)
      if (!docSnap.exists()) {
        throw new Error('El pedido no existe')
      }
      
      const { paidAt, fechaCreacion, createdAt, ...restUpdates } = updates
      const updateData: any = {
        ...restUpdates,
        updatedAt: Timestamp.now()
      }
      
      if (paidAt) {
        updateData.paidAt = Timestamp.fromDate(paidAt)
      }
      
      if (fechaCreacion) {
        updateData.fechaCreacion = Timestamp.fromDate(fechaCreacion)
      }

      if (createdAt) {
        updateData.createdAt = Timestamp.fromDate(createdAt)
      }

      // Limpiar datos undefined
      const cleanedUpdateData = this.cleanOrderData(updateData)
      
      await updateDoc(orderRef, cleanedUpdateData)
    } catch (error) {
      console.error('Error updating order:', error)
      throw new Error('No se pudo actualizar el pedido')
    }
  }

  static async getOrderById(orderId: string): Promise<OrderStateByChild | null> {
    try {
      const orderRef = doc(db, this.COLLECTION_NAME, orderId)
      const docSnap = await getDoc(orderRef)
      
      if (!docSnap.exists()) {
        return null
      }
      
      const data = docSnap.data()
      return {
        id: docSnap.id,
        userId: data.userId,
        tipoUsuario: data.tipoUsuario,
        weekStart: data.weekStart,
        fechaCreacion: data.fechaCreacion?.toDate() || new Date(),
        resumenPedido: data.resumenPedido || [],
        total: data.total || 0,
        status: data.status || 'pendiente',
        createdAt: data.createdAt?.toDate() || new Date(),
        paidAt: data.paidAt?.toDate(),
        paymentId: data.paymentId
      }
    } catch (error) {
      console.error('Error fetching order by ID:', error)
      return null
    }
  }

  static async getAllOrdersForWeek(weekStart: string): Promise<OrderStateByChild[]> {
    try {
      const ordersRef = collection(db, this.COLLECTION_NAME)
      const q = query(
        ordersRef,
        where('weekStart', '==', weekStart)
      )
      
      const snapshot = await getDocs(q)
      const orders: OrderStateByChild[] = []
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        orders.push({
          id: doc.id,
          userId: data.userId,
          tipoUsuario: data.tipoUsuario,
          weekStart: data.weekStart,
          fechaCreacion: data.fechaCreacion?.toDate() || new Date(),
          resumenPedido: data.resumenPedido || [],
          total: data.total || 0,
          status: data.status || 'pendiente',
          createdAt: data.createdAt?.toDate() || new Date(),
          paidAt: data.paidAt?.toDate(),
          paymentId: data.paymentId
        })
      })
      
      return orders
    } catch (error) {
      console.error('Error fetching orders for week:', error)
      throw new Error('No se pudieron cargar los pedidos de la semana')
    }
  }

  static validateOrderByChild(
    selections: OrderSelectionByChild[], 
    weekDays: string[], 
    isOrderingAllowed: boolean,
    user: User
  ): OrderValidation {
    const errors: string[] = []
    const warnings: string[] = []
    const missingDays: string[] = []
    
    // Verificar si se permite hacer pedidos
    if (!isOrderingAllowed) {
      errors.push('El tiempo para realizar pedidos ha expirado')
    }
    
    // Verificar que haya al menos una selección con almuerzo
    const selectionsWithAlmuerzo = selections.filter(s => s.almuerzo)
    if (selectionsWithAlmuerzo.length === 0) {
      errors.push('Debe seleccionar al menos un almuerzo para proceder')
    }
    
    if (user.tipoUsuario === 'apoderado') {
      // Verificar que haya hijos registrados
      if (!user.children || user.children.length === 0) {
        errors.push('Debe registrar al menos un hijo para realizar pedidos')
      }
      
      // Verificar que haya al menos una selección para algún hijo
      if (selections.length === 0) {
        errors.push('Debe seleccionar menús para al menos un hijo')
      }
    }
    
    // Advertencias informativas (no bloquean el pago)
    const weekDaysLaboral = weekDays.filter((_, index) => index < 5) // Solo lunes a viernes
    const daysWithoutAlmuerzo = weekDaysLaboral.filter(day => {
      const daySelections = selections.filter(s => s.date === day && s.almuerzo)
      return daySelections.length === 0
    })
    
    if (daysWithoutAlmuerzo.length > 0 && selectionsWithAlmuerzo.length > 0) {
      warnings.push(`Tienes ${daysWithoutAlmuerzo.length} día(s) sin almuerzo seleccionado. Puedes agregar más días después del pago.`)
    }
    
    // Advertencia sobre colaciones
    const selectionsWithoutColacion = selections.filter(s => s.almuerzo && !s.colacion)
    if (selectionsWithoutColacion.length > 0) {
      warnings.push(`${selectionsWithoutColacion.length} selección(es) sin colación. Las colaciones son opcionales.`)
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      missingDays: daysWithoutAlmuerzo,
      canProceedToPayment: errors.length === 0 && isOrderingAllowed && selectionsWithAlmuerzo.length > 0
    }
  }

  // Método de compatibilidad con la estructura anterior
  static validateOrder(
    selections: any[], 
    weekDays: string[], 
    isOrderingAllowed: boolean
  ): OrderValidation {
    const errors: string[] = []
    const warnings: string[] = []
    const missingDays: string[] = []
    
    if (!isOrderingAllowed) {
      errors.push('El tiempo para realizar pedidos ha expirado')
    }
    
    // Solo verificar que haya al menos un almuerzo seleccionado
    const selectionsWithAlmuerzo = selections.filter(s => s.almuerzo)
    if (selectionsWithAlmuerzo.length === 0) {
      errors.push('Debe seleccionar al menos un almuerzo para proceder')
    }
    
    // Advertencias informativas
    const weekDaysLaboral = weekDays.filter((_, index) => index < 5) // Solo lunes a viernes
    const daysWithoutAlmuerzo = weekDaysLaboral.filter(day => {
      const selection = selections.find(s => s.date === day && s.almuerzo)
      return !selection
    })
    
    if (daysWithoutAlmuerzo.length > 0 && selectionsWithAlmuerzo.length > 0) {
      warnings.push(`${daysWithoutAlmuerzo.length} día(s) sin almuerzo seleccionado`)
    }
    
    const selectionsWithoutColacion = selections.filter(s => s.almuerzo && !s.colacion)
    if (selectionsWithoutColacion.length > 0) {
      warnings.push(`${selectionsWithoutColacion.length} día(s) sin colación seleccionada`)
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      missingDays: daysWithoutAlmuerzo,
      canProceedToPayment: errors.length === 0 && isOrderingAllowed && selectionsWithAlmuerzo.length > 0
    }
  }

  // Calcular total del pedido
  static calculateOrderTotal(selections: OrderSelectionByChild[], userType: 'apoderado' | 'funcionario'): number {
    const prices = userType === 'funcionario' 
      ? { almuerzo: 4875, colacion: 4875 }
      : { almuerzo: 5500, colacion: 5500 }

    let total = 0
    
    selections.forEach(selection => {
      if (selection.almuerzo) {
        total += prices.almuerzo
      }
      if (selection.colacion) {
        total += prices.colacion
      }
    })
    
    return total
  }

  // Obtener resumen del pedido
  static getOrderSummary(selections: OrderSelectionByChild[], userType: 'apoderado' | 'funcionario') {
    const totalAlmuerzos = selections.filter(s => s.almuerzo).length
    const totalColaciones = selections.filter(s => s.colacion).length
    
    const prices = userType === 'funcionario' 
      ? { almuerzo: 4875, colacion: 4875 }
      : { almuerzo: 5500, colacion: 5500 }
    
    const subtotalAlmuerzos = totalAlmuerzos * prices.almuerzo
    const subtotalColaciones = totalColaciones * prices.colacion
    const total = subtotalAlmuerzos + subtotalColaciones
    
    return {
      totalAlmuerzos,
      totalColaciones,
      subtotalAlmuerzos,
      subtotalColaciones,
      total,
      selections
    }
  }
}