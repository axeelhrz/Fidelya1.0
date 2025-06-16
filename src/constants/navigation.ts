import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Psychology as PsychologyIcon,
  Assignment as AssignmentIcon,
  NotificationsActive as NotificationsIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType;
  adminOnly?: boolean;
  roles?: string[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: DashboardIcon,
    roles: ['admin', 'psychologist']
  },
  {
    id: 'patients',
    label: 'Pacientes',
    path: '/dashboard/patients',
    icon: PeopleIcon,
    roles: ['admin', 'psychologist']
  },
  {
    id: 'sessions',
    label: 'Sesiones Clínicas',
    path: '/dashboard/sessions',
    icon: PsychologyIcon,
    roles: ['admin', 'psychologist']
  },
  {
    id: 'alerts',
    label: 'Alertas',
    path: '/dashboard/alerts',
    icon: NotificationsIcon,
    roles: ['admin', 'psychologist']
  },
  {
    id: 'metrics',
    label: 'Métricas',
    path: '/dashboard/metrics',
    icon: BarChartIcon,
    roles: ['admin', 'psychologist']
  },
  {
    id: 'settings',
    label: 'Configuración',
    path: '/dashboard/settings',
    icon: SettingsIcon,
    roles: ['admin']
  },
  {
    id: 'admin',
    label: 'Administración',
    path: '/dashboard/admin',
    icon: AdminIcon,
    adminOnly: true,
    roles: ['admin']
  }
];