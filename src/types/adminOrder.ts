import { OrderState } from './order'
import { User } from './panel'

export interface AdminOrderView extends OrderState {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    userType: 'estudiante' | 'funcionario'
  }
  dayName: string
  formattedDate: string
  itemsCount: number
  hasColaciones: boolean
}

export interface OrderFilters {
  weekStart?: string
  day?: string
  userType?: 'estudiante' | 'funcionario' | 'all'
  status?: 'pending' | 'paid' | 'all'
  searchTerm?: string
}

export interface OrderMetrics {
  totalOrders: number
  totalRevenue: number
  totalByDay: Record<string, number>
  totalByUserType: Record<string, number>
  averageOrderValue: number
  pendingOrders: number
  paidOrders: number
}

export interface WeekOption {
  value: string
  label: string
  start: Date
  end: Date
  isCurrent: boolean
}

export interface DayOption {
  value: string
  label: string
  date: string
}

export interface ExportOptions {
  format: 'excel' | 'pdf'
  includeDetails: boolean
  groupByDay: boolean
}

export interface OrderUpdateRequest {
  orderId: string
  status?: 'pending' | 'paid' | 'cancelled'
  notes?: string
}

export interface OrderDetailView extends AdminOrderView {
  selections: Array<{
    date: string
    dayName: string
    almuerzo?: {
      code: string
      name: string
      price: number
    }
    colacion?: {
      code: string
      name: string
      price: number
    }
  }>
  paymentHistory: Array<{
    date: Date
    status: string
    amount: number
    method?: string
  }>
}
