import { UserRole } from '@/types/auth';

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador del Centro',
  psychologist: 'Psicólogo',
  patient: 'Paciente',
};

export const ROLE_PERMISSIONS = {
  admin: {
    canManageUsers: true,
    canManageSettings: true,
    canViewMetrics: true,
    canManageSubscription: true,
    canAccessAllPatients: true,
    canManagePatients: true,
    canManageAlerts: true,
  },
  psychologist: {
    canManageUsers: false,
    canManageSettings: false,
    canViewMetrics: true,
    canManageSubscription: false,
    canAccessAllPatients: true,
    canManagePatients: true,
    canManageAlerts: true,
  },
  patient: {
    canManageUsers: false,
    canManageSettings: false,
    canViewMetrics: false,
    canManageSubscription: false,
    canAccessAllPatients: false,
    canManagePatients: false,
    canManageAlerts: false,
  },
};