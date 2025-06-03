import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  PointOfSale as SalesIcon,
  ShoppingCart as PurchasesIcon,
  Receipt as InvoiceIcon,
  Assessment as ReportsIcon,
  AccountBalance as CashRegisterIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  People as ClientsIcon,
  Person as ProfileIcon,
  ExitToApp as LogoutIcon,
  Brightness4 as DarkModeIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

// Configuración principal de navegación - Solo módulos principales
export const navigationConfig = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    icon: DashboardIcon,
    url: '/dashboard',
    roles: ['admin', 'cajero', 'operador', 'vendedor'],
    description: 'Panel principal con resumen del negocio'
  },
  {
    id: 'inventory',
    title: 'Inventario',
    type: 'item',
        icon: InventoryIcon,
        url: '/inventory',
    roles: ['admin', 'cajero', 'operador'],
    description: 'Gestión de productos y stock'
      },
      {
    id: 'sales',
    title: 'Ventas',
        type: 'item',
    icon: SalesIcon,
        url: '/ventas',
    roles: ['admin', 'cajero', 'vendedor'],
    description: 'Registro y gestión de ventas'
      },
      {
        id: 'purchases',
    title: 'Compras',
        type: 'item',
        icon: PurchasesIcon,
        url: '/compras',
    roles: ['admin', 'operador'],
    description: 'Gestión de compras y proveedores'
      },
      {
    id: 'clients',
    title: 'Clientes',
        type: 'item',
    icon: ClientsIcon,
    url: '/clientes',
    roles: ['admin', 'cajero', 'vendedor'],
    description: 'Base de datos de clientes'
  },
  {
    id: 'invoicing',
    title: 'Facturación',
    type: 'item',
    icon: InvoiceIcon,
    url: '/facturacion',
    roles: ['admin', 'cajero', 'operador'],
    description: 'Generación y gestión de facturas'
  },
  {
    id: 'reports',
    title: 'Reportes',
    type: 'item',
        icon: ReportsIcon,
        url: '/reportes',
    roles: ['admin', 'cajero'],
    description: 'Reportes financieros y estadísticas'
      },
      {
    id: 'cash-register',
    title: 'Cierre de Caja',
    type: 'item',
    icon: CashRegisterIcon,
    url: '/cierre-caja',
    roles: ['admin', 'cajero'],
    description: 'Control de caja diario'
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    type: 'item',
    icon: NotificationsIcon,
    url: '/notificaciones',
    roles: ['admin', 'cajero', 'operador', 'vendedor'],
    description: 'Centro de notificaciones del sistema',
    badge: 'notifications'
  }
];

// Configuración del menú de administración (separado para mejor organización)
export const adminMenuConfig = [
  {
    id: 'configuration',
    title: 'Configuración',
    type: 'item',
    icon: SettingsIcon,
    url: '/configuracion',
    roles: ['admin'],
    description: 'Configuración general del sistema'
  }
];

// Configuración del menú de usuario
export const userMenuConfig = [
  {
    id: 'profile',
    title: 'Mi Perfil',
    icon: ProfileIcon,
    url: '/perfil',
    description: 'Configuración de perfil personal'
  },
  {
    id: 'logout',
    title: 'Cerrar Sesión',
    icon: LogoutIcon,
    action: 'logout',
    description: 'Salir del sistema'
  }
];

// Configuración de controles del sistema
export const systemControlsConfig = [
  {
    id: 'dark-mode',
    title: 'Modo Oscuro',
    icon: DarkModeIcon,
    type: 'toggle',
    description: 'Alternar entre tema claro y oscuro'
  },
  {
    id: 'notifications-bell',
    title: 'Notificaciones',
    icon: NotificationsIcon,
    type: 'component',
    description: 'Centro de notificaciones'
  }
];

// Función para obtener el badge count de notificaciones
export const getBadgeCount = (badgeType, badges) => {
  return badges[badgeType] || 0;
};

// Función para verificar permisos
export const hasPermission = (userRole, requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  return requiredRoles.includes(userRole);
};