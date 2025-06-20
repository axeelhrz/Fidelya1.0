import {
  Dashboard,
  People,
  EventNote,
  Assessment,
  Warning,
  BusinessCenter,
} from '@mui/icons-material';
import { UserRole } from '@/types/auth';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType;
  allowedRoles: UserRole[];
  adminOnly?: boolean;
  description?: string;
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: Dashboard,
    allowedRoles: ['admin', 'psychologist', 'patient'],
    adminOnly: false,
    description: 'Vista general del sistema',
  },
  {
    label: 'Panel Ejecutivo',
    path: '/dashboard/ceo',
    icon: BusinessCenter,
    allowedRoles: ['admin'],
    adminOnly: true,
    description: 'Dashboard CEO - Solo administradores',
  },
  {
    label: 'Pacientes',
    path: '/dashboard/patients',
    icon: People,
    allowedRoles: ['admin', 'psychologist'],
    adminOnly: false,
    description: 'Gestión de pacientes',
  },
  {
    label: 'Sesiones',
    path: '/dashboard/sessions',
    icon: EventNote,
    allowedRoles: ['admin', 'psychologist'],
    adminOnly: false,
    description: 'Gestión de sesiones',
  },
  {
    label: 'Métricas',
    path: '/dashboard/metrics',
    icon: Assessment,
    allowedRoles: ['admin', 'psychologist'],
    adminOnly: false,
    description: 'Análisis y reportes',
  },
  {
    label: 'Alertas',
    path: '/dashboard/alerts',
    icon: Warning,
    allowedRoles: ['admin', 'psychologist'],
    adminOnly: false,
    description: 'Sistema de alertas',
  },
];

// Función helper para obtener elementos de navegación por rol
export const getNavigationItemsForRole = (role: UserRole): NavigationItem[] => {
  return navigationItems.filter(item => {
    // Si el item es solo para admin, verificar que el rol sea admin
    if (item.adminOnly && role !== 'admin') {
      return false;
    }
    // Verificar que el rol esté en la lista de roles permitidos
    return item.allowedRoles.includes(role);
  });
};

// Función helper para verificar si un usuario puede acceder a una ruta específica
export const canAccessRoute = (path: string, role: UserRole): boolean => {
  const item = navigationItems.find(item => item.path === path);
  if (!item) return false;
  
  if (item.adminOnly && role !== 'admin') {
    return false;
  }
  
  return item.allowedRoles.includes(role);
};

// Función helper para obtener información de una ruta
export const getRouteInfo = (path: string): NavigationItem | undefined => {
  return navigationItems.find(item => item.path === path);
};