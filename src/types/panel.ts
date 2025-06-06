export interface MenuItem {
  id: string
  code: string
  name: string
  description: string
  type: 'almuerzo' | 'colacion'
  price: number
  available: boolean
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

export interface OrderSelection {
  date: string
  almuerzo?: MenuItem
  colacion?: MenuItem
}

export interface OrderSummary {
  selections: OrderSelection[]
  totalAlmuerzos: number
  totalColaciones: number
  subtotalAlmuerzos: number
  subtotalColaciones: number
  total: number
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  userType: 'estudiante' | 'funcionario'
  children?: Child[]
}

export interface Child {
  id: string
  name: string
  age: number
  class: string
  level: 'basico' | 'medio'
}

export interface Order {
  id: string
  userId: string
  weekStart: string
  selections: OrderSelection[]
  total: number
  status: 'pending' | 'paid' | 'cancelled'
  createdAt: Date
  paidAt?: Date
}

export type UserType = 'estudiante' | 'funcionario'

export const PRICES: Record<UserType, { almuerzo: number; colacion: number }> = {
  estudiante: { almuerzo: 5500, colacion: 2000 },
  funcionario: { almuerzo: 4875, colacion: 1800 }
}
