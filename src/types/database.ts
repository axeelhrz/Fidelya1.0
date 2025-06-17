// Tipos genéricos para la base de datos
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  loginCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  guardianId: string;
  name: string;
  grade: string;
  section: string;
  level: StudentLevel;
  userType: UserType;
  rut?: string;
  dietaryRestrictions?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  priceStudent: number;
  priceStaff: number;
  availableDate: string;
  dayName: string;
  dayType: string;
  code?: string;
  isAvailable: boolean;
  maxOrders?: number;
  currentOrders: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  guardianId: string;
  studentId: string;
  menuItemId: string;
  deliveryDate: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  paymentMethod?: string;
  paymentUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  guardianId: string;
  totalAmount: number;
  currency: string;
  paymentMethod?: string;
  paymentStatus: PaymentStatus;
  gatewayResponse?: Record<string, unknown>;
  gatewayTransactionId?: string;
  paymentUrl?: string;
  expiresAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Enums
export type UserRole = 'user' | 'viewer' | 'moderator' | 'admin' | 'super_admin';
export type StudentLevel = 'basica' | 'media';
export type UserType = 'estudiante' | 'funcionario';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'delivered';
export type MenuCategory = 'almuerzo' | 'colacion';

// Helper types
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
  isStaff?: boolean; // Nuevo campo para identificar funcionarios
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

export interface WeeklyMenuSelection {
  [date: string]: {
    almuerzo?: string;
    colacion?: string;
  };
}

export interface OrderSummaryItem {
  studentId: string;
  studentName: string;
  studentType: UserType; // Nuevo campo para distinguir tipo
  date: string;
  menuType: 'almuerzo' | 'colacion';
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Nuevos tipos para manejo de precios diferenciados
export interface PricingInfo {
  studentPrice: number;
  staffPrice: number;
  userType: UserType;
  finalPrice: number;
}

export interface MenuItemWithPricing extends MenuItem {
  pricing: PricingInfo;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Utilidades para cálculo de precios
export const calculatePrice = (menuItem: MenuItem, userType: UserType): number => {
  return userType === 'funcionario' ? menuItem.priceStaff : menuItem.priceStudent;
};

export const getPricingInfo = (menuItem: MenuItem, userType: UserType): PricingInfo => {
  return {
    studentPrice: menuItem.priceStudent,
    staffPrice: menuItem.priceStaff,
    userType,
    finalPrice: calculatePrice(menuItem, userType)
  };
};