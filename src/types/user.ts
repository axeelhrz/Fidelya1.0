import { Timestamp } from 'firebase/firestore';


export interface UserSubscription {
  type: 'basic' | 'pro' | 'enterprise';
  plan: string;
  status: 'active' | 'inactive' | 'trial';
  startDate: Timestamp;
  endDate: Timestamp;
}

// Tipos de roles de usuario
export type UserRole = 'admin' | 'agent' | 'user';

// Estado de la cuenta
export type AccountStatus = 'active' | 'suspended' | 'pending' | 'inactive';

// Preferencias de notificación
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  emailExpiration: boolean;
  emailNewPolicy: boolean;
  emailPayment: boolean;
}

export interface UserSettings {
  notifications: boolean;
  theme: 'light' | 'dark';
  language: string;
}

// Preferencias de apariencia
export interface AppearancePreferences {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  sidebarCollapsed: boolean;
  denseMode: boolean;
  language: string;
}

// Información de suscripción
export interface UserSubscription {
  type: 'basic' | 'pro' | 'enterprise';
  plan: string;
  status: 'active' | 'inactive' | 'trial';
  startDate: Timestamp;
  endDate: Timestamp;
  planId: string;
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Timestamp;
}

// Información de facturación
export interface BillingInfo {
  companyName?: string;
  taxId?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

// Estadísticas del usuario
export interface UserStats {
  lastActive: Date;
  lastLoginAt: Timestamp;
  totalPolicies: number;
  activePolicies: number;
  totalClients: number;
  activeClients: number;
  totalClaims: number;
  totalInvoices: number;
  totalPayments: number;
  totalIncome: number;
  pendingClaims: number;
}

// Permisos del usuario
interface UserPermissions {
  canCreatePolicies: boolean;
  canDeletePolicies: boolean;
  canManageClients: boolean;
  canAccessReports: boolean;
  canManageUsers: boolean;
  canManageRoles: boolean;
  canManageSettings: boolean;
  canViewDashboard: boolean;
}

// Información de la agencia (para agentes)
export interface AgencyInfo {
  agencyId: string;
  agencyName: string;
  licenseNumber: string;
  licenseExpiry: Timestamp;
  territory: string[];
  specializations: string[];
}

// Interfaz principal de Usuario
export type User = {
  isOnline?: boolean;
  lastSeen?: Timestamp;
  subscription?: UserSubscription;
  id: string;
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  emailVerified: boolean;
  phoneNumber: string;
  photoURL: string;
  avatar?: string;
  plan?: 'basic' | 'pro' | 'enterprise';
  planStatus?: 'active' | 'pending' | 'expired';
  paypalSubscriptionId?: string;
  
  // Preferencias
  notifications: NotificationPreferences;
  appearance: AppearancePreferences;
  
  // Información de negocio
  billing?: BillingInfo;
  agency?: AgencyInfo;
  
  // Estadísticas y métricas
  stats: UserStats;
  
  // Permisos y seguridad
  permissions: UserPermissions;
  twoFactorEnabled: boolean;
  
  // Metadatos adicionales
  metadata?: Record<string, string | number | boolean | null>;
}

// Tipo para actualización parcial de usuario
export type UserUpdate = Partial<Omit<User, 'id' | 'createdAt'>>;

// Interfaz para el contexto de autenticación
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (userData: UserSignUpData) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: UserUpdate) => Promise<void>;
  verifyEmail: () => Promise<void>;
  setTwoFactorAuth: (enabled: boolean) => Promise<void>;
}

// Interfaz para datos de registro
export interface UserSignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
  agencyInfo?: Omit<AgencyInfo, 'agencyId'>;
}

// Interfaz para respuesta de autenticación
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Estado de sesión
export interface SessionState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: Error | null;
}

// Interfaz para tokens
export interface TokenInfo {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

// Interfaz para el resultado de verificación de token
export interface TokenVerificationResult {
  valid: boolean;
  expired: boolean;
  decoded?: {
    uid: string;
    role: UserRole;
    exp: number;
  };
}

// Interfaz para el historial de actividad del usuario
export interface UserActivity {
  id: string;
  userId: string;
  type: 'login' | 'logout' | 'profile_update' | 'password_change' | 'policy_create' | 'client_create';
  timestamp: Timestamp;
  metadata?: Record<string, string | number | boolean | null>;
  ipAddress?: string;
  userAgent?: string;
}

// Interfaz para las métricas de rendimiento del usuario
export interface UserPerformance {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  metrics: {
    policiesSold: number;
    revenue: number;
    clientsAcquired: number;
    tasksCompleted: number;
    conversionRate: number;
  };
  timestamp: Timestamp;
}

// Interfaz para notificaciones del usuario
export interface UserNotification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
  action?: {
    label: string;
    url: string;
  };
}

// Interfaz para dispositivos autorizados
export interface AuthorizedDevice {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  ipAddress: string;
  lastUsedAt: Timestamp;
  isCurrentDevice: boolean;
}

// Constantes
export const USER_ROLES = ['admin', 'agent', 'user'] as const;
export const ACCOUNT_STATUSES = ['active', 'suspended', 'pending', 'inactive'] as const;
export const DEFAULT_PERMISSIONS: UserPermissions = {
  canCreatePolicies: true,
  canDeletePolicies: false,
  canManageClients: true,
  canAccessReports: true,
  canManageUsers: false,
  canManageRoles: false,
  canManageSettings: true,
  canViewDashboard: true,
};

// Utilidades de tipo
export type UserWithoutSensitiveData = Omit<User, 'metadata' | 'permissions'>;
export type UserProfileUpdate = Pick<User, 'firstName' | 'lastName' | 'phoneNumber' | 'photoURL'>;