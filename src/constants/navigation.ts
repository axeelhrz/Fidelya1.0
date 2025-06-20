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
  adminOnly?: boolean; // Mantenemos por compatibilidad
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: Dashboard,
    allowedRoles: ['admin', 'psychologist', 'patient'],
    adminOnly: false,
  },
  {
    label: 'CEO Dashboard',
    path: '/dashboard/ceo',
    icon: BusinessCenter,
    allowedRoles: ['admin'],
    adminOnly: true,
  },
  {
    label: 'Pacientes',
    path: '/dashboard/patients',
    icon: People,
    allowedRoles: ['psychologist', 'patient'],
    adminOnly: false,
  },
  {
    label: 'Sesiones',
    path: '/dashboard/sessions',
    icon: EventNote,
    allowedRoles: ['psychologist', 'patient'],
    adminOnly: false,
  },
  {
    label: 'Métricas',
    path: '/dashboard/metrics',
    icon: Assessment,
    allowedRoles: ['psychologist'],
    adminOnly: false,
  },
  {
    label: 'Alertas',
    path: '/dashboard/alerts',
    icon: Warning,
    allowedRoles: ['psychologist'],
    adminOnly: false,
  },
];

// Función helper para obtener elementos de navegación por rol
export const getNavigationItemsForRole = (role: UserRole): NavigationItem[] => {
  return navigationItems.filter(item => item.allowedRoles.includes(role));
};