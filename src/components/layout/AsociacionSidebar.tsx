import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Filter,
  Link as LinkIcon,
  Target,
  PieChart,
  Activity,
  Zap,
  Globe,
  Smartphone,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Briefcase
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

  // Menú simplificado pero completo
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Vista General',
      icon: Home,
      description: 'Dashboard principal'
    },
    {
      id: 'analytics',
      label: 'Analytics Avanzado',
      icon: BarChart3,
      description: 'Métricas y análisis'
    },
    {
      id: 'socios',
      label: 'Gestión de Socios',
      icon: Users,
      description: 'Administrar miembros',
      submenu: [
        { id: 'socios-lista', label: 'Lista de Socios', icon: Users },
        { id: 'socios-nuevo', label: 'Agregar Socio', icon: Plus },
        { id: 'socios-importar', label: 'Importar CSV', icon: Upload },
        { id: 'socios-exportar', label: 'Exportar Datos', icon: Download }
      ]
    },
    {
      id: 'comercios',
      label: 'Gestión de Comercios',
      icon: Store,
      description: 'Red de comercios afiliados',
      submenu: [
        { id: 'comercios-lista', label: 'Comercios Vinculados', icon: Store },
        { id: 'comercios-vincular', label: 'Vincular Comercio', icon: LinkIcon },
        { id: 'comercios-solicitudes', label: 'Solicitudes', icon: UserCheck },
        { id: 'comercios-beneficios', label: 'Beneficios por Comercio', icon: Gift },
        { id: 'comercios-analytics', label: 'Analytics de Comercios', icon: TrendingUp }
      ]
    },
    {
      id: 'beneficios',
      label: 'Gestión de Beneficios',
      icon: Gift,
      description: 'Ofertas y promociones',
      submenu: [
        { id: 'beneficios-lista', label: 'Todos los Beneficios', icon: Gift },
        { id: 'beneficios-crear', label: 'Crear Beneficio', icon: Plus },
        { id: 'beneficios-categorias', label: 'Categorías', icon: Filter },
        { id: 'beneficios-validaciones', label: 'Validaciones', icon: UserCheck }
      ]
    },
    {
      id: 'pagos',
      label: 'Gestión Financiera',
      icon: CreditCard,
      description: 'Pagos y facturación',
      submenu: [
        { id: 'pagos-registrar', label: 'Registrar Pago', icon: Plus },
        { id: 'pagos-historial', label: 'Historial de Pagos', icon: Calendar },
        { id: 'pagos-vencimientos', label: 'Próximos Vencimientos', icon: UserCheck },
        { id: 'pagos-reportes', label: 'Reportes Financieros', icon: PieChart }
      ]
    },
    {
      id: 'notificaciones',
      label: 'Centro de Comunicación',
      icon: Bell,
      description: 'Notificaciones y mensajería',
      submenu: [
        { id: 'notificaciones-centro', label: 'Centro de Notificaciones', icon: Bell },
        { id: 'notificaciones-crear', label: 'Crear Campaña', icon: Plus },
        { id: 'notificaciones-plantillas', label: 'Plantillas', icon: Mail },
        { id: 'notificaciones-push', label: 'Notificaciones Push', icon: Smartphone }
      ]
    },
    {
      id: 'reportes',
      label: 'Reportes y Exportación',
      icon: FileText,
      description: 'Informes detallados',
      submenu: [
        { id: 'reportes-ejecutivo', label: 'Reporte Ejecutivo', icon: Briefcase },
        { id: 'reportes-socios', label: 'Reporte de Socios', icon: Users },
        { id: 'reportes-comercios', label: 'Reporte de Comercios', icon: Store },
        { id: 'reportes-validaciones', label: 'Validaciones y Uso', icon: UserCheck }
      ]
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: Settings,
      description: 'Ajustes del sistema',
      submenu: [
        { id: 'configuracion-perfil', label: 'Perfil de Asociación', icon: Building2 },
        { id: 'configuracion-usuarios', label: 'Gestión de Usuarios', icon: Users },
        { id: 'configuracion-seguridad', label: 'Seguridad y Acceso', icon: Shield },
        { id: 'configuracion-general', label: 'Configuración General', icon: Settings }
      ]
    }
  ];

  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set(['dashboard', 'comercios']));

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
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Panel Ejecutivo</h2>
                <p className="text-sm text-blue-100 truncate max-w-32">
                  {user?.nombre || 'Asociación'}
                </p>
              </div>
            </div>
            
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-600">156</div>
                <div className="text-xs text-gray-500">Socios Activos</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-600">23</div>
                <div className="text-xs text-gray-500">Comercios</div>
              </div>
            </div>
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
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg ${
                        isActive(item.id) 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                      }`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm truncate">{item.label}</span>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
                      </div>
                    </div>
                    
                    {item.submenu && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2 ${
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
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                              activeSection === subItem.id
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <div className={`p-1.5 rounded-md ${
                              activeSection === subItem.id 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                            }`}>
                              <subItem.icon className="w-3 h-3" />
                            </div>
                            <span className="text-sm font-medium truncate">{subItem.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.nombre?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.nombre || 'Administrador'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'admin@asociacion.com'}
                </p>
              </div>
            </div>
            
            <button
              onClick={onLogoutClick}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group border border-red-200 hover:border-red-300"
            >
              <div className="p-1.5 rounded-lg bg-red-100 text-red-600 group-hover:bg-red-200">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AsociacionSidebar;