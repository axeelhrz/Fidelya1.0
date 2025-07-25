'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Store, 
  BarChart3, 
  Gift,
  LogOut,
  Activity,
  Building2,
  Bell,
  Settings,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSocios } from '@/hooks/useSocios';
import { useComercios } from '@/hooks/useComercios';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';

interface AsociacionSidebarProps {
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
  onLogoutClick: () => void;
  activeSection: string;
  isMobile?: boolean;
}

interface RealtimeStats {
  totalSocios: number;
  sociosActivos: number;
  sociosVencidos: number;
  totalComercios: number;
  comerciosActivos: number;
  solicitudesPendientes: number;
  beneficiosActivos: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  badge?: number;
  isNew?: boolean;
  description?: string;
  color: string;
}

export const AsociacionSidebar: React.FC<AsociacionSidebarProps> = ({
  open,
  onToggle,
  onMenuClick,
  onLogoutClick,
  activeSection,
  isMobile = false
}) => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { stats } = useSocios();
  const { stats: comerciosStats } = useComercios();
  
  const { navigate } = useSidebarNavigation({
    onMenuClick,
    debounceMs: 150
  });

  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats>({
    totalSocios: 0,
    sociosActivos: 0,
    sociosVencidos: 0,
    totalComercios: 0,
    comerciosActivos: 0,
    solicitudesPendientes: 0,
    beneficiosActivos: 0
  });

  const menuItems: MenuItem[] = useMemo(() => [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      route: '/dashboard/asociacion',
      description: 'Vista general del sistema',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'socios',
      label: 'Socios',
      icon: Users,
      route: '/dashboard/asociacion/socios',
      badge: realtimeStats.totalSocios,
      description: 'Gestión de miembros',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'comercios',
      label: 'Comercios',
      icon: Store,
      route: '/dashboard/asociacion/comercios',
      badge: realtimeStats.comerciosActivos,
      description: 'Red de comercios afiliados',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'beneficios',
      label: 'Beneficios',
      icon: Gift,
      route: '/dashboard/asociacion/beneficios',
      badge: realtimeStats.beneficiosActivos,
      description: 'Ofertas y promociones',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      route: '/dashboard/asociacion/analytics',
      isNew: true,
      description: 'Métricas y análisis avanzado',
      color: 'from-indigo-500 to-indigo-600'
    }
  ], [realtimeStats]);

  const memoizedStats = useMemo(() => ({
    totalSocios: stats?.total || 0,
    sociosActivos: stats?.activos || 0,
    sociosVencidos: stats?.vencidos || 0,
    totalComercios: comerciosStats?.totalComercios || 0,
    comerciosActivos: comerciosStats?.comerciosActivos || 0,
    solicitudesPendientes: comerciosStats?.solicitudesPendientes || 0,
    beneficiosActivos: 0
  }), [stats, comerciosStats]);

  useEffect(() => {
    setRealtimeStats(prev => ({
      ...prev,
      ...memoizedStats
    }));
  }, [memoizedStats]);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribers: (() => void)[] = [];

    try {
      const beneficiosRef = collection(db, 'beneficios');
      const beneficiosQuery = query(
        beneficiosRef, 
        where('asociacionesDisponibles', 'array-contains', user.uid),
        where('estado', '==', 'activo')
      );
      
      const unsubscribeBeneficios = onSnapshot(beneficiosQuery, (snapshot) => {
        setRealtimeStats(prev => ({
          ...prev,
          beneficiosActivos: snapshot.docs.length
        }));
      }, (error) => {
        console.error('Error listening to beneficios:', error);
      });
      unsubscribers.push(unsubscribeBeneficios);

    } catch (error) {
      console.error('Error setting up Firebase listeners:', error);
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [user?.uid]);

  const isActiveItem = useCallback((item: MenuItem) => {
    return pathname === item.route || activeSection === item.id;
  }, [pathname, activeSection]);

  const handleMenuClick = useCallback((itemId: string, route: string) => {
    navigate(route, itemId);
    if (isMobile) {
      onToggle();
    }
  }, [navigate, onToggle, isMobile]);

  const handleLogout = async () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      try {
        await signOut();
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="relative px-6 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            
            {open && (
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-gray-900 truncate">
                  {user?.nombre || 'Asociación'}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <Activity className="w-3 h-3 mr-1" />
                    Panel Ejecutivo
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {open ? (
              <X className="w-5 h-5 text-gray-500" />
            ) : (
              <Menu className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-900">{realtimeStats.totalSocios}</p>
                  <p className="text-xs text-blue-600 font-medium">Socios</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-900">{realtimeStats.comerciosActivos}</p>
                  <p className="text-xs text-emerald-600 font-medium">Comercios</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">Resumen de Actividad</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-bold text-gray-900">{realtimeStats.sociosActivos}</p>
                <p className="text-xs text-gray-600">Activos</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{realtimeStats.beneficiosActivos}</p>
                <p className="text-xs text-gray-600">Beneficios</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{realtimeStats.solicitudesPendientes}</p>
                <p className="text-xs text-gray-600">Pendientes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = isActiveItem(item);
          
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id, item.route)}
              className={`
                group w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-300 ease-out
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md border border-blue-200 scale-[1.02]' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:scale-[1.01]'
                }
                ${!open && 'justify-center px-3'}
              `}
            >
              <div className={`
                relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300
                ${isActive 
                  ? `bg-gradient-to-br ${item.color} shadow-lg` 
                  : 'bg-gray-100 group-hover:bg-gray-200'
                }
              `}>
                <item.icon className={`w-5 h-5 transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'
                }`} />
                
                {item.isNew && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              {open && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm truncate">{item.label}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{item.description}</p>
                    </div>
                    
                    {item.badge !== undefined && item.badge > 0 && (
                      <div className={`
                        inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold min-w-[24px] transition-all duration-300
                        ${isActive 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-gray-200 text-gray-700 group-hover:bg-gray-300'
                        }
                      `}>
                        {item.badge > 99 ? '99+' : item.badge}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {open && (
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center space-x-2 px-3 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">Alertas</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 px-3 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Config</span>
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-4 border-t border-gray-100">
        {open ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">
                    {user?.nombre?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.nombre || 'Administrador'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'admin@asociacion.com'}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Cerrar Sesión</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AsociacionSidebar;