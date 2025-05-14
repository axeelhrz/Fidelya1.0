import React, { useState, useEffect } from 'react';
import { 
  Badge, 
  IconButton, 
  Tooltip, 
  Menu, 
  MenuItem, 
  Typography, 
  Box, 
  Avatar, 
  useTheme, 
  alpha,
  Button,
} from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useContacts } from '@/hooks/use-contacts';

// Iconos
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';

// Estilos personalizados
const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 16,
    boxShadow: theme.shadows[4],
    backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 0.95),
    backdropFilter: 'blur(10px)',
    width: 320,
    maxHeight: 400
  }
}));

const NotificationItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: 8,
  margin: theme.spacing(0.5, 1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1)
  }
}));

const EmptyNotification = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary
}));
interface UnreadContact {
  uid: string;
  displayName: string;
  photoURL?: string | null;
  lastMessageTime?: Timestamp;
  createdAt?: Timestamp;
  lastMessage?: string;
  unreadCount?: number;
  type: 'message' | 'request';
}

interface ChatNotificationsProps {
  totalUnread: number;
}

const ChatNotifications: React.FC<ChatNotificationsProps> = ({ totalUnread }) => {
  const theme = useTheme();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { acceptedContacts, pendingRequests } = useContacts();
  const [unreadContacts, setUnreadContacts] = useState<UnreadContact[]>([]);
  // Preparar contactos con mensajes no leídos
  useEffect(() => {
    const contacts = acceptedContacts
      .filter(contact => contact.unreadCount > 0)
      .sort((a, b) => {
        if (!a.lastMessageTime || !b.lastMessageTime) return 0;
        return b.lastMessageTime.toMillis() - a.lastMessageTime.toMillis();
      })
      .map(contact => ({
        uid: contact.uid,
        displayName: contact.displayName,
        photoURL: contact.photoURL,
        lastMessageTime: contact.lastMessageTime || undefined,
        createdAt: contact.createdAt,
        lastMessage: contact.lastMessage || undefined,
        unreadCount: contact.unreadCount,
        type: 'message' as const
      }));
    
    const requests = pendingRequests.map(request => ({
      uid: request.uid,
      displayName: request.displayName,
      photoURL: request.photoURL,
      createdAt: request.createdAt,
      type: 'request' as const
    }));
    
    setUnreadContacts([...requests, ...contacts]);
  }, [acceptedContacts, pendingRequests]);
  
  // Abrir menú de notificaciones
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Cerrar menú de notificaciones
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  // Manejar clic en notificación
  const handleNotificationClick = (contactId: string, type: string) => {
    handleCloseMenu();
    
    if (type === 'message') {
      router.push(`/dashboard/chat/${contactId}`);
    } else if (type === 'request') {
      router.push('/dashboard/contactos/solicitudes');
    }
  };
  
  // Formatear fecha
  const formatNotificationDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) {
      return 'Ahora mismo';
    } else if (diffMins < 60) {
      return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    } else {
      return format(date, 'd MMM', { locale: es });
    }
  };
  
  return (
    <>
      <Tooltip title="Notificaciones">
        <IconButton
          color="inherit"
          onClick={handleOpenMenu}
          sx={{ 
            position: 'relative',
            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
          }}
        >
          <Badge 
            badgeContent={totalUnread + pendingRequests.length} 
            color="error"
            sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Notificaciones
          </Typography>
        </Box>
        
        {unreadContacts.length > 0 ? (
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            <AnimatePresence>
              {unreadContacts.map((contact) => (
                <motion.div
                  key={contact.uid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <NotificationItem onClick={() => handleNotificationClick(contact.uid, contact.type)}>
                    <Box sx={{ display: 'flex', width: '100%' }}>
                      <Avatar 
                        src={contact.photoURL || undefined} 
                        alt={contact.displayName}
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          mr: 1.5,
                          bgcolor: contact.type === 'request' ? theme.palette.warning.main : theme.palette.primary.main
                        }}
                      >
                        {contact.displayName.charAt(0).toUpperCase()}
                      </Avatar>
                      
                      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="body1" fontWeight={500} noWrap>
                            {contact.displayName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatNotificationDate(contact.lastMessageTime || contact.createdAt)}
                          </Typography>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {contact.type === 'request' ? (
                            'Solicitud de contacto pendiente'
                          ) : (
                            <>
                              <Badge 
                                badgeContent={contact.unreadCount} 
                                color="error"
                                sx={{ 
                                  mr: 1,
                                  '& .MuiBadge-badge': { 
                                    fontSize: '0.6rem',
                                    minWidth: '16px',
                                    height: '16px'
                                  }
                                }}
                              />
                              {contact.lastMessage || 'Nuevo mensaje'}
                            </>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </NotificationItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        ) : (
          <EmptyNotification>
            <Typography variant="body1" sx={{ mb: 1 }}>
              No tienes notificaciones
            </Typography>
            <Typography variant="body2">
              Las notificaciones aparecerán aquí
            </Typography>
          </EmptyNotification>
        )}
        
        {unreadContacts.length > 0 && (
          <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<MarkChatReadIcon />}
              onClick={handleCloseMenu}
              sx={{ borderRadius: 8 }}
            >
              Marcar todo como leído
            </Button>
          </Box>
        )}
      </StyledMenu>
    </>
  );
};

export default ChatNotifications;