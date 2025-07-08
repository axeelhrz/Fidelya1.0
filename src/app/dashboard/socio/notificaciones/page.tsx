'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  Bell,
  BellRing,
  MoreVertical,
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
  MessageCircle,
  Search,
  Archive,
  Eye,
  EyeOff,
  Users,
  TrendingUp,
  Activity,
  Zap,
  Volume2,
  VolumeX
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import type { Notification } from '@/types/notification';

// Sidebar personalizado que maneja el logout
const SocioSidebarWithLogout: React.FC<{
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
  activeSection: string;
  onLogoutClick: () => void;
}> = (props) => {
  return (
    <SocioSidebar
      open={props.open}
      onToggle={props.onToggle}
      onMenuClick={props.onMenuClick}
      onLogoutClick={props.onLogoutClick}
      activeSection={props.activeSection}
    />
  );
};

// Componente para mostrar una notificación individual
const NotificationCard: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notification, onMarkAsRead, onMarkAsUnread, onArchive, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const getNotificationIcon = () => {
    const iconProps = { size: 20 };
    switch (notification.type) {
      case 'success':
        return <CheckCircle {...iconProps} />;
      case 'warning':
        return <AlertCircle {...iconProps} />;
      case 'error':
        return <XCircle {...iconProps} />;
      case 'info':
        return <Info {...iconProps} />;
      case 'announcement':
        return <Megaphone {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getNotificationColor = () => {
    const colors = {
      info: 'from-blue-500 to-blue-600',
      success: 'from-emerald-500 to-emerald-600',
      warning: 'from-amber-500 to-amber-600',
      error: 'from-red-500 to-red-600',
      announcement: 'from-purple-500 to-purple-600'
    };
    return colors[notification.type];
  };

  const getPriorityColor = () => {
    const colors = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-amber-100 text-amber-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700'
    };
    return colors[notification.priority];
  };

  const getCategoryIcon = () => {
    const iconProps = { size: 14 };
    switch (notification.category) {
      case 'membership':
        return <Users {...iconProps} />;
      case 'payment':
        return <CreditCard {...iconProps} />;
      case 'event':
        return <Calendar {...iconProps} />;
      case 'system':
        return <Settings {...iconProps} />;
      default:
        return <MessageCircle {...iconProps} />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Ahora';
    } else if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Hace ${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Hace ${days}d`;
    }
  };

  const handleCardClick = () => {
    if (notification.status === 'unread') {
      onMarkAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={`
        relative bg-white rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg cursor-pointer
        ${notification.status === 'unread' 
          ? 'border-blue-200 bg-blue-50/30 shadow-md' 
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
      onClick={handleCardClick}
    >
      {/* Priority indicator */}
      {notification.priority === 'urgent' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-t-2xl" />
      )}
      
      {/* Unread indicator */}
      {notification.status === 'unread' && (
        <div className="absolute top-4 left-4 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-r
          ${getNotificationColor()}
        `}>
          {getNotificationIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`
              font-bold text-lg leading-tight
              ${notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}
            `}>
              {notification.title}
            </h3>
            
            <div className="flex items-center gap-2">
              {/* Priority badge */}
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide
                ${getPriorityColor()}
              `}>
                {notification.priority}
              </span>

              {/* Actions menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <MoreVertical size={16} className="text-gray-400" />
                </button>

                <AnimatePresence>
                  {showActions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 min-w-[180px]"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (notification.status === 'unread') {
                            onMarkAsRead(notification.id);
                          } else {
                            onMarkAsUnread(notification.id);
                          }
                          setShowActions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        {notification.status === 'unread' ? <Eye size={14} /> : <EyeOff size={14} />}
                        {notification.status === 'unread' ? 'Marcar como leída' : 'Marcar como no leída'}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onArchive(notification.id);
                          setShowActions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Archive size={14} />
                        Archivar
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(notification.id);
                          setShowActions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Category and time */}
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              {getCategoryIcon()}
              <span className="capitalize">{notification.category}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{formatTime(notification.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      <p className={`
        text-base leading-relaxed mb-4
        ${notification.status === 'unread' ? 'text-gray-700' : 'text-gray-600'}
      `}>
        {notification.message}
      </p>

      {/* Action button */}
      {notification.actionUrl && notification.actionLabel && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(notification.actionUrl, '_blank');
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
        >
          <ExternalLink size={14} />
          {notification.actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default function SocioNotificacionesPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  
  // Estados para el modal de logout
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Hook de notificaciones
  const {
    notifications,
    loading,
    error,
    stats,
    markAsRead,
    markAsUnread,
    archiveNotification,
    deleteNotification,
    markAllAsRead,
    clearNewNotificationCount,
    requestNotificationPermission
  } = useNotifications();

  // Aplicar filtros
  const filteredNotifications = React.useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || 
                         (filterType === 'read' && notification.status === 'read') ||
                         (filterType === 'unread' && notification.status === 'unread');
      
      const matchesCategory = filterCategory === 'all' || notification.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;

      return matchesSearch && matchesType && matchesCategory && matchesPriority;
    });
  }, [notifications, searchTerm, filterType, filterCategory, filterPriority]);

  // Solicitar permisos de notificación al cargar
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  // Limpiar contador de nuevas notificaciones cuando se visita la página
  useEffect(() => {
    clearNewNotificationCount();
  }, [clearNewNotificationCount]);

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión. Inténtalo de nuevo.');
    } finally {
      setLoggingOut(false);
      setLogoutModalOpen(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, [markAsRead]);

  const handleMarkAsUnread = useCallback(async (id: string) => {
    try {
      await markAsUnread(id);
    } catch (error) {
      console.error('Error marking as unread:', error);
    }
  }, [markAsUnread]);

  const handleArchive = useCallback(async (id: string) => {
    try {
      await archiveNotification(id);
    } catch (error) {
      console.error('Error archiving notification:', error);
    }
  }, [archiveNotification]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [deleteNotification]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, [markAllAsRead]);

  const categories = React.useMemo(() => {
    const uniqueCategories = [...new Set(notifications.map(n => n.category))];
    return uniqueCategories;
  }, [notifications]);

  if (loading) {
    return (
      <DashboardLayout
        activeSection="notificaciones"
        sidebarComponent={(props) => (
          <SocioSidebarWithLogout
            {...props}
            onLogoutClick={handleLogoutClick}
          />
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw size={24} className="text-white animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cargando notificaciones...</h3>
              <p className="text-gray-500">Obteniendo tus últimas actualizaciones</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        activeSection="notificaciones"
        sidebarComponent={(props) => (
          <SocioSidebarWithLogout
            {...props}
            onLogoutClick={handleLogoutClick}
          />
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar notificaciones</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <DashboardLayout
        activeSection="notificaciones"
        sidebarComponent={(props) => (
          <SocioSidebarWithLogout
            {...props}
            onLogoutClick={handleLogoutClick}
          />
        )}
      >
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Bell size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    Notificaciones
                    {stats.unread > 0 && (
                      <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        {stats.unread}
                      </span>
                    )}
                  </h1>
                  <p className="text-gray-600">Mantente al día con las últimas actualizaciones</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Sound toggle */}
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`
                    p-3 rounded-xl transition-colors duration-200
                    ${soundEnabled 
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }
                  `}
                  title={soundEnabled ? 'Desactivar sonidos' : 'Activar sonidos'}
                >
                  {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>

                {/* Mark all as read */}
                {stats.unread > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <CheckCheck size={20} />
                    Marcar todas como leídas
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Bell size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <BellRing size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">No leídas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Leídas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.read}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Activity size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recentActivity.today}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar notificaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'unread' | 'read')}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="all">Todas</option>
                <option value="unread">No leídas</option>
                <option value="read">Leídas</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category} className="capitalize">
                    {category}
                  </option>
                ))}
              </select>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="all">Todas las prioridades</option>
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
          </motion.div>

          {/* Notifications List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAsUnread={handleMarkAsUnread}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm || filterType !== 'all' || filterCategory !== 'all' || filterPriority !== 'all'
                      ? 'No se encontraron notificaciones'
                      : 'No tienes notificaciones'
                    }
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm || filterType !== 'all' || filterCategory !== 'all' || filterPriority !== 'all'
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'Te notificaremos cuando tengas nuevas actualizaciones'
                    }
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quick Actions */}
          {filteredNotifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-4">
                <Zap size={20} />
                <h3 className="font-semibold">Acciones Rápidas</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => router.push('/dashboard/socio/perfil')}
                  className="bg-white/20 hover:bg-white/30 rounded-xl p-4 text-left transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Settings size={16} />
                    <span className="font-medium">Configurar notificaciones</span>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/dashboard/socio/beneficios')}
                  className="bg-white/20 hover:bg-white/30 rounded-xl p-4 text-left transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Gift size={16} />
                    <span className="font-medium">Ver beneficios</span>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/dashboard/socio')}
                  className="bg-white/20 hover:bg-white/30 rounded-xl p-4 text-left transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp size={16} />
                    <span className="font-medium">Ver dashboard</span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </DashboardLayout>

      {/* Modal de Logout */}
      <LogoutModal
        isOpen={logoutModalOpen}
        isLoading={loggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
}