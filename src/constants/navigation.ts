import {
  Dashboard,
  People,
  EventNote,
  Assessment,
  Warning,
  Psychology,
  BusinessCenter,
  TrendingUp,
} from '@mui/icons-material';

export const navigationItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: Dashboard,
    adminOnly: false,
  },
  {
    label: 'CEO Dashboard',
    path: '/dashboard/ceo',
    icon: BusinessCenter,
    adminOnly: true,
  },
  {
    label: 'Pacientes',
    path: '/dashboard/patients',
    icon: People,
    adminOnly: false,
  },
  {
    label: 'Sesiones',
    path: '/dashboard/sessions',
    icon: EventNote,
    adminOnly: false,
  },
  {
    label: 'Métricas',
    path: '/dashboard/metrics',
    icon: Assessment,
    adminOnly: false,
  },
  {
    label: 'Alertas',
    path: '/dashboard/alerts',
    icon: Warning,
    adminOnly: false,
  },
];