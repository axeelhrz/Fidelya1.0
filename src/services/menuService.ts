import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { MenuItem, PRICES, UserType } from '@/types/panel'
import { DayMenuDisplay, WeekMenuDisplay } from '@/types/menu'
import { format, startOfWeek, endOfWeek, addDays, isBefore, isToday, isAfter, isSameDay, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export class MenuService {
  // Helper method to create a local date from YYYY-MM-DD string
  static createLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day) // month is 0-indexed
  }

  // Helper method to determine user type from various possible field names
  static getUserTypeFromUser(user: any): UserType {
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

  static async getWeeklyMenu(weekStart?: string): Promise<WeekMenuDisplay> {
    try {
      // Si no se proporciona weekStart, usar la semana actual
      const actualWeekStart = weekStart || this.getCurrentWeekStart()
      
      console.log('Getting weekly menu for week starting:', actualWeekStart)
      
      const menusRef = collection(db, 'menus')
      const q = query(
        menusRef,
        where('weekStart', '==', actualWeekStart),
        where('active', '==', true), // Solo items activos
        orderBy('date', 'asc'),
        orderBy('type', 'asc')
      )
      
      const snapshot = await getDocs(q)
      const menuItems: MenuItem[] = []
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        menuItems.push({
          id: doc.id,
          code: data.code,
          name: data.name || data.description,
          description: data.description,
          type: data.type,
          price: 0, // Se calculará dinámicamente según tipo de usuario
          available: data.available !== false && data.active !== false,
          image: data.image,
          date: data.date,
          dia: data.dia,
          active: data.active
        })
      })
      
      return this.buildWeekMenuStructure(actualWeekStart, menuItems)
    } catch (error) {
      console.error('Error fetching weekly menu:', error)
      throw new Error('No se pudo cargar el menú de la semana')
    }
  }

  static async getWeeklyMenuForUser(userTypeOrUser: UserType | any, weekStart?: string): Promise<DayMenuDisplay[]> {
    try {
      let userType: UserType
      
      // Handle both direct UserType and user object
      if (typeof userTypeOrUser === 'string') {
        userType = userTypeOrUser
      } else {
        userType = this.getUserTypeFromUser(userTypeOrUser)
      }

      // Validar userType antes de proceder
      if (!userType) {
        console.error('UserType is undefined or null')
        throw new Error('Tipo de usuario no definido')
      }

      // Normalizar userType para asegurar que sea válido
      const normalizedUserType: UserType = userType === 'funcionario' ? 'funcionario' : 'apoderado'
      
      const weekMenu = await this.getWeeklyMenu(weekStart)
      
      // Verificar que PRICES esté definido y tenga la estructura correcta
      if (!PRICES || !PRICES[normalizedUserType]) {
        console.error('PRICES not defined or missing userType:', normalizedUserType)
        throw new Error('Configuración de precios no encontrada')
      }

      const prices = PRICES[normalizedUserType]
      if (!prices || typeof prices.almuerzo !== 'number' || typeof prices.colacion !== 'number') {
        console.error('Price structure invalid for userType:', normalizedUserType, prices)
        throw new Error('Estructura de precios inválida')
      }
      
      // Aplicar precios según tipo de usuario y verificar disponibilidad por fecha
      const today = new Date()
      // Normalizar today para comparación (solo fecha, sin hora)
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      
      console.log('Today is:', format(today, 'EEEE d \'de\' MMMM \'de\' yyyy', { locale: es }))
      console.log('Today normalized:', todayNormalized)
      
      const daysWithPrices = weekMenu.days.map(day => {
        const dayDate = this.createLocalDate(day.date)
        const dayDateNormalized = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate())
        
        const isPastDay = dayDateNormalized < todayNormalized
        const isCurrentDay = dayDateNormalized.getTime() === todayNormalized.getTime()
        const isFutureDay = dayDateNormalized > todayNormalized
        const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6 // Domingo o Sábado
        
        console.log(`Day: ${day.dayLabel} (${day.date}) - dayDate: ${dayDate}, isPast: ${isPastDay}, isCurrent: ${isCurrentDay}, isFuture: ${isFutureDay}, isWeekend: ${isWeekend}, dayOfWeek: ${dayDate.getDay()}`)
        
        return {
          ...day,
          isAvailable: day.hasItems && !isPastDay && !isWeekend, // Disponible si tiene items, no es día pasado y no es fin de semana
          isPastDay,
          isCurrentDay,
          isFutureDay,
          isWeekend,
          canOrder: !isPastDay && !isWeekend, // Se puede pedir si no es día pasado y no es fin de semana
          almuerzos: day.almuerzos.map(item => ({
            ...item,
            price: prices.almuerzo,
            available: item.available && !isPastDay && !isWeekend
          })),
          colaciones: day.colaciones.map(item => ({
            ...item,
            price: prices.colacion,
            available: item.available && !isPastDay && !isWeekend
          }))
        }
      })
      
      return daysWithPrices
    } catch (error) {
      console.error('Error fetching weekly menu for user:', error)
      throw error
    }
  }

  static getCurrentWeekInfo() {
    const now = new Date()
    console.log('Current date:', now)
    console.log('Current date formatted:', format(now, 'EEEE d \'de\' MMMM \'de\' yyyy', { locale: es }))
    
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
    
    console.log('Week start:', format(weekStart, 'EEEE d \'de\' MMMM \'de\' yyyy', { locale: es }))
    console.log('Week end:', format(weekEnd, 'EEEE d \'de\' MMMM \'de\' yyyy', { locale: es }))
    
    // Siempre permitir pedidos (sin restricción de horario)
    const isOrderingAllowed = true
    
    return {
      weekStart: format(weekStart, 'yyyy-MM-dd'),
      weekEnd: format(weekEnd, 'yyyy-MM-dd'),
      weekNumber: parseInt(format(weekStart, 'w')),
      year: weekStart.getFullYear(),
      isCurrentWeek: true,
      isOrderingAllowed,
      orderDeadline: new Date() // Ya no se usa, pero mantenemos compatibilidad
    }
  }

  static getCurrentWeekStart(): string {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekStartFormatted = format(weekStart, 'yyyy-MM-dd')
    
    console.log('getCurrentWeekStart - now:', now)
    console.log('getCurrentWeekStart - weekStart:', weekStart)
    console.log('getCurrentWeekStart - formatted:', weekStartFormatted)
    
    return weekStartFormatted
  }

  static getWeekDisplayText(weekStart: string, weekEnd: string): string {
    const start = this.createLocalDate(weekStart)
    const end = this.createLocalDate(weekEnd)
    
    return `Del ${format(start, 'd')} al ${format(end, 'd')} de ${format(end, 'MMMM yyyy', { locale: es })}`
  }

  static getDayDisplayName(date: string): string {
    return format(this.createLocalDate(date), 'EEEE d', { locale: es })
  }

  static getFormattedDate(date: string): string {
    return format(this.createLocalDate(date), 'yyyy-MM-dd')
  }

  static getDayName(date: string): string {
    return format(this.createLocalDate(date), 'EEEE', { locale: es })
  }

  // Método para verificar si un día específico permite pedidos
  static isDayOrderingAllowed(date: string): boolean {
    const dayDate = this.createLocalDate(date)
    const today = new Date()
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const dayDateNormalized = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate())
    const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6
    
    // Permitir pedidos para hoy y días futuros, pero no fines de semana
    return (dayDateNormalized.getTime() >= todayNormalized.getTime()) && !isWeekend
  }

  private static buildWeekMenuStructure(weekStart: string, items: MenuItem[]): WeekMenuDisplay {
    const startDate = this.createLocalDate(weekStart)
    const endDate = addDays(startDate, 6) // Fin de semana es 6 días después del inicio
    const weekLabel = `Del ${format(startDate, 'd')} al ${format(endDate, 'd')} de ${format(endDate, 'MMMM yyyy', { locale: es })}`
    
    console.log('buildWeekMenuStructure - weekStart:', weekStart)
    console.log('buildWeekMenuStructure - startDate:', startDate)
    console.log('buildWeekMenuStructure - endDate:', endDate)
    
    const days: DayMenuDisplay[] = []
    
    // Crear estructura para todos los días de la semana (lunes a domingo)
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i)
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      const dayName = format(currentDate, 'EEEE', { locale: es })
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6
      
      console.log(`Day ${i}: ${dayName} ${format(currentDate, 'd \'de\' MMMM \'de\' yyyy', { locale: es })} (${dateStr}) - Weekend: ${isWeekend}, DayOfWeek: ${currentDate.getDay()}`)
      
      // Filtrar items por fecha específica
      const dayItems = items.filter(item => item.date === dateStr)
      
      const almuerzos = dayItems.filter(item => item.type === 'almuerzo')
      const colaciones = dayItems.filter(item => item.type === 'colacion')
      
      days.push({
        date: dateStr,
        day: dayName,
        dayLabel: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        dateFormatted: format(currentDate, 'd \'de\' MMMM \'de\' yyyy', { locale: es }),
        almuerzos,
        colaciones,
        hasItems: almuerzos.length > 0 || colaciones.length > 0,
        isAvailable: (almuerzos.length > 0) && !isWeekend, // Disponible si hay almuerzo y no es fin de semana
        isWeekend
      })
    }
    
    return {
      weekStart,
      weekEnd: format(endDate, 'yyyy-MM-dd'),
      weekLabel,
      days,
      totalItems: items.length
    }
  }
}