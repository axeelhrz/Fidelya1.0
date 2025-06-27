'use client';

import React, { useState, useEffect } from 'react';
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
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  LinearProgress,
  Alert,
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
  Schedule,
  Link,
  Preview,
  ExpandMore,
  Save,
  Refresh,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { NotificationFormData, NotificationType, NotificationPriority, NotificationCategory } from '@/types/notification';

interface CreateNotificationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: NotificationFormData) => Promise<void>;
  loading?: boolean;
}

const typeOptions: { value: NotificationType; label: string; icon: React.ReactNode; color: string; description: string }[] = [
  { 
    value: 'info', 
    label: 'Información', 
    icon: <Info />, 
    color: '#3b82f6',
    description: 'Información general o actualizaciones del sistema'
  },
  { 
    value: 'success', 
    label: 'Éxito', 
    icon: <CheckCircleOutline />, 
    color: '#10b981',
    description: 'Confirmaciones y operaciones exitosas'
  },
  { 
    value: 'warning', 
    label: 'Advertencia', 
    icon: <Warning />, 
    color: '#f59e0b',
    description: 'Situaciones que requieren atención'
  },
  { 
    value: 'error', 
    label: 'Error', 
    icon: <Error />, 
    color: '#ef4444',
    description: 'Errores críticos que requieren acción inmediata'
  },
  { 
    value: 'announcement', 
    label: 'Anuncio', 
    icon: <Campaign />, 
    color: '#8b5cf6',
    description: 'Comunicados importantes y eventos'
  },
];

const priorityOptions: { value: NotificationPriority; label: string; color: string; description: string }[] = [
  { 
    value: 'low', 
    label: 'Baja', 
    color: '#6b7280',
    description: 'Información no crítica'
  },
  { 
    value: 'medium', 
    label: 'Media', 
    color: '#3b82f6',
    description: 'Información importante pero no urgente'
  },
  { 
    value: 'high', 
    label: 'Alta', 
    color: '#f59e0b',
    description: 'Requiere atención pronta'
  },
  { 
    value: 'urgent', 
    label: 'Urgente', 
    color: '#ef4444',
    description: 'Requiere atención inmediata'
  },
];

