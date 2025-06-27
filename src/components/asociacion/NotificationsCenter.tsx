'use client';

import React, { useState, useEffect } from 'react';
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
  Tooltip,
  LinearProgress,
  Fab,
  Zoom,
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
  Refresh,
  Settings,
  TrendingUp,
  Schedule,
  NotificationsActive,
  VolumeUp,
  VolumeOff,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationCard } from './NotificationCard';
import { NotificationFilters } from './NotificationFilters';
import { CreateNotificationDialog } from './CreateNotificationDialog';
import { RealTimeNotifications } from './RealTimeNotifications';
import { NotificationFormData } from '@/types/notification';

interface NotificationsCenterProps {
  loading?: boolean;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({
  loading: externalLoading = false
}) => {
  const {
    notifications,
    allNotifications,
    loading,
    error,
    stats,
    filters,
    newNotificationCount,
    setFilters,
    createNotification,
    markAsRead,
    markAsUnread,
    archiveNotification,
    deleteNotification,
    markAllAsRead,
    bulkAction,
    clearNewNotificationCount,
    refreshStats,
  } = useNotifications();

  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refreshStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshStats]);

  // Clear new notification count when user interacts
  useEffect(() => {
    if (selectedNotifications.length > 0 || createDialogOpen) {
      clearNewNotificationCount();
    }
  }, [selectedNotifications, createDialogOpen, clearNewNotificationCount]);

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
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Bulk action error:', error);
    } finally {
      setActionLoading(false);
      setBulkMenuAnchor(null);
    }
  };

  const handleCreateNotification = async (data: NotificationFormData) => {
    setActionLoading(true);
    try {
      await createNotification(data);
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setActionLoading(true);
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Mark all as read error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAction = (url: string) => {
    window.location.href = url;
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleRefresh = async () => {
    setActionLoading(true);
    try {
      await refreshStats();
      toast.success('Notificaciones actualizadas');
    } catch (error) {
      toast.error('Error al actualizar');
    } finally {
      setActionLoading(false);
    }
  };

  const isLoading = loading || externalLoading || actionLoading;

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: 'center',
            border: '1px solid #fee2e2',
            borderRadius: 4,
            bgcolor: '#fef2f2',
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: alpha('#ef4444', 0.1),
              color: '#ef4444',
              mx: 'auto',
              mb: 3,
            }}
          >
            <Notifications sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#dc2626', mb: 2 }}>
            Error al cargar notificaciones
          </Typography>
          <Typography variant="body1" sx={{ color: '#7f1d1d', mb: 4 }}>
            {error}
          </Typography>
          <Button
            onClick={handleRefresh}
            variant="contained"
            startIcon={<Refresh />}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              bgcolor: '#ef4444',
              '&:hover': { bgcolor: '#dc2626' }
            }}
          >
            Reintentar
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
              <Badge
                badgeContent={newNotificationCount}
                color="error"
                max={99}
                sx={{
                  '& .MuiBadge-badge': {
                    animation: newNotificationCount > 0 ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.2)' },
                      '100%': { transform: 'scale(1)' },
                    },
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                    boxShadow: '0 12px 40px rgba(236, 72, 153, 0.3)',
                  }}
                >
                  <NotificationsActive sx={{ fontSize: 32 }} />
                </Avatar>
              </Badge>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 1 }}>
                  Centro de Notificaciones
                  {isLoading && (
                    <LinearProgress
                      sx={{
                        mt: 1,
                        borderRadius: 2,
                        height: 4,
                        bgcolor: alpha('#ec4899', 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#ec4899',
                        }
                      }}
                    />
                  )}
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Gestiona todas las comunicaciones y alertas del sistema
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}>
                  <IconButton
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    sx={{
                      color: soundEnabled ? '#10b981' : '#94a3b8',
                      bgcolor: alpha(soundEnabled ? '#10b981' : '#94a3b8', 0.1),
                    }}
                  >
                    {soundEnabled ? <VolumeUp /> : <VolumeOff />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Actualizar">
                  <IconButton
                    onClick={handleRefresh}
                    disabled={isLoading}
                    sx={{
                      color: '#6366f1',
                      bgcolor: alpha('#6366f1', 0.1),
                      '&:hover': {
                        bgcolor: alpha('#6366f1', 0.2),
                      }
                    }}
                  >
                    <Refresh sx={{ 
                      animation: isLoading ? 'spin 1s linear infinite' : 'none',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      }
                    }} />
                  </IconButton>
                </Tooltip>

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
            </Box>

            {/* Enhanced Stats Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 4 }}>
              {[
                { 
                  label: 'Total', 
                  value: stats.total, 
                  color: '#64748b',
                  icon: <Notifications />,
                  trend: '+12%'
                },
                { 
                  label: 'No leídas', 
                  value: stats.unread, 
                  color: '#ef4444',
                  icon: <NotificationsActive />,
                  trend: stats.unread > 0 ? `${stats.unread} nuevas` : 'Al día'
                },
                { 
                  label: 'Leídas', 
                  value: stats.read, 
                  color: '#10b981',
                  icon: <CheckCircle />,
                  trend: '+8%'
                },
                { 
                  label: 'Archivadas', 
                  value: stats.archived, 
                  color: '#f59e0b',
                  icon: <Archive />,
                  trend: 'Estable'
                },
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
                      p: 4,
                      border: '1px solid #f1f5f9',
                      borderRadius: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: alpha(stat.color, 0.3),
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 40px ${alpha(stat.color, 0.15)}`,
                      }
                    }}
                  >
                    {/* Background gradient */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 100,
                        height: 100,
                        background: `radial-gradient(circle, ${alpha(stat.color, 0.1)} 0%, transparent 70%)`,
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: alpha(stat.color, 0.1),
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 900,
                            color: stat.color,
                            lineHeight: 1,
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#10b981',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            justifyContent: 'flex-end',
                          }}
                        >
                          <TrendingUp sx={{ fontSize: 12 }} />
                          {stat.trend}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography
                      variant="body2"
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
                  backdropFilter: 'blur(10px)',
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
                      disabled={actionLoading}
                      sx={{ 
                        color: '#10b981',
                        '&:hover': { bgcolor: alpha('#10b981', 0.1) }
                      }}
                    >
                      Marcar leídas
                    </Button>
                    <Button
                      onClick={() => handleBulkAction('archive')}
                      startIcon={<Archive />}
                      size="small"
                      disabled={actionLoading}
                      sx={{ 
                        color: '#f59e0b',
                        '&:hover': { bgcolor: alpha('#f59e0b', 0.1) }
                      }}
                    >
                      Archivar
                    </Button>
                    <Button
                      onClick={() => handleBulkAction('delete')}
                      startIcon={<Delete />}
                      size="small"
                      disabled={actionLoading}
                      sx={{ 
                        color: '#ef4444',
                        '&:hover': { bgcolor: alpha('#ef4444', 0.1) }
                      }}
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
                  checked={selectedNotifications.length === notifications.length && notifications.length > 0}
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
                disabled={actionLoading}
                sx={{
                  color: '#6366f1',
                  '&:hover': {
                    bgcolor: alpha('#6366f1', 0.1),
                  }
                }}
              >
                Marcar todas como leídas ({stats.unread})
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              {notifications.length} de {stats.total} notificaciones
            </Typography>
            
            <Tooltip title="Configuración">
              <IconButton
                size="small"
                sx={{
                  color: '#64748b',
                  '&:hover': {
                    bgcolor: alpha('#6366f1', 0.1),
                    color: '#6366f1',
                  }
                }}
              >
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
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

      {/* Floating Action Button */}
      <Zoom in={!createDialogOpen}>
        <Fab
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
            zIndex: 1000,
          }}
        >
          <Add />
        </Fab>
      </Zoom>

      {/* Real-time Notifications */}
      <RealTimeNotifications
        notifications={allNotifications.filter(n => n.status === 'unread')}
        onNotificationClick={(notification) => {
          markAsRead(notification.id);
          if (notification.actionUrl) {
            handleAction(notification.actionUrl);
          }
        }}
        onNotificationDismiss={(id) => {
          markAsRead(id);
        }}
        maxVisible={3}
        position="top-right"
      />
    </>
  );
};