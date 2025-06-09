import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Inventory as StockIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Info as InfoIcon,
  MarkEmailRead as MarkReadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const NotificationCard = ({ 
  notificacion, 
  onMarkAsRead, 
  onDismiss, 
  compact = false 
}) => {
  const theme = useTheme();

  const getNotificationIcon = (tipo) => {
    const iconProps = { fontSize: compact ? 'small' : 'medium' };
    switch (tipo) {
      case 'stock':
        return <StockIcon {...iconProps} />;
      case 'pago':
        return <PaymentIcon {...iconProps} />;
      case 'cobro':
        return <ReceiptIcon {...iconProps} />;
      default:
        return <InfoIcon {...iconProps} />;
    }
  };

  const getNotificationColor = (tipo) => {
    switch (tipo) {
      case 'stock':
        return theme.palette.warning.main;
      case 'pago':
        return theme.palette.error.main;
      case 'cobro':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const getNotificationBgColor = (tipo) => {
    switch (tipo) {
      case 'stock':
        return alpha(theme.palette.warning.main, 0.1);
      case 'pago':
        return alpha(theme.palette.error.main, 0.1);
      case 'cobro':
        return alpha(theme.palette.info.main, 0.1);
      default:
        return alpha(theme.palette.primary.main, 0.1);
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

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString();
  };

  const color = getNotificationColor(notificacion.tipo);
  const bgColor = getNotificationBgColor(notificacion.tipo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          mb: compact ? 1 : 2,
          border: `2px solid ${notificacion.leida ? 'transparent' : color}`,
          bgcolor: notificacion.leida ? 'background.paper' : bgColor,
          boxShadow: notificacion.leida ? 1 : 3,
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <CardContent sx={{ p: compact ? 2 : 3, '&:last-child': { pb: compact ? 2 : 3 } }}>
          <Box display="flex" alignItems="flex-start" gap={2}>
            {/* Icono */}
            <Box
              sx={{
                p: compact ? 1 : 1.5,
                borderRadius: '50%',
                bgcolor: alpha(color, 0.2),
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getNotificationIcon(notificacion.tipo)}
            </Box>

            {/* Contenido */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
                <Typography
                  variant={compact ? "subtitle2" : "h6"}
                  fontWeight={notificacion.leida ? 500 : 700}
                  color={notificacion.leida ? 'text.primary' : color}
                  sx={{ flex: 1, mr: 1 }}
                >
                  {notificacion.titulo}
                </Typography>

                {/* Badge de no leída */}
                {!notificacion.leida && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: color,
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                        '100%': { opacity: 1 },
                      },
                    }}
                  />
                )}
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: compact ? 2 : 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {notificacion.mensaje}
              </Typography>

              {/* Footer */}
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    label={notificacion.tipo}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      textTransform: 'capitalize',
                      borderColor: color,
                      color: color,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formatearFecha(notificacion.creada)}
                  </Typography>
                </Box>

                {/* Acciones */}
                <Box display="flex" alignItems="center" gap={0.5}>
                  {!notificacion.leida && onMarkAsRead && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notificacion.id);
                      }}
                      sx={{ color: color }}
                    >
                      <MarkReadIcon fontSize="small" />
                    </IconButton>
                  )}
                  
                  {onDismiss && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDismiss(notificacion.id);
                      }}
                      sx={{ color: 'text.secondary' }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationCard;