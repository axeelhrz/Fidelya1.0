'use client';
import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  Avatar,
  Stack,
  Paper,
  alpha,
  styled,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Checks,
  Clock,
} from '@phosphor-icons/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';

// Styled Components
const MessageWrapper = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(0.5, 1),
  marginBottom: theme.spacing(1),
}));

const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isOwn',
})<{ isOwn: boolean }>(({ theme, isOwn }) => ({
  backgroundColor: isOwn
    ? alpha(theme.palette.primary.main, 0.9)
    : theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.6)
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  padding: theme.spacing(1.5, 2),
  maxWidth: '100%',
  boxShadow: isOwn
    ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`
    : theme.shadows[1],
  border: `1px solid ${
    isOwn
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.divider, 0.1)
  }`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 8,
    [isOwn ? 'right' : 'left']: -8,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '8px 8px 0 8px',
    borderColor: `${
      isOwn
        ? alpha(theme.palette.primary.main, 0.9)
        : theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.6)
        : alpha(theme.palette.background.paper, 0.9)
    } transparent transparent transparent`,
    transform: isOwn ? 'rotate(-45deg)' : 'rotate(45deg)',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  border: `2px solid ${alpha(theme.palette.background.paper, 0.8)}`,
  boxShadow: theme.shadows[2],
}));

interface ChatMessageProps {
  text: string;
  timestamp: Date;
  senderId: string;
  senderName: string;
  currentUserId: string;
  senderAvatarUrl?: string;
  status?: 'sent' | 'delivered' | 'read' | 'error';
}

export function ChatMessage({
  text,
  timestamp,
  senderId,
  senderName,
  currentUserId,
  senderAvatarUrl,
  status = 'sent',
}: ChatMessageProps): React.JSX.Element {
  const theme = useTheme();
  const isOwnMessage = senderId === currentUserId;

  const getStatusIcon = () => {
    switch (status) {
      case 'sent':
        return <Clock size={14} />;
      case 'delivered':
        return <CheckCircle size={14} />;
      case 'read':
        return <Checks size={14} weight="fill" />;
      case 'error':
        return <Clock size={14} color={theme.palette.error.main} />;
      default:
        return null;
    }
  };

  const getTimeString = (date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return format(date, 'HH:mm');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer ' + format(date, 'HH:mm');
    } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return format(date, 'EEEE HH:mm', { locale: es });
    } else {
      return format(date, 'dd MMM yyyy, HH:mm', { locale: es });
    }
  };

  return (
    <MessageWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
      }}
    >
      <Stack
        direction={isOwnMessage ? 'row-reverse' : 'row'}
        spacing={1}
        alignItems="flex-end"
        sx={{ maxWidth: '70%' }}
      >
        <Tooltip title={senderName} placement={isOwnMessage ? 'left' : 'right'}>
          <StyledAvatar
            src={senderAvatarUrl}
            alt={senderName}
          >
            {senderName[0].toUpperCase()}
          </StyledAvatar>
        </Tooltip>

        <MessageBubble isOwn={isOwnMessage}>
          {!isOwnMessage && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.secondary,
                mb: 0.5,
                display: 'block',
              }}
            >
              {senderName}
            </Typography>
          )}

          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: isOwnMessage ? 'white' : theme.palette.text.primary,
            }}
          >
            {text}
          </Typography>

          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            justifyContent="flex-end"
            sx={{ mt: 0.5 }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.7rem',
                color: isOwnMessage
                  ? alpha('#fff', 0.7)
                  : theme.palette.text.secondary,
              }}
            >
              {getTimeString(new Date(timestamp))}
            </Typography>
            
            {isOwnMessage && (
              <Box
                sx={{
                  color: status === 'read'
                    ? theme.palette.primary.main
                    : isOwnMessage
                    ? alpha('#fff', 0.7)
                    : theme.palette.text.secondary,
                }}
              >
                {getStatusIcon()}
              </Box>
            )}
          </Stack>
        </MessageBubble>
      </Stack>
    </MessageWrapper>
  );
}