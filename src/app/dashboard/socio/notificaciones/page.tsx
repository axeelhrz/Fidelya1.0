'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { 
  Bell,
  BellRing,
  Filter,
  MoreVertical,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  RefreshCw,
  Clock,
  Calendar,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Gift,
  Megaphone,
  CreditCard,
  ExternalLink,
  Flame,
  MessageCircle,
  Smartphone
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Notification } from '@/types/notification';
import toast from 'react-hot-toast';

// Styled Components
const PageContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

const HeaderSection = styled(motion.div)`
  margin-bottom: 2rem;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(135deg, #1e293b 0%, #6366f1 60%, #8b5cf6 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
    letter-spacing: -0.02em;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  p {
    font-size: 1.25rem;
    color: #64748b;
    font-weight: 600;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)<{ color: string; gradient: string }>`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 2rem;
  padding: 2rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 80px -20px ${({ color }) => `${color}30`};
    border-color: ${({ color }) => `${color}40`};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ gradient }) => gradient};
  }
`;

const StatIcon = styled.div<{ color: string; gradient: string }>`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1.25rem;
  background: ${({ gradient }) => gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
  box-shadow: 0 12px 32px ${({ color }) => `${color}40`};
`;

const StatContent = styled.div`
  .value {
    font-size: 2.25rem;
    font-weight: 900;
    color: #1e293b;
    margin-bottom: 0.5rem;
    letter-spacing: -0.02em;
  }
  
  .label {
    font-size: 1rem;
    color: #64748b;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .description {
    font-size: 0.875rem;
    color: #94a3b8;
    font-weight: 500;
  }
`;

const FilterSection = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 2rem;
  padding: 2rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  .title-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .icon-container {
    width: 3rem;
    height: 3rem;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .title-content h3 {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }
  
  .title-content p {
    color: #64748b;
    font-weight: 600;
  }
`;

const FilterControls = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: 1rem;
  align-items: end;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  background: #f1f5f9;
  border-radius: 1rem;
  padding: 0.25rem;
  gap: 0.25rem;
`;

const FilterTab = styled(motion.button)<{ active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  ${({ active }) => active ? css`
    background: white;
    color: #1e293b;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  ` : css`
    background: transparent;
    color: #64748b;
    
    &:hover {
      color: #1e293b;
      background: rgba(255, 255, 255, 0.5);
    }
  `}
`;

const TabBadge = styled.span<{ color: string; active: boolean }>`
  background: ${({ color, active }) => active ? color : '#e2e8f0'};
  color: ${({ active }) => active ? 'white' : '#64748b'};
  padding: 0.125rem 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 800;
  min-width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
`;

const NotificationsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NotificationCard = styled(motion.div)<{ 
  type: string; 
  priority: string; 
  unread: boolean;
}>`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 1.5rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  ${({ unread }) => unread && css`
    border-color: #6366f1;
    box-shadow: 0 12px 32px rgba(99, 102, 241, 0.15);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
    }
  `}
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: rgba(99, 102, 241, 0.3);
  }
  
  ${({ priority }) => {
    switch (priority) {
      case 'urgent':
        return css`
          &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: #ef4444;
          }
        `;
      case 'high':
        return css`
          &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: #f59e0b;
          }
        `;
      default:
        return '';
    }
  }}
`;

const NotificationContent = styled.div`
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const NotificationIcon = styled.div<{ type: string; unread: boolean }>`
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  ${({ type, unread }) => {
    const getTypeStyles = () => {
      switch (type) {
        case 'success':
          return css`
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
          `;
        case 'warning':
          return css`
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
          `;
        case 'error':
          return css`
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
          `;
        case 'info':
          return css`
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
          `;
        case 'announcement':
          return css`
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
          `;
        default:
          return css`
            background: linear-gradient(135deg, #6b7280, #4b5563);
            color: white;
          `;
      }
    };
    
    return unread ? getTypeStyles() : css`
      background: #f1f5f9;
      color: #64748b;
    `;
  }}
`;

const NotificationBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const NotificationTitle = styled.h4<{ unread: boolean }>`
  font-size: 1.125rem;
  font-weight: ${({ unread }) => unread ? 800 : 600};
  color: ${({ unread }) => unread ? '#1e293b' : '#64748b'};
  margin-bottom: 0.25rem;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UnreadDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  background: #6366f1;
  border-radius: 50%;
  flex-shrink: 0;
`;

const NotificationMessage = styled.p<{ unread: boolean }>`
  color: ${({ unread }) => unread ? '#64748b' : '#94a3b8'};
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const NotificationMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  
  .icon {
    color: #94a3b8;
  }
