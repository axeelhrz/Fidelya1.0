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
  Settings,
  Brain,
  DollarSign,
  Heart,
  Target,
  MessageSquare,
  Shield,
  Database,
  Zap,
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
  const pathname = usePathname();

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
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
          description: 'Insights inteligentes'
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
      badge: 5,
      description: 'Notificaciones importantes'
    },
    {
      id: 'metrics',
      label: 'Métricas Clínicas',
      icon: TrendingUp,
      href: '/dashboard/metrics',
      description: 'KPIs y análisis'
    },
    {
      id: 'integrations',
      label: 'Integraciones',
      icon: Zap,
      href: '/dashboard/integrations',
      description: 'Conectar servicios',
      children: [
        {
          id: 'whatsapp',
          label: 'WhatsApp',
          icon: MessageSquare,
          href: '/dashboard/integrations/whatsapp',
          description: 'Mensajería automática'
        },
        {
          id: 'sheets',
          label: 'Google Sheets',
          icon: Database,
          href: '/dashboard/integrations/sheets',
          description: 'Sincronización de datos'
        }
      ]
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings,
      href: '/dashboard/settings',
      description: 'Ajustes del sistema',
      children: [
        {
          id: 'general',
          label: 'General',
          icon: Settings,
          href: '/dashboard/settings',
          description: 'Configuración básica'
        },
        {
          id: 'users',
          label: 'Usuarios y Roles',
          icon: Shield,
          href: '/dashboard/settings/users',
          description: 'Gestión de accesos'
        },
        {
          id: 'compliance',
          label: 'Cumplimiento',
          icon: Shield,
          href: '/dashboard/settings/compliance',
          description: 'Normativas y políticas'
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

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href);
    const isHovered = hoveredItem === item.id;

    return (
      <div key={item.id} style={{ marginBottom: '0.25rem' }}>
        <motion.div
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          whileHover={{ x: level === 0 ? 4 : 2 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'relative',
            borderRadius: '1rem',
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
                  ? '1rem 0.75rem' 
                  : level === 0 
                    ? '1rem 1.25rem' 
                    : '0.75rem 1.25rem 0.75rem 2.5rem',
                cursor: 'pointer',
                borderRadius: '1rem',
                margin: isCollapsed && level === 0 ? '0 0.5rem' : '0 0.75rem',
                backgroundColor: active 
                  ? 'rgba(37, 99, 235, 0.1)' 
                  : isHovered 
                    ? 'rgba(249, 250, 251, 0.8)' 
                    : 'transparent',
                border: active ? '1px solid rgba(37, 99, 235, 0.2)' : '1px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: active || isHovered ? 'blur(8px)' : 'none',
                boxShadow: active 
                  ? '0 4px 12px rgba(37, 99, 235, 0.15)' 
                  : isHovered 
                    ? '0 2px 8px rgba(0, 0, 0, 0.05)' 
                    : 'none',
                justifyContent: isCollapsed && level === 0 ? 'center' : 'flex-start'
              }}
            >
              {/* Indicador activo */}
              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '60%',
                    backgroundColor: '#2563EB',
                    borderRadius: '0 4px 4px 0'
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                  borderRadius: '0.75rem',
                  backgroundColor: active 
                    ? 'rgba(37, 99, 235, 0.15)' 
                    : 'rgba(107, 114, 128, 0.1)',
                  marginRight: isCollapsed && level === 0 ? '0' : '0.75rem',
                  transition: 'all 0.3s ease'
                }}>
                  <item.icon 
                    size={18} 
                    color={active ? '#2563EB' : '#6B7280'} 
                  />
                </div>

                {(!isCollapsed || level > 0) && (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: active ? 600 : 500,
                        color: active ? '#2563EB' : '#374151',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: 1.2
                      }}>
                        {item.label}
                      </div>
                      {item.description && level === 0 && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#9CA3AF',
                          marginTop: '0.125rem',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {item.description}
                        </div>
                      )}
                    </div>

                    {item.badge && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          backgroundColor: '#EF4444',
                          color: 'white',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          marginRight: '0.5rem',
                          boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                        }}
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </motion.div>
                    )}

                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={16} color="#9CA3AF" />
                    </motion.div>
                  </>
                )}

                {/* Tooltip para modo colapsado */}
                {isCollapsed && level === 0 && isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    style={{
                      position: 'absolute',
                      left: '100%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      marginLeft: '0.5rem',
                      background: 'rgba(0, 0, 0, 0.9)',
                      color: 'white',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap',
                      zIndex: 1000,
                      pointerEvents: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                      {item.label}
                    </div>
                    {item.description && (
                      <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                        {item.description}
                      </div>
                    )}
                    <div style={{
                      position: 'absolute',
                      left: '-4px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 0,
                      height: 0,
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
                      borderRight: '4px solid rgba(0, 0, 0, 0.9)'
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
                  ? '1rem 0.75rem' 
                  : level === 0 
                    ? '1rem 1.25rem' 
                    : '0.75rem 1.25rem 0.75rem 2.5rem',
                borderRadius: '1rem',
                margin: isCollapsed && level === 0 ? '0 0.5rem' : '0 0.75rem',
                backgroundColor: active 
                  ? 'rgba(37, 99, 235, 0.1)' 
                  : isHovered 
                    ? 'rgba(249, 250, 251, 0.8)' 
                    : 'transparent',
                border: active ? '1px solid rgba(37, 99, 235, 0.2)' : '1px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: active || isHovered ? 'blur(8px)' : 'none',
                boxShadow: active 
                  ? '0 4px 12px rgba(37, 99, 235, 0.15)' 
                  : isHovered 
                    ? '0 2px 8px rgba(0, 0, 0, 0.05)' 
                    : 'none',
                position: 'relative',
                justifyContent: isCollapsed && level === 0 ? 'center' : 'flex-start'
              }}>
                {/* Indicador activo */}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '60%',
                      backgroundColor: '#2563EB',
                      borderRadius: '0 4px 4px 0'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <div style={{
                  padding: '0.5rem',
                  borderRadius: '0.75rem',
                  backgroundColor: active 
                    ? 'rgba(37, 99, 235, 0.15)' 
                    : 'rgba(107, 114, 128, 0.1)',
                  marginRight: isCollapsed && level === 0 ? '0' : '0.75rem',
                  transition: 'all 0.3s ease'
                }}>
                  <item.icon 
                    size={18} 
                    color={active ? '#2563EB' : '#6B7280'} 
                  />
                </div>

                {(!isCollapsed || level > 0) && (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: active ? 600 : 500,
                        color: active ? '#2563EB' : '#374151',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: 1.2
                      }}>
                        {item.label}
                      </div>
                      {item.description && level === 0 && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#9CA3AF',
                          marginTop: '0.125rem',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {item.description}
                        </div>
                      )}
                    </div>

                    {item.badge && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          backgroundColor: '#EF4444',
                          color: 'white',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                        }}
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </motion.div>
                    )}

                    {/* Tooltip para modo colapsado */}
                    {isCollapsed && level === 0 && isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        style={{
                          position: 'absolute',
                          left: '100%',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          marginLeft: '0.5rem',
                          background: 'rgba(0, 0, 0, 0.9)',
                          color: 'white',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.75rem',
                          fontSize: '0.875rem',
                          whiteSpace: 'nowrap',
                          zIndex: 1000,
                          pointerEvents: 'none',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                          {item.label}
                        </div>
                        {item.description && (
                          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                            {item.description}
                          </div>
                        )}
                        <div style={{
                          position: 'absolute',
                          left: '-4px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 0,
                          height: 0,
                          borderTop: '4px solid transparent',
                          borderBottom: '4px solid transparent',
                          borderRight: '4px solid rgba(0, 0, 0, 0.9)'
                        }} />
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </Link>
          )}
        </motion.div>

        {/* Submenús - solo se muestran si no está colapsado */}
        <AnimatePresence>
          {hasChildren && isExpanded && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{ 
                overflow: 'hidden',
                marginTop: '0.25rem',
                marginBottom: '0.5rem'
              }}
            >
              <div style={{
                background: 'rgba(249, 250, 251, 0.3)',
                borderRadius: '0.75rem',
                margin: '0 0.75rem',
                padding: '0.5rem 0',
                border: '1px solid rgba(229, 231, 235, 0.3)'
              }}>
                {item.children?.map(child => renderNavigationItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const sidebarWidth = isCollapsed ? '80px' : '320px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Sidebar mejorado */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ 
          x: isSidebarOpen ? 0 : -320,
          width: sidebarWidth
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.4, 0, 0.2, 1]
        }}
        style={{
          width: sidebarWidth,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(229, 231, 235, 0.6)',
          position: 'fixed',
          height: '100vh',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* Header del sidebar mejorado */}
        <div style={{
          padding: isCollapsed ? '1.5rem 1rem' : '1.5rem 1.25rem',
          borderBottom: '1px solid rgba(229, 231, 235, 0.6)',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isCollapsed ? '0' : '0.75rem',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}>
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Activity size={20} color="white" />
            </motion.div>
            
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Centro Psicológico
                </h2>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Panel Administrativo
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Barra de búsqueda */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ padding: '1rem 1.25rem' }}
          >
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search 
                size={16} 
                color="#9CA3AF" 
                style={{
                  position: 'absolute',
                  left: '0.75rem',
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
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(229, 231, 235, 0.6)',
                  background: 'rgba(249, 250, 251, 0.8)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(229, 231, 235, 0.6)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Navegación con scroll mejorado */}
        <nav style={{ 
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '0.5rem 0 1rem 0',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(156, 163, 175, 0.3) transparent'
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, staggerChildren: 0.05 }}
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {renderNavigationItem(item)}
              </motion.div>
            ))}
          </motion.div>

          {/* Mensaje cuando no hay resultados de búsqueda */}
          {searchQuery && filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                color: '#9CA3AF'
              }}
            >
              <Search size={32} color="#D1D5DB" style={{ marginBottom: '0.5rem' }} />
              <p style={{ 
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                No se encontraron resultados
              </p>
            </motion.div>
          )}
        </nav>

        {/* Footer del sidebar mejorado */}
        <div style={{
          padding: isCollapsed ? '1rem' : '1.25rem',
          borderTop: '1px solid rgba(229, 231, 235, 0.6)',
          background: 'rgba(249, 250, 251, 0.5)'
        }}>
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)',
                borderRadius: '1rem',
                border: '1px solid rgba(139, 92, 246, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Efecto de brillo animado */}
              <motion.div
                animate={{ 
                  x: [-100, 300],
                  opacity: [0, 0.5, 0]
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
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  transform: 'skewX(-20deg)'
                }}
              />
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                marginBottom: '0.75rem',
                position: 'relative',
                zIndex: 1
              }}>
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
                  <Brain size={20} color="#8B5CF6" />
                </motion.div>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#8B5CF6',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  IA Activa
                </span>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={14} color="#8B5CF6" />
                </motion.div>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                margin: 0,
                lineHeight: 1.4,
                fontFamily: 'Inter, sans-serif',
                position: 'relative',
                zIndex: 1
              }}>
                Asistente inteligente monitoreando tu centro 24/7
              </p>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.1 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)'
              }}
            >
              <Brain size={20} color="#8B5CF6" />
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Contenido principal */}
      <div style={{
        flex: 1,
        marginLeft: isSidebarOpen ? sidebarWidth : '0',
        transition: 'margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Topbar integrado */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(229, 231, 235, 0.6)',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Toggle button para sidebar */}
            <motion.button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(249, 250, 251, 0.8)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(229, 231, 235, 0.6)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              {isSidebarOpen ? <X size={18} color="#6B7280" /> : <Menu size={18} color="#6B7280" />}
            </motion.button>

            {/* Toggle collapse button */}
            {isSidebarOpen && (
              <motion.button
                onClick={() => setIsCollapsed(!isCollapsed)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'rgba(249, 250, 251, 0.8)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(229, 231, 235, 0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                title={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
              >
                {isCollapsed ? <Maximize2 size={18} color="#6B7280" /> : <Minimize2 size={18} color="#6B7280" />}
              </motion.button>
            )}

            {/* Información de fecha y hora */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                background: 'rgba(249, 250, 251, 0.6)',
                backdropFilter: 'blur(8px)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(229, 231, 235, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="#6B7280" />
                <span style={{
                  fontSize: '0.875rem',
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500
                }}>
                  {format(currentTime, 'HH:mm:ss', { locale: es })}
                </span>
              </div>
              <div style={{
                width: '1px',
                height: '16px',
                backgroundColor: 'rgba(229, 231, 235, 0.6)'
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} color="#6B7280" />
                <span style={{
                  fontSize: '0.875rem',
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500
                }}>
                  {format(currentTime, 'EEEE, d MMMM', { locale: es })}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Controles de usuario */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Notificaciones */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'relative',
                padding: '0.75rem',
                backgroundColor: 'rgba(249, 250, 251, 0.8)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(229, 231, 235, 0.6)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={18} color="#6B7280" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#EF4444',
                  borderRadius: '50%'
                }}
              />
            </motion.button>

            {/* Avatar de usuario con menú */}
            <div style={{ position: 'relative' }}>
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                whileHover={{ scale: 1.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'rgba(249, 250, 251, 0.8)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(229, 231, 235, 0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#2563EB',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={16} color="white" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {user?.name || 'Dr. Mendoza'}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {user?.role === 'admin' ? 'CEO' : 'Terapeuta'}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} color="#9CA3AF" />
                </motion.div>
              </motion.button>

              {/* Menú de usuario */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(229, 231, 235, 0.6)',
                      borderRadius: '1rem',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                      zIndex: 50,
                      overflow: 'hidden',
                      minWidth: '200px'
                    }}
                  >
                    <div style={{
                      padding: '1rem',
                      borderBottom: '1px solid rgba(229, 231, 235, 0.3)'
                    }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#1F2937',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {user?.name || 'Dr. Mendoza'}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {user?.email || 'admin@centro.com'}
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        color: '#EF4444',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <LogOut size={16} />
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

      {/* Overlay para móvil */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
        {isUserMenuOpen && (
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

      {/* Estilos CSS adicionales */}
      <style jsx>{`
        /* Scrollbar personalizado */
        nav::-webkit-scrollbar {
          width: 6px;
        }
        
        nav::-webkit-scrollbar-track {
          background: transparent;
        }
        
        nav::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        
        nav::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }

        /* Animaciones adicionales */
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .sidebar-overlay {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}