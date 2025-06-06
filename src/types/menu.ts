import { MenuItem, DayMenu } from './panel'

export interface WeeklyMenuData {
  weekStart: string
  weekEnd: string
  days: DayMenu[]
  isLoading: boolean
  isEmpty: boolean
}

export interface MenuViewState {
  currentWeek: string
  isLoading: boolean
  error: string | null
  hasData: boolean
}

export interface MenuItemDisplay extends MenuItem {
  isHighlighted?: boolean
  nutritionalInfo?: {
    calories?: number
    protein?: string
    carbs?: string
    allergens?: string[]
  }
}

export interface DayMenuDisplay extends Omit<DayMenu, 'almuerzos' | 'colaciones'> {
  almuerzos: MenuItemDisplay[]
  colaciones: MenuItemDisplay[]
  hasItems: boolean
  dayLabel: string
  dateFormatted: string
}

export type MenuLoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface MenuError {
  type: 'network' | 'auth' | 'data' | 'unknown'
  message: string
  code?: string
}
