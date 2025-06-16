import { UserRole } from '@/types/auth';

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador del Centro',
  psicologo: 'Psicólogo',
  paciente: 'Paciente',
};

export const ROLE_PERMISSIONS = {
  admin: {
    canManageUsers: true,
    canManageSettings: true,
    canViewMetrics: true,
    canManageSubscription: true,
    canAccessAllPatients: true,
    canManageAlerts: true,
  },
  psicologo: {
    canManageUsers: false,
    canManageSettings: false,
    canViewMetrics: true,
    canManageSubscription: false,
    canAccessAllPatients: true,
    canManageAlerts: true,
  },
  paciente: {
    canManageUsers: false,
    canManageSettings: false,
    canViewMetrics: false,
    canManageSubscription: false,
    canAccessAllPatients: false,
    canManageAlerts: false,
  },
};
