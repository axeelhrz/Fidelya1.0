import { AdminMenuService } from './adminMenuService'
import { AdminMenuItem, AdminWeekMenu } from '@/types/adminMenu'
import { DayMenuDisplay, MenuItem } from '@/types/menu'
import { PRICES, UserType } from '@/types/panel'
import { format, addDays, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export class MenuIntegrationService {
  // Helper method to create a local date from YYYY-MM-DD string
  static createLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day) // month is 0-indexed
  }

  // Helper method to determine user type from various possible field names
  static getUserTypeFromUser(user: any): UserType {
    const userType = user?.tipoUsuario || user?.userType || user?.tipo_usuario || user?.type
    
    if (userType === 'funcionario' || userType === 'staff' || userType === 'employee') {
      return 'funcionario'
    }
    
    if (userType === 'apoderado' || userType === 'parent' || userType === 'guardian' || userType === 'estudiante' || userType === 'student') {
      return 'apoderado'
    }
    
    console.warn('Unknown user type, defaulting to apoderado:', userType)
    return 'apoderado'
  }

  // Convertir AdminMenuItem a MenuItem
  static convertAdminItemToMenuItem(adminItem: AdminMenuItem, userType: UserType): MenuItem {
    const prices = PRICES[userType]
    const price = adminItem.type === 'almuerzo' ? prices.almuerzo : prices.colacion

    return {
      id: adminItem.id || '',
      code: adminItem.code,
      name: adminItem.description,
      description: adminItem.description,
      type: adminItem.type,
      price: price,
      available: adminItem.active,
      image: undefined, // Los items de admin no tienen imagen por defecto
      date: adminItem.date,
      dia: adminItem.day,
      active: adminItem.active
    }
  }

  // Obtener menú semanal desde admin para mi-pedido
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
      
      // Obtener menú desde AdminMenuService
      const adminWeekMenu = await AdminMenuService.getWeeklyMenu(weekStart || AdminMenuService.getCurrentWeekStart())
      
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
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      
      console.log('Today is:', format(today, 'EEEE d \'de\' MMMM \'de\' yyyy', { locale: es }))
      console.log('Today normalized:', todayNormalized)
      
      // Convertir AdminDayMenu a DayMenuDisplay
      const daysWithPrices = adminWeekMenu.days.map(adminDay => {
        const dayDate = this.createLocalDate(adminDay.date)
        const dayDateNormalized = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate())
        
        const isPastDay = dayDateNormalized < todayNormalized
        const isCurrentDay = dayDateNormalized.getTime() === todayNormalized.getTime()
        const isFutureDay = dayDateNormalized > todayNormalized
        const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6 // Domingo (0) o Sábado (6)
        
        console.log(`Day: ${adminDay.dayName} (${adminDay.date}) - dayDate: ${dayDate}, isPast: ${isPastDay}, isCurrent: ${isCurrentDay}, isFuture: ${isFutureDay}, isWeekend: ${isWeekend}, dayOfWeek: ${dayDate.getDay()}`)
        
        // Convertir AdminMenuItem a MenuItem
        const almuerzos = adminDay.almuerzos
          .filter(item => item.active) // Solo items activos
          .map(item => ({
            ...this.convertAdminItemToMenuItem(item, normalizedUserType),
            available: item.active && !isPastDay && !isWeekend
          }))

        const colaciones = adminDay.colaciones
          .filter(item => item.active) // Solo items activos
          .map(item => ({
            ...this.convertAdminItemToMenuItem(item, normalizedUserType),
            available: item.active && !isPastDay && !isWeekend
          }))

        const hasItems = almuerzos.length > 0 || colaciones.length > 0

        return {
          date: adminDay.date,
          day: adminDay.day,
          dayLabel: adminDay.dayName,
          dateFormatted: format(dayDate, 'd \'de\' MMMM \'de\' yyyy', { locale: es }),
          almuerzos,
          colaciones,
          hasItems,
          isAvailable: hasItems && !isPastDay && !isWeekend,
          isPastDay,
          isCurrentDay,
          isFutureDay,
          isWeekend,
          canOrder: !isPastDay && !isWeekend
        } as DayMenuDisplay & {
          isPastDay: boolean
          isCurrentDay: boolean
          isFutureDay: boolean
          isWeekend: boolean
          canOrder: boolean
        }
      })
      
      return daysWithPrices
    } catch (error) {
      console.error('Error fetching weekly menu for user from admin:', error)
      throw error
    }
  }

  // Obtener información de la semana actual
  static getCurrentWeekInfo() {
    const navigation = AdminMenuService.getWeekNavigation(AdminMenuService.getCurrentWeekStart())
    
    return {
      weekStart: navigation.currentWeek,
      weekEnd: format(addDays(parseISO(navigation.currentWeek), 6), 'yyyy-MM-dd'),
      weekLabel: navigation.weekLabel,
      isOrderingAllowed: true, // Siempre permitir pedidos
      orderDeadline: new Date() // Ya no se usa, pero mantenemos compatibilidad
    }
  }

  // Verificar si un día específico permite pedidos
  static isDayOrderingAllowed(date: string): boolean {
    const dayDate = this.createLocalDate(date)
    const today = new Date()
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const dayDateNormalized = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate())
    const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6
    
    // Permitir pedidos para hoy y días futuros, pero no fines de semana
    return (dayDateNormalized.getTime() >= todayNormalized.getTime()) && !isWeekend
  }

  // Obtener texto de visualización de la semana
  static getWeekDisplayText(weekStart: string, weekEnd: string): string {
    const start = this.createLocalDate(weekStart)
    const end = this.createLocalDate(weekEnd)
    
    return `Del ${format(start, 'd')} al ${format(end, 'd')} de ${format(end, 'MMMM yyyy', { locale: es })}`
  }
}
