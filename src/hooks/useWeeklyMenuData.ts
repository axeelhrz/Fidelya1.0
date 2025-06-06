"use client"

import { useState, useEffect } from 'react'
import { MenuService } from '@/services/menuService'
import { DayMenuDisplay } from '@/types/menu'
import { User } from '@/types/panel'

interface UseWeeklyMenuDataProps {
  user: User | null
  weekStart?: string
}

interface UseWeeklyMenuDataReturn {
  weekMenu: DayMenuDisplay[]
  isLoading: boolean
  error: string | null
  weekInfo: {
    weekStart: string
    weekEnd: string
    weekLabel: string
    isOrderingAllowed: boolean
    orderDeadline: Date
  } | null
  refetch: () => Promise<void>
}

export function useWeeklyMenuData({ user, weekStart }: UseWeeklyMenuDataProps): UseWeeklyMenuDataReturn {
  const [weekMenu, setWeekMenu] = useState<DayMenuDisplay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [weekInfo, setWeekInfo] = useState<UseWeeklyMenuDataReturn['weekInfo']>(null)

  const fetchWeeklyMenu = async () => {
    if (!user) {
      console.log('User not available')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      console.log('Fetching menu for user:', user)

      // Obtener información de la semana actual
      const currentWeekInfo = MenuService.getCurrentWeekInfo()
      
      // Usar el método mejorado que puede manejar diferentes formatos de usuario
      const menuData = await MenuService.getWeeklyMenuForUser(user, weekStart)
      
      setWeekMenu(menuData)
      setWeekInfo({
        weekStart: currentWeekInfo.weekStart,
        weekEnd: currentWeekInfo.weekEnd,
        weekLabel: MenuService.getWeekDisplayText(currentWeekInfo.weekStart, currentWeekInfo.weekEnd),
        isOrderingAllowed: currentWeekInfo.isOrderingAllowed,
        orderDeadline: currentWeekInfo.orderDeadline
      })
    } catch (err) {
      console.error('Error fetching weekly menu:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar el menú')
      setWeekMenu([])
      setWeekInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWeeklyMenu()
  }, [user?.id, weekStart]) // Simplified dependency array

  const refetch = async () => {
    await fetchWeeklyMenu()
  }

  return {
    weekMenu,
    isLoading,
    error,
    weekInfo,
    refetch
  }
}