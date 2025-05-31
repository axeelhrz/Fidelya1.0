'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
  useMediaQuery,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Restaurant,
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Info,
  Close as CloseIcon,
  CheckCircle,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from '../../types';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

interface MenuSelectorProps {
  menus: Menu[];
  selectedMenuId: string;
  onMenuSelect: (menuId: string) => void;
  onCreateMenu: (menuData: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  onUpdateMenu: (id: string, menuData: Partial<Menu>) => Promise<void>;
  onDeleteMenu: (id: string) => Promise<void>;
  connected: boolean;
  loading: boolean;
}

export default function MenuSelector({
  menus,
  selectedMenuId,
  onMenuSelect,
  onCreateMenu,
  onUpdateMenu,
  onDeleteMenu,
  connected,
  loading
}: MenuSelectorProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [deletingMenu, setDeletingMenu] = useState<Menu | null>(null);
  const [viewMode, setViewMode] = useState<'dropdown' | 'grid'>('dropdown');
  
  // Form states
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuDescription, setNewMenuDescription] = useState('');
  const [editMenuName, setEditMenuName] = useState('');
  const [editMenuDescription, setEditMenuDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedMenu = menus.find(m => m.id === selectedMenuId);

  const handleCreateMenu = async () => {
    if (!newMenuName.trim() || !newMenuDescription.trim()) return;

    setIsSubmitting(true);
    try {
      const menuData = {
        name: newMenuName.trim(),
        description: newMenuDescription.trim(),
        isActive: true,
        categories: [],
        restaurantInfo: {
          name: newMenuName.trim(),
          address: '',
          phone: '',
          hours: ''
        }
      };

      const menuId = await onCreateMenu(menuData);
      onMenuSelect(menuId);
      setShowCreateDialog(false);
      setNewMenuName('');
      setNewMenuDescription('');
    } catch (error) {
      console.error('Error creating menu:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMenu = async () => {
    if (!editingMenu || !editMenuName.trim() || !editMenuDescription.trim()) return;

    setIsSubmitting(true);
    try {
      await onUpdateMenu(editingMenu.id, {
        name: editMenuName.trim(),
        description: editMenuDescription.trim(),
      });
      setShowEditDialog(false);
      setEditingMenu(null);
      setEditMenuName('');
      setEditMenuDescription('');
    } catch (error) {
      console.error('Error updating menu:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMenu = async () => {
    if (!deletingMenu) return;

    setIsSubmitting(true);
    try {
      await onDeleteMenu(deletingMenu.id);
      
      // Si estamos eliminando el menú seleccionado, seleccionar otro
      if (deletingMenu.id === selectedMenuId) {
        const remainingMenus = menus.filter(m => m.id !== deletingMenu.id);
        if (remainingMenus.length > 0) {
          onMenuSelect(remainingMenus[0].id);
        } else {
          onMenuSelect('');
        }
      }
      
      setShowDeleteDialog(false);
      setDeletingMenu(null);
    } catch (error) {
      console.error('Error deleting menu:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMenuStatus = async (menu: Menu) => {
    try {
      await onUpdateMenu(menu.id, {
        isActive: !menu.isActive
      });
    } catch (error) {
      console.error('Error toggling menu status:', error);
    }
  };

  const openEditDialog = (menu: Menu) => {
    setEditingMenu(menu);
    setEditMenuName(menu.name);
    setEditMenuDescription(menu.description);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (menu: Menu) => {
    setDeletingMenu(menu);
    setShowDeleteDialog(true);
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography>Cargando menús...</Typography>
      </Paper>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper sx={{
        p: { xs: 2, md: 3 },
        mb: 3,
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(26, 26, 26, 0.8) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
      }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Restaurant sx={{ color: '#D4AF37', fontSize: 28 }} />
            <Typography variant="h6" sx={{ color: '#F8F8F8', fontWeight: 600 }}>
              Selector de Menús
            </Typography>
            <Chip
              label={`${menus.length} menú${menus.length !== 1 ? 's' : ''}`}
              size="small"
              sx={{
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                color: '#D4AF37',
                fontWeight: 600,
              }}
            />
          </Box>
          
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setViewMode(viewMode === 'dropdown' ? 'grid' : 'dropdown')}
              sx={{ borderRadius: 0, minWidth: 'auto', px: 2 }}
            >
              {viewMode === 'dropdown' ? 'Vista Grid' : 'Vista Lista'}
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowCreateDialog(true)}
              disabled={!connected}
              size="small"
              sx={{
                borderRadius: 0,
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #E8C547 0%, #D4AF37 100%)',
                },
              }}
            >
              Nuevo Menú
            </Button>
          </Box>
        </Box>

        {/* No hay menús */}
        {menus.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Restaurant sx={{ fontSize: 48, color: '#D4AF37', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom color="text.secondary">
              No hay menús creados
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Crea tu primer menú para comenzar a gestionar productos
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowCreateDialog(true)}
              disabled={!connected}
              sx={{
                borderRadius: 0,
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
              }}
            >
              Crear Primer Menú
            </Button>
          </Box>
        ) : (
          <>
            {/* Vista Dropdown */}
            {viewMode === 'dropdown' && (
              <Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Menú Activo</InputLabel>
                  <Select
                    value={selectedMenuId}
                    onChange={(e) => onMenuSelect(e.target.value)}
                    label="Menú Activo"
                    sx={{ borderRadius: 0 }}
                  >
                    {menus.map((menu) => (
                      <MenuItem key={menu.id} value={menu.id}>
                        <Box display="flex" alignItems="center" gap={2} width="100%">
                          <Box flex={1}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {menu.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {menu.description}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            {menu.isActive ? (
                              <Chip label="Activo" size="small" color="success" />
                            ) : (
                              <Chip label="Inactivo" size="small" color="default" />
                            )}
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Información del menú seleccionado */}
                {selectedMenu && (
                  <Box sx={{
                    p: 2,
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderRadius: 0,
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                  }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box flex={1}>
                        <Typography variant="subtitle1" sx={{ color: '#D4AF37', fontWeight: 600, mb: 0.5 }}>
                          {selectedMenu.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#F8F8F8', mb: 1 }}>
                          {selectedMenu.description}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#B8B8B8' }}>
                          Creado: {new Date(selectedMenu.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" gap={1}>
                        <Tooltip title={selectedMenu.isActive ? "Desactivar menú" : "Activar menú"}>
                          <IconButton
                            size="small"
                            onClick={() => toggleMenuStatus(selectedMenu)}
                            sx={{ color: selectedMenu.isActive ? '#10B981' : '#B8B8B8' }}
                          >
                            {selectedMenu.isActive ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar menú">
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(selectedMenu)}
                            sx={{ color: '#3B82F6' }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar menú">
                          <IconButton
                            size="small"
                            onClick={() => openDeleteDialog(selectedMenu)}
                            sx={{ color: '#F87171' }}
                            disabled={menus.length === 1}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Chip
                        icon={selectedMenu.isActive ? <CheckCircle /> : <Info />}
                        label={selectedMenu.isActive ? "Menú Activo" : "Menú Inactivo"}
                        size="small"
                        color={selectedMenu.isActive ? "success" : "default"}
                      />
                      <Chip
                        label={`ID: ${selectedMenu.id.slice(0, 8)}...`}
                        size="small"
                        variant="outlined"
                        sx={{ color: '#B8B8B8', borderColor: 'rgba(184, 184, 184, 0.3)' }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* Vista Grid */}
            {viewMode === 'grid' && (
              <Grid container spacing={2}>
                <AnimatePresence>
                  {menus.map((menu, index) => (
                    <Grid item xs={12} sm={6} md={4} key={menu.id}>
                      <MotionCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        sx={{
                          background: selectedMenuId === menu.id 
                            ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(26, 26, 26, 0.8) 100%)'
                            : 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(44, 44, 46, 0.4) 100%)',
                          border: selectedMenuId === menu.id 
                            ? '2px solid rgba(212, 175, 55, 0.5)'
                            : '1px solid rgba(212, 175, 55, 0.2)',
                          borderRadius: 0,
                          cursor: 'pointer',
                          '&:hover': {
                            border: '2px solid rgba(212, 175, 55, 0.4)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease',
                          },
                        }}
                      >
                        <CardActionArea onClick={() => onMenuSelect(menu.id)}>
                          <CardContent sx={{ p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                              <Box flex={1}>
                                <Typography variant="subtitle1" sx={{ 
                                  color: selectedMenuId === menu.id ? '#D4AF37' : '#F8F8F8', 
                                  fontWeight: 600,
                                  mb: 0.5
                                }}>
                                  {menu.name}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  color: '#B8B8B8',
                                  fontSize: '0.8rem',
                                  lineHeight: 1.3,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}>
                                  {menu.description}
                                </Typography>
                              </Box>
                              
                              {selectedMenuId === menu.id && (
                                <CheckCircle sx={{ color: '#D4AF37', fontSize: 20 }} />
                              )}
                            </Box>
                            
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Chip
                                label={menu.isActive ? "Activo" : "Inactivo"}
                                size="small"
                                color={menu.isActive ? "success" : "default"}
                                sx={{ fontSize: '0.7rem' }}
                              />
                              
                              <Box display="flex" gap={0.5}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMenuStatus(menu);
                                  }}
                                  sx={{ color: menu.isActive ? '#10B981' : '#B8B8B8' }}
                                >
                                  {menu.isActive ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditDialog(menu);
                                  }}
                                  sx={{ color: '#3B82F6' }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDeleteDialog(menu);
                                  }}
                                  sx={{ color: '#F87171' }}
                                  disabled={menus.length === 1}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </MotionCard>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            )}
          </>
        )}
      </Paper>

      {/* Dialog para crear menú */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 0,
            backgroundColor: '#2C2C2E',
            backgroundImage: 'none',
            border: isMobile ? 'none' : '1px solid rgba(212, 175, 55, 0.2)',
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" sx={{ color: '#F8F8F8' }}>
              Crear Nuevo Menú
            </Typography>
            {isMobile && (
              <IconButton onClick={() => setShowCreateDialog(false)} sx={{ color: '#B8B8B8' }}>
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} pt={1}>
            <TextField
              fullWidth
              label="Nombre del Menú"
              value={newMenuName}
              onChange={(e) => setNewMenuName(e.target.value)}
              placeholder="Ej: Menú Principal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            />
            <TextField
              fullWidth
              label="Descripción"
              value={newMenuDescription}
              onChange={(e) => setNewMenuDescription(e.target.value)}
              placeholder="Ej: Nuestro delicioso menú con los mejores platos"
              multiline
              rows={3}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          {!isMobile && (
            <Button onClick={() => setShowCreateDialog(false)} sx={{ color: '#B8B8B8' }}>
              Cancelar
            </Button>
          )}
          <Button
            onClick={handleCreateMenu}
            variant="contained"
            disabled={!newMenuName.trim() || !newMenuDescription.trim() || !connected || isSubmitting}
            sx={{
              borderRadius: 0,
              flex: isMobile ? 1 : 'none',
            }}
          >
            {isSubmitting ? 'Creando...' : 'Crear Menú'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para editar menú */}
      <Dialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            backgroundColor: '#2C2C2E',
            backgroundImage: 'none',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" sx={{ color: '#F8F8F8' }}>
              Editar Menú
            </Typography>
            <IconButton onClick={() => setShowEditDialog(false)} sx={{ color: '#B8B8B8' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} pt={1}>
            <TextField
              fullWidth
              label="Nombre del Menú"
              value={editMenuName}
              onChange={(e) => setEditMenuName(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            />
            <TextField
              fullWidth
              label="Descripción"
              value={editMenuDescription}
              onChange={(e) => setEditMenuDescription(e.target.value)}
              multiline
              rows={3}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowEditDialog(false)} sx={{ color: '#B8B8B8' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleEditMenu}
            variant="contained"
            disabled={!editMenuName.trim() || !editMenuDescription.trim() || isSubmitting}
            sx={{ borderRadius: 0 }}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            backgroundColor: '#2C2C2E',
            backgroundImage: 'none',
            border: '1px solid rgba(248, 113, 113, 0.3)',
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ color: '#F87171' }}>
            Confirmar Eliminación
          </Typography>
        </DialogTitle>
        <DialogContent>
          {deletingMenu && (
            <Box>
              <Alert severity="warning" sx={{ mb: 2, borderRadius: 0 }}>
                Esta acción no se puede deshacer
              </Alert>
              <Typography variant="body1" sx={{ color: '#F8F8F8', mb: 2 }}>
                ¿Estás seguro de que quieres eliminar el menú <strong>"{deletingMenu.name}"</strong>?
              </Typography>
              <Typography variant="body2" sx={{ color: '#B8B8B8' }}>
                Se eliminarán todos los productos y categorías asociados a este menú.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowDeleteDialog(false)} sx={{ color: '#B8B8B8' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteMenu}
            variant="contained"
            color="error"
            disabled={isSubmitting}
            sx={{ borderRadius: 0 }}
          >
            {isSubmitting ? 'Eliminando...' : 'Eliminar Menú'}
          </Button>
        </DialogActions>
      </Dialog>
    </MotionBox>
  );
}