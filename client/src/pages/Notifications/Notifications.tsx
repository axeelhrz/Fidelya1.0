import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Warning,
  Info,
  Error,
  CheckCircle,
  Delete,
  MarkEmailRead,
  FilterList,
  Circle,
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

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [page, filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(filter !== 'all' && { isRead: filter === 'read' ? 'true' : 'false' }),
      });

      const response = await axios.get(`/notifications?${params}`);
      setNotifications(response.data.notifications);
      setTotalPages(response.data.pagination.pages);
      
      // Calcular notificaciones no leídas
      const unread = response.data.notifications.filter((n: Notification) => !n.isRead).length;
      setUnreadCount(unread);
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
      setUnreadCount(prev => Math.max(0, prev - 1));
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
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
      try {
        await axios.delete(`/notifications/${id}`);
        setNotifications(prev => prev.filter(notif => notif.id !== id));
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
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

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'read':
        return notifications.filter(n => n.isRead);
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Notificaciones
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} sin leer`}
                color="primary"
                size="small"
              />
            )}
          </Box>
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<MarkEmailRead />}
              onClick={markAllAsRead}
            >
              Marcar todas como leídas
            </Button>
          )}
        </Box>

        {/* Filtros */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Filtrar por Estado</InputLabel>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  label="Filtrar por Estado"
                >
                  <MenuItem value="all">Todas</MenuItem>
                  <MenuItem value="unread">No leídas</MenuItem>
                  <MenuItem value="read">Leídas</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilter('all')}
              >
                Limpiar Filtros
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Lista de Notificaciones */}
        <Card>
          <CardContent>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography>Cargando notificaciones...</Typography>
              </Box>
            ) : filteredNotifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No hay notificaciones
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filter === 'unread' ? 'No tienes notificaciones sin leer' : 
                   filter === 'read' ? 'No tienes notificaciones leídas' : 
                   'No hay notificaciones disponibles'}
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                <AnimatePresence>
                  {filteredNotifications.map((notification, index) => (
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
                          borderRadius: 1,
                          mb: 1,
                          border: 1,
                          borderColor: notification.isRead ? 'transparent' : 'primary.light',
                        }}
                      >
                        <ListItemIcon>
                          <Box sx={{ position: 'relative' }}>
                            {getNotificationIcon(notification.type)}
                            {!notification.isRead && (
                              <Circle
                                sx={{
                                  position: 'absolute',
                                  top: -2,
                                  right: -2,
                                  fontSize: 8,
                                  color: 'primary.main',
                                }}
                              />
                            )}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
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
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                {notification.message}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(notification.createdAt).toLocaleString()}
                              </Typography>
                            </Box>
                          }
                        />
                        <Stack direction="row" spacing={1}>
                          {!notification.isRead && (
                            <IconButton
                              size="small"
                              onClick={() => markAsRead(notification.id)}
                              title="Marcar como leída"
                            >
                              <MarkEmailRead />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => deleteNotification(notification.id)}
                            title="Eliminar"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </ListItem>
                      {index < filteredNotifications.length - 1 && <Divider />}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, newPage) => setPage(newPage)}
                  color="primary"
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Las notificaciones se generan automáticamente para alertarte sobre stock bajo, 
            productos próximos a vencer, ventas importantes y otros eventos del sistema.
          </Typography>
        </Alert>
      </motion.div>
    </Box>
  );
};

export default Notifications;