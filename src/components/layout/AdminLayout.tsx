'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  Calendar,
  FileText,
  AlertTriangle,
  TrendingUp,
  Brain,
  DollarSign,
  Heart,
  Target,
  MessageSquare,
  Database,
  Menu,
  X,
  ChevronRight,
  Home,
  Activity,
  Search,
  Bell,
  User,
  LogOut,
  Minimize2,
  Maximize2,
  ChevronDown,
  Sparkles,
  Clock,
  Shield,
  Stethoscope,
  BarChart2,
  Layers,
  Headphones,
  Wifi,
  Settings,
  Power,
  Circle,
  Dot
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
  children?: NavigationItem[];
  description?: string;
  isNew?: boolean;
  isPro?: boolean;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'syncing'>('online');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simular estado de conexión
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses: ('online' | 'offline' | 'syncing')[] = ['online', 'syncing'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setConnectionStatus(randomStatus);
      
      if (randomStatus === 'syncing') {
        setTimeout(() => setConnectionStatus('online'), 2000);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
        setIsCollapsed(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Centro de Comando',
      icon: BarChart3,
      href: '/dashboard/ceo',
      description: 'Vista ejecutiva integral',
      children: [
        {
          id: 'executive',
          label: 'Vista Ejecutiva',
          icon: Activity,
          href: '/dashboard/ceo',
          description: 'Dashboard principal'
        },
        {
          id: 'financial',
          label: 'Inteligencia Financiera',
          icon: DollarSign,
          href: '/dashboard/ceo/financial',
          description: 'Análisis financiero'
        },
        {
          id: 'clinical',
          label: 'Operaciones Clínicas',
          icon: Heart,
          href: '/dashboard/ceo/clinical',
          description: 'Métricas clínicas'
        },
        {
          id: 'commercial',
          label: 'Marketing Inteligente',
          icon: Target,
          href: '/dashboard/ceo/commercial',
          description: 'Estrategias comerciales'
        }
      ]
    },
    {
      id: 'patients',
      label: 'Gestión de Pacientes',
      icon: Users,
      href: '/dashboard/patients',
      description: 'Administrar pacientes',
      children: [
        {
          id: 'patients-list',
          label: 'Lista de Pacientes',
          icon: Users,
          href: '/dashboard/patients',
          description: 'Ver todos los pacientes'
        },
        {
          id: 'patients-analytics',
          label: 'Análisis de Pacientes',
          icon: TrendingUp,
          href: '/dashboard/patients/analytics',
          description: 'Estadísticas y tendencias'
        }
      ]
    },
    {
      id: 'sessions',
      label: 'Gestión de Sesiones',
      icon: FileText,
      href: '/dashboard/sessions',
      description: 'Administrar sesiones',
      children: [
        {
          id: 'sessions-list',
          label: 'Historial de Sesiones',
          icon: FileText,
          href: '/dashboard/sessions',
          description: 'Ver todas las sesiones'
        },
        {
          id: 'sessions-ai',
          label: 'Análisis con IA',
          icon: Brain,
          href: '/dashboard/sessions/ai',
          description: 'Insights inteligentes',
          isNew: true
        }
      ]
    },
    {
      id: 'agenda',
      label: 'Agenda y Consultorios',
      icon: Calendar,
      href: '/dashboard/agenda',
      description: 'Gestionar citas',
      children: [
        {
          id: 'calendar',
          label: 'Calendario',
          icon: Calendar,
          href: '/dashboard/agenda',
          description: 'Vista de calendario'
        },
        {
          id: 'rooms',
          label: 'Consultorios',
          icon: Home,
          href: '/dashboard/agenda/rooms',
          description: 'Gestionar espacios'
        }
      ]
    },
    {
      id: 'alerts',
      label: 'Alertas Clínicas',
      icon: AlertTriangle,
      href: '/dashboard/alerts',
      badge: 3,
      description: 'Notificaciones importantes'
    },
    {
      id: 'metrics',
      label: 'Métricas Avanzadas',
      icon: BarChart2,
      href: '/dashboard/metrics',
      description: 'KPIs y análisis profundo',
      isPro: true
    },
    {
      id: 'integrations',
      label: 'Integraciones',
      icon: Layers,
      href: '/dashboard/integrations',
      description: 'Conectar servicios',
      children: [
        {
          id: 'whatsapp',
          label: 'WhatsApp Business',
          icon: MessageSquare,
          href: '/dashboard/integrations/whatsapp',
          description: 'Mensajería automática'
        },
        {
          id: 'sheets',
          label: 'Google Workspace',
          icon: Database,
          href: '/dashboard/integrations/sheets',
          description: 'Sincronización de datos'
        },
        {
          id: 'telehealth',
          label: 'Telemedicina',
          icon: Headphones,
          href: '/dashboard/integrations/telehealth',
          description: 'Consultas virtuales',
          isNew: true
        }
      ]
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isParentActive = (item: NavigationItem) => {
    if (isActive(item.href)) return true;
    return item.children?.some(child => isActive(child.href)) || false;
  };

  const filteredItems = navigationItems.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.label.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.children?.some(child => 
        child.label.toLowerCase().includes(query) ||
        child.description?.toLowerCase().includes(query)
      )
    );
  });

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      console.log('🔄 AdminLayout: Iniciando logout...');
      
      // Cerrar el menú inmediatamente
      setIsUserMenuOpen(false);
      
      // Mostrar confirmación al usuario
      const confirmLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
      
      if (!confirmLogout) {
        setIsLoggingOut(false);
        return;
      }
      
      // Llamar a la función logout del contexto
      await logout();
      
      console.log('✅ AdminLayout: Logout completado');
    } catch (error) {
      console.error('❌ AdminLayout: Error al cerrar sesión:', error);
      
      // En caso de error, forzar redirección
      alert('Error al cerrar sesión. Redirigiendo...');
      window.location.href = '/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'online': return <Wifi size={10} color="#10B981" />;
      case 'syncing': return <Wifi size={10} color="#F59E0B" />;
      case 'offline': return <Wifi size={10} color="#EF4444" />;
    }
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'online': return '#10B981';
      case 'syncing': return '#F59E0B';
      case 'offline': return '#EF4444';
    }
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href);
    const parentActive = isParentActive(item);
    const isHovered = hoveredItem === item.id;

    return (
      <div key={item.id} style={{ marginBottom: level === 0 ? '2px' : '1px' }}>
        <motion.div
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          whileHover={{ x: level === 0 ? 2 : 1 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: 'relative',
            borderRadius: level === 0 ? '12px' : '8px',
            overflow: 'hidden'
          }}
        >
          {hasChildren ? (
            <div
              onClick={() => toggleExpanded(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: isCollapsed && level === 0 
                  ? '12px 8px' 
                  : level === 0 
                    ? '12px 16px' 
                    : '8px 16px 8px 40px',
                cursor: 'pointer',
                borderRadius: level === 0 ? '12px' : '8px',
                margin: isCollapsed && level === 0 ? '0 8px' : level === 0 ? '0 8px' : '0 12px',
                backgroundColor: parentActive 
                  ? 'rgba(37, 99, 235, 0.06)' 
                  : isHovered 
                    ? 'rgba(248, 250, 252, 0.8)' 
                    : 'transparent',
                border: parentActive 
                  ? '1px solid rgba(37, 99, 235, 0.12)' 
                  : isHovered 
                    ? '1px solid rgba(226, 232, 240, 0.6)' 
                    : '1px solid transparent',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: parentActive || isHovered ? 'blur(8px)' : 'none',
                boxShadow: parentActive 
                  ? '0 1px 3px rgba(37, 99, 235, 0.08)' 
                  : isHovered 
                    ? '0 1px 2px rgba(0, 0, 0, 0.03)' 
                    : 'none',
                justifyContent: isCollapsed && level === 0 ? 'center' : 'flex-start'
              }}
            >
              {/* Indicador activo minimalista */}
              {parentActive && (
                <motion.div
                  layoutId="activeIndicator"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '60%',
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    borderRadius: '0 2px 2px 0'
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                width: '100%',
                justifyContent: isCollapsed && level === 0 ? 'center' : 'flex-start'
              }}>
                <div style={{
                  padding: level === 0 ? '8px' : '6px',
                  borderRadius: '8px',
                  backgroundColor: parentActive 
                    ? 'rgba(37, 99, 235, 0.1)' 
                    : 'rgba(100, 116, 139, 0.04)',
                  marginRight: isCollapsed && level === 0 ? '0' : '12px',
                  transition: 'all 0.2s ease'
                }}>
                  <item.icon 
                    size={level === 0 ? 16 : 14} 
                    color={parentActive ? '#2563EB' : '#64748B'} 
                  />
                </div>

                {(!isCollapsed || level > 0) && (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: level === 0 ? '14px' : '13px',
                        fontWeight: parentActive ? 600 : 500,
                        color: parentActive ? '#1E293B' : '#475569',
                        fontFamily: 'Inter, -apple-system, sans-serif',
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em'
                      }}>
                        {item.label}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {/* Badges minimalistas */}
                      {item.isNew && (
                        <div style={{
                          background: '#10B981',
                          color: 'white',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '10px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Nuevo
                        </div>
                      )}

                      {item.isPro && (
                        <div style={{
                          background: '#8B5CF6',
                          color: 'white',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '10px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Pro
                        </div>
                      )}

                      {item.badge && (
                        <div style={{
                          background: '#EF4444',
                          color: 'white',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 700
                        }}>
                          {item.badge > 9 ? '9+' : item.badge}
                        </div>
                      )}

                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                      >
                        <ChevronRight size={12} color="#94A3B8" />
                      </motion.div>
                    </div>
                  </>
                )}

                {/* Tooltip minimalista para modo colapsado */}
                {isCollapsed && level === 0 && isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -8, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    style={{
                      position: 'absolute',
                      left: '100%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      marginLeft: '12px',
                      background: 'rgba(15, 23, 42, 0.95)',
                      backdropFilter: 'blur(12px)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      whiteSpace: 'nowrap',
                      zIndex: 1000,
                      pointerEvents: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {item.label}
                    <div style={{
                      position: 'absolute',
                      left: '-4px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 0,
                      height: 0,
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
                      borderRight: '4px solid rgba(15, 23, 42, 0.95)'
                    }} />
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            <Link 
              href={item.href} 
              style={{ 
                display: 'block', 
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: isCollapsed && level === 0 
                  ? '12px 8px' 
                  : level === 0 
                    ? '12px 16px' 
                    : '8px 16px 8px 40px',
                borderRadius: level === 0 ? '12px' : '8px',
                margin: isCollapsed && level === 0 ? '0 8px' : level === 0 ? '0 8px' : '0 12px',
                backgroundColor: active 
                  ? 'rgba(37, 99, 235, 0.08)' 
                  : isHovered 
                    ? 'rgba(248, 250, 252, 0.8)' 
                    : 'transparent',
                border: active 
                  ? '1px solid rgba(37, 99, 235, 0.15)' 
                  : isHovered 
                    ? '1px solid rgba(226, 232, 240, 0.6)' 
                    : '1px solid transparent',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: active || isHovered ? 'blur(8px)' : 'none',
                boxShadow: active 
                  ? '0 2px 4px rgba(37, 99, 235, 0.1)' 
                  : isHovered 
                    ? '0 1px 2px rgba(0, 0, 0, 0.03)' 
                    : 'none',
                position: 'relative',
                justifyContent: isCollapsed && level === 0 ? 'center' : 'flex-start'
              }}>
                {/* Indicador activo minimalista */}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '3px',
                      height: '60%',
                      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                      borderRadius: '0 2px 2px 0'
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Indicador de subopción activa */}
                {level > 0 && (
                  <div style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: active ? '#2563EB' : '#CBD5E1'
                  }} />
                )}

                <div style={{
                  padding: level === 0 ? '8px' : '6px',
                  borderRadius: '8px',
                  backgroundColor: active 
                    ? 'rgba(37, 99, 235, 0.12)' 
                    : 'rgba(100, 116, 139, 0.04)',
                  marginRight: isCollapsed && level === 0 ? '0' : '12px',
                  transition: 'all 0.2s ease'
                }}>
                  <item.icon 
                    size={level === 0 ? 16 : 14} 
                    color={active ? '#2563EB' : '#64748B'} 
                  />
                </div>

                {(!isCollapsed || level > 0) && (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: level === 0 ? '14px' : '13px',
                        fontWeight: active ? 600 : 500,
                        color: active ? '#1E293B' : '#475569',
                        fontFamily: 'Inter, -apple-system, sans-serif',
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em'
                      }}>
                        {item.label}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {/* Badges minimalistas */}
                      {item.isNew && (
                        <div style={{
                          background: '#10B981',
                          color: 'white',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '10px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Nuevo
                        </div>
                      )}

                      {item.isPro && (
                        <div style={{
                          background: '#8B5CF6',
                          color: 'white',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '10px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Pro
                        </div>
                      )}

                      {item.badge && (
                        <div style={{
                          background: '#EF4444',
                          color: 'white',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 700
                        }}>
                          {item.badge > 9 ? '9+' : item.badge}
                        </div>
                      )}
                    </div>

                    {/* Tooltip minimalista para modo colapsado */}
                    {isCollapsed && level === 0 && isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: -8, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        style={{
                          position: 'absolute',
                          left: '100%',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          marginLeft: '12px',
                          background: 'rgba(15, 23, 42, 0.95)',
                          backdropFilter: 'blur(12px)',
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          whiteSpace: 'nowrap',
                          zIndex: 1000,
                          pointerEvents: 'none',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        {item.label}
                        <div style={{
                          position: 'absolute',
                          left: '-4px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 0,
                          height: 0,
                          borderTop: '4px solid transparent',
                          borderBottom: '4px solid transparent',
                          borderRight: '4px solid rgba(15, 23, 42, 0.95)'
                        }} />
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </Link>
          )}
        </motion.div>

        {/* Submenús minimalistas */}
        <AnimatePresence>
          {hasChildren && isExpanded && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{ 
                overflow: 'hidden',
                marginTop: '4px',
                marginBottom: '8px'
              }}
            >
              <div style={{
                background: 'rgba(248, 250, 252, 0.4)',
                borderRadius: '8px',
                margin: '0 8px',
                padding: '4px 0',
                border: '1px solid rgba(226, 232, 240, 0.3)'
              }}>
                {item.children?.map(child => renderNavigationItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const sidebarWidth = isCollapsed ? '64px' : '280px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAFBFC' }}>
      {/* Sidebar minimalista */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ 
          x: isSidebarOpen ? 0 : -280,
          width: sidebarWidth
        }}
        transition={{ 
          duration: 0.3, 
          ease: [0.4, 0, 0.2, 1]
        }}
        style={{
          width: sidebarWidth,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(226, 232, 240, 0.6)',
          position: 'fixed',
          height: '100vh',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02)'
        }}
      >
        {/* Header minimalista */}
        <div style={{
          padding: isCollapsed ? '20px 12px' : '20px 16px',
          borderBottom: '1px solid rgba(226, 232, 240, 0.4)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isCollapsed ? '0' : '12px',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
            }}>
              <Stethoscope size={16} color="white" />
            </div>
            
            {!isCollapsed && (
              <div>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#0F172A',
                  margin: 0,
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  letterSpacing: '-0.02em'
                }}>
                  Centro Psicológico
                </h2>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  marginTop: '2px'
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#64748B',
                    margin: 0,
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    fontWeight: 500
                  }}>
                    Panel Administrativo
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {getConnectionIcon()}
                    <span style={{
                      fontSize: '10px',
                      color: getConnectionColor(),
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {connectionStatus === 'online' ? 'En línea' : 
                       connectionStatus === 'syncing' ? 'Sync' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Barra de búsqueda minimalista */}
        {!isCollapsed && (
          <div style={{ padding: '16px' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search 
                size={14} 
                color="#94A3B8" 
                style={{
                  position: 'absolute',
                  left: '12px',
                  zIndex: 1
                }}
              />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '8px',
                  border: '1px solid rgba(226, 232, 240, 0.6)',
                  background: 'rgba(248, 250, 252, 0.5)',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, -apple-system, sans-serif'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(226, 232, 240, 0.6)';
                  e.target.style.background = 'rgba(248, 250, 252, 0.5)';
                }}
              />
            </div>
          </div>
        )}

        {/* Navegación minimalista */}
        <nav style={{ 
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '8px 0 16px 0',
          scrollbarWidth: 'none'
        }}>
          <div>
            {filteredItems.map((item, index) => (
              <div key={item.id}>
                {renderNavigationItem(item)}
              </div>
            ))}
          </div>

          {/* Mensaje cuando no hay resultados */}
          {searchQuery && filteredItems.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '32px 16px',
              color: '#94A3B8'
            }}>
              <Search size={24} color="#CBD5E1" style={{ marginBottom: '8px' }} />
              <p style={{ 
                fontSize: '14px',
                fontFamily: 'Inter, -apple-system, sans-serif',
                margin: 0
              }}>
                No se encontraron resultados
              </p>
            </div>
          )}
        </nav>

        {/* Footer minimalista */}
        <div style={{
          padding: isCollapsed ? '12px' : '16px',
          borderTop: '1px solid rgba(226, 232, 240, 0.4)'
        }}>
          {!isCollapsed ? (
            <div style={{
              padding: '12px',
              background: 'rgba(139, 92, 246, 0.04)',
              borderRadius: '8px',
              border: '1px solid rgba(139, 92, 246, 0.08)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '6px'
              }}>
                <div style={{
                  padding: '4px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '6px'
                }}>
                  <Brain size={14} color="#8B5CF6" />
                </div>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#8B5CF6',
                  fontFamily: 'Inter, -apple-system, sans-serif'
                }}>
                  IA Profesional
                </span>
              </div>
              <p style={{
                fontSize: '11px',
                color: '#64748B',
                margin: 0,
                lineHeight: 1.4,
                fontFamily: 'Inter, -apple-system, sans-serif'
              }}>
                Asistente inteligente activo
              </p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(139, 92, 246, 0.06)'
            }}>
              <Brain size={16} color="#8B5CF6" />
            </div>
          )}
        </div>
      </motion.aside>

      {/* Contenido principal */}
      <div style={{
        flex: 1,
        marginLeft: isSidebarOpen ? sidebarWidth : '0',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Topbar minimalista */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.4)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Toggle buttons minimalistas */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                padding: '8px',
                backgroundColor: 'rgba(248, 250, 252, 0.8)',
                borderRadius: '8px',
                border: '1px solid rgba(226, 232, 240, 0.6)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              {isSidebarOpen ? <X size={16} color="#64748B" /> : <Menu size={16} color="#64748B" />}
            </button>

            {isSidebarOpen && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                  padding: '8px',
                  backgroundColor: 'rgba(248, 250, 252, 0.8)',
                  borderRadius: '8px',
                  border: '1px solid rgba(226, 232, 240, 0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                {isCollapsed ? <Maximize2 size={16} color="#64748B" /> : <Minimize2 size={16} color="#64748B" />}
              </button>
            )}

            {/* Información de tiempo minimalista */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              background: 'rgba(248, 250, 252, 0.6)',
              borderRadius: '8px',
              border: '1px solid rgba(226, 232, 240, 0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="#64748B" />
                <span style={{
                  fontSize: '13px',
                  color: '#475569',
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontWeight: 500
                }}>
                  {format(currentTime, 'HH:mm', { locale: es })}
                </span>
              </div>
              <div style={{
                width: '1px',
                height: '12px',
                backgroundColor: 'rgba(226, 232, 240, 0.6)'
              }} />
              <span style={{
                fontSize: '13px',
                color: '#475569',
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontWeight: 500
              }}>
                {format(currentTime, 'dd MMM', { locale: es })}
              </span>
            </div>
          </div>

          {/* Controles de usuario minimalistas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Notificaciones */}
            <button style={{
              position: 'relative',
              padding: '8px',
              backgroundColor: 'rgba(248, 250, 252, 0.8)',
              borderRadius: '8px',
              border: '1px solid rgba(226, 232, 240, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={16} color="#64748B" />
              <div style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '6px',
                height: '6px',
                background: '#EF4444',
                borderRadius: '50%'
              }} />
            </button>

            {/* Botón de logout */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              style={{
                padding: '8px',
                backgroundColor: isLoggingOut ? 'rgba(239, 68, 68, 0.1)' : 'rgba(248, 250, 252, 0.8)',
                borderRadius: '8px',
                border: `1px solid ${isLoggingOut ? 'rgba(239, 68, 68, 0.3)' : 'rgba(226, 232, 240, 0.6)'}`,
                cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isLoggingOut ? 0.7 : 1
              }}
            >
              {isLoggingOut ? (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(239, 68, 68, 0.3)',
                  borderTop: '2px solid #EF4444',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              ) : (
                <Power size={16} color="#EF4444" />
              )}
            </button>

            {/* Avatar de usuario minimalista */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => !isLoggingOut && setIsUserMenuOpen(!isUserMenuOpen)}
                disabled={isLoggingOut}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  backgroundColor: 'rgba(248, 250, 252, 0.8)',
                  borderRadius: '8px',
                  border: '1px solid rgba(226, 232, 240, 0.6)',
                  cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isLoggingOut ? 0.7 : 1
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(37, 99, 235, 0.2)'
                }}>
                  <User size={12} color="white" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0F172A',
                    fontFamily: 'Inter, -apple-system, sans-serif'
                  }}>
                    {user?.name || 'Dr. Mendoza'}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: '#64748B',
                    fontFamily: 'Inter, -apple-system, sans-serif'
                  }}>
                    {user?.role && user.role.toString() === 'admin' ? 'CEO' : 'Terapeuta'}
                  </span>
                </div>
                <ChevronDown size={12} color="#94A3B8" />
              </button>

              {/* Menú de usuario minimalista */}
              <AnimatePresence>
                {isUserMenuOpen && !isLoggingOut && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      background: 'rgba(255, 255, 255, 0.98)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(226, 232, 240, 0.6)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      zIndex: 50,
                      overflow: 'hidden',
                      minWidth: '200px'
                    }}
                  >
                    <div style={{
                      padding: '16px',
                      borderBottom: '1px solid rgba(226, 232, 240, 0.4)'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#0F172A',
                        fontFamily: 'Inter, -apple-system, sans-serif',
                        marginBottom: '2px'
                      }}>
                        {user?.name || 'Dr. Mendoza'}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#64748B',
                        fontFamily: 'Inter, -apple-system, sans-serif'
                      }}>
                        {user?.email || 'admin@centro.com'}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#8B5CF6',
                        fontFamily: 'Inter, -apple-system, sans-serif',
                        fontWeight: 600,
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Shield size={10} />
                        {user?.role?.toString() === 'admin' ? 'Administrador CEO' : 'Terapeuta Profesional'}
                      </div>
                    </div>
                    
                    {/* Configuración */}
                    <button style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#475569',
                      fontFamily: 'Inter, -apple-system, sans-serif',
                      fontWeight: 500,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = 'rgba(37, 99, 235, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                    >
                      <Settings size={14} />
                      Configuración
                    </button>

                    <div style={{
                      height: '1px',
                      background: 'rgba(226, 232, 240, 0.6)',
                      margin: '4px 16px'
                    }} />
                    
                    {/* Cerrar sesión */}
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: '#EF4444',
                        fontFamily: 'Inter, -apple-system, sans-serif',
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.04)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <LogOut size={14} />
                      Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main style={{ 
          flex: 1,
          background: 'transparent'
        }}>
          {children}
        </main>
      </div>

      {/* Overlay para móvil */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(2px)',
              zIndex: 30,
              display: window.innerWidth < 1024 ? 'block' : 'none'
            }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Overlay para cerrar menú de usuario */}
      <AnimatePresence>
        {isUserMenuOpen && !isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
            }}
            onClick={() => setIsUserMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Indicador de logout */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                maxWidth: '280px',
                margin: '16px'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #E2E8F0',
                borderTop: '3px solid #EF4444',
                borderRadius: '50%',
                margin: '0 auto 16px',
                animation: 'spin 1s linear infinite'
              }} />
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#0F172A',
                margin: '0 0 8px 0',
                fontFamily: 'Inter, -apple-system, sans-serif'
              }}>
                Cerrando Sesión
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#64748B',
                margin: 0,
                fontFamily: 'Inter, -apple-system, sans-serif'
              }}>
                Guardando datos de forma segura...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estilos CSS minimalistas */}
      <style jsx>{`
        /* Scrollbar minimalista */
        nav::-webkit-scrollbar {
          width: 2px;
        }
        
        nav::-webkit-scrollbar-track {
          background: transparent;
        }
        
        nav::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 1px;
        }
        
        nav::-webkit-scrollbar-thumb:hover {
          background: rgba(37, 99, 235, 0.4);
        }

        /* Animación de spin */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Estados de focus minimalistas */
        button:focus-visible {
          outline: 2px solid rgba(37, 99, 235, 0.4);
          outline-offset: 2px;
        }

        input:focus-visible {
          outline: none;
        }

        /* Transiciones suaves */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Hover effects minimalistas */
        button:hover {
          transform: translateY(-0.5px);
        }

        button:active {
          transform: translateY(0);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .sidebar-overlay {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
