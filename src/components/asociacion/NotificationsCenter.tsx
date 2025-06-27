'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Avatar,
  IconButton,
  alpha,
  Divider,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import {
  Notifications,
  Add,
  MoreVert,
  CheckCircle,
  Archive,
  Delete,
  SelectAll,
  MarkEmailRead,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationCard } from './NotificationCard';
import { NotificationFilters } from './NotificationFilters';
import { CreateNotificationDialog } from './CreateNotificationDialog';
import { NotificationFormData } from '@/types/notification';

interface NotificationsCenterProps {
  loading?: boolean;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({
  loading: externalLoading = false
}) => {
  const {
    notifications,
    loading,
    stats,
    filters,
    setFilters,
    createNotification,
    markAsRead,
    markAsUnread,
    archiveNotification,
    deleteNotification,
    markAllAsRead,
    bulkAction
  } = useNotifications();

  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleSelectNotification = (id: string, selected: boolean) => {
    setSelectedNotifications(prev => 
      selected 
        ? [...prev, id]
        : prev.filter(notificationId => notificationId !== id)
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
  };

  const handleBulkAction = async (action: 'read' | 'unread' | 'archive' | 'delete') => {
    if (selectedNotifications.length === 0) return;

    setActionLoading(true);
    try {
      await bulkAction(selectedNotifications, action);
      
      const actionMessages = {
        read: `${selectedNotifications.length} notificaciones marcadas como leídas`,
        unread: `${selectedNotifications.length} notificaciones marcadas como no leídas`,
        archive: `${selectedNotifications.length} notificaciones archivadas`,
        delete: `${selectedNotifications.length} notificaciones eliminadas`
      };
      
      toast.success(actionMessages[action]);
      setSelectedNotifications([]);
    } catch {
      toast.error('Error al ejecutar la acción');
    } finally {
      setActionLoading(false);
      setBulkMenuAnchor(null);
    }
  };

  const handleCreateNotification = async (data: NotificationFormData) => {
    setActionLoading(true);
    try {
      await createNotification(data);
      toast.success('Notificación creada exitosamente');
    } catch (error) {
      toast.error('Error al crear la notificación');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setActionLoading(true);
    try {
      await markAllAsRead();
      toast.success('Todas las notificaciones marcadas como leídas');
    } catch {
      toast.error('Error al marcar las notificaciones');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAction = (url: string) => {
    // Navigate to the specified URL
    window.location.href = url;
  };

  const clearFilters = () => {
    setFilters({});
  };

  const isLoading = loading || externalLoading || actionLoading;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                boxShadow: '0 12px 40px rgba(236, 72, 153, 0.3)',
              }}
            >
              <Notifications sx={{ fontSize: 32 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 1 }}>
                Centro de Notificaciones
              </Typography>
              <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
                Gestiona todas las comunicaciones y alertas del sistema
              </Typography>
            </Box>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              variant="contained"
              startIcon={<Add />}
              size="large"
              sx={{
                py: 2,
                px: 4,
                borderRadius: 4,
                textTransform: 'none',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                boxShadow: '0 8px 32px rgba(236, 72, 153, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(236, 72, 153, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Nueva Notificación
            </Button>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
            {[
              { label: 'Total', value: stats.total, color: '#64748b' },
              { label: 'No leídas', value: stats.unread, color: '#ef4444' },
              { label: 'Leídas', value: stats.read, color: '#10b981' },
              { label: 'Archivadas', value: stats.archived, color: '#f59e0b' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: '1px solid #f1f5f9',
                    borderRadius: 4,
                    textAlign: 'center',
                    minWidth: 120,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: alpha(stat.color, 0.3),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 32px ${alpha(stat.color, 0.15)}`,
                    }
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: stat.color,
                      mb: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Box>
      </motion.div>

      {/* Filters */}
      <NotificationFilters
        filters={{
          ...filters,
          dateRange: filters.dateRange
            ? { from: filters.dateRange.start, to: filters.dateRange.end }
            : undefined
        }}
        onFiltersChange={(newFilters) => {
          setFilters({
            ...newFilters,
            dateRange: newFilters.dateRange
              ? { start: newFilters.dateRange.from, end: newFilters.dateRange.to }
              : undefined
          });
        }}
        onClearFilters={clearFilters}
        loading={isLoading}
      />

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                border: '2px solid #6366f1',
                borderRadius: 4,
                bgcolor: alpha('#6366f1', 0.02),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Checkbox
                    checked={selectedNotifications.length === notifications.length}
                    indeterminate={selectedNotifications.length > 0 && selectedNotifications.length < notifications.length}
                    onChange={handleSelectAll}
                    sx={{ color: '#6366f1' }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {selectedNotifications.length} notificación{selectedNotifications.length > 1 ? 'es' : ''} seleccionada{selectedNotifications.length > 1 ? 's' : ''}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    onClick={() => handleBulkAction('read')}
                    startIcon={<CheckCircle />}
                    size="small"
                    sx={{ color: '#10b981' }}
                  >
                    Marcar leídas
                  </Button>
                  <Button
                    onClick={() => handleBulkAction('archive')}
                    startIcon={<Archive />}
                    size="small"
                    sx={{ color: '#f59e0b' }}
                  >
                    Archivar
                  </Button>
                  <Button
                    onClick={() => handleBulkAction('delete')}
                    startIcon={<Delete />}
                    size="small"
                    sx={{ color: '#ef4444' }}
                  >
                    Eliminar
                  </Button>
                  <IconButton
                    onClick={(e) => setBulkMenuAnchor(e.currentTarget)}
                    size="small"
                    sx={{ color: '#64748b' }}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedNotifications.length === notifications.length}
                indeterminate={selectedNotifications.length > 0 && selectedNotifications.length < notifications.length}
                onChange={handleSelectAll}
              />
            }
            label="Seleccionar todo"
            sx={{ color: '#64748b' }}
          />
          
          {stats.unread > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              startIcon={<MarkEmailRead />}
              size="small"
              sx={{
                color: '#6366f1',
                '&:hover': {
                  bgcolor: alpha('#6366f1', 0.1),
                }
              }}
            >
              Marcar todas como leídas
            </Button>
          )}
        </Box>

        <Typography variant="body2" sx={{ color: '#64748b' }}>
          {notifications.length} de {stats.total} notificaciones
        </Typography>
      </Box>

      {/* Notifications List */}
      <Box>
        {isLoading && notifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                border: '4px solid #f1f5f9',
                borderRadius: '50%',
                borderTopColor: '#6366f1',
                animation: 'spin 1s linear infinite',
                mx: 'auto',
                mb: 3,
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
              Cargando notificaciones...
            </Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: 'center',
              border: '1px solid #f1f5f9',
              borderRadius: 4,
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: alpha('#ec4899', 0.1),
                color: '#ec4899',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Notifications sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
              No hay notificaciones
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
              No se encontraron notificaciones que coincidan con los filtros aplicados.
            </Typography>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              variant="contained"
              startIcon={<Add />}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              }}
            >
              Crear primera notificación
            </Button>
          </Paper>
        ) : (
          <AnimatePresence>
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onMarkAsUnread={markAsUnread}
                onArchive={archiveNotification}
                onDelete={deleteNotification}
                onAction={handleAction}
                selected={selectedNotifications.includes(notification.id)}
                onSelect={handleSelectNotification}
              />
            ))}
          </AnimatePresence>
        )}
      </Box>

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkMenuAnchor}
        open={Boolean(bulkMenuAnchor)}
        onClose={() => setBulkMenuAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleBulkAction('unread')}>
          <Badge sx={{ mr: 2 }} />
          Marcar como no leídas
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setSelectedNotifications([])}>
          <SelectAll sx={{ mr: 2, transform: 'scaleX(-1)' }} />
          Deseleccionar todo
        </MenuItem>
      </Menu>

      {/* Create Notification Dialog */}
      <CreateNotificationDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreateNotification}
        loading={actionLoading}
      />
    </Container>
  );
};