`;

const CategoryBadge = styled.span<{ category: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${({ category }) => {
    switch (category) {
      case 'membership':
        return css`
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #93c5fd;
        `;
      case 'payment':
        return css`
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fcd34d;
        `;
      case 'general':
        return css`
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #86efac;
        `;
      case 'event':
        return css`
          background: #fae8ff;
          color: #86198f;
          border: 1px solid #d8b4fe;
        `;
      default:
        return css`
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        `;
    }
  }}
`;

const NotificationActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ActionButton = styled(motion.button)<{ variant: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${({ variant }) => variant === 'primary' ? css`
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
  ` : css`
    background: #f1f5f9;
    color: #64748b;
    
    &:hover {
      background: #e2e8f0;
      color: #475569;
    }
  `}
`;

const NotificationMenu = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 0.5rem;
  color: #94a3b8;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
    color: #64748b;
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  
  .icon {
    width: 6rem;
    height: 6rem;
    margin: 0 auto 2rem;
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    border-radius: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
  }
  
  .title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  .description {
    color: #64748b;
    font-weight: 500;
    margin-bottom: 2rem;
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};


// Mock data mejorado
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: '🎉 ¡Nuevo beneficio exclusivo disponible!',
    message: 'Fashion Store Premium tiene un descuento especial del 30% solo para ti. Válido hasta fin de mes en toda la colección de invierno.',
    type: 'info',
    priority: 'high',
    status: 'unread',
    category: 'membership',
    createdAt: new Date(),
    updatedAt: new Date(),
    actionUrl: '/dashboard/socio/beneficios',
    actionLabel: 'Ver Beneficio',
    read: false
  },
  {
    id: '2',
    title: '⚠️ Recordatorio de renovación',
    message: 'Tu socio premium vence en 15 días. Renueva ahora y mantén todos tus beneficios exclusivos sin interrupciones.',
    type: 'warning',
    priority: 'urgent',
    status: 'unread',
    category: 'payment',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    actionUrl: '/dashboard/socio/perfil',
    actionLabel: 'Renovar Ahora',
    read: false
  },
  {
    id: '3',
    title: '✅ Beneficio usado exitosamente',
    message: 'Has usado tu descuento del 25% en Café Central. Ahorraste $750 en tu compra. ¡Gracias por ser parte de nuestra comunidad!',
    type: 'success',
    priority: 'low',
    status: 'read',
    category: 'general',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true
  },
  {
    id: '4',
    title: '🔥 Evento especial este fin de semana',
    message: 'No te pierdas el mega evento de descuentos del próximo fin de semana. Hasta 60% OFF en más de 50 comercios afiliados.',
    type: 'announcement',
    priority: 'medium',
    status: 'unread',
    category: 'event',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    actionUrl: '/dashboard/socio/beneficios',
    actionLabel: 'Ver Evento',
    read: false
  },
  {
    id: '5',
    title: '🎯 Nuevo comercio afiliado',
    message: 'Bienvenido Restaurante Gourmet a nuestra red. Disfruta de un 20% de descuento en tu primera visita.',
    type: 'info',
    priority: 'medium',
    status: 'read',
    category: 'general',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true
  },
  {
    id: '6',
    title: '💳 Pago procesado correctamente',
    message: 'Tu pago de renovación anual ha sido procesado exitosamente. Tu socio está activo hasta diciembre 2025.',
    type: 'success',
    priority: 'low',
    status: 'read',
    category: 'payment',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true
  }
];

interface FilterState {
  search: string;
  type: 'all' | 'unread' | 'read';
  category: string;
  priority: string;
}

export default function SocioNotificacionesPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    category: '',
    priority: ''
  });

  // Estadísticas calculadas
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => n.status === 'unread').length,
    today: notifications.filter(n => {
      const today = new Date();
      const notificationDate = n.createdAt;
      return notificationDate.toDateString() === today.toDateString();
    }).length,
    urgent: notifications.filter(n => n.priority === 'urgent' && n.status === 'unread').length
  };

  // Filtrar notificaciones
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         notification.message.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesType = filters.type === 'all' || 
                       (filters.type === 'unread' && notification.status === 'unread') ||
                       (filters.type === 'read' && notification.status === 'read');
    
    const matchesCategory = !filters.category || notification.category === filters.category;
    const matchesPriority = !filters.priority || notification.priority === filters.priority;
    
    return matchesSearch && matchesType && matchesCategory && matchesPriority;
  }).sort((a, b) => {
    // Ordenar por: no leídas primero, luego por fecha
    if (a.status !== b.status) {
      return a.status === 'unread' ? -1 : 1;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const categories = Array.from(new Set(notifications.map(n => n.category).filter(Boolean)));

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, status: 'read' as const, read: true }
          : notification
      )
    );
    toast.success('Notificación marcada como leída');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ 
        ...notification, 
        status: 'read' as const, 
        read: true 
      }))
    );
    toast.success('Todas las notificaciones marcadas como leídas');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notificación eliminada');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      case 'announcement':
        return <Megaphone size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
  };

  return (
    <DashboardLayout
      activeSection="notificaciones"
      sidebarComponent={SocioSidebar}
    >
      <PageContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <HeaderSection>
          <HeaderContent>
            <HeaderTitle>
              <h1>Notificaciones</h1>
              <p>Mantente al día con las últimas noticias y actualizaciones</p>
            </HeaderTitle>
            <HeaderActions>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Settings size={16} />}
                onClick={() => setSettingsOpen(true)}
              >
                Configurar
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw size={16} />}
                onClick={() => window.location.reload()}
              >
                Actualizar
              </Button>
              {stats.unread > 0 && (
                <Button
                  size="sm"
                  leftIcon={<CheckCheck size={16} />}
                  onClick={handleMarkAllAsRead}
                >
                  Marcar Todas
                </Button>
              )}
            </HeaderActions>
          </HeaderContent>
        </HeaderSection>

        {/* Stats Cards */}
        <StatsContainer>
          <StatCard
            color="#6366f1"
            gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
            whileHover={{ y: -8 }}
          >
            <StatIcon color="#6366f1" gradient="linear-gradient(135deg, #6366f1, #8b5cf6)">
              <Bell size={24} />
            </StatIcon>
            <StatContent>
              <div className="value">{stats.total}</div>
              <div className="label">Total Notificaciones</div>
              <div className="description">En tu bandeja de entrada</div>
            </StatContent>
          </StatCard>

          <StatCard
            color="#ef4444"
            gradient="linear-gradient(135deg, #ef4444, #dc2626)"
            whileHover={{ y: -8 }}
          >
            <StatIcon color="#ef4444" gradient="linear-gradient(135deg, #ef4444, #dc2626)">
              <BellRing size={24} />
            </StatIcon>
            <StatContent>
              <div className="value">{stats.unread}</div>
              <div className="label">Sin Leer</div>
              <div className="description">Requieren tu atención</div>
            </StatContent>
          </StatCard>

          <StatCard
            color="#10b981"
            gradient="linear-gradient(135deg, #10b981, #059669)"
            whileHover={{ y: -8 }}
          >
            <StatIcon color="#10b981" gradient="linear-gradient(135deg, #10b981, #059669)">
              <Calendar size={24} />
            </StatIcon>
            <StatContent>
              <div className="value">{stats.today}</div>
              <div className="label">Hoy</div>
              <div className="description">Notificaciones de hoy</div>
            </StatContent>
          </StatCard>

          <StatCard
            color="#f59e0b"
            gradient="linear-gradient(135deg, #f59e0b, #d97706)"
            whileHover={{ y: -8 }}
          >
            <StatIcon color="#f59e0b" gradient="linear-gradient(135deg, #f59e0b, #d97706)">
              <Flame size={24} />
            </StatIcon>
            <StatContent>
              <div className="value">{stats.urgent}</div>
              <div className="label">Urgentes</div>
              <div className="description">Requieren acción inmediata</div>
            </StatContent>
          </StatCard>
        </StatsContainer>

        {/* Filter Section */}
        <FilterSection>
          <FilterHeader>
            <div className="title-section">
              <div className="icon-container">
                <Filter size={20} />
              </div>
              <div className="title-content">
                <h3>Filtros y Búsqueda</h3>
                <p>Encuentra exactamente lo que buscas</p>
              </div>
            </div>
          </FilterHeader>

          <FilterControls>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar notificaciones
              </label>
              <Input
                placeholder="Buscar por título o contenido..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'membership' && 'Socios'}
                    {category === 'payment' && 'Pagos'}
                    {category === 'general' && 'General'}
                    {category === 'event' && 'Eventos'}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="outline"
              leftIcon={<RefreshCw size={16} />}
              onClick={() => setFilters({ search: '', type: 'all', category: '', priority: '' })}
            >
              Limpiar
            </Button>
          </FilterControls>

          {/* Filter Tabs */}
          <div style={{ marginTop: '1.5rem' }}>
            <FilterTabs>
              <FilterTab
                active={filters.type === 'all'}
                onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Bell size={16} />
                Todas
                <TabBadge color="#6366f1" active={filters.type === 'all'}>
                  {stats.total}
                </TabBadge>
              </FilterTab>
              
              <FilterTab
                active={filters.type === 'unread'}
                onClick={() => setFilters(prev => ({ ...prev, type: 'unread' }))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <BellRing size={16} />
                Sin Leer
                <TabBadge color="#ef4444" active={filters.type === 'unread'}>
                  {stats.unread}
                </TabBadge>
              </FilterTab>
              
              <FilterTab
                active={filters.type === 'read'}
                onClick={() => setFilters(prev => ({ ...prev, type: 'read' }))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCircle size={16} />
                Leídas
                <TabBadge color="#10b981" active={filters.type === 'read'}>
                  {stats.total - stats.unread}
                </TabBadge>
              </FilterTab>
            </FilterTabs>
          </div>
        </FilterSection>

        {/* Notifications List */}
        <NotificationsContainer>
          <AnimatePresence>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <NotificationCard
                  key={notification.id}
                  type={notification.type}
                  priority={notification.priority}
                  unread={notification.status === 'unread'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => {
                    if (notification.status === 'unread') {
                      handleMarkAsRead(notification.id);
                    }
                  }}
                >
                  <NotificationContent>
                    <NotificationIcon 
                      type={notification.type} 
                      unread={notification.status === 'unread'}
                    >
                      {getNotificationIcon(notification.type)}
                    </NotificationIcon>

                    <NotificationBody>
                      <NotificationHeader>
                        <NotificationTitle unread={notification.status === 'unread'}>
                          {notification.title}
                          {notification.status === 'unread' && <UnreadDot />}
                        </NotificationTitle>
                        
                        <NotificationMenu>
                          <MenuButton>
                            <MoreVertical size={16} />
                          </MenuButton>
                        </NotificationMenu>
                      </NotificationHeader>

                      <NotificationMessage unread={notification.status === 'unread'}>
                        {notification.message}
                      </NotificationMessage>

                      <NotificationMeta>
                        <MetaItem>
                          <Clock size={14} className="icon" />
                          {formatTimeAgo(notification.createdAt)}
                        </MetaItem>
                        
                        {notification.category && (
                          <CategoryBadge category={notification.category}>
                            {notification.category === 'membership' && 'Socios'}
                            {notification.category === 'payment' && 'Pagos'}
                            {notification.category === 'general' && 'General'}
                            {notification.category === 'event' && 'Eventos'}
                          </CategoryBadge>
                        )}
                        
                        {notification.priority === 'urgent' && (
                          <MetaItem style={{ color: '#ef4444' }}>
                            <Flame size={14} className="icon" />
                            Urgente
                          </MetaItem>
                        )}
                      </NotificationMeta>

                      {(notification.actionUrl || notification.status === 'unread') && (
                        <NotificationActions>
                          {notification.actionUrl && notification.actionLabel && (
                            <ActionButton
                              variant="primary"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <ExternalLink size={14} />
                              {notification.actionLabel}
                            </ActionButton>
                          )}
                          
                          {notification.status === 'unread' && (
                            <ActionButton
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Check size={14} />
                              Marcar como leída
                            </ActionButton>
                          )}
                          
                          <ActionButton
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.id);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Trash2 size={14} />
                          </ActionButton>
                        </NotificationActions>
                      )}
                    </NotificationBody>
                  </NotificationContent>
                </NotificationCard>
              ))
            ) : (
              <EmptyState
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="icon">
                  <Bell size={48} />
                </div>
                <div className="title">
                  {filters.search || filters.category || filters.type !== 'all' 
                    ? 'No se encontraron notificaciones' 
                    : 'No hay notificaciones'
                  }
                </div>
                <div className="description">
                  {filters.search || filters.category || filters.type !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Cuando recibas notificaciones aparecerán aquí'
                  }
                </div>
                {(filters.search || filters.category || filters.type !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => setFilters({ search: '', type: 'all', category: '', priority: '' })}
                  >
                    Limpiar Filtros
                  </Button>
                )}
              </EmptyState>
            )}
          </AnimatePresence>
        </NotificationsContainer>

        {/* Settings Modal */}
        <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Settings size={24} className="text-indigo-600" />
                Configuración de Notificaciones
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">Tipos de Notificaciones</h4>
                <div className="space-y-3">
                  {[
                    { key: 'beneficios', label: 'Nuevos beneficios', icon: <Gift size={16} /> },
                    { key: 'pagos', label: 'Recordatorios de pago', icon: <CreditCard size={16} /> },
                    { key: 'eventos', label: 'Eventos especiales', icon: <Calendar size={16} /> },
                    { key: 'general', label: 'Noticias generales', icon: <Info size={16} /> }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-indigo-600">{item.icon}</div>
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">Canales de Entrega</h4>
                <div className="space-y-3">
                  {[
                    { key: 'app', label: 'En la aplicación', icon: <Bell size={16} /> },
                    { key: 'email', label: 'Por email', icon: <MessageCircle size={16} /> },
                    { key: 'sms', label: 'Por SMS', icon: <Smartphone size={16} /> }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-indigo-600">{item.icon}</div>
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={item.key !== 'sms'}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSettingsOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  setSettingsOpen(false);
                  toast.success('Configuración guardada');
                }}
              >
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </DashboardLayout>
  );
}