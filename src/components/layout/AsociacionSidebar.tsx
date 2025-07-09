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

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Principal',
      icon: Home,
      description: 'Vista general y métricas',
      badge: 'Inicio'
    },
    {
      id: 'socios',
      label: 'Gestión de Socios',
      icon: Users,
      description: 'Administrar miembros',
      submenu: [
        { id: 'socios-lista', label: 'Lista de Socios', icon: Users, description: 'Ver todos los socios' },
        { id: 'socios-nuevo', label: 'Agregar Socio', icon: Plus, description: 'Registrar nuevo socio' },
        { id: 'socios-importar', label: 'Importar CSV', icon: Upload, description: 'Importación masiva' },
        { id: 'socios-exportar', label: 'Exportar Datos', icon: Download, description: 'Descargar información' }
      ]
    },
    {
      id: 'comercios',
      label: 'Gestión de Comercios',
      icon: Store,
      description: 'Red de comercios afiliados',
      submenu: [
        { id: 'comercios-lista', label: 'Comercios Vinculados', icon: Store, description: 'Ver comercios activos' },
        { id: 'comercios-vincular', label: 'Vincular Comercio', icon: LinkIcon, description: 'Agregar nuevo comercio' },
        { id: 'comercios-solicitudes', label: 'Solicitudes', icon: UserCheck, description: 'Revisar solicitudes' },
        { id: 'comercios-beneficios', label: 'Beneficios por Comercio', icon: Gift, description: 'Gestionar ofertas' },
        { id: 'comercios-analytics', label: 'Analytics de Comercios', icon: TrendingUp, description: 'Métricas detalladas' }
      ]
    },
    {
      id: 'beneficios',
      label: 'Gestión de Beneficios',
      icon: Gift,
      description: 'Ofertas y promociones',
      submenu: [
        { id: 'beneficios-lista', label: 'Todos los Beneficios', icon: Gift, description: 'Ver beneficios activos' },
        { id: 'beneficios-crear', label: 'Crear Beneficio', icon: Plus, description: 'Nueva promoción' },
        { id: 'beneficios-categorias', label: 'Categorías', icon: Filter, description: 'Organizar por tipo' },
        { id: 'beneficios-validaciones', label: 'Validaciones', icon: UserCheck, description: 'Historial de uso' }
      ]
    },
    {
      id: 'pagos',
      label: 'Gestión Financiera',
      icon: CreditCard,
      description: 'Pagos y facturación',
      submenu: [
        { id: 'pagos-registrar', label: 'Registrar Pago', icon: Plus, description: 'Nuevo pago de cuota' },
        { id: 'pagos-historial', label: 'Historial de Pagos', icon: Calendar, description: 'Ver transacciones' },
        { id: 'pagos-vencimientos', label: 'Próximos Vencimientos', icon: UserCheck, description: 'Cuotas pendientes' },
        { id: 'pagos-reportes', label: 'Reportes Financieros', icon: PieChart, description: 'Análisis de ingresos' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics Avanzado',
      icon: BarChart3,
      description: 'Inteligencia de negocio',
      submenu: [
        { id: 'analytics-general', label: 'Dashboard Ejecutivo', icon: TrendingUp, description: 'KPIs principales' },
        { id: 'analytics-socios', label: 'Análisis de Socios', icon: Users, description: 'Comportamiento de miembros' },
        { id: 'analytics-comercios', label: 'Performance Comercios', icon: Store, description: 'Métricas de afiliados' },
        { id: 'analytics-beneficios', label: 'ROI de Beneficios', icon: Gift, description: 'Efectividad de ofertas' },
        { id: 'analytics-predictivo', label: 'Análisis Predictivo', icon: Target, description: 'Tendencias futuras' }
      ]
    },
    {
      id: 'comunicacion',
      label: 'Centro de Comunicación',
      icon: Bell,
      description: 'Notificaciones y mensajería',
      submenu: [
        { id: 'notificaciones-centro', label: 'Centro de Notificaciones', icon: Bell, description: 'Bandeja de entrada' },
        { id: 'notificaciones-crear', label: 'Crear Campaña', icon: Plus, description: 'Nueva comunicación' },
        { id: 'notificaciones-plantillas', label: 'Plantillas', icon: Mail, description: 'Mensajes predefinidos' },
        { id: 'notificaciones-push', label: 'Notificaciones Push', icon: Smartphone, description: 'Mensajes móviles' },
        { id: 'notificaciones-email', label: 'Email Marketing', icon: Mail, description: 'Campañas por correo' },
        { id: 'notificaciones-sms', label: 'SMS Masivos', icon: MessageSquare, description: 'Mensajes de texto' }
      ]
    },
    {
      id: 'reportes',
      label: 'Reportes y Exportación',
      icon: FileText,
      description: 'Informes detallados',
      submenu: [
        { id: 'reportes-ejecutivo', label: 'Reporte Ejecutivo', icon: Briefcase, description: 'Resumen gerencial' },
        { id: 'reportes-socios', label: 'Reporte de Socios', icon: Users, description: 'Estado de membresías' },
        { id: 'reportes-comercios', label: 'Reporte de Comercios', icon: Store, description: 'Performance de afiliados' },
        { id: 'reportes-validaciones', label: 'Validaciones y Uso', icon: UserCheck, description: 'Actividad de beneficios' },
        { id: 'reportes-financiero', label: 'Reporte Financiero', icon: CreditCard, description: 'Análisis de ingresos' },
        { id: 'reportes-personalizado', label: 'Reportes Personalizados', icon: Filter, description: 'Crear informes a medida' }
      ]
    },
    {
      id: 'operaciones',
      label: 'Operaciones y Mantenimiento',
      icon: Database,
      description: 'Gestión del sistema',
      submenu: [
        { id: 'backup-crear', label: 'Crear Respaldo', icon: Plus, description: 'Backup manual' },
        { id: 'backup-historial', label: 'Historial de Respaldos', icon: Calendar, description: 'Ver backups anteriores' },
        { id: 'backup-restaurar', label: 'Restaurar Sistema', icon: Upload, description: 'Recuperar datos' },
        { id: 'backup-automatico', label: 'Respaldos Automáticos', icon: Zap, description: 'Configurar programación' },
        { id: 'sistema-logs', label: 'Logs del Sistema', icon: Activity, description: 'Monitoreo de actividad' }
      ]
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: Settings,
      description: 'Ajustes del sistema',
      submenu: [
        { id: 'configuracion-perfil', label: 'Perfil de Asociación', icon: Building2, description: 'Datos institucionales' },
        { id: 'configuracion-usuarios', label: 'Gestión de Usuarios', icon: Users, description: 'Administradores' },
        { id: 'configuracion-seguridad', label: 'Seguridad y Acceso', icon: Shield, description: 'Permisos y roles' },
        { id: 'configuracion-integraciones', label: 'Integraciones', icon: Globe, description: 'APIs y servicios' },
        { id: 'configuracion-notificaciones', label: 'Configurar Notificaciones', icon: Bell, description: 'Preferencias de comunicación' },
        { id: 'configuracion-general', label: 'Configuración General', icon: Settings, description: 'Ajustes del sistema' }
      ]
    },
    {
      id: 'soporte',
      label: 'Ayuda y Soporte',
      icon: HelpCircle,
      description: 'Asistencia técnica',
      submenu: [
        { id: 'soporte-documentacion', label: 'Documentación', icon: BookOpen, description: 'Guías y manuales' },
        { id: 'soporte-contacto', label: 'Contactar Soporte', icon: MessageSquare, description: 'Asistencia técnica' },
        { id: 'soporte-faq', label: 'Preguntas Frecuentes', icon: HelpCircle, description: 'Respuestas rápidas' },
        { id: 'soporte-tutoriales', label: 'Tutoriales', icon: BookOpen, description: 'Videos explicativos' }
      ]
    }
  ];

  // Función para determinar qué elementos deben estar expandidos
  const getInitialExpandedItems = React.useCallback(() => {
    const expanded = new Set<string>();
    
    // Siempre expandir dashboard por defecto
    expanded.add('dashboard');
    
    // Expandir automáticamente el menú padre si hay una sección activa
    menuItems.forEach(item => {
      if (item.submenu && activeSection.startsWith(item.id + '-')) {
        expanded.add(item.id);
      }
    });
    
    return expanded;
  }, [activeSection]);

  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(getInitialExpandedItems());

  // Actualizar elementos expandidos cuando cambie la sección activa
  React.useEffect(() => {
    setExpandedItems(getInitialExpandedItems());
  }, [getInitialExpandedItems]);

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

  const getItemBadge = (item: { badge?: string }) => {
    if (item.badge) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {item.badge}
        </span>
      );
    }
    return null;
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
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm truncate">{item.label}</span>
                          {getItemBadge(item)}
                        </div>
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
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium truncate">{subItem.label}</span>
                              <p className="text-xs text-gray-500 truncate">{subItem.description}</p>
                            </div>
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