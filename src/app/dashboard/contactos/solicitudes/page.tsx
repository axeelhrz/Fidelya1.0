'use client';
export const dynamic = 'force-dynamic';


import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container, 
  useTheme, 
  alpha,
  Divider,
  Stack
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useContacts } from '@/hooks/use-contacts';
import ContactCard from '@/components/dashboard/contacts/contact-card';

// Iconos
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PendingRequestsPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { pendingRequests, pendingContacts } = useContacts();
  
  // Volver a la página de contactos
  const handleBack = () => {
    router.push('/dashboard/contactos');
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Volver
          </Button>
          
          <Typography variant="h5" component="h1" fontWeight={600}>
            Solicitudes pendientes
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Solicitudes recibidas
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Solicitudes de contacto que has recibido
          </Typography>
          
          <Stack spacing={1.5}>
            <AnimatePresence>
              {pendingRequests.length > 0 ? (
                pendingRequests.map((contact, index) => (
                  <motion.div
                    key={contact.uid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <ContactCard 
                      contact={contact} 
                      isPending={true} 
                    />
                  </motion.div>
                ))
              ) : (
                <Box 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No tienes solicitudes pendientes
                  </Typography>
                </Box>
              )}
            </AnimatePresence>
          </Stack>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Solicitudes enviadas
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Solicitudes de contacto que has enviado
          </Typography>
          
          <Stack spacing={1.5}>
            <AnimatePresence>
              {pendingContacts.length > 0 ? (
                pendingContacts.map((contact, index) => (
                  <motion.div
                    key={contact.uid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight={500}>
                            {contact.displayName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {contact.email}
                          </Typography>
                        </Box>
                        
                        <Typography variant="caption" color="text.secondary">
                          Esperando respuesta
                        </Typography>
                      </Box>
                    </Paper>
                  </motion.div>
                ))
              ) : (
                <Box 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No has enviado solicitudes pendientes
                  </Typography>
                </Box>
              )}
            </AnimatePresence>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default PendingRequestsPage;