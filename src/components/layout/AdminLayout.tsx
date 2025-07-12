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
  Power
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
      case 'online': return <Wifi size={12} color="#10B981" />;
      case 'syncing': return <Wifi size={12} color="#F59E0B" />;
      case 'offline': return <Wifi size={12} color="#EF4444" />;
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
    const isHovered = hoveredItem === item.id;

    return (
      <div key={item.id} style={{ marginBottom: '0.125rem' }}>
        <motion.div
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          whileHover={{ x: level === 0 ? 3 : 2 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            position: 'relative',
            borderRadius: '0.875rem',
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
                  ? '0.875rem 0.75rem' 
                  : level === 0 
                    ? '0.875rem 1rem' 
                    : '0.625rem 1rem 0.625rem 2.25rem',
                cursor: 'pointer',
                borderRadius: '0.875rem',
                margin: isCollapsed && level === 0 ? '0 0.5rem' : '0 0.625rem',
                backgroundColor: active 
                  ? 'rgba(37, 99, 235, 0.08)' 
                  : isHovered 
                    ? 'rgba(249, 250, 251, 0.9)' 
                    : 'transparent',
                border: active 
                  ? '1px solid rgba(37, 99, 235, 0.15)' 
                  : isHovered 
                    ? '1px solid rgba(229, 231, 235, 0.4)' 
                    : '1px solid transparent',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: active || isHovered ? 'blur(8px)' : 'none',
                boxShadow: active 
                  ? '0 2px 8px rgba(37, 99, 235, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                  : isHovered 
                    ? '0 1px 3px rgba(0, 0, 0, 0.04)' 
                    : 'none',
                justifyContent: isCollapsed && level === 0 ? 'center' : 'flex-start'
              }}
            >
              {/* Indicador activo mejorado */}
              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '70%',
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    borderRadius: '0 2px 2px 0',
                    boxShadow: '0 0 8px rgba(37, 99, 235, 0.4)'
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
                  padding: '0.5rem',
                  borderRadius: '0.625rem',
                  backgroundColor: active 
                    ? 'rgba(37, 99, 235, 0.12)' 
                    : isHovered 
                      ? 'rgba(107, 114, 128, 0.08)'
                      : 'rgba(107, 114, 128, 0.05)',
                  marginRight: isCollapsed && level === 0 ? '0' : '0.75rem',
                  transition: 'all 0.25s ease',
                  border: active ? '1px solid rgba(37, 99, 235, 0.1)' : '1px solid transparent'
                }}>
                  <item.icon 
                    size={16} 
                    color={active ? '#2563EB' : '#6B7280'} 
                  />
                </div>

                {(!isCollapsed || level > 0) && (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.8125rem',
                        fontWeight: active ? 600 : 500,
                        color: active ? '#2563EB' : '#374151',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em'
                      }}>
                        {item.label}
                      </div>
                      {item.description && level === 0 && (
                        <div style={{
                          fontSize: '0.6875rem',
                          color: '#9CA3AF',
                          marginTop: '0.125rem',
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: 1.3
                        }}>
                          {item.description}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      {/* Badges mejorados */}
                      {item.isNew && (
                        <motion.div
                          initial={{ scale: 0, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          style={{
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            color: 'white',
                            borderRadius: '0.375rem',
                            padding: '0.125rem 0.375rem',
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.025em',
                            boxShadow: '0 1px 3px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          Nuevo
                        </motion.div>
                      )}

                      {item.isPro && (
                        <motion.div
                          initial={{ scale: 0, rotate: 10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          style={{
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                            color: 'white',
                            borderRadius: '0.375rem',
                            padding: '0.125rem 0.375rem',
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.025em',
                            boxShadow: '0 1px 3px rgba(139, 92, 246, 0.3)'
                          }}
                        >
                          Pro
                        </motion.div>
                      )}

                      {item.badge && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          style={{
                            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </motion.div>
                      )}

                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <ChevronRight size={14} color="#9CA3AF" />
                      </motion.div>
                    </div>
                  </>
                )}

                {/* Tooltip mejorado para modo colapsado */}
                {isCollapsed && level === 0 && isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -10, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{
                      position: 'absolute',
                      left: '100%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      marginLeft: '0.75rem',
                      background: 'rgba(0, 0, 0, 0.92)',
                      backdropFilter: 'blur(12px)',
                      color: 'white',
                      padding: '0.875rem 1rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.8125rem',
                      whiteSpace: 'nowrap',
                      zIndex: 1000,
                      pointerEvents: 'none',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      maxWidth: '280px'
                    }}
                  >
                    <div style={{ 
                      fontWeight: 600, 
                      marginBottom: '0.25rem',
                      color: '#FFFFFF'
                    }}>
                      {item.label}
                    </div>
                    {item.description && (
                      <div style={{ 
                        fontSize: '0.75rem', 
                        opacity: 0.85,
                        lineHeight: 1.4,
                        color: '#E5E7EB'
                      }}>
                        {item.description}
                      </div>
                    )}
                    <div style={{
                      position: 'absolute',
                      left: '-6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 0,
                      height: 0,
                      borderTop: '6px solid transparent',
                      borderBottom: '6px solid transparent',
                      borderRight: '6px solid rgba(0, 0, 0, 0.92)'
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
                  ? '0.875rem 0.75rem' 
                  : level === 0 
                    ? '0.875rem 1rem' 
                    : '0.625rem 1rem 0.625rem 2.25rem',
                borderRadius: '0.875rem',
                margin: isCollapsed && level === 0 ? '0 0.5rem' : '0 0.625rem',
                backgroundColor: active 
                  ? 'rgba(37, 99, 235, 0.08)' 
                  : isHovered 
                    ? 'rgba(249, 250, 251, 0.9)' 
                    : 'transparent',
                border: active 
                  ? '1px solid rgba(37, 99, 235, 0.15)' 
                  : isHovered 
                    ? '1px solid rgba(229, 231, 235, 0.4)' 
                    : '1px solid transparent',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: active || isHovered ? 'blur(8px)' : 'none',
                boxShadow: active 
                  ? '0 2px 8px rgba(37, 99, 235, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                  : isHovered 
                    ? '0 1px 3px rgba(0, 0, 0, 0.04)' 
                    : 'none',
                position: 'relative',
                justifyContent: isCollapsed && level === 0 ? 'center' : 'flex-start'
              }}>
                {/* Indicador activo mejorado */}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '3px',
                      height: '70%',
                      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                      borderRadius: '0 2px 2px 0',
                      boxShadow: '0 0 8px rgba(37, 99, 235, 0.4)'
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <div style={{
                  padding: '0.5rem',
                  borderRadius: '0.625rem',
                  backgroundColor: active 
                    ? 'rgba(37, 99, 235, 0.12)' 
                    : isHovered 
                      ? 'rgba(107, 114, 128, 0.08)'
                      : 'rgba(107, 114, 128, 0.05)',
                  marginRight: isCollapsed && level === 0 ? '0' : '0.75rem',
                  transition: 'all 0.25s ease',
                  border: active ? '1px solid rgba(37, 99, 235, 0.1)' : '1px solid transparent'
                }}>
                  <item.icon 
                    size={16} 
                    color={active ? '#2563EB' : '#6B7280'} 
                  />
                </div>

                {(!isCollapsed || level > 0) && (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.8125rem',
                        fontWeight: active ? 600 : 500,
                        color: active ? '#2563EB' : '#374151',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em'
                      }}>
                        {item.label}
                      </div>
                      {item.description && level === 0 && (
                        <div style={{
                          fontSize: '0.6875rem',
                          color: '#9CA3AF',
                          marginTop: '0.125rem',
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: 1.3
                        }}>
                          {item.description}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      {/* Badges mejorados */}
                      {item.isNew && (
                        <motion.div
                          initial={{ scale: 0, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          style={{
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            color: 'white',
                            borderRadius: '0.375rem',
                            padding: '0.125rem 0.375rem',
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.025em',
                            boxShadow: '0 1px 3px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          Nuevo
                        </motion.div>
                      )}

                      {item.isPro && (
                        <motion.div
                          initial={{ scale: 0, rotate: 10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          style={{
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                            color: 'white',
                            borderRadius: '0.375rem',
                            padding: '0.125rem 0.375rem',
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.025em',
                            boxShadow: '0 1px 3px rgba(139, 92, 246, 0.3)'
                          }}
                        >
                          Pro
                        </motion.div>
                      )}

                      {item.badge && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          style={{
                            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </motion.div>
                      )}
                    </div>

                    {/* Tooltip mejorado para modo colapsado */}
                    {isCollapsed && level === 0 && isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.9 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={{
                          position: 'absolute',
                          left: '100%',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          marginLeft: '0.75rem',
                          background: 'rgba(0, 0, 0, 0.92)',
                          backdropFilter: 'blur(12px)',
                          color: 'white',
                          padding: '0.875rem 1rem',
                          borderRadius: '0.75rem',
                          fontSize: '0.8125rem',
                          whiteSpace: 'nowrap',
                          zIndex: 1000,
                          pointerEvents: 'none',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          maxWidth: '280px'
                        }}
                      >
                        <div style={{ 
                          fontWeight: 600, 
                          marginBottom: '0.25rem',
                          color: '#FFFFFF'
                        }}>
                          {item.label}
                        </div>
                        {item.description && (
                          <div style={{ 
                            fontSize: '0.75rem', 
                            opacity: 0.85,
                            lineHeight: 1.4,
                            color: '#E5E7EB'
                          }}>
                            {item.description}
                          </div>
                        )}
                        <div style={{
                          position: 'absolute',
                          left: '-6px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 0,
                          height: 0,
                          borderTop: '6px solid transparent',
                          borderBottom: '6px solid transparent',
                          borderRight: '6px solid rgba(0, 0, 0, 0.92)'
                        }} />
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </Link>
          )}
        </motion.div>

        {/* Submenús mejorados */}
        <AnimatePresence>
          {hasChildren && isExpanded && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{ 
                overflow: 'hidden',
                marginTop: '0.25rem',
                marginBottom: '0.375rem'
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.4) 0%, rgba(243, 244, 246, 0.3) 100%)',
                borderRadius: '0.75rem',
                margin: '0 0.625rem',
                padding: '0.375rem 0',
                border: '1px solid rgba(229, 231, 235, 0.2)',
                backdropFilter: 'blur(8px)'
              }}>
                {item.children?.map(child => renderNavigationItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const sidebarWidth = isCollapsed ? '72px' : '300px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Sidebar completamente mejorado */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ 
          x: isSidebarOpen ? 0 : -300,
          width: sidebarWidth
        }}
        transition={{ 
          duration: 0.35, 
          ease: [0.4, 0, 0.2, 1]
        }}
        style={{
          width: sidebarWidth,
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
          backdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(229, 231, 235, 0.4)',
          position: 'fixed',
          height: '100vh',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '8px 0 32px rgba(0, 0, 0, 0.04), 4px 0 16px rgba(0, 0, 0, 0.02)'
        }}
      >
        {/* Header del sidebar completamente rediseñado */}
        <div style={{
          padding: isCollapsed ? '1.25rem 0.875rem' : '1.25rem 1rem',
          borderBottom: '1px solid rgba(229, 231, 235, 0.4)',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(59, 130, 246, 0.02) 100%)',
          position: 'relative'
        }}>
          {/* Efecto de brillo sutil en el header */}
          <motion.div
            animate={{ 
              x: [-100, 300],
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatDelay: 8
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
              transform: 'skewX(-20deg)',
              pointerEvents: 'none'
            }}
          />
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isCollapsed ? '0' : '0.75rem',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            position: 'relative',
            zIndex: 1
          }}>
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Stethoscope size={18} color="white" />
            </motion.div>
            
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif',
                  letterSpacing: '-0.02em'
                }}>
                  Centro Psicológico
                </h2>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.375rem',
                  marginTop: '0.125rem'
                }}>
                  <p style={{
                    fontSize: '0.6875rem',
                    color: '#6B7280',
                    margin: 0,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500
                  }}>
                    Panel Profesional
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    {getConnectionIcon()}
                    <span style={{
                      fontSize: '0.625rem',
                      color: getConnectionColor(),
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      {connectionStatus === 'online' ? 'En línea' : 
                       connectionStatus === 'syncing' ? 'Sincronizando' : 'Sin conexión'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Barra de búsqueda mejorada */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ padding: '0.875rem 1rem' }}
          >
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search 
                size={14} 
                color="#9CA3AF" 
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  zIndex: 1
                }}
              />
              <input
                type="text"
                placeholder="Buscar funciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem 0.625rem 2.25rem',
                  borderRadius: '0.625rem',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  background: 'rgba(249, 250, 251, 0.7)',
                  fontSize: '0.8125rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif',
                  backdropFilter: 'blur(8px)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.08)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(229, 231, 235, 0.5)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(249, 250, 251, 0.7)';
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Navegación con scroll ultra mejorado */}
        <nav style={{ 
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '0.25rem 0 1rem 0',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(156, 163, 175, 0.2) transparent'
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, staggerChildren: 0.03 }}
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, ease: "easeOut" }}
              >
                {renderNavigationItem(item)}
              </motion.div>
            ))}
          </motion.div>

          {/* Mensaje cuando no hay resultados de búsqueda mejorado */}
          {searchQuery && filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                color: '#9CA3AF'
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Search size={28} color="#D1D5DB" style={{ marginBottom: '0.75rem' }} />
              </motion.div>
              <p style={{ 
                fontSize: '0.8125rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                margin: 0
              }}>
                No se encontraron resultados
              </p>
              <p style={{ 
                fontSize: '0.6875rem',
                fontFamily: 'Inter, sans-serif',
                color: '#D1D5DB',
                margin: '0.25rem 0 0 0'
              }}>
                Intenta con otros términos
              </p>
            </motion.div>
          )}
        </nav>

        {/* Footer del sidebar completamente rediseñado */}
        <div style={{
          padding: isCollapsed ? '0.875rem' : '1rem',
          borderTop: '1px solid rgba(229, 231, 235, 0.4)',
          background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.6) 0%, rgba(243, 244, 246, 0.4) 100%)',
          backdropFilter: 'blur(12px)'
        }}>
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                padding: '0.875rem',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.04) 0%, rgba(37, 99, 235, 0.03) 100%)',
                borderRadius: '0.875rem',
                border: '1px solid rgba(139, 92, 246, 0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Efecto de partículas sutiles */}
              <motion.div
                animate={{ 
                  x: [-50, 250],
                  opacity: [0, 0.4, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
                  transform: 'skewX(-15deg)'
                }}
              />
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.625rem', 
                marginBottom: '0.625rem',
                position: 'relative',
                zIndex: 1
              }}>
                <motion.div
                  animate={{ 
                    scale: [1, 1.08, 1],
                    rotate: [0, 3, -3, 0]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 4
                  }}
                  style={{
                    padding: '0.375rem',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(37, 99, 235, 0.08) 100%)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(139, 92, 246, 0.1)'
                  }}
                >
                  <Brain size={16} color="#8B5CF6" />
                </motion.div>
                <div>
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#8B5CF6',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    IA Profesional
                  </span>
                  <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.125rem' }}
                  >
                    <Sparkles size={12} color="#8B5CF6" />
                    <span style={{
                      fontSize: '0.6875rem',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Activa 24/7
                    </span>
                  </motion.div>
                </div>
              </div>
              <p style={{
                fontSize: '0.6875rem',
                color: '#6B7280',
                margin: 0,
                lineHeight: 1.4,
                fontFamily: 'Inter, sans-serif',
                position: 'relative',
                zIndex: 1
              }}>
                Asistente inteligente optimizando tu centro psicológico
              </p>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '0.625rem',
                borderRadius: '0.625rem',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(37, 99, 235, 0.06) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.1)',
                cursor: 'pointer'
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Brain size={18} color="#8B5CF6" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Contenido principal */}
      <div style={{
        flex: 1,
        marginLeft: isSidebarOpen ? sidebarWidth : '0',
        transition: 'margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Topbar completamente integrado y mejorado con logout */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(229, 231, 235, 0.4)',
            padding: '0.875rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            {/* Toggle button para sidebar mejorado */}
            <motion.button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.625rem',
                backgroundColor: 'rgba(249, 250, 251, 0.9)',
                borderRadius: '0.625rem',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(8px)'
              }}
            >
              {isSidebarOpen ? <X size={16} color="#6B7280" /> : <Menu size={16} color="#6B7280" />}
            </motion.button>

            {/* Toggle collapse button mejorado */}
            {isSidebarOpen && (
              <motion.button
                onClick={() => setIsCollapsed(!isCollapsed)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.625rem',
                  backgroundColor: 'rgba(249, 250, 251, 0.9)',
                  borderRadius: '0.625rem',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(8px)'
                }}
                title={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
              >
                {isCollapsed ? <Maximize2 size={16} color="#6B7280" /> : <Minimize2 size={16} color="#6B7280" />}
              </motion.button>
            )}

            {/* Información de fecha y hora mejorada */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.625rem 0.875rem',
                background: 'rgba(249, 250, 251, 0.7)',
                backdropFilter: 'blur(12px)',
                borderRadius: '0.625rem',
                border: '1px solid rgba(229, 231, 235, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Clock size={14} color="#6B7280" />
                <span style={{
                  fontSize: '0.8125rem',
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  letterSpacing: '-0.01em'
                }}>
                  {format(currentTime, 'HH:mm:ss', { locale: es })}
                </span>
              </div>
              <div style={{
                width: '1px',
                height: '14px',
                backgroundColor: 'rgba(229, 231, 235, 0.5)'
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Calendar size={14} color="#6B7280" />
                <span style={{
                  fontSize: '0.8125rem',
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  letterSpacing: '-0.01em'
                }}>
                  {format(currentTime, 'EEEE, d MMMM', { locale: es })}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Controles de usuario mejorados con logout directo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            {/* Notificaciones mejoradas */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'relative',
                padding: '0.625rem',
                backgroundColor: 'rgba(249, 250, 251, 0.9)',
                borderRadius: '0.625rem',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease'
              }}
            >
              <Bell size={16} color="#6B7280" />
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  top: '3px',
                  right: '3px',
                  width: '8px',
                  height: '8px',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 1px 3px rgba(239, 68, 68, 0.3)'
                }}
              />
            </motion.button>

            {/* Botón de logout directo */}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoggingOut}
              style={{
                padding: '0.625rem',
                backgroundColor: isLoggingOut ? 'rgba(239, 68, 68, 0.1)' : 'rgba(249, 250, 251, 0.9)',
                borderRadius: '0.625rem',
                border: `1px solid ${isLoggingOut ? 'rgba(239, 68, 68, 0.3)' : 'rgba(229, 231, 235, 0.5)'}`,
                cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
                opacity: isLoggingOut ? 0.7 : 1
              }}
              title="Cerrar sesión"
            >
              {isLoggingOut ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(239, 68, 68, 0.3)',
                    borderTop: '2px solid #EF4444',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                <Power size={16} color="#EF4444" />
              )}
            </motion.button>

            {/* Avatar de usuario con menú completamente mejorado */}
            <div style={{ position: 'relative' }}>
              <motion.button
                onClick={() => !isLoggingOut && setIsUserMenuOpen(!isUserMenuOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoggingOut}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.5rem 0.875rem',
                  backgroundColor: 'rgba(249, 250, 251, 0.9)',
                  borderRadius: '0.625rem',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(8px)',
                  opacity: isLoggingOut ? 0.7 : 1
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <User size={14} color="white" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em'
                  }}>
                    {user?.name || 'Dr. Mendoza'}
                  </span>
                  <span style={{
                    fontSize: '0.6875rem',
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500
                  }}>
                    {user?.role && user.role.toString() === 'admin' ? 'CEO' : 'Terapeuta'}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <ChevronDown size={14} color="#9CA3AF" />
                </motion.div>
              </motion.button>

              {/* Menú de usuario completamente rediseñado */}
              <AnimatePresence>
                {isUserMenuOpen && !isLoggingOut && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.98)',
                      backdropFilter: 'blur(24px)',
                      border: '1px solid rgba(229, 231, 235, 0.4)',
                      borderRadius: '0.875rem',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      zIndex: 50,
                      overflow: 'hidden',
                      minWidth: '240px'
                    }}
                  >
                    <div style={{
                      padding: '1rem',
                      borderBottom: '1px solid rgba(229, 231, 235, 0.2)',
                      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.02) 0%, rgba(59, 130, 246, 0.01) 100%)'
                    }}>
                      <div style={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#1F2937',
                        fontFamily: 'Inter, sans-serif',
                        marginBottom: '0.125rem'
                      }}>
                        {user?.name || 'Dr. Mendoza'}
                      </div>
                      <div style={{
                        fontSize: '0.6875rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {user?.email || 'admin@centro.com'}
                      </div>
                      <div style={{
                        fontSize: '0.6875rem',
                        color: '#8B5CF6',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        marginTop: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <Shield size={12} />
                        {user?.role?.toString() === 'admin' ? 'Administrador CEO' : 'Terapeuta Profesional'}
                      </div>
                    </div>
                    
                    {/* Configuración */}
                    <motion.button
                      whileHover={{ 
                        backgroundColor: 'rgba(37, 99, 235, 0.04)',
                        x: 2
                      }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.75rem 1rem',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.8125rem',
                        color: '#374151',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Settings size={14} />
                      Configuración
                    </motion.button>

                    <div style={{
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(229, 231, 235, 0.5), transparent)',
                      margin: '0.25rem 1rem'
                    }} />
                    
                    {/* Cerrar sesión */}
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ 
                        backgroundColor: 'rgba(239, 68, 68, 0.04)',
                        x: 2
                      }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.75rem 1rem',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.8125rem',
                        color: '#EF4444',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <LogOut size={14} />
                      Cerrar sesión
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>

        {/* Contenido de la página */}
        <main style={{ 
          flex: 1,
          background: 'transparent'
        }}>
          {children}
        </main>
      </div>

      {/* Overlay para móvil mejorado */}
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
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(4px)',
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

      {/* Indicador de logout global */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                maxWidth: '320px',
                margin: '1rem'
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #E5E7EB',
                  borderTop: '4px solid #EF4444',
                  borderRadius: '50%',
                  margin: '0 auto 1rem'
                }}
              />
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#1F2937',
                margin: '0 0 0.5rem 0',
                fontFamily: 'Inter, sans-serif'
              }}>
                Cerrando Sesión
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Guardando datos y cerrando sesión de forma segura...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estilos CSS mejorados */}
      <style jsx>{`
        /* Scrollbar ultra profesional */
        nav::-webkit-scrollbar {
          width: 4px;
        }
        
        nav::-webkit-scrollbar-track {
          background: transparent;
        }
        
        nav::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.2);
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        
        nav::-webkit-scrollbar-thumb:hover {
          background: rgba(37, 99, 235, 0.3);
        }

        /* Animaciones profesionales */
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(37, 99, 235, 0.3);
          }
          50% { 
            box-shadow: 0 0 20px rgba(37, 99, 235, 0.5);
          }
        }

        /* Responsive profesional */
        @media (max-width: 1024px) {
          .sidebar-overlay {
            display: block !important;
          }
        }

        @media (max-width: 768px) {
          nav {
            padding: 0.25rem 0 0.75rem 0;
          }
        }

        /* Estados de focus mejorados */
        button:focus-visible {
          outline: 2px solid rgba(37, 99, 235, 0.5);
          outline-offset: 2px;
        }

        input:focus-visible {
          outline: none;
        }

        /* Efectos de glassmorphism */
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Transiciones suaves globales */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Efectos de hover para botones */
        button:hover {
          transform: translateY(-1px);
        }

        button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
