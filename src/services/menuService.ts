import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { MenuItem, PRICES, UserType, User } from '@/types/panel'
import { DayMenuDisplay, WeekMenuDisplay } from '@/types/menu'
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

export class MenuService {
  // Helper method to create a local date from YYYY-MM-DD string
  static createLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day) // month is 0-indexed
  }

  // Helper method to determine user type from various possible field names
  static getUserTypeFromUser(user: User | { tipoUsuario?: string; userType?: string; tipo_usuario?: string; type?: string } | null | undefined): UserType {
    if (!user) {
      console.warn('User is null or undefined, defaulting to apoderado')
      return 'apoderado'
    }

    // Try different possible field names
    const userType = user.tipoUsuario || user.userType || user.tipo_usuario || user.type
    
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
        where('published', '==', true), // Solo items publicados
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
          name: data.description, // Usar description como name
          description: data.description,
          type: data.type,
          price: 0, // Se calculará dinámicamente según tipo de usuario
          available: data.active && data.published,
          image: data.image,
          date: data.date,
          dia: data.day,
          active: data.active,
          category: data.type,
          allergens: data.allergens || [],
          nutritionalInfo: data.nutritionalInfo || {}
        })
      })
      
      return this.buildWeekMenuStructure(actualWeekStart, menuItems)
    } catch (error) {
      console.error('Error fetching weekly menu:', error)
      throw new Error('No se pudo cargar el menú de la semana')
    }
  }

  static async getWeeklyMenuForUser(userTypeOrUser: UserType | User | { tipoUsuario?: string; userType?: string; tipo_usuario?: string; type?: string } | null | undefined, weekStart?: string): Promise<DayMenuDisplay[]> {
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
        const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6 // Domingo (0) o Sábado (6)
        
        console.log(`Day: ${day.dayLabel} (${day.date}) - dayDate: ${dayDate}, isPast: ${isPastDay}, isCurrent: ${isCurrentDay}, isFuture: ${isFutureDay}, isWeekend: ${isWeekend}, dayOfWeek: ${dayDate.getDay()}`)
        
        return {
          ...day,
          isAvailable: day.hasItems && !isPastDay && !isWeekend, // Dispon