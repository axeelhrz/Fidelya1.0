import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Chip, 
  Divider, 
  Stack,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search as SearchIcon, 
  History as HistoryIcon, 
  Clear as ClearIcon,
  Article as ArticleIcon,
  Lightbulb as TipIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useHelpCenter } from '@/hooks/use-help-center';
import { HelpArticle } from '@/types/help-center';
import { debounce } from 'lodash';

export default function SearchSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { handleSearch, searchResults } = useHelpCenter();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Efecto para manejar clics fuera del componente de búsqueda
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Cargar búsquedas recientes desde localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);
  
  // Función para guardar búsquedas recientes
  const saveRecentSearch = (search: string) => {
    if (!search.trim()) return;
    
    const updatedSearches = [
      search,
      ...recentSearches.filter(s => s !== search)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };
  
  // Función debounce para la búsqueda
  const debouncedSearch = useRef(
    debounce((searchQuery: string) => {
      handleSearch(searchQuery);
    }, 500)
  ).current;
  
  // Manejar cambios en el input de búsqueda
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    
    if (newQuery.trim()) {
      debouncedSearch(newQuery);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };
  
  // Manejar clic en búsqueda reciente
  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    handleSearch(search);
    setShowResults(true);
  };
  
  // Limpiar input de búsqueda
  const handleClearSearch = () => {
    setQuery('');
    setShowResults(false);
  };
  
  // Manejar envío del formulario
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      handleSearch(query);
      saveRecentSearch(query);
      setShowResults(true);
    }
  };
  
  // Categorizar resultados
  const categorizeResults = (results: HelpArticle[]) => {
    const articles = results.filter(article => !article.tags.includes('error') && !article.tags.includes('tip'));
    const tips = results.filter(article => article.tags.includes('tip'));
    const errors = results.filter(article => article.tags.includes('error'));
    
    return { articles, tips, errors };
  };
  
  const { articles, tips, errors } = categorizeResults(searchResults.articles);
  
  return (
    <Box ref={searchRef} sx={{ position: 'relative', mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            p: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 2,
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: isDark 
              ? '0 4px 20px rgba(0, 0, 0, 0.2)' 
              : '0 4px 20px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: isDark 
                ? '0 6px 24px rgba(0, 0, 0, 0.3)' 
                : '0 6px 24px rgba(0, 0, 0, 0.08)',
            },
            '&:focus-within': {
              borderColor: theme.palette.primary.main,
              boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`
            }
          }}
        >
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
          <TextField
            fullWidth
            placeholder="Buscar artículos, tutoriales, soluciones..."
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setShowResults(true)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: { 
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1rem',
                py: 1
              }
            }}
          />
          {searchResults.loading && (
            <CircularProgress size={24} sx={{ mx: 1 }} />
          )}
          {query && (
            <IconButton size="small" onClick={handleClearSearch}>
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>
      </motion.div>
      
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Paper
              elevation={0}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                mt: 1,
                zIndex: 10,
                maxHeight: '70vh',
                overflowY: 'auto',
                borderRadius: 2,
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                background: isDark ? 'rgba(25, 25, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: isDark 
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              {query.trim() === '' && (
                <Box sx={{ p: 2 }}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    <HistoryIcon fontSize="small" sx={{ mr: 1 }} />
                    Búsquedas recientes
                  </Typography>
                  {recentSearches.length > 0 ? (
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {recentSearches.map((search, index) => (
                        <Chip
                          key={index}
                          label={search}
                          size="small"
                          onClick={() => handleRecentSearchClick(search)}
                          sx={{ 
                            my: 0.5,
                            bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                            '&:hover': {
                              bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            }
                          }}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No hay búsquedas recientes
                    </Typography>
                  )}
                </Box>
              )}
              
              {query.trim() !== '' && (
                <>
                  {searchResults.loading ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <CircularProgress size={30} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Buscando resultados...
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      {searchResults.articles.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                          <Typography variant="body1" color="text.secondary">
                            No se encontraron resultados para &ldquo;{query}&rdquo;
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Intenta con otros términos o consulta las preguntas frecuentes
                          </Typography>
                        </Box>
                      ) : (
                        <List sx={{ py: 0 }}>
                          {articles.length > 0 && (
                            <>
                              <ListItem sx={{ bgcolor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)' }}>
                                <ListItemText 
                                  primary={
                                    <Typography 
                                      variant="subtitle2" 
                                      sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontWeight: 600
                                      }}
                                    >
                                      <ArticleIcon fontSize="small" sx={{ mr: 1 }} />
                                      Artículos
                                    </Typography>
                                  } 
                                />
                              </ListItem>
                              {articles.map((article) => (
                                <ListItem 
                                  key={article.id} 
                                  component="button"
                                  sx={{ 
                                    py: 1.5,
                                    transition: 'all 0.2s',
                                    border: 'none',
                                    width: '100%',
                                    textAlign: 'left',
                                    background: 'transparent',
                                    '&:hover': {
                                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                                    }
                                  }}
                                >
                                  <ListItemText
                                    primary={
                                      <Typography 
                                        variant="body1" 
                                        sx={{ 
                                          fontWeight: 500,
                                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        }}
                                      >
                                        {article.title}
                                      </Typography>
                                    }
                                    secondary={
                                      <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ 
                                          mt: 0.5,
                                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden'
                                        }}
                                      >
                                        {article.summary}
                                      </Typography>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </>
                          )}
                          
                          {tips.length > 0 && (
                            <>
                              <Divider />
                              <ListItem sx={{ bgcolor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)' }}>
                                <ListItemText 
                                  primary={
                                    <Typography 
                                      variant="subtitle2" 
                                      sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontWeight: 600
                                      }}
                                    >
                                      <TipIcon fontSize="small" sx={{ mr: 1, color: theme.palette.warning.main }} />
                                      Soluciones rápidas
                                    </Typography>
                                  }
                                />
                              </ListItem>
                              {tips.map((tip) => (
                                <ListItem 
                                  key={tip.id} 
                                  component="button"
                                  sx={{ 
                                    py: 1.5,
                                    transition: 'all 0.2s',
                                    border: 'none',
                                    width: '100%',
                                    textAlign: 'left',
                                    background: 'transparent',
                                    '&:hover': {
                                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                                    }
                                  }}
                                >
                                  <ListItemText
                                    primary={
                                      <Typography 
                                        variant="body1" 
                                        sx={{ 
                                          fontWeight: 500,
                                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        }}
                                      >
                                        {tip.title}
                                      </Typography>
                                    }
                                    secondary={
                                      <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ 
                                          mt: 0.5,
                                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden'
                                        }}
                                      >
                                        {tip.summary}
                                      </Typography>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </>
                          )}
                          
                          {errors.length > 0 && (
                            <>
                              <Divider />
                              <ListItem sx={{ bgcolor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)' }}>
                                <ListItemText 
                                  primary={
                                    <Typography 
                                      variant="subtitle2" 
                                      sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontWeight: 600
                                      }}
                                    >
                                      <ErrorIcon fontSize="small" sx={{ mr: 1, color: theme.palette.error.main }} />
                                      Soluciones de errores
                                    </Typography>
                                  }
                                />
                              </ListItem>
                              {errors.map((error) => (
                                <ListItem 
                                  key={error.id} 
                                  component="button"
                                  sx={{ 
                                    py: 1.5,
                                    transition: 'all 0.2s',
                                    border: 'none',
                                    width: '100%',
                                    textAlign: 'left',
                                    background: 'transparent',
                                    '&:hover': {
                                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                                    }
                                  }}
                                >
                                  <ListItemText
                                    primary={
                                      <Typography 
                                        variant="body1" 
                                        sx={{ 
                                          fontWeight: 500,
                                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        }}
                                      >
                                        {error.title}
                                      </Typography>
                                    }
                                    secondary={
                                      <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ 
                                          mt: 0.5,
                                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden'
                                        }}
                                      >
                                        {error.summary}
                                      </Typography>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </>
                          )}
                        </List>
                      )}
                    </>
                  )}
                </>
              )}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}