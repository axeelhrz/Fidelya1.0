'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Calendar,
  FileText,
  Heart,
  Bell,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Clock,
  Download
} from 'lucide-react';

interface PatientLayoutProps {
  children: React.ReactNode;
}

export default function PatientLayout({ children }: PatientLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    {
      name: 'Inicio',
      href: '/dashboard/patient',
      icon: Home,
      description: 'Vista general de mi progreso'
    },
    {
      name: 'Mi Perfil',
      href: '/dashboard/patient/profile',
      icon: User,
      description: 'Información personal y clínica'
    },
    {
      name: 'Mis Citas',
      href: '/dashboard/patient/appointments',
      icon: Calendar,
      description: 'Próximas sesiones e historial'
    },
    {
      name: 'Mi Plan',
      href: '/dashboard/patient/treatment',
      icon: FileText,
      description: 'Plan de tratamiento y tareas'
    },
    {
      name: 'Estado Emocional',
      href: '/dashboard/patient/emotions',
      icon: Heart,
      description: 'Registro diario de emociones'
    },
    {
      name: 'Documentos',
      href: '/dashboard/patient/documents',
      icon: Download,
      description: 'Recibos y documentos médicos'
    },
    {
      name: 'Pagos',
      href: '/dashboard/patient/payments',
      icon: CreditCard,
      description: 'Facturación y pagos'
    },
    {
      name: 'Notificaciones',
      href: '/dashboard/patient/notifications',
      icon: Bell,
      description: 'Alertas y recordatorios'
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
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
          x: sidebarOpen ? 0 : window.innerWidth >= 1024 ? 0 : '-100%'
        }}
        style={{
          position: window.innerWidth >= 1024 ? 'static' : 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          backgroundColor: 'white',
          borderRight: '1px solid #E2E8F0',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: window.innerWidth >= 1024 ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1E293B',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Mi Portal
              </h1>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748B',
                margin: '0.25rem 0 0 0'
              }}>
                Portal del Paciente
              </p>
            </div>
            
            {window.innerWidth < 1024 && (
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: '#64748B'
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* User Info */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={24} color="#3B82F6" />
            </div>
            <div>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1E293B',
                margin: 0
              }}>
                {user?.firstName} {user?.lastName}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748B',
                margin: '0.125rem 0 0 0'
              }}>
                Paciente
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {navigationItems.map((item) => {
            const isActive = currentPath === item.href;
            const Icon = item.icon;
            
            return (
              <motion.button
                key={item.name}
                onClick={() => {
                  router.push(item.href);
                  setSidebarOpen(false);
                }}
                whileHover={{ backgroundColor: '#F1F5F9' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                  color: isActive ? '#3B82F6' : '#64748B',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  textAlign: 'left',
                  borderLeft: isActive ? '3px solid #3B82F6' : '3px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={20} />
                <div>
                  <div>{item.name}</div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#94A3B8',
                    marginTop: '0.125rem'
                  }}>
                    {item.description}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #E2E8F0'
        }}>
          <motion.button
            onClick={() => router.push('/dashboard/patient/settings')}
            whileHover={{ backgroundColor: '#F1F5F9' }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#64748B',
              cursor: 'pointer',
              fontSize: '0.875rem',
              borderRadius: '0.5rem',
              marginBottom: '0.5rem'
            }}
          >
            <Settings size={20} />
            Configuración
          </motion.button>
          
          <motion.button
            onClick={handleLogout}
            whileHover={{ backgroundColor: '#FEF2F2' }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#EF4444',
              cursor: 'pointer',
              fontSize: '0.875rem',
              borderRadius: '0.5rem'
            }}
          >
            <LogOut size={20} />
            Cerrar Sesión
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginLeft: window.innerWidth >= 1024 ? '0' : '0'
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
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {window.innerWidth < 1024 && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #E2E8F0',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  color: '#64748B'
                }}
              >
                <Menu size={20} />
              </button>
            )}
            
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1E293B',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Bienvenido, {user?.firstName}
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748B',
                margin: '0.25rem 0 0 0'
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard/patient/notifications')}
              style={{
                position: 'relative',
                padding: '0.5rem',
                borderRadius: '50%',
                border: '1px solid #E2E8F0',
                backgroundColor: 'white',
                cursor: 'pointer',
                color: '#64748B'
              }}
            >
              <Bell size={20} />
              <div style={{
                position: 'absolute',
                top: '0.25rem',
                right: '0.25rem',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#EF4444'
              }} />
            </motion.button>

            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={16} color="#3B82F6" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: '2rem',
          overflow: 'auto'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}