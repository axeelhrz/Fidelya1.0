'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store,
  BarChart3,
  Gift,
  QrCode,
  Receipt,
  Settings,
  LogOut,
  User,
  Bell,
  HelpCircle,
  ChevronRight,
  Home,
  Users,
  Target,
  TrendingUp,
  FileText,
  Star,
  Clock,
  UserPlus,
} from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface ComercioSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onLogoutClick: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string | number;
  children?: MenuItem[];
  isNew?: boolean;
  isComingSoon?: boolean;
}

export const ComercioSidebar: React.FC<ComercioSidebarProps> = ({
  isCollapsed,
  onLogoutClick,
}) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home size={20} />,
      href: '/dashboard/comercio',
    },
    {
      id: 'clientes',
      label: 'Gestión de Clientes',
      icon: <Users size={20} />,
      href: '/dashboard/comercio/clientes',
      isNew: true,
    },
    {
      id: 'beneficios',
      label: 'Beneficios',
      icon: <Gift size={20} />,
      children: [
        {
          id: 'beneficios-activos',
          label: 'Beneficios Activos',
          icon: <Star size={18} />,
          href: '/dashboard/comercio/beneficios',
        },
        {
          id: 'crear-beneficio',
          label: 'Crear Beneficio',
          icon: <UserPlus size={18} />,
          href: '/dashboard/comercio/beneficios/crear',
        },
        {
          id: 'historial-beneficios',
          label: 'Historial',
          icon: <Clock size={18} />,
          href: '/dashboard/comercio/beneficios/historial',
        },
      ],
    },
    {
      id: 'validaciones',
      label: 'Validaciones',
      icon: <QrCode size={20} />,
      children: [
        {
          id: 'qr-validacion',
          label: 'Validar QR',
          icon: <QrCode size={18} />,
          href: '/dashboard/comercio/validaciones/qr',
        },
        {
          id: 'historial-validaciones',
          label: 'Historial',
          icon: <Receipt size={18} />,
          href: '/dashboard/comercio/validaciones/historial',
        },
      ],
    },
    {
      id: 'analytics',
      label: 'Analíticas',
      icon: <BarChart3 size={20} />,
      children: [
        {
          id: 'resumen',
          label: 'Resumen',
          icon: <TrendingUp size={18} />,
          href: '/dashboard/comercio/analytics',
        },
        {
          id: 'reportes',
          label: 'Reportes',
          icon: <FileText size={18} />,
          href: '/dashboard/comercio/analytics/reportes',
        },
        {
          id: 'metricas',
          label: 'Métricas',
          icon: <Target size={18} />,
          href: '/dashboard/comercio/analytics/metricas',
        },
      ],
    },
    {
      id: 'perfil',
      label: 'Mi Perfil',
      icon: <User size={20} />,
      children: [
        {
          id: 'informacion',
          label: 'Información',
          icon: <User size={18} />,
          href: '/dashboard/comercio/perfil',
        },
        {
          id: 'configuracion',
          label: 'Configuración',
          icon: <Settings size={18} />,
          href: '/dashboard/comercio/perfil/configuracion',
        },
        {
          id: 'qr-comercio',
          label: 'Mi Código QR',
          icon: <QrCode size={18} />,
          href: '/dashboard/comercio/perfil/qr',
        },
      ],
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: <Bell size={20} />,
      href: '/dashboard/comercio/notificaciones',
      badge: 3,
    },
    {
      id: 'soporte',
      label: 'Soporte',
      icon: <HelpCircle size={20} />,
      href: '/dashboard/comercio/soporte',
    },
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isParentActive = (children?: MenuItem[]) => {
    if (!children) return false;
    return children.some(child => isActive(child.href));
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const itemIsActive = isActive(item.href);
    const parentIsActive = isParentActive(item.children);

    const MenuContent = () => (
      <div className={`flex items-center gap-3 flex-1 min-w-0 ${level > 0 ? 'pl-4' : ''}`}>
        <div className={`flex-shrink-0 ${
          itemIsActive || parentIsActive 
            ? 'text-blue-600' 
            : 'text-gray-500 group-hover:text-gray-700'
        }`}>
          {item.icon}
        </div>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-2 flex-1 min-w-0"
            >
              <span className={`font-medium truncate ${
                itemIsActive || parentIsActive
                  ? 'text-blue-600' 
                  : 'text-gray-700 group-hover:text-gray-900'
              }`}>
                {item.label}
              </span>
              
              {item.isNew && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Nuevo
                </span>
              )}
              
              {item.isComingSoon && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                  Próximamente
                </span>
              )}
              
              {item.badge && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {hasChildren && !isCollapsed && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className={`flex-shrink-0 ${
              parentIsActive ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <ChevronRight size={16} />
          </motion.div>
        )}
      </div>
    );

    return (
      <div key={item.id}>
        {item.href ? (
          <NextLink href={item.href}>
            <div className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
              itemIsActive
                ? 'bg-blue-50 border border-blue-200 shadow-sm'
                : 'hover:bg-gray-50 border border-transparent'
            }`}>
              <MenuContent />
            </div>
          </NextLink>
        ) : (
          <div
            onClick={() => hasChildren && toggleExpanded(item.id)}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
              parentIsActive
                ? 'bg-blue-50 border border-blue-200 shadow-sm'
                : 'hover:bg-gray-50 border border-transparent'
            }`}
          >
            <MenuContent />
          </div>
        )}

        {/* Submenu */}
        <AnimatePresence>
          {hasChildren && isExpanded && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-3 mt-1 space-y-1 border-l border-gray-200 pl-3"
            >
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white border-r border-gray-200 flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Store size={20} className="text-white" />
          </div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0"
              >
                <h2 className="font-bold text-gray-900 truncate">Mi Comercio</h2>
                <p className="text-sm text-gray-500 truncate">Panel de gestión</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          fullWidth={!isCollapsed}
          onClick={onLogoutClick}
          className={`${
            isCollapsed 
              ? 'w-12 h-12 p-0' 
              : 'justify-start'
          } text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="ml-2">Cerrar Sesión</span>}
        </Button>
      </div>
    </motion.div>
  );
};