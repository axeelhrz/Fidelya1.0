'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  IconButton,
  InputAdornment,
  alpha,
  useTheme,
  Divider,
  CircularProgress,
  Box,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  CalendarMonth as CalendarMonthIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { Policy } from '@/types/policy';
import { Timestamp } from 'firebase/firestore';
import { SelectChangeEvent } from '@mui/material/Select';

interface PolicyFormDialogProps {
  open: boolean;
  onClose: () => void;
  policy: Policy | null;
  isEditMode: boolean;
  onSave: (policy: Partial<Policy>, isEdit: boolean, policyId?: string) => Promise<boolean>;
}

const PolicyFormDialog: React.FC<PolicyFormDialogProps> = ({
  open,
  onClose,
  policy,
  isEditMode,
  onSave
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Policy>>({
    policyNumber: '',
    customerName: '',
    type: '',
    company: '',
    premium: 0,
    startDate: Timestamp.fromDate(new Date()),
    endDate: Timestamp.fromDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
    status: 'active',
    notes: '',
    isStarred: false,
    isArchived: false,
    isRenewal: false,
    // Añadir campos requeridos que faltaban
    customerId: '',
    coverage: 0,
    paymentFrequency: 'annual',
    errors: [],
  });

  useEffect(() => {
    if (policy && open) {
      setFormData({
        policyNumber: policy.policyNumber,
        customerName: policy.customerName,
        type: policy.type,
        company: policy.company,
        premium: policy.premium,
        startDate: policy.startDate,
        endDate: policy.endDate,
        status: policy.status,
        notes: policy.notes || '',
        isStarred: policy.isStarred || false,
        isArchived: policy.isArchived || false,
        isRenewal: policy.isRenewal || false,
        // Añadir campos requeridos que faltaban
        customerId: policy.customerId || '',
        coverage: policy.coverage || 0,
        paymentFrequency: policy.paymentFrequency || 'annual',
        errors: policy.errors || [],
      });
    } else if (open) {
      // Reset form for new policy
      setFormData({
        policyNumber: '',
        customerName: '',
        type: '',
        company: '',
        premium: 0,
        startDate: Timestamp.fromDate(new Date()),
        endDate: Timestamp.fromDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
        status: 'active',
        notes: '',
        isStarred: false,
        isArchived: false,
        isRenewal: false,
        // Añadir campos requeridos que faltaban
        customerId: '',
        coverage: 0,
        paymentFrequency: 'annual',
        errors: [],
      });
    }
  }, [policy, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, [name]: Timestamp.fromDate(date) }));
    }
  };

  const handlePremiumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, premium: isNaN(value) ? 0 : value }));
  };

  const handleCoverageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, coverage: isNaN(value) ? 0 : value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Asegurarse de que todos los campos requeridos estén presentes
      const completePolicy: Partial<Policy> = {
        ...formData,
        errors: formData.errors || [],
        customerId: formData.customerId || '',
        coverage: formData.coverage || 0,
        paymentFrequency: formData.paymentFrequency || 'annual',
      };
      
      console.log("Guardando póliza con datos:", completePolicy);
      
      const success = await onSave(completePolicy, isEditMode, policy?.id);
      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.policyNumber &&
      formData.customerName &&
      formData.type &&
      formData.company &&
      formData.premium !== undefined &&
      formData.premium >= 0 &&
      formData.startDate &&
      formData.endDate &&
      formData.status
    );
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
          borderRadius: '16px',
          background: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.9)
            : alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle sx={{
        p: 3,
        fontFamily: 'Sora, sans-serif',
        fontWeight: 700,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {isEditMode ? 'Editar Póliza' : 'Nueva Póliza'}
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          disabled={loading}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ opacity: 0.6 }} />
      <DialogContent sx={{ p: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <Stack spacing={3}>
            {/* Información básica */}
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                fontFamily="Sora, sans-serif"
                sx={{ mb: 2 }}
              >
                Información Básica
              </Typography>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <Box sx={{ width: '100%', flex: { xs: '1 1 100%', sm: '1 1 50%' } }}>
                  <TextField
                    name="policyNumber"
                    label="Número de Póliza"
                    value={formData.policyNumber}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    disabled={loading}
                    InputProps={{
                      sx: {
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }
                    }}
                    InputLabelProps={{
                      sx: {
                        fontFamily: 'Inter, sans-serif',
                      }
                    }}
                  />
                </Box>
                <Box sx={{ width: '100%', flex: { xs: '1 1 100%', sm: '1 1 50%' } }}>
                  <TextField
                    name="customerName"
                    label="Nombre del Cliente"
                    value={formData.customerName}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    disabled={loading}
                    InputProps={{
                      sx: {
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }
                    }}
                    InputLabelProps={{
                      sx: {
                        fontFamily: 'Inter, sans-serif',
                      }
                    }}
                  />
                </Box>
              </Stack>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 2 }}>
                <Box sx={{ width: '100%', flex: { xs: '1 1 100%', sm: '1 1 50%' } }}>
                  <FormControl fullWidth required variant="outlined" disabled={loading}>
                    <InputLabel id="type-label" sx={{ fontFamily: 'Inter, sans-serif' }}>Tipo de Póliza</InputLabel>
                    <Select
                      labelId="type-label"
                      name="type"
                      value={formData.type}
                      onChange={handleSelectChange}
                      label="Tipo de Póliza"
                      sx={{
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {['Auto', 'Vida', 'Hogar', 'Salud', 'Viaje', 'Negocio', 'Responsabilidad Civil', 'Otro'].map((type) => (
                        <MenuItem key={type} value={type} sx={{ fontFamily: 'Inter, sans-serif' }}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ width: '100%', flex: { xs: '1 1 100%', sm: '1 1 50%' } }}>
                  <FormControl fullWidth required variant="outlined" disabled={loading}>
                    <InputLabel id="company-label" sx={{ fontFamily: 'Inter, sans-serif' }}>Compañía Aseguradora</InputLabel>
                    <Select
                      labelId="company-label"
                      name="company"
                      value={formData.company}
                      onChange={handleSelectChange}
                      label="Compañía Aseguradora"
                      sx={{
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {['Mapfre', 'Allianz', 'AXA', 'Generali', 'Zurich', 'Liberty', 'Mutua Madrileña', 'Reale', 'Pelayo', 'Catalana Occidente', 'Otra'].map((company) => (
                        <MenuItem key={company} value={company} sx={{ fontFamily: 'Inter, sans-serif' }}>
                          {company}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
            </Box>

            {/* Detalles financieros */}
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                fontFamily="Sora, sans-serif"
                sx={{ mb: 2 }}
              >
                Detalles Financieros
              </Typography>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <Box sx={{ width: '100%', flex: { xs: '1 1 100%', sm: '1 1 50%' } }}>
                  <TextField
                    name="premium"
                    label="Prima Anual"
                    value={formData.premium}
                    onChange={handlePremiumChange}
                    fullWidth
                    required
                    type="number"
                    variant="outlined"
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }
                    }}
                    InputLabelProps={{
                      sx: {
                        fontFamily: 'Inter, sans-serif',
                      }
                    }}
                  />
                </Box>
                <Box sx={{ width: '100%', flex: { xs: '1 1 100%', sm: '1 1 50%' } }}>
                  <FormControl fullWidth required variant="outlined" disabled={loading}>
                    <InputLabel id="status-label" sx={{ fontFamily: 'Inter, sans-serif' }}>Estado</InputLabel>
                    <Select
                      labelId="status-label"
                      name="status"
                      value={formData.status}
                      onChange={handleSelectChange}
                      label="Estado"
                      sx={{
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      <MenuItem value="active" sx={{ fontFamily: 'Inter, sans-serif' }}>Activa</MenuItem>
                      <MenuItem value="expired" sx={{ fontFamily: 'Inter, sans-serif' }}>Vencida</MenuItem>
                      <MenuItem value="pending" sx={{ fontFamily: 'Inter, sans-serif' }}>Pendiente</MenuItem>
                      <MenuItem value="review" sx={{ fontFamily: 'Inter, sans-serif' }}>En revisión</MenuItem>
                      <MenuItem value="cancelled" sx={{ fontFamily: 'Inter, sans-serif' }}>Cancelada</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
              
              {/* Añadir campos adicionales requeridos */}
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 2 }}>
                <Box sx={{ width: '100%', flex: { xs: '1 1 100%', sm: '1 1 50%' } }}>
                  <TextField
                    name="coverage"
                    label="Cobertura"
                    value={formData.coverage}
                    onChange={handleCoverageChange}
                    fullWidth
                    type="number"
                    variant="outlined"
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }
                    }}
                    InputLabelProps={{
                      sx: {
                        fontFamily: 'Inter, sans-serif',
                      }
                    }}
                  />
                </Box>
                <Box sx={{ width: '100%', flex: { xs: '1 1 100%', sm: '1 1 50%' } }}>
                  <FormControl fullWidth variant="outlined" disabled={loading}>
                    <InputLabel id="payment-frequency-label" sx={{ fontFamily: 'Inter, sans-serif' }}>Frecuencia de Pago</InputLabel>
                    <Select
                      labelId="payment-frequency-label"
                      name="paymentFrequency"
                      value={formData.paymentFrequency || 'annual'}
                      onChange={handleSelectChange}
                      label="Frecuencia de Pago"
                      sx={{
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      <MenuItem value="monthly" sx={{ fontFamily: 'Inter, sans-serif' }}>Mensual</MenuItem>
                      <MenuItem value="quarterly" sx={{ fontFamily: 'Inter, sans-serif' }}>Trimestral</MenuItem>
                      <MenuItem value="biannual" sx={{ fontFamily: 'Inter, sans-serif' }}>Semestral</MenuItem>
                      <MenuItem value="annual" sx={{ fontFamily: 'Inter, sans-serif' }}>Anual</MenuItem>
                      <MenuItem value="single" sx={{ fontFamily: 'Inter, sans-serif' }}>Pago Único</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
            </Box>

            {/* Fechas */}
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                fontFamily="Sora, sans-serif"
                sx={{ mb: 2 }}
              >
                Vigencia
              </Typography>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <Box sx={{ width: '100%', flex: { xs: '1 1 100%', sm: '1 1 50%' } }}>
                  <DatePicker
                    label="Fecha de Inicio"
                    value={formData.startDate?.toDate()}
                    onChange={(date) => handleDateChange('startDate', date)}
                    disabled={loading}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        variant: "outlined",
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarMonthIcon />
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: '12px',
                            fontFamily: 'Inter, sans-serif',
                          }
                        },
                        InputLabelProps: {
                          sx: {
                            fontFamily: 'Inter, sans-serif',
                          }
                        }
                      }
                    }}
                  />
                </Box>
                <Box sx={{ width: '100%', flex: { xs: '1 1 100%', sm: '1 1 50%' } }}>
                  <DatePicker
                    label="Fecha de Vencimiento"
                    value={formData.endDate?.toDate()}
                    onChange={(date) => handleDateChange('endDate', date)}
                    disabled={loading}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        variant: "outlined",
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarMonthIcon />
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: '12px',
                            fontFamily: 'Inter, sans-serif',
                          }
                        },
                        InputLabelProps: {
                          sx: {
                            fontFamily: 'Inter, sans-serif',
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Stack>
            </Box>

            {/* Notas */}
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                fontFamily="Sora, sans-serif"
                sx={{ mb: 2 }}
              >
                Notas Adicionales
              </Typography>
              <TextField
                name="notes"
                label="Notas"
                value={formData.notes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                disabled={loading}
                InputProps={{
                  sx: {
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif',
                  }
                }}
                InputLabelProps={{
                  sx: {
                    fontFamily: 'Inter, sans-serif',
                  }
                }}
              />
            </Box>
          </Stack>
        </LocalizationProvider>
      </DialogContent>
      <Divider sx={{ opacity: 0.6 }} />
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={loading}
          sx={{
            borderRadius: '999px',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!isFormValid() || loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          sx={{
            borderRadius: '999px',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
          }}
        >
          {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PolicyFormDialog;