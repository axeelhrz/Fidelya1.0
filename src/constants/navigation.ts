import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  Notifications as NotificationsIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  roles?: string[];
  children?: NavigationItem[];
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: DashboardIcon,
  },
  {
    id: 'patients',
    label: 'Pacientes',
    path: '/dashboard/patients',
    icon: PeopleIcon,
    roles: ['administrator', 'psychologist'],
  },
  {
    id: 'sessions',
    label: 'Sesiones',
    path: '/dashboard/sessions',
    icon: EventNoteIcon,
    roles: ['administrator', 'psychologist'],
  },
  {
    id: 'alerts',
    label: 'Alertas',
    path: '/dashboard/alerts',
    icon: NotificationsIcon,
    roles: ['administrator', 'psychologist'],
  },
  {
    id: 'analytics',
    label: 'Métricas',
    path: '/dashboard/analytics',
    icon: AnalyticsIcon,
    roles: ['administrator'],
  },
  {
    id: 'settings',
    label: 'Configuración',
    path: '/dashboard/settings',
    icon: SettingsIcon,
    roles: ['administrator'],
  },
];

export const getNavigationForRole = (userRole: string): NavigationItem[] => {
  return navigationItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );
};