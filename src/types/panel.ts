export interface MenuItem {
  id: string
  code: string
  name: string
  description: string
  type: 'almuerzo' | 'colacion'
  price: number
  available: boolean
  image?: string
  date: string
  dia: string
  active: boolean
}

export interface DayMenu {
  date: string
  day: string
  almuerzos: MenuItem[]
  colaciones: MenuItem[]
}

export interface WeekMenu {
  weekStart: string
  weekEnd: string
  days: DayMenu[]
}

export interface Child {
  id: string
  name: string
  curso: string
  rut?: string
  active: boolean
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  tipoUsuario: 'apoderado' | 'funcionario'
  children?: Child[]
  active: boolean
  createdAt: Date
}

export interface OrderSelectionByChild {
  date: string
  dia: string
  fecha: string
  hijo: Child | null // null para funcionarios
  almuerzo?: MenuItem
  colacion?: MenuItem
}

export interface OrderSelection {
  date: string
  almuerzo?: MenuItem
  colacion?: MenuItem
}

export interface OrderSummaryByChild {
  selections: OrderSelectionByChild[]
  totalAlmuerzos: number
  totalColaciones: number
  subtotalAlmuerzos: number
  subtotalColaciones: number
  total: number
  resumenPorHijo: {
    [hijoId: string]: {
      hijo: Child
      almuerzos: number
      colaciones: number
      subtotal: number
    }
  }
}

export interface OrderSummary {
  selections: OrderSelection[]
  totalAlmuerzos: number
  totalColaciones: number
  subtotalAlmuerzos: number
  subtotalColaciones: number
  total: number
}

export interface Order {
  id: string
  userId: string
  tipoUsuario: 'apoderado' | 'funcionario'
  weekStart: string
  fechaCreacion: Date
  resumenPedido: OrderSelectionByChild[]
  total: number
  status: 'pendiente' | 'pagado' | 'cancelado'
  createdAt: Date
  paidAt?: Date
  paymentId?: string
}

export type UserType = 'apoderado' | 'funcionario'

// Precios actualizados según especificaciones
export const PRICES: Record<UserType, { almuerzo: number; colacion: number }> = {
  apoderado: { almuerzo: 5500, colacion: 5500 },
  funcionario: { almuerzo: 4875, colacion: 4875 }
}