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
import { OrderSelection } from '@/types/panel'

export class OrderService {
  static async getUserOrder(userId: string, weekStart: string): Promise<OrderState | null> {
    try {
      const ordersRef = collection(db, 'orders')
      const q = query(
        ordersRef,
        where('userId', '==', userId),
        where('weekStart', '==', weekStart),
        where('status', 'in', ['draft', 'pending', 'paid'])
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
        weekStart: data.weekStart,
        selections: data.selections || [],
        total: data.total || 0,
        status: data.status || 'draft',
        createdAt: data.createdAt?.toDate() || new Date(),
        paidAt: data.paidAt?.toDate(),
        paymentId: data.paymentId
      }
    } catch (error) {
      console.error('Error fetching user order:', error)
      throw new Error('No se pudo cargar el pedido del usuario')
    }
  }

  static async saveOrder(order: Omit<OrderState, 'id' | 'createdAt'>): Promise<string> {
    try {
      const ordersRef = collection(db, 'orders')
      
      const orderData = {
        ...order,
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

  static async updateOrder(orderId: string, updates: Partial<OrderState>): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', orderId)
      
      const { paidAt, ...restUpdates } = updates
      const updateData: any = {
        ...restUpdates,
        updatedAt: Timestamp.now()
      }
      
      if (paidAt) {
        updateData.paidAt = Timestamp.fromDate(paidAt)
      }
      
      await updateDoc(orderRef, updateData)
    } catch (error) {
      console.error('Error updating order:', error)
      throw new Error('No se pudo actualizar el pedido')
    }
  }

  static validateOrder(
    selections: OrderSelection[], 
    weekDays: string[], 
    isOrderingAllowed: boolean
  ): OrderValidation {
    const errors: string[] = []
    const warnings: string[] = []
    const missingDays: string[] = []
    
    // Verificar si se permite hacer pedidos
    if (!isOrderingAllowed) {
      errors.push('El tiempo para realizar pedidos ha expirado (miércoles 13:00)')
    }
    
    // Verificar que todos los días tengan almuerzo
    weekDays.forEach(day => {
      const selection = selections.find(s => s.date === day)
      if (!selection || !selection.almuerzo) {
        missingDays.push(day)
      }
    })
    
    if (missingDays.length > 0) {
      errors.push(`Faltan seleccionar almuerzos para ${missingDays.length} día(s)`)
    }
    
    // Verificar que haya al menos una selección
    if (selections.length === 0) {
      errors.push('Debe seleccionar al menos un almuerzo')
    }
    
    // Advertencias
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
