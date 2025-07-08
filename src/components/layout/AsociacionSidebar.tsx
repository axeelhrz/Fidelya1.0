'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Zap,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSocios } from '@/hooks/useSocios';
import { useNotifications } from '@/hooks/useNotifications';

interface AsociacionSidebarProps {
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
  onLogoutClick: () => void;
  activeSection: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  color: string;
  gradient: string;
  description?: string;
}

const SIDEBAR_WIDTH = 320;
const SIDEBAR_COLLAPSED_WIDTH = 80;

// Iconos modernos usando Lucide React
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
  </svg>
);

export const AsociacionSidebar: React.FC<AsociacionSidebarProps> = ({
  open,
  onToggle,
  onMenuClick,
  onLogoutClick,
  activeSection
}) => {
  const { user } = useAuth();
  const { stats } = useSocios();
  const { newNotificationCount } = useNotifications();

  const menuItems: MenuItem[] = [
    {
      id: 'overview',
      label: 'Vista General',
      icon: <DashboardIcon />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      description: 'Dashboard principal'
    },
    {
      id: 'analytics',
      label: 'Analytics Avanzado',
      icon: <AnalyticsIcon />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      description: 'Métricas y análisis'
    },
    {
      id: 'members',
      label: 'Gestión de Socios',
      icon: <UsersIcon />,
      badge: stats.total,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      description: 'Administrar socios'
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: <BellIcon />,
      badge: newNotificationCount,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      description: 'Centro de comunicaciones'
    }
  ];

  const renderCollapsedMenuItem = (item: MenuItem) => {
    const isActive = activeSection === item.id;

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
        {/* Tooltip */}
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="bg-slate-900/95 backdrop-blur-xl text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 min-w-[200px]">
            <div className="font-semibold text-sm mb-1">{item.label}</div>
            {item.description && (
              <div className="text-xs text-slate-300 opacity-80">{item.description}</div>
            )}
            {/* Arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900/95"></div>
          </div>
        </div>

        <button
          onClick={() => onMenuClick(item.id)}
          className={`
            relative w-14 h-14 rounded-2xl mx-auto mb-3 transition-all duration-500 ease-out
            flex items-center justify-center overflow-hidden group
            ${isActive 
              ? 'bg-gradient-to-br shadow-2xl scale-110' 
              : 'bg-white/60 hover:bg-white/80 border border-slate-200/50 hover:border-slate-300/50'
            }
          `}
          style={{
            background: isActive ? item.gradient : undefined,
            boxShadow: isActive ? `0 20px 40px ${item.color}40` : undefined,
          }}
        >
          {/* Glow effect */}
          {isActive && (
            <div 
              className="absolute inset-0 rounded-2xl opacity-30 blur-xl"
              style={{ background: item.gradient }}
            />
          )}
          
          {/* Icon container */}
          <div className={`relative z-10 ${isActive ? 'text-white' : ''}`} style={{ color: !isActive ? item.color : undefined }}>
            {item.badge ? (
              <div className="relative">
                {item.icon}
                <div className={`
                  absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold
                  flex items-center justify-center px-1
                  ${isActive ? 'bg-white/90 text-slate-800' : 'bg-red-500 text-white'}
                  shadow-lg
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
    const isActive = activeSection === item.id;

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
          onClick={() => onMenuClick(item.id)}
          className={`
            relative w-full px-4 py-3 rounded-2xl transition-all duration-500 ease-out
            flex items-center group overflow-hidden min-h-[56px]
            ${isActive 
              ? 'bg-gradient-to-r shadow-2xl text-white' 
              : 'bg-white/40 hover:bg-white/60 text-slate-600 hover:text-slate-800 border border-slate-200/30 hover:border-slate-300/50'
            }
          `}
          style={{
            background: isActive ? item.gradient : undefined,
            boxShadow: isActive ? `0 10px 30px ${item.color}30` : undefined,
          }}
        >
          {/* Active indicator */}
          {isActive && (
            <div 
              className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
              style={{ background: 'rgba(255,255,255,0.8)' }}
            />
          )}

          {/* Glow effect */}
          {isActive && (
            <div 
              className="absolute inset-0 rounded-2xl opacity-20 blur-xl"
              style={{ background: item.gradient }}
            />
          )}

          {/* Icon */}
          <div className={`relative z-10 mr-4 flex-shrink-0 ${isActive ? 'text-white' : ''}`} 
               style={{ color: !isActive ? item.color : undefined }}>
            {item.badge ? (
              <div className="relative">
                {item.icon}
                <div className={`
                  absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full text-[9px] font-bold
                  flex items-center justify-center px-1
                  ${isActive ? 'bg-white/90 text-slate-800' : 'bg-red-500 text-white'}
                  shadow-lg
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
              <div className={`text-xs mt-1 opacity-80 ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                {item.description}
              </div>
            )}
          </div>

          {/* Hover effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300" 
               style={{ background: item.gradient }} />
        </button>
      </motion.div>
    );
  };

  return (
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
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <Zap className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <div>
                    <h1 className="text-xl font-black bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                      Asociación
                    </h1>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Centro Ejecutivo
                    </p>
                  </div>
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
                    <Zap className="w-7 h-7 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggle}
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 text-sm truncate">
                      {user?.email?.split('@')[0] || 'Administrador'}
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      Super Administrador
                    </div>
                  </div>
                </div>

                {/* Stats compactos */}
                <div className="flex justify-between mt-4 pt-3 border-t border-slate-200/50">
                  <div className="text-center">
                    <div className="font-black text-slate-800 text-base leading-none">
                      {stats.total}
                    </div>
                    <div className="text-xs font-semibold text-slate-500 mt-1">
                      Total
                    </div>
                  </div>
                  <div className="w-px bg-slate-200/50" />
                  <div className="text-center">
                    <div className="font-black text-emerald-600 text-base leading-none">
                      {stats.activos}
                    </div>
                    <div className="text-xs font-semibold text-slate-500 mt-1">
                      Activos
                    </div>
                  </div>
                  <div className="w-px bg-slate-200/50" />
                  <div className="text-center">
                    <div className="font-black text-red-500 text-base leading-none">
                      {stats.vencidos}
                    </div>
                    <div className="text-xs font-semibold text-slate-500 mt-1">
                      Vencidos
                    </div>
                  </div>
                </div>
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
                onClick={onLogoutClick}
                className="w-full px-4 py-3 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200/50 hover:border-red-300/50 rounded-2xl flex items-center space-x-3 text-red-600 hover:text-red-700 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold text-sm">
                    Cerrar Sesión
                  </div>
                  <div className="text-xs opacity-70">
                    Salir del sistema
                  </div>
                </div>
              </motion.button>
            ) : (
              <motion.button
                key="collapsed-logout"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogoutClick}
                className="w-14 h-14 bg-gradient-to-br from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200/50 hover:border-red-300/50 rounded-2xl flex items-center justify-center text-red-600 hover:text-red-700 transition-all duration-300 mx-auto"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default AsociacionSidebar;