import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X, 
  Home, 
  Users, 
  Store, 
  Gift, 
  BarChart3, 
  Bell, 
  Settings, 
  FileText, 
  Download, 
  Upload,
  CreditCard,
  Mail,
  Shield,
  Database,
  TrendingUp,
  Calendar,
  UserCheck,
  Building2,
  LogOut,
  ChevronDown,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AsociacionSidebarProps {
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
  onLogoutClick: () => void;
  activeSection: string;
}

export const AsociacionSidebar: React.FC<AsociacionSidebarProps> = ({
  open,
  onToggle,
  onMenuClick,
  onLogoutClick,
  activeSection
}) => {
  const { user } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'Vista general'
    },
    {
      id: 'socios',
      label: 'Gestión de Socios',
      icon: Users,
      description: 'Administrar socios',
      submenu: [
        { id: 'socios-lista', label: 'Lista de Socios', icon: Users },
        { id: 'socios-nuevo', label: 'Nuevo Socio', icon: Plus },
        { id: 'socios-importar', label: 'Importar CSV', icon: Upload },
        { id: 'socios-exportar', label: 'Exportar Datos', icon: Download }
      ]
    },
    {
      id: 'comercios',
      label: 'Comercios',
      icon: Store,
      description: 'Gestionar comercios',
      submenu: [
        { id: 'comercios-lista', label: 'Lista de Comercios', icon: Store },
        { id: 'comercios-vincular', label: 'Vincular Comercio', icon: Plus },
        { id: 'comercios-beneficios', label: 'Beneficios', icon: Gift }
      ]
    },
    {
      id: 'pagos',
      label: 'Gestión de Pagos',
      icon: CreditCard,
      description: 'Pagos y cuotas',
      submenu: [
        { id: 'pagos-registrar', label: 'Registrar Pago', icon: Plus },
        { id: 'pagos-historial', label: 'Historial', icon: Calendar },
        { id: 'pagos-vencimientos', label: 'Vencimientos', icon: UserCheck }
      ]
    },
    {
      id: 'beneficios',
      label: 'Beneficios',
      icon: Gift,
      description: 'Gestionar beneficios'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Estadísticas y reportes',
      submenu: [
        { id: 'analytics-general', label: 'Vista General', icon: TrendingUp },
        { id: 'analytics-socios', label: 'Análisis de Socios', icon: Users },
        { id: 'analytics-comercios', label: 'Análisis de Comercios', icon: Store },
        { id: 'analytics-beneficios', label: 'Análisis de Beneficios', icon: Gift }
      ]
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: FileText,
      description: 'Informes y exportaciones',
      submenu: [
        { id: 'reportes-socios', label: 'Reporte de Socios', icon: Users },
        { id: 'reportes-validaciones', label: 'Validaciones', icon: UserCheck },
        { id: 'reportes-financiero', label: 'Reporte Financiero', icon: CreditCard },
        { id: 'reportes-personalizado', label: 'Reporte Personalizado', icon: Filter }
      ]
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: Bell,
      description: 'Centro de notificaciones',
      submenu: [
        { id: 'notificaciones-centro', label: 'Centro de Notificaciones', icon: Bell },
        { id: 'notificaciones-crear', label: 'Crear Notificación', icon: Plus },
        { id: 'notificaciones-plantillas', label: 'Plantillas', icon: Mail },
        { id: 'notificaciones-configurar', label: 'Configuración', icon: Settings }
      ]
    },
    {
      id: 'backup',
      label: 'Respaldos',
      icon: Database,
      description: 'Gestión de respaldos',
      submenu: [
        { id: 'backup-crear', label: 'Crear Respaldo', icon: Plus },
        { id: 'backup-historial', label: 'Historial', icon: Calendar },
        { id: 'backup-restaurar', label: 'Restaurar', icon: Upload },
        { id: 'backup-configurar', label: 'Configuración', icon: Settings }
      ]
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: Settings,
      description: 'Configuración general',
      submenu: [
        { id: 'configuracion-perfil', label: 'Perfil de Asociación', icon: Building2 },
        { id: 'configuracion-usuarios', label: 'Usuarios', icon: Users },
        { id: 'configuracion-seguridad', label: 'Seguridad', icon: Shield },
        { id: 'configuracion-integraciones', label: 'Integraciones', icon: Settings }
      ]
    }
  ];

  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleMenuClick = (itemId: string, hasSubmenu: boolean = false) => {
    if (hasSubmenu) {
      toggleExpanded(itemId);
    } else {
      onMenuClick(itemId);
    }
  };

  const isActive = (itemId: string) => {
    return activeSection === itemId || activeSection.startsWith(itemId + '-');
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: open ? 0 : -300 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Asociación</h2>
                <p className="text-sm text-gray-500 truncate max-w-32">
                  {user?.nombre || 'Panel de Control'}
                </p>
              </div>
            </div>
            
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-4 space-y-2">
              {menuItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id, !!item.submenu)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                      isActive(item.id)
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className={`w-5 h-5 ${
                        isActive(item.id) ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                      }`} />
                      <div>
                        <span className="font-medium text-sm">{item.label}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                    
                    {item.submenu && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        expandedItems.has(item.id) ? 'rotate-180' : ''
                      } ${isActive(item.id) ? 'text-blue-600' : 'text-gray-400'}`} />
                    )}
                  </button>

                  {/* Submenu */}
                  <AnimatePresence>
                    {item.submenu && expandedItems.has(item.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 mt-2 space-y-1 border-l-2 border-gray-100 pl-4"
                      >
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleMenuClick(subItem.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                              activeSection === subItem.id
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <subItem.icon className={`w-4 h-4 ${
                              activeSection === subItem.id ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                            <span className="text-sm font-medium">{subItem.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLogoutClick}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AsociacionSidebar;