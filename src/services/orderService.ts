import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { OrderState, OrderValidation } from '@/types/order'
import { OrderSelectionByChild, Child, User } from '@/types/panel'

export interface OrderStateByChild {
  id?: string
  userId: string
  tipoUsuario: 'apoderado' | 'funcionario'
  weekStart: string
  fechaCreacion: Date
  resumenPedido: OrderSelectionByChild[]
  total: number
  status: 'pendiente' | 'pagado' | 'cancelado'
  createdAt: Date
  paidAt?: Date
  paymentId?: string
}

export class OrderService {
  static async getUserOrder(userId: string, weekStart: string): Promise<OrderStateByChild | null> {
    try {
      const ordersRef = collection(db, 'orders')
      const q = query(
        ordersRef,
        where('userId', '==', userId),
        where('weekStart', '==', weekStart),
        where('status', 'in', ['pendiente', 'pagado'])
      )
      
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        return null
      }
      
      const doc = snapshot.docs[0]
      const data = doc.data()
      
      return {
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
      }
    } catch (error) {
      console.error('Error fetching user order:', error)
      throw new Error('No se pudo cargar el pedido del usuario')
    }
  }

  static async saveOrder(order: Omit<OrderStateByChild, 'id' | 'createdAt' | 'fechaCreacion'>): Promise<string> {
    try {
      const ordersRef = collection(db, 'orders')
      
      const orderData = {
        ...order,
        fechaCreacion: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
      
      const docRef = await addDoc(ordersRef, orderData)
      return docRef.id
    } catch (error) {
      console.error('Error saving order:', error)
      throw new Error('No se pudo guardar el pedido')
    }
  }

  static async updateOrder(orderId: string, updates: Partial<OrderStateByChild>): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', orderId)
      
      const { paidAt, fechaCreacion, ...restUpdates } = updates
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
      
      await updateDoc(orderRef, updateData)
    } catch (error) {
      console.error('Error updating order:', error)
      throw new Error('No se pudo actualizar el pedido')
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
      errors.push('El tiempo para realizar pedidos ha expirado (miércoles 13:00)')
    }
    
    if (user.tipoUsuario === 'apoderado') {
      // Para apoderados: verificar que todos los días tengan almuerzo para al menos un hijo
      weekDays.forEach(day => {
        const daySelections = selections.filter(s => s.date === day && s.almuerzo)
        if (daySelections.length === 0) {
          missingDays.push(day)
        }
      })
      
      if (missingDays.length > 0) {
        errors.push(`Faltan seleccionar almuerzos para ${missingDays.length} día(s)`)
      }
      
      // Verificar que haya hijos registrados
      if (!user.children || user.children.length === 0) {
        errors.push('Debe registrar al menos un hijo para realizar pedidos')
      }
    } else {
      // Para funcionarios: verificar que todos los días tengan almuerzo
      weekDays.forEach(day => {
        const selection = selections.find(s => s.date === day && s.almuerzo)
        if (!selection) {
          missingDays.push(day)
        }
      })
      
      if (missingDays.length > 0) {
        errors.push(`Faltan seleccionar almuerzos para ${missingDays.length} día(s)`)
      }
    }
    
    // Verificar que haya al menos una selección
    if (selections.length === 0) {
      errors.push('Debe seleccionar al menos un almuerzo')
    }
    
    // Advertencias
    const selectionsWithoutColacion = selections.filter(s => s.almuerzo && !s.colacion)
    if (selectionsWithoutColacion.length > 0) {
      warnings.push(`${selectionsWithoutColacion.length} selección(es) sin colación`)
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      missingDays,
      canProceedToPayment: errors.length === 0 && isOrderingAllowed
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
      errors.push('El tiempo para realizar pedidos ha expirado (miércoles 13:00)')
    }
    
    weekDays.forEach(day => {
      const selection = selections.find(s => s.date === day)
      if (!selection || !selection.almuerzo) {
        missingDays.push(day)
      }
    })
    
    if (missingDays.length > 0) {
      errors.push(`Faltan seleccionar almuerzos para ${missingDays.length} día(s)`)
    }
    
    if (selections.length === 0) {
      errors.push('Debe seleccionar al menos un almuerzo')
    }
    
    const selectionsWithoutColacion = selections.filter(s => s.almuerzo && !s.colacion)
    if (selectionsWithoutColacion.length > 0) {
      warnings.push(`${selectionsWithoutColacion.length} día(s) sin colación seleccionada`)
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      missingDays,
      canProceedToPayment: errors.length === 0 && isOrderingAllowed
    }
  }
}