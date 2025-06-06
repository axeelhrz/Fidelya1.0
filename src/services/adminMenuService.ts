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
  writeBatch,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { AdminMenuItem, AdminWeekMenu, AdminDayMenu, MenuOperationResult } from '@/types/adminMenu'
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, isValid, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export class AdminMenuService {
  private static readonly COLLECTION_NAME = 'menus'
  private static readonly MAX_WEEKS_AHEAD = 4
  private static readonly MAX_WEEKS_BACK = 2

  static async getWeeklyMenu(weekStart: string): Promise<AdminWeekMenu> {
    try {
      const menusRef = collection(db, this.COLLECTION_NAME)
      const q = query(
        menusRef,
        where('weekStart', '==', weekStart),
        orderBy('date', 'asc')
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

      return this.buildWeekMenuStructure(weekStart, menuItems)
    } catch (error) {
      console.error('Error fetching weekly menu:', error)
      throw new Error('No se pudo cargar el menú de la semana')
    }
  }

  static async createMenuItem(item: Omit<AdminMenuItem, 'id'>): Promise<MenuOperationResult> {
    try {
      // Validar que no exista un item con el mismo código en el mismo día y tipo
      const existingItem = await this.getItemByCodeAndDate(item.code, item.date, item.type)
      if (existingItem) {
        return {
          success: false,
          message: `Ya existe un ${item.type} con el código ${item.code} para este día`,
          errors: [{ field: 'code', message: 'Código duplicado' }]
        }
      }

      const menusRef = collection(db, this.COLLECTION_NAME)
      const docRef = await addDoc(menusRef, {
        ...item,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })

      return {
        success: true,
        message: 'Menú creado exitosamente',
        data: { id: docRef.id }
      }
    } catch (error) {
      console.error('Error creating menu item:', error)
      return {
        success: false,
        message: 'Error al crear el menú'
      }
    }
  }

  static async updateMenuItem(id: string, updates: Partial<AdminMenuItem>): Promise<MenuOperationResult> {
    try {
      const menuRef = doc(db, this.COLLECTION_NAME, id)
      await updateDoc(menuRef, {
        ...updates,
        updatedAt: Timestamp.now()
      })

      return {
        success: true,
        message: 'Menú actualizado exitosamente'
      }
    } catch (error) {
      console.error('Error updating menu item:', error)
      return {
        success: false,
        message: 'Error al actualizar el menú'
      }
    }
  }

  static async deleteMenuItem(id: string): Promise<MenuOperationResult> {
    try {
      const menuRef = doc(db, this.COLLECTION_NAME, id)
      await deleteDoc(menuRef)

      return {
        success: true,
        message: 'Menú eliminado exitosamente'
      }
    } catch (error) {
      console.error('Error deleting menu item:', error)
      return {
        success: false,
        message: 'Error al eliminar el menú'
      }
    }
  }

  static async duplicateWeekMenu(sourceWeek: string, targetWeek: string): Promise<MenuOperationResult> {
    try {
      const sourceMenu = await this.getWeeklyMenu(sourceWeek)
      const batch = writeBatch(db)
      const menusRef = collection(db, this.COLLECTION_NAME)

      // Validar fechas
      const sourceDate = this.parseWeekDate(sourceWeek)
      const targetDate = this.parseWeekDate(targetWeek)
      
      if (!sourceDate || !targetDate) {
        return {
          success: false,
          message: 'Fechas de semana inválidas'
        }
      }

      // Calcular las nuevas fechas
      const daysDiff = Math.floor((targetDate.getTime() - sourceDate.getTime()) / (1000 * 60 * 60 * 24))

      let itemsCreated = 0

      for (const day of sourceMenu.days) {
        const dayDate = this.parseWeekDate(day.date)
        if (!dayDate) continue

        const newDate = format(addDays(dayDate, daysDiff), 'yyyy-MM-dd')
        const newDay = format(addDays(dayDate, daysDiff), 'EEEE', { locale: es })

        // Duplicar almuerzos
        for (const almuerzo of day.almuerzos) {
          const newDocRef = doc(menusRef)
          batch.set(newDocRef, {
            code: almuerzo.code,
            description: almuerzo.description,
            type: 'almuerzo',
            date: newDate,
            day: newDay,
            weekStart: targetWeek,
            active: almuerzo.active,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          })
          itemsCreated++
        }

        // Duplicar colaciones
        for (const colacion of day.colaciones) {
          const newDocRef = doc(menusRef)
          batch.set(newDocRef, {
            code: colacion.code,
            description: colacion.description,
            type: 'colacion',
            date: newDate,
            day: newDay,
            weekStart: targetWeek,
            active: colacion.active,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          })
          itemsCreated++
        }
      }

      await batch.commit()

      return {
        success: true,
        message: `Menú duplicado exitosamente. ${itemsCreated} elementos creados.`,
        data: { itemsCreated }
      }
    } catch (error) {
      console.error('Error duplicating week menu:', error)
      return {
        success: false,
        message: 'Error al duplicar el menú semanal'
      }
    }
  }

  static getWeekNavigation(currentWeek: string) {
    try {
      const current = this.parseWeekDate(currentWeek)
      if (!current) {
        throw new Error('Fecha de semana inválida')
      }

      const now = new Date()
      const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 })
      
      const maxFutureWeek = addWeeks(currentWeekStart, this.MAX_WEEKS_AHEAD)
      const maxPastWeek = subWeeks(currentWeekStart, this.MAX_WEEKS_BACK)
      
      const canGoBack = current > maxPastWeek
      const canGoForward = current < maxFutureWeek
      
      const weekEnd = endOfWeek(current, { weekStartsOn: 1 })
      const weekLabel = `Del ${format(current, 'd')} al ${format(weekEnd, 'd')} de ${format(weekEnd, 'MMMM yyyy', { locale: es })}`
      
      return {
        currentWeek,
        canGoBack,
        canGoForward,
        weekLabel
      }
    } catch (error) {
      console.error('Error in getWeekNavigation:', error)
      // Fallback a la semana actual si hay error
      const fallbackWeek = this.getCurrentWeekStart()
      const fallbackDate = this.parseWeekDate(fallbackWeek)!
      const fallbackEnd = endOfWeek(fallbackDate, { weekStartsOn: 1 })
      
      return {
        currentWeek: fallbackWeek,
        canGoBack: true,
        canGoForward: true,
        weekLabel: `Del ${format(fallbackDate, 'd')} al ${format(fallbackEnd, 'd')} de ${format(fallbackEnd, 'MMMM yyyy', { locale: es })}`
      }
    }
  }

  static getCurrentWeekStart(): string {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    return format(weekStart, 'yyyy-MM-dd')
  }

  static getNextWeek(currentWeek: string): string {
    const current = this.parseWeekDate(currentWeek)
    if (!current) {
      return this.getCurrentWeekStart()
    }
    const nextWeek = addWeeks(current, 1)
    return format(nextWeek, 'yyyy-MM-dd')
  }

  static getPreviousWeek(currentWeek: string): string {
    const current = this.parseWeekDate(currentWeek)
    if (!current) {
      return this.getCurrentWeekStart()
    }
    const prevWeek = subWeeks(current, 1)
    return format(prevWeek, 'yyyy-MM-dd')
  }

  private static parseWeekDate(dateString: string): Date | null {
    try {
      // Intentar parsear como ISO string primero
      let date = parseISO(dateString)
      
      // Si no es válida, intentar crear directamente
      if (!isValid(date)) {
        date = new Date(dateString)
      }
      
      // Verificar que la fecha sea válida
      if (!isValid(date)) {
        console.error('Invalid date string:', dateString)
        return null
      }
      
      return date
    } catch (error) {
      console.error('Error parsing date:', dateString, error)
      return null
    }
  }

  private static async getItemByCodeAndDate(code: string, date: string, type: string): Promise<AdminMenuItem | null> {
    try {
      const menusRef = collection(db, this.COLLECTION_NAME)
      const q = query(
        menusRef,
        where('code', '==', code),
        where('date', '==', date),
        where('type', '==', type)
      )
      
      const snapshot = await getDocs(q)
      if (snapshot.empty) return null
      
      const doc = snapshot.docs[0]
      const data = doc.data()
      
      return {
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
      }
    } catch (error) {
      console.error('Error checking existing item:', error)
      return null
    }
  }

  private static buildWeekMenuStructure(weekStart: string, items: AdminMenuItem[]): AdminWeekMenu {
    const startDate = this.parseWeekDate(weekStart)
    if (!startDate) {
      throw new Error('Fecha de inicio de semana inválida')
    }

    const endDate = endOfWeek(startDate, { weekStartsOn: 1 })
    const weekLabel = `Del ${format(startDate, 'd')} al ${format(endDate, 'd')} de ${format(endDate, 'MMMM yyyy', { locale: es })}`
    
    const days: AdminDayMenu[] = []
    
    // Crear estructura para cada día de la semana (lunes a viernes)
    for (let i = 0; i < 5; i++) {
      const currentDate = addDays(startDate, i)
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      const dayName = format(currentDate, 'EEEE d', { locale: es })
      const dayKey = format(currentDate, 'EEEE', { locale: es })
      
      const dayItems = items.filter(item => item.date === dateStr)
      const almuerzos = dayItems.filter(item => item.type === 'almuerzo')
      const colaciones = dayItems.filter(item => item.type === 'colacion')
      
      days.push({
        date: dateStr,
        day: dayKey,
        dayName,
        almuerzos,
        colaciones,
        isEditable: true
      })
    }
    
    return {
      weekStart,
      weekEnd: format(endDate, 'yyyy-MM-dd'),
      weekLabel,
      days,
      isPublished: false, // TODO: Implementar lógica de publicación
      totalItems: items.length
    }
  }

  static validateMenuItem(item: Partial<AdminMenuItem>): MenuOperationResult {
    const errors: Array<{ field: string; message: string }> = []

    if (!item.code || item.code.trim().length === 0) {
      errors.push({ field: 'code', message: 'El código es obligatorio' })
    } else if (item.code.length > 10) {
      errors.push({ field: 'code', message: 'El código no puede tener más de 10 caracteres' })
    }

    if (!item.description || item.description.trim().length === 0) {
      errors.push({ field: 'description', message: 'La descripción es obligatoria' })
    } else if (item.description.length > 200) {
      errors.push({ field: 'description', message: 'La descripción no puede tener más de 200 caracteres' })
    }

    if (!item.type || !['almuerzo', 'colacion'].includes(item.type)) {
      errors.push({ field: 'type', message: 'El tipo debe ser almuerzo o colación' })
    }

    return {
      success: errors.length === 0,
      message: errors.length === 0 ? 'Validación exitosa' : 'Errores de validación',
      errors
    }
  }
}