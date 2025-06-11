import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
  useTheme,
  alpha,
  Avatar,
  Stack,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  Checkbox,
  Collapse,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  Inventory as StockIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Info as InfoIcon,
  MarkEmailRead as MarkReadIcon,
  Close as CloseIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Schedule as ScheduleIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as VisibilityIcon,
  Reply as ReplyIcon,
  Forward as ForwardIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationCard = ({ 
  notificacion, 
  onMarkAsRead, 
  onDismiss,
  onArchive,
  onDelete,
  onStar,
  compact = false,
  selected = false,
  onSelect,
  showActions = true,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [starred, setStarred] = useState(notificacion.destacada || false);

  const getNotificationConfig = (tipo, prioridad) => {
    const configs = {
      stock: {
        icon: StockIcon,
        color: theme.palette.warning.main,
        bgColor: alpha(theme.palette.warning.main, 0.1),
        borderColor: theme.palette.warning.main,
        label: 'Inventario',
      },
      pago: {
        icon: PaymentIcon,
        color: theme.palette.error.main,
        bgColor: alpha(theme.palette.error.main, 0.1),
        borderColor: theme.palette.error.main,
        label: 'Pago',
      },
      cobro: {
        icon: ReceiptIcon,
        color: theme.palette.info.main,
        bgColor: alpha(theme.palette.info.main, 0.1),
        borderColor: theme.palette.info.main,
        label: 'Cobro',
      },
      sistema: {
        icon: NotificationsIcon,
        color: theme.palette.primary.main,
        bgColor: alpha(theme.palette.primary.main, 0.1),
        borderColor: theme.palette.primary.main,
        label: 'Sistema',
      },
      default: {
        icon: InfoIcon,
        color: theme.palette.primary.main,
        bgColor: alpha(theme.palette.primary.main, 0.1),
        borderColor: theme.palette.primary.main,
        label: 'General',
      }
    };

    const config = configs[tipo] || configs.default;
    
    // Ajustar color según prioridad
    if (prioridad === 'alta') {
      config.color = theme.palette.error.main;
      config.borderColor = theme.palette.error.main;
    } else if (prioridad === 'media') {
      config.color = theme.palette.warning.main;
      config.borderColor = theme.palette.warning.main;
    }

    return config;
  };

  const getPriorityIcon = (prioridad) => {
    switch (prioridad) {
      case 'alta':
        return <ErrorIcon fontSize="small" />;
      case 'media':
        return <WarningIcon fontSize="small" />;
      case 'baja':
        return <CheckCircleIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case 'alta':
        return theme.palette.error.main;
      case 'media':
        return theme.palette.warning.main;
      case 'baja':
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== ahora.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleStarToggle = (e) => {
    e.stopPropagation();
    setStarred(!starred);
    if (onStar) {
      onStar(notificacion.id, !starred);
    }
  };

  const handleMenuAction = (action) => {
    setMenuAnchor(null);
    
    switch (action) {
      case 'mark_read':
        if (onMarkAsRead) onMarkAsRead(notificacion.id);
        break;
      case 'archive':
        if (onArchive) onArchive(notificacion.id);
        break;
      case 'delete':
        if (onDelete) onDelete(notificacion.id);
        break;
      case 'dismiss':
        if (onDismiss) onDismiss(notificacion.id);
        break;
    }
  };

  const config = getNotificationConfig(notificacion.tipo, notificacion.prioridad);
  const IconComponent = config.icon;
  const isUnread = !notificacion.leida;
  const isHighPriority = notificacion.prioridad === 'alta';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card
        sx={{
          borderRadius: 4,
          border: `2px solid ${isUnread ? config.borderColor : 'transparent'}`,
          bgcolor: isUnread ? config.bgColor : 'background.paper',
          boxShadow: isUnread ? 4 : 1,
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          ...(selected && {
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            border: `2px solid ${theme.palette.primary.main}`,
          }),
          ...(isHighPriority && {
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              bgcolor: theme.palette.error.main,
              borderRadius: '16px 16px 0 0',
            }
          })
        }}
      >
        {/* Indicador de prioridad alta */}
        {isHighPriority && (
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              right: 16,
              bgcolor: theme.palette.error.main,
              color: 'white',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)', opacity: 1 },
                '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                '100%': { transform: 'scale(1)', opacity: 1 },
              },
            }}
          >
            <FlagIcon fontSize="small" />
          </Box>
        )}

        <CardContent sx={{ p: compact ? 2 : 3, '&:last-child': { pb: compact ? 2 : 3 } }}>
          <Box display="flex" alignItems="flex-start" gap={2}>
            {/* Checkbox de selección */}
            {showActions && (
              <Checkbox
                checked={selected}
                onChange={(e) => onSelect && onSelect(e.target.checked)}
                size="small"
                sx={{ mt: 0.5 }}
              />
            )}

            {/* Avatar con icono */}
            <Avatar
              sx={{
                bgcolor: alpha(config.color, 0.2),
                color: config.color,
                width: compact ? 40 : 56,
                height: compact ? 40 : 56,
                border: `2px solid ${alpha(config.color, 0.3)}`,
              }}
            >
              <IconComponent fontSize={compact ? 'small' : 'medium'} />
            </Avatar>

            {/* Contenido principal */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Header */}
              <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
                <Box sx={{ flex: 1, mr: 1 }}>
                  <Typography
                    variant={compact ? "subtitle2" : "h6"}
                    fontWeight={isUnread ? 700 : 500}
                    color={isUnread ? config.color : 'text.primary'}
                    sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.3,
                    }}
                  >
                    {notificacion.titulo}
                  </Typography>
                  
                  {/* Chips de categoría y prioridad */}
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip
                      label={config.label}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        borderColor: config.color,
                        color: config.color,
                        fontSize: '0.7rem',
                        height: 20,
                      }}
                    />
                    <Chip
                      icon={getPriorityIcon(notificacion.prioridad)}
                      label={notificacion.prioridad || 'normal'}
                      size="small"
                      variant="filled"
                      sx={{ 
                        bgcolor: alpha(getPriorityColor(notificacion.prioridad), 0.1),
                        color: getPriorityColor(notificacion.prioridad),
                        fontSize: '0.7rem',
                        height: 20,
                        textTransform: 'capitalize',
                      }}
                    />
                  </Stack>
                </Box>

                {/* Acciones del header */}
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {/* Indicador de no leída */}
                  {isUnread && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: config.color,
                        animation: 'pulse 2s infinite',
                      }}
                    />
                  )}

                  {/* Estrella */}
                  <Tooltip title={starred ? 'Quitar de destacados' : 'Marcar como destacado'}>
                    <IconButton
                      size="small"
                      onClick={handleStarToggle}
                      sx={{ color: starred ? 'warning.main' : 'text.secondary' }}
                    >
                      {starred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>

                  {/* Menú de acciones */}
                  {showActions && (
                    <IconButton
                      size="small"
                      onClick={(e) => setMenuAnchor(e.currentTarget)}
                      sx={{ color: 'text.secondary' }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              </Box>

              {/* Mensaje */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: expanded ? 'none' : (compact ? 2 : 3),
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.5,
                }}
              >
                {notificacion.mensaje}
              </Typography>

              {/* Botón expandir/contraer */}
              {notificacion.mensaje && notificacion.mensaje.length > 150 && (
                <Button
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                  endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  sx={{ mb: 2, p: 0, minWidth: 'auto' }}
                >
                  {expanded ? 'Ver menos' : 'Ver más'}
                </Button>
              )}

              {/* Contenido expandido */}
              <Collapse in={expanded}>
                <Box sx={{ mb: 2, p: 2, bgcolor: alpha(config.color, 0.05), borderRadius: 2 }}>
                  {notificacion.detalles && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Detalles:</strong> {notificacion.detalles}
                    </Typography>
                  )}
                  {notificacion.accion_requerida && (
                    <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                      <strong>Acción requerida:</strong> {notificacion.accion_requerida}
                    </Typography>
                  )}
                </Box>
              </Collapse>

              {/* Footer */}
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  {formatearFecha(notificacion.creada)}
                </Typography>

                {/* Acciones rápidas */}
                {showActions && (
                  <Stack direction="row" spacing={0.5}>
                    {isUnread && (
                      <Tooltip title="Marcar como leída">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onMarkAsRead) onMarkAsRead(notificacion.id);
                          }}
                          sx={{ 
                            color: config.color,
                            '&:hover': { bgcolor: alpha(config.color, 0.1) }
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                )}
              </Box>

              {/* Barra de progreso para acciones pendientes */}
              {notificacion.progreso !== undefined && (
                <Box sx={{ mt: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="caption" color="text.secondary">
                      Progreso
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notificacion.progreso}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={notificacion.progreso}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: alpha(config.color, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: config.color,
                        borderRadius: 3,
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>

        {/* Menú contextual */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          PaperProps={{
            sx: { borderRadius: 2, minWidth: 180 }
          }}
        >
          {isUnread && (
            <MenuItem onClick={() => handleMenuAction('mark_read')}>
              <MarkReadIcon sx={{ mr: 1, fontSize: 18 }} />
              Marcar como leída
            </MenuItem>
          )}
          <MenuItem onClick={() => handleMenuAction('archive')}>
            <ArchiveIcon sx={{ mr: 1, fontSize: 18 }} />
            Archivar
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => handleMenuAction('delete')} 
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
            Eliminar
          </MenuItem>
        </Menu>
      </Card>
    </motion.div>
  );
};

export default NotificationCard;