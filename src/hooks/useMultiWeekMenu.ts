import { useState, useEffect, useCallback } from 'react'
import { MenuService } from '@/services/menuService'
import { DayMenuDisplay } from '@/types/menu'
import { WeekInfo } from '@/types/order'
import { User } from '@/types/panel'
import { format, addWeeks, startOfWeek } from 'date-fns'

interface WeekMenuData {
  weekInfo: WeekInfo & { weekLabel: string }
  weekMenu: DayMenuDisplay[]
  isLoading: boolean
  error: string | null
  hasMenus: boolean
}

interface UseMultiWeekMenuReturn {
  weeks: WeekMenuData[]
  isLoading: boolean
  error: string | null
  refreshWeek: (weekStart: string) => Promise<void>
  refreshAll: () => Promise<void>
}

export function useMultiWeekMenu(user: User | null, numberOfWeeks: number = 4): UseMultiWeekMenuReturn {
  const [weeks, setWeeks] = useState<WeekMenuData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Generar las fechas de inicio de las próximas semanas
  const generateWeekStarts = useCallback((count: number): string[] => {
    const now = new Date()
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekStarts: string[] = []
    
    for (let i = 0; i < count; i++) {
      const weekStart = addWeeks(currentWeekStart, i)
      weekStarts.push(format(weekStart, 'yyyy-MM-dd'))
    }
    
    return weekStarts
  }, [])

  // Cargar datos de una semana específica
  const loadWeekData = useCallback(async (weekStart: string): Promise<WeekMenuData> => {
    if (!user) {
      return {
        weekInfo: {
          ...MenuService.getCurrentWeekInfo(),
          weekStart,
          weekLabel: 'Semana no disponible'
        },
        weekMenu: [],
        isLoading: false,
        error: 'Usuario no disponible',
        hasMenus: false
      }
    }

    try {
      // Crear información de la semana
      const baseWeekInfo = MenuService.getCurrentWeekInfo()
      const weekEnd = format(addWeeks(new Date(weekStart), 1), 'yyyy-MM-dd')
      const weekLabel = MenuService.getWeekDisplayText(weekStart, weekEnd)
      
      const weekInfo: WeekInfo & { weekLabel: string } = {
        ...baseWeekInfo,
        weekStart,
        weekEnd,
        weekLabel,
        isCurrentWeek: weekStart === baseWeekInfo.weekStart
      }

      // Verificar si hay menús para esta semana
      const hasMenus = await MenuService.hasMenusForWeek(weekStart)
      
      if (!hasMenus) {
        return {
          weekInfo,
          weekMenu: [],
          isLoading: false,
          error: null,
          hasMenus: false
        }
      }

      // Cargar menú de la semana
      const weekMenu = await MenuService.getWeeklyMenuForUser(user, weekStart)

      return {
        weekInfo,
        weekMenu,
        isLoading: false,
        error: null,
        hasMenus: true
      }

    } catch (err) {
      console.error(`Error loading week data for ${weekStart}:`, err)
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el menú'
      
      return {
        weekInfo: {
          ...MenuService.getCurrentWeekInfo(),
          weekStart,
          weekLabel: 'Error al cargar'
        },
        weekMenu: [],
        isLoading: false,
        error: errorMessage,
        hasMenus: false
      }
    }
  }, [user])

  // Cargar todas las semanas
  const loadAllWeeks = useCallback(async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const weekStarts = generateWeekStarts(numberOfWeeks)
      
      // Cargar todas las semanas en paralelo
      const weekPromises = weekStarts.map(weekStart => loadWeekData(weekStart))
      const weekResults = await Promise.all(weekPromises)

      setWeeks(weekResults)

    } catch (err) {
      console.error('Error loading all weeks:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las semanas'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [user, numberOfWeeks, generateWeekStarts, loadWeekData])

  // Refrescar una semana específica
  const refreshWeek = useCallback(async (weekStart: string) => {
    const weekData = await loadWeekData(weekStart)
    
    setWeeks(prevWeeks => 
      prevWeeks.map(week => 
        week.weekInfo.weekStart === weekStart ? weekData : week
      )
    )
  }, [loadWeekData])

  // Refrescar todas las semanas
  const refreshAll = useCallback(async () => {
    await loadAllWeeks()
  }, [loadAllWeeks])

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (user) {
      loadAllWeeks()
    } else {
      setWeeks([])
      setIsLoading(false)
    }
  }, [user, loadAllWeeks])

  return {
    weeks,
    isLoading,
    error,
    refreshWeek,
    refreshAll
  }
}
