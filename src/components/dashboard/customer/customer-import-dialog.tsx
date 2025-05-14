import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  useTheme,
  alpha,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Customer, CustomerTag } from '@/types/customer';
import { useAuth } from '@/hooks/use-auth';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Papa from 'papaparse';

interface CustomerImportDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableTags?: CustomerTag[];
}

interface ImportedCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  company?: string;
  occupation?: string;
  gender?: 'male' | 'female' | 'other';
  civilStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  type?: 'individual' | 'business' | 'family';
  status?: 'active' | 'inactive' | 'lead';
  riskLevel?: 'low' | 'medium' | 'high';
  birthDate?: string;
  notes?: string;
  tags?: string[];
  errors?: string[];
  isValid?: boolean;
}

const CustomerImportDialog: React.FC<CustomerImportDialogProps> = ({
  open,
  onClose,
  onSuccess,
  availableTags = []
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [importedCustomers, setImportedCustomers] = useState<ImportedCustomer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [importStats, setImportStats] = useState({
    total: 0,
    success: 0,
    failed: 0
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [defaultStatus, setDefaultStatus] = useState<'active' | 'inactive' | 'lead'>('active');
  const [defaultType, setDefaultType] = useState<'individual' | 'business' | 'family'>('individual');
  
  const steps = ['Seleccionar archivo', 'Validar datos', 'Configurar importación', 'Importar clientes'];
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };
  
  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleNext = () => {
    if (activeStep === 0 && file) {
      parseCSV();
    } else if (activeStep === 2) {
      importCustomers();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleClose = () => {
    setActiveStep(0);
    setFile(null);
    setImportedCustomers([]);
    setLoading(false);
    setError(null);
    setSuccess(false);
    setImportStats({
      total: 0,
      success: 0,
      failed: 0
    });
    setSelectedTags([]);
    setDefaultStatus('active');
    setDefaultType('individual');
    onClose();
  };
  
  const handleTagsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setSelectedTags(value);
  };
  
  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as 'active' | 'inactive' | 'lead';
    setDefaultStatus(value);
  };
  
  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as 'individual' | 'business' | 'family';
    setDefaultType(value);
  };
  
  const parseCSV = () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data as Record<string, string>[];
        
        const validatedCustomers = parsedData.map((row) => {
          const customer: ImportedCustomer = {
            name: row.name || row.nombre || '',
            email: row.email || row.correo || '',
            phone: row.phone || row.telefono || '',
            address: row.address || row.direccion || '',
            city: row.city || row.ciudad || '',
            company: row.company || row.empresa || '',
            occupation: row.occupation || row.ocupacion || '',
            gender: (row.gender || row.genero || '').toLowerCase() as 'male' | 'female' | 'other',
            civilStatus: (row.civilStatus || row.estadoCivil || '').toLowerCase() as 'single' | 'married' | 'divorced' | 'widowed',
            type: (row.type || row.tipo || '').toLowerCase() as 'individual' | 'business' | 'family',
            status: (row.status || row.estado || '').toLowerCase() as 'active' | 'inactive' | 'lead',
            riskLevel: (row.riskLevel || row.nivelRiesgo || '').toLowerCase() as 'low' | 'medium' | 'high',
            birthDate: row.birthDate || row.fechaNacimiento || '',
            notes: row.notes || row.notas || '',
            errors: [],
            isValid: true
          };
          
          // Validate required fields
          if (!customer.name) {
            customer.errors?.push('El nombre es obligatorio');
            customer.isValid = false;
          }
          
          // Validate email format
          if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
            customer.errors?.push('El formato del email es inválido');
            customer.isValid = false;
          }
          
          // Validate phone format
          if (customer.phone && !/^[0-9+\-\s()]*$/.test(customer.phone)) {
            customer.errors?.push('El formato del teléfono es inválido');
            customer.isValid = false;
          }
          
          // Extract and normalize gender value as string first
          const genderValue = customer.gender?.toLowerCase() || '';
          
          // Validate gender
          if (genderValue && !['male', 'female', 'other', 'masculino', 'femenino', 'otro'].includes(genderValue)) {
            customer.errors?.push('El género debe ser masculino, femenino u otro');
            customer.isValid = false;
          }
          
          // Normalize gender
          if (genderValue === 'masculino') customer.gender = 'male';
          else if (genderValue === 'femenino') customer.gender = 'female';
          else if (genderValue === 'otro') customer.gender = 'other';
          
          // Validate civil status
          if (customer.civilStatus && !['single', 'married', 'divorced', 'widowed', 'soltero', 'casado', 'divorciado', 'viudo'].includes(customer.civilStatus)) {
            customer.errors?.push('El estado civil debe ser soltero, casado, divorciado o viudo');
            customer.isValid = false;
          }
          
          // Normalize civil status
          if ((customer.civilStatus as string) === 'soltero') customer.civilStatus = 'single';
          if ((customer.civilStatus as string) === 'casado') customer.civilStatus = 'married';
          if ((customer.civilStatus as string) === 'divorciado') customer.civilStatus = 'divorced';
          if ((customer.civilStatus as string) === 'viudo') customer.civilStatus = 'widowed';
          
          // Validate type
          if (customer.type && !['individual', 'business', 'family', 'individuo', 'empresa', 'familia'].includes(customer.type as string)) {
            customer.errors?.push('El tipo debe ser individuo, empresa o familia');
            customer.isValid = false;
          }
          
          // Normalize type
          if ((customer.type as string) === 'individuo') customer.type = 'individual';
          if ((customer.type as string) === 'empresa') customer.type = 'business';
          if ((customer.type as string) === 'familia') customer.type = 'family';
          
          // Validate status
          if (customer.status && !['active', 'inactive', 'lead', 'activo', 'inactivo', 'prospecto'].includes(customer.status)) {
            customer.errors?.push('El estado debe ser activo, inactivo o prospecto');
            customer.isValid = false;
          }
          
          // Normalize status
          if ((customer.status as string) === 'activo') customer.status = 'active';
          if ((customer.status as string) === 'inactivo') customer.status = 'inactive';
          if ((customer.status as string) === 'prospecto') customer.status = 'lead';
          
          // Validate risk level
          if (customer.riskLevel && !['low', 'medium', 'high', 'bajo', 'medio', 'alto'].includes(customer.riskLevel as string)) {
            customer.errors?.push('El nivel de riesgo debe ser bajo, medio o alto');
            customer.isValid = false;
          }
          
          // Normalize risk level
          if ((customer.riskLevel as string) === 'bajo') customer.riskLevel = 'low';
          if ((customer.riskLevel as string) === 'medio') customer.riskLevel = 'medium';
          if ((customer.riskLevel as string) === 'alto') customer.riskLevel = 'high';
          
          // Validate birth date
          if (customer.birthDate) {
            const date = new Date(customer.birthDate);
            if (isNaN(date.getTime())) {
              customer.errors?.push('La fecha de nacimiento tiene un formato inválido');
              customer.isValid = false;
            }
          }
          
          return customer;
        });
        
        setImportedCustomers(validatedCustomers);
        setImportStats({
          total: validatedCustomers.length,
          success: validatedCustomers.filter(c => c.isValid).length,
          failed: validatedCustomers.filter(c => !c.isValid).length
        });
        
        setLoading(false);
        setActiveStep(1);
      },
      error: (error) => {
        setError(`Error al procesar el archivo: ${error.message}`);
        setLoading(false);
      }
    });
  };
  
  const importCustomers = async () => {
    if (!user?.uid) {
      setError('Usuario no autenticado');
      return;
    }
    
    setLoading(true);
    setError(null);
    setActiveStep(3);
    
    try {
      let successCount = 0;
      let failedCount = 0;
      
      for (const importedCustomer of importedCustomers) {
        if (!importedCustomer.isValid) {
          failedCount++;
          continue;
        }
        
        try {
          // Convert birth date to Timestamp
          let birthDateTimestamp: Timestamp | null = null;
          if (importedCustomer.birthDate) {
            const date = new Date(importedCustomer.birthDate);
            if (!isNaN(date.getTime())) {
              birthDateTimestamp = Timestamp.fromDate(date);
            }
          }
          
          // Create customer object
          const customer: Partial<Customer> = {
            userId: user.uid,
            name: importedCustomer.name,
            fullName: importedCustomer.name,
            email: importedCustomer.email,
            phone: importedCustomer.phone,
            address: importedCustomer.address,
            city: importedCustomer.city,
            company: importedCustomer.company || '',
            occupation: importedCustomer.occupation || '',
            gender: importedCustomer.gender || 'other',
            civilStatus: importedCustomer.civilStatus,
            type: importedCustomer.type || defaultType,
            status: importedCustomer.status || defaultStatus,
            riskLevel: importedCustomer.riskLevel,
            notes: importedCustomer.notes,
            birthDate: birthDateTimestamp || Timestamp.now(),
            createdAt: Timestamp.now(),
            registeredAt: Timestamp.now(),
          };
          
          // Add tags if selected
          if (selectedTags.length > 0) {
            customer.tags = availableTags
              .filter(tag => selectedTags.includes(tag.id))
              .map(tag => ({
                id: tag.id,
                name: tag.name,
                color: tag.color
              }));
          }
          
          // Add to Firestore
          await addDoc(collection(db, 'customers'), customer);
          successCount++;
        } catch (err) {
          console.error('Error importing customer:', err);
          failedCount++;
        }
      }
      
      setImportStats(prev => ({
        ...prev,
        success: successCount,
        failed: failedCount
      }));
      
      setSuccess(true);
      setLoading(false);
      
      // Notify parent component of success
      onSuccess();
    } catch (err) {
      console.error('Error during import:', err);
      setError('Error al importar clientes');
      setLoading(false);
    }
  };
  
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 2,
                border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                },
                mb: 3,
              }}
              onClick={handleFileUpload}
            >
              <Box
                component={motion.div}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                sx={{ mb: 2 }}
              >
                <CloudUploadIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: theme.palette.primary.main,
                    opacity: 0.7,
                  }} 
                />
              </Box>
              <Typography 
                variant="h6" 
                gutterBottom
                fontFamily="'Sora', sans-serif"
                fontWeight={600}
              >
                Arrastra o haz clic para seleccionar
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                fontFamily="'Sora', sans-serif"
              >
                Sube un archivo CSV con los datos de tus clientes
              </Typography>
            </Paper>
            
            {file && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  bgcolor: theme.palette.background.paper,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DescriptionIcon 
                    sx={{ 
                      color: theme.palette.primary.main,
                      mr: 2,
                    }} 
                  />
                  <Box>
                    <Typography 
                      variant="body1"
                      fontFamily="'Sora', sans-serif"
                      fontWeight={600}
                    >
                      {file.name}
                    </Typography>

                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      fontFamily="'Sora', sans-serif"
                    >
                      {(file.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  size="small"
                  sx={{
                    color: theme.palette.error.main,
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.error.main, 0.2),
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Paper>
            )}
            
            <Box sx={{ mt: 4 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                fontFamily="'Sora', sans-serif"
                fontWeight={600}
              >
                Formato esperado
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                fontFamily="'Sora', sans-serif"
                sx={{ mb: 2 }}
              >
                El archivo CSV debe contener las siguientes columnas:
              </Typography>
              
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  bgcolor: theme.palette.background.paper,
                  mb: 2,
                  overflowX: 'auto',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label="name/nombre*" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  />
                  <Chip 
                    label="email/correo" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  />
                  <Chip 
                    label="phone/telefono" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  />
                  <Chip 
                    label="address/direccion" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  />
                  <Chip 
                    label="city/ciudad" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  />
                  <Chip 
                    label="company/empresa" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  />
                  <Chip 
                    label="occupation/ocupacion" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  />
                  <Chip 
                    label="gender/genero" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  />
                  <Chip 
                    label="civilStatus/estadoCivil" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  />
                  <Chip 
                    label="type/tipo" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  />
                  <Chip 
                    label="status/estado" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  />
                  <Chip 
                    label="riskLevel/nivelRiesgo" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  />
                  <Chip 
                    label="birthDate/fechaNacimiento" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  />
                  <Chip 
                    label="notes/notas" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  />
                </Box>
              </Paper>
              
              <Typography 
                variant="body2" 
                color="text.secondary"
                fontFamily="'Sora', sans-serif"
              >
                * Campo obligatorio
              </Typography>
            </Box>
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ py: 2 }}>
            <Typography 
              variant="h6" 
              gutterBottom
              fontFamily="'Sora', sans-serif"
              fontWeight={600}
            >
              Validación de datos
            </Typography>
            
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      fontFamily="'Sora', sans-serif"
                    >
                      Total de registros
                    </Typography>
                    <Typography 
                      variant="h6"
                      fontFamily="'Sora', sans-serif"
                      fontWeight={600}
                    >
                      {importStats.total}
                    </Typography>
                  </Box>
                  
                  <Divider orientation="vertical" flexItem />
                  
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      fontFamily="'Sora', sans-serif"
                    >
                      Válidos
                    </Typography>
                    <Typography 
                      variant="h6"
                      fontFamily="'Sora', sans-serif"
                      fontWeight={600}
                      color={theme.palette.success.main}
                    >
                      {importStats.success}
                    </Typography>
                  </Box>
                  
                  <Divider orientation="vertical" flexItem />
                  
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      fontFamily="'Sora', sans-serif"
                    >
                      Con errores
                    </Typography>
                    <Typography 
                      variant="h6"
                      fontFamily="'Sora', sans-serif"
                      fontWeight={600}
                      color={theme.palette.error.main}
                    >
                      {importStats.failed}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
              
              {importStats.failed > 0 && (
                <Alert 
                  severity="warning"
                  sx={{
                    borderRadius: 2,
                    '& .MuiAlert-message': {
                      fontFamily: "'Sora', sans-serif",
                    }
                  }}
                >
                  Se encontraron {importStats.failed} registros con errores. Estos registros no serán importados.
                </Alert>
              )}
            </Stack>
            
            <Typography 
              variant="subtitle1" 
              gutterBottom
              fontFamily="'Sora', sans-serif"
              fontWeight={600}
            >
              Vista previa de datos
            </Typography>
            
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                bgcolor: theme.palette.background.paper,
                overflow: 'hidden',
                maxHeight: 400,
                overflowY: 'auto',
              }}
            >
              <List disablePadding>
                {importedCustomers.map((customer, index) => (
                  <ListItem
                    key={index}
                    divider={index < importedCustomers.length - 1}
                    sx={{
                      bgcolor: !customer.isValid 
                        ? alpha(theme.palette.error.main, 0.05)
                        : 'transparent',
                    }}
                  >
                    <ListItemIcon>
                      {customer.isValid ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <ErrorIcon color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography 
                          variant="body1"
                          fontFamily="'Sora', sans-serif"
                          fontWeight={600}
                        >
                          {customer.name || 'Sin nombre'}
                        </Typography>
                      }
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            fontFamily="'Sora', sans-serif"
                          >
                            {customer.email || 'Sin email'} • {customer.phone || 'Sin teléfono'}
                          </Typography>
                          
                          {!customer.isValid && customer.errors && customer.errors.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              {customer.errors.map((error, errIndex) => (
                                <Typography 
                                  key={errIndex}
                                  variant="caption" 
                                  color="error"
                                  fontFamily="'Sora', sans-serif"
                                  display="block"
                                >
                                  • {error}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Stack>
                      }
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: 600,
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ py: 2 }}>
            <Typography 
              variant="h6" 
              gutterBottom
              fontFamily="'Sora', sans-serif"
              fontWeight={600}
            >
              Configurar importación
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              fontFamily="'Sora', sans-serif"
              sx={{ mb: 3 }}
            >
              Configura opciones adicionales para los clientes importados
            </Typography>
            
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel id="default-status-label">Estado por defecto</InputLabel>
                <Select
                  labelId="default-status-label"
                  value={defaultStatus}
                  onChange={handleStatusChange}
                  label="Estado por defecto"
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                  <MenuItem value="lead">Lead</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel id="default-type-label">Tipo por defecto</InputLabel>
                <Select
                  labelId="default-type-label"
                  value={defaultType}
                  onChange={handleTypeChange}
                  label="Tipo por defecto"
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="business">Empresa</MenuItem>
                  <MenuItem value="family">Familia</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel id="tags-label">Etiquetas</InputLabel>
                <Select
                  labelId="tags-label"
                  multiple
                  value={selectedTags}
                  onChange={handleTagsChange}
                  label="Etiquetas"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((tagId) => {
                        const tag = availableTags.find(t => t.id === tagId);
                        return (
                          <Chip 
                            key={tagId} 
                            label={tag?.name || tagId} 
                            size="small"
                            sx={{ 
                              bgcolor: tag ? alpha(tag.color, 0.1) : alpha(theme.palette.grey[500], 0.1),
                              color: tag ? tag.color : theme.palette.grey[500],
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              fontFamily: "'Sora', sans-serif",
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                    '& .MuiSelect-select': {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                    }
                  }}
                >
                  {availableTags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: tag.color,
                          mr: 1,
                        }}
                      />
                      <ListItemText primary={tag.name} />
                    </MenuItem>
                  ))}
                  {availableTags.length === 0 && (
                    <MenuItem disabled>
                      <ListItemText primary="No hay etiquetas disponibles" />
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              
              <Alert 
                severity="info"
                sx={{
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    fontFamily: "'Sora', sans-serif",
                  }
                }}
              >
                Se importarán {importStats.success} clientes válidos. Los clientes con errores serán omitidos.
              </Alert>
            </Stack>
          </Box>
        );
      
      case 3:
        return (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            {loading && (
              <Box sx={{ mb: 4 }}>
                <CircularProgress size={60} thickness={4} />
                <Typography 
                  variant="h6" 
                  sx={{ mt: 2 }}
                  fontFamily="'Sora', sans-serif"
                  fontWeight={600}
                >
                  Importando clientes...
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  fontFamily="'Sora', sans-serif"
                >
                  Por favor, espera mientras procesamos tus datos
                </Typography>
              </Box>
            )}
            
            {error && (
              <Alert 
                severity="error"
                sx={{
                  borderRadius: 2,
                  mb: 3,
                  '& .MuiAlert-message': {
                    fontFamily: "'Sora', sans-serif",
                  }
                }}
              >
                {error}
              </Alert>
            )}
            
            {success && (
              <Box>
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
                  ¡Importación completada!
                </Typography>
                
                <Typography 
                  variant="body1"
                  fontFamily="'Sora', sans-serif"
                  sx={{ mb: 3 }}
                >
                  Se han importado {importStats.success} clientes correctamente
                </Typography>
                
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    bgcolor: theme.palette.background.paper,
                    mb: 3,
                  }}
                >
                  <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        fontFamily="'Sora', sans-serif"
                      >
                        Total
                      </Typography>
                      <Typography 
                        variant="h6"
                        fontFamily="'Sora', sans-serif"
                        fontWeight={600}
                      >
                        {importStats.total}
                      </Typography>
                    </Box>
                    
                    <Divider orientation="vertical" flexItem />
                    
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        fontFamily="'Sora', sans-serif"
                      >
                        Importados
                      </Typography>
                      <Typography 
                        variant="h6"
                        fontFamily="'Sora', sans-serif"
                        fontWeight={600}
                        color={theme.palette.success.main}
                      >
                        {importStats.success}
                      </Typography>
                    </Box>
                    
                    <Divider orientation="vertical" flexItem />
                    
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        fontFamily="'Sora', sans-serif"
                      >
                        Fallidos
                      </Typography>
                      <Typography 
                        variant="h6"
                        fontFamily="'Sora', sans-serif"
                        fontWeight={600}
                        color={theme.palette.error.main}
                      >
                        {importStats.failed}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            )}
          </Box>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
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
          Importar clientes
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
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{ mb: 4 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '& .MuiStepIcon-text': {
                      fontFamily: "'Sora', sans-serif",
                      fontWeight: 600,
                    }
                  }
                }}
              >
                <Typography 
                  variant="body2"
                  fontFamily="'Sora', sans-serif"
                  fontWeight={600}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {renderStepContent()}
      </DialogContent>
      
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        {activeStep === 3 && success ? (
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
            
            <Box sx={{ flex: '1 1 auto' }} />
            
            {activeStep > 0 && activeStep < 3 && (
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                }}
              >
                Atrás
              </Button>
            )}
            
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || (activeStep === 0 && !file) || (activeStep === 1 && importStats.success === 0)}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
              sx={{
                borderRadius: 2,
                py: 1,
                fontFamily: "'Sora', sans-serif",
                fontWeight: 600,
              }}
            >
              {activeStep === steps.length - 2 ? 'Importar' : 'Siguiente'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomerImportDialog;