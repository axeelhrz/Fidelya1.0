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
  Security as SecurityIcon,
  Person as ProfileIcon,
  Store as StoreIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  LocalShipping as SupplierIcon,
  Print as PrintIcon,
  Backup as BackupIcon,
  AdminPanelSettings as AdminIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

export const navigationConfig = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    icon: DashboardIcon,
    url: '/dashboard',
    roles: ['admin', 'cajero', 'operador', 'vendedor']
  },
  {
    id: 'inventory-section',
    title: 'Inventario',
    type: 'group',
    children: [
      {
        id: 'inventory',
        title: 'Productos',
        type: 'item',
        icon: InventoryIcon,
        url: '/inventory',
        roles: ['admin', 'cajero', 'operador']
      },
      {
        id: 'stock-alerts',
        title: 'Alertas de Stock',
        type: 'item',
        icon: WarningIcon,
        url: '/inventory?tab=alerts',
        roles: ['admin', 'cajero', 'operador'],
        badge: 'stockAlerts'
      }
    ]
  },
  {
    id: 'sales-section',
    title: 'Ventas',
    type: 'group',
    children: [
      {
        id: 'sales',
        title: 'Gestión de Ventas',
        type: 'item',
        icon: SalesIcon,
        url: '/ventas',
        roles: ['admin', 'cajero', 'vendedor']
      },
      {
        id: 'sales-reports',
        title: 'Reportes de Ingresos',
        type: 'item',
        icon: TrendingUpIcon,
        url: '/ventas?tab=reports',
        roles: ['admin', 'cajero']
      }
    ]
  },
  {
    id: 'purchases-section',
    title: 'Compras',
    type: 'group',
    children: [
      {
        id: 'purchases',
        title: 'Gestión de Compras',
        type: 'item',
        icon: PurchasesIcon,
        url: '/compras',
        roles: ['admin', 'operador']
      },
      {
        id: 'suppliers',
        title: 'Proveedores',
        type: 'item',
        icon: SupplierIcon,
        url: '/compras?tab=suppliers',
        roles: ['admin', 'operador']
      }
    ]
  },
  {
    id: 'clients',
    title: 'Clientes',
    type: 'item',
    icon: ClientsIcon,
    url: '/clientes',
    roles: ['admin', 'cajero', 'vendedor']
  },
  {
    id: 'invoicing',
    title: 'Facturación',
    type: 'item',
    icon: InvoiceIcon,
    url: '/facturacion',
    roles: ['admin', 'cajero', 'operador']
  },
  {
    id: 'reports-section',
    title: 'Reportes',
    type: 'group',
    children: [
      {
        id: 'financial-reports',
        title: 'Reportes Financieros',
        type: 'item',
        icon: ReportsIcon,
        url: '/reportes',
        roles: ['admin', 'cajero']
      },
      {
        id: 'export-reports',
        title: 'Exportar Reportes',
        type: 'item',
        icon: PrintIcon,
        url: '/reportes?tab=export',
        roles: ['admin']
      }
    ]
  },
  {
    id: 'cash-register',
    title: 'Cierre de Caja',
    type: 'item',
    icon: CashRegisterIcon,
    url: '/cierre-caja',
    roles: ['admin', 'cajero']
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    type: 'item',
    icon: NotificationsIcon,
    url: '/notificaciones',
    roles: ['admin', 'cajero', 'operador', 'vendedor'],
    badge: 'notifications'
  },
  {
    id: 'admin-section',
    title: 'Administración',
    type: 'group',
    roles: ['admin'],
    children: [
      {
        id: 'configuration',
        title: 'Configuración',
        type: 'item',
        icon: SettingsIcon,
        url: '/configuracion',
        roles: ['admin']
      },
      {
        id: 'security',
        title: 'Seguridad',
        type: 'item',
        icon: SecurityIcon,
        url: '/seguridad',
        roles: ['admin']
      },
      {
        id: 'backup',
        title: 'Respaldos',
        type: 'item',
        icon: BackupIcon,
        url: '/respaldos',
        roles: ['admin']
      }
    ]
  }
];

export const userMenuConfig = [
  {
    id: 'profile',
    title: 'Mi Perfil',
    icon: ProfileIcon,
    url: '/perfil'
  },
  {
    id: 'logout',
    title: 'Cerrar Sesión',
    icon: LogoutIcon,
    action: 'logout'
  }
];