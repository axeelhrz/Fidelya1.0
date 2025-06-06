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
  const [weekStats, setWeekStats] = useState<any>(null)
  const { toast } = useToast()

  // Inicializar con la semana actual
  useEffect(() => {
    try {
      const currentWeekStart = AdminMenuService.getCurrentWeekStart()
      setCurrentWeek(currentWeekStart)
    } catch (err) {
      console.error('Error initializing current week:', err)
      setError('Error al inicializar la semana actual')
    }
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
      
      // Cargar menú y estadísticas en paralelo
      const [menu, stats] = await Promise.all([
        AdminMenuService.getWeeklyMenu(weekStart),
        AdminMenuService.getWeekStats(weekStart)
      ])
      
      setWeekMenu(menu)
      setWeekStats(stats)
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
    try {
      const navigation = AdminMenuService.getWeekNavigation(currentWeek)
      
      if (direction === 'next' && navigation.canGoForward) {
        const nextWeek = AdminMenuService.getNextWeek(currentWeek)
        setCurrentWeek(nextWeek)
      } else if (direction === 'prev' && navigation.canGoBack) {
        const prevWeek = AdminMenuService.getPreviousWeek(currentWeek)
        setCurrentWeek(prevWeek)
      }
    } catch (err) {
      console.error('Error navigating week:', err)
      toast({
        title: 'Error',
        description: 'Error al navegar entre semanas',
        variant: 'destructive'
      })
    }
  }, [currentWeek, toast])

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

  const deleteMenuItem = useCallback(async (item: AdminMenuItem): Promise<MenuOperationResult> => {
    try {
      if (!item.id) {
        return {
          success: false,
          message: 'ID del menú no válido'
        }
      }

      const result = await AdminMenuService.deleteMenuItem(item.id)
      
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
      
      toast({
        title: result.success ? 'Éxito' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive'
      })
      
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

  const toggleWeekPublication = useCallback(async (publish: boolean): Promise<MenuOperationResult> => {
    try {
      const result = await AdminMenuService.toggleWeekMenuPublication(currentWeek, publish)
      
      if (result.success) {
        toast({
          title: 'Éxito',
          description: result.message
        })
        // Recargar el menú para reflejar los cambios
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
      const errorMessage = 'Error al cambiar el estado de publicación'
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

  const deleteWeekMenu = useCallback(async (): Promise<MenuOperationResult> => {
    try {
      const result = await AdminMenuService.deleteWeekMenu(currentWeek)
      
      if (result.success) {
        toast({
          title: 'Éxito',
          description: result.message
        })
        // Recargar el menú para reflejar los cambios
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
      const errorMessage = 'Error al eliminar el menú semanal'
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

  const refreshMenu = useCallback(() => {
    if (currentWeek) {
      loadWeekMenu(currentWeek)
    }
  }, [currentWeek, loadWeekMenu])

  const getWeekNavigation = useCallback(() => {
    try {
      return AdminMenuService.getWeekNavigation(currentWeek)
    } catch (err) {
      console.error('Error getting week navigation:', err)
      // Fallback navigation
      return {
        currentWeek,
        canGoBack: true,
        canGoForward: true,
        weekLabel: 'Semana actual'
      }
    }
  }, [currentWeek])

  return {
    // Estado
    currentWeek,
    weekMenu,
    weekStats,
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
    
    // Operaciones de semana
    toggleWeekPublication,
    deleteWeekMenu,
    
    // Utilidades
    refreshMenu
  }
}