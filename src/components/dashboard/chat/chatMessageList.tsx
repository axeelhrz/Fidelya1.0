'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  styled,
  Fab,
  Fade,
  CircularProgress,
} from '@mui/material';
import { ArrowDown, Calendar } from '@phosphor-icons/react';
import { ChatMessage } from './chatMessage';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Styled Components
const MessagesContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2, 1),
  overflowY: 'auto',
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.4)
    : alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: alpha(theme.palette.primary.main, 0.1),
    borderRadius: '3px',
    '&:hover': {
      background: alpha(theme.palette.primary.main, 0.2),
    },
  },
}));

const DateDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(2, 0),
  '&::before, &::after': {
    content: '""',
    flex: 1,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
}));

const DateChip = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 2),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  margin: theme.spacing(0, 2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  status?: 'sent' | 'delivered' | 'read' | 'error';
}

interface ChatMessagesListProps {
  messages: Message[];
  currentUserId: string;
  loading?: boolean;
}

export function ChatMessagesList({
  messages,
  currentUserId,
  loading = false,
}: ChatMessagesListProps): React.ReactElement {
  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrollPosition = scrollHeight - scrollTop - clientHeight;
    const isNear = scrollPosition < 100;

    setIsNearBottom(isNear);
    setShowScrollButton(!isNear);
  };

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isNearBottom]);

  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    msgs.forEach(msg => {
      const date = format(new Date(msg.timestamp), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });

    return groups;
  };

  const getDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
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

  const messageGroups = groupMessagesByDate(
    messages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
  );

  return (
    <MessagesContainer
      ref={containerRef}
      onScroll={handleScroll}
    >
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      ) : messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 2,
              py: 4,
            }}
          >
            <Calendar size={48} weight="duotone" />
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
            >
              No hay mensajes aún.
              <br />
              ¡Empieza la conversación!
            </Typography>
          </Box>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          {Object.entries(messageGroups).map(([date, msgs]) => (
            <motion.div
              key={date}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DateDivider>
                <DateChip>
                  <Calendar size={14} weight="duotone" />
                  {getDateDisplay(date)}
                </DateChip>
              </DateDivider>

              {msgs.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  text={msg.text}
                  timestamp={new Date(msg.timestamp)}
                  senderId={msg.senderId}
                  senderName={msg.senderName}
                  currentUserId={currentUserId}
                  senderAvatarUrl={msg.senderAvatarUrl}
                  status={msg.status}
                />
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      <div ref={messagesEndRef} />

      <Fade in={showScrollButton}>
        <Fab
          size="small"
          color="primary"
          onClick={scrollToBottom}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            boxShadow: theme.shadows[8],
          }}
        >
          <ArrowDown weight="bold" />
        </Fab>
      </Fade>
    </MessagesContainer>
  );
}