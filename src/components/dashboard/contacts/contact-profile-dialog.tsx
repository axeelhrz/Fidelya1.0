import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Divider,
  IconButton,
  useTheme,
  alpha,
  useMediaQuery,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Contact } from '@/types/contact';
import { useContacts } from '@/hooks/use-contacts';

// Iconos
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmailIcon from '@mui/icons-material/Email';

// Estilos personalizados
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    boxShadow: theme.shadows[10],
    overflow: 'visible',
    backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.9 : 1),
    backdropFilter: 'blur(10px)'
  }
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
  margin: '0 auto',
  marginTop: theme.spacing(-8)
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1.5),
    color: theme.palette.text.secondary
  }
}));

interface ContactProfileDialogProps {
  open: boolean;
  onClose: () => void;
  contact: Contact;
  isBlocked?: boolean;
}

const ContactProfileDialog: React.FC<ContactProfileDialogProps> = ({ 
  open, 
  onClose, 
  contact,
  isBlocked = false
}) => {
  const theme = useTheme();
  const router = useRouter();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { blockContactById, unblockContactById, toggleFavorite } = useContacts();
  
  // Formatear fecha
  const formatDate = (timestamp: { toDate(): Date } | null | undefined) => {
    if (!timestamp) return 'Desconocido';
    return format(timestamp.toDate(), 'PPP', { locale: es });
  };
  
  // Manejar clic en chat
  const handleChatClick = () => {
    router.push(`/dashboard/chat/${contact.uid}`);
    onClose();
  };
  
  // Manejar clic en bloquear/desbloquear
  const handleBlockClick = async () => {
    if (isBlocked) {
      await unblockContactById(contact.uid);
    } else {
      await blockContactById(contact.uid);
    }
    onClose();
  };
  
  // Manejar clic en favorito
  const handleFavoriteClick = async () => {
    await toggleFavorite(contact.uid, !contact.isFavorite);
  };
  
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
    >
      <Box sx={{ position: 'relative', height: 100, bgcolor: theme.palette.primary.main, borderRadius: '16px 16px 0 0' }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.common.white
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <DialogContent sx={{ pt: 0, pb: 3 }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ProfileAvatar src={contact.photoURL || undefined}>
            {contact.displayName.charAt(0).toUpperCase()}
          </ProfileAvatar>
          
          <Box sx={{ textAlign: 'center', mt: 2, mb: 3 }}>
            <Typography variant="h5" component="div" fontWeight={600}>
              {contact.displayName}
              {contact.isFavorite && (
                <IconButton
                  size="small"
                  color="warning"
                  onClick={handleFavoriteClick}
                  sx={{ ml: 1 }}
                >
                  <StarIcon />
                </IconButton>
              )}
              {!contact.isFavorite && (
                <IconButton
                  size="small"
                  color="warning"
                  onClick={handleFavoriteClick}
                  sx={{ ml: 1, color: theme.palette.text.secondary }}
                >
                  <StarBorderIcon />
                </IconButton>
              )}
            </Typography>
            
            <Chip 
              label={isBlocked ? "Bloqueado" : "Contacto"} 
              size="small"
              color={isBlocked ? "error" : "primary"}
              sx={{ mt: 1 }}
            />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ px: 2 }}>
            <InfoItem>
              <EmailIcon />
              <Typography variant="body1">{contact.email}</Typography>
            </InfoItem>
            
            {contact.company && (
              <InfoItem>
                <BusinessIcon />
                <Typography variant="body1">{contact.company}</Typography>
              </InfoItem>
            )}
            
            {contact.city && (
              <InfoItem>
                <LocationOnIcon />
                <Typography variant="body1">{contact.city}</Typography>
              </InfoItem>
            )}
            
            {contact.phone && (
              <InfoItem>
                <PhoneIcon />
                <Typography variant="body1">{contact.phone}</Typography>
              </InfoItem>
            )}
            
            <InfoItem>
              <CalendarTodayIcon />
              <Typography variant="body1">
                Contacto desde {formatDate(contact.createdAt)}
              </Typography>
            </InfoItem>
            
            {contact.notes && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Notas
                </Typography>
                <Box 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.background.default, 0.7),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }}
                >
                  <Typography variant="body2">{contact.notes}</Typography>
                </Box>
              </Box>
            )}
          </Box>
        </motion.div>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        {!isBlocked && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<ChatIcon />}
            onClick={handleChatClick}
            sx={{ 
              borderRadius: 8,
              px: 3
            }}
          >
            Iniciar chat
          </Button>
        )}
        
        <Button
          variant={isBlocked ? "outlined" : "contained"}
          color={isBlocked ? "success" : "error"}
          startIcon={isBlocked ? <CheckCircleIcon /> : <BlockIcon />}
          onClick={handleBlockClick}
          sx={{ 
            borderRadius: 8,
            px: 3
          }}
        >
          {isBlocked ? "Desbloquear" : "Bloquear"}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default ContactProfileDialog;