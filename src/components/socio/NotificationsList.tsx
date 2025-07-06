'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Bell, Filter, CheckCheck, Archive } from 'lucide-react';
import { Notification } from '@/types/notification';
import { NotificationItem } from './NotificationItem';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface NotificationsListProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDeleteNotification?: (id: string) => void;
  loading?: boolean;
}

const ListContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeaderCard = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 2rem;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ef4444, #f59e0b, #10b981);
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
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
    background: linear-gradient(135deg, #ef4444, #dc2626);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .title-content h2 {
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
  grid-template-columns: 2fr auto;
  gap: 1rem;
  align-items: end;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  background: #f1f5f9;
  border-radius: 1rem;
  padding: 0.25rem;
  gap: 0.25rem;
  margin-top: 1rem;
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

const NotificationsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoadingSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SkeletonItem = styled.div`
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #f1f5f9;
  
  .skeleton-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .skeleton-avatar {
    width: 3rem;
    height: 3rem;
    background: #f1f5f9;
    border-radius: 1rem;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .skeleton-content {
    flex: 1;
  }
  
  .skeleton-title {
    height: 1rem;
    background: #f1f5f9;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .skeleton-text {
    height: 0.75rem;
    background: #f1f5f9;
    border-radius: 0.5rem;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const EmptyState = styled(motion.div)`
  background: white;
  border-radius: 2rem;
  padding: 4rem 2rem;
  border: 1px solid #f1f5f9;
  text-align: center;
  
  .icon {
    width: 4rem;
    height: 4rem;
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    border-radius: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    color: #94a3b8;
  }
  
  .title {
    font-size: 1.25rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  .description {
    color: #64748b;
    font-weight: 500;
    margin-bottom: 1.5rem;
  }
`;

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
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
  const readCount = notifications.filter(n => n.status === 'read').length;

  if (loading) {
    return (
      <LoadingSkeleton>
        {[...Array(5)].map((_, i) => (
          <SkeletonItem key={i}>
            <div className="skeleton-header">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-content">
                <div className="skeleton-title" style={{ width: '75%' }}></div>
                <div className="skeleton-text" style={{ width: '50%' }}></div>
              </div>
            </div>
          </SkeletonItem>
        ))}
      </LoadingSkeleton>
    );
  }

  return (
    <ListContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <HeaderCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <HeaderContent>
          <div className="title-section">
            <div className="icon-container">
              <Bell size={20} />
            </div>
            <div className="title-content">
              <h2>Centro de Notificaciones</h2>
              <p>
                {unreadCount > 0 ? `${unreadCount} sin leer de ${notifications.length}` : 'Todo al día'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {unreadCount > 0 && onMarkAllAsRead && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<CheckCheck size={16} />}
                onClick={onMarkAllAsRead}
              >
                Marcar Todas
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Archive size={16} />}
            >
              Archivar
            </Button>
          </div>
        </HeaderContent>

        {/* Filtros y búsqueda */}
        <FilterControls>
          <Input
            placeholder="Buscar notificaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter size={16} />}
          >
            Filtros
          </Button>
        </FilterControls>

        {/* Tabs de filtro */}
        <FilterTabs>
          <FilterTab
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Bell size={16} />
            Todas
            <TabBadge color="#6366f1" active={filter === 'all'}>
              {notifications.length}
            </TabBadge>
          </FilterTab>
          
          <FilterTab
            active={filter === 'unread'}
            onClick={() => setFilter('unread')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Bell size={16} />
            Sin Leer
            <TabBadge color="#ef4444" active={filter === 'unread'}>
              {unreadCount}
            </TabBadge>
          </FilterTab>
          
          <FilterTab
            active={filter === 'read'}
            onClick={() => setFilter('read')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckCheck size={16} />
            Leídas
            <TabBadge color="#10b981" active={filter === 'read'}>
              {readCount}
            </TabBadge>
          </FilterTab>
        </FilterTabs>
      </HeaderCard>

      {/* Lista de notificaciones */}
      <NotificationsListContainer>
        <AnimatePresence>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <NotificationItem
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDeleteNotification}
                />
              </motion.div>
            ))
          ) : (
            <EmptyState
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="icon">
                <Bell size={32} />
              </div>
              <div className="title">
                {searchTerm || filter !== 'all' ? 'No se encontraron notificaciones' : 'No hay notificaciones'}
              </div>
              <div className="description">
                {searchTerm || filter !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Cuando recibas notificaciones aparecerán aquí'
                }
              </div>
              {(searchTerm || filter !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                >
                  Limpiar Filtros
                </Button>
              )}
            </EmptyState>
          )}
        </AnimatePresence>
      </NotificationsListContainer>
    </ListContainer>
  );
};
