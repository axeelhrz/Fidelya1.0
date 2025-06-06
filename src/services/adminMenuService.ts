import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { MenuItem } from '@/types/panel'
import { format, startOfWeek, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

export interface AdminMenuItem extends Omit<MenuItem, 'price'> {
  weekStart: string
  createdBy: string
  updatedAt: Date
}

export interface WeeklyMenuStructure {
  weekStart: string
  weekEnd: string
  days: {
    [date: string]: {
      date: string
      dia: string
      almuerzos: AdminMenuItem[]
      colaciones: AdminMenuItem[]
    }
  }
  isPublished: boolean
  createdBy: string
  createdAt: Date
}

export class AdminMenuService {
  // Obtener menú semanal para administración
  static async getWeeklyMenuForAdmin(weekStart: string): Promise<WeeklyMenuStructure> {
    try {
      const menusRef = collection(db, 'menus')
      const q = query(
        menusRef,
        where('weekStart', '==', weekStart),
        orderBy('date', 'asc'),
        orderBy('type', 'asc')
      )
      
      const snapshot = await getDocs(q)
      const menuItems: AdminMenuItem[] = []
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        menuItems.push({
          id: doc.id,
          code: data.code,
          name: data.name,
          description: data.description,
          type: data.type,
          available: data.available !== false,
          active: data.active !== false,
          image: data.image,
          date: data.date,
          dia: data.dia,
          weekStart: data.weekStart,
          createdBy: data.createdBy,
          updatedAt: data.updatedAt?.toDate() || new Date()
        })
      })
      
      return this.buildAdminWeekStructure(weekStart, menuItems)
    } catch (error) {
      console.error('Error fetching admin weekly menu:', error)
      throw new Error('No se pudo cargar el menú administrativo')
    }
  }

  // Crear o actualizar ítem de menú
  static async saveMenuItem(item: Omit<AdminMenuItem, 'id' | 'updatedAt'>, adminId: string): Promise<string> {
    try {
      const menusRef = collection(db, 'menus')
      
      const menuData = {
        ...item,
        createdBy: adminId,
        updatedAt: Timestamp.now(),
        createdAt: Timestamp.now()
      }
      
      const docRef = await addDoc(menusRef, menuData)
      return docRef.id
    } catch (error) {
      console.error('Error saving menu item:', error)
      throw new Error('No se pudo guardar el ítem del menú')
    }
  }

  // Actualizar ítem de menú
  static async updateMenuItem(itemId: string, updates: Partial<AdminMenuItem>): Promise<void> {
    try {
      const itemRef = doc(db, 'menus', itemId)
      
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      }
      
      await updateDoc(itemRef, updateData)
    } catch (error) {
      console.error('Error updating menu item:', error)
      throw new Error('No se pudo actualizar el ítem del menú')
    }
  }

  // Eliminar ítem de menú
  static async deleteMenuItem(itemId: string): Promise<void> {
    try {
      const itemRef = doc(db, 'menus', itemId)
      await deleteDoc(itemRef)
    } catch (error) {
      console.error('Error deleting menu item:', error)
      throw new Error('No se pudo eliminar el ítem del menú')
    }
  }

  // Publicar menú semanal (activar todos los ítems)
  static async publishWeeklyMenu(weekStart: string, adminId: string): Promise<void> {
    try {
      const menusRef = collection(db, 'menus')
      const q = query(
        menusRef,
        where('weekStart', '==', weekStart)
      )
      
      const snapshot = await getDocs(q)
      const batch = writeBatch(db)
      
      snapshot.forEach((doc) => {
        batch.update(doc.ref, {
          active: true,
          available: true,
          publishedBy: adminId,
          publishedAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        })
      })
      
      await batch.commit()
    } catch (error) {
      console.error('Error publishing weekly menu:', error)
      throw new Error('No se pudo publicar el menú semanal')
    }
  }

  // Despublicar menú semanal
  static async unpublishWeeklyMenu(weekStart: string): Promise<void> {
    try {
      const menusRef = collection(db, 'menus')
      const q = query(
        menusRef,
        where('weekStart', '==', weekStart)
      )
      
      const snapshot = await getDocs(q)
      const batch = writeBatch(db)
      
      snapshot.forEach((doc) => {
        batch.update(doc.ref, {
          active: false,
          updatedAt: Timestamp.now()
        })
      })
      
      await batch.commit()
    } catch (error) {
      console.error('Error unpublishing weekly menu:', error)
      throw new Error('No se pudo despublicar el menú semanal')
    }
  }

  // Crear estructura de menú semanal vacía
  static async createEmptyWeekStructure(weekStart: string, adminId: string): Promise<WeeklyMenuStructure> {
    const startDate = new Date(weekStart)
    const days: WeeklyMenuStructure['days'] = {}
    
    // Crear estructura para lunes a viernes
    for (let i = 0; i < 5; i++) {
      const currentDate = addDays(startDate, i)
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      const dayName = format(currentDate, 'EEEE', { locale: es })
      
      days[dateStr] = {
        date: dateStr,
        dia: dayName,
        almuerzos: [],
        colaciones: []
      }
    }
    
    return {
      weekStart,
      weekEnd: format(addDays(startDate, 4), 'yyyy-MM-dd'),
      days,
      isPublished: false,
      createdBy: adminId,
      createdAt: new Date()
    }
  }

  // Construir estructura administrativa de la semana
  private static buildAdminWeekStructure(weekStart: string, items: AdminMenuItem[]): WeeklyMenuStructure {
    const startDate = new Date(weekStart)
    const days: WeeklyMenuStructure['days'] = {}
    
    // Crear estructura para cada día de la semana (lunes a viernes)
    for (let i = 0; i < 5; i++) {
      const currentDate = addDays(startDate, i)
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      const dayName = format(currentDate, 'EEEE', { locale: es })
      
      const dayItems = items.filter(item => item.date === dateStr)
      const almuerzos = dayItems.filter(item => item.type === 'almuerzo')
      const colaciones = dayItems.filter(item => item.type === 'colacion')
      
      days[dateStr] = {
        date: dateStr,
        dia: dayName,
        almuerzos,
        colaciones
      }
    }
    
    const hasPublishedItems = items.some(item => item.active)
    
    return {
      weekStart,
      weekEnd: format(addDays(startDate, 4), 'yyyy-MM-dd'),
      days,
      isPublished: hasPublishedItems,
      createdBy: items[0]?.createdBy || '',
      createdAt: items[0]?.updatedAt || new Date()
    }
  }

  // Obtener semanas disponibles
  static async getAvailableWeeks(): Promise<string[]> {
    try {
      const menusRef = collection(db, 'menus')
      const snapshot = await getDocs(menusRef)
      
      const weeks = new Set<string>()
      snapshot.forEach((doc) => {
        const data = doc.data()
        if (data.weekStart) {
          weeks.add(data.weekStart)
        }
      })
      
      return Array.from(weeks).sort()
    } catch (error) {
      console.error('Error fetching available weeks:', error)
      return []
    }
  }
}