import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Paper, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  Popper, 
  Grow, 
  ClickAwayListener,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useContacts } from '@/hooks/use-contacts';
import { User } from '@/types/user';

// Iconos
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Estilos personalizados
const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.6 : 0.8),
    backdropFilter: 'blur(10px)',
    transition: theme.transitions.create(['background-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.7 : 0.9)
    },
    '&.Mui-focused': {
      backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 1),
      boxShadow: theme.shadows[2]
    }
  }
}));

const SearchResultsContainer = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: theme.shadows[4],
  backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 0.95),
  backdropFilter: 'blur(10px)',
  maxHeight: 300,
  overflow: 'auto',
  zIndex: 1300
}));

interface ContactSearchbarProps {
  onSearch: (query: string) => void;
}

const ContactSearchbar: React.FC<ContactSearchbarProps> = ({ onSearch }) => {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { searchUsers, searchResults, sendRequest, planLimits } = useContacts();
  const searchRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Manejar cambio en el campo de búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearch(value);
    
    // Si el valor está vacío, ocultar resultados
    if (!value) {
      setShowResults(false);
      return;
    }
    
    // Si el valor contiene @ y el plan permite búsqueda
    if (value.includes('@') && planLimits.shareItems) {
      setIsSearching(true);
      setAnchorEl(event.currentTarget);
      searchUsers(value);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };
  
  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchValue('');
    setShowResults(false);
    onSearch('');
  };
  
  // Manejar clic fuera de los resultados
  const handleClickAway = () => {
    setShowResults(false);
  };
  
  // Manejar envío de solicitud
  const handleSendRequest = async (user: User) => {
    if (!user.email) return;
    
    const result = await sendRequest(user.email);
    if (result.success) {
      setSearchValue('');
      setShowResults(false);
      onSearch('');
    }
  };
  
  // Actualizar resultados cuando cambian
  useEffect(() => {
    setIsSearching(false);
  }, [searchResults]);
  
  return (
    <Box sx={{ mb: 2, position: 'relative' }} ref={searchRef}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SearchField
          fullWidth
          placeholder="Buscar contactos o agregar por correo..."
          variant="outlined"
          value={searchValue}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={handleClearSearch}
                  edge="end"
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </motion.div>
      
      {/* Resultados de búsqueda */}
      <Popper
        open={showResults && searchResults.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        style={{ width: searchRef.current?.clientWidth, zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={200}>
            <div>
              <ClickAwayListener onClickAway={handleClickAway}>
                <SearchResultsContainer>
                  <List sx={{ py: 1 }}>
                    {searchResults.map((user) => (
                      <ListItem
                        key={user.uid}
                        component="div"
                        onClick={() => handleSendRequest(user)}
                        sx={{
                          borderRadius: 2,
                          mx: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1)
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar src={user.photoURL || undefined}>
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.displayName || user.email}
                          secondary={user.email}
                          primaryTypographyProps={{
                            variant: 'body1',
                            fontWeight: 500
                          }}
                        />
                        <IconButton
                          size="small"
                          color="primary"
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.2)
                            }
                          }}
                        >
                          <PersonAddIcon fontSize="small" />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </SearchResultsContainer>
              </ClickAwayListener>
            </div>
          </Grow>
        )}
      </Popper>
      
      {/* Mensaje cuando no hay resultados */}
      {isSearching && searchValue.includes('@') && searchResults.length === 0 && (
        <Box
          sx={{
            mt: 1,
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(10px)',
            boxShadow: theme.shadows[1]
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Buscando usuarios...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ContactSearchbar;