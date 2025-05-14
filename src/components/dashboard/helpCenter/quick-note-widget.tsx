import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Tooltip,
  useTheme,
  Zoom,
  Fab,
  Menu,
  Stack,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StickyNote2, 
  Close, 
  Add, 
  Delete, 
  Edit, 
  ColorLens,
  Save,
  NoteAdd
} from '@mui/icons-material';

// Colores para las notas
const noteColors = [
  '#FFF176', // amarillo
  '#81D4FA', // azul claro
  '#A5D6A7', // verde claro
  '#FFAB91', // naranja claro
  '#E1BEE7', // morado claro
  '#F8BBD0', // rosa claro
];

// Datos de notas para demostración
const initialNotes = [
  {
    id: '1',
    content: 'Revisar tutorial sobre renovación de pólizas',
    color: noteColors[0]
  },
  {
    id: '2',
    content: 'Consultar documentación sobre importación de clientes',
    color: noteColors[2]
  }
];

export default function QuickNotesWidget() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [notes, setNotes] = useState(initialNotes);
  const [showWidget, setShowWidget] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(noteColors[0]);
  const [colorMenuAnchor, setColorMenuAnchor] = useState<null | HTMLElement>(null);
  // Removed unused state
  
  const handleToggleWidget = () => {
    setShowWidget(!showWidget);
  };
  
  const handleAddNote = () => {
    const newNote = {
      id: Date.now().toString(),
      content: '',
      color: selectedColor
    };
    
    setNotes([...notes, newNote]);
    setEditingNote(newNote.id);
    setNoteContent('');
  };
  const handleEditNote = (id: string) => {
    const note = notes.find(note => note.id === id);
    if (note) {
      setEditingNote(id);
      setNoteContent(note.content);
      setSelectedColor(note.color);
    }
  };
  
  const handleSaveNote = () => {
    if (!editingNote) return;
    
    setNotes(notes.map(note => 
      note.id === editingNote 
        ? { ...note, content: noteContent, color: selectedColor } 
        : note
    ));
    
    setEditingNote(null);
    setNoteContent('');
  };
  
  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (editingNote === id) {
      setEditingNote(null);
      setNoteContent('');
    }
  };
  
  const handleColorMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setColorMenuAnchor(event.currentTarget);
  };
  
  const handleColorMenuClose = () => {
    setColorMenuAnchor(null);
  };
  
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setColorMenuAnchor(null);
  };
  // Removed unused functions related to addMenuAnchor
  
  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNoteContent(event.target.value);
  };
  return (
    <>
      <Zoom in={true}>
        <Fab
          color="warning"
          size="medium"
          onClick={handleToggleWidget}
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            left: 20,
            zIndex: 1000
          }}
        >
          <StickyNote2 />
        </Fab>
      </Zoom>
      
      <AnimatePresence>
        {showWidget && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 80,
              left: 20,
              zIndex: 1000,
              width: 300,
              maxWidth: 'calc(100vw - 40px)',
            }}
          >
            <Paper
              elevation={6}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                background: isDark ? 'rgba(25, 25, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: isDark 
                  ? '0 10px 40px rgba(0, 0, 0, 0.3)' 
                  : '0 10px 40px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Header */}
              <Box 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center',
                  borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                  bgcolor: theme.palette.warning.main,
                  color: 'white'
                }}
              >
                <StickyNote2 sx={{ mr: 1.5 }} />
                <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 600,
                    fontFamily: "'Sora', sans-serif",
                    flexGrow: 1
                  }}
                >
                  Notas rápidas
                </Typography>
                <IconButton size="small" onClick={handleToggleWidget} sx={{ color: 'white' }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              
              {/* Content */}
              <Box sx={{ maxHeight: 400, overflowY: 'auto', p: 2 }}>
                {notes.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <NoteAdd sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      No hay notas. Añade una para guardar recordatorios rápidos.
                    </Typography>
                    <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    </Box>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {notes.map((note) => (
                      <Box
                        key={note.id}
                        sx={{
                          position: 'relative',
                          p: 2,
                          borderRadius: 2,
                          bgcolor: note.color,
                          color: 'rgba(0, 0, 0, 0.7)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        {editingNote === note.id ? (
                          <>
                            <TextField
                              fullWidth
                              multiline
                              minRows={2}
                              maxRows={4}
                              value={noteContent}
                              onChange={handleContentChange}
                              variant="standard"
                              placeholder="Escribe tu nota aquí..."
                              InputProps={{
                                disableUnderline: true,
                                sx: { 
                                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                                  fontSize: '0.875rem',
                                  bgcolor: 'transparent',
                                  p: 1
                                }
                              }}
                              sx={{ mb: 2 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Box>
                                <Tooltip title="Cambiar color">
                                  <IconButton 
                                    size="small" 
                                    onClick={handleColorMenuOpen}
                                    sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
                                  >
                                    <ColorLens fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Menu
                                  anchorEl={colorMenuAnchor}
                                  open={Boolean(colorMenuAnchor)}
                                  onClose={handleColorMenuClose}
                                >
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 1, width: 160 }}>
                                    {noteColors.map((color) => (
                                      <Box
                                        key={color}
                                        onClick={() => handleColorSelect(color)}
                                        sx={{
                                          width: 32,
                                          height: 32,
                                          m: 0.5,
                                          borderRadius: '50%',
                                          bgcolor: color,
                                          cursor: 'pointer',
                                          border: color === selectedColor 
                                            ? '2px solid rgba(0, 0, 0, 0.5)' 
                                            : '2px solid transparent',
                                          '&:hover': {
                                            opacity: 0.8
                                          }
                                        }}
                                      />
                                    ))}
                                  </Box>
                                </Menu>
                              </Box>
                              <Box>
                                <Tooltip title="Guardar">
                                  <IconButton 
                                    size="small" 
                                    onClick={handleSaveNote}
                                    sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
                                  >
                                    <Save fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Eliminar">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleDeleteNote(note.id)}
                                    sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                          </>
                        ) : (
                          <>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                              }}
                            >
                              {note.content}
                            </Typography>
                            <Box 
                              sx={{ 
                                position: 'absolute', 
                                top: 8, 
                                right: 8, 
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                '.MuiBox-root:hover &': {
                                  opacity: 1
                                }
                              }}
                            >
                              <Tooltip title="Editar">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditNote(note.id)}
                                  sx={{ 
                                    color: 'rgba(0, 0, 0, 0.6)',
                                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                                    '&:hover': {
                                      bgcolor: 'rgba(255, 255, 255, 0.7)',
                                    }
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteNote(note.id)}
                                  sx={{ 
                                    ml: 0.5,
                                    color: 'rgba(0, 0, 0, 0.6)',
                                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                                    '&:hover': {
                                      bgcolor: 'rgba(255, 255, 255, 0.7)',
                                    }
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </>
                        )}
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
              
              {/* Footer */}
              <Box 
                sx={{ 
                  p: 2, 
                  borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Tooltip title="Añadir nota">
                  <IconButton 
                    color="warning"
                    onClick={handleAddNote}
                    sx={{ 
                      bgcolor: theme.palette.warning.main + '20',
                      '&:hover': {
                        bgcolor: theme.palette.warning.main + '40',
                      }
                    }}
                  >
                    <Add />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}