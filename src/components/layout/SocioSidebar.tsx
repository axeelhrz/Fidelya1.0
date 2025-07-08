'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Zap,
  TrendingUp,
  Calendar,
  MapPin,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { BeneficiosService } from '@/services/beneficios.service';
import { ValidacionesService } from '@/services/validaciones.service';
import Image from 'next/image';

interface SocioSidebarProps {
  open: boolean;
  onToggle: () => void;
  onMenuClick?: (section: string) => void;
  onLogoutClick: () => void;
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

interface UserStats {
  beneficiosDisponibles: number;
  beneficiosUsados: number;
  ahorroTotal: number;
  validacionesHoy: number;
  ultimaValidacion: Date | null;
}

const SIDEBAR_WIDTH = 320;
const SIDEBAR_COLLAPSED_WIDTH = 80;

// Iconos modernos usando Lucide React
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const PersonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const GiftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const QrCodeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
  </svg>
);

export const SocioSidebar: React.FC<SocioSidebarProps> = ({
  open,
  onToggle,
  onMenuClick,
  onLogoutClick,
  activeSection
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { stats: notificationStats } = useNotifications();
  
  // Estados para datos del usuario
  const [userStats, setUserStats] = useState<UserStats>({
    beneficiosDisponibles: 0,
    beneficiosUsados: 0,
    ahorroTotal: 0,
    validacionesHoy: 0,
    ultimaValidacion: null
  });
  const [loading, setLoading] = useState(true);

  // Cargar estadísticas del usuario
  useEffect(() => {
    const loadUserStats = async () => {
      if (!user || !user.asociacionId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Cargar datos en paralelo
        const [beneficios, historial] = await Promise.all([
          BeneficiosService.getBeneficiosDisponibles(user.uid, user.asociacionId)
            .catch(() => []),
          ValidacionesService.getHistorialValidaciones(user.uid)
            .catch(() => [])
        ]);

        // Calcular estadísticas
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const validacionesHoy = historial.filter(v => {
          try {
            const validationDate = v.fechaHora && typeof v.fechaHora.toDate === 'function'
              ? v.fechaHora.toDate()
              : new Date(v.fechaHora as unknown as string | number | Date);
            validationDate.setHours(0, 0, 0, 0);
            return validationDate.getTime() === today.getTime();
          } catch {
            return false;
          }
        }).length;

        const beneficiosUsados = historial.filter(v => v.resultado === 'habilitado').length;
        
        const ahorroTotal = historial
          .filter(v => v.resultado === 'habilitado')
          .reduce((total, v) => total + (v.montoDescuento || 0), 0);

        const ultimaValidacion = historial.length > 0 && historial[0].fechaHora 
          ? (historial[0].fechaHora && typeof (historial[0].fechaHora as { toDate: () => Date }).toDate === 'function'
              ? (historial[0].fechaHora as { toDate: () => Date }).toDate()
              : new Date(historial[0].fechaHora as unknown as string | number | Date))
          : null;

        setUserStats({
          beneficiosDisponibles: beneficios.length,
          beneficiosUsados,
          ahorroTotal,
          validacionesHoy,
          ultimaValidacion
        });

      } catch (error) {
        console.error('Error loading user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserStats();
  }, [user]);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Inicio',
      icon: <HomeIcon />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      description: 'Panel principal',
      route: '/dashboard/socio',
    },
    {
      id: 'perfil',
      label: 'Mi Perfil',
      icon: <PersonIcon />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      description: 'Información personal',
      route: '/dashboard/socio/perfil',
    },
    {
      id: 'beneficios',
      label: 'Beneficios',
      icon: <GiftIcon />,
      badge: userStats.beneficiosDisponibles > 0 ? userStats.beneficiosDisponibles : undefined,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      description: 'Descuentos disponibles',
      route: '/dashboard/socio/beneficios',
    },
    {
      id: 'validar',
      label: 'Validar Beneficio',
      icon: <QrCodeIcon />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      description: 'Escanear QR',
      route: '/dashboard/socio/validar',
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: <BellIcon />,
      badge: notificationStats.unread || 0,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      description: 'Mensajes y avisos',
      route: '/dashboard/socio/notificaciones',
    }
  ];

  const handleMenuClick = (item: MenuItem, event?: React.MouseEvent) => {
    // Prevenir que el click se propague y cause efectos no deseados
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Navegar sin cambiar el estado del sidebar
    if (item.route) {
      router.push(item.route);
    } else if (onMenuClick) {
      onMenuClick(item.id);
    }

    // NO llamamos a onToggle aquí para mantener el estado del sidebar
  };

  const isActive = (item: MenuItem) => {
    if (item.route) {
      return pathname === item.route;
    }
    return activeSection === item.id;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getUserDisplayName = () => {
    if (user?.nombre) {
      return user.nombre;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Socio';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = () => {
    if (!user) return 'bg-gray-500';
    switch (user.estado) {
      case 'activo':
        return 'bg-emerald-500';
      case 'pendiente':
        return 'bg-amber-500';
      case 'suspendido':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    if (!user) return 'DESCONOCIDO';
    switch (user.estado) {
      case 'activo':
        return 'ACTIVO';
      case 'pendiente':
        return 'PENDIENTE';
      case 'suspendido':
        return 'SUSPENDIDO';
      default:
        return 'INACTIVO';
    }
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
                {item.id === 'beneficios' ? `${item.badge} disponibles` : 
                 item.id === 'notificaciones' ? `${item.badge} nuevas` : 
                 item.badge}
              </div>
            )}
            {/* Indicador de página activa */}
            {active && (
              <div className="text-xs text-green-300 mt-1 font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                Página actual
              </div>
            )}
            {/* Arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900/95"></div>
          </div>
        </div>

        <button
          onClick={(e) => handleMenuClick(item, e)}
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
          onClick={(e) => handleMenuClick(item, e)}
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
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <Zap className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    <div>
                      <h1 className="text-xl font-black bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                        Fidelya
                      </h1>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Portal Socio
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
                        {user?.avatar ? (
                          <Image
                            src={user.avatar}
                            alt="Avatar"
                            className="w-full h-full rounded-xl object-cover"
                            width={44}
                            height={44}
                          />
                        ) : (
                          <span className="text-white font-bold text-sm">
                            {getUserInitials()}
                          </span>
                        )}
                      {/* Status indicator */}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor()} rounded-full border-2 border-white shadow-sm`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-sm truncate">
                        {getUserDisplayName()}
                      </div>
                      <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Miembro Activo
                      </div>
                    </div>
                    
                    <div className={`px-2 py-1 ${getStatusColor()} text-white text-xs font-bold rounded-lg shadow-sm`}>
                      {getStatusText()}
                    </div>
                  </div>

                  {/* User Info */}
                  {user?.asociacionId && (
                    <div className="mt-3 pt-3 border-t border-slate-200/50">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">Asociación ID: {user.asociacionId}</span>
                      </div>
                      {user.creadoEn && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>Miembro desde {new Date(user.creadoEn).getFullYear()}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stats compactos */}
                  {!loading && (
                    <div className="flex justify-between mt-4 pt-3 border-t border-slate-200/50">
                      <div className="text-center">
                        <div className="font-black text-slate-800 text-base leading-none">
                          {userStats.beneficiosDisponibles}
                        </div>
                        <div className="text-xs font-semibold text-slate-500 mt-1">
                          Beneficios
                        </div>
                      </div>
                      <div className="w-px bg-slate-200/50" />
                      <div className="text-center">
                        <div className="font-black text-emerald-600 text-base leading-none">
                          {userStats.beneficiosUsados}
                        </div>
                        <div className="text-xs font-semibold text-slate-500 mt-1">
                          Usados
                        </div>
                      </div>
                      <div className="w-px bg-slate-200/50" />
                      <div className="text-center">
                        <div className="font-black text-amber-600 text-base leading-none">
                          {userStats.ahorroTotal > 0 ? formatCurrency(userStats.ahorroTotal) : '$0'}
                        </div>
                        <div className="text-xs font-semibold text-slate-500 mt-1">
                          Ahorrado
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading state */}
                  {loading && (
                    <div className="flex justify-center mt-4 pt-3 border-t border-slate-200/50">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-3 h-3 bg-slate-300 rounded-full animate-pulse" />
                        Cargando estadísticas...
                      </div>
                    </div>
                  )}

                  {/* Quick action for today */}
                  {userStats.validacionesHoy > 0 && (
                    <div className="mt-3 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200/50">
                      <div className="flex items-center gap-2 text-xs">
                        <TrendingUp className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-700 font-medium">
                          {userStats.validacionesHoy} validación{userStats.validacionesHoy > 1 ? 'es' : ''} hoy
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
                  onClick={onLogoutClick}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200/50 hover:border-red-300/50 rounded-2xl flex items-center space-x-3 text-red-600 hover:text-red-700 transition-all duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold text-sm">
                      Cerrar Sesión
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
                  <div className="relative mx-auto mb-2 w-14 h-14">
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="Avatar"
                        className="w-full h-full rounded-2xl object-cover"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <span className="text-white font-bold text-sm flex items-center justify-center w-full h-full">
                        {getUserInitials()}
                      </span>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor()} rounded-full border-2 border-white shadow-sm`} />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onLogoutClick}
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
    </>
  );
};

