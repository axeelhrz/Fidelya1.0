import { 
  Dashboard,
  People,
  EventNote,
  Warning,
  Analytics,
  Settings,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<SvgIconProps>;
  roles: string[];
  children?: NavigationItem[];
  adminOnly?: boolean;
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: Dashboard,
    roles: ['admin', 'psychologist']
  },
  {
    id: 'patients',
    label: 'Pacientes',
    path: '/dashboard/patients',
    icon: People,
    roles: ['admin', 'psychologist']
  },
  {
    id: 'sessions',
    label: 'Sesiones',
    path: '/dashboard/sessions',
    icon: EventNote,
    roles: ['admin', 'psychologist']
  },
  {
    id: 'alerts',
    label: 'Alertas',
    path: '/dashboard/alerts',
    icon: Warning,
    roles: ['admin', 'psychologist']
  },
  {
    id: 'metrics',
    label: 'Métricas',
    path: '/dashboard/metrics',
    icon: Analytics,
    roles: ['admin', 'psychologist']
  },
  {
    id: 'settings',
    label: 'Configuración',
    path: '/dashboard/settings',
    icon: Settings,
    roles: ['admin']
  }
];

// Función para filtrar elementos de navegación por rol
export function getNavigationItemsByRole(userRole: string): NavigationItem[] {
  return navigationItems.filter(item => item.roles.includes(userRole));
}

// Función para obtener el elemento de navegación activo
export function getActiveNavigationItem(pathname: string): NavigationItem | null {
  // Buscar coincidencia exacta primero
  let activeItem = navigationItems.find(item => item.path === pathname);
  
  if (!activeItem) {
    // Buscar coincidencia parcial (para rutas anidadas)
    activeItem = navigationItems.find(item => 
      pathname.startsWith(item.path) && item.path !== '/dashboard'
    );
  }
  
  // Si no hay coincidencia y estamos en dashboard, usar dashboard como activo
  if (!activeItem && pathname.startsWith('/dashboard')) {
    activeItem = navigationItems.find(item => item.id === 'dashboard');
  }
  
  return activeItem || null;
}

// Breadcrumbs para navegación
export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Siempre empezar con Dashboard
  breadcrumbs.push({ label: 'Dashboard', path: '/dashboard' });
  
  // Analizar la ruta para construir breadcrumbs
  const pathSegments = pathname.split('/').filter(segment => segment && segment !== 'dashboard');
  
  let currentPath = '/dashboard';
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Buscar el elemento de navegación correspondiente
    const navItem = navigationItems.find(item => item.path === currentPath);
    
    if (navItem) {
      breadcrumbs.push({
        label: navItem.label,
        path: index === pathSegments.length - 1 ? undefined : currentPath
      });
    } else {
      // Para rutas dinámicas como /patients/[id]
      let label = segment;
      
      // Personalizar etiquetas para rutas específicas
      if (segment === 'sessions' && currentPath.includes('/patients/')) {
        label = 'Sesiones';
      } else if (segment.match(/^[a-zA-Z0-9-_]+$/)) {
        // Si parece un ID, usar una etiqueta genérica
        const parentSegment = pathSegments[index - 1];
        if (parentSegment === 'patients') {
          label = 'Detalle del Paciente';
        } else if (parentSegment === 'sessions') {
          label = 'Detalle de Sesión';
        } else {
          label = 'Detalle';
        }
      }
      
      breadcrumbs.push({
        label,
        path: index === pathSegments.length - 1 ? undefined : currentPath
      });
    }
  });
  
  return breadcrumbs;
}

// Configuración de métricas para el dashboard
export const dashboardMetricsConfig = {
  refreshInterval: 5 * 60 * 1000, // 5 minutos
  defaultDateRange: 30, // días
  maxDataPoints: 100,
  enableRealTimeUpdates: true
};

// Configuración de alertas
export const alertsConfig = {
  autoRefreshInterval: 2 * 60 * 1000, // 2 minutos
  maxAlertsPerPage: 50,
  enablePushNotifications: true,
  urgencyColors: {
    alta: '#f44336',
    media: '#ff9800',
    baja: '#4caf50'
  }
};

// Configuración de exportación
export const exportConfig = {
  supportedFormats: ['pdf', 'excel', 'notion'],
  maxExportRecords: 10000,
  defaultFileName: 'centro_psicologico_export',
  includeCharts: true,
  includeSummary: true
};