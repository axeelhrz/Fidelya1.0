'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Gift, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  X, 
  Filter,
  Search,
  MoreVertical,
  Trash2,
  Archive,
  Star,
  Clock,
  Calendar,
  Tag,
  Eye,
  EyeOff,
  Megaphone
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';
import { Notification, NotificationPriority, NotificationCategory } from '@/types/notification';

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationCard: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onToggleStar?: (id: string) => void;
  onDelete?: (id: string) => void;
}> = ({ notification, onMarkAsRead, onToggleStar, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const getNotificationIcon = () => {
    const icons = {
      info: <Info size={20} />,
      success: <CheckCircle size={20} />,
      warning: <AlertCircle size={20} />,
      error: <X size={20} />,
      announcement: <Megaphone size={20} />
    };
    return icons[notification.type];
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
    const colors: Record<NotificationPriority, string> = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-amber-100 text-amber-700',
      high: 'bg-red-100 text-red-700',
      urgent: 'bg-red-200 text-red-800'
    };
    return colors[notification.priority];
  };

  const formatTime = (date: Date) => {
    if (isToday(date)) {
      return `Hoy ${format(date, 'HH:mm')}`;
    } else if (isYesterday(date)) {
      return `Ayer ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        relative bg-white rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg
        ${notification.read ? 'border-gray-200' : 'border-blue-200 bg-blue-50/30'}
      `}
    >
      {/* Unread Indicator */}
      {!notification.read && (
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
              ${notification.read ? 'text-gray-700' : 'text-gray-900'}
            `}>
              {notification.title}
            </h3>
            
            <div className="flex items-center gap-2">
              {/* Priority Badge */}
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide
                ${getPriorityColor()}
              `}>
                {notification.priority}
              </span>

              {/* Actions Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
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
                      className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 min-w-[150px]"
                    >
                      <button
                        onClick={() => {
                          onMarkAsRead(notification.id);
                          setShowActions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        {notification.read ? <EyeOff size={14} /> : <Eye size={14} />}
                        {notification.read ? 'Marcar como no leída' : 'Marcar como leída'}
                      </button>
                      
                      {onToggleStar && (
                        <button
                          onClick={() => {
                            onToggleStar(notification.id);
                            setShowActions(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Star size={14} className={notification.metadata?.tags?.includes('starred') ? 'text-amber-500' : ''} />
                          {notification.metadata?.tags?.includes('starred') ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        </button>
                      )}
                      
                      <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Archive size={14} />
                        Archivar
                      </button>
                      
                      {onDelete && (
                        <button
                          onClick={() => {
                            onDelete(notification.id);
                            setShowActions(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Category and Time */}
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Tag size={12} />
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
        ${notification.read ? 'text-gray-600' : 'text-gray-700'}
      `}>
        {notification.message}
      </p>

      {/* Action Button */}
      {notification.actionUrl && (
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
          {notification.actionLabel || 'Ver detalles'}
        </button>
      )}

      {/* Click overlay to mark as read */}
      {!notification.read && (
        <button
          onClick={() => onMarkAsRead(notification.id)}
          className="absolute inset-0 rounded-2xl"
          aria-label="Marcar como leída"
        />
      )}
    </motion.div>
  );
};

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || 
                         (filterType === 'read' && notification.read) ||
                         (filterType === 'unread' && !notification.read);
      
      const matchesCategory = filterCategory === 'all' || notification.category === filterCategory;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [notifications, searchTerm, filterType, filterCategory]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const categories = [...new Set(notifications.map(n => n.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell size={32} />
            Notificaciones
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-2">
            Mantente al día con las últimas actualizaciones
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            Marcar todas como leídas
          </button>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas</option>
            <option value="unread">No leídas</option>
            <option value="read">Leídas</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category} className="capitalize">
                {category}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Bell size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filterType !== 'all' || filterCategory !== 'all' 
                  ? 'No se encontraron notificaciones'
                  : 'No tienes notificaciones'
                }
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Te notificaremos cuando tengas nuevas actualizaciones'
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};