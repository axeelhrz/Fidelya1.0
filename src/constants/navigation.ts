import {
  Dashboard,
  People,
  EventNote,
  Warning,
  Analytics,
  Settings,
} from '@mui/icons-material';

export interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  adminOnly?: boolean;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: Dashboard,
  },
  {
    label: 'Pacientes',
    path: '/dashboard/patients',
    icon: People,
  },
  {
    label: 'Sesiones',
    path: '/dashboard/sessions',
    icon: EventNote,
  },
  {
    label: 'Alertas',
    path: '/dashboard/alerts',
    icon: Warning,
    badge: 3,
  },
  {
    label: 'Métricas',
    path: '/dashboard/metrics',
    icon: Analytics,
  },
  {
    label: 'Configuración',
    path: '/dashboard/settings',
    icon: Settings,
    adminOnly: true,
  },
];