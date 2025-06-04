import { Database } from './database.types'

// Re-export database types
export * from './database.types'

// Extended types for the application
export interface GuardianWithStudents {
  students: Database['public']['Tables']['students']['Row'][]
}

export type GuardianWithStudentsType = Database['public']['Tables']['guardians']['Row'] & GuardianWithStudents

export type OrderWithDetails = Database['public']['Tables']['orders']['Row'] & {
  student: Database['public']['Tables']['students']['Row']
  guardian: Database['public']['Tables']['guardians']['Row']
  order_items: (Database['public']['Tables']['order_items']['Row'] & {
    product: Database['public']['Tables']['products']['Row']
  })[]
  payment?: Database['public']['Tables']['payments']['Row']
}

export type ProductRow = Database['public']['Tables']['products']['Row']

export interface ProductWithAvailability extends ProductRow {
  can_order: boolean
  is_available_today: boolean
}

// Form types
export interface RegisterFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface StudentFormData {
  name: string
  grade: string
  section: string
  level: Database['public']['Enums']['grade_level']
  dietary_restrictions?: string
  allergies?: string
}

export interface OrderFormData {
  student_id: string
  delivery_date: string
  products: {
    product_id: string
    quantity: number
  }[]
  notes?: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Dashboard types
export interface DashboardStats {
  total_orders: number
  total_amount: number
  pending_orders: number
  paid_orders: number
  orders_by_grade: Record<string, {
    count: number
    amount: number
  }>
}

export interface KitchenReport {
  product_name: string
  product_type: Database['public']['Enums']['product_type']
  total_quantity: number
  orders_by_grade: Record<string, {
    quantity: number
    students: string[]
  }>
}

// GetNet types
export interface GetNetPaymentRequest {
  amount: number
  order_id: string
  customer: {
    name: string
    email: string
    phone?: string
  }
  return_url: string
  notify_url: string
}

export interface GetNetPaymentResponse {
  payment_id: string
  checkout_url: string
  status: string
}

export interface GetNetWebhookPayload {
  payment_id: string
  order_id: string
  status: string
  amount: number
  transaction_id?: string
  processed_at: string
  gateway_response: Record<string, any>
}

// Utility types
export type CreateOrderInput = Database['public']['Tables']['orders']['Insert']
export type UpdateOrderInput = Database['public']['Tables']['orders']['Update']
export type CreateStudentInput = Database['public']['Tables']['students']['Insert']
export type UpdateStudentInput = Database['public']['Tables']['students']['Update']

// Filter types
export interface OrderFilters {
  date_from?: string
  date_to?: string
  status?: Database['public']['Enums']['order_status']
  grade?: string
  student_id?: string
  guardian_id?: string
}

export interface ProductFilters {
  type?: Database['public']['Enums']['product_type']
  date?: string
  is_active?: boolean
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

// Navigation types
export interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  disabled?: boolean
  external?: boolean
}

export interface SidebarNavItem extends NavItem {
  items?: NavItem[]
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Notification types
export interface NotificationData {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Email types
export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
}

export interface OrderConfirmationEmailData {
  guardian_name: string
  student_name: string
  order_number: string
  delivery_date: string
  total_amount: number
  items: {
    name: string
    quantity: number
    price: number
  }[]
}