import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  Store, 
  Gift, 
  BarChart3, 
  QrCode, 
  Users, 
  Settings, 
  Bell,
  FileText,
  CreditCard,
  TrendingUp,
  Calendar,
  UserCheck,
  Eye,
  Plus,
  Download,
  Upload,
  Palette,
  Shield,
  LogOut,
  ChevronDown,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ComercioSidebarProps {
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
  onLogoutClick: () => void;
  activeSection: string;
}

export const ComercioSidebar: React.FC<ComercioSidebarProps> = ({
  open,
  onToggle,
  onMenuClick,
  onLogoutClick,
  activeSection
}) => {
  const { user } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'Vista general'
    },
    {
      id: 'perfil',
      label: 'Mi Perfil',
      icon: Store,
      description: 'Información del comercio',
      submenu: [
        { id: 'perfil-datos', label: 'Datos del Comercio', icon: Store },
        { id: 'perfil-imagenes', label: 'Logo y Banner', icon: Upload },
        { id: 'perfil-configuracion', label: 'Configuración', icon: Settings }
      ]
    },
    {
      id: 'qr',
      label: 'Código QR',
      icon: QrCode,
      description: 'Gestión de QR',
      submenu: [
        { id: 'qr-generar', label: 'Generar QR', icon: Plus },
        { id: 'qr-personalizar', label: 'Personalizar', icon: Palette },
        { id: 'qr-descargar', label: 'Descargar', icon: Download },
        { id: 'qr-estadisticas', label: 'Estadísticas de Uso', icon: BarChart3 }
      ]
    },
    {
      id: 'beneficios',
      label: 'Beneficios',
      icon: Gift,
      description: 'Gestionar ofertas',
      submenu: [
        { id: 'beneficios-lista', label: 'Mis Beneficios', icon: Gift },
        { id: 'beneficios-crear', label: 'Crear Beneficio', icon: Plus },
        { id: 'beneficios-activos', label: 'Beneficios Activos', icon: Eye },
        { id: 'beneficios-vencidos', label: 'Beneficios Vencidos', icon: Calendar }
      ]
    },
    {
      id: 'validaciones',
      label: 'Validaciones',
      icon: UserCheck,
      description: 'Historial de validaciones',
      submenu: [
        { id: 'validaciones-recientes', label: 'Recientes', icon: Calendar },
        { id: 'validaciones-historial', label: 'Historial Completo', icon: FileText },
        { id: 'validaciones-exitosas', label: 'Exitosas', icon: UserCheck },
        { id: 'validaciones-fallidas', label: 'Fallidas', icon: X }
      ]
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: Users,
      description: 'Gestión de clientes',
      submenu: [
        { id: 'clientes-lista', label: 'Lista de Clientes', icon: Users },
        { id: 'clientes-frecuentes', label: 'Clientes Frecuentes', icon: Award },
        { id: 'clientes-analytics', label: 'Análisis de Clientes', icon: BarChart3 },
        { id: 'clientes-segmentos', label: 'Segmentación', icon: Target }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Estadísticas detalladas',
      submenu: [
        { id: 'analytics-general', label: 'Vista General', icon: TrendingUp },
        { id: 'analytics-validaciones', label: 'Análisis de Validaciones', icon: UserCheck },
        { id: 'analytics-beneficios', label: 'Rendimiento de Beneficios', icon: Gift },
        { id: 'analytics-horarios', label: 'Horarios de Actividad', icon: Calendar },
        { id: 'analytics-asociaciones', label: 'Por Asociación', icon: Users }
      ]
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: FileText,
      description: 'Informes y exportaciones',
      submenu: [
        { id: 'reportes-validaciones', label: 'Reporte de Validaciones', icon: UserCheck },
        { id: 'reportes-beneficios', label: 'Reporte de Beneficios', icon: Gift },
        { id: 'reportes-clientes', label: 'Reporte de Clientes', icon: Users },
        { id: 'reportes-financiero', label: 'Reporte Financiero', icon: CreditCard }
      ]
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: Bell,
      description: 'Centro de notificaciones'
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: Settings,
      description: 'Configuración avanzada',
      submenu: [
        { id: 'configuracion-general', label: 'General', icon: Settings },
        { id: 'configuracion-notificaciones', label: 'Notificaciones', icon: Bell },
        { id: 'configuracion-seguridad', label: 'Seguridad', icon: Shield },
        { id: 'configuracion-integraciones', label: 'Integraciones', icon: Zap }
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Comercio</h2>
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