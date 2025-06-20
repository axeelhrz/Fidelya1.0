import {
  Dashboard,
  People,
  EventNote,
  Assessment,
  Warning,
  BusinessCenter,
  TrendingUp,
  LocalHospital,
  AccountBalance,
  Psychology,
  Security,
} from '@mui/icons-material';
import { UserRole } from '@/types/auth';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType;
  allowedRoles: UserRole[];
  adminOnly?: boolean;
  description?: string;
  category?: string;
}

export const navigationItems: NavigationItem[] = [
  // Dashboard Principal
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: Dashboard,
    allowedRoles: ['admin', 'psychologist', 'patient'],
    adminOnly: false,
    description: 'Vista principal del sistema',
    category: 'principal',
  },

  // Secciones CEO (solo para admin)
  {
    label: 'KPIs Ejecutivos',
    path: '/dashboard?section=kpis',
    icon: TrendingUp,
    allowedRoles: ['admin'],
    adminOnly: true,
    description: 'Métricas clave de rendimiento',
    category: 'ceo',
  },
  {
    label: 'Desempeño Financiero',
    path: '/dashboard?section=financial',
    icon: AccountBalance,
    allowedRoles: ['admin'],
    adminOnly: true,
    description: 'Burn & Earn, rentabilidad',
    category: 'ceo',
  },
  {
    label: 'Salud Clínica',
    path: '/dashboard?section=clinical',
    icon: LocalHospital,
    allowedRoles: ['admin'],
    adminOnly: true,
    description: 'Radar de riesgo, adherencia',
    category: 'ceo',
  },
  {
    label: 'Pipeline Comercial',
    path: '/dashboard?section=commercial',
    icon: BusinessCenter,
    allowedRoles: ['admin'],
    adminOnly: true,
    description: 'Marketing y captación',
    category: 'ceo',
  },
  {
    label: 'Compliance',
    path: '/dashboard?section=compliance',
    icon: Security,
    allowedRoles: ['admin'],
    adminOnly: true,
    description: 'Cumplimiento y auditorías',
    category: 'ceo',
  },

  // Secciones Operativas
  {
    label: 'Pacientes',
    path: '/dashboard/patients',
    icon: People,
    allowedRoles: ['admin', 'psychologist'],
    adminOnly: false,
    description: 'Gestión de pacientes',
    category: 'operativo',
  },
  {
    label: 'Sesiones',
    path: '/dashboard/sessions',
    icon: EventNote,
    allowedRoles: ['admin', 'psychologist'],
    adminOnly: false,
    description: 'Gestión de sesiones',
    category: 'operativo',
  },
  {
    label: 'Métricas',
    path: '/dashboard/metrics',
    icon: Assessment,
    allowedRoles: ['admin', 'psychologist'],
    adminOnly: false,
    description: 'Análisis y reportes',
    category: 'operativo',
  },
  {
    label: 'Alertas',
    path: '/dashboard/alerts',
    icon: Warning,
    allowedRoles: ['admin', 'psychologist'],
    adminOnly: false,
    description: 'Sistema de alertas',
    category: 'operativo',
  },
];

// Función helper para obtener elementos de navegación por rol y categoría
export const getNavigationItemsForRole = (role: UserRole): NavigationItem[] => {
  return navigationItems.filter(item => {
    if (item.adminOnly && role !== 'admin') {
      return false;
    }
    return item.allowedRoles.includes(role);
  });
};

// Función helper para obtener elementos por categoría
export const getNavigationItemsByCategory = (role: UserRole, category?: string): NavigationItem[] => {
  const items = getNavigationItemsForRole(role);
  if (!category) return items;
  return items.filter(item => item.category === category);
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