'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Store,
  Gift,
  BarChart3,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  Home,
  UserPlus,
  Building2,
  TrendingUp,
  FileText,
  Mail,
  Shield,
  Database,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSocios } from '@/hooks/useSocios';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  badge?: number;
  children?: SidebarItemProps[];
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  badge,
  children,
  isActive,
  onClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const handleClick = () => {
    if (children) {
      setIsExpanded(!isExpanded);
    }
    if (onClick) {
      onClick();
    }
  };

  const itemContent = (
    <div
      className={cn(
        "flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
        isActive || pathname === href
          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      )}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <div className={cn(
          "flex-shrink-0",
          isActive || pathname === href ? "text-blue-600" : "text-gray-400"
        )}>
          {icon}
        </div>
        <span className="truncate">{label}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        {badge && badge > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
        {children && (
          <div className="text-gray-400">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        )}
      </div>
    </div>
  );

  if (href && !children) {
    return (
      <Link href={href} className="block">
        {itemContent}
      </Link>
    );
  }

  return (
    <div>
      {itemContent}
      <AnimatePresence>
        {children && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-6 mt-1 space-y-1"
          >
            {children.map((child, index) => (
              <SidebarItem key={index} {...child} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AsociacionSidebar: React.FC = () => {
  const { user } = useAuth();
  const { socios } = useSocios();
  const { comerciosVinculados } = useComercios();
  const { beneficios } = useBeneficios();
  const { notifications } = useNotifications();

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const activeSocios = socios.filter(s => s.estado === 'activo').length;
  interface Comercio {
    estado: string;
    // agrega otras propiedades si es necesario
  }
  const activeComercios = Array.isArray(comerciosVinculados)
    ? comerciosVinculados.filter((c: Comercio) => c.estado === 'activo').length
    : 0;
  const activeBeneficios = beneficios.filter(b => b.estado === 'activo').length;

  const menuItems: SidebarItemProps[] = [
    {
      icon: <Home size={20} />,
      label: 'Dashboard',
      href: '/dashboard/asociacion'
    },
    {
      icon: <Users size={20} />,
      label: 'Socios',
      badge: activeSocios,
      children: [
        {
          icon: <Users size={16} />,
          label: 'Ver Todos',
          href: '/dashboard/asociacion/socios'
        },
        {
          icon: <UserPlus size={16} />,
          label: 'Agregar Socio',
          href: '/dashboard/asociacion/socios/nuevo'
        },
        {
          icon: <Upload size={16} />,
          label: 'Importar CSV',
          href: '/dashboard/asociacion/socios/importar'
        }
      ]
    },
    {
      icon: <Store size={20} />,
      label: 'Comercios',
      badge: activeComercios,
      children: [
        {
          icon: <Store size={16} />,
          label: 'Ver Todos',
          href: '/dashboard/asociacion/comercios'
        },
        {
          icon: <Building2 size={16} />,
          label: 'Vincular Comercio',
          href: '/dashboard/asociacion/comercios/vincular'
        },
        {
          icon: <TrendingUp size={16} />,
          label: 'Estadísticas',
          href: '/dashboard/asociacion/comercios/estadisticas'
        }
      ]
    },
    {
      icon: <Gift size={20} />,
      label: 'Beneficios',
      badge: activeBeneficios,
      children: [
        {
          icon: <Gift size={16} />,
          label: 'Ver Todos',
          href: '/dashboard/asociacion/beneficios'
        },
        {
          icon: <TrendingUp size={16} />,
          label: 'Más Usados',
          href: '/dashboard/asociacion/beneficios/populares'
        }
      ]
    },
    {
      icon: <BarChart3 size={20} />,
      label: 'Analytics',
      children: [
        {
          icon: <BarChart3 size={16} />,
          label: 'Resumen General',
          href: '/dashboard/asociacion/analytics'
        },
        {
          icon: <TrendingUp size={16} />,
          label: 'Crecimiento',
          href: '/dashboard/asociacion/analytics/crecimiento'
        },
        {
          icon: <Users size={16} />,
          label: 'Retención',
          href: '/dashboard/asociacion/analytics/retencion'
        }
      ]
    },
    {
      icon: <FileText size={20} />,
      label: 'Reportes',
      children: [
        {
          icon: <FileText size={16} />,
          label: 'Generar Reporte',
          href: '/dashboard/asociacion/reportes'
        },
        {
          icon: <Download size={16} />,
          label: 'Exportar Datos',
          href: '/dashboard/asociacion/reportes/exportar'
        },
        {
          icon: <Database size={16} />,
          label: 'Backup',
          href: '/dashboard/asociacion/reportes/backup'
        }
      ]
    },
    {
      icon: <Bell size={20} />,
      label: 'Notificaciones',
      badge: unreadNotifications,
      href: '/dashboard/asociacion/notificaciones'
    },
    {
      icon: <Mail size={20} />,
      label: 'Comunicaciones',
      children: [
        {
          icon: <Mail size={16} />,
          label: 'Enviar Mensaje',
          href: '/dashboard/asociacion/comunicaciones/enviar'
        },
        {
          icon: <Bell size={16} />,
          label: 'Notificaciones Push',
          href: '/dashboard/asociacion/comunicaciones/push'
        }
      ]
    },
    {
      icon: <Settings size={20} />,
      label: 'Configuración',
      children: [
        {
          icon: <Shield size={16} />,
          label: 'Perfil',
          href: '/dashboard/asociacion/configuracion/perfil'
        },
        {
          icon: <Settings size={16} />,
          label: 'Preferencias',
          href: '/dashboard/asociacion/configuracion/preferencias'
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Asociación</h2>
            <p className="text-sm text-gray-500">{user?.nombre || 'Panel de Control'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <SidebarItem key={index} {...item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Fidelya v2.0</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>En línea</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsociacionSidebar;