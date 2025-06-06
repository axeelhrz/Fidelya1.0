import { useState, useEffect } from 'react'
import { MenuService } from '@/services/menuService'
import { DayMenuOptions, WeekInfo } from '@/types/order'

export function useWeeklyMenuData() {
  const [weekInfo, setWeekInfo] = useState<WeekInfo | null>(null)
  const [menuData, setMenuData] = useState<DayMenuOptions[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadWeeklyData() {
      setIsLoading(true)
      setError(null)
      
      try {
        // Obtener información de la semana actual
        const currentWeekInfo = MenuService.getCurrentWeekInfo()
        setWeekInfo(currentWeekInfo)
        
        // Cargar menú de la semana
        const menu = await MenuService.getWeeklyMenu(currentWeekInfo.weekStart)
        setMenuData(menu)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos'
        setError(errorMessage)
        console.error('Error loading weekly data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadWeeklyData()
  }, [])

  const weekDays = menuData.map(day => day.date)
  const weekDisplayText = weekInfo 
    ? MenuService.getWeekDisplayText(weekInfo.weekStart, weekInfo.weekEnd)
    : ''

  return {
    weekInfo,
    menuData,
    weekDays,
    weekDisplayText,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true)
      setError(null)
      // Re-ejecutar la carga
    }
  }
}
