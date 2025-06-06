import { useState, useEffect, useMemo } from 'react'
import { MenuService } from '@/services/menuService'
import { DayMenuOptions, WeekInfo } from '@/types/order'
import { DayMenuDisplay } from '@/types/menu'

export function useWeeklyMenuData() {
  const [weekInfo, setWeekInfo] = useState<WeekInfo | null>(null)
  const [menuData, setMenuData] = useState<DayMenuDisplay[]>([])
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
        
        // Cargar menú de la semana - esto devuelve WeekMenuDisplay
        const weekMenu = await MenuService.getWeeklyMenu(currentWeekInfo.weekStart)
        
        // Extraer el array de días del objeto WeekMenuDisplay
        setMenuData(weekMenu.days)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos'
        setError(errorMessage)
        console.error('Error loading weekly data:', err)
        // Asegurar que menuData sea un array vacío en caso de error
        setMenuData([])
      } finally {
        setIsLoading(false)
      }
    }

    loadWeeklyData()
  }, [])

  // Usar useMemo para evitar recálculos innecesarios que causan re-renders
  const weekDays = useMemo(() => {
    return Array.isArray(menuData) ? menuData.map(day => day.date) : []
  }, [menuData])

  const weekDisplayText = useMemo(() => {
    return weekInfo 
      ? MenuService.getWeekDisplayText(weekInfo.weekStart, weekInfo.weekEnd)
      : ''
  }, [weekInfo])

  const refetch = async () => {
    if (!weekInfo) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const weekMenu = await MenuService.getWeeklyMenu(weekInfo.weekStart)
      setMenuData(weekMenu.days)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al recargar los datos'
      setError(errorMessage)
      setMenuData([])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    weekInfo,
    menuData,
    weekDays,
    weekDisplayText,
    isLoading,
    error,
    refetch
  }
}