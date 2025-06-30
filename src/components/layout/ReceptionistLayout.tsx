'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Calendar,
  Users,
  Phone,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  UserCheck,
  CalendarCheck,
  MessageSquare,
  ChevronRight,
  Shield
} from 'lucide-react';

interface ReceptionistLayoutProps {
  children: React.ReactNode;
}

export default function ReceptionistLayout({ children }: ReceptionistLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const navigationItems = [
    {
      name: 'Inicio',
      href: '/dashboard/reception',
      icon: Home,
      description: 'Panel principal',
      color: '#3B82F6',
      bgColor: '#EFF6FF'
    },
    {
      name: 'Pacientes',
      href: '/dashboard/reception/patients',
      icon: Users,
      description: 'Gestión de pacientes',
      color: '#10B981',
      bgColor: '#ECFDF5'
    },
    {
      name: 'Citas',
      href: '/dashboard/reception/appointments',
      icon: Calendar,
      description: 'Programar citas',
      color: '#F59E0B',
      bgColor: '#FFFBEB'
    },
    {
      name: 'Calendario',
      href: '/dashboard/reception/calendar',
      icon: CalendarCheck,
      description: 'Vista de calendario',
      color: '#8B5CF6',
      bgColor: '#F3E8FF'
    },
    {
      name: 'Check-in',
      href: '/dashboard/reception/checkin',
      icon: UserCheck,
      description: 'Registro de llegadas',
      color: '#06B6D4',
      bgColor: '#ECFEFF'
    },
    {
      name: 'Comunicaciones',
      href: '/dashboard/reception/communications',
      icon: MessageSquare,
      description: 'Mensajes y avisos',
      color: '#EF4444',
      bgColor: '#FEF2F2'
    },
    {
      name: 'Documentos',
      href: '/dashboard/reception/documents',
      icon: FileText,
      description: 'Formularios y docs',
      color: '#84CC16',
      bgColor: '#F0FDF4'
    }
  ];

  const handleLogout = async () => {
    try {
      console.log('🔄 Iniciando logout desde ReceptionistLayout...');
      await logout();
    } catch (error) {
      console.error('❌ Error durante logout:', error);
      // Fallback: redirigir directamente al login
      window.location.href = '/login';
    }
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 40
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isDesktop ? 0 : (sidebarOpen ? 0 : '-100%')
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          position: isDesktop ? 'static' : 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          backgroundColor: 'white',
          borderRight: '1px solid #E2E8F0',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isDesktop ? 'none' : '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '2rem 1.5rem 1.5rem 1.5rem',
          borderBottom: '1px solid #F1F5F9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '0.5rem',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Phone size={18} color="white" />
                </div>
                <h1 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Recepción
                </h1>
              </div>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748B',
                margin: 0,
                fontWeight: 500
              }}>
                Panel de Recepcionista
              </p>
            </div>
            
            {!isDesktop && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(false)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#F1F5F9',
                  cursor: 'pointer',
                  color: '#64748B'
                }}
              >
                <X size={18} />
              </motion.button>
            )}
          </div>
        </div>

        {/* User Info */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #F1F5F9'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: '#F8FAFC',
            borderRadius: '0.75rem',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <User size={24} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1E293B',
                margin: 0,
                lineHeight: 1.2
              }}>
                {user?.firstName} {user?.lastName}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981'
                }} />
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748B',
                  margin: 0,
                  fontWeight: 500
                }}>
                  {user?.receptionistInfo?.department || 'Recepcionista'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ 
          flex: 1, 
          padding: '1rem 0',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '0 1rem' }}>
            <p style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 0.75rem 0.75rem'
            }}>
              Navegación Principal
            </p>
          </div>

          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <div key={item.name} style={{ padding: '0 1rem', marginBottom: '0.25rem' }}>
                <motion.button
                  onClick={() => handleNavigation(item.href)}
                  whileHover={{ 
                    backgroundColor: isActive ? undefined : '#F8FAFC',
                    x: isActive ? 0 : 4
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    border: 'none',
                    backgroundColor: isActive ? item.bgColor : 'transparent',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicatorReception"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        backgroundColor: item.color,
                        borderRadius: '0 2px 2px 0'
                      }}
                    />
                  )}

                  <div style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    backgroundColor: isActive ? item.color : '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}>
                    <Icon size={18} color={isActive ? 'white' : item.color} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: isActive ? item.color : '#374151',
                      fontWeight: isActive ? 600 : 500,
                      marginBottom: '0.125rem'
                    }}>
                      {item.name}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: isActive ? item.color : '#94A3B8',
                      opacity: isActive ? 0.8 : 1
                    }}>
                      {item.description}
                    </div>
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{
                        padding: '0.25rem',
                        borderRadius: '0.25rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <ChevronRight size={14} color={item.color} />
                    </motion.div>
                  )}
                </motion.button>
              </div>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #F1F5F9',
          backgroundColor: '#FAFBFC'
        }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <motion.button
              onClick={() => handleNavigation('/dashboard/reception/settings')}
              whileHover={{ backgroundColor: '#F1F5F9', x: 2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#64748B',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                padding: '0.375rem',
                borderRadius: '0.375rem',
                backgroundColor: '#F1F5F9'
              }}>
                <Settings size={16} color="#64748B" />
              </div>
              Configuración
            </motion.button>
          </div>
          
          <motion.button
            onClick={handleLogout}
            whileHover={{ backgroundColor: '#FEF2F2', x: 2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#EF4444',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              padding: '0.375rem',
              borderRadius: '0.375rem',
              backgroundColor: '#FEF2F2'
            }}>
              <LogOut size={16} color="#EF4444" />
            </div>
            Cerrar Sesión
          </motion.button>

          {/* User Status */}
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#ECFDF5',
            borderRadius: '0.5rem',
            border: '1px solid #D1FAE5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={14} color="#10B981" />
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#065F46'
              }}>
                Turno: {user?.receptionistInfo?.workShift === 'full-time' ? 'Completo' : 
                        user?.receptionistInfo?.workShift === 'morning' ? 'Mañana' :
                        user?.receptionistInfo?.workShift === 'afternoon' ? 'Tarde' : 'Noche'}
              </span>
            </div>
            <p style={{
              fontSize: '0.75rem',
              color: '#047857',
              margin: '0.25rem 0 0 0'
            }}>
              Sesión activa y segura
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }}>
        {/* Top Bar */}
        <header style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #E2E8F0',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {!isDesktop && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(true)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #E2E8F0',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  color: '#64748B',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              >
                <Menu size={20} />
              </motion.button>
            )}
            
            <div>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#1E293B',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Bienvenida, {user?.firstName} 👋
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748B',
                margin: '0.25rem 0 0 0',
                fontWeight: 500
              }}>
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#ECFDF5',
              borderRadius: '2rem',
              border: '1px solid #D1FAE5'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981'
              }} />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#065F46'
              }}>
                En línea
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#F8FAFC',
              borderRadius: '2rem',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={16} color="white" />
              </div>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151'
              }}>
                {user?.firstName}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: '2rem',
          overflow: 'auto',
          backgroundColor: '#F8FAFC'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
