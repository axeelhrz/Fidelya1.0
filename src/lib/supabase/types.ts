import { Database } from './database.types'

export type { Database }

// Export specific table types for easier use
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Student = Database['public']['Tables']['students']['Row']
export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type StudentUpdate = Database['public']['Tables']['students']['Update']

export type MenuItem = Database['public']['Tables']['menu_items']['Row']
export type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert']
export type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update']

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

export type PaymentTransaction = Database['public']['Tables']['payment_transactions']['Row']
export type PaymentTransactionInsert = Database['public']['Tables']['payment_transactions']['Insert']
export type PaymentTransactionUpdate = Database['public']['Tables']['payment_transactions']['Update']

export type Permission = Database['public']['Tables']['permissions']['Row']
export type Role = Database['public']['Tables']['roles']['Row']
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row']
export type SystemConfig = Database['public']['Tables']['system_config']['Row']

// Export enums
export type UserRole = Database['public']['Enums']['user_role']
export type PaymentStatus = Database['public']['Enums']['payment_status']
export type OrderStatus = Database['public']['Enums']['order_status']
export type MenuCategory = Database['public']['Enums']['menu_category']
export type StudentLevel = Database['public']['Enums']['student_level']
export type UserType = Database['public']['Enums']['user_type']

// Helper types for the application
export interface StudentWithGuardian extends Student {
  guardian?: User
}

export interface OrderWithDetails extends Order {
  students?: Student
  menu_item?: MenuItem
  guardian?: User
  estado_items?: {
    id: string
    order_id: string
    menu_item_id: string
    status: OrderStatus
    created_at: string
    updated_at: string
  }
  users?: User
  menu_items?: MenuItem[]
  estado_pago: {
    id: string
    order_id: string
    status: PaymentStatus
    transaction_id: string
    amount: number
    currency: string
    created_at: string
    updated_at: string
  }
}

export interface MenuOptionForWeek {
  id: string
  name: string
  description: string
  category: MenuCategory
  price_student: number
  price_staff: number
  available_date: string
  day_name: string
  day_type: string
  code?: string
  is_available: boolean
  max_orders?: number
  current_orders: number
}

export interface WeeklyMenuSelection {
  [date: string]: {
    almuerzo?: string
    colacion?: string
  }
}

export interface OrderSummaryItem {
  studentId: string
  studentName: string
  date: string
  menuType: MenuCategory
  menuItem: MenuOptionForWeek
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface PaymentSummary {
  transactionId: string
  totalAmount: number
  currency: string
  orders: OrderSummaryItem[]
  paymentUrl?: string
  status: PaymentStatus
}

// Dashboard types
export interface DashboardStats {
  totalOrders: number
  ordersToday: number
  pendingOrders: number
  totalRevenue: number
  activeUsers: number
  completionRate: number
  averageOrderValue: number
}

export interface RecentActivity {
  id: string
  type: 'order' | 'payment' | 'user' | 'system'
  message: string
  timestamp: string
  user?: string
  details?: Record<string, unknown>
}

export interface ChartDataPoint {
  date: string
  orders: number
  revenue: number
  label?: string
}

// User profile types
export interface UserProfile {
  id: string
  email: string
  fullName: string
  phone?: string
  role: UserRole
  isActive: boolean
  lastLogin?: string
  loginCount: number
  students: Student[]
  permissions: string[]
  roleInfo?: {
    displayName: string
    description: string
    color: string
  }
}

// Form types
export interface StudentFormData {
  name: string
  grade: string
  section: string
  level: StudentLevel
  userType: UserType
  rut?: string
  dietaryRestrictions?: string
}

export interface UserRegistrationData {
  email: string
  password: string
  fullName: string
  phone: string
  students: StudentFormData[]
}

export interface OrderFormData {
  studentId: string
  menuItemId: string
  deliveryDate: string
  quantity: number
  notes?: string
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = unknown> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

// Filter and search types
export interface OrderFilters {
  status?: OrderStatus[]
  paymentStatus?: PaymentStatus[]
  dateFrom?: string
  dateTo?: string
  studentId?: string
  guardianId?: string
}

export interface UserFilters {
  role?: UserRole[]
  isActive?: boolean
  search?: string
}

export interface MenuFilters {
  category?: MenuCategory[]
  dateFrom?: string
  dateTo?: string
  isAvailable?: boolean
}

// Configuration types
export interface AppConfig {
  appName: string
  appVersion: string
  maintenanceMode: boolean
  maxOrdersPerDay: number
  orderDeadlineHours: number
  paymentMethods: string[]
  defaultPrices: {
    almuerzoEstudiante: number
    almuerzoFuncionario: number
    colacion: number
  }
  businessHours: {
    start: string
    end: string
  }
  contactInfo: {
    email: string
    phone: string
  }
}

// Notification types
export interface NotificationData {
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Export utility functions types
export interface DateRange {
  start: Date
  end: Date
}

export interface WeekInfo {
  start: Date
  end: Date
  weekNumber: number
  year: number
  days: Date[]
}