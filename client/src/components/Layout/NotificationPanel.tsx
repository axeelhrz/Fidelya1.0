import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  Close,
  Warning,
  Info,
  Error,
  CheckCircle,
  MarkEmailRead,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  isRead: boolean;
  createdAt: string;
}

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/notifications?limit=20');
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/notifications/read-all');
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'WARNING':
        return <Warning color="warning" />;
      case 'ERROR':
        return <Error color="error" />;
      case 'SUCCESS':
        return <CheckCircle color="success" />;
      default:
        return <Info color="info" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'WARNING':
        return 'warning';
      case 'ERROR':
        return 'error';
      case 'SUCCESS':
        return 'success';
      default:
        return 'info';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          maxWidth: '90vw',
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            Notificaciones
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        
        {unreadCount > 0 && (
          <Button
            startIcon={<MarkEmailRead />}
            onClick={markAllAsRead}
            size="small"
            sx={{ mt: 1 }}
          >
            Marcar todas como leídas
          </Button>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">Cargando...</Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No hay notificaciones
            </Typography>
          </Box>
        ) : (
          <List>
            <AnimatePresence>
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ListItem
                    sx={{
                      backgroundColor: notification.isRead 
                        ? 'transparent' 
                        : 'action.hover',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      },
                    }}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: notification.isRead ? 400 : 600,
                            }}
                          >
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.type}
                            size="small"
                            color={getNotificationColor(notification.type) as any}
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notification.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider />
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default NotificationPanel;