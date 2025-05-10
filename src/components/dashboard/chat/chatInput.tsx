'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  TextField,
  CircularProgress,
  Tooltip,
  alpha,
  styled,
  Stack,
} from '@mui/material';
import {
  PaperPlaneRight,
  Smiley,
  Image,
  Paperclip,
  Microphone,
} from '@phosphor-icons/react';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

// Styled Components
const InputWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.9)
    : theme.palette.background.paper,
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  backdropFilter: 'blur(10px)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.paper, 0.6)
      : alpha(theme.palette.background.default, 0.6),
    borderRadius: theme.shape.borderRadius * 3,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.7)
        : alpha(theme.palette.background.default, 0.7),
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.8)
        : alpha(theme.palette.background.default, 0.8),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    transform: 'translateY(-2px)',
  },
}));

interface ChatInputProps {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  chatId: string;
  onTyping?: (isTyping: boolean) => void;
}

export function ChatInput({
  currentUserId,
  currentUserName,
  currentUserAvatar,
  chatId,
  onTyping,
}: ChatInputProps): React.ReactElement {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      onTyping?.(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping?.(false);
    }, 1500);
  };

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending) return;

    setIsSending(true);
    try {
      const messageRef = await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: trimmedMessage,
        timestamp: serverTimestamp(),
        senderId: currentUserId,
        senderName: currentUserName,
        senderAvatarUrl: currentUserAvatar || null,
        status: 'sent',
      });

      setMessage('');
      inputRef.current?.focus();

      // Actualizar estado del mensaje
      await updateDoc(doc(db, 'chats', chatId, 'messages', messageRef.id), {
        status: 'delivered',
      });
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    } finally {
      setIsSending(false);
      setIsTyping(false);
      onTyping?.(false);
    }
  };

  return (
    <InputWrapper>
      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title="Emojis">
          <ActionButton size="small">
            <Smiley weight="duotone" />
          </ActionButton>
        </Tooltip>
        <Tooltip title="Adjuntar archivo">
          <ActionButton size="small">
            <Paperclip weight="duotone" />
          </ActionButton>
        </Tooltip>
        <Tooltip title="Enviar imagen">
          <ActionButton size="small">
            <Image weight="duotone" alt="" />
          </ActionButton>
        </Tooltip>
      </Stack>

      <StyledTextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="Escribe tu mensaje..."
        variant="outlined"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        inputRef={inputRef}
        InputProps={{
          sx: {
            pr: 1,
            py: 1,
          },
        }}
      />

      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title="Grabar audio">
          <ActionButton size="small" color="primary">
            <Microphone weight="duotone" />
          </ActionButton>
        </Tooltip>
        
        <Tooltip title="Enviar mensaje">
          <span>
            <ActionButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
              sx={{
                width: 45,
                height: 45,
              }}
            >
              <AnimatePresence mode="wait">
                {isSending ? (
                  <CircularProgress size={24} />
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <PaperPlaneRight weight="duotone" size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </ActionButton>
          </span>
        </Tooltip>
      </Stack>
    </InputWrapper>
  );
}
