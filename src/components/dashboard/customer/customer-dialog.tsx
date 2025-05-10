import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Chip,
  Autocomplete,
  Divider,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Label as LabelIcon,
} from '@mui/icons-material';
import { Customer, CustomerDialogProps, CustomerTag } from '@/types/customer';
import { useAuth } from '@/hooks/use-auth';
import { collection, addDoc, doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CustomerDialog: React.FC<CustomerDialogProps> = ({
  open,
  onClose,
  customer,
  title = 'Nuevo cliente',
  onSuccess,
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<CustomerTag[]>([]);

  // Form state
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    company: '',
    occupation: '',
    gender: 'other',
    civilStatus: 'single',
    type: 'individual',
    status: 'active',
    riskLevel: 'low',
    notes: '',
    tags: [],
  });

  // Form validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Birth date state
  const [birthDate, setBirthDate] = useState<Date | null>(null);

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      if (!user?.uid) return;
      try {
        const tagsRef = doc(db, `users/${user.uid}/settings/customerTags`);
        const tagsDoc = await getDoc(tagsRef);
        if (tagsDoc.exists()) {
          const tagsData = tagsDoc.data();
          setAvailableTags(tagsData.tags || []);
        } else {
          setAvailableTags([]);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, [user]);

  // Initialize form data when customer changes
  useEffect(() => {
    if (customer) {
      setFormData({
        ...customer,
        // Ensure tags is an array
        tags: customer.tags || [],
      });
      // Set birth date
      if (customer.birthDate) {
        try {
          setBirthDate(customer.birthDate.toDate());
        } catch {
          setBirthDate(null);
        }
      } else {
        setBirthDate(null);
      }
    } else {
      // Reset form for new customer
      setFormData({
        name: '',
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        company: '',
        occupation: '',
        gender: 'other',
        civilStatus: 'single',
        type: 'individual',
        status: 'active',
        riskLevel: 'low',
        notes: '',
        tags: [],
      });
      setBirthDate(null);
    }
    // Reset errors
    setFormErrors({});
    setError(null);
  }, [customer, open]);

  // Handle text field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle select changes
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle tags change
  const handleTagsChange = (event: React.SyntheticEvent, newValue: CustomerTag[]) => {
    setFormData(prev => ({
      ...prev,
      tags: newValue
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name) {
      errors.name = 'El nombre es obligatorio';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El formato del email es inválido';
    }
    if (formData.phone && !/^[0-9+\-\s()]*$/.test(formData.phone)) {
      errors.phone = 'El formato del teléfono es inválido';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (!user) {
        setError("Usuario no autenticado");
        setLoading(false);
        return;
      }
      // Prepare customer data
      const customerData: Partial<Customer> = {
        ...formData,
        userId: user.uid,
        birthDate: birthDate ? Timestamp.fromDate(birthDate) : Timestamp.now(),
      };
      // Ensure fullName is set
      if (!customerData.fullName) {
        customerData.fullName = customerData.name;
      }
      if (customer) {
        // Update existing customer
        await updateDoc(doc(db, 'customers', customer.id), customerData);
      } else {
        // Add new customer
        customerData.createdAt = Timestamp.now();
        customerData.registeredAt = Timestamp.now();
        await addDoc(collection(db, 'customers'), customerData);
      }
      setLoading(false);
      // Call success callback
      if (onSuccess) {
        const success = await onSuccess(customerData);
        if (success) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      setError('Error al guardar el cliente. Por favor, inténtalo de nuevo.');
      setLoading(false);
    }
  };

  const inputSx = {
    '& .MuiInputLabel-root': {
      fontFamily: "'Sora', sans-serif",
    },
    '& .MuiInputBase-input': {
      fontFamily: "'Sora', sans-serif",
    },
    mb: 3,
    width: '100%'
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="h6"
          fontFamily="'Sora', sans-serif"
          fontWeight={600}
        >
          {title}
        </Typography>
        {!loading && (
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            fontFamily="'Sora', sans-serif"
            fontWeight={600}
          >
            Información básica
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                label="Nombre"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.name}
                helperText={formErrors.name}
                sx={inputSx}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                label="Nombre completo"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleChange}
                fullWidth
                sx={inputSx}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.email}
                helperText={formErrors.email}
                sx={inputSx}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                label="Teléfono"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                sx={inputSx}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha de nacimiento"
                  value={birthDate}
                  onChange={(newValue) => setBirthDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: inputSx
                    }
                  }}
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <FormControl fullWidth sx={inputSx}>
                <InputLabel id="gender-label" sx={{ fontFamily: "'Sora', sans-serif" }}>Género</InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  value={formData.gender || 'other'}
                  onChange={handleSelectChange}
                  label="Género"
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  <MenuItem value="male">Masculino</MenuItem>
                  <MenuItem value="female">Femenino</MenuItem>
                  <MenuItem value="other">Otro</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth sx={inputSx}>
              <InputLabel id="civil-status-label" sx={{ fontFamily: "'Sora', sans-serif" }}>Estado civil</InputLabel>
              <Select
                labelId="civil-status-label"
                name="civilStatus"
                value={formData.civilStatus || 'single'}
                onChange={handleSelectChange}
                label="Estado civil"
                sx={{
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                <MenuItem value="single">Soltero/a</MenuItem>
                <MenuItem value="married">Casado/a</MenuItem>
                <MenuItem value="divorced">Divorciado/a</MenuItem>
                <MenuItem value="widowed">Viudo/a</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            fontFamily="'Sora', sans-serif"
            fontWeight={600}
          >
            Dirección
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '1 1 calc(70% - 8px)', minWidth: '250px' }}>
              <TextField
                label="Dirección"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                fullWidth
                sx={inputSx}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(30% - 8px)', minWidth: '150px' }}>
              <TextField
                label="Ciudad"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                fullWidth
                sx={inputSx}
              />
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            fontFamily="'Sora', sans-serif"
            fontWeight={600}
          >
            Información profesional
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                label="Empresa"
                name="company"
                value={formData.company || ''}
                onChange={handleChange}
                fullWidth
                sx={inputSx}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                label="Ocupación"
                name="occupation"
                value={formData.occupation || ''}
                onChange={handleChange}
                fullWidth
                sx={inputSx}
              />
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            fontFamily="'Sora', sans-serif"
            fontWeight={600}
          >
            Clasificación
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ flex: '1 1 calc(33.33% - 8px)', minWidth: '200px' }}>
              <FormControl fullWidth sx={inputSx}>
                <InputLabel id="type-label" sx={{ fontFamily: "'Sora', sans-serif" }}>Tipo</InputLabel>
                <Select
                  labelId="type-label"
                  name="type"
                  value={formData.type || 'individual'}
                  onChange={handleSelectChange}
                  label="Tipo"
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="business">Empresa</MenuItem>
                  <MenuItem value="family">Familia</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 calc(33.33% - 8px)', minWidth: '200px' }}>
              <FormControl fullWidth sx={inputSx}>
                <InputLabel id="status-label" sx={{ fontFamily: "'Sora', sans-serif" }}>Estado</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status || 'active'}
                  onChange={handleSelectChange}
                  label="Estado"
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                  <MenuItem value="lead">Lead</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 calc(33.33% - 8px)', minWidth: '200px' }}>
              <FormControl fullWidth sx={inputSx}>
                <InputLabel id="risk-level-label" sx={{ fontFamily: "'Sora', sans-serif" }}>Nivel de riesgo</InputLabel>
                <Select
                  labelId="risk-level-label"
                  name="riskLevel"
                  value={formData.riskLevel || 'low'}
                  onChange={handleSelectChange}
                  label="Nivel de riesgo"
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  <MenuItem value="low">Bajo</MenuItem>
                  <MenuItem value="medium">Medio</MenuItem>
                  <MenuItem value="high">Alto</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Autocomplete
              multiple
              id="tags"
              options={availableTags}
              value={formData.tags || []}
              onChange={handleTagsChange}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box
                    component="span"
                    sx={{
                      width: 14,
                      height: 14,
                      mr: 1,
                      borderRadius: '50%',
                      bgcolor: option.color,
                      display: 'inline-block',
                    }}
                  />
                  {option.name}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Etiquetas"
                  placeholder="Selecciona etiquetas"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <LabelIcon color="action" sx={{ mr: 1 }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                  sx={inputSx}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.id}
                    label={option.name}
                    size="small"
                    sx={{
                      bgcolor: alpha(option.color, 0.1),
                      color: option.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                      borderRadius: '6px',
                    }}
                  />
                ))
              }
            />
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            fontFamily="'Sora', sans-serif"
            fontWeight={600}
          >
            Notas
          </Typography>
          
          <TextField
            label="Notas"
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            sx={inputSx}
          />
        </Box>
        
        {error && (
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              mt: 2,
              '& .MuiAlert-message': {
                fontFamily: "'Sora', sans-serif",
              }
            }}
          >
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: 2,
            py: 1,
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          sx={{
            borderRadius: 2,
            py: 1,
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerDialog;