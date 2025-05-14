import { Timestamp } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { PlanId, SubscriptionStatus } from './subscription';

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

// Preferencias de apariencia
export interface AppearancePreferences {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  sidebarCollapsed: boolean;
  denseMode: boolean;
  language: string;
}

// Información de suscripción integrada en el usuario
export interface UserSubscriptionInfo {
  status: SubscriptionStatus;
  planId: PlanId;
  plan: string;
  paypalSubscriptionId?: string | null;
  paypalPlanId?: string | null;
  currentPeriodStart?: Timestamp;
  currentPeriodEnd?: Timestamp;
  trialEnd?: Timestamp | null;
  cancelAtPeriodEnd?: boolean;
}

// Estadísticas del usuario
export interface UserStats {
  lastActive: Timestamp;
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
export interface UserPermissions {
  canCreatePolicies: boolean;
  canDeletePolicies: boolean;
  canManageClients: boolean;
  canAccessReports: boolean;
  canManageUsers: boolean;
  canManageRoles: boolean;
  canManageSettings: boolean;
  canViewDashboard: boolean;
}

// Datos completos del usuario en Firestore
export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  emailVerified: boolean;
  plan: PlanId;
  planStatus: SubscriptionStatus;
  planExpiresAt?: Timestamp;
  trialEndsAt?: Timestamp;
  verified: boolean;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  language?: string;
  timezone?: string;
  notifications?: NotificationPreferences;
  appearance?: AppearancePreferences;
  subscription?: UserSubscriptionInfo;
  stats?: UserStats;
  permissions?: UserPermissions;
  metadata?: Record<string, unknown>;
}

// Datos para registro de usuario
export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  photoURL?: string;
  plan?: PlanId;
  planStatus?: SubscriptionStatus;
  termsAccepted: boolean;
}

// Error de autenticación
export interface AuthError {
  code: string;
  message: string;
}

// Respuesta de autenticación
export interface AuthResponse {
  user: FirebaseUser | null;
  userData?: UserData | null;
  error?: AuthError | null;
}

// Contexto de autenticación
export interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<AuthResponse>;
  signUp: (data: SignUpData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: AuthError }>;
  sendVerificationEmail: () => Promise<{ success: boolean; error?: AuthError }>;
  updateProfile: (displayName?: string, photoURL?: string) => Promise<{ success: boolean; error?: AuthError }>;
  updateEmail: (newEmail: string, password: string) => Promise<{ success: boolean; error?: AuthError }>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: AuthError }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean; url?: string; error?: AuthError }>;
  updateUserData: (data: Partial<UserData>) => Promise<{ success: boolean; error?: AuthError }>;
}

// Constantes
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

export const DEFAULT_APPEARANCE: AppearancePreferences = {
  theme: 'system',
  primaryColor: '#3B82F6',
  sidebarCollapsed: false,
  denseMode: false,
  language: 'es',
};

export const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  email: true,
  push: true,
  sms: false,
  emailExpiration: true,
  emailNewPolicy: true,
  emailPayment: true,
};