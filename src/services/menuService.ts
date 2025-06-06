import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { MenuItem, PRICES } from '@/types/panel'
import { DayMenuDisplay, WeekMenuDisplay } from '@/types/menu'
import { format, startOfWeek, endOfWeek, addDays, isBefore } from 'date-fns'
import { es } from 'date-fns/locale'

export class MenuService {
  static async getWeeklyMenu(weekStart?: string): Promise<WeekMenuDisplay> {
    try {
      // Si no se proporciona weekStart, usar la semana actual
      const actualWeekStart = weekStart || this.getCurrentWeekStart()
      
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

  static async getWeeklyMenuForUser(userType: 'funcionario' | 'apoderado', weekStart?: string): Promise<DayMenuDisplay[]> {
    try {
      const weekMenu = await this.getWeeklyMenu(weekStart)
      
      // Aplicar precios según tipo de usuario
      const daysWithPrices = weekMenu.days.map(day => ({
        ...day,
        almuerzos: day.almuerzos.map(item => ({
          ...item,
          price: PRICES[userType].almuerzo
        })),
        colaciones: day.colaciones.map(item => ({
          ...item,
          price: PRICES[userType].colacion
        }))
      }))
      
      return daysWithPrices
    } catch (error) {
      console.error('Error fetching weekly menu for user:', error)
      throw error
    }
  }

  static getCurrentWeekInfo() {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
    
    // Deadline: miércoles a las 13:00
    const wednesday = addDays(weekStart, 2)
    const orderDeadline = new Date(wednesday)
    orderDeadline.setHours(13, 0, 0, 0)
    
    const isOrderingAllowed = isBefore(now, orderDeadline)
    
    return {
      weekStart: format(weekStart, 'yyyy-MM-dd'),
      weekEnd: format(weekEnd, 'yyyy-MM-dd'),
      weekNumber: parseInt(format(weekStart, 'w')),
      year: weekStart.getFullYear(),
      isCurrentWeek: true,
      isOrderingAllowed,
      orderDeadline
    }
  }

  static getCurrentWeekStart(): string {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    return format(weekStart, 'yyyy-MM-dd')
  }

  static getWeekDisplayText(weekStart: string, weekEnd: string): string {
    const start = new Date(weekStart)
    const end = new Date(weekEnd)
    
    return `Del ${format(start, 'd')} al ${format(end, 'd')} de ${format(end, 'MMMM', { locale: es })}`
  }

  static getDayDisplayName(date: string): string {
    return format(new Date(date), 'EEEE d', { locale: es })
  }

  static getFormattedDate(date: string): string {
    return format(new Date(date), 'yyyy-MM-dd')
  }

  static getDayName(date: string): string {
    return format(new Date(date), 'EEEE', { locale: es })
  }

  private static buildWeekMenuStructure(weekStart: string, items: MenuItem[]): WeekMenuDisplay {
    const startDate = new Date(weekStart)
    const endDate = endOfWeek(startDate, { weekStartsOn: 1 })
    const weekLabel = `Del ${format(startDate, 'd')} al ${format(endDate, 'd')} de ${format(endDate, 'MMMM yyyy', { locale: es })}`
    
    const days: DayMenuDisplay[] = []
    
    // Crear estructura para cada día de la semana (lunes a viernes)
    for (let i = 0; i < 5; i++) {
      const currentDate = addDays(startDate, i)
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      const dayName = format(currentDate, 'EEEE', { locale: es })
      
      // Filtrar items por fecha específica
      const dayItems = items.filter(item => item.date === dateStr)
      
      const almuerzos = dayItems.filter(item => item.type === 'almuerzo')
      const colaciones = dayItems.filter(item => item.type === 'colacion')
      
      days.push({
        date: dateStr,
        day: dayName,
        dayLabel: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        dateFormatted: format(currentDate, 'd \'de\' MMMM', { locale: es }),
        almuerzos,
        colaciones,
        hasItems: almuerzos.length > 0 || colaciones.length > 0,
        isAvailable: almuerzos.length > 0 // Disponible si hay al menos un almuerzo
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