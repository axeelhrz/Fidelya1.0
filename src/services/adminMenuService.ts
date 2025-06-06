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
import { AdminMenuItem, AdminWeekMenu, AdminDayMenu, WeekNavigation, MenuOperationResult } from '@/types/adminMenu'
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns'
import { es } from 'date-fns/locale'

export class AdminMenuService {
  // Obtener el inicio de la semana actual
  static getCurrentWeekStart(): string {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    return format(weekStart, 'yyyy-MM-dd')
  }

  // Obtener semana siguiente
  static getNextWeek(currentWeek: string): string {
    const current = new Date(currentWeek)
    const nextWeek = addWeeks(current, 1)
    return format(nextWeek, 'yyyy-MM-dd')
  }

  // Obtener semana anterior
  static getPreviousWeek(currentWeek: string): string {
    const current = new Date(currentWeek)
    const prevWeek = subWeeks(current, 1)
    return format(prevWeek, 'yyyy-MM-dd')
  }

  // Obtener navegación de semanas
  static getWeekNavigation(currentWeek: string): WeekNavigation {
    const current = new Date(currentWeek)
    const today = new Date()
    
    // Permitir navegar hacia atrás hasta 4 semanas
    const minDate = subWeeks(today, 4)
    const canGoBack = current > minDate
    
    // Permitir navegar hacia adelante hasta 8 semanas
    const maxDate = addWeeks(today, 8)
    const canGoForward = current < maxDate
    
    const weekLabel = format(current, "'Semana del' d 'de' MMMM", { locale: es })
    
    return {
      currentWeek,
      canGoBack,
      canGoForward,
      weekLabel
    }
  }

