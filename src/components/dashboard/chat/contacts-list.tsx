'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  TextField,
  Button,
  Divider,
  Tooltip,
  useTheme,
  Alert,
  Snackbar,
  alpha,
  styled,
  IconButton,
  InputAdornment,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Users,
  MagnifyingGlass,
  UserPlus,
  X,
  ChatCircle,
  Circle,
  UserCirclePlus,
} from '@phosphor-icons/react';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.6)
    : theme.palette.background.paper,
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: theme.shadows[8],
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'all 0.2s ease-in-out',
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.paper, 0.6)
      : alpha(theme.palette.background.paper, 0.8),
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.7)
        : alpha(theme.palette.background.paper, 0.9),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}));

const ContactItem = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: 'translateX(8px)',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
}));

interface Contact {
  id: string;
  email: string;
  avatar?: string;
  name?: string;
  online?: boolean;
}

interface ContactsListProps {
  onSelect: (contact: Contact) => void;
  selectedContactId?: string;
}

export function ContactsList({ onSelect, selectedContactId }: ContactsListProps) {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Contact[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const currentUser = auth.currentUser;

  const searchUserByEmail = async () => {
    if (!search.trim() || searchLoading) return;
    setSearchLoading(true);
    setError(null);

    try {
      const searchTerm = search.toLowerCase().trim();
      const q = query(
        collection(db, 'users'),
        where('email', '>=', searchTerm),
        where('email', '<=', searchTerm + '\uf8ff')
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setResults([]);
        setError('No se encontró ningún usuario con ese correo');
        return;
      }

      const users = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(user => user.id !== currentUser?.uid) as Contact[];

      setResults(users);
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setError('Error al buscar usuarios');
    } finally {
      setSearchLoading(false);
    }
  };

  const sendContactRequest = async (receiver: Contact) => {
    if (!currentUser) return;
    setLoading(true);

    try {
      const ref = doc(db, 'contactRequests', receiver.id, 'pending', currentUser.uid);
      await setDoc(ref, {
        senderId: currentUser.uid,
        senderEmail: currentUser.email,
        senderName: currentUser.displayName || '',
        senderAvatar: currentUser.photoURL || null,
        timestamp: serverTimestamp(),
      });

      setSuccess(`Solicitud enviada a ${receiver.email}`);
      setSearch('');
      setResults([]);
    } catch (err) {
      console.error('Error al enviar solicitud:', err);
      setError('No se pudo enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    const q = collection(db, 'contacts', currentUser.uid, 'contactsList');
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const contactIds = snapshot.docs.map(doc => doc.id);
      
      if (contactIds.length === 0) {
        setContacts([]);
        return;
      }

      const usersQuery = query(
        collection(db, 'users'),
        where('__name__', 'in', contactIds)
      );
      
      const userSnapshot = await getDocs(usersQuery);
      const loadedContacts = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        online: doc.data().lastSeen
          ? (new Date().getTime() - doc.data().lastSeen.toDate().getTime()) < 300000
          : false,
      })) as Contact[];

      setContacts(loadedContacts);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                p: 1,
                borderRadius: '50%',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <Users size={24} weight="duotone" />
            </Box>
            <Box flex={1}>
              <Typography variant="h6" fontWeight={600}>
                Contactos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {contacts.length} contactos
              </Typography>
            </Box>
          </Stack>

          {/* Buscador */}
          <Stack spacing={2}>
            <SearchField
              placeholder="Buscar por correo electrónico..."
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUserByEmail()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {searchLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <MagnifyingGlass size={20} />
                    )}
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch('')}>
                      <X size={16} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* Resultados de búsqueda */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Stack spacing={2}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Resultados
                  </Typography>
                  {results.map((user) => (
                    <ContactItem key={user.id}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <StyledAvatar src={user.avatar}>
                          {user.email[0].toUpperCase()}
                        </StyledAvatar>
                        <Box flex={1}>
                          <Typography variant="subtitle2">
                            {user.email}
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<UserCirclePlus />}
                          onClick={() => sendContactRequest(user)}
                          disabled={loading}
                        >
                          Enviar solicitud
                        </Button>
                      </Stack>
                    </ContactItem>
                  ))}
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>

          <Divider />

          {/* Lista de contactos */}
          <Stack spacing={2}>
            <Typography variant="subtitle2" fontWeight={600}>
              Mis contactos
            </Typography>
            
            {contacts.length === 0 ? (
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                }}
              >
                <Users size={40} weight="duotone" />
                <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                  No tienes contactos aún
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1}>
                {contacts.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    onClick={() => onSelect(contact)}
                    style={{
                      backgroundColor: contact.id === selectedContactId
                        ? alpha(theme.palette.primary.main, 0.08)
                        : 'transparent',
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box position="relative">
                        <StyledAvatar src={contact.avatar}>
                          {contact.email[0].toUpperCase()}
                        </StyledAvatar>
                        {contact.online && (
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: 'success.main',
                              border: '2px solid',
                              borderColor: 'background.paper',
                            }}
                          />
                        )}
                      </Box>
                      <Box flex={1}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {contact.name || contact.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {contact.email}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {contact.online && (
                          <Chip
                            label="En línea"
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ height: 24 }}
                          />
                        )}
                        <Tooltip title="Iniciar chat">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect(contact);
                            }}
                            sx={{
                              bgcolor: contact.id === selectedContactId
                                ? alpha(theme.palette.primary.main, 0.2)
                                : alpha(theme.palette.primary.main, 0.1),
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                              },
                            }}
                          >
                            <ChatCircle weight="duotone" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </ContactItem>
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>

        {/* Quick Actions - Opcional */}
        {contacts.length > 0 && (
          <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2}>
                <Chip
                  icon={<Circle weight="fill" />}
                  label={`${contacts.filter(c => c.online).length} en línea`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
                <Chip
                  icon={<Users weight="duotone" />}
                  label={`${contacts.length} total`}
                  size="small"
                  variant="outlined"
                />
              </Stack>
              <Button
                size="small"
                startIcon={<UserPlus />}
                onClick={() => {
                  setSearch('');
                  document.querySelector('input')?.focus();
                }}
              >
                Añadir
              </Button>
            </Stack>
          </Box>
        )}
      </CardContent>

      {/* Notificaciones */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setError(null)}
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: theme.shadows[8],
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccess(null)}
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: theme.shadows[8],
          }}
        >
          {success}
        </Alert>
      </Snackbar>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(4px)',
              zIndex: theme.zIndex.modal + 1,
              borderRadius: theme.shape.borderRadius * 2,
            }}
          >
            <Stack spacing={2} alignItems="center">
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Procesando solicitud...
              </Typography>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </StyledCard>
  );
}

