import React, { useState, useRef } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  CircularProgress, 
  useTheme, 
  alpha,
  Popover,
  Typography,
  Stack
} from '@mui/material';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useContacts } from '@/hooks/use-contacts';

// Iconos
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';

// Emojis
const EMOJIS = [
  '😊', '😂', '😍', '👍', '👏', '🙏', '❤️', '👋', '🎉', '✅',
  '🔥', '⭐', '💯', '🤔', '😉', '😎', '🤝', '👀', '💪', '🙌'
];

// Estilos personalizados
const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 0.95),
  backdropFilter: 'blur(10px)',
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    backgroundColor: alpha(theme.palette.background.default, theme.palette.mode === 'dark' ? 0.3 : 0.1),
    '&:hover': {
      backgroundColor: alpha(theme.palette.background.default, theme.palette.mode === 'dark' ? 0.4 : 0.2)
    },
    '&.Mui-focused': {
      backgroundColor: alpha(theme.palette.background.default, theme.palette.mode === 'dark' ? 0.5 : 0.3)
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.divider, 0.2)
  }
}));

const EmojiButton = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '1.5rem',
  borderRadius: 8,
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1)
  }
}));

const FilePreview = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: 8,
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
  display: 'flex',
  alignItems: 'center'
}));

interface ChatInputProps {
  onSendMessage: (text: string) => Promise<{ success: boolean; message: string }>;
  onSendFile: (file: File, caption: string) => Promise<{ success: boolean; message: string }>;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onSendFile, disabled = false }) => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { planLimits } = useContacts();
  
  // Manejar cambio de mensaje
  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  
  // Manejar envío de mensaje
  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;
    
    setIsSubmitting(true);
    
    try {
      if (selectedFile) {
        // Enviar archivo con mensaje como caption
        await onSendFile(selectedFile, message);
        setSelectedFile(null);
        setFilePreviewUrl(null);
      } else {
        // Enviar solo mensaje de texto
        await onSendMessage(message);
      }
      
      setMessage('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Manejar tecla Enter
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  
  // Manejar clic en emoji
  const handleEmojiClick = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setEmojiAnchorEl(null);
  };
  
  // Abrir selector de emojis
  const handleOpenEmojiSelector = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(event.currentTarget);
  };
  
  // Cerrar selector de emojis
  const handleCloseEmojiSelector = () => {
    setEmojiAnchorEl(null);
  };
  
  // Abrir selector de archivos
  const handleOpenFileSelector = () => {
    fileInputRef.current?.click();
  };
  
  // Manejar selección de archivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Verificar si el usuario puede enviar archivos
    if (!planLimits.fileAttachments) {
      alert('Tu plan no permite enviar archivos adjuntos. Actualiza a Pro o Enterprise para usar esta función.');
      return;
    }
    
    setSelectedFile(file);
    
    // Crear URL de vista previa para imágenes
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreviewUrl(null);
    }
    
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    event.target.value = '';
  };
  
  // Eliminar archivo seleccionado
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
  };
  
  return (
    <>
      {selectedFile && (
        <FilePreview>
          {filePreviewUrl ? (
            <Box sx={{ maxWidth: 100, maxHeight: 100, mr: 2, borderRadius: 1, overflow: 'hidden', position: 'relative', width: 100, height: 100 }}>
              <Image 
                src={filePreviewUrl} 
                alt="Preview" 
                fill 
                style={{ objectFit: 'cover' }} 
                unoptimized // Used for data URLs
              />
            </Box>
          ) : (
            <Box sx={{ 
              width: 40, 
              height: 40, 
              mr: 2, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.1)
            }}>
              {selectedFile.type === 'application/pdf' ? (
                <PictureAsPdfIcon color="primary" />
              ) : (
                <AttachFileIcon color="primary" />
              )}
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" fontWeight={500} noWrap>
              {selectedFile.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>
          
          <IconButton size="small" onClick={handleRemoveFile}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </FilePreview>
      )}
      
      <InputContainer>
        <IconButton 
          color="primary" 
          onClick={handleOpenEmojiSelector}
          disabled={disabled || isSubmitting}
        >
          <InsertEmoticonIcon />
        </IconButton>
        
        <IconButton 
          color="primary" 
          onClick={handleOpenFileSelector}
          disabled={disabled || isSubmitting || !planLimits.fileAttachments}
          title={!planLimits.fileAttachments ? 'Actualiza a Pro o Enterprise para enviar archivos' : ''}
        >
          <AttachFileIcon />
        </IconButton>
        
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        />
        
        <StyledTextField
          fullWidth
          placeholder="Escribe un mensaje..."
          variant="outlined"
          size="small"
          value={message}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
          disabled={disabled || isSubmitting}
          multiline
          maxRows={4}
          sx={{ mx: 1 }}
        />
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
            disabled={disabled || isSubmitting || (!message.trim() && !selectedFile)}
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </motion.div>
      </InputContainer>
      
      <Popover
        open={Boolean(emojiAnchorEl)}
        anchorEl={emojiAnchorEl}
        onClose={handleCloseEmojiSelector}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
            boxShadow: theme.shadows[4],
            maxWidth: 280
          }
        }}
      >
        <Stack direction="row" flexWrap="wrap" spacing={1}>
          {EMOJIS.map((emoji) => (
            <EmojiButton key={emoji} onClick={() => handleEmojiClick(emoji)}>
              {emoji}
            </EmojiButton>
          ))}
        </Stack>
      </Popover>
    </>
  );
};

export default ChatInput;