import React, { useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Paper, 
  useTheme, 
  alpha,
  CircularProgress,
  Stack
} from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Message } from '@/types/message';
import { useAuth } from '@/hooks/use-auth';

// Estilos personalizados
const MessageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(1.5),
  alignItems: 'flex-end'
}));

const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isOwn' && prop !== 'messageType'
})<{ isOwn: boolean; messageType: string }>(({ theme, isOwn, messageType }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: 16,
  maxWidth: '70%',
  wordBreak: 'break-word',
  boxShadow: theme.shadows[1],
  backgroundColor: isOwn 
    ? alpha(theme.palette.primary.main, 0.1)
    : alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.6 : 0.9),
  borderTopRightRadius: isOwn ? 4 : 16,
  borderTopLeftRadius: isOwn ? 16 : 4,
  border: `1px solid ${alpha(
    isOwn ? theme.palette.primary.main : theme.palette.divider, 
    theme.palette.mode === 'dark' ? 0.1 : 0.1
  )}`,
  ...(messageType === 'deleted' && {
    backgroundColor: alpha(theme.palette.background.default, 0.5),
    fontStyle: 'italic'
  }),
  ...(messageType === 'image' && {
    padding: theme.spacing(1),
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    overflow: 'hidden'
  }),
  ...(messageType === 'pdf' && {
    padding: theme.spacing(1.5),
    backgroundColor: alpha(theme.palette.info.main, 0.05),
    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
  }),
  ...(messageType === 'file' && {
    padding: theme.spacing(1.5),
    backgroundColor: alpha(theme.palette.warning.main, 0.05),
    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
  })
}));

const DateDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(3, 0),
  '&::before, &::after': {
    content: '""',
    flex: 1,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
  },
  '&::before': {
    marginRight: theme.spacing(2)
  },
  '&::after': {
    marginLeft: theme.spacing(2)
  }
}));

const DateChip = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 2),
  borderRadius: 16,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(10px)',
  boxShadow: theme.shadows[1],
  fontSize: '0.75rem',
  color: theme.palette.text.secondary
}));

const ImagePreview = styled('img')({
  maxWidth: '100%',
  maxHeight: 300,
  borderRadius: 12,
  display: 'block'
});

const FilePreview = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  borderRadius: 8,
  '& .icon': {
    marginRight: theme.spacing(1.5),
    color: theme.palette.primary.main
  }
}));

interface ChatMessageListProps {
  messages: Message[];
  contactName: string;
  contactAvatar: string | null;
  loading: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ 
  messages, 
  contactName, 
  contactAvatar,
  loading
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Desplazarse al final de los mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  // Formatear fecha
  const formatMessageDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return '';
    return format(timestamp.toDate(), 'HH:mm', { locale: es });
  };
  
  // Formatear fecha para divisor
  const formatDividerDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return '';
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return format(date, 'EEEE, d MMMM', { locale: es });
    }
  };
  
  // Verificar si se debe mostrar divisor de fecha
  const shouldShowDateDivider = (currentIndex: number) => {
    if (currentIndex === 0) return true;
    
    const currentDate = messages[currentIndex].createdAt.toDate().toDateString();
    const prevDate = messages[currentIndex - 1].createdAt.toDate().toDateString();
    
    return currentDate !== prevDate;
  };
  
  // Renderizar contenido del mensaje según tipo
  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case 'text':
        return <Typography variant="body2">{message.text}</Typography>;
      
      case 'image':
        return (
          <Box>
            <ImagePreview src={message.fileUrl} alt="Imagen" loading="lazy" />
            {message.text && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {message.text}
              </Typography>
            )}
          </Box>
        );
      
      case 'pdf':
        return (
          <Box>
            <FilePreview>
              <Box className="icon">📄</Box>
              <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Typography variant="body2" noWrap fontWeight={500}>
                  {message.fileName || 'Documento PDF'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {message.fileSize ? `${(message.fileSize / 1024 / 1024).toFixed(2)} MB` : 'PDF'}
                </Typography>
              </Box>
            </FilePreview>
            {message.text && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {message.text}
              </Typography>
            )}
          </Box>
        );
      
      case 'file':
        return (
          <Box>
            <FilePreview>
              <Box className="icon">📎</Box>
              <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Typography variant="body2" noWrap fontWeight={500}>
                  {message.fileName || 'Archivo adjunto'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {message.fileSize ? `${(message.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Archivo'}
                </Typography>
              </Box>
            </FilePreview>
            {message.text && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {message.text}
              </Typography>
            )}
          </Box>
        );
      
      case 'deleted':
        return (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            Este mensaje fue eliminado
          </Typography>
        );
      
      default:
        return <Typography variant="body2">{message.text}</Typography>;
    }
  };
  
  return (
    <Box sx={{ 
      flexGrow: 1, 
      overflowY: 'auto', 
      p: 2,
      bgcolor: alpha(theme.palette.background.default, theme.palette.mode === 'dark' ? 0.4 : 0.05)
    }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress size={40} />
        </Box>
      ) : messages.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          opacity: 0.7
        }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            No hay mensajes aún
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Envía un mensaje para comenzar la conversación
          </Typography>
        </Box>
      ) : (
        <Stack spacing={0.5}>
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <React.Fragment key={message.id}>
                {shouldShowDateDivider(index) && (
                  <DateDivider>
                    <DateChip>
                      {formatDividerDate(message.createdAt)}
                    </DateChip>
                  </DateDivider>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageContainer sx={{ 
                    justifyContent: message.senderId === user?.uid ? 'flex-end' : 'flex-start',
                    ml: message.senderId === user?.uid ? 2 : 0,
                    mr: message.senderId === user?.uid ? 0 : 2
                  }}>
                    {message.senderId !== user?.uid && (
                      <Avatar 
                        src={contactAvatar || undefined} 
                        alt={contactName}
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          mr: 1,
                          bgcolor: theme.palette.primary.main
                        }}
                      >
                        {contactName.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                    
                    <Box sx={{ maxWidth: '70%' }}>
                      <MessageBubble 
                        isOwn={message.senderId === user?.uid} 
                        messageType={message.type}
                        elevation={0}
                      >
                        {renderMessageContent(message)}
                      </MessageBubble>
                      
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          display: 'block', 
                          mt: 0.5,
                          textAlign: message.senderId === user?.uid ? 'right' : 'left',
                          fontSize: '0.7rem'
                        }}
                      >
                        {formatMessageDate(message.createdAt)}
                        {message.senderId === user?.uid && (
                          <Box component="span" sx={{ ml: 0.5 }}>
                            {message.read ? '✓✓' : message.delivered ? '✓' : ''}
                          </Box>
                        )}
                      </Typography>
                    </Box>
                  </MessageContainer>
                </motion.div>
              </React.Fragment>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </Stack>
      )}
    </Box>
  );
};

export default ChatMessageList;