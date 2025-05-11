'use client';


import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Tooltip, 
  useTheme, 
  alpha,
  Paper,
  Container,
  Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import { useContacts } from '@/hooks/use-contacts';
import ContactList from '@/components/dashboard/contacts/contact-list';
import ContactAddDialog from '@/components/dashboard/contacts/contact-add-dialog';
import ChatNotifications from '@/components/dashboard/contacts/chatNotifications';


// Iconos
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ContactsPage: React.FC = () => {
  const theme = useTheme();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { 
    acceptedContacts, 
    pendingRequests, 
    canAddMore, 
    planLimits 
  } = useContacts();
  
  // Abrir diálogo para agregar contacto
  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };
  
  // Cerrar diálogo para agregar contacto
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };
  
  return (

    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 4,
          bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 0.95),
          backdropFilter: 'blur(10px)',
          boxShadow: theme.shadows[2]
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
              Contactos
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona tus contactos y solicitudes
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <ChatNotifications totalUnread={acceptedContacts.reduce((acc, contact) => acc + contact.unreadCount, 0)} />
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PersonAddIcon />}
                onClick={handleOpenAddDialog}
                disabled={!canAddMore}
                sx={{ 
                  borderRadius: 8,
                  px: 3,
                  py: 1
                }}
              >
                Agregar contacto
              </Button>
            </motion.div>
          </Stack>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            {acceptedContacts.length} de {planLimits.maxContacts} contactos
          </Typography>
          
          <Tooltip title={`Tu plan ${planLimits.maxContacts === 10 ? 'Basic' : planLimits.maxContacts === 100 ? 'Pro' : 'Enterprise'} permite hasta ${planLimits.maxContacts} contactos`}>
            <IconButton size="small" color="inherit">
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {pendingRequests.length > 0 && (
            <Box 
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{ 
                ml: 'auto',
                px: 2,
                py: 0.5,
                borderRadius: 8,
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                {pendingRequests.length} {pendingRequests.length === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'}
              </Typography>
            </Box>
          )}
        </Box>
        
        <ContactList />
      </Paper>
      
      <ContactAddDialog open={addDialogOpen} onClose={handleCloseAddDialog} />
    </Container>
  );
};

export default ContactsPage;