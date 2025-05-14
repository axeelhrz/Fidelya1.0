import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Badge, alpha, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useContacts } from '@/hooks/use-contacts';
import ContactCard from './contact-card';
import ContactSearchbar from './contact-searchbar';
import { Contact } from '@/types/contact';
import { styled } from '@mui/material/styles';

// Estilos personalizados
const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
    borderRadius: '3px 3px 0 0'
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    minWidth: 'auto',
    padding: theme.spacing(1.5, 2),
    '&.Mui-selected': {
      color: theme.palette.primary.main
    }
  }
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  borderRadius: 16,
  backdropFilter: 'blur(10px)',
  boxShadow: theme.shadows[1],
  marginTop: theme.spacing(2)
}));

// Tipos de pestañas
type TabType = 'all' | 'pending' | 'favorites' | 'blocked';

const ContactList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    acceptedContacts, 
    pendingRequests, 
    favoriteContacts, 
    blockedContacts,
    loading
  } = useContacts();

  // Filtrar contactos según la pestaña activa y la búsqueda
  useEffect(() => {
    let contacts: Contact[] = [];
    
    switch (activeTab) {
      case 'all':
        contacts = acceptedContacts;
        break;
      case 'pending':
        contacts = pendingRequests;
        break;
      case 'favorites':
        contacts = favoriteContacts;
        break;
      case 'blocked':
        contacts = blockedContacts;
        break;
      default:
        contacts = acceptedContacts;
    }
    
    // Aplicar filtro de búsqueda si existe
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      contacts = contacts.filter(
        contact => 
          contact.displayName.toLowerCase().includes(query) || 
          contact.email.toLowerCase().includes(query)
      );
    }
    
    setFilteredContacts(contacts);
  }, [activeTab, searchQuery, acceptedContacts, pendingRequests, favoriteContacts, blockedContacts]);

  // Manejar cambio de pestaña
  const handleTabChange = (_: React.SyntheticEvent, newValue: TabType) => {
    setActiveTab(newValue);
  };

  // Manejar búsqueda
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <ContactSearchbar onSearch={handleSearch} />
      
      <StyledTabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="contact tabs"
      >
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">Todos</Typography>
            </Box>
          } 
          value="all" 
        />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge 
                badgeContent={pendingRequests.length} 
                color="error"
                sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}
              >
                <Typography variant="body2">Pendientes</Typography>
              </Badge>
            </Box>
          } 
          value="pending" 
        />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">Favoritos</Typography>
            </Box>
          } 
          value="favorites" 
        />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">Bloqueados</Typography>
            </Box>
          } 
          value="blocked" 
        />
      </StyledTabs>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Cargando contactos...
              </Typography>
            </Box>
          ) : filteredContacts.length > 0 ? (
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              <AnimatePresence>
                {filteredContacts.map((contact, index) => (
                  <motion.div
                    key={contact.uid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <ContactCard 
                      contact={contact} 
                      isPending={activeTab === 'pending'} 
                      isBlocked={activeTab === 'blocked'} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </Stack>
          ) : (
            <EmptyState>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {activeTab === 'all' && 'No tienes contactos aún'}
                {activeTab === 'pending' && 'No tienes solicitudes pendientes'}
                {activeTab === 'favorites' && 'No tienes contactos favoritos'}
                {activeTab === 'blocked' && 'No tienes contactos bloqueados'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeTab === 'all' && 'Agrega contactos para comenzar a chatear'}
                {activeTab === 'pending' && 'Las solicitudes pendientes aparecerán aquí'}
                {activeTab === 'favorites' && 'Marca contactos como favoritos para acceder rápidamente'}
                {activeTab === 'blocked' && 'Los contactos bloqueados no podrán enviarte mensajes'}
              </Typography>
            </EmptyState>
          )}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default ContactList;