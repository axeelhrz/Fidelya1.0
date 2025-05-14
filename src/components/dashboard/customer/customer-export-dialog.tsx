import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  useTheme,
  alpha,
  Paper,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  FileDownload as FileDownloadIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Customer } from '@/types/customer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Papa from 'papaparse';

interface CustomerExportDialogProps {
  open: boolean;
  onClose: () => void;
  customers: Customer[];
}

const CustomerExportDialog: React.FC<CustomerExportDialogProps> = ({
  open,
  onClose,
  customers,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({
    name: true,
    email: true,
    phone: true,
    address: true,
    city: true,
    company: true,
    occupation: true,
    gender: true,
    civilStatus: true,
    type: true,
    status: true,
    riskLevel: true,
    birthDate: true,
    notes: true,
    tags: true,
    policies: true,
    createdAt: true,
  });
  
  const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExportFormat(event.target.value as 'csv' | 'json');
  };
  
  const handleFieldChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };
  
  const handleSelectAll = () => {
    const allSelected = Object.values(selectedFields).every(value => value);
    
    const newSelectedFields: Record<string, boolean> = {};
    Object.keys(selectedFields).forEach(field => {
      newSelectedFields[field] = !allSelected;
    });
    
    setSelectedFields(newSelectedFields);
  };
  
  const handleExport = () => {
    setLoading(true);
    setError(null);
    
    try {
      // Filter fields based on selection
      const filteredCustomers = customers.map(customer => {
        const filteredCustomer: Record<string, string | number | boolean> = {};
        
        if (selectedFields.name) filteredCustomer.name = customer.name;
        if (selectedFields.email) filteredCustomer.email = customer.email;
        if (selectedFields.phone) filteredCustomer.phone = customer.phone;
        if (selectedFields.address) filteredCustomer.address = customer.address;
        if (selectedFields.city) filteredCustomer.city = customer.city;
        if (selectedFields.company) filteredCustomer.company = customer.company;
        if (selectedFields.occupation) filteredCustomer.occupation = customer.occupation;
        
        if (selectedFields.gender) {
          filteredCustomer.gender = customer.gender === 'male' ? 'Masculino' : 
                                    customer.gender === 'female' ? 'Femenino' : 'Otro';
        }


        if (selectedFields.civilStatus) {
          filteredCustomer.civilStatus = customer.civilStatus === 'single' ? 'Soltero/a' : 
                                         customer.civilStatus === 'married' ? 'Casado/a' : 
                                         customer.civilStatus === 'divorced' ? 'Divorciado/a' : 
                                         customer.civilStatus === 'widowed' ? 'Viudo/a' : '';
        }
        
        if (selectedFields.type) {
          filteredCustomer.type = customer.type === 'individual' ? 'Individual' : 
                                  customer.type === 'business' ? 'Empresa' : 
                                  customer.type === 'family' ? 'Familia' : '';
        }
        
        if (selectedFields.status) {
          filteredCustomer.status = customer.status === 'active' ? 'Activo' : 
                                    customer.status === 'inactive' ? 'Inactivo' : 
                                    customer.status === 'lead' ? 'Lead' : '';
        }
        
        if (selectedFields.riskLevel) {
          filteredCustomer.riskLevel = customer.riskLevel === 'low' ? 'Bajo' : 
                                       customer.riskLevel === 'medium' ? 'Medio' : 
                                       customer.riskLevel === 'high' ? 'Alto' : '';
        }
        
        if (selectedFields.birthDate && customer.birthDate) {
          try {
            filteredCustomer.birthDate = format(
              customer.birthDate.toDate(), 
              'dd/MM/yyyy', 
              { locale: es }
            );
          } catch {
            filteredCustomer.birthDate = '';
          }
        }
        
        if (selectedFields.notes) filteredCustomer.notes = customer.notes || '';
        
        if (selectedFields.tags && customer.tags) {
          filteredCustomer.tags = customer.tags.map(tag => tag.name).join(', ');
        }
        
        if (selectedFields.policies && customer.policies) {
          filteredCustomer.policies = customer.policies.map(policy => policy.policyNumber).join(', ');
          filteredCustomer.activePolicies = customer.policies.filter(p => p.status === 'active').length;
          filteredCustomer.expiredPolicies = customer.policies.filter(p => p.status === 'expired').length;
        }
        
        if (selectedFields.createdAt && customer.createdAt) {
          try {
            filteredCustomer.createdAt = format(
              customer.createdAt.toDate(), 
              'dd/MM/yyyy', 
              { locale: es }
            );
          } catch {
            filteredCustomer.createdAt = '';
          }
        }
        
        return filteredCustomer;
      });
      
      // Generate file name
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const fileName = `clientes_${timestamp}.${exportFormat}`;
      
      // Create and download file
      let fileContent = '';
      let fileType = '';
      
      if (exportFormat === 'csv') {
        fileContent = Papa.unparse(filteredCustomers);
        fileType = 'text/csv';
      } else {
        fileContent = JSON.stringify(filteredCustomers, null, 2);
        fileType = 'application/json';
      }
      
      const blob = new Blob([fileContent], { type: fileType });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error('Error exporting customers:', err);
      setError('Error al exportar clientes');
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    if (!loading) {
      setSuccess(false);
      setError(null);
      onClose();
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      maxWidth="sm"
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
          Exportar clientes
        </Typography>
        
        {!loading && (
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, py: 4 }}>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 40 }} />
            </Box>
            
            <Typography 
              variant="h5" 
              gutterBottom
              fontFamily="'Sora', sans-serif"
              fontWeight={700}
            >
              ¡Exportación completada!
            </Typography>
            
            <Typography 
              variant="body1"
              fontFamily="'Sora', sans-serif"
              sx={{ mb: 3 }}
            >
              Se han exportado {customers.length} clientes correctamente
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Typography 
                variant="subtitle1" 
                gutterBottom
                fontFamily="'Sora', sans-serif"
                fontWeight={600}
              >
                Formato de exportación
              </Typography>
              
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={exportFormat}
                  onChange={handleFormatChange}
                >
                  <FormControlLabel 
                    value="csv" 
                    control={<Radio />} 
                    label="CSV (Excel)" 
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontFamily: "'Sora', sans-serif",
                      }
                    }}
                  />
                  <FormControlLabel 
                    value="json" 
                    control={<Radio />} 
                    label="JSON" 
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontFamily: "'Sora', sans-serif",
                      }
                    }}
                  />
                </RadioGroup>
              </FormControl>
            </Paper>
            
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="subtitle1"
                  fontFamily="'Sora', sans-serif"
                  fontWeight={600}
                >
                  Campos a exportar
                </Typography>
                
                <Button
                  variant="text"
                  size="small"
                  onClick={handleSelectAll}
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {Object.values(selectedFields).every(value => value) ? 'Deseleccionar todo' : 'Seleccionar todo'}
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.name}
                      onChange={handleFieldChange('name')}
                    />
                  }
                  label="Nombre"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.email}
                      onChange={handleFieldChange('email')}
                    />
                  }
                  label="Email"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.phone}
                      onChange={handleFieldChange('phone')}
                    />
                  }
                  label="Teléfono"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.address}
                      onChange={handleFieldChange('address')}
                    />
                  }
                  label="Dirección"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.city}
                      onChange={handleFieldChange('city')}
                    />
                  }
                  label="Ciudad"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.company}
                      onChange={handleFieldChange('company')}
                    />
                  }
                  label="Empresa"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.occupation}
                      onChange={handleFieldChange('occupation')}
                    />
                  }
                  label="Ocupación"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.gender}
                      onChange={handleFieldChange('gender')}
                    />
                  }
                  label="Género"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.civilStatus}
                      onChange={handleFieldChange('civilStatus')}
                    />
                  }
                  label="Estado civil"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.type}
                      onChange={handleFieldChange('type')}
                    />
                  }
                  label="Tipo"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.status}
                      onChange={handleFieldChange('status')}
                    />
                  }
                  label="Estado"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.riskLevel}
                      onChange={handleFieldChange('riskLevel')}
                    />
                  }
                  label="Nivel de riesgo"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.birthDate}
                      onChange={handleFieldChange('birthDate')}
                    />
                  }
                  label="Fecha de nacimiento"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.notes}
                      onChange={handleFieldChange('notes')}
                    />
                  }
                  label="Notas"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.tags}
                      onChange={handleFieldChange('tags')}
                    />
                  }
                  label="Etiquetas"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.policies}
                      onChange={handleFieldChange('policies')}
                    />
                  }
                  label="Pólizas"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.createdAt}
                      onChange={handleFieldChange('createdAt')}
                    />
                  }
                  label="Fecha de creación"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                />
              </Box>
            </Paper>
            
            <Alert 
              severity="info"
              sx={{
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontFamily: "'Sora', sans-serif",
                }
              }}
            >
              Se exportarán {customers.length} clientes en formato {exportFormat.toUpperCase()}.
            </Alert>
            
            {error && (
              <Alert 
                severity="error"
                sx={{
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    fontFamily: "'Sora', sans-serif",
                  }
                }}
              >
                {error}
              </Alert>
            )}
          </Stack>
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
        {success ? (
          <Button
            variant="contained"
            onClick={handleClose}
            fullWidth
            sx={{
              borderRadius: 2,
              py: 1,
              fontFamily: "'Sora', sans-serif",
              fontWeight: 600,
            }}
          >
            Cerrar
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={handleClose}
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
              onClick={handleExport}
              disabled={loading || Object.values(selectedFields).every(value => !value)}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />}
              sx={{
                borderRadius: 2,
                py: 1,
                fontFamily: "'Sora', sans-serif",
                fontWeight: 600,
              }}
            >
              Exportar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomerExportDialog;