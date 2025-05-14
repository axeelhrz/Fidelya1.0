import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  IconButton, 
  Badge, 
  Tooltip, 
  useTheme, 
  alpha,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Contact } from '@/types/contact';
import { useContacts } from '@/hooks/use-contacts';
import ContactProfileDialog from './contact-profile-dialog';

// Iconos
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// Estilos personalizados
const StyledCard = styled(motion(Card))(({ theme }) => ({
  borderRadius: 16,
  overflow: 'visible',
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
    backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 1)
  }
}));

const OnlineBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

interface ContactCardProps {
  contact: Contact;
  isPending?: boolean;
  isBlocked?: boolean;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, isPending = false, isBlocked = false }) => {
  const theme = useTheme();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const { acceptRequest, rejectRequest, blockContactById, unblockContactById, toggleFavorite } = useContacts();
  
  // Formatear fecha del último mensaje
  const formatMessageTime = (timestamp: { toDate: () => Date } | null | undefined) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    const now = new Date();
    
    // Si es hoy, mostrar solo la hora
    if (date.toDateString() === now.toDateString()) {
      return format(date, 'HH:mm');
    }
    
    // Si es esta semana, mostrar el día
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return format(date, 'EEEE', { locale: es });
    }
    
    // Si es este año, mostrar día y mes
    if (date.getFullYear() === now.getFullYear()) {
      return format(date, 'd MMM', { locale: es });
    }
    
    // Si es otro año, mostrar fecha completa
    return format(date, 'd MMM yyyy', { locale: es });
  };
  
  // Manejar clic en chat
  const handleChatClick = () => {
    router.push(`/dashboard/chat/${contact.uid}`);
  };
  
  // Manejar clic en perfil
  const handleProfileClick = () => {
    setProfileOpen(true);
  };
  
  // Manejar clic en bloquear/desbloquear
  const handleBlockClick = async () => {
    if (isBlocked) {
      await unblockContactById(contact.uid);
    } else {
      await blockContactById(contact.uid);
    }
  };
  
  // Manejar clic en aceptar solicitud
  const handleAcceptRequest = async () => {
    await acceptRequest(contact.uid);
  };
  
  // Manejar clic en rechazar solicitud
  const handleRejectRequest = async () => {
    await rejectRequest(contact.uid);
  };
  
  // Manejar clic en favorito
  const handleFavoriteClick = async () => {
    await toggleFavorite(contact.uid, !contact.isFavorite);
  };
  
  return (
    <>
      <StyledCard
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 500 }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Avatar con indicador online */}
            <Box sx={{ mr: 2 }}>
              <OnlineBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                invisible={isPending || isBlocked}
              >
                <Avatar 
                  src={contact.photoURL || undefined} 
                  alt={contact.displayName}
                  sx={{ 
                    width: 50, 
                    height: 50,
                    bgcolor: theme.palette.primary.main,
                    boxShadow: theme.shadows[2]
                  }}
                >
                  {contact.displayName.charAt(0).toUpperCase()}
                </Avatar>
              </OnlineBadge>
            </Box>
            
            {/* Información del contacto */}
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {contact.displayName}
                </Typography>
                
                {contact.isFavorite && (
                  <StarIcon 
                    fontSize="small" 
                    color="warning" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '70%'
                  }}
                >
                  {isPending ? (
                    'Solicitud pendiente'
                  ) : isBlocked ? (
                    'Contacto bloqueado'
                  ) : contact.lastMessage ? (
                    contact.lastMessage
                  ) : (
                    'Sin mensajes aún'
                  )}
                </Typography>
                
                {contact.lastMessageTime && !isPending && !isBlocked && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    · {formatMessageTime(contact.lastMessageTime)}
                  </Typography>
                )}
              </Box>
            </Box>
            
            {/* Acciones */}
            <Stack direction="row" spacing={1}>
              {isPending ? (
                <>
                  <Tooltip title="Aceptar">
                    <IconButton 
                      size="small" 
                      color="success"
                      onClick={handleAcceptRequest}
                      sx={{ 
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) }
                      }}
                    >
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Rechazar">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={handleRejectRequest}
                      sx={{ 
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                      }}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  {!isBlocked && (
                    <Tooltip title="Chat">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={handleChatClick}
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                        }}
                      >
                        <Badge 
                          badgeContent={contact.unreadCount} 
                          color="error"
                          sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}
                        >
                          <ChatIcon fontSize="small" />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  <Tooltip title="Ver perfil">
                    <IconButton 
                      size="small" 
                      color="info"
                      onClick={handleProfileClick}
                      sx={{ 
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) }
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  {!isBlocked ? (
                    <>
                      <Tooltip title={contact.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}>
                        <IconButton 
                          size="small" 
                          color="warning"
                          onClick={handleFavoriteClick}
                          sx={{ 
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.2) }
                          }}
                        >
                          {contact.isFavorite ? (
                            <StarIcon fontSize="small" />
                          ) : (
                            <StarBorderIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Bloquear">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={handleBlockClick}
                          sx={{ 
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                          }}
                        >
                          <BlockIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <Tooltip title="Desbloquear">
                      <IconButton 
                        size="small" 
                        color="success"
                        onClick={handleBlockClick}
                        sx={{ 
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) }
                        }}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
            </Stack>
          </Box>
        </CardContent>
      </StyledCard>
      
      {/* Diálogo de perfil */}
      <ContactProfileDialog 
        open={profileOpen} 
        onClose={() => setProfileOpen(false)} 
        contact={contact}
        isBlocked={isBlocked}
      />
    </>
  );
};

export default ContactCard;