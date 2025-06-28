'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search } from 'lucide-react';
import { Notification } from '@/types/notification';
import { NotificationItem } from './NotificationItem';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface NotificationsListProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  loading?: boolean;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && notification.status === 'unread') ||
                         (filter === 'read' && notification.status === 'read');

    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Bell size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notificaciones</h2>
              <p className="text-sm text-gray-500">
                {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
              </p>
            </div>
          </div>

          {unreadCount > 0 && onMarkAllAsRead && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar notificaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'unread', 'read'] as Array<'all' | 'unread' | 'read'>).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {filterOption === 'all' && 'Todas'}
                {filterOption === 'unread' && 'Sin leer'}
                {filterOption === 'read' && 'Leídas'}
                {filterOption === 'unread' && unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NotificationItem
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filter !== 'all' ? 'No se encontraron notificaciones' : 'No hay notificaciones'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Cuando recibas notificaciones aparecerán aquí'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};