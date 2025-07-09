import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  User, 
  Gift, 
  QrCode, 
  Bell, 
  History,
  Crown,
  ArrowUpRight,
  LogOut
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
      label: 'Inicio / Dashboard',
      icon: Home,
      description: 'Vista general de beneficios y resumen',
      gradient: 'from-sky-500 to-blue-600',
      badge: null,
      href: '/dashboard/socio'
    },
    {
      id: 'perfil',
      label: 'Mi Perfil',
      icon: User,
      description: 'Datos personales y estado de membresía',
      gradient: 'from-emerald-500 to-teal-600',
      badge: null,
      href: '/dashboard/socio/perfil'
    },
    {
      id: 'beneficios',
      label: 'Beneficios',
      icon: Gift,
      description: 'Catálogo con filtros y detalles',
      gradient: 'from-purple-500 to-indigo-600',
      badge: '12',
      href: '/dashboard/socio/beneficios'
    },
    {
      id: 'historial',
      label: 'Historial de usos',
      icon: History,
      description: 'Registro de beneficios canjeados',
      gradient: 'from-amber-500 to-orange-600',
      badge: null,
      href: '/dashboard/socio/historial'
    },
    {
      id: 'validar',
      label: 'Validar Beneficio',
      icon: QrCode,
      description: 'Escáner QR embebido',
      gradient: 'from-teal-500 to-cyan-600',
      badge: null,
      href: '/dashboard/socio/validar'
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: Bell,
      description: 'Avisos y recordatorios',
      gradient: 'from-pink-500 to-rose-600',
      badge: '3',
      href: '/dashboard/socio/notificaciones'
    }
  ];

  const handleMenuClick = (itemId: string, href?: string) => {
    if (href) {
      window.location.href = href;
    } else {
      onMenuClick(itemId);
    }
  };

  const isActive = (itemId: string) => {
    return activeSection === itemId || activeSection.startsWith(itemId + '-');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: open ? 0 : -300 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-white/20"
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-white to-celestial-50/30"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sky-100/20 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-celestial-100/20 to-transparent rounded-full blur-2xl"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 right-8 w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
          <div className="absolute top-40 left-6 w-1 h-1 bg-celestial-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-32 right-12 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>

          {/* Header */}
          <div className="relative z-10 p-6 border-b border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="w-14 h-14 bg-gradient-to-br from-sky-500 to-celestial-600 rounded-3xl flex items-center justify-center shadow-lg relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  <User className="w-7 h-7 text-white relative z-10" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-sky-600 via-celestial-600 to-sky-700 bg-clip-text text-transparent">
                    Portal Socio
                  </h2>
                  <p className="text-sm text-gray-600 truncate max-w-32">
                    {user?.nombre || 'Mi Portal'}
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={onToggle}
                className="lg:hidden w-10 h-10 bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl flex items-center justify-center hover:bg-gray-50/80 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>

            {/* User Status */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-emerald-700">Socio Activo</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-amber-600">Premium</span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                <span>Nivel: Gold</span>
                <span>1,250 pts</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 relative z-10">
            <motion.div 
              className="px-4 space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {menuItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <motion.button
                    onClick={() => handleMenuClick(item.id, item.href)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden ${
                      isActive(item.id)
                        ? 'bg-white/80 backdrop-blur-sm shadow-lg border border-white/40'
                        : 'hover:bg-white/60 hover:backdrop-blur-sm hover:border hover:border-white/30'
                    }`}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="flex items-center space-x-3 relative z-10">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br ${item.gradient} group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold text-sm ${
                            isActive(item.id) ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {item.label}
                          </span>
                          {item.badge && (
                            <motion.div
                              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              {item.badge}
                            </motion.div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                    </div>

                    {/* Active Indicator */}
                    {isActive(item.id) && (
                      <motion.div
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-sky-500 to-celestial-600 rounded-l-full"
                        layoutId="activeIndicator"
                      />
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          </nav>

          {/* Footer */}
          <div className="relative z-10 p-4 border-t border-white/20">
            <motion.button
              onClick={onLogoutClick}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50/80 hover:backdrop-blur-sm transition-all duration-200 group relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <LogOut className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-sm">Cerrar Sesión</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};