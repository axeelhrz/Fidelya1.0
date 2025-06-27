'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Gift,
  QrCode,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface SocioSidebarProps {
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
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

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 80;

export const SocioSidebar: React.FC<SocioSidebarProps> = ({
  open,
  onToggle,
  onMenuClick,
  activeSection
}) => {
  const { user, signOut } = useAuth();

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Inicio',
      icon: <Home size={20} />,
      color: '#6366f1',
      gradient: 'from-indigo-500 to-purple-600',
      description: 'Panel principal'
    },
    {
      id: 'perfil',
      label: 'Mi Perfil',
      icon: <User size={20} />,
      color: '#10b981',
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Información personal'
    },
    {
      id: 'beneficios',
      label: 'Beneficios',
      icon: <Gift size={20} />,
      color: '#f59e0b',
      gradient: 'from-amber-500 to-orange-600',
      description: 'Descuentos disponibles'
    },
    {
      id: 'validar',
      label: 'Validar Beneficio',
      icon: <QrCode size={20} />,
      color: '#8b5cf6',
      gradient: 'from-violet-500 to-purple-600',
      description: 'Escanear QR'
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: <Bell size={20} />,
      badge: 3,
      color: '#ef4444',
      gradient: 'from-red-500 to-pink-600',
      description: 'Mensajes y avisos'
    }
  ];

  const renderMenuItem = (item: MenuItem) => {
    const isActive = activeSection === item.id;

    if (!open) {
      return (
        <motion.div
          key={item.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          <button
            onClick={() => onMenuClick(item.id)}
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative',
              'hover:shadow-lg transform hover:-translate-y-1',
              isActive 
                ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 border border-gray-200'
            )}
          >
            {item.icon}
            {item.badge && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {item.badge}
              </span>
            )}
          </button>
          
          {/* Tooltip */}
          <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            <div className="font-medium">{item.label}</div>
            {item.description && (
              <div className="text-xs text-gray-300 mt-1">{item.description}</div>
            )}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <button
          onClick={() => onMenuClick(item.id)}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden',
            isActive 
              ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          )}
        >
          <div className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg transition-colors',
            isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'
          )}>
            {React.cloneElement(item.icon as React.ReactElement, {
              className: cn(isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900')
            })}
          </div>
          
          <div className="flex-1 text-left">
            <div className="font-medium text-sm">{item.label}</div>
            {item.description && (
              <div className={cn(
                'text-xs mt-0.5',
                isActive ? 'text-white/80' : 'text-gray-500'
              )}>
                {item.description}
              </div>
            )}
          </div>

          {item.badge && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {item.badge}
            </span>
          )}

          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      </motion.div>
    );
  };

  return (
    <div className={cn(
      'bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative',
      open ? 'w-80' : 'w-20'
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div>
                  <h1 className="font-bold text-gray-900">Fidelitá</h1>
                  <p className="text-xs text-gray-500">Portal Socio</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto"
              >
                <span className="text-white font-bold text-lg">F</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* User Profile - Solo cuando está expandido */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {user?.nombre || 'Socio'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {menuItems.map(renderMenuItem)}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {open ? (
          <>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
              <Settings size={20} />
              <span className="text-sm">Configuración</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
              <HelpCircle size={20} />
              <span className="text-sm">Ayuda</span>
            </button>
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm">Cerrar Sesión</span>
            </button>
          </>
        ) : (
          <>
            <button className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors mx-auto">
              <Settings size={20} />
            </button>
            <button 
              onClick={signOut}
              className="w-12 h-12 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors mx-auto"
            >
              <LogOut size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
