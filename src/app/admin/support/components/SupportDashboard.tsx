'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Chip,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import ForumIcon from '@mui/icons-material/Forum';
import { motion } from 'framer-motion';
import {
  subscribeToActiveChats,
  subscribeToChatSession,
  sendAdminMessage,
  markChatAsResolved,
  ChatSession
} from '@/lib/chat'; // Corregido: importar desde firebase/chat
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function SupportDashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [activeChats, setActiveChats] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadChats, setUnreadChats] = useState<Record<string, boolean>>({});
  
  // Suscribirse a los chats activos
  useEffect(() => {
    console.log('Suscribiéndose a chats activos...');
    const unsubscribe = subscribeToActiveChats((chats) => {
      console.log('Chats activos recibidos:', chats);
      setActiveChats(chats);
      
      // Marcar chats como no leídos si tienen needsHumanResponse
      const newUnreadChats: Record<string, boolean> = {};
      chats.forEach(chat => {
        if (chat.needsHumanResponse && !unreadChats[chat.id]) {
          newUnreadChats[chat.id] = true;
        }
      });
      
      if (Object.keys(newUnreadChats).length > 0) {
        setUnreadChats(prev => ({ ...prev, ...newUnreadChats }));
      }
    });
    
    return () => {
      console.log('Cancelando suscripción a chats activos');
      unsubscribe();
    };
  }, [unreadChats]);
  
  // Suscribirse al chat seleccionado
  useEffect(() => {
    if (!selectedChat) return;
    
    console.log('Suscribiéndose al chat:', selectedChat.id);
    const unsubscribe = subscribeToChatSession(selectedChat.id, (updatedChat) => {
      console.log('Chat actualizado:', updatedChat);
      setSelectedChat(updatedChat);
      
      // Marcar como leído cuando se selecciona
      if (unreadChats[updatedChat.id]) {
        setUnreadChats(prev => ({ ...prev, [updatedChat.id]: false }));
      }
    });
    
    return () => {
      console.log('Cancelando suscripción al chat:', selectedChat.id);
      unsubscribe();
    };
  }, [selectedChat, unreadChats]);
  
  const handleSendMessage = async () => {
    if (!selectedChat || !message.trim()) return;
    
    setIsLoading(true);
    try {
      console.log('Enviando mensaje:', message);
      await sendAdminMessage(selectedChat.id, message);
      setMessage('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResolveChat = async () => {
    if (!selectedChat) return;
    
    try {
      console.log('Marcando chat como resuelto:', selectedChat.id);
      await markChatAsResolved(selectedChat.id);
      setSelectedChat(null);
    } catch (error) {
      console.error('Error al marcar chat como resuelto:', error);
    }
  };
  
  type Timestamp = {
    toDate: () => Date;
  } | Date | string | number;
  
  const formatTimestamp = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return '';
    
    try {
      // Si es un objeto Timestamp de Firestore
      if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
        return format(timestamp.toDate(), 'dd MMM yyyy, HH:mm', { locale: es });
      }
      
      // Si es un objeto Date
      if (timestamp instanceof Date) {
        return format(timestamp, 'dd MMM yyyy, HH:mm', { locale: es });
      }
      
      // Si es un string o number
      if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        return format(new Date(timestamp), 'dd MMM yyyy, HH:mm', { locale: es });
      }
      
      // Fallback para cualquier otro caso
      return 'Fecha desconocida';
    } catch (error) {
      console.error('Error al formatear timestamp:', error, timestamp);
      return 'Fecha desconocida';
    }
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 700 }}>
        Panel de Soporte
      </Typography>
      
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ height: 'calc(100vh - 200px)' }}>
        {/* Lista de chats activos */}
        <Box sx={{ width: { xs: '100%', md: '350px' }, height: '100%' }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <ForumIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Conversaciones activas
                </Typography>
                <Chip 
                  label={activeChats.length} 
                  color="primary" 
                  size="small" 
                  sx={{ ml: 'auto' }} 
                />
              </Stack>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                {activeChats.length === 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    opacity: 0.7
                  }}>
                    <ForumIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary" align="center">
                      No hay conversaciones activas en este momento
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {activeChats.map((chat) => (
                      <ListItemButton
                        key={chat.id}
                        selected={selectedChat?.id === chat.id}
                        onClick={() => setSelectedChat(chat)}
                        sx={{
                          borderRadius: 1,
                          mb: 1,
                          bgcolor: selectedChat?.id === chat.id 
                            ? (isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)')
                            : 'transparent',
                          '&:hover': {
                            bgcolor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.05)'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            color="error"
                            variant="dot"
                            invisible={!unreadChats[chat.id]}
                          >
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <PersonIcon />
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {chat.name || chat.email || 'Usuario anónimo'}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ display: 'block' }}>
                              {chat.messages && chat.messages.length > 0 
                                ? chat.messages[chat.messages.length - 1].text.substring(0, 30) + '...'
                                : 'Sin mensajes'}
                            </Typography>
                          }
                        />
                        {chat.needsHumanResponse && (
                          <Chip 
                            label="Requiere atención" 
                            color="error" 
                            size="small" 
                            sx={{ ml: 1 }} 
                          />
                        )}
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        {/* Área de chat */}
        <Box sx={{ flexGrow: 1, height: '100%' }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              {selectedChat ? (
                <>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Chat con {selectedChat.name || selectedChat.email || 'Usuario anónimo'}
                    </Typography>
                    <Tooltip title="Marcar como resuelto">
                      <IconButton 
                        color="success" 
                        onClick={handleResolveChat}
                        size="small"
                        sx={{ ml: 'auto' }}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  
                  <Box sx={{ 
                    mb: 2, 
                    p: 1, 
                    borderRadius: 1, 
                    bgcolor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.5)' 
                  }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Email:
                        </Typography>
                        <Typography variant="body2">
                          {selectedChat.email || 'No proporcionado'}
                        </Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Inicio de conversación:
                        </Typography>
                        <Typography variant="body2">
                          {formatTimestamp(selectedChat.createdAt)}
                        </Typography>
                      </Box>
                      {selectedChat.userId && (
                        <>
                          <Divider orientation="vertical" flexItem />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Usuario registrado:
                            </Typography>
                            <Typography variant="body2">
                              Sí
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Stack>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  {/* Mensajes */}
                  <Box sx={{ 
                    flexGrow: 1, 
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    mb: 2,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(241, 245, 249, 0.5)'
                  }}>
                    {selectedChat.messages && selectedChat.messages.map((message, index) => (
                      <Box
                        key={index}
                        sx={{
                          alignSelf: message.sender === 'admin' ? 'flex-end' : 'flex-start',
                          maxWidth: '80%',
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            borderRadius: '16px',
                            borderTopLeftRadius: message.sender === 'admin' ? '16px' : 0,
                            borderTopRightRadius: message.sender === 'admin' ? 0 : '16px',
                            background: message.sender === 'admin' 
                              ? (isDark ? 'rgba(220, 38, 38, 0.8)' : 'rgba(239, 68, 68, 0.8)')
                              : message.sender === 'user'
                                ? (isDark ? 'rgba(37, 99, 235, 0.8)' : 'rgba(59, 130, 246, 0.8)')
                                : (isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.8)'),
                            color: message.sender === 'admin' || message.sender === 'user'
                              ? 'white' 
                              : 'inherit',
                          }}
                        >
                          <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>
                            {message.sender === 'admin' 
                              ? 'Agente de Soporte' 
                              : message.sender === 'user' 
                                ? (selectedChat.name || 'Usuario') 
                                : 'Bot Assuriva'}
                          </Typography>
                          <Typography variant="body2">{message.text}</Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block', 
                              textAlign: message.sender === 'admin' ? 'right' : 'left',
                              mt: 0.5,
                              opacity: 0.7,
                            }}
                          >
                            {formatTimestamp(message.timestamp)}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}
                  </Box>
                  
                  {/* Área de entrada de mensaje */}
                  <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Escribe tu respuesta..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      multiline
                      maxRows={3}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isLoading}
                      sx={{
                        minWidth: 'auto',
                        borderRadius: '12px',
                        px: 2,
                      }}
                    >
                      {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                    </Button>
                  </Stack>
                </>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%',
                }}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ForumIcon sx={{ fontSize: 100, color: 'primary.main', opacity: 0.5, mb: 2 }} />
                  </motion.div>
                  <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 1 }}>
                    Selecciona una conversación
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
                    Elige una conversación de la lista para ver los mensajes y responder al usuario.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Container>
  );
}