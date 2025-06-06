import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { DayMenuOptions, WeekInfo } from '@/types/order'
import { MenuItem } from '@/types/panel'
import { format, startOfWeek, endOfWeek, addDays, isAfter, isBefore } from 'date-fns'
import { es } from 'date-fns/locale'

export class MenuService {
  static async getWeeklyMenu(weekStart: string): Promise<DayMenuOptions[]> {
    try {
      const menusRef = collection(db, 'menus')
      const q = query(
        menusRef,
        where('weekStart', '==', weekStart),
        orderBy('date', 'asc')
      )
      
      const snapshot = await getDocs(q)
      const menuData: DayMenuOptions[] = []
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        menuData.push({
          date: data.date,
          day: data.day,
          dayName: data.dayName || format(new Date(data.date), 'EEEE', { locale: es }),
          almuerzos: data.almuerzos || [],
          colaciones: data.colaciones || [],
          isAvailable: data.isAvailable !== false
        })
      })
      
      return menuData
    } catch (error) {
      console.error('Error fetching weekly menu:', error)
      throw new Error('No se pudo cargar el menú de la semana')
    }
  }

  static getCurrentWeekInfo(): WeekInfo {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Lunes
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Domingo
    
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

  static getWeekDisplayText(weekStart: string, weekEnd: string): string {
    const start = new Date(weekStart)
    const end = new Date(weekEnd)
    
    return `Del ${format(start, 'd')} al ${format(end, 'd')} de ${format(end, 'MMMM', { locale: es })}`
  }

  static getDayDisplayName(date: string): string {
    return format(new Date(date), 'EEEE d', { locale: es })
  }
}
