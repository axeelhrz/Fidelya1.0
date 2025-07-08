'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'react-hot-toast';
import {
  LayoutDashboard,
  Store,
  Gift,
  QrCode,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Shield,
  MapPin,
  Calendar
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
  color: string;
  gradient: string;
  description?: string;
  route?: string;
}

const SIDEBAR_WIDTH = 320;
const SIDEBAR_COLLAPSED_WIDTH = 80;

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
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const stats = getStats();
  const validacionesHoy = validaciones.filter(v => {
    const today = new Date();
    const validacionDate = v.fechaHora.toDate();
    return validacionDate.toDateString() === today.toDateString();
  }).length;

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
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      description: 'Vista general del negocio',
      route: '/dashboard/comercio',
    },
    {
      id: 'perfil',
      label: 'Mi Comercio',
      icon: <Store className="w-5 h-5" />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      description: 'Perfil y configuración',
      route: '/dashboard/comercio',
    },
    {
      id: 'beneficios',
      label: 'Beneficios',
      icon: <Gift className="w-5 h-5" />,
      badge: activeBeneficios.length > 0 ? activeBeneficios.length : undefined,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      description: 'Gestión de ofertas',
      route: '/dashboard/comercio',
    },
    {
      id: 'validaciones',
      label: 'Validaciones',
      icon: <QrCode className="w-5 h-5" />,
      badge: validacionesHoy > 0 ? validacionesHoy : undefined,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      description: 'Historial y validar QR',
      route: '/dashboard/comercio',
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: <Bell className="w-5 h-5" />,
      badge: notificationStats.unread || 0,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      description: 'Centro de comunicaciones',
      route: '/dashboard/comercio',
    }
  ];

  const handleMenuClick = (item: MenuItem) => {
    // Navegar al dashboard principal si no estamos ahí
    if (pathname !== '/dashboard/comercio') {
      router.push('/dashboard/comercio');
    }
    
    // Cambiar la sección activa
    if (onMenuClick) {
      onMenuClick(item.id);
    }
  };

  const isActive = (item: MenuItem) => {
    // Solo verificar la sección activa cuando estamos en el dashboard principal
    if (pathname === '/dashboard/comercio') {
      return activeSection === item.id;
    }
    
    return false;
  };

  const getUserDisplayName = () => {
    if (comercio?.nombreComercio) {
      return comercio.nombreComercio;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Comercio';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderCollapsedMenuItem = (item: MenuItem) => {
    const active = isActive(item);

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
      >
        {/* Tooltip mejorado */}
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="bg-slate-900/95 backdrop-blur-xl text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 min-w-[200px]">
            <div className="font-semibold text-sm mb-1">{item.label}</div>
            {item.description && (
              <div className="text-xs text-slate-300 opacity-80">{item.description}</div>
            )}
            {item.badge && typeof item.badge === 'number' && item.badge > 0 && (
              <div className="text-xs text-blue-300 mt-1 font-medium">
                {item.id === 'beneficios' ? `${item.badge} activos` : 
                 item.id === 'validaciones' ? `${item.badge} hoy` :
                 item.id === 'notificaciones' ? `${item.badge} nuevas` : 
                 item.badge}
              </div>
            )}
            {/* Indicador de página activa */}
            {active && (
              <div className="text-xs text-green-300 mt-1 font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                Sección actual
              </div>
            )}
            {/* Arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900/95"></div>
          </div>
        </div>

        <button
          onClick={() => handleMenuClick(item)}
          className={`
            relative w-14 h-14 rounded-2xl mx-auto mb-3 transition-all duration-500 ease-out
            flex items-center justify-center overflow-hidden group
            ${active 
              ? 'bg-gradient-to-br shadow-2xl scale-110' 
              : 'bg-white/60 hover:bg-white/80 border border-slate-200/50 hover:border-slate-300/50'
            }
          `}
          style={{
            background: active ? item.gradient : undefined,
            boxShadow: active ? `0 20px 40px ${item.color}40` : undefined,
          }}
        >
          {/* Glow effect */}
          {active && (
            <div 
              className="absolute inset-0 rounded-2xl opacity-30 blur-xl"
              style={{ background: item.gradient }}
            />
          )}
          
          {/* Icon container */}
          <div className={`relative z-10 ${active ? 'text-white' : ''}`} style={{ color: !active ? item.color : undefined }}>
            {item.badge && typeof item.badge === 'number' && item.badge > 0 ? (
              <div className="relative">
                {item.icon}
                <div className={`
                  absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold
                  flex items-center justify-center px-1
                  ${active ? 'bg-white/90 text-slate-800' : 'bg-red-500 text-white'}
                  shadow-lg animate-pulse
                `}>
                  {item.badge > 99 ? '99+' : item.badge}
                </div>
              </div>
            ) : (
              item.icon
            )}
          </div>

          {/* Hover effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
               style={{ background: item.gradient }} />
        </button>
      </motion.div>
    );
  };

  const renderExpandedMenuItem = (item: MenuItem) => {
    const active = isActive(item);

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className="mb-3"
      >
        <button
          onClick={() => handleMenuClick(item)}
          className={`
            relative w-full px-4 py-3 rounded-2xl transition-all duration-500 ease-out
            flex items-center group overflow-hidden min-h-[56px]
            ${active 
              ? 'bg-gradient-to-r shadow-2xl text-white' 
              : 'bg-white/40 hover:bg-white/60 text-slate-600 hover:text-slate-800 border border-slate-200/30 hover:border-slate-300/50'
            }
          `}
          style={{
            background: active ? item.gradient : undefined,
            boxShadow: active ? `0 10px 30px ${item.color}30` : undefined,
          }}
        >
          {/* Active indicator */}
          {active && (
            <div 
              className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
              style={{ background: 'rgba(255,255,255,0.8)' }}
            />
          )}

          {/* Glow effect */}
          {active && (
            <div 
              className="absolute inset-0 rounded-2xl opacity-20 blur-xl"
              style={{ background: item.gradient }}
            />
          )}

          {/* Icon */}
          <div className={`relative z-10 mr-4 flex-shrink-0 ${active ? 'text-white' : ''}`} 
               style={{ color: !active ? item.color : undefined }}>
            {item.badge && typeof item.badge === 'number' && item.badge > 0 ? (
              <div className="relative">
                {item.icon}
                <div className={`
                  absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full text-[9px] font-bold
                  flex items-center justify-center px-1
                  ${active ? 'bg-white/90 text-slate-800' : 'bg-red-500 text-white'}
                  shadow-lg animate-pulse
                `}>
                  {item.badge > 99 ? '99+' : item.badge}
                </div>
              </div>
            ) : (
              item.icon
            )}
          </div>

          {/* Content */}
          <div className="flex-1 text-left relative z-10">
            <div className="font-semibold text-base leading-tight">
              {item.label}
            </div>
            {item.description && (
              <div className={`text-xs mt-1 opacity-80 ${active ? 'text-white/80' : 'text-slate-500'}`}>
                {item.description}
              </div>
            )}
          </div>

          {/* Badge */}
          {item.badge && typeof item.badge === 'number' && item.badge > 0 && (
            <div className={`
              relative z-10 px-2 py-1 rounded-full text-xs font-bold
              ${active ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}
            `}>
              {item.badge > 99 ? '99+' : item.badge}
            </div>
          )}

          {/* Hover effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300" 
               style={{ background: item.gradient }} />
        </button>
      </motion.div>
    );
  };

  return (
    <>
      <motion.div
        animate={{ width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full z-50 bg-gradient-to-b from-slate-50/95 via-white/90 to-slate-100/95 backdrop-blur-xl border-r border-slate-200/50 shadow-2xl"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50" />
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className={`${open ? 'p-6' : 'p-4'} border-b border-slate-200/50`}>
            <div className={`flex items-center ${open ? 'justify-between' : 'justify-center flex-col space-y-4'}`}>
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div
                    key="expanded-header"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-4"
                  >
                    <>
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                      ></motion.div>
                        <Store className="w-6 h-6 text-white" />
                      
                      <div>
                        <h1 className="text-xl font-black bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                          Fidelya
                        </h1>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Portal Comercio
                        </p>
                      </div>
                    </>
                  </motion.div>
                ) : (
                  <motion.div
                    key="collapsed-header"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl"
                    >
                      <Store className="w-7 h-7 text-white" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggle}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
                title={open ? 'Colapsar sidebar' : 'Expandir sidebar'}
              >
                {open ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </motion.button>
            </div>

            {/* User Profile - Solo en modo expandido */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="mt-6 p-4 bg-gradient-to-br from-white/60 to-slate-50/60 rounded-2xl border border-slate-200/50 backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                        {comercio?.logoUrl ? (
                          <Image
                            src={comercio.logoUrl}
                            alt="Logo"
                            className="w-full h-full rounded-xl object-cover"
                            width={44}
                            height={44}
                            unoptimized
                          />
                        ) : (
                          <span className="text-white font-bold text-sm">
                            {getUserInitials()}
                          </span>
                        )}
                      {/* Status indicator */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-sm truncate">
                        {getUserDisplayName()}
                      </div>
                      <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Comercio Activo
                      </div>
                    </div>
                    
                    <div className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm">
                      PRO
                    </div>
                  </div>

                  {/* Comercio Info */}
                  {comercio && (
                    <div className="mt-3 pt-3 border-t border-slate-200/50">
                      {comercio.direccion && (
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{comercio.direccion}</span>
                        </div>
                      )}
                      {comercio.fechaRegistro && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>Activo desde {new Date(comercio.fechaRegistro).getFullYear()}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stats compactos */}
                  <div className="flex justify-between mt-4 pt-3 border-t border-slate-200/50">
                    <div className="text-center">
                      <div className="font-black text-slate-800 text-base leading-none">
                        {stats.totalValidaciones}
                      </div>
                      <div className="text-xs font-semibold text-slate-500 mt-1">
                        Total
                      </div>
                    </div>
                    <div className="w-px bg-slate-200/50" />
                    <div className="text-center">
                      <div className="font-black text-emerald-600 text-base leading-none">
                        {validacionesHoy}
                      </div>
                      <div className="text-xs font-semibold text-slate-500 mt-1">
                        Hoy
                      </div>
                    </div>
                    <div className="w-px bg-slate-200/50" />
                    <div className="text-center">
                      <div className="font-black text-amber-600 text-base leading-none">
                        {activeBeneficios.length}
                      </div>
                      <div className="text-xs font-semibold text-slate-500 mt-1">
                        Activos
                      </div>
                    </div>
                  </div>

                  {/* Quick action for today */}
                  {validacionesHoy > 0 && (
                    <div className="mt-3 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200/50">
                      <div className="flex items-center gap-2 text-xs">
                        <TrendingUp className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-700 font-medium">
                          {validacionesHoy} validación{validacionesHoy > 1 ? 'es' : ''} hoy
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4">
            <div className="space-y-2">
              {menuItems.map(item => 
                open ? renderExpandedMenuItem(item) : renderCollapsedMenuItem(item)
              )}
            </div>
          </div>

          {/* Logout Section */}
          <div className={`border-t border-slate-200/50 ${open ? 'p-6' : 'p-4'}`}>
            <AnimatePresence mode="wait">
              {open ? (
                <motion.button
                  key="expanded-logout"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogoutClick}
                  disabled={loggingOut}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200/50 hover:border-red-300/50 rounded-2xl flex items-center space-x-3 text-red-600 hover:text-red-700 transition-all duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold text-sm">
                      {loggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
                    </div>
                    <div className="text-xs opacity-70">
                      {getUserDisplayName()}
                    </div>
                  </div>
                </motion.button>
              ) : (
                <motion.div
                  key="collapsed-logout"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogoutClick}
                    disabled={loggingOut}
                    className="w-14 h-14 bg-gradient-to-br from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200/50 hover:border-red-300/50 rounded-2xl flex items-center justify-center text-red-600 hover:text-red-700 transition-all duration-300 mx-auto"
                    title="Cerrar sesión"
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

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
    </>
  );
};