export interface AdminMenuItem {
  id?: string
  code: string
  description: string
  type: 'almuerzo' | 'colacion'
  date: string
  day: string
  weekStart: string
  active: boolean
  published: boolean
  price?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface AdminDayMenu {
  date: string
  day: string
  dayName: string
  almuerzos: AdminMenuItem[]
  colaciones: AdminMenuItem[]
  isEditable: boolean
}

export interface AdminWeekMenu {
  weekStart: string
  weekEnd: string
  weekLabel: string
  days: AdminDayMenu[]
  isPublished: boolean
  totalItems: number
}

export interface MenuFormData {
  type: 'almuerzo' | 'colacion'
  code: string
  description: string
  active: boolean
  price?: number
}

export interface WeekNavigation {
  currentWeek: string
  canGoBack: boolean
  canGoForward: boolean
  weekLabel: string
}

export interface MenuValidationError {
  field: string
  message: string
}

export interface MenuOperationResult<T = unknown> {
  success: boolean
  message: string
  data?: T
  errors?: MenuValidationError[]
}

export type MenuModalMode = 'create' | 'edit' | 'view'

export interface MenuModalState {
  isOpen: boolean
  mode: MenuModalMode
  item?: AdminMenuItem
  date: string
  day: string
  type?: 'almuerzo' | 'colacion'
}

// Configuración del menú de colaciones predeterminado
export interface DefaultColacionConfig {
  code: string
  description: string
  price: number
  active: boolean
}

export const DEFAULT_COLACIONES: DefaultColacionConfig[] = [
  {
    code: 'C1',
    description: 'Yogurt con Granola + Jugo 200 cc',
    price: 3100,
    active: true
  },
  {
    code: 'C2', 
    description: 'Yogurt con Granola + Agua Saborizada 200 cc',
    price: 3100,
    active: true
  },
  {
    code: 'C3',
    description: 'Miga Ave Mayo + Jugo 200 cc',
    price: 2800,
    active: true
  },
  {
    code: 'C4',
    description: 'Miga Aliado (Jamón de Pavo + Queso) + Leche Semidescremada 200 cc',
    price: 2850,
    active: true
  },
  {
    code: 'C8',
    description: 'Barra Cereal Saludable + Jugo 200 cc',
    price: 1500,
    active: true
  },
  {
    code: 'C9',
    description: 'Barra Cereal Saludable + Leche Semidescremada',
    price: 1800,
    active: true
  }
]