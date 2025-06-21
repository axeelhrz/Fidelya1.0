'use client';

import React, { useState } from 'react';
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
  Activity
} from 'lucide-react';

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
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);
  const pathname = usePathname();

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Centro de Comando',
      icon: BarChart3,
      href: '/dashboard/ceo',
      children: [
        {
          id: 'executive',
          label: 'Vista Ejecutiva',
          icon: Activity,
          href: '/dashboard/ceo'
        },
        {
          id: 'financial',
          label: 'Inteligencia Financiera',
          icon: DollarSign,
          href: '/dashboard/ceo/financial'
        },
        {
          id: 'clinical',
          label: 'Operaciones Clínicas',
          icon: Heart,
          href: '/dashboard/ceo/clinical'
        },
        {
          id: 'commercial',
          label: 'Marketing Inteligente',
          icon: Target,
          href: '/dashboard/ceo/commercial'
        }
      ]
    },
    {
      id: 'patients',
      label: 'Gestión de Pacientes',
      icon: Users,
      href: '/dashboard/patients',
      children: [
        {
          id: 'patients-list',
          label: 'Lista de Pacientes',
          icon: Users,
          href: '/dashboard/patients'
        },
        {
          id: 'patients-analytics',
          label: 'Análisis de Pacientes',
          icon: TrendingUp,
          href: '/dashboard/patients/analytics'
        }
      ]
    },
    {
      id: 'sessions',
      label: 'Gestión de Sesiones',
      icon: FileText,
      href: '/dashboard/sessions',
      children: [
        {
          id: 'sessions-list',
          label: 'Historial de Sesiones',
          icon: FileText,
          href: '/dashboard/sessions'
        },
        {
          id: 'sessions-ai',
          label: 'Análisis con IA',
          icon: Brain,
          href: '/dashboard/sessions/ai'
        }
      ]
    },
    {
      id: 'agenda',
      label: 'Agenda y Consultorios',
      icon: Calendar,
      href: '/dashboard/agenda',
      children: [
        {
          id: 'calendar',
          label: 'Calendario',
          icon: Calendar,
          href: '/dashboard/agenda'
        },
        {
          id: 'rooms',
          label: 'Consultorios',
          icon: Home,
          href: '/dashboard/agenda/rooms'
        }
      ]
    },
    {
      id: 'alerts',
      label: 'Alertas Clínicas',
      icon: AlertTriangle,
      href: '/dashboard/alerts',
      badge: 5
    },
    {
      id: 'metrics',
      label: 'Métricas Clínicas',
      icon: TrendingUp,
      href: '/dashboard/metrics'
    },
    {
      id: 'integrations',
      label: 'Integraciones',
      icon: Zap,
      href: '/dashboard/integrations',
      children: [
        {
          id: 'whatsapp',
          label: 'WhatsApp',
          icon: MessageSquare,
          href: '/dashboard/integrations/whatsapp'
        },
        {
          id: 'sheets',
          label: 'Google Sheets',
          icon: Database,
          href: '/dashboard/integrations/sheets'
        }
      ]
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings,
      href: '/dashboard/settings',
      children: [
        {
          id: 'general',
          label: 'General',
          icon: Settings,
          href: '/dashboard/settings'
        },
        {
          id: 'users',
          label: 'Usuarios y Roles',
          icon: Shield,
          href: '/dashboard/settings/users'
        },
        {
          id: 'compliance',
          label: 'Cumplimiento',
          icon: Shield,
          href: '/dashboard/settings/compliance'
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

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href);

    return (
      <div key={item.id}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: level === 0 ? '0.75rem 1rem' : '0.5rem 1rem 0.5rem 2.5rem',
            cursor: 'pointer',
            borderRadius: '0.75rem',
            margin: '0.25rem 0.5rem',
            backgroundColor: active ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
            border: active ? '1px solid rgba(37, 99, 235, 0.2)' : '1px solid transparent',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onClick={() => hasChildren ? toggleExpanded(item.id) : null}
        >
          {hasChildren ? (
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <item.icon 
                size={18} 
                color={active ? '#2563EB' : '#6B7280'} 
                style={{ marginRight: '0.75rem' }}
              />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: active ? 600 : 500,
                color: active ? '#2563EB' : '#374151',
                flex: 1,
                fontFamily: 'Inter, sans-serif'
              }}>
                {item.label}
              </span>
              {item.badge && (
                <span style={{
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
                  marginRight: '0.5rem'
                }}>
                  {item.badge}
                </span>
              )}
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={16} color="#9CA3AF" />
              </motion.div>
            </div>
          ) : (
            <Link href={item.href} style={{ display: 'flex', alignItems: 'center', width: '100%', textDecoration: 'none' }}>
              <item.icon 
                size={18} 
                color={active ? '#2563EB' : '#6B7280'} 
                style={{ marginRight: '0.75rem' }}
              />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: active ? 600 : 500,
                color: active ? '#2563EB' : '#374151',
                flex: 1,
                fontFamily: 'Inter, sans-serif'
              }}>
                {item.label}
              </span>
              {item.badge && (
                <span style={{
                  backgroundColor: '#EF4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          )}
        </div>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              {item.children?.map(child => renderNavigationItem(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: '280px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(229, 231, 235, 0.6)',
          position: 'fixed',
          height: '100vh',
          zIndex: 40,
          overflowY: 'auto'
        }}
      >
        {/* Header del sidebar */}
        <div style={{
          padding: '1.5rem 1rem',
          borderBottom: '1px solid rgba(229, 231, 235, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Activity size={18} color="white" />
            </div>
            <div>
              <h2 style={{
                fontSize: '1rem',
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
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav style={{ padding: '1rem 0' }}>
          {navigationItems.map(item => renderNavigationItem(item))}
        </nav>

        {/* Footer del sidebar */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          padding: '1rem',
          background: 'rgba(37, 99, 235, 0.05)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(37, 99, 235, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Brain size={16} color="#2563EB" />
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#2563EB',
              fontFamily: 'Inter, sans-serif'
            }}>
              IA Activa
            </span>
          </div>
          <p style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            margin: 0,
            lineHeight: 1.4,
            fontFamily: 'Inter, sans-serif'
          }}>
            Asistente inteligente monitoreando tu centro 24/7
          </p>
        </div>
      </motion.aside>

      {/* Contenido principal */}
      <div style={{
        flex: 1,
        marginLeft: isSidebarOpen ? '280px' : '0',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Toggle button para sidebar */}
        <motion.button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'fixed',
            top: '1rem',
            left: isSidebarOpen ? '292px' : '1rem',
            zIndex: 50,
            padding: '0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            border: '1px solid rgba(229, 231, 235, 0.6)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          {isSidebarOpen ? <X size={20} color="#6B7280" /> : <Menu size={20} color="#6B7280" />}
        </motion.button>

        {/* Contenido de la página */}
        <main style={{ minHeight: '100vh' }}>
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
              display: 'none'
            }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 768px) {
          .overlay {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
