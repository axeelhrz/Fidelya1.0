'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Users,
  FileText,
  Heart,
  Clock,
  BookOpen,
  Settings,
  User,
  Bell,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  LogOut,
  Power,
  Stethoscope,
  Activity,
  MessageSquare,
  Video,
  BarChart3,
  Target,
  Phone
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TherapistLayoutProps {
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

export default function TherapistLayout({ children }: TherapistLayoutProps) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
      label: 'Panel Principal',
      icon: Activity,
      href: '/dashboard/therapist',
      description: 'Vista general de tu práctica'
    },
    {
      id: 'patients',
      label: 'Mis Pacientes',
      icon: Users,
      href: '/dashboard/therapist/patients',
      description: 'Gestionar pacientes asignados',
      badge: 18
    },
    {
      id: 'sessions',
      label: 'Sesiones',
      icon: FileText,
      href: '/dashboard/therapist/sessions',
      description: 'Historial y notas de sesiones',
      children: [
        {
          id: 'sessions-today',
          label: 'Sesiones de Hoy',
          icon: Clock,
          href: '/dashboard/therapist/sessions/today',
          description: 'Agenda del día actual'
        },
        {
          id: 'sessions-history',
          label: 'Historial',
          icon: BookOpen,
          href: '/dashboard/therapist/sessions/history',
          description: 'Sesiones anteriores'
        },
        {
          id: 'sessions-notes',
          label: 'Notas Clínicas',
          icon: FileText,
          href: '/dashboard/therapist/sessions/notes',
          description: 'Gestionar notas'
        }
      ]
    },
    {
      id: 'agenda',
      label: 'Agenda',
      icon: Calendar,
      href: '/dashboard/therapist/agenda',
      description: 'Calendario y citas',
      children: [
        {
          id: 'calendar',
          label: 'Calendario',
          icon: Calendar,
          href: '/dashboard/therapist/agenda',
          description: 'Vista de calendario'
        },
        {
          id: 'appointments',
          label: 'Citas',
          icon: Clock,
          href: '/dashboard/therapist/agenda/appointments',
          description: 'Gestionar citas'
        }
      ]
    },
    {
      id: 'communication',
      label: 'Comunicación',
      icon: MessageSquare,
      href: '/dashboard/therapist/communication',
      description: 'Mensajes y videollamadas',
      children: [
        {
          id: 'messages',
          label: 'Mensajes',
          icon: MessageSquare,
          href: '/dashboard/therapist/communication/messages',
          description: 'Chat con pacientes',
          badge: 3
        },
        {
          id: 'video-calls',
          label: 'Videollamadas',
          icon: Video,
          href: '/dashboard/therapist/communication/video',
          description: 'Sesiones virtuales'
        },
        {
          id: 'phone-calls',
          label: 'Llamadas',
          icon: Phone,
          href: '/dashboard/therapist/communication/calls',
          description: 'Registro de llamadas'
        }
      ]
    },
    {
      id: 'analytics',
      label: 'Análisis',
      icon: BarChart3,
      href: '/dashboard/therapist/analytics',
      description: 'Estadísticas de tu práctica'
    },
    {
      id: 'profile',
      label: 'Mi Perfil',
      icon: User,
      href: '/dashboard/therapist/profile',
      description: 'Configuración personal'
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

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      setIsUserMenuOpen(false);
      
      const confirmLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
      
      if (!confirmLogout) {
        setIsLoggingOut(false);
        return;
      }
      
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión. Redirigiendo...');
      window.location.href = '/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href);

    return (
      <div key={item.id} style={{ marginBottom: '0.25rem' }}>
        <motion.div
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
                  ? 'rgba(16, 185, 129, 0.08)' 
                  : 'transparent',
                border: active 
                  ? '1px solid rgba(16, 185, 129, 0.15)' 
                  : '1px solid transparent',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: active ? 'blur(8px)' : 'none',
                boxShadow: active 
                  ? '0 2px 8px rgba(16, 185, 129, 0.12)' 
                  : 'none',
                justifyContent: isCollapsed && level === 0 ? 'center' : 'flex-start'
              }}
            >
              {active && (
                <motion.div
                  layoutId="activeIndicatorTherapist"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '70%',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    borderRadius: '0 2px 2px 0',
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)'
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
                    ? 'rgba(16, 185, 129, 0.12)' 
                    : 'rgba(107, 114, 128, 0.05)',
                  marginRight: isCollapsed && level === 0 ? '0' : '0.75rem',
                  transition: 'all 0.25s ease',
                  border: active ? '1px solid rgba(16, 185, 129, 0.1)' : '1px solid transparent'
                }}>
                  <item.icon 
                    size={16} 
                    color={active ? '#10B981' : '#6B7280'} 
                  />
                </div>

                {(!isCollapsed || level > 0) && (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.8125rem',
                        fontWeight: active ? 600 : 500,
                        color: active ? '#10B981' : '#374151',
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
                  ? 'rgba(16, 185, 129, 0.08)' 
                  : 'transparent',
                border: active 
                  ? '1px solid rgba(16, 185, 129, 0.15)' 
                  : '1px solid transparent',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: active ? 'blur(8px)' : 'none',
                boxShadow: active 
                  ? '0 2px 8px rgba(16, 185, 129, 0.12)' 
                  : 'none',
                position: 'relative',
                justifyContent: isCollapsed && level === 0 ? 'center' : 'flex-start'
              }}>
                {active && (
                  <motion.div
                    layoutId="activeIndicatorTherapist"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '3px',
                      height: '70%',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      borderRadius: '0 2px 2px 0',
                      boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)'
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <div style={{
                  padding: '0.5rem',
                  borderRadius: '0.625rem',
                  backgroundColor: active 
                    ? 'rgba(16, 185, 129, 0.12)' 
                    : 'rgba(107, 114, 128, 0.05)',
                  marginRight: isCollapsed && level === 0 ? '0' : '0.75rem',
                  transition: 'all 0.25s ease',
                  border: active ? '1px solid rgba(16, 185, 129, 0.1)' : '1px solid transparent'
                }}>
                  <item.icon 
                    size={16} 
                    color={active ? '#10B981' : '#6B7280'} 
                  />
                </div>

                {(!isCollapsed || level > 0) && (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.8125rem',
                        fontWeight: active ? 600 : 500,
                        color: active ? '#10B981' : '#374151',
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
                  </>
                )}
              </div>
            </Link>
          )}
        </motion.div>

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
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(16, 185, 129, 0.02) 100%)',
                borderRadius: '0.75rem',
                margin: '0 0.625rem',
                padding: '0.375rem 0',
                border: '1px solid rgba(16, 185, 129, 0.1)',
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

  const sidebarWidth = isCollapsed ? '72px' : '280px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Sidebar para terapeutas */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ 
          x: isSidebarOpen ? 0 : -280,
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
          boxShadow: '8px 0 32px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Header del sidebar */}
        <div style={{
          padding: isCollapsed ? '1.25rem 0.875rem' : '1.25rem 1rem',
          borderBottom: '1px solid rgba(229, 231, 235, 0.4)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(16, 185, 129, 0.02) 100%)',
          position: 'relative'
        }}>
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
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
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
                  Panel Terapeuta
                </h2>
                <p style={{
                  fontSize: '0.6875rem',
                  color: '#6B7280',
                  margin: '0.125rem 0 0 0',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500
                }}>
                  Gestión Profesional
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navegación */}
        <nav style={{ 
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '0.5rem 0 1rem 0',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(156, 163, 175, 0.2) transparent'
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, staggerChildren: 0.03 }}
          >
            {navigationItems.map((item, index) => (
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
        </nav>

        {/* Footer del sidebar */}
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
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(16, 185, 129, 0.03) 100%)',
                borderRadius: '0.875rem',
                border: '1px solid rgba(16, 185, 129, 0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
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
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.08) 100%)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(16, 185, 129, 0.1)'
                  }}
                >
                  <Heart size={16} color="#10B981" />
                </motion.div>
                <div>
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#10B981',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Cuidado Profesional
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.125rem' }}>
                    <Target size={12} color="#10B981" />
                    <span style={{
                      fontSize: '0.6875rem',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Excelencia en terapia
                    </span>
                  </div>
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
                Herramientas profesionales para el cuidado de tus pacientes
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
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.06) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.1)',
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
                <Heart size={18} color="#10B981" />
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
        {/* Topbar para terapeutas */}
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
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
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

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '0.625rem 0.875rem',
              background: 'rgba(249, 250, 251, 0.7)',
              backdropFilter: 'blur(12px)',
              borderRadius: '0.625rem',
              border: '1px solid rgba(229, 231, 235, 0.3)'
            }}>
              <Clock size={14} color="#6B7280" />
              <span style={{
                fontSize: '0.8125rem',
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500
              }}>
                {format(currentTime, 'HH:mm:ss', { locale: es })}
              </span>
              <div style={{
                width: '1px',
                height: '14px',
                backgroundColor: 'rgba(229, 231, 235, 0.5)'
              }} />
              <Calendar size={14} color="#6B7280" />
              <span style={{
                fontSize: '0.8125rem',
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500
              }}>
                {format(currentTime, 'EEEE, d MMMM', { locale: es })}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
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
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 1px 3px rgba(16, 185, 129, 0.3)'
                }}
              />
            </motion.button>

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
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <User size={14} color="white" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {user?.firstName || 'Dra. Ana'}
                  </span>
                  <span style={{
                    fontSize: '0.6875rem',
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Terapeuta
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <ChevronDown size={14} color="#9CA3AF" />
                </motion.div>
              </motion.button>

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
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)',
                      zIndex: 50,
                      overflow: 'hidden',
                      minWidth: '240px'
                    }}
                  >
                    <div style={{
                      padding: '1rem',
                      borderBottom: '1px solid rgba(229, 231, 235, 0.2)',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.02) 0%, rgba(16, 185, 129, 0.01) 100%)'
                    }}>
                      <div style={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#1F2937',
                        fontFamily: 'Inter, sans-serif',
                        marginBottom: '0.125rem'
                      }}>
                        {user?.name || 'Dra. Ana García'}
                      </div>
                      <div style={{
                        fontSize: '0.6875rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {user?.email || 'therapist@centro.com'}
                      </div>
                      <div style={{
                        fontSize: '0.6875rem',
                        color: '#10B981',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        marginTop: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <Stethoscope size={12} />
                        Terapeuta Profesional
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ 
                        backgroundColor: 'rgba(16, 185, 129, 0.04)',
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
                      Mi Perfil
                    </motion.button>

                    <div style={{
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(229, 231, 235, 0.5), transparent)',
                      margin: '0.25rem 1rem'
                    }} />
                    
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

        <main style={{ 
          flex: 1,
          background: 'transparent'
        }}>
          {children}
        </main>
      </div>

      {/* Overlays */}
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

      <style jsx>{`
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
          background: rgba(16, 185, 129, 0.3);
        }

        @media (max-width: 1024px) {
          .sidebar-overlay {
            display: block !important;
          }
        }

        button:focus-visible {
          outline: 2px solid rgba(16, 185, 129, 0.5);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
