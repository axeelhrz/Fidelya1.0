'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Chip,
  IconButton,
  Avatar,
  alpha,
  Divider,
} from '@mui/material';
import {
  Close,
  Add,
  Send,
  Info,
  CheckCircleOutline,
  Warning,
  Error,
  Campaign,
} from '@mui/icons-material';
import { NotificationFormData, NotificationType, NotificationPriority, NotificationCategory } from '@/types/notification';

interface CreateNotificationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: NotificationFormData) => Promise<void>;
  loading?: boolean;
}

const typeOptions: { value: NotificationType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'info', label: 'Información', icon: <Info />, color: '#3b82f6' },
  { value: 'success', label: 'Éxito', icon: <CheckCircleOutline />, color: '#10b981' },
  { value: 'warning', label: 'Advertencia', icon: <Warning />, color: '#f59e0b' },
  { value: 'error', label: 'Error', icon: <Error />, color: '#ef4444' },
  { value: 'announcement', label: 'Anuncio', icon: <Campaign />, color: '#8b5cf6' },
];

const priorityOptions: { value: NotificationPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Baja', color: '#6b7280' },
  { value: 'medium', label: 'Media', color: '#3b82f6' },
  { value: 'high', label: 'Alta', color: '#f59e0b' },
  { value: 'urgent', label: 'Urgente', color: '#ef4444' },
];

const categoryOptions: { value: NotificationCategory; label: string }[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'membership', label: 'Membresía' },
  { value: 'payment', label: 'Pagos' },
  { value: 'event', label: 'Eventos' },
  { value: 'general', label: 'General' },
];

export const CreateNotificationDialog: React.FC<CreateNotificationDialogProps> = ({
  open,
  onClose,
  onSave,
  loading = false
}) => {
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    category: 'general',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (field: keyof NotificationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.message.trim()) return;
    
    try {
      await onSave(formData);
      setFormData({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
        category: 'general',
        tags: []
      });
      setTagInput('');
      onClose();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const selectedType = typeOptions.find(t => t.value === formData.type);
  const selectedPriority = priorityOptions.find(p => p.value === formData.priority);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 20px 80px rgba(0,0,0,0.12)',
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={{
            p: 4,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.1,
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: alpha('#ffffff', 0.2),
                  color: 'white',
                }}
              >
                <Add />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
                  Nueva Notificación
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Crear y enviar notificación a los miembros
                </Typography>
              </Box>
            </Box>
            
            <IconButton
              onClick={onClose}
              sx={{
                color: 'white',
                bgcolor: alpha('#ffffff', 0.1),
                '&:hover': {
                  bgcolor: alpha('#ffffff', 0.2),
                }
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Title */}
          <TextField
            fullWidth
            label="Título de la notificación"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Ingrese un título descriptivo..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              }
            }}
          />

          {/* Message */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Mensaje"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Escriba el contenido de la notificación..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              }
            }}
          />

          {/* Type and Priority Row */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                renderValue={(value) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {selectedType && (
                      <>
                        <Box sx={{ color: selectedType.color }}>{selectedType.icon}</Box>
                        {selectedType.label}
                      </>
                    )}
                  </Box>
                )}
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: option.color }}>{option.icon}</Box>
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                renderValue={(value) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {selectedPriority && (
                      <>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: selectedPriority.color,
                          }}
                        />
                        {selectedPriority.label}
                      </>
                    )}
                  </Box>
                )}
              >
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: option.color,
                        }}
                      />
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Category */}
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Action URL and Label */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="URL de acción (opcional)"
              value={formData.actionUrl || ''}
              onChange={(e) => handleInputChange('actionUrl', e.target.value)}
              placeholder="https://..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />
            <TextField
              fullWidth
              label="Texto del botón (opcional)"
              value={formData.actionLabel || ''}
              onChange={(e) => handleInputChange('actionLabel', e.target.value)}
              placeholder="Ver más"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />
          </Box>

          <Divider />

          {/* Tags */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
              Etiquetas
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                placeholder="Agregar etiqueta..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />
              <Button
                onClick={handleAddTag}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  minWidth: 'auto',
                  px: 2,
                }}
              >
                <Add />
              </Button>
            </Box>

            {formData.tags && formData.tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                    sx={{
                      bgcolor: alpha('#6366f1', 0.1),
                      color: '#6366f1',
                      '& .MuiChip-deleteIcon': {
                        color: '#6366f1',
                      }
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.title.trim() || !formData.message.trim() || loading}
          startIcon={<Send />}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            }
          }}
        >
          {loading ? 'Enviando...' : 'Enviar Notificación'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