const categoryOptions: { value: NotificationCategory; label: string; description: string }[] = [
  { 
    value: 'system', 
    label: 'Sistema', 
    description: 'Notificaciones del sistema y mantenimiento'
  },
  { 
    value: 'membership', 
    label: 'Membresía', 
    description: 'Relacionadas con miembros y registros'
  },
  { 
    value: 'payment', 
    label: 'Pagos', 
    description: 'Pagos, cuotas y facturación'
  },
  { 
    value: 'event', 
    label: 'Eventos', 
    description: 'Eventos, reuniones y actividades'
  },
  { 
    value: 'general', 
    label: 'General', 
    description: 'Comunicaciones generales'
  },
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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hasExpiration, setHasExpiration] = useState(false);
  const [hasAction, setHasAction] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expirationDate, setExpirationDate] = useState('');
  const [expirationTime, setExpirationTime] = useState('');

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
        category: 'general',
        tags: []
      });
      setTagInput('');
      setShowAdvanced(false);
      setShowPreview(false);
      setHasExpiration(false);
      setHasAction(false);
      setErrors({});
      setExpirationDate('');
      setExpirationTime('');
    }
  }, [open]);

  const handleInputChange = (
    field: keyof NotificationFormData,
    value: string | string[] | Date | undefined
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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

  const handleExpirationChange = () => {
    if (expirationDate && expirationTime) {
      const dateTime = new Date(`${expirationDate}T${expirationTime}`);
      handleInputChange('expiresAt', dateTime);
    }
  };

  useEffect(() => {
    if (hasExpiration) {
      handleExpirationChange();
    }
  }, [expirationDate, expirationTime, hasExpiration]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    } else if (formData.title.length > 100) {
      newErrors.title = 'El título no puede exceder 100 caracteres';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es obligatorio';
    } else if (formData.message.length > 500) {
      newErrors.message = 'El mensaje no puede exceder 500 caracteres';
    }

    if (hasAction) {
      if (formData.actionUrl && !isValidUrl(formData.actionUrl)) {
        newErrors.actionUrl = 'URL inválida';
      }
      if (formData.actionUrl && !formData.actionLabel) {
        newErrors.actionLabel = 'El texto del botón es obligatorio cuando se especifica una URL';
      }
    }

    if (hasExpiration) {
      if (!expirationDate || !expirationTime) {
        newErrors.expiration = 'Fecha y hora de expiración son obligatorias';
      } else {
        const dateTime = new Date(`${expirationDate}T${expirationTime}`);
        if (dateTime <= new Date()) {
          newErrors.expiration = 'La fecha de expiración debe ser futura';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      const submitData = {
        ...formData,
        expiresAt: hasExpiration && expirationDate && expirationTime 
          ? new Date(`${expirationDate}T${expirationTime}`) 
          : undefined,
        actionUrl: hasAction ? formData.actionUrl : undefined,
        actionLabel: hasAction ? formData.actionLabel : undefined,
      };

      await onSave(submitData);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const selectedType = typeOptions.find(t => t.value === formData.type);
  const selectedPriority = priorityOptions.find(p => p.value === formData.priority);
  const selectedCategory = categoryOptions.find(c => c.value === formData.category);

  const characterCount = {
    title: formData.title.length,
    message: formData.message.length,
  };

  // Get current date and time for min values
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 20px 80px rgba(0,0,0,0.12)',
            maxHeight: '90vh',
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
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Vista previa">
                  <IconButton
                    onClick={() => setShowPreview(!showPreview)}
                    sx={{
                      color: 'white',
                      bgcolor: showPreview ? alpha('#ffffff', 0.2) : alpha('#ffffff', 0.1),
                      '&:hover': {
                        bgcolor: alpha('#ffffff', 0.2),
                      }
                    }}
                  >
                    <Preview />
                  </IconButton>
                </Tooltip>
                
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

            {loading && (
              <LinearProgress
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: alpha('#ffffff', 0.2),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'white',
                  }
                }}
              />
            )}
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 4, maxHeight: '60vh', overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Title */}
            <Box>
              <TextField
                fullWidth
                label="Título de la notificación"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ingrese un título descriptivo..."
                error={!!errors.title}
                helperText={errors.title || `${characterCount.title}/100 caracteres`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />
            </Box>

            {/* Message */}
            <Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Mensaje"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Escriba el contenido de la notificación..."
                error={!!errors.message}
                helperText={errors.message || `${characterCount.message}/500 caracteres`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />
            </Box>

            {/* Type and Priority Row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  renderValue={() => (
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Box sx={{ color: option.color }}>{option.icon}</Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {option.label}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {option.description}
                          </Typography>
                        </Box>
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
                  renderValue={() => (
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: option.color,
                          }}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {option.label}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {option.description}
                          </Typography>
                        </Box>
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
                renderValue={() => selectedCategory?.label}
              >
                {categoryOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {option.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {option.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Advanced Options */}
            <Accordion expanded={showAdvanced} onChange={() => setShowAdvanced(!showAdvanced)}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Opciones Avanzadas
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Action URL Toggle */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={hasAction}
                        onChange={(e) => setHasAction(e.target.checked)}
                      />
                    }
                    label="Agregar botón de acción"
                  />

                  {/* Action URL and Label */}
                  {hasAction && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        fullWidth
                        label="URL de acción"
                        value={formData.actionUrl || ''}
                        onChange={(e) => handleInputChange('actionUrl', e.target.value)}
                        placeholder="https://..."
                        error={!!errors.actionUrl}
                        helperText={errors.actionUrl}
                        InputProps={{
                          startAdornment: <Link sx={{ color: '#94a3b8', mr: 1 }} />,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          }
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Texto del botón"
                        value={formData.actionLabel || ''}
                        onChange={(e) => handleInputChange('actionLabel', e.target.value)}
                        placeholder="Ver más"
                        error={!!errors.actionLabel}
                        helperText={errors.actionLabel}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          }
                        }}
                      />
                    </Box>
                  )}

                  {/* Expiration Toggle */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={hasExpiration}
                        onChange={(e) => setHasExpiration(e.target.checked)}
                      />
                    }
                    label="Establecer fecha de expiración"
                  />

                  {/* Expiration Date and Time */}
                  {hasExpiration && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Fecha de expiración"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: currentDate }}
                        error={!!errors.expiration}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          }
                        }}
                      />
                      <TextField
                        fullWidth
                        type="time"
                        label="Hora de expiración"
                        value={expirationTime}
                        onChange={(e) => setExpirationTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ 
                          min: expirationDate === currentDate ? currentTime : undefined 
                        }}
                        error={!!errors.expiration}
                        helperText={errors.expiration}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          }
                        }}
                      />
                    </Box>
                  )}

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
                        disabled={!tagInput.trim()}
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
              </AccordionDetails>
            </Accordion>

            {/* Preview */}
            {showPreview && formData.title && formData.message && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
                  Vista Previa
                </Typography>
                <Alert
                  severity={formData.type === 'error' ? 'error' : formData.type === 'warning' ? 'warning' : formData.type === 'success' ? 'success' : 'info'}
                  sx={{ borderRadius: 3 }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    {formData.title}
                  </Typography>
                  <Typography variant="body2">
                    {formData.message}
                  </Typography>
                  {formData.tags && formData.tags.length > 0 && (
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {formData.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  )}
                </Alert>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 4, pt: 0 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={loading}
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
            startIcon={loading ? <Refresh sx={{ animation: 'spin 1s linear infinite' }} /> : <Send />}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              },
              '&:disabled': {
                background: '#e2e8f0',
                color: '#94a3b8',
              }
            }}
          >
            {loading ? 'Enviando...' : 'Enviar Notificación'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};