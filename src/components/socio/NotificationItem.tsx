'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { 
  Bell, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  ExternalLink,
  MoreVertical,
  Check,
  Trash2,
  Archive,
  Star,
  Clock,
  Flame,
  Megaphone,
  XCircle,
  Share2
} from 'lucide-react';
import { Notification } from '@/types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
}

const ItemContainer = styled(motion.div)<{ 
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

const ItemContent = styled.div`
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const IconContainer = styled.div<{ type: string; unread: boolean }>`
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

const ContentBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const ContentHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const Title = styled.h4<{ unread: boolean }>`
  font-size: 1.125rem;
  font-weight: ${({ unread }) => unread ? 800 : 600};
  color: ${({ unread }) => unread ? '#1e293b' : '#64748b'};
  margin-bottom: 0.25rem;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UnreadIndicator = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  background: #6366f1;
  border-radius: 50%;
  flex-shrink: 0;
`;

const Message = styled.p<{ unread: boolean }>`
  color: ${({ unread }) => unread ? '#64748b' : '#94a3b8'};
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const MetaInfo = styled.div`
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

const ActionsContainer = styled.div`
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

const MenuContainer = styled.div`
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

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 160px;
  z-index: 50;
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
  
  &.danger:hover {
    background: #fee2e2;
    color: #dc2626;
  }
`;

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onArchive
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const getNotificationIcon = () => {
    switch (notification.type) {
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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'membership': return 'Membresía';
      case 'payment': return 'Pagos';
      case 'general': return 'General';
      case 'event': return 'Eventos';
      default: return category;
    }
  };

  const handleClick = () => {
    if (notification.status === 'unread' && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <ItemContainer
      type={notification.type}
      priority={notification.priority}
      unread={notification.status === 'unread'}
      onClick={handleClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <ItemContent>
        <IconContainer 
          type={notification.type} 
          unread={notification.status === 'unread'}
        >
          {getNotificationIcon()}
        </IconContainer>

        <ContentBody>
          <ContentHeader>
            <Title unread={notification.status === 'unread'}>
              {notification.title}
              {notification.status === 'unread' && <UnreadIndicator />}
            </Title>
            
            <MenuContainer>
              <MenuButton
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
              >
                <MoreVertical size={16} />
              </MenuButton>
              
              <AnimatePresence>
                {menuOpen && (
                  <DropdownMenu
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {notification.status === 'unread' && onMarkAsRead && (
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notification.id);
                          setMenuOpen(false);
                        }}
                      >
                        <Check size={16} />
                        Marcar como leída
                      </MenuItem>
                    )}
                    
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                      }}
                    >
                      <Star size={16} />
                      Marcar como favorita
                    </MenuItem>
                    
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                      }}
                    >
                      <Share2 size={16} />
                      Compartir
                    </MenuItem>
                    
                    {onArchive && (
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onArchive(notification.id);
                          setMenuOpen(false);
                        }}
                      >
                        <Archive size={16} />
                        Archivar
                      </MenuItem>
                    )}
                    
                    {onDelete && (
                      <MenuItem
                        className="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(notification.id);
                          setMenuOpen(false);
                        }}
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </MenuItem>
                    )}
                  </DropdownMenu>
                )}
              </AnimatePresence>
            </MenuContainer>
          </ContentHeader>

          <Message unread={notification.status === 'unread'}>
            {notification.message}
          </Message>

          <MetaInfo>
            <MetaItem>
              <Clock size={14} className="icon" />
              {formatTimeAgo(notification.createdAt)}
            </MetaItem>
            
            {notification.category && (
              <CategoryBadge category={notification.category}>
                {getCategoryLabel(notification.category)}
              </CategoryBadge>
            )}
            
            {notification.priority === 'urgent' && (
              <MetaItem style={{ color: '#ef4444' }}>
                <Flame size={14} className="icon" />
                Urgente
              </MetaItem>
            )}
          </MetaInfo>

          {(notification.actionUrl || notification.status === 'unread') && (
            <ActionsContainer>
              {notification.actionUrl && notification.actionLabel && (
                <ActionButton
                  variant="primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Aquí iría la navegación
                  }}
                >
                  <ExternalLink size={14} />
                  {notification.actionLabel}
                </ActionButton>
              )}
              
              {notification.status === 'unread' && onMarkAsRead && (
                <ActionButton
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Check size={14} />
                  Marcar como leída
                </ActionButton>
              )}
            </ActionsContainer>
          )}
        </ContentBody>
      </ItemContent>
    </ItemContainer>
  );
};