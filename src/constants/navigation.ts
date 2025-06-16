import { UserRole } from '@/types/auth';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  roles: UserRole[];
  children?: NavigationItem[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'Dashboard',
    roles: ['admin', 'psicologo', 'paciente'],
  },
  {
    id: 'patients',
    label: 'Pacientes',
    path: '/patients',
    icon: 'People',
    roles: ['admin', 'psicologo'],
    children: [
      {
        id: 'patients-list',
        label: 'Lista de Pacientes',
        path: '/patients',
        icon: 'List',
        roles: ['admin', 'psicologo'],
      },
      {
        id: 'patients-add',
        label: 'Nuevo Paciente',
        path: '/patients/new',
        icon: 'PersonAdd',
        roles: ['admin', 'psicologo'],
      },
    ],
  },
  {
    id: 'sessions',
    label: 'Sesiones',
    path: '/sessions',
    icon: 'EventNote',
    roles: ['admin', 'psicologo', 'paciente'],
    children: [
      {
        id: 'sessions-calendar',
        label: 'Calendario',
        path: '/sessions/calendar',
        icon: 'CalendarToday',
        roles: ['admin', 'psicologo'],
      },
      {
        id: 'sessions-history',
        label: 'Historial',
        path: '/sessions/history',
        icon: 'History',
        roles: ['admin', 'psicologo', 'paciente'],
      },
    ],
  },
  {
    id: 'alerts',
    label: 'Alertas',
    path: '/alerts',
    icon: 'Notifications',
    roles: ['admin', 'psicologo'],
  },
  {
    id: 'metrics',
    label: 'Métricas',
    path: '/metrics',
    icon: 'Analytics',
    roles: ['admin', 'psicologo'],
  },
  {
    id: 'settings',
    label: 'Configuración',
    path: '/settings',
    icon: 'Settings',
    roles: ['admin'],
  },
  {
    id: 'subscription',
    label: 'Suscripción',
    path: '/subscription',
    icon: 'Payment',
    roles: ['admin'],
  },
];
