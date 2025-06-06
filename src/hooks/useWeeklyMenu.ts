"use client"

import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { DayMenuDisplay, MenuLoadingState, MenuError } from '@/types/menu'
import { MenuItem } from '@/types/panel'
import { startOfWeek, endOfWeek, format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

interface UseWeeklyMenuReturn {
  weekMenu: DayMenuDisplay[]
  isLoading: boolean
  error: MenuError | null
  weekRange: string
  refreshMenu: () => Promise<void>
  isEmpty: boolean
}

export function useWeeklyMenu(): UseWeeklyMenuReturn {
  const [weekMenu, setWeekMenu] = useState<DayMenuDisplay[]>([])
  const [loadingState, setLoadingState] = useState<MenuLoadingState>('idle')
  const [error, setError] = useState<MenuError | null>(null)
  const [weekRange, setWeekRange] = useState('')

  const loadWeekMenu = async () => {
    setLoadingState('loading')
    setError(null)

    try {
      const today = new Date()
      const weekStart = startOfWeek(today, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 })

      // Formatear rango de fechas para mostrar
      const startFormatted = format(weekStart, 'd', { locale: es })
      const endFormatted = format(weekEnd, 'd \'de\' MMMM', { locale: es })
      setWeekRange(`Semana del ${startFormatted} al ${endFormatted}`)

      // Consultar Firestore por menús de la semana
      const menuQuery = query(
        collection(db, 'menus'),
        where('date', '>=', format(weekStart, 'yyyy-MM-dd')),
        where('date', '<=', format(weekEnd, 'yyyy-MM-dd')),
        orderBy('date'),
        orderBy('type')
      )

      const querySnapshot = await getDocs(menuQuery)
      const menuItems: (MenuItem & { date: string; day: string })[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        menuItems.push({
          id: doc.id,
          code: data.code,
          name: data.name,
          description: data.description,
          type: data.type,
          price: data.price,
          available: data.available ?? true,
          date: data.date,
          day: data.day
        })
      })

      // Si no hay datos en Firestore, generar datos de ejemplo
      if (menuItems.length === 0) {
        const mockMenuItems = generateMockWeekMenu(weekStart)
        menuItems.push(...mockMenuItems)
      }

      // Agrupar por día
      const groupedByDay = groupMenuItemsByDay(menuItems, weekStart)
      setWeekMenu(groupedByDay)
      setLoadingState('success')

    } catch (err) {
      console.error('Error al cargar el menú:', err)
      setError({
        type: 'network',
        message: 'No se pudo cargar el menú semanal. Por favor, intenta nuevamente.',
        code: 'MENU_LOAD_ERROR'
      })
      setLoadingState('error')
    }
  }

  const generateMockWeekMenu = (weekStart: Date): (MenuItem & { date: string; day: string })[] => {
    const mockItems: (MenuItem & { date: string; day: string })[] = []
    const dayNames = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes']

    for (let i = 0; i < 5; i++) {
      const currentDay = addDays(weekStart, i)
      const dateStr = format(currentDay, 'yyyy-MM-dd')
      const dayName = dayNames[i]

      // Almuerzos
      mockItems.push(
        {
          id: `almuerzo-${i}-1`,
          code: 'A1',
          name: 'Pollo al horno con papas',
          description: 'Pollo al horno con papas doradas, ensalada mixta y postre del día',
          type: 'almuerzo',
          price: 5500,
          available: true,
          date: dateStr,
          day: dayName
        },
        {
          id: `almuerzo-${i}-2`,
          code: 'A2',
          name: 'Pescado a la plancha',
          description: 'Pescado fresco a la plancha con arroz pilaf y verduras al vapor',
          type: 'almuerzo',
          price: 5500,
          available: true,
          date: dateStr,
          day: dayName
        },
        {
          id: `almuerzo-${i}-3`,
          code: 'A3',
          name: 'Pasta con salsa boloñesa',
          description: 'Pasta fresca con salsa boloñesa casera y queso parmesano',
          type: 'almuerzo',
          price: 5500,
          available: i !== 2, // Miércoles no disponible
          date: dateStr,
          day: dayName
        }
      )

      // Colaciones
      mockItems.push(
        {
          id: `colacion-${i}-1`,
          code: 'C1',
          name: 'Sándwich de pavo',
          description: 'Sándwich integral con pavo, palta, tomate y lechuga',
          type: 'colacion',
          price: 2000,
          available: true,
          date: dateStr,
          day: dayName
        },
        {
          id: `colacion-${i}-2`,
          code: 'C2',
          name: 'Ensalada de frutas',
          description: 'Mix de frutas frescas de temporada con yogurt natural',
          type: 'colacion',
          price: 2000,
          available: true,
          date: dateStr,
          day: dayName
        }
      )
    }

    return mockItems
  }

  const groupMenuItemsByDay = (items: (MenuItem & { date: string; day: string })[], weekStart: Date): DayMenuDisplay[] => {
    const days: DayMenuDisplay[] = []

    for (let i = 0; i < 5; i++) {
      const currentDay = addDays(weekStart, i)
      const dateStr = format(currentDay, 'yyyy-MM-dd')
      const dayName = format(currentDay, 'EEEE', { locale: es })
      const dayItems = items.filter(item => item.date === dateStr)

      const almuerzos = dayItems.filter(item => item.type === 'almuerzo')
      const colaciones = dayItems.filter(item => item.type === 'colacion')

      days.push({
        date: dateStr,
        day: dayName,
        almuerzos,
        colaciones,
        hasItems: almuerzos.length > 0 || colaciones.length > 0,
        dayLabel: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        dateFormatted: format(currentDay, 'd \'de\' MMMM', { locale: es })
      })
    }

    return days
  }

  const refreshMenu = async () => {
    await loadWeekMenu()
  }

  useEffect(() => {
    loadWeekMenu()
  }, [])

  return {
    weekMenu,
    isLoading: loadingState === 'loading',
    error,
    weekRange,
    refreshMenu,
    isEmpty: weekMenu.length === 0 && loadingState === 'success'
  }
}
