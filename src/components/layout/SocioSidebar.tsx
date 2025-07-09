import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  User, 
  Gift, 
  QrCode, 
  Bell, 
  Settings, 
  BarChart3,
  Calendar,
  Award,
  CreditCard,
  Building2,
  Heart,
  History,
  Star,
  Target,
  TrendingUp,
  Eye,
  Shield,
  LogOut,
  ChevronDown,
  Smartphone,
  Camera,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SocioSidebarProps {
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
  onLogoutClick: () => void;
  activeSection: string;
}

export const SocioSidebar: React.FC<SocioSidebarProps> = ({
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
      icon: User,
      description: 'Información personal',
      submenu: [
        { id: 'perfil-datos', label: 'Datos Personales', icon: User },
        { id: 'perfil-asociaciones', label: 'Mis Asociaciones', icon: Building2 },
        { id: 'perfil-membresia', label: 'Estado de Membresía', icon: Award },
        { id: 'perfil-configuracion', label: 'Configuración', icon: Settings }
      ]
    },
    {
      id: 'beneficios',
      label: 'Beneficios',
      icon: Gift,
      description: 'Mis beneficios disponibles',
      submenu: [
        { id: 'beneficios-disponibles', label: 'Disponibles', icon: Gift },
        { id: 'beneficios-favoritos', label: 'Favoritos', icon: Heart },
        { id: 'beneficios-usados', label: 'Historial de Uso', icon: History },
        { id: 'beneficios-vencidos', label: 'Vencidos', icon: Calendar }
      ]
    },
    {
      id: 'validar',
      label: 'Validar Beneficio',
      icon: QrCode,
      description: 'Escanear QR',
      submenu: [
        { id: 'validar-camara', label: 'Escanear con Cámara', icon: Camera },
        { id: 'validar-manual', label: 'Código Manual', icon: Smartphone },
        { id: 'validar-historial', label: 'Historial de Validaciones', icon: History }
      ]
    },
    {
      id: 'actividad',
      label: 'Mi Actividad',
      icon: BarChart3,
      description: 'Historial y estadísticas',
      submenu: [
        { id: 'actividad-timeline', label: 'Timeline de Actividad', icon: Calendar },
        { id: 'actividad-estadisticas', label: 'Mis Estadísticas', icon: TrendingUp },
        { id: 'actividad-ahorros', label: 'Ahorros Totales', icon: CreditCard },
        { id: 'actividad-comercios', label: 'Comercios Visitados', icon: Target }
      ]
    },
    {
      id: 'comercios',
      label: 'Comercios',
      icon: Building2,
      description: 'Directorio de comercios',
      submenu: [
        { id: 'comercios-directorio', label: 'Directorio', icon: Building2 },
        { id: 'comercios-favoritos', label: 'Mis Favoritos', icon: Heart },
        { id: 'comercios-cercanos', label: 'Cercanos', icon: Target },
        { id: 'comercios-categorias', label: 'Por Categoría', icon: Eye }
      ]
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: Bell,
      description: 'Centro de notificaciones',
      submenu: [
        { id: 'notificaciones-centro', label: 'Centro de Notificaciones', icon: Bell },
        { id: 'notificaciones-beneficios', label: 'Nuevos Beneficios', icon: Gift },
        { id: 'notificaciones-vencimientos', label: 'Vencimientos', icon: Calendar },
        { id: 'notificaciones-configurar', label: 'Configuración', icon: Settings }
      ]
    },
    {
      id: 'recompensas',
      label: 'Recompensas',
      icon: Award,
      description: 'Sistema de puntos',
      submenu: [
        { id: 'recompensas-puntos', label: 'Mis Puntos', icon: Star },
        { id: 'recompensas-logros', label: 'Logros', icon: Award },
        { id: 'recompensas-canjear', label: 'Canjear Puntos', icon: Gift },
        { id: 'recompensas-historial', label: 'Historial', icon: History }
      ]
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: Settings,
      description: 'Configuración de cuenta',
      submenu: [
        { id: 'configuracion-cuenta', label: 'Mi Cuenta', icon: User },
        { id: 'configuracion-privacidad', label: 'Privacidad', icon: Shield },
        { id: 'configuracion-notificaciones', label: 'Notificaciones', icon: Bell },
        { id: 'configuracion-tema', label: 'Tema y Apariencia', icon: Zap }
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
              <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Socio</h2>
                <p className="text-sm text-gray-500 truncate max-w-32">
                  {user?.nombre || 'Mi Portal'}
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
                        ? 'bg-violet-50 text-violet-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className={`w-5 h-5 ${
                        isActive(item.id) ? 'text-violet-600' : 'text-gray-500 group-hover:text-gray-700'
                      }`} />
                      <div>
                        <span className="font-medium text-sm">{item.label}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                    
                    {item.submenu && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        expandedItems.has(item.id) ? 'rotate-180' : ''
                      } ${isActive(item.id) ? 'text-violet-600' : 'text-gray-400'}`} />
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
                                ? 'bg-violet-50 text-violet-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <subItem.icon className={`w-4 h-4 ${
                              activeSection === subItem.id ? 'text-violet-600' : 'text-gray-400'
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