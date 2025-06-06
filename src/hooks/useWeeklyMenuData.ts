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
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Obtener información de la semana actual
      const currentWeekInfo = MenuService.getCurrentWeekInfo()
      
      // Obtener menú semanal con precios según tipo de usuario
      const menuData = await MenuService.getWeeklyMenuForUser(user.tipoUsuario, weekStart)
      
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
  }, [user, weekStart])

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