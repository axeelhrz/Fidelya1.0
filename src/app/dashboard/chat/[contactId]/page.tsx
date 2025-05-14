'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  useTheme,
  alpha,
  Avatar,
  Tooltip,
  Chip,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useContacts } from '@/hooks/use-contacts';
import { useMessages } from '@/hooks/use-messages';
import { Contact } from '@/types/contact';
import ChatMessageList from '@/components/dashboard/contacts/chat-message-list';
import ChatInput from '@/components/dashboard/contacts/chatInput';
import ContactProfileDialog from '@/components/dashboard/contacts/contact-profile-dialog';

// Iconos
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BlockIcon from '@mui/icons-material/Block';

const ChatPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const contactId = params?.contactId as string;
  
  const [contact, setContact] = useState<Contact | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { contacts } = useContacts();
  
  // Obtener mensajes - llamar al hook incondicionalmente
  const {
    messages = [],
    loading = false,
    isContactOnline = false,
    lastSeen = null,
    sendMessage = () => Promise.resolve({ success: false, message: 'Not implemented' }),
    sendFile = () => Promise.resolve({ success: false, message: 'Not implemented' })
  } = useMessages(contact?.chatId || '', contactId) ?? {};
  
  // Buscar contacto por ID
  useEffect(() => {
    if (!contactId) return;
    
    const foundContact = contacts.find(c => c.uid === contactId);
    if (foundContact) {
      setContact(foundContact);
    } else {
      // Si no se encuentra el contacto, redirigir a la página de contactos
      router.push('/dashboard/contactos');
    }
  }, [contactId, contacts, router]);
  
  // Si no hay contacto, mostrar cargando
  if (!contact) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="body1" color="text.secondary">
          Cargando chat...
        </Typography>
      </Box>
    );
  }
  
  // Verificar si el contacto está bloqueado
  const isBlocked = contact.status === 'blocked';
  
  // Volver a la página de contactos
  const handleBack = () => {
    router.push('/dashboard/contactos');
  };
  
  // Abrir perfil de contacto
  const handleOpenProfile = () => {
    setProfileOpen(true);
  };
  
  // Formatear última conexión
  const formatLastSeen = (date: Date | null) => {
    if (!date) return 'Desconocido';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) {
      return 'Ahora mismo';
    } else if (diffMins < 60) {
      return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffMins < 60 * 24) {
      const hours = Math.floor(diffMins / 60);
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
    }
  };
  
  return (
    <Box sx={{
      height: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: alpha(theme.palette.background.default, 0.5)
    }}>
      {/* Cabecera del chat */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 0.95),
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <IconButton onClick={handleBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        
        <Avatar
          src={contact.photoURL || undefined}
          alt={contact.displayName}
          sx={{
            width: 40,
            height: 40,
            mr: 2,
            bgcolor: theme.palette.primary.main
          }}
        >
          {contact.displayName.charAt(0).toUpperCase()}
        </Avatar>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {contact.displayName}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isBlocked ? (
              <Chip
                label="Bloqueado"
                size="small"
                color="error"
                variant="outlined"
                icon={<BlockIcon fontSize="small" />}
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            ) : isContactOnline ? (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#44b700',
                  mr: 1
                }}
              />
            ) : null}
            
            <Typography variant="caption" color="text.secondary">
              {isBlocked ? (
                'Este contacto está bloqueado'
              ) : isContactOnline ? (
                'En línea'
              ) : lastSeen ? (
                `Última vez ${formatLastSeen(lastSeen)}`
              ) : (
                'Desconectado'
              )}
            </Typography>
          </Box>
        </Box>
        
        <Tooltip title="Ver perfil">
          <IconButton onClick={handleOpenProfile}>
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Paper>
      
      {/* Lista de mensajes */}
      <ChatMessageList
        messages={messages}
        contactName={contact.displayName}
        contactAvatar={contact.photoURL}
        loading={loading}
      />
      
      {/* Input de chat */}
      {isBlocked ? (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            textAlign: 'center',
            bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 0.95),
            backdropFilter: 'blur(10px)',
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Typography variant="body2" color="error">
            No puedes enviar mensajes a este contacto porque está bloqueado
          </Typography>
        </Paper>
      ) : (
        <ChatInput
          onSendMessage={sendMessage}
          onSendFile={sendFile}
        />
      )}
      
      {/* Diálogo de perfil */}
      <ContactProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        contact={contact}
        isBlocked={isBlocked}
      />
    </Box>
  );
};

export default ChatPage;