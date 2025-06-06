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
import { format, startOfWeek, addWeeks, subWeeks, parseISO, isValid, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

// In-memory storage for menu items (simulating database)
class MenuStorage {
  private static items: Map<string, AdminMenuItem> = new Map()
  private static nextId = 1

  static addItem(item: Omit<AdminMenuItem, 'id'>): AdminMenuItem {
    const id = `menu_${this.nextId++}_${Date.now()}`
    const newItem: AdminMenuItem = {
      ...item,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.items.set(id, newItem)
    console.log('Item added to storage:', newItem)
    console.log('Total items in storage:', this.items.size)
    return newItem
  }

  static updateItem(id: string, updates: Partial<AdminMenuItem>): boolean {
    const item = this.items.get(id)
    if (!item) return false

    const updatedItem = {
      ...item,
      ...updates,
      updatedAt: new Date()
    }
    this.items.set(id, updatedItem)
    console.log('Item updated in storage:', updatedItem)
    return true
  }

  static deleteItem(id: string): boolean {
    const deleted = this.items.delete(id)
    console.log('Item deleted from storage:', id, 'Success:', deleted)
    console.log('Total items in storage:', this.items.size)
    return deleted
  }

  static getItemsByWeek(weekStart: string): AdminMenuItem[] {
    const weekDate = parseISO(weekStart)
    const weekEnd = addDays(weekDate, 6)
    
    const items = Array.from(this.items.values()).filter(item => {
      const itemDate = parseISO(item.date)
      return itemDate >= weekDate && itemDate <= weekEnd
    })
    
    console.log('Items retrieved for week:', weekStart, items)
    return items
  }

  static getAllItems(): AdminMenuItem[] {
    return Array.from(this.items.values())
  }

  static getItem(id: string): AdminMenuItem | undefined {
    return this.items.get(id)
  }

  static clear(): void {
    this.items.clear()
  }

  static getStats(weekStart: string): any {
    const weekItems = this.getItemsByWeek(weekStart)
    const activeItems = weekItems.filter(item => item.active)
    const almuerzos = weekItems.filter(item => item.type === 'almuerzo')
    const colaciones = weekItems.filter(item => item.type === 'colacion')
    
    // Count days with menus
    const daysWithMenus = new Set(weekItems.map(item => item.date)).size

    return {
      totalItems: weekItems.length,
      activeItems: activeItems.length,
      totalAlmuerzos: almuerzos.length,
      totalColaciones: colaciones.length,
      daysWithMenus
    }
  }
}

export class AdminMenuService {
  // Helper method to create a local date from YYYY-MM-DD string
  static createLocalDate(dateString: string): Date {
    try {
      const [year, month, day] = dateString.split('-').map(Number)
      if (!year || !month || !day) {
        throw new Error('Invalid date format')
      }
      return new Date(year, month - 1, day) // month is 0-indexed
    } catch (error) {
      console.error('Error creating local date:', error)
      throw new Error('Fecha inválida')
    }
  }

  // Obtener el inicio de la semana actual
  static getCurrentWeekStart(): string {
    try {
      const today = new Date()
      const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Lunes como primer día
      return format(weekStart, 'yyyy-MM-dd')
    } catch (error) {
      console.error('Error getting current week start:', error)
      // Fallback to today's date
      return format(new Date(), 'yyyy-MM-dd')
    }
  }

  // Obtener semana siguiente
  static getNextWeek(currentWeek: string): string {
    try {
      if (!currentWeek) {
        return this.getCurrentWeekStart()
      }
      
      const current = parseISO(currentWeek)
      if (!isValid(current)) {
        throw new Error('Fecha inválida')
      }
      const nextWeek = addWeeks(current, 1)
      return format(nextWeek, 'yyyy-MM-dd')
    } catch (error) {
      console.error('Error getting next week:', error)
      return this.getCurrentWeekStart()
    }
  }

  // Obtener semana anterior
  static getPreviousWeek(currentWeek: string): string {
    try {
      if (!currentWeek) {
        return this.getCurrentWeekStart()
      }
      
      const current = parseISO(currentWeek)
      if (!isValid(current)) {
        throw new Error('Fecha inválida')
      }
      const prevWeek = subWeeks(current, 1)
      return format(prevWeek, 'yyyy-MM-dd')
    } catch (error) {
      console.error('Error getting previous week:', error)
      return this.getCurrentWeekStart()
    }
  }

  // Obtener navegación de semanas
  static getWeekNavigation(currentWeek: string): WeekNavigation {
    try {
      if (!currentWeek) {
        const fallbackWeek = this.getCurrentWeekStart()
        return {
          currentWeek: fallbackWeek,
          canGoBack: true,
          canGoForward: true,
          weekLabel: 'Semana actual'
        }
      }

      const current = parseISO(currentWeek)
      if (!isValid(current)) {
        throw new Error('Fecha inválida')
      }

      const today = new Date()
      const minDate = subWeeks(today, 4) // 4 semanas atrás
      const maxDate = addWeeks(today, 8)  // 8 semanas adelante

      const canGoBack = current > minDate
      const canGoForward = current <= maxDate

      const weekLabel = format(current, "'Semana del' d 'de' MMMM yyyy", { locale: es })

      return {
        currentWeek,
        canGoBack,
        canGoForward,
        weekLabel
      }
    } catch (error) {
      console.error('Error getting week navigation:', error)
      // Fallback seguro
      const fallbackWeek = this.getCurrentWeekStart()
      return {
        currentWeek: fallbackWeek,
        canGoBack: true,
        canGoForward: true,
        weekLabel: 'Semana actual'
      }
    }
  }

  // Obtener menú semanal para administración
  static async getWeeklyMenu(weekStart: string): Promise<AdminWeekMenu> {
    try {
      if (!weekStart) {
        weekStart = this.getCurrentWeekStart()
      }

      const current = parseISO(weekStart)
      if (!isValid(current)) {
        throw new Error('Fecha de semana inválida')
      }

      const weekLabel = format(current, "'Semana del' d 'de' MMMM yyyy", { locale: es })
      
      // Obtener items de la semana desde el storage
      const weekItems = MenuStorage.getItemsByWeek(weekStart)
      
      // Generar días de la semana (lunes a viernes)
      const days: AdminDayMenu[] = []
      const dayNames = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes']
      
      for (let i = 0; i < 5; i++) {
        const dayDate = addDays(current, i)
        const dateStr = format(dayDate, 'yyyy-MM-dd')
        const dayName = dayNames[i]
        
        // Filtrar items por fecha específica
        const dayItems = weekItems.filter(item => item.date === dateStr)
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

      const weekEnd = format(addDays(current, 4), 'yyyy-MM-dd')
      const hasPublishedItems = weekItems.some(item => item.active)

      return {
        weekStart,
        weekEnd,
        weekLabel,
        days,
        isPublished: hasPublishedItems,
        totalItems: weekItems.length
      }
    } catch (error) {
      console.error('Error getting weekly menu:', error)
      throw new Error('Error al cargar el menú semanal')
    }
  }

  // Crear ítem de menú
  static async createMenuItem(itemData: Omit<AdminMenuItem, 'id'>): Promise<MenuOperationResult> {
    try {
      // Validar datos
      if (!itemData.code || !itemData.description || !itemData.date) {
        return {
          success: false,
          message: 'Datos incompletos para crear el menú'
        }
      }

      // Validar que no exista un código duplicado para la misma fecha
      const existingItems = MenuStorage.getItemsByWeek(itemData.weekStart)
      const duplicateCode = existingItems.find(item => 
        item.code === itemData.code && item.date === itemData.date
      )

      if (duplicateCode) {
        return {
          success: false,
          message: `Ya existe un menú con el código "${itemData.code}" para este día`
        }
      }

      // Crear el item en el storage
      const newItem = MenuStorage.addItem(itemData)
      
      console.log('Menu item created successfully:', newItem)

      return {
        success: true,
        message: 'Menú creado exitosamente',
        data: newItem
      }
    } catch (error) {
      console.error('Error creating menu item:', error)
      return {
        success: false,
        message: 'Error al crear el menú'
      }
    }
  }

  // Actualizar ítem de menú
  static async updateMenuItem(id: string, updates: Partial<AdminMenuItem>): Promise<MenuOperationResult> {
    try {
      if (!id) {
        return {
          success: false,
          message: 'ID de menú no válido'
        }
      }

      // Verificar que el item existe
      const existingItem = MenuStorage.getItem(id)
      if (!existingItem) {
        return {
          success: false,
          message: 'Menú no encontrado'
        }
      }

      // Si se está actualizando el código, verificar que no exista duplicado
      if (updates.code && updates.code !== existingItem.code) {
        const weekItems = MenuStorage.getItemsByWeek(existingItem.weekStart)
        const duplicateCode = weekItems.find(item => 
          item.id !== id && 
          item.code === updates.code && 
          item.date === existingItem.date
        )

        if (duplicateCode) {
          return {
            success: false,
            message: `Ya existe un menú con el código "${updates.code}" para este día`
          }
        }
      }

      // Actualizar el item
      const success = MenuStorage.updateItem(id, updates)
      
      if (!success) {
        return {
          success: false,
          message: 'Error al actualizar el menú'
        }
      }

      console.log('Menu item updated successfully:', id)

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

  // Eliminar ítem de menú
  static async deleteMenuItem(id: string): Promise<MenuOperationResult> {
    try {
      if (!id) {
        return {
          success: false,
          message: 'ID de menú no válido'
        }
      }

      // Verificar que el item existe
      const existingItem = MenuStorage.getItem(id)
      if (!existingItem) {
        return {
          success: false,
          message: 'Menú no encontrado'
        }
      }

      // Eliminar el item
      const success = MenuStorage.deleteItem(id)
      
      if (!success) {
        return {
          success: false,
          message: 'Error al eliminar el menú'
        }
      }

      console.log('Menu item deleted successfully:', id)

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

  // Duplicar menú semanal
  static async duplicateWeekMenu(sourceWeek: string, targetWeek: string): Promise<MenuOperationResult> {
    try {
      if (!sourceWeek || !targetWeek) {
        return {
          success: false,
          message: 'Fechas de semana no válidas'
        }
      }

      // Validar fechas
      const sourceDate = parseISO(sourceWeek)
      const targetDate = parseISO(targetWeek)
      
      if (!isValid(sourceDate) || !isValid(targetDate)) {
        return {
          success: false,
          message: 'Fechas de semana inválidas'
        }
      }

      // Obtener items de la semana origen
      const sourceItems = MenuStorage.getItemsByWeek(sourceWeek)
      
      if (sourceItems.length === 0) {
        return {
          success: false,
          message: 'No hay menús en la semana origen para duplicar'
        }
      }

      // Duplicar cada item a la semana destino
      let duplicatedCount = 0
      for (const sourceItem of sourceItems) {
        const targetDate = this.getTargetDate(sourceItem.date, sourceWeek, targetWeek)
        
        const duplicatedItem: Omit<AdminMenuItem, 'id'> = {
          ...sourceItem,
          date: targetDate,
          weekStart: targetWeek
        }

        const result = await this.createMenuItem(duplicatedItem)
        if (result.success) {
          duplicatedCount++
        }
      }

      console.log('Week menu duplicated:', sourceWeek, 'to', targetWeek, 'Items:', duplicatedCount)
      
      return {
        success: true,
        message: `Menú semanal duplicado exitosamente (${duplicatedCount} items)`
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
      if (!weekStart) {
        return {
          success: false,
          message: 'Fecha de semana no válida'
        }
      }

      // Validar fecha
      const weekDate = parseISO(weekStart)
      if (!isValid(weekDate)) {
        return {
          success: false,
          message: 'Fecha de semana inválida'
        }
      }

      // Obtener items de la semana
      const weekItems = MenuStorage.getItemsByWeek(weekStart)
      
      if (weekItems.length === 0) {
        return {
          success: false,
          message: 'No hay menús en esta semana para publicar'
        }
      }

      // Actualizar el estado activo de todos los items
      let updatedCount = 0
      for (const item of weekItems) {
        if (item.id) {
          const success = MenuStorage.updateItem(item.id, { active: publish })
          if (success) {
            updatedCount++
          }
        }
      }

      console.log('Week menu publication toggled:', weekStart, publish, 'Items updated:', updatedCount)
      
      return {
        success: true,
        message: publish 
          ? `Menú publicado exitosamente (${updatedCount} items)` 
          : `Menú despublicado exitosamente (${updatedCount} items)`
      }
    } catch (error) {
      console.error('Error toggling week menu publication:', error)
      return {
        success: false,
        message: 'Error al cambiar el estado de publicación'
      }
    }
  }

  // Eliminar menú semanal completo
  static async deleteWeekMenu(weekStart: string): Promise<MenuOperationResult> {
    try {
      if (!weekStart) {
        return {
          success: false,
          message: 'Fecha de semana no válida'
        }
      }

      // Validar fecha
      const weekDate = parseISO(weekStart)
      if (!isValid(weekDate)) {
        return {
          success: false,
          message: 'Fecha de semana inválida'
        }
      }

      // Obtener items de la semana
      const weekItems = MenuStorage.getItemsByWeek(weekStart)
      
      if (weekItems.length === 0) {
        return {
          success: false,
          message: 'No hay menús en esta semana para eliminar'
        }
      }

      // Eliminar todos los items de la semana
      let deletedCount = 0
      for (const item of weekItems) {
        if (item.id) {
          const success = MenuStorage.deleteItem(item.id)
          if (success) {
            deletedCount++
          }
        }
      }

      console.log('Week menu deleted:', weekStart, 'Items deleted:', deletedCount)
      
      return {
        success: true,
        message: `Menú semanal eliminado exitosamente (${deletedCount} items)`
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
  static async getWeekStats(weekStart: string): Promise<any> {
    try {
      if (!weekStart) {
        weekStart = this.getCurrentWeekStart()
      }

      // Validar fecha
      const weekDate = parseISO(weekStart)
      if (!isValid(weekDate)) {
        throw new Error('Fecha de semana inválida')
      }

      // Obtener estadísticas del storage
      const stats = MenuStorage.getStats(weekStart)
      console.log('Week stats:', weekStart, stats)
      
      return stats
    } catch (error) {
      console.error('Error getting week stats:', error)
      // Retornar estadísticas por defecto en caso de error
      return {
        totalItems: 0,
        activeItems: 0,
        totalAlmuerzos: 0,
        totalColaciones: 0,
        daysWithMenus: 0
      }
    }
  }

  // Construir estructura de la semana
  private static buildWeekStructure(weekStart: string, items: AdminMenuItem[]): AdminWeekMenu {
    try {
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
    } catch (error) {
      console.error('Error building week structure:', error)
      return this.createEmptyWeekStructure(weekStart)
    }
  }

  // Crear estructura de semana vacía
  private static createEmptyWeekStructure(weekStart: string): AdminWeekMenu {
    try {
      return this.buildWeekStructure(weekStart, [])
    } catch (error) {
      console.error('Error creating empty week structure:', error)
      // Fallback extremo
      const currentWeek = this.getCurrentWeekStart()
      return {
        weekStart: currentWeek,
        weekEnd: currentWeek,
        weekLabel: 'Semana actual',
        days: [],
        isPublished: false,
        totalItems: 0
      }
    }
  }

  // Obtener fecha objetivo para duplicación
  private static getTargetDate(sourceDate: string, sourceWeek: string, targetWeek: string): string {
    try {
      const sourceDateObj = parseISO(sourceDate)
      const sourceWeekObj = parseISO(sourceWeek)
      const targetWeekObj = parseISO(targetWeek)
      
      const dayOffset = Math.floor((sourceDateObj.getTime() - sourceWeekObj.getTime()) / (1000 * 60 * 60 * 24))
      const targetDate = addDays(targetWeekObj, dayOffset)
      
      return format(targetDate, 'yyyy-MM-dd')
    } catch (error) {
      console.error('Error getting target date:', error)
      return targetWeek
    }
  }

  // Obtener semanas disponibles
  static async getAvailableWeeks(): Promise<string[]> {
    try {
      // Simular semanas disponibles
      const weeks: string[] = []
      const currentWeek = this.getCurrentWeekStart()
      const currentDate = parseISO(currentWeek)
      
      // Generar 12 semanas (4 atrás, actual, 7 adelante)
      for (let i = -4; i <= 7; i++) {
        const weekDate = addWeeks(currentDate, i)
        weeks.push(format(weekDate, 'yyyy-MM-dd'))
      }
      
      return weeks.sort()
    } catch (error) {
      console.error('Error fetching available weeks:', error)
      return [this.getCurrentWeekStart()]
    }
  }
}