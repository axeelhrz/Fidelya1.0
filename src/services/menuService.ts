import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { MenuItem, PRICES, UserType } from '@/types/panel'
import { DayMenuDisplay, WeekMenuDisplay } from '@/types/menu'
import { format, startOfWeek, endOfWeek, addDays, parseISO, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

export interface WeekInfo {
  weekStart: string
  weekEnd: string
  weekNumber: number
  year: number
  isCurrentWeek: boolean
  isOrderingAllowed: boolean
  orderDeadline: Date
  weekLabel: string
}

export class MenuService {
  private static readonly COLLECTION_NAME = 'menus'

  // Helper method to create a local date from YYYY-MM-DD string - CORREGIDO
  static createLocalDate(dateString: string): Date {
    try {
      // Usar parseISO para manejar fechas ISO correctamente
      const date = parseISO(dateString)
      if (!isValid(date)) {
        throw new Error(`Invalid date string: ${dateString}`)
      }
      return date
    } catch (error) {
      console.error('Error parsing date:', dateString, error)
      // Fallback al método anterior si parseISO falla
      const [year, month, day] = dateString.split('-').map(Number)
      return new Date(year, month - 1, day)
    }
  }

  // Helper method to format date to YYYY-MM-DD - NUEVO
  static formatToDateString(date: Date): string {
    return format(date, 'yyyy-MM-dd')
  }

  // Helper method to determine user type from various possible field names
  static getUserTypeFromUser(user: { tipoUsuario?: string; userType?: string; tipo_usuario?: string; type?: string } | null | undefined): UserType {
    // Try different possible field names
    const userType = user?.tipoUsuario || user?.userType || user?.tipo_usuario || user?.type
    
    // Normalize to expected values
    if (userType === 'funcionario' || userType === 'staff' || userType === 'employee') {
      return 'funcionario'
    }
    
    if (userType === 'apoderado' || userType === 'parent' || userType === 'guardian' || userType === 'estudiante' || userType === 'student') {
      return 'apoderado'
    }
    
    // Default fallback
    console.warn('Unknown user type, defaulting to apoderado:', userType)
    return 'apoderado'
  }

  /**
   * Obtiene el menú semanal completo
   */
  static async getWeeklyMenu(weekStart?: string): Promise<WeekMenuDisplay> {
    try {
      const actualWeekStart = weekStart || this.getCurrentWeekStart()
      
      const menusRef = collection(db, this.COLLECTION_NAME)
      const q = query(
        menusRef,
        where('weekStart', '==', actualWeekStart),
        where('active', '==', true),
        where('published', '==', true),
        orderBy('date', 'asc'),
        orderBy('type', 'asc')
      )

      const snapshot = await getDocs(q)
      const items: MenuItem[] = []

      snapshot.forEach((doc) => {
        const data = doc.data()
        items.push({
          id: doc.id,
          code: data.code,
          name: data.description, // En admin se guarda como description
          description: data.description,
          type: data.type,
          price: 0, // Se asignará según el tipo de usuario
          available: data.active,
          date: data.date,
          dia: data.day,
          active: data.active
        })
      })

      return this.buildWeekMenuStructure(actualWeekStart, items)
    } catch (error) {
      console.error('Error fetching weekly menu:', error)
      throw new Error('No se pudo cargar el menú semanal')
    }
  }

  /**
   * Obtiene el menú semanal para un usuario específico con precios
   */
  static async getWeeklyMenuForUser(userTypeOrUser: UserType | { tipoUsuario?: string; userType?: string; tipo_usuario?: string; type?: string } | null | undefined, weekStart?: string): Promise<DayMenuDisplay[]> {
    try {
      // Determinar el tipo de usuario
      let userType: UserType
      if (typeof userTypeOrUser === 'string') {
        userType = userTypeOrUser as UserType
      } else {
        userType = this.getUserTypeFromUser(userTypeOrUser)
      }

      // Obtener el menú base
      const weekMenu = await this.getWeeklyMenu(weekStart)
      
      // Aplicar precios según el tipo de usuario
      const prices = PRICES[userType]
      
      return weekMenu.days.map(day => ({
        ...day,
        almuerzos: day.almuerzos.map(item => ({
          ...item,
          price: prices.almuerzo
        })),
        colaciones: day.colaciones.map(item => ({
          ...item,
          price: prices.colacion
        })),
        isAvailable: this.isDayOrderingAllowed(day.date)
      }))
    } catch (error) {
      console.error('Error fetching weekly menu for user:', error)
      throw new Error('No se pudo cargar el menú para el usuario')
    }
  }

  /**
   * Obtiene información de la semana actual - MEJORADO
   */
  static getCurrentWeekInfo(): WeekInfo {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Lunes
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Domingo
    
    // Calcular número de semana
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
    
    // Deadline para pedidos: miércoles a las 13:00
    const wednesday = addDays(weekStart, 2)
    const orderDeadline = new Date(wednesday)
    orderDeadline.setHours(13, 0, 0, 0)
    
    const isCurrentWeek = true
    const isOrderingAllowed = now <= orderDeadline
    
    return {
      weekStart: this.formatToDateString(weekStart),
      weekEnd: this.formatToDateString(weekEnd),
      weekNumber,
      year: now.getFullYear(),
      isCurrentWeek,
      isOrderingAllowed,
      orderDeadline,
      weekLabel: this.getWeekDisplayText(
        this.formatToDateString(weekStart),
        this.formatToDateString(weekEnd)
      )
    }
  }

  /**
   * Obtiene información de una semana específica - NUEVO
   */
  static getWeekInfo(weekStart: string): WeekInfo {
    const now = new Date()
    const currentWeekStart = this.getCurrentWeekStart()
    const weekStartDate = this.createLocalDate(weekStart)
    const weekEndDate = addDays(weekStartDate, 6)
    
    // Calcular número de semana
    const startOfYear = new Date(weekStartDate.getFullYear(), 0, 1)
    const weekNumber = Math.ceil(((weekStartDate.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
    
    // Deadline para pedidos: miércoles a las 13:00 de la semana actual
    const currentWeekStartDate = this.createLocalDate(currentWeekStart)
    const wednesday = addDays(currentWeekStartDate, 2)
    const orderDeadline = new Date(wednesday)
    orderDeadline.setHours(13, 0, 0, 0)
    
    const isCurrentWeek = weekStart === currentWeekStart
    const isOrderingAllowed = isCurrentWeek ? now <= orderDeadline : weekStart > currentWeekStart
    
    return {
      weekStart,
      weekEnd: this.formatToDateString(weekEndDate),
      weekNumber,
      year: weekStartDate.getFullYear(),
      isCurrentWeek,
      isOrderingAllowed,
      orderDeadline,
      weekLabel: this.getWeekDisplayText(weekStart, this.formatToDateString(weekEndDate))
    }
  }

  /**
   * Obtiene el inicio de la semana actual
   */
  static getCurrentWeekStart(): string {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    return this.formatToDateString(weekStart)
  }

  /**
   * Obtiene el inicio de una semana específica basada en una fecha - NUEVO
   */
  static getWeekStartFromDate(date: Date): string {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 })
    return this.formatToDateString(weekStart)
  }

  /**
   * Formatea el texto de visualización de la semana
   */
  static getWeekDisplayText(weekStart: string, weekEnd: string): string {
    const start = this.createLocalDate(weekStart)
    const end = this.createLocalDate(weekEnd)
    
    return `Del ${format(start, 'd')} al ${format(end, 'd')} de ${format(end, 'MMMM yyyy', { locale: es })}`
  }

  /**
   * Obtiene el nombre del día para mostrar - MEJORADO
   */
  static getDayDisplayName(date: string): string {
    const dayDate = this.createLocalDate(date)
    return format(dayDate, 'EEEE d \'de\' MMMM', { locale: es })
  }

  /**
   * Formatea una fecha
   */
  static getFormattedDate(date: string): string {
    const dayDate = this.createLocalDate(date)
    return this.formatToDateString(dayDate)
  }

  /**
   * Obtiene el nombre del día
   */
  static getDayName(date: string): string {
    const dayDate = this.createLocalDate(date)
    return format(dayDate, 'EEEE', { locale: es })
  }

  /**
   * Verifica si se permite hacer pedidos para un día específico - MEJORADO
   */
  static isDayOrderingAllowed(date: string): boolean {
    try {
      const dayDate = this.createLocalDate(date)
      const today = new Date()
      
      // Normalizar fechas para comparación (solo fecha, sin hora)
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const dayDateNormalized = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate())
      
      const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6
      const isPastDay = dayDateNormalized < todayNormalized
      
      // Permitir pedidos para hoy y días futuros, pero no fines de semana ni días pasados
      return !isPastDay && !isWeekend
    } catch (error) {
      console.error('Error checking if day ordering is allowed:', error)
      return false
    }
  }

  /**
   * Verifica si un día es fin de semana - NUEVO
   */
  static isWeekend(date: string): boolean {
    try {
      const dayDate = this.createLocalDate(date)
      return dayDate.getDay() === 0 || dayDate.getDay() === 6
    } catch (error) {
      console.error('Error checking if day is weekend:', error)
      return false
    }
  }

  /**
   * Verifica si un día es pasado - NUEVO
   */
  static isPastDay(date: string): boolean {
    try {
      const dayDate = this.createLocalDate(date)
      const today = new Date()
      
      // Normalizar fechas para comparación (solo fecha, sin hora)
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const dayDateNormalized = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate())
      
      return dayDateNormalized < todayNormalized
    } catch (error) {
      console.error('Error checking if day is past:', error)
      return false
    }
  }

  /**
   * Construye la estructura del menú semanal - MEJORADO
   */
  private static buildWeekMenuStructure(weekStart: string, items: MenuItem[]): WeekMenuDisplay {
    const startDate = this.createLocalDate(weekStart)
    const endDate = addDays(startDate, 6)
    
    // Crear estructura de 7 días (lunes a domingo)
    const days: DayMenuDisplay[] = []
    
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i)
      const dateStr = this.formatToDateString(currentDate)
      const dayName = format(currentDate, 'EEEE', { locale: es })
      const dayLabel = format(currentDate, 'EEEE d', { locale: es })
      const dateFormatted = format(currentDate, 'dd/MM/yyyy')
      
      // Filtrar items para este día
      const dayItems = items.filter(item => item.date === dateStr)
      const almuerzos = dayItems.filter(item => item.type === 'almuerzo')
      const colaciones = dayItems.filter(item => item.type === 'colacion')
      
      days.push({
        date: dateStr,
        day: dayName,
        dayLabel,
        dateFormatted,
        almuerzos,
        colaciones,
        hasItems: dayItems.length > 0,
        isAvailable: this.isDayOrderingAllowed(dateStr)
      })
    }
    
    return {
      weekStart,
      weekEnd: this.formatToDateString(endDate),
      weekLabel: this.getWeekDisplayText(weekStart, this.formatToDateString(endDate)),
      days,
      totalItems: items.length
    }
  }

  /**
   * Verifica si hay menús disponibles para una semana
   */
  static async hasMenusForWeek(weekStart: string): Promise<boolean> {
    try {
      const menusRef = collection(db, this.COLLECTION_NAME)
      const q = query(
        menusRef,
        where('weekStart', '==', weekStart),
        where('active', '==', true),
        where('published', '==', true)
      )

      const snapshot = await getDocs(q)
      return !snapshot.empty
    } catch (error) {
      console.error('Error checking menus for week:', error)
      return false
    }
  }

  /**
   * Obtiene los días disponibles para una semana
   */
  static async getAvailableDaysForWeek(weekStart: string): Promise<string[]> {
    try {
      const menusRef = collection(db, this.COLLECTION_NAME)
      const q = query(
        menusRef,
        where('weekStart', '==', weekStart),
        where('active', '==', true),
        where('published', '==', true)
      )

      const snapshot = await getDocs(q)
      const availableDays = new Set<string>()
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        availableDays.add(data.date)
      })

      return Array.from(availableDays).sort()
    } catch (error) {
      console.error('Error getting available days for week:', error)
      return []
    }
  }

  /**
   * Genera las fechas de una semana - NUEVO
   */
  static generateWeekDates(weekStart: string): string[] {
    const startDate = this.createLocalDate(weekStart)
    const dates: string[] = []
    
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i)
      dates.push(this.formatToDateString(currentDate))
    }
    
    return dates
  }

  /**
   * Obtiene las próximas N semanas - NUEVO
   */
  static getNextWeeks(numberOfWeeks: number = 4): string[] {
    const now = new Date()
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekStarts: string[] = []
    
    for (let i = 0; i < numberOfWeeks; i++) {
      const weekStart = addDays(currentWeekStart, i * 7)
      weekStarts.push(this.formatToDateString(weekStart))
    }
    
    return weekStarts
  }
}