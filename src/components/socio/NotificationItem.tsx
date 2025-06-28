'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Calendar,
  ExternalLink,
  MoreVertical 
} from 'lucide-react';
import { Notification } from '@/types/notification';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead
}) => {
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'info':
        return <Info size={20} className="text-blue-500" />;
      case 'announcement':
        return <Bell size={20} className="text-purple-500" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  const getNotificationBg = () => {
    if (notification.status === 'unread') {
      switch (notification.type) {
        case 'success':
          return 'bg-green-50 border-green-200';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200';
        case 'error':
          return 'bg-red-50 border-red-200';
        case 'info':
          return 'bg-blue-50 border-blue-200';
        case 'announcement':
          return 'bg-purple-50 border-purple-200';
        default:
          return 'bg-gray-50 border-gray-200';
      }
    }
    return 'bg-white border-gray-200';
  };

  const getPriorityIndicator = () => {
    switch (notification.priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleClick = () => {
    if (notification.status === 'unread' && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'p-4 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden',
        getNotificationBg(),
        notification.status === 'unread' ? 'shadow-sm' : ''
      )}
      onClick={handleClick}
    >
      {/* Indicador de prioridad */}
      <div className={cn(
        'absolute left-0 top-0 bottom-0 w-1',
        getPriorityIndicator()
      )} />

      <div className="flex items-start gap-3 ml-2">
        {/* Icono */}
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
          notification.status === 'unread' ? 'bg-white shadow-sm' : 'bg-gray-100'
        )}>
          {getNotificationIcon()}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={cn(
                'font-semibold text-sm mb-1',
                notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
              )}>
                {notification.title}
                {notification.status === 'unread' && (
                  <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block" />
                )}
              </h4>
              
              <p className={cn(
                'text-sm mb-2 line-clamp-2',
                notification.status === 'unread' ? 'text-gray-600' : 'text-gray-500'
              )}>
                {notification.message}
              </p>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{formatDate(notification.createdAt)}</span>
                </div>
                
                {notification.category && (
                  <span className="px-2 py-1 bg-gray-200 rounded-full font-medium">
                    {notification.category}
                  </span>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2">
              {notification.actionUrl && (
                <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                  <ExternalLink size={14} className="text-gray-400" />
                </button>
              )}
              
              <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                <MoreVertical size={14} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Botón de acción si existe */}
          {notification.actionUrl && notification.actionLabel && (
            <div className="mt-3">
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                {notification.actionLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
