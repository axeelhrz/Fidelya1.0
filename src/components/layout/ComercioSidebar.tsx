'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'react-hot-toast';
import {
  LayoutDashboard,
  BarChart3,
  Store,
  Gift,
  QrCode,
  Receipt,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
  TrendingUp,
  Target,
  Shield,
  Sparkles
} from 'lucide-react';

interface ComercioSidebarProps {
  open: boolean;
  onToggle: () => void;
  onMenuClick?: (section: string) => void;
  activeSection?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  children?: MenuItem[];
  color: string;
  gradient: string;
  description?: string;
  route?: string;
}

export const ComercioSidebar: React.FC<ComercioSidebarProps> = ({
  open,
  onToggle,
  onMenuClick,
  activeSection
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { comercio } = useComercios();
  const { activeBeneficios } = useBeneficios();
  const { validaciones, getStats } = useValidaciones();
  const { stats: notificationStats } = useNotifications();
  const [expandedItems, setExpandedItems] = useState<string[]>(['analytics', 'operaciones']);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const stats = getStats();
  const validacionesHoy = validaciones.filter(v => {
    const today = new Date();
    const validacionDate = v.fechaHora.toDate();
    return validacionDate.toDateString() === today.toDateString();
  }).length;

  const handleExpandClick = (itemId: string) => {
    if (!open) return;
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión. Inténtalo de nuevo.');
    } finally {
      setLoggingOut(false);
      setLogoutDialogOpen(false);
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'resumen',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      color: '#3b82f6',
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Vista general del negocio',
      route: '/dashboard/comercio',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      color: '#8b5cf6',
      gradient: 'from-purple-500 to-violet-600',
      description: 'Métricas y análisis',
      route: '/dashboard/comercio/analytics',
      children: [
        {
          id: 'metrics',
          label: 'Métricas Clave',
          icon: <TrendingUp className="w-4 h-4" />,
          color: '#10b981',
          gradient: 'from-emerald-500 to-teal-600',
        },
        {
          id: 'reports',
          label: 'Reportes',
          icon: <Target className="w-4 h-4" />,
          color: '#f59e0b',
          gradient: 'from-amber-500 to-orange-600',
        },
        {
          id: 'insights',
          label: 'Insights IA',
          icon: <Sparkles className="w-4 h-4" />,
          color: '#ec4899',
          gradient: 'from-pink-500 to-rose-600',
        }
      ]
    },
    {
      id: 'perfil',
      label: 'Mi Comercio',
      icon: <Store className="w-5 h-5" />,
      color: '#10b981',
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Perfil y configuración',
      route: '/dashboard/comercio/perfil',
    },
    {
      id: 'operaciones',
      label: 'Operaciones',
      icon: <Gift className="w-5 h-5" />,
      color: '#f59e0b',
      gradient: 'from-amber-500 to-orange-600',
      description: 'Gestión operativa',
      children: [
        {
          id: 'beneficios',
          label: 'Beneficios',
          icon: <Gift className="w-4 h-4" />,
          badge: activeBeneficios.length,
          color: '#f59e0b',
          gradient: 'from-amber-500 to-orange-600',
        },
        {
          id: 'qr-validacion',
          label: 'Validar QR',
          icon: <QrCode className="w-4 h-4" />,
          color: '#ec4899',
          gradient: 'from-pink-500 to-rose-600',
        },
        {
          id: 'historial-validaciones',
          label: 'Validaciones',
          icon: <Receipt className="w-4 h-4" />,
          badge: validacionesHoy > 0 ? validacionesHoy : undefined,
          color: '#8b5cf6',
          gradient: 'from-purple-500 to-violet-600',
        }
      ]
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: <Bell className="w-5 h-5" />,
      badge: notificationStats.unread,
      color: '#ec4899',
      gradient: 'from-pink-500 to-rose-600',
      description: 'Centro de comunicaciones'
    }
  ];

  const handleMenuClick = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route);
    } else if (onMenuClick) {
      onMenuClick(item.id);
    }
  };

  const isActive = (item: MenuItem) => {
    if (item.route) {
      return pathname === item.route;
    }
    return activeSection === item.id;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const active = isActive(item);
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    if (!open && level === 0) {
      // Collapsed view for top-level items
      return (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-2"
        >
          <div className="group relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMenuClick(item)}
              className={`
                w-full p-3 rounded-xl transition-all duration-300 relative overflow-hidden
                ${active 
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                  : 'text-slate-600 hover:bg-slate-100'
                }
              `}
            >
              {/* Background glow for active state */}
              {active && (
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 blur-xl`} />
              )}
              
              <div className="relative flex items-center justify-center">
                {item.icon}
                {item.badge && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </div>
                )}
              </div>
            </motion.button>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
              <div className="bg-slate-800 text-white text-sm px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                {item.label}
                {item.description && (
                  <div className="text-xs text-slate-300 mt-1">{item.description}</div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // Expanded view
    return (
      <div key={item.id} className={level === 0 ? 'mb-1' : 'mb-0.5'}>
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (hasChildren) {
              handleExpandClick(item.id);
            } else {
              handleMenuClick(item);
            }
          }}
          className={`
            w-full p-3 rounded-xl transition-all duration-300 relative overflow-hidden text-left
            ${level > 0 ? 'ml-4 text-sm' : ''}
            ${active 
              ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
              : 'text-slate-700 hover:bg-slate-100'
            }
          `}
        >
          {/* Background glow for active state */}
          {active && (
            <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 blur-xl`} />
          )}
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`${level > 0 ? 'text-current' : ''}`}>
                {item.icon}
              </div>
              <div>
                <div className="font-semibold">{item.label}</div>
                {item.description && level === 0 && (
                  <div className={`text-xs mt-0.5 ${active ? 'text-white/80' : 'text-slate-500'}`}>
                    {item.description}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {item.badge && (
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                  active ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                }`}>
                  {item.badge}
                </div>
              )}
              {hasChildren && (
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              )}
            </div>
          </div>
        </motion.button>

        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-0.5">
                {item.children?.map(child => renderMenuItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid bg-[size:20px_20px]"></div>
      </div>

      {/* Header */}
      <div className={`p-4 border-b border-slate-200 relative z-10 ${open ? '' : 'px-2'}`}>
        <div className="flex items-center justify-between">
          {open && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 truncate">
                  {comercio?.nombreComercio || 'Mi Comercio'}
                </h2>
                <p className="text-xs text-slate-500">Panel de Control</p>
              </div>
            </motion.div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg"
          >
            {open ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </motion.button>
        </div>

        {/* User Profile - Only when expanded */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user?.email?.split('@')[0] || 'Usuario'}
                </p>
                <p className="text-xs text-slate-500">Propietario</p>
              </div>
              <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                PRO
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div>
                <p className="text-lg font-bold text-slate-800">{stats.totalValidaciones}</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-600">{validacionesHoy}</p>
                <p className="text-xs text-slate-500">Hoy</p>
              </div>
              <div>
                <p className="text-lg font-bold text-amber-600">{activeBeneficios.length}</p>
                <p className="text-xs text-slate-500">Activos</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto relative z-10">
        <div className="space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </div>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t border-slate-200 relative z-10 ${open ? '' : 'px-2'}`}>
        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogoutClick}
          disabled={loggingOut}
          className={`
            w-full p-3 rounded-xl transition-all duration-300 relative overflow-hidden
            ${open ? 'text-left' : 'text-center'}
            text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300
          `}
        >
          <div className={`flex items-center ${open ? 'space-x-3' : 'justify-center'}`}>
            <LogOut className="w-5 h-5" />
            {open && (
              <div>
                <div className="font-semibold">
                  {loggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
                </div>
                <div className="text-xs text-red-500">Salir del sistema</div>
              </div>
            )}
          </div>
        </motion.button>

        {/* Status Indicator */}
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 flex items-center justify-center space-x-2 text-xs text-slate-500"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>Sistema Operativo</span>
          </motion.div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {logoutDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setLogoutDialogOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Confirmar Cierre de Sesión
                </h3>
                <p className="text-slate-600 mb-6">
                  ¿Estás seguro de que deseas cerrar tu sesión?
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setLogoutDialogOpen(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleLogoutConfirm}
                    disabled={loggingOut}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {loggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};