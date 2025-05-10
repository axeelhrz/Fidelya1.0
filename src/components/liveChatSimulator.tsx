import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  useTheme, 
  Paper,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import ForumIcon from '@mui/icons-material/Forum';
import SendIcon from '@mui/icons-material/Send';
import { FieldValue, Timestamp } from 'firebase/firestore';
import { 
  initChatSession, 
  sendUserMessage, 
  subscribeToChatSession,
  ChatMessage as ChatMessageType
} from '@/lib/chat';
import { useAuth } from '@/hooks/use-auth';

// Componente de chat en vivo
const LiveChatSimulator = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Inicializar la sesión de chat
  useEffect(() => {
    const initChat = async () => {
      const userData = user ? {
        email: user.email || undefined,
        // Use displayName if that's available, or remove this line if not needed
        // name: user.displayName || undefined,
        userId: user.uid
      } : undefined;
      
      const id = await initChatSession(userData);
      setSessionId(id);
      
      // Suscribirse a los cambios en la sesión de chat
      const unsubscribe = subscribeToChatSession(id, (session) => {
        if (session.messages) {
          setMessages(session.messages);
        }
      });
      
      return () => unsubscribe();
    };
    
    initChat();
  }, [user]);
  
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;
    
    // Añadir mensaje del usuario localmente para UI inmediata
    setInputValue("");
    setIsTyping(true);
    
    // Enviar mensaje a Firebase
    const userData = user ? {
      email: user.email || undefined,
      // Using email as name or you can customize this based on available user properties
      name: user.email?.split('@')[0] || undefined,
      userId: user.uid
    } : undefined;
    
    await sendUserMessage(sessionId, inputValue, userData);
    setIsTyping(false);
  };
  
  const formatTime = (timestamp: { toDate?: () => Date } | Date | number | string | FieldValue | Timestamp | null | undefined) => {
    if (!timestamp) return '';
    
    if (timestamp instanceof FieldValue) {
      return ''; // Return empty string for FieldValue
    }
    
    const date = typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp && typeof timestamp.toDate === 'function'
      ? timestamp.toDate()
      : new Date(timestamp as Date | number | string);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '16px',
      background: isDark 
        ? 'rgba(15, 23, 42, 0.6)' 
        : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
    }}>
      <CardContent sx={{ p: 2, borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}` }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ForumIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Chat en vivo
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <Chip 
              label="En línea" 
              size="small" 
              color="success" 
              sx={{ height: 24 }} 
            />
          </Box>
        </Stack>
      </CardContent>
      <Box sx={{ 
        p: 2, 
        flexGrow: 1, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        maxHeight: 300,
      }}>
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: '16px',
                borderTopLeftRadius: message.sender === 'user' ? '16px' : 0,
                borderTopRightRadius: message.sender === 'user' ? 0 : '16px',
                background: message.sender === 'user' 
                  ? (isDark ? 'rgba(37, 99, 235, 0.8)' : 'rgba(59, 130, 246, 0.8)')
                  : message.sender === 'admin'
                    ? (isDark ? 'rgba(220, 38, 38, 0.8)' : 'rgba(239, 68, 68, 0.8)')
                    : (isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.8)'),
                color: message.sender === 'user' || message.sender === 'admin'
                  ? 'white' 
                  : 'inherit',
              }}
            >
              {message.sender === 'admin' && (
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>
                  Agente de Soporte
                </Typography>
              )}
              <Typography variant="body2">{message.text}</Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  textAlign: message.sender === 'user' ? 'right' : 'left',
                  mt: 0.5,
                  opacity: 0.7,
                }}
              >
                {formatTime(message.timestamp)}
              </Typography>
            </Paper>
          </Box>
        ))}
        {isTyping && (
          <Box
            sx={{
              alignSelf: 'flex-start',
              maxWidth: '80%',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: '16px',
                borderTopLeftRadius: 0,
                background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.8)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: isDark ? '#60A5FA' : '#3B82F6' }}
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: isDark ? '#60A5FA' : '#3B82F6' }}
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: isDark ? '#60A5FA' : '#3B82F6' }}
                />
              </Box>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ p: 2, borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}` }}>
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            size="small"
            placeholder="Escribe tu mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={inputValue.trim() === ""}
            sx={{
              minWidth: 'auto',
              borderRadius: '50%',
              width: 40,
              height: 40,
              p: 0,
            }}
          >
            <SendIcon fontSize="small" />
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default LiveChatSimulator;