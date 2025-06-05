import { Database } from './database.types'

export type { Database }

// Export specific table types for easier use
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Student = Database['public']['Tables']['students']['Row']
export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type StudentUpdate = Database['public']['Tables']['students']['Update']

export type SystemConfig = Database['public']['Tables']['system_config']['Row']

// Export enums
export type UserRole = Database['public']['Enums']['user_role']
export type StudentLevel = Database['public']['Enums']['student_level']
export type UserType = Database['public']['Enums']['user_type']
export type PaymentStatus = Database['public']['Enums']['payment_status']
export type OrderStatus = Database['public']['Enums']['order_status']
export type MenuCategory = Database['public']['Enums']['menu_category']

// Helper types for the application
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: string | null;
  loginCount: number;
  students: Student[];
}

export interface StudentFormData {
  name: string;
  grade: string;
  section: string;
  level: StudentLevel;
  userType: UserType;
  rut: string;
  dietaryRestrictions: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}