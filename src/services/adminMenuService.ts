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
  writeBatch,
  getDoc
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { AdminMenuItem, AdminWeekMenu, AdminDayMenu, WeekNavigation, MenuOperationResult } from '@/types/adminMenu'
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns'
import { es } from 'date-fns/locale'

export class AdminMenuService {
  // Helper method to create a local date from YYYY-MM-DD string
  static createLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day) // month is 0-indexed
  }

  // Obtener el inicio de la semana actual
  static getCurrentWeekStart(): string {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    return format(weekStart, 'yyyy-MM-dd')
  }

  // Obtener semana siguiente
  static getNextWeek(currentWeek: string): string {
    const current = this.createLocalDate(currentWeek)
    const nextWeek = addWeeks(current, 1)
    return format(nextWeek, 'yyyy-MM-dd')
  }

  // Obtener semana anterior
  static getPreviousWeek(currentWeek: string): string {
    const current = this.createLocalDate(currentWeek)
    const prevWeek = subWeeks(current, 1)
    return format(prevWeek, 'yyyy-MM-dd')
  }

  // Obtener navegación de semanas
  static getWeekNavigation(currentWeek: string): WeekNavigation {
    const current = this.createLocalDate(currentWeek)
    const today = new Date()
    
    // Permitir navegar hacia atrás hasta 8 semanas
    const minDate = subWeeks(today, 8)
    const canGoBack = current >= minDate
    
    // Permitir navegar hacia adelante hasta 12 semanas
    const maxDate = addWeeks(today, 12)
    const canGoForward = current <= maxDate
    
    const weekLabel = format(current, "'Semana del' d 'de' MMMM yyyy", { locale: es })
    
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
        orderBy('type', 'asc'),
        orderBy('code', 'asc')
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
      // Validar que no exista el código para esa fecha
      const existingQuery = query(
        collection(db, 'menus'),
        where('date', '==', itemData.date),
        where('code', '==', itemData.code)
      )
      
      const existingSnapshot = await getDocs(existingQuery)
      if (!existingSnapshot.empty) {
        return {
          success: false,
          message: 'Ya existe un menú con ese código para esta fecha',
          errors: [{ field: 'code', message: 'Código duplicado para esta fecha' }]
        }
      }

      const menusRef = collection(db, 'menus')
      
      const menuData = {
        ...itemData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
      
      const docRef = await addDoc(menusRef, menuData)
      
      // Actualizar estadísticas de la semana
      await this.updateWeekStats(itemData.weekStart)
      
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
      // Si se está actualizando el código, validar que no exista
      if (updates.code) {
        const itemRef = doc(db, 'menus', itemId)
        const itemDoc = await getDoc(itemRef)
        
        if (itemDoc.exists()) {
          const currentData = itemDoc.data()
          
          // Solo validar si el código cambió
          if (currentData.code !== updates.code) {
            const existingQuery = query(
              collection(db, 'menus'),
              where('date', '==', currentData.date),
              where('code', '==', updates.code)
            )
            
            const existingSnapshot = await getDocs(existingQuery)
            if (!existingSnapshot.empty) {
              return {
                success: false,
                message: 'Ya existe un menú con ese código para esta fecha',
                errors: [{ field: 'code', message: 'Código duplicado para esta fecha' }]
              }
            }
          }
        }
      }

      const itemRef = doc(db, 'menus', itemId)
      
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      }
      
      await updateDoc(itemRef, updateData)
      
      // Obtener datos actualizados para actualizar estadísticas
      const updatedDoc = await getDoc(itemRef)
      if (updatedDoc.exists()) {
        const data = updatedDoc.data()
        await this.updateWeekStats(data.weekStart)
      }
      
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
      
      // Obtener datos antes de eliminar para actualizar estadísticas
      const itemDoc = await getDoc(itemRef)
      let weekStart = ''
      if (itemDoc.exists()) {
        weekStart = itemDoc.data().weekStart
      }
      
      await deleteDoc(itemRef)
      
      // Actualizar estadísticas de la semana
      if (weekStart) {
        await this.updateWeekStats(weekStart)
      }
      
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
          message: 'Ya existe un menú en la semana destino. Elimínalo primero si deseas reemplazarlo.'
        }
      }

      const batch = writeBatch(db)
      const menusRef = collection(db, 'menus')
      let itemsCreated = 0

      // Crear nuevos ítems para la semana destino
      sourceMenu.days.forEach(day => {
        const targetDate = this.getTargetDate(day.date, sourceWeek, targetWeek)
        const targetDayName = format(this.createLocalDate(targetDate), 'EEEE', { locale: es })

        [...day.almuerzos, ...day.colaciones].forEach(item => {
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
          itemsCreated++
        })
      })

      await batch.commit()

      // Actualizar estadísticas de la semana destino
      await this.updateWeekStats(targetWeek)

      return {
        success: true,
        message: `Menú duplicado exitosamente. Se crearon ${itemsCreated} ítems para la semana del ${format(this.createLocalDate(targetWeek), 'd \'de\' MMMM', { locale: es })}`
      }
    } catch (error) {
      console.error('Error duplicating week menu:', error)
      return {
        success: false,
        message: 'Error al duplicar el menú semanal'
      }
    }
  }

  // Publicar/despublicar menú semanal
  static async toggleWeekMenuPublication(weekStart: string, publish: boolean): Promise<MenuOperationResult> {
    try {
      const menusRef = collection(db, 'menus')
      const q = query(
        menusRef,
        where('weekStart', '==', weekStart)
      )
      
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        return {
          success: false,
          message: 'No hay menús para esta semana'
        }
      }

      const batch = writeBatch(db)
      
      snapshot.forEach((doc) => {
        batch.update(doc.ref, {
          active: publish,
          [publish ? 'publishedAt' : 'unpublishedAt']: Timestamp.now(),
          updatedAt: Timestamp.now()
        })
      })
      
      await batch.commit()
      
      // Actualizar estadísticas
      await this.updateWeekStats(weekStart)

      return {
        success: true,
        message: publish ? 'Menú semanal publicado exitosamente' : 'Menú semanal despublicado exitosamente'
      }
    } catch (error) {
      console.error('Error toggling week menu publication:', error)
      return {
        success: false,
        message: 'Error al cambiar el estado de publicación del menú'
      }
    }
  }

  // Eliminar menú semanal completo
  static async deleteWeekMenu(weekStart: string): Promise<MenuOperationResult> {
    try {
      const menusRef = collection(db, 'menus')
      const q = query(
        menusRef,
        where('weekStart', '==', weekStart)
      )
      
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        return {
          success: false,
          message: 'No hay menús para eliminar en esta semana'
        }
      }

      const batch = writeBatch(db)
      let itemsDeleted = 0
      
      snapshot.forEach((doc) => {
        batch.delete(doc.ref)
        itemsDeleted++
      })
      
      await batch.commit()

      return {
        success: true,
        message: `Se eliminaron ${itemsDeleted} ítems del menú semanal`
      }
    } catch (error) {
      console.error('Error deleting week menu:', error)
      return {
        success: false,
        message: 'Error al eliminar el menú semanal'
      }
    }
  }

  // Obtener estadísticas de la semana
  static async getWeekStats(weekStart: string): Promise<{
    totalItems: number
    activeItems: number
    inactiveItems: number
    totalAlmuerzos: number
    totalColaciones: number
    daysWithMenus: number
  }> {
    try {
      const menu = await this.getWeeklyMenu(weekStart)
      
      let totalItems = 0
      let activeItems = 0
      let totalAlmuerzos = 0
      let totalColaciones = 0
      let daysWithMenus = 0

      menu.days.forEach(day => {
        const dayItems = [...day.almuerzos, ...day.colaciones]
        if (dayItems.length > 0) {
          daysWithMenus++
        }
        
        dayItems.forEach(item => {
          totalItems++
          if (item.active) activeItems++
          if (item.type === 'almuerzo') totalAlmuerzos++
          else totalColaciones++
        })
      })

      return {
        totalItems,
        activeItems,
        inactiveItems: totalItems - activeItems,
        totalAlmuerzos,
        totalColaciones,
        daysWithMenus
      }
    } catch (error) {
      console.error('Error getting week stats:', error)
      return {
        totalItems: 0,
        activeItems: 0,
        inactiveItems: 0,
        totalAlmuerzos: 0,
        totalColaciones: 0,
        daysWithMenus: 0
      }
    }
  }

  // Actualizar estadísticas de la semana (método privado)
  private static async updateWeekStats(weekStart: string): Promise<void> {
    try {
      // Aquí podrías actualizar una colección de estadísticas si la tienes
      // Por ahora, las estadísticas se calculan en tiempo real
      console.log(`Stats updated for week ${weekStart}`)
    } catch (error) {
      console.error('Error updating week stats:', error)
    }
  }

  // Construir estructura de la semana
  private static buildWeekStructure(weekStart: string, items: AdminMenuItem[]): AdminWeekMenu {
    const startDate = this.createLocalDate(weekStart)
    const days: AdminDayMenu[] = []
    
    // Crear estructura para cada día de la semana (lunes a viernes)
    const dayNames = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes']
    
    for (let i = 0; i < 5; i++) {
      const currentDate = addDays(startDate, i)
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      const dayName = dayNames[i]
      
      // Filtrar items por fecha específica
      const dayItems = items.filter(item => item.date === dateStr)
      
      const almuerzos = dayItems.filter(item => item.type === 'almuerzo')
      const colaciones = dayItems.filter(item => item.type === 'colacion')
      
      days.push({
        date: dateStr,
        day: dayName,
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
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
      weekLabel: format(startDate, "'Semana del' d 'de' MMMM yyyy", { locale: es }),
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
    const sourceDateObj = this.createLocalDate(sourceDate)
    const sourceWeekObj = this.createLocalDate(sourceWeek)
    const targetWeekObj = this.createLocalDate(targetWeek)
    
    const dayOffset = Math.floor((sourceDateObj.getTime() - sourceWeekObj.getTime()) / (1000 * 60 * 60 * 24))
    const targetDate = addDays(targetWeekObj, dayOffset)
    
    return format(targetDate, 'yyyy-MM-dd')
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