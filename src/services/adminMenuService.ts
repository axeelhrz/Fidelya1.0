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
import { format, startOfWeek, addWeeks, subWeeks, parseISO, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

export class AdminMenuService {
  // Helper method to create a local date from YYYY-MM-DD string
  static createLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day) // month is 0-indexed
  }

  // Obtener el inicio de la semana actual
  static getCurrentWeekStart(): string {
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Lunes como primer día
    return format(weekStart, 'yyyy-MM-dd')
  }

  // Obtener semana siguiente
  static getNextWeek(currentWeek: string): string {
    try {
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
      return {
        currentWeek,
        canGoBack: true,
        canGoForward: true,
        weekLabel: 'Semana actual'
      }
    }
  }

  // Obtener menú semanal para administración
  static async getWeeklyMenu(weekStart: string): Promise<AdminWeekMenu> {
    try {
      // Simular datos para desarrollo
      const current = parseISO(weekStart)
      if (!isValid(current)) {
        throw new Error('Fecha de semana inválida')
      }

      const weekLabel = format(current, "'Semana del' d 'de' MMMM yyyy", { locale: es })
      
      // Generar días de la semana
      const days = []
      for (let i = 0; i < 5; i++) { // Solo días laborales
        const dayDate = addWeeks(current, 0)
        dayDate.setDate(dayDate.getDate() + i)
        
        days.push({
          date: format(dayDate, 'yyyy-MM-dd'),
          day: format(dayDate, 'EEEE', { locale: es }),
          dayName: format(dayDate, 'EEEE', { locale: es }),
          almuerzos: [],
          colaciones: [],
          isEditable: true
        })
      }

      return {
        weekStart,
        weekEnd: format(addWeeks(current, 1), 'yyyy-MM-dd'),
        weekLabel,
        days,
        isPublished: false,
        totalItems: 0
      }
    } catch (error) {
      console.error('Error getting weekly menu:', error)
      throw new Error('Error al cargar el menú semanal')
    }
  }

  // Crear ítem de menú
  static async createMenuItem(itemData: Omit<AdminMenuItem, 'id'>): Promise<MenuOperationResult> {
    try {
      // Simular creación
      console.log('Creating menu item:', itemData)
      return {
        success: true,
        message: 'Menú creado exitosamente'
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
      // Simular actualización
      console.log('Updating menu item:', id, updates)
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
      // Simular eliminación
      console.log('Deleting menu item:', id)
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
      // Simular duplicación
      console.log('Duplicating week menu:', sourceWeek, 'to', targetWeek)
      return {
        success: true,
        message: 'Menú semanal duplicado exitosamente'
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
      // Simular cambio de publicación
      console.log('Toggling week menu publication:', weekStart, publish)
      return {
        success: true,
        message: publish ? 'Menú publicado exitosamente' : 'Menú despublicado exitosamente'
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
      // Simular eliminación
      console.log('Deleting week menu:', weekStart)
      return {
        success: true,
        message: 'Menú semanal eliminado exitosamente'
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
      // Simular estadísticas
      return {
        totalItems: 0,
        activeItems: 0,
        totalAlmuerzos: 0,
        totalColaciones: 0,
        daysWithMenus: 0
      }
    } catch (error) {
      console.error('Error getting week stats:', error)
      throw new Error('Error al cargar las estadísticas')
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