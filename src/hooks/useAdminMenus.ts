import { useState, useEffect, useCallback } from 'react'
import { AdminMenuService } from '@/services/adminMenuService'
import { AdminWeekMenu, AdminMenuItem, MenuModalState, MenuOperationResult } from '@/types/adminMenu'
import { useToast } from '@/hooks/use-toast'

export function useAdminMenus() {
  const [currentWeek, setCurrentWeek] = useState<string>('')
  const [weekMenu, setWeekMenu] = useState<AdminWeekMenu | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalState, setModalState] = useState<MenuModalState>({
    isOpen: false,
    mode: 'create',
    date: '',
    day: ''
  })
  const { toast } = useToast()

  // Inicializar con la semana actual
  useEffect(() => {
    const currentWeekStart = AdminMenuService.getCurrentWeekStart()
    setCurrentWeek(currentWeekStart)
  }, [])

  // Cargar menú cuando cambia la semana
  useEffect(() => {
    if (currentWeek) {
      loadWeekMenu(currentWeek)
    }
  }, [currentWeek])

  const loadWeekMenu = useCallback(async (weekStart: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const menu = await AdminMenuService.getWeeklyMenu(weekStart)
      setWeekMenu(menu)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el menú'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const navigateWeek = useCallback((direction: 'next' | 'prev') => {
    const navigation = AdminMenuService.getWeekNavigation(currentWeek)
    
    if (direction === 'next' && navigation.canGoForward) {
      const nextWeek = AdminMenuService.getNextWeek(currentWeek)
      setCurrentWeek(nextWeek)
    } else if (direction === 'prev' && navigation.canGoBack) {
      const prevWeek = AdminMenuService.getPreviousWeek(currentWeek)
      setCurrentWeek(prevWeek)
    }
  }, [currentWeek])

  const openModal = useCallback((
    mode: 'create' | 'edit',
    date: string,
    day: string,
    type?: 'almuerzo' | 'colacion',
    item?: AdminMenuItem
  ) => {
    setModalState({
      isOpen: true,
      mode,
      date,
      day,
      type,
      item
    })
  }, [])

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: 'create',
      date: '',
      day: ''
    })
  }, [])

  const createMenuItem = useCallback(async (itemData: Omit<AdminMenuItem, 'id'>): Promise<MenuOperationResult> => {
    try {
      const result = await AdminMenuService.createMenuItem(itemData)
      
      if (result.success) {
        toast({
          title: 'Éxito',
          description: result.message
        })
        // Recargar el menú para mostrar el nuevo item
        await loadWeekMenu(currentWeek)
        closeModal()
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
      
      return result
    } catch (error) {
      const errorMessage = 'Error al crear el menú'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      return {
        success: false,
        message: errorMessage
      }
    }
  }, [currentWeek, loadWeekMenu, closeModal, toast])

  const updateMenuItem = useCallback(async (id: string, updates: Partial<AdminMenuItem>): Promise<MenuOperationResult> => {
    try {
      const result = await AdminMenuService.updateMenuItem(id, updates)
      
      if (result.success) {
        toast({
          title: 'Éxito',
          description: result.message
        })
        // Recargar el menú para mostrar los cambios
        await loadWeekMenu(currentWeek)
        closeModal()
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
      
      return result
    } catch (error) {
      const errorMessage = 'Error al actualizar el menú'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      return {
        success: false,
        message: errorMessage
      }
    }
  }, [currentWeek, loadWeekMenu, closeModal, toast])

  const deleteMenuItem = useCallback(async (id: string): Promise<MenuOperationResult> => {
    try {
      const result = await AdminMenuService.deleteMenuItem(id)
      
      if (result.success) {
        toast({
          title: 'Éxito',
          description: result.message
        })
        // Recargar el menú para reflejar la eliminación
        await loadWeekMenu(currentWeek)
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
      
      return result
    } catch (error) {
      const errorMessage = 'Error al eliminar el menú'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      return {
        success: false,
        message: errorMessage
      }
    }
  }, [currentWeek, loadWeekMenu, toast])

  const duplicateWeek = useCallback(async (targetWeek: string): Promise<MenuOperationResult> => {
    try {
      const result = await AdminMenuService.duplicateWeekMenu(currentWeek, targetWeek)
      
      if (result.success) {
        toast({
          title: 'Éxito',
          description: result.message
        })
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
      
      return result
    } catch (error) {
      const errorMessage = 'Error al duplicar el menú semanal'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      return {
        success: false,
        message: errorMessage
      }
    }
  }, [currentWeek, toast])

  const refreshMenu = useCallback(() => {
    if (currentWeek) {
      loadWeekMenu(currentWeek)
    }
  }, [currentWeek, loadWeekMenu])

  const getWeekNavigation = useCallback(() => {
    return AdminMenuService.getWeekNavigation(currentWeek)
  }, [currentWeek])

  return {
    // Estado
    currentWeek,
    weekMenu,
    isLoading,
    error,
    modalState,
    
    // Navegación
    navigateWeek,
    getWeekNavigation,
    
    // Modal
    openModal,
    closeModal,
    
    // CRUD Operations
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    duplicateWeek,
    
    // Utilidades
    refreshMenu
  }
}