  // Obtener menú semanal para administración
  static async getWeeklyMenu(weekStart: string): Promise<AdminWeekMenu> {
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
          description: data.description,
          type: data.type,
          date: data.date,
          day: data.day,
          weekStart: data.weekStart,
          active: data.active !== false,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        })
      })
      
      return this.buildWeekStructure(weekStart, menuItems)
    } catch (error) {
      console.error('Error fetching weekly menu:', error)
      // Retornar estructura vacía en caso de error
      return this.createEmptyWeekStructure(weekStart)
    }
  }

  // Crear ítem de menú
  static async createMenuItem(itemData: Omit<AdminMenuItem, 'id'>): Promise<MenuOperationResult> {
    try {
      const menusRef = collection(db, 'menus')
      
      const menuData = {
        ...itemData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
      
      const docRef = await addDoc(menusRef, menuData)
      
      return {
        success: true,
        message: 'Ítem de menú creado exitosamente',
        data: { id: docRef.id }
      }
    } catch (error) {
      console.error('Error creating menu item:', error)
      return {
        success: false,
        message: 'Error al crear el ítem del menú'
      }
    }
  }

  // Actualizar ítem de menú
  static async updateMenuItem(itemId: string, updates: Partial<AdminMenuItem>): Promise<MenuOperationResult> {
    try {
      const itemRef = doc(db, 'menus', itemId)
      
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      }
      
      await updateDoc(itemRef, updateData)
      
      return {
        success: true,
        message: 'Ítem de menú actualizado exitosamente'
      }
    } catch (error) {
      console.error('Error updating menu item:', error)
      return {
        success: false,
        message: 'Error al actualizar el ítem del menú'
      }
    }
  }

  // Eliminar ítem de menú
  static async deleteMenuItem(itemId: string): Promise<MenuOperationResult> {
    try {
      const itemRef = doc(db, 'menus', itemId)
      await deleteDoc(itemRef)
      
      return {
        success: true,
        message: 'Ítem de menú eliminado exitosamente'
      }
    } catch (error) {
      console.error('Error deleting menu item:', error)
      return {
        success: false,
        message: 'Error al eliminar el ítem del menú'
      }
    }
  }

  // Duplicar menú semanal
  static async duplicateWeekMenu(sourceWeek: string, targetWeek: string): Promise<MenuOperationResult> {
    try {
      // Obtener menú de la semana origen
      const sourceMenu = await this.getWeeklyMenu(sourceWeek)
      
      if (sourceMenu.totalItems === 0) {
        return {
          success: false,
          message: 'No hay menús para duplicar en la semana origen'
        }
      }

      // Verificar si ya existe menú en la semana destino
      const targetMenu = await this.getWeeklyMenu(targetWeek)
      if (targetMenu.totalItems > 0) {
        return {
          success: false,
          message: 'Ya existe un menú en la semana destino'
        }
      }

      const batch = writeBatch(db)
      const menusRef = collection(db, 'menus')

      // Crear nuevos ítems para la semana destino
      sourceMenu.days.forEach(day => {
        const targetDate = this.getTargetDate(day.date, sourceWeek, targetWeek)
        const targetDayName = format(new Date(targetDate), 'EEEE', { locale: es })

        // Combinar almuerzos y colaciones
        const allItems = [...day.almuerzos, ...day.colaciones]
        
        allItems.forEach(item => {
          const newItemRef = doc(menusRef)
          const newItemData = {
            code: item.code,
            description: item.description,
            type: item.type,
            date: targetDate,
            day: targetDayName,
            weekStart: targetWeek,
            active: false, // Los ítems duplicados empiezan inactivos
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          }
          
          batch.set(newItemRef, newItemData)
        })
      })

      await batch.commit()

      return {
        success: true,
        message: `Menú duplicado exitosamente a la semana del ${format(new Date(targetWeek), 'd \'de\' MMMM', { locale: es })}`
      }
    } catch (error) {
      console.error('Error duplicating week menu:', error)
      return {
        success: false,
        message: 'Error al duplicar el menú semanal'
      }
    }
  }

  // Construir estructura de la semana
  private static buildWeekStructure(weekStart: string, items: AdminMenuItem[]): AdminWeekMenu {
    const startDate = new Date(weekStart)
    const days: AdminDayMenu[] = []
    
    // Crear estructura para cada día de la semana (lunes a viernes)
    for (let i = 0; i < 5; i++) {
      const currentDate = addDays(startDate, i)
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      const dayName = format(currentDate, 'EEEE', { locale: es })
      const dayShort = format(currentDate, 'EEE', { locale: es })
      
      const dayItems = items.filter(item => item.date === dateStr)
      const almuerzos = dayItems.filter(item => item.type === 'almuerzo')
      const colaciones = dayItems.filter(item => item.type === 'colacion')
      
      days.push({
        date: dateStr,
        day: dayShort,
        dayName,
        almuerzos,
        colaciones,
        isEditable: true
      })
    }
    
    const hasPublishedItems = items.some(item => item.active)
    const totalItems = items.length
    
    return {
      weekStart,
      weekEnd: format(addDays(startDate, 4), 'yyyy-MM-dd'),
      weekLabel: format(startDate, "'Semana del' d 'de' MMMM", { locale: es }),
      days,
      isPublished: hasPublishedItems,
      totalItems
    }
  }

  // Crear estructura de semana vacía
  private static createEmptyWeekStructure(weekStart: string): AdminWeekMenu {
    return this.buildWeekStructure(weekStart, [])
  }

  // Obtener fecha objetivo para duplicación
  private static getTargetDate(sourceDate: string, sourceWeek: string, targetWeek: string): string {
    const sourceDateObj = new Date(sourceDate)
    const sourceWeekObj = new Date(sourceWeek)
    const targetWeekObj = new Date(targetWeek)
    
    const dayOffset = Math.floor((sourceDateObj.getTime() - sourceWeekObj.getTime()) / (1000 * 60 * 60 * 24))
    const targetDate = addDays(targetWeekObj, dayOffset)
    
    return format(targetDate, 'yyyy-MM-dd')
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