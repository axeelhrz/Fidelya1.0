'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Home, 
  Store, 
  Gift, 
  QrCode, 
  Users, 
  Calendar,
  UserCheck,
  Plus,
  LogOut,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Scan
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useComercio } from '@/hooks/useComercio';
import { useNotifications } from '@/hooks/useNotifications';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ComercioSidebarProps {
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
  onLogoutClick: () => void;
  activeSection: string;
}

interface RealtimeStats {
  validacionesHoy: number;
  validacionesMes: number;
  beneficiosActivos: number;
  clientesUnicos: number;
  qrGenerado: boolean;
  qrEscaneos: number;
  qrEscaneosSemana: number;
}

export const ComercioSidebar: React.FC<ComercioSidebarProps> = ({
  open,
  onToggle,
  onMenuClick,
  onLogoutClick,
  activeSection
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { comercio, stats } = useComercio();
  const { stats: notificationStats } = useNotifications();
  
  // Real-time stats state
  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats>({
    validacionesHoy: stats?.validacionesHoy || 0,
    validacionesMes: stats?.validacionesMes || 0,
    beneficiosActivos: stats?.beneficiosActivos || 0,
    clientesUnicos: stats?.clientesUnicos || 0,
    qrGenerado: false,
    qrEscaneos: 0,
    qrEscaneosSemana: 0
  });

  // Update stats when hooks change
  useEffect(() => {
    setRealtimeStats(prev => ({
      ...prev,
      validacionesHoy: stats?.validacionesHoy || 0,
      validacionesMes: stats?.validacionesMes || 0,
      beneficiosActivos: stats?.beneficiosActivos || 0,
      clientesUnicos: stats?.clientesUnicos || 0,
      qrGenerado: !!comercio?.qrCode
    }));
  }, [stats, notificationStats, comercio]);

  // Submenu item type
  type SubmenuItem = {
    id: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    route: string;
    count?: number;
    urgent?: boolean;
  };
  
  // Simplified menu structure for Commerce (removed Analytics, Reportes, Notificaciones, Configuración)
  const menuItems: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    description: string;
    gradient: string;
    route: string;
    badge?: number;
    urgent?: boolean;
    submenu?: SubmenuItem[];
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'Vista general',
      gradient: 'from-sky-500 to-blue-600',
      route: '/dashboard/comercio'
    },
    {
      id: 'perfil',
      label: 'Mi Perfil',
      icon: Store,
      description: 'Información del comercio',
      gradient: 'from-blue-500 to-indigo-600',
      route: '/dashboard/comercio/perfil',
      submenu: [
        { 
          id: 'perfil-datos', 
          label: 'Datos del Comercio', 
          icon: Store,
          route: '/dashboard/comercio/perfil'
        }
      ]
    },
    {
      id: 'beneficios',
      label: 'Beneficios',
      icon: Gift,
      description: 'Gestionar ofertas',
      gradient: 'from-purple-500 to-pink-600',
      route: '/dashboard/comercio/beneficios',
      badge: realtimeStats.beneficiosActivos,
      submenu: [
        { 
          id: 'beneficios-lista', 
          label: 'Mis Beneficios', 
          icon: Gift,
          count: realtimeStats.beneficiosActivos,
          route: '/dashboard/comercio/beneficios'
        },
        { 
          id: 'beneficios-crear', 
          label: 'Crear Beneficio', 
          icon: Plus,
          route: '/dashboard/comercio/beneficios?action=crear'
        },
        { 
          id: 'beneficios-activos', 
          label: 'Beneficios Activos', 
          icon: CheckCircle,
          count: realtimeStats.beneficiosActivos,
          route: '/dashboard/comercio/beneficios?filter=activos'
        },
        { 
          id: 'beneficios-vencidos', 
          label: 'Beneficios Vencidos', 
          icon: Clock,
          route: '/dashboard/comercio/beneficios?filter=vencidos'
        }
      ]
    },
    {
      id: 'qr',
      label: 'Código QR',
      icon: QrCode,
      description: 'Gestión de QR',
      gradient: 'from-emerald-500 to-green-600',
      route: '/dashboard/comercio/qr',
      badge: realtimeStats.qrEscaneos,
      submenu: [
        { 
          id: 'qr-generar', 
          label: 'Generar QR', 
          icon: QrCode,
          route: '/dashboard/comercio/qr/generar'
        },
        { 
          id: 'qr-estadisticas', 
          label: 'Estadísticas de Uso', 
          icon: Activity,
          count: realtimeStats.qrEscaneos,
          route: '/dashboard/comercio/qr/estadisticas'
        }
      ]
    },
    {
      id: 'validaciones',
      label: 'Validaciones',
      icon: UserCheck,
      description: 'Historial de validaciones',
      gradient: 'from-violet-500 to-purple-600',
      route: '/dashboard/comercio/validaciones',
      badge: realtimeStats.validacionesHoy,
      submenu: [
        { 
          id: 'validaciones-recientes', 
          label: 'Recientes', 
          icon: Calendar,
          count: realtimeStats.validacionesHoy,
          route: '/dashboard/comercio/validaciones'
        },
        { 
          id: 'validaciones-historial', 
          label: 'Historial Completo', 
          icon: Activity,
          route: '/dashboard/comercio/validaciones?tab=historial'
        },
        { 
          id: 'validaciones-exitosas', 
          label: 'Exitosas', 
          icon: CheckCircle,
          route: '/dashboard/comercio/validaciones?filter=exitosas'
        },
        { 
          id: 'validaciones-fallidas', 
          label: 'Fallidas', 
          icon: AlertCircle,
          route: '/dashboard/comercio/validaciones?filter=fallidas'
        }
      ]
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: Users,
      description: 'Gestión de clientes',
      gradient: 'from-cyan-500 to-blue-600',
      route: '/dashboard/comercio/clientes',
      badge: realtimeStats.clientesUnicos,
      submenu: [
        { 
          id: 'clientes-lista', 
          label: 'Lista de Clientes', 
          icon: Users,
          count: realtimeStats.clientesUnicos,
          route: '/dashboard/comercio/clientes'
        }
      ]
    }
  ];

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['qr']));

  // Real-time Firebase listeners
  useEffect(() => {
    if (!user) return;

    const unsubscribers: (() => void)[] = [];

    try {
      // Listen to validaciones collection
      const validacionesRef = collection(db, 'validaciones');
      const validacionesQuery = query(
        validacionesRef, 
        where('comercioId', '==', user.uid),
        orderBy('fechaValidacion', 'desc'),
        limit(50)
      );
      
      const unsubscribeValidaciones = onSnapshot(validacionesQuery, (snapshot) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const validacionesHoy = snapshot.docs.filter(doc => {
          const data = doc.data();
          const fechaValidacion = data.fechaValidacion?.toDate();
          return fechaValidacion && fechaValidacion >= today;
        }).length;

        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const validacionesMes = snapshot.docs.filter(doc => {
          const data = doc.data();
          const fechaValidacion = data.fechaValidacion?.toDate();
          return fechaValidacion && fechaValidacion >= thisMonth;
        }).length;

        const clientesUnicos = new Set(
          snapshot.docs.map(doc => doc.data().socioId)
        ).size;
        
        setRealtimeStats(prev => ({
          ...prev,
          validacionesHoy,
          validacionesMes,
          clientesUnicos
        }));
      }, (error) => {
        console.error('Error listening to validaciones:', error);
      });
      unsubscribers.push(unsubscribeValidaciones);

      // Listen to QR scans collection
      const qrScansRef = collection(db, 'qr_scans');
      const qrScansQuery = query(
        qrScansRef,
        where('comercioId', '==', user.uid),
        orderBy('fechaEscaneo', 'desc'),
        limit(100)
      );

      const unsubscribeQRScans = onSnapshot(qrScansQuery, (snapshot) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const qrEscaneos = snapshot.docs.filter(doc => {
          const data = doc.data();
          const fechaEscaneo = data.fechaEscaneo?.toDate();
          return fechaEscaneo && fechaEscaneo >= today;
        }).length;

        const qrEscaneosSemana = snapshot.docs.filter(doc => {
          const data = doc.data();
          const fechaEscaneo = data.fechaEscaneo?.toDate();
          return fechaEscaneo && fechaEscaneo >= weekAgo;
        }).length;

        setRealtimeStats(prev => ({
          ...prev,
          qrEscaneos,
          qrEscaneosSemana
        }));
      }, (error) => {
        console.error('Error listening to QR scans:', error);
      });
      unsubscribers.push(unsubscribeQRScans);

      // Listen to beneficios collection
      const beneficiosRef = collection(db, 'beneficios');
      const beneficiosQuery = query(
        beneficiosRef, 
        where('comercioId', '==', user.uid),
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
  }, [user]);

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleMenuClick = (itemId: string, hasSubmenu: boolean = false, route?: string) => {
    if (hasSubmenu) {
      toggleExpanded(itemId);
    } else if (route) {
      router.push(route);
    } else {
      onMenuClick(itemId);
    }
  };

  const isActive = (itemId: string) => {
    return activeSection === itemId || activeSection.startsWith(itemId + '-');
  };

  const getItemGradient = (item: typeof menuItems[0]) => {
    return item.gradient || 'from-gray-500 to-gray-600';
  };

  return (
    <>
      {/* Backdrop - Solo para móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar - Estático sin animaciones constantes */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 lg:relative lg:translate-x-0 lg:shadow-xl border-r border-white/20 transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            
            {/* Floating elements */}
            <div className="absolute top-2 right-4 w-8 h-8 bg-white/20 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute bottom-4 left-6 w-6 h-6 bg-white/15 rounded-full blur-sm animate-bounce"></div>
            
            <div className="relative z-10 flex items-center justify-between p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Panel Comercial</h2>
                  <p className="text-sm text-blue-100 truncate max-w-32">
                    {comercio?.nombreComercio || user?.nombre || 'Comercio'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onToggle}
                className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-3 text-center shadow-lg border border-gray-100">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-lg font-black text-blue-600">{realtimeStats.validacionesHoy}</div>
                </div>
                <div className="text-xs text-gray-600 font-medium">Hoy</div>
              </div>
              
              <div className="bg-white rounded-2xl p-3 text-center shadow-lg border border-gray-100">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Scan className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-lg font-black text-emerald-600">{realtimeStats.qrEscaneos}</div>
                </div>
                <div className="text-xs text-gray-600 font-medium">QR Hoy</div>
              </div>
            </div>
            
            {/* Activity indicator */}
            <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Activity className="w-3 h-3" />
              <span>Actualización en tiempo real</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id, !!item.submenu, item.route)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left transition-all duration-200 group relative overflow-hidden ${
                      isActive(item.id)
                        ? 'bg-gradient-to-r from-white to-gray-50 text-gray-900 shadow-lg border border-gray-200'
                        : 'text-gray-700 hover:bg-white/80 hover:shadow-md'
                    }`}
                  >
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${getItemGradient(item)} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
                    
                    <div className="flex items-center space-x-3 flex-1 min-w-0 relative z-10">
                      <div className={`p-2.5 rounded-xl transition-all duration-200 ${
                        isActive(item.id) 
                          ? `bg-gradient-to-r ${getItemGradient(item)} text-white shadow-lg` 
                          : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                      }`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-sm truncate block">{item.label}</span>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
                      </div>
                    </div>
                    
                    {/* Badge and indicators */}
                    <div className="flex items-center space-x-2 relative z-10">
                      {item.badge !== undefined && item.badge > 0 && (
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            item.urgent 
                              ? 'bg-red-500 text-white animate-pulse' 
                              : 'bg-blue-500 text-white'
                          }`}
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </div>
                      )}
                      
                      {item.submenu && (
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                          expandedItems.has(item.id) ? 'rotate-180' : ''
                        } ${isActive(item.id) ? 'text-gray-700' : 'text-gray-400'}`} />
                      )}
                    </div>
                  </button>

                  {/* Submenu */}
                  {item.submenu && expandedItems.has(item.id) && (
                    <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
                      {item.submenu.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleMenuClick(subItem.id, false, subItem.route)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                            activeSection === subItem.id
                              ? 'bg-gradient-to-r from-gray-50 to-white text-gray-900 border border-gray-200 shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                              activeSection === subItem.id 
                                ? `bg-gradient-to-r ${getItemGradient(item)} text-white shadow-md` 
                                : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                            }`}>
                              <subItem.icon className="w-3 h-3" />
                            </div>
                            <span className="text-sm font-medium truncate">{subItem.label}</span>
                          </div>
                          
                          {/* Submenu badges */}
                          {subItem.count !== undefined && subItem.count > 0 && (
                            <div
                              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                subItem.urgent 
                                  ? 'bg-red-500 text-white animate-pulse' 
                                  : 'bg-gray-500 text-white'
                              }`}
                            >
                              {subItem.count}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {comercio?.nombreComercio?.charAt(0).toUpperCase() || user?.nombre?.charAt(0).toUpperCase() || 'C'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {comercio?.nombreComercio || user?.nombre || 'Comercio'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'comercio@email.com'}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-emerald-600 font-medium">En línea</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={onLogoutClick}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-all duration-200 group border border-red-200 hover:border-red-300 hover:shadow-md"
            >
              <div className="p-2 rounded-xl bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors duration-200">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">Cerrar Sesión</span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComercioSidebar;