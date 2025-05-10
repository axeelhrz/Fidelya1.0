'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  alpha,
  useTheme,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  FileUpload as FileUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Save as SaveIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Customer } from '@/types/customer';
import { Policy, PolicyStatus, PaymentFrequency } from '@/types/policy';
import { Timestamp } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { parse as parseCsv } from 'papaparse';

interface ImportPolicy {
  policyNumber: string;
  customerName: string;
  type: string;
  company: string;
  premium: number;
  coverage: number;
  paymentFrequency: string;
  startDate: Date;
  endDate: Date;
  status: string;
  notes?: string;
  isValid: boolean;
  errors: string[];
  rowNumber: number;
}

// Define type for file data rows
type FileDataRow = Record<string, string | number | Date | null | undefined>;

interface ColumnMapping {
  policyNumber: string;
  customerName: string;
  type: string;
  company: string;
  premium: string;
  coverage: string;
  paymentFrequency: string;
  startDate: string;
  endDate: string;
  status: string;
  notes: string;
}

interface PolicyImportDialogProps {
  open: boolean;
  onClose: () => void;
  customers: Customer[];
  onImportPolicies: (policies: Partial<Policy>[]) => Promise<number>;
}

const PolicyImportDialog: React.FC<PolicyImportDialogProps> = ({
  open,
  onClose,
  customers,
  onImportPolicies
}) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [fileData, setFileData] = useState<FileDataRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<ImportPolicy[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<{
    success: number;
    errors: number;
    total: number;
  }>({ success: 0, errors: 0, total: 0 });
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    policyNumber: '',
    customerName: '',
    type: '',
    company: '',
    premium: '',
    coverage: '',
    paymentFrequency: '',
    startDate: '',
    endDate: '',
    status: '',
    notes: ''
  });
  const [mappingComplete, setMappingComplete] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const steps = ['Seleccionar archivo', 'Mapear columnas', 'Revisar datos', 'Importar'];

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setFile(null);
      setFileData([]);
      setHeaders([]);
      setParsedData([]);
      setValidationErrors([]);
      setImportResult({ success: 0, errors: 0, total: 0 });
      setColumnMapping({
        policyNumber: '',
        customerName: '',
        type: '',
        company: '',
        premium: '',
        coverage: '',
        paymentFrequency: '',
        startDate: '',
        endDate: '',
        status: '',
        notes: ''
      });
      setMappingComplete(false);
      setShowHelp(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open]);

  // Check if mapping is complete
  useEffect(() => {
    const requiredFields = [
      'policyNumber',
      'customerName',
      'type',
      'company',
      'premium',
      'startDate',
      'endDate',
      'status'
    ];
    const isComplete = requiredFields.every(field => columnMapping[field as keyof ColumnMapping] !== '');
    setMappingComplete(isComplete);
  }, [columnMapping]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setLoading(true);
    try {
      // Parse file based on type
      let data: FileDataRow[] = [];
      let fileHeaders: string[] = [];
      if (selectedFile.name.endsWith('.csv')) {
        // Parse CSV
        const result = await new Promise<Papa.ParseResult<Record<string, unknown>>>((resolve) => {
          parseCsv(selectedFile, {
            header: true,
            complete: (result) => resolve(result as Papa.ParseResult<Record<string, unknown>>),
            skipEmptyLines: true
          });
        });
        // Convert Papa Parse result data to FileDataRow[]
        data = result.data.map(row => {
          const typedRow: FileDataRow = {};
          Object.entries(row).forEach(([key, value]) => {
            // Convert each value to an acceptable type
            if (value === null || value === undefined || 
                typeof value === 'string' || 
                typeof value === 'number' || 
                value instanceof Date) {
              typedRow[key] = value;
            } else {
              // Convert other types to string as a fallback
              typedRow[key] = String(value);
            }
          });
          return typedRow;
        });
        fileHeaders = result.meta.fields || [];
      } else if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        // Parse Excel
        const arrayBuffer = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        type CellValue = string | number | boolean | Date | null | undefined;
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as CellValue[][];
        if (rawData.length > 0) {
          fileHeaders = rawData[0] as string[];
          data = rawData.slice(1).map((row) => {
            const obj: FileDataRow = {};
            fileHeaders.forEach((header, index) => {
              const cellValue = row[index];
              if (typeof cellValue === 'boolean') {
                obj[header] = String(cellValue); // Convert boolean to string
              } else {
                obj[header] = cellValue as string | number | Date | null | undefined;
              }
            });
            return obj;
          });
        }
      }
      setFileData(data);
      setHeaders(fileHeaders);
      // Try to auto-map columns
      const newMapping = { ...columnMapping };
      // Common column name patterns
      const patterns = {
        policyNumber: ['policy number', 'policy_number', 'policyNumber', 'policy', 'número', 'numero', 'número de póliza', 'numero de poliza'],
        customerName: ['customer', 'customer name', 'customer_name', 'customerName', 'client', 'client name', 'cliente', 'nombre del cliente'],
        type: ['type', 'policy type', 'tipo', 'tipo de póliza', 'tipo de poliza'],
        company: ['company', 'insurer', 'insurance company', 'compañía', 'compania', 'aseguradora'],
        premium: ['premium', 'annual premium', 'prima', 'prima anual'],
        coverage: ['coverage', 'sum insured', 'cobertura', 'suma asegurada'],
        paymentFrequency: ['payment frequency', 'frequency', 'frecuencia', 'frecuencia de pago'],
        startDate: ['start date', 'start', 'effective date', 'fecha inicio', 'fecha de inicio', 'inicio vigencia'],
        endDate: ['end date', 'end', 'expiry date', 'fecha fin', 'fecha de fin', 'fin vigencia', 'vencimiento'],
        status: ['status', 'policy status', 'estado', 'estado de póliza'],
        notes: ['notes', 'comments', 'observations', 'notas', 'comentarios', 'observaciones']
      };
      // Try to match headers with patterns
      fileHeaders.forEach(header => {
        const headerLower = header.toLowerCase();
        Object.entries(patterns).forEach(([field, possibleNames]) => {
          if (possibleNames.some(name => headerLower.includes(name))) {
            newMapping[field as keyof ColumnMapping] = header;
          }
        });
      });
      setColumnMapping(newMapping);
    } catch (error) {
      console.error("Error parsing file:", error);
      setValidationErrors(["Error al procesar el archivo. Asegúrate de que el formato sea correcto."]);
    } finally {
      setLoading(false);
    }
  };

  const handleColumnMappingChange = (field: keyof ColumnMapping, value: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateAndParsePolicies = () => {
    if (!fileData.length) return;
    const validatedPolicies: ImportPolicy[] = [];
    const errors: string[] = [];
    // Validate and parse each row
    fileData.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because index is 0-based and we skip header row
      const policy: ImportPolicy = {
        policyNumber: '',
        customerName: '',
        type: '',
        company: '',
        premium: 0,
        coverage: 0,
        paymentFrequency: 'annual',
        startDate: new Date(),
        endDate: new Date(),
        status: 'active',
        notes: '',
        isValid: true,
        errors: [],
        rowNumber
      };
      const rowErrors: string[] = [];
      // Process policyNumber
      if (columnMapping.policyNumber && row[columnMapping.policyNumber]) {
        policy.policyNumber = String(row[columnMapping.policyNumber]).trim();
      } else {
        policy.isValid = false;
        rowErrors.push('Número de póliza requerido');
      }
      // Process customerName
      if (columnMapping.customerName && row[columnMapping.customerName]) {
        policy.customerName = String(row[columnMapping.customerName]).trim();
        // Validate customer exists
        if (customers.length > 0 && !customers.some(c => c.name.toLowerCase() === policy.customerName.toLowerCase())) {
          policy.isValid = false;
          rowErrors.push('Cliente no encontrado en la base de datos');
        }
      } else {
        policy.isValid = false;
        rowErrors.push('Nombre del cliente requerido');
      }
      // Process type
      if (columnMapping.type && row[columnMapping.type]) {
        policy.type = String(row[columnMapping.type]).trim();
        // Validate policy type
        const validTypes = ['Auto', 'Vida', 'Hogar', 'Salud', 'Viaje', 'Negocio', 'Responsabilidad Civil', 'Otro'];
        if (!validTypes.includes(policy.type)) {
          policy.isValid = false;
          rowErrors.push(`Tipo de póliza inválido. Valores permitidos: ${validTypes.join(', ')}`);
        }
      } else {
        policy.isValid = false;
        rowErrors.push('Tipo de póliza requerido');
      }
      // Process company
      if (columnMapping.company && row[columnMapping.company]) {
        policy.company = String(row[columnMapping.company]).trim();
      } else {
        policy.isValid = false;
        rowErrors.push('Compañía aseguradora requerida');
      }
      // Process premium
      if (columnMapping.premium && row[columnMapping.premium]) {
        const premiumValue = parseFloat(String(row[columnMapping.premium]).replace(/[^\d.-]/g, ''));
        if (!isNaN(premiumValue)) {
          policy.premium = premiumValue;
        } else {
          policy.isValid = false;
          rowErrors.push('Prima inválida');
        }
      } else {
        policy.isValid = false;
        rowErrors.push('Prima requerida');
      }
      // Process coverage
      if (columnMapping.coverage && row[columnMapping.coverage]) {
        const coverageValue = parseFloat(String(row[columnMapping.coverage]).replace(/[^\d.-]/g, ''));
        if (!isNaN(coverageValue)) {
          policy.coverage = coverageValue;
        } else {
          policy.coverage = 0;
        }
      }
      // Process paymentFrequency
      if (columnMapping.paymentFrequency && row[columnMapping.paymentFrequency]) {
        const frequency = String(row[columnMapping.paymentFrequency]).trim().toLowerCase();
        const validFrequencies: Record<string, PaymentFrequency> = {
          'monthly': 'monthly',
          'mensual': 'monthly',
          'quarterly': 'quarterly',
          'trimestral': 'quarterly',
          'biannual': 'biannual',
          'semestral': 'biannual',
          'annual': 'annual',
          'anual': 'annual',
          'single': 'single',
          'único': 'single',
          'unico': 'single'
        };
        if (frequency in validFrequencies) {
          policy.paymentFrequency = validFrequencies[frequency];
        } else {
          policy.paymentFrequency = 'annual';
        }
      }
      // Process startDate
      if (columnMapping.startDate && row[columnMapping.startDate]) {
        const dateValue = row[columnMapping.startDate];
        let startDate: Date | null = null;
        if (dateValue instanceof Date) {
          startDate = dateValue;
        } else if (typeof dateValue === 'number') {
          // Excel date (number of days since 1900-01-01)
          startDate = new Date(Math.round((dateValue - 25569) * 86400 * 1000));
        } else {
          // Try to parse string date
          startDate = new Date(String(dateValue));
        }
        if (startDate && !isNaN(startDate.getTime())) {
          policy.startDate = startDate;
        } else {
          policy.isValid = false;
          rowErrors.push('Fecha de inicio inválida');
        }
      } else {
        policy.isValid = false;
        rowErrors.push('Fecha de inicio requerida');
      }
      // Process endDate
      if (columnMapping.endDate && row[columnMapping.endDate]) {
        const dateValue = row[columnMapping.endDate];
        let endDate: Date | null = null;
        if (dateValue instanceof Date) {
          endDate = dateValue;
        } else if (typeof dateValue === 'number') {
          // Excel date (number of days since 1900-01-01)
          endDate = new Date(Math.round((dateValue - 25569) * 86400 * 1000));
        } else {
          // Try to parse string date
          endDate = new Date(String(dateValue));
        }
        if (endDate && !isNaN(endDate.getTime())) {
          policy.endDate = endDate;
        } else {
          policy.isValid = false;
          rowErrors.push('Fecha de vencimiento inválida');
        }
      } else {
        policy.isValid = false;
        rowErrors.push('Fecha de vencimiento requerida');
      }
      // Process status
      if (columnMapping.status && row[columnMapping.status]) {
        const statusValue = String(row[columnMapping.status]).trim().toLowerCase();
        const validStatuses: Record<string, PolicyStatus> = {
          'active': 'active',
          'activa': 'active',
          'expired': 'expired',
          'vencida': 'expired',
          'pending': 'pending',
          'pendiente': 'pending',
          'review': 'review',
          'revisión': 'review',
          'revision': 'review',
          'cancelled': 'cancelled',
          'cancelada': 'cancelled'
        };
        if (statusValue in validStatuses) {
          policy.status = validStatuses[statusValue];
        } else {
          policy.isValid = false;
          rowErrors.push(`Estado inválido. Valores permitidos: activa, vencida, pendiente, revisión, cancelada`);
        }
      } else {
        // Default to active if not provided
        policy.status = 'active';
      }
      // Process notes
      if (columnMapping.notes && row[columnMapping.notes]) {
        policy.notes = String(row[columnMapping.notes]).trim();
      }
      // Add row errors to policy
      policy.errors = rowErrors;
      // Add row errors to global errors list
      if (rowErrors.length > 0) {
        errors.push(...rowErrors.map(error => `Fila ${rowNumber}: ${error}`));
      }
      validatedPolicies.push(policy);
    });
    setParsedData(validatedPolicies);
    setValidationErrors(errors);
  };

  const handleNext = () => {
    if (activeStep === 1) {
      // Validate and parse data before moving to review step
      validateAndParsePolicies();
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      // Filtrar solo las pólizas válidas
      const validPolicies = parsedData.filter(item => item.isValid);
      // Convertir las pólizas al formato requerido por la función savePolicy
      const policiesToImport = validPolicies.map(item => ({
        policyNumber: item.policyNumber,
        customerName: item.customerName,
        type: item.type,
        company: item.company,
        premium: item.premium,
        coverage: item.coverage,
        paymentFrequency: item.paymentFrequency,
        startDate: Timestamp.fromDate(item.startDate),
        endDate: Timestamp.fromDate(item.endDate),
        status: item.status,
        notes: item.notes,
        isStarred: false,
        isArchived: false,
        isRenewal: false,
        customerId: '',
        errors: [],
      }));
      // Importar las pólizas
      const successCount = await onImportPolicies(policiesToImport);
      // Actualizar el resultado de la importación
      setImportResult({
        success: successCount,
        errors: parsedData.length - successCount,
        total: parsedData.length
      });
      setActiveStep(4);
    } catch (error) {
      console.error("Error importing policies:", error);
      setImportResult({
        success: 0,
        errors: parsedData.length,
        total: parsedData.length
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setFile(null);
    setFileData([]);
    setHeaders([]);
    setParsedData([]);
    setValidationErrors([]);
    setImportResult({ success: 0, errors: 0, total: 0 });
    setColumnMapping({
      policyNumber: '',
      customerName: '',
      type: '',
      company: '',
      premium: '',
      coverage: '',
      paymentFrequency: '',
      startDate: '',
      endDate: '',
      status: '',
      notes: ''
    });
    setMappingComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0: // Select file
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              </Box>
            </motion.div>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight={700}
              fontFamily="Sora, sans-serif"
            >
              Selecciona un archivo para importar
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontFamily="Inter, sans-serif"
              sx={{ mb: 3 }}
            >
              Formatos soportados: CSV, XLSX, XLS
            </Typography>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept=".csv,.xlsx,.xls"
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              sx={{
                borderRadius: '999px',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
                py: 1.5,
              }}
            >
              {loading ? 'Procesando...' : 'Seleccionar Archivo'}
            </Button>
            {loading && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontFamily="Inter, sans-serif"
                  sx={{ ml: 2 }}
                >
                  Procesando archivo...
                </Typography>
              </Box>
            )}
            {file && !loading && (
              <Box sx={{ mt: 3, textAlign: 'left' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    background: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.4)
                      : alpha(theme.palette.background.paper, 0.7),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    fontFamily="Sora, sans-serif"
                    sx={{ mb: 1 }}
                  >
                    Archivo seleccionado:
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={file.name}
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        fontFamily: 'Inter, sans-serif',
                        borderRadius: '8px',
                      }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontFamily="Inter, sans-serif"
                    >
                      {(file.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Stack>
                  {headers.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontFamily="Inter, sans-serif"
                      >
                        Columnas detectadas: {headers.length}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {headers.map((header, index) => (
                          <Chip
                            key={index}
                            label={header}
                            size="small"
                            sx={{
                              backgroundColor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              fontWeight: 500,
                              fontSize: '0.7rem',
                              fontFamily: 'Inter, sans-serif',
                              borderRadius: '8px',
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {fileData.length > 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontFamily="Inter, sans-serif"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      Filas detectadas: {fileData.length}
                    </Typography>
                  )}
                </Paper>
              </Box>
            )}
          </Box>
        );
      case 1: // Map columns
        return (
          <Box sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                fontFamily="Sora, sans-serif"
              >
                Mapear columnas
              </Typography>
              <IconButton
                color="info"
                onClick={() => setShowHelp(!showHelp)}
                size="small"
              >
                <HelpIcon />
              </IconButton>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              fontFamily="Inter, sans-serif"
              sx={{ mb: 3 }}
            >
              Asigna las columnas de tu archivo a los campos requeridos para importar pólizas.
            </Typography>
            {showHelp && (
              <Alert
                severity="info"
                sx={{
                  mb: 3,
                  borderRadius: '12px',
                  '& .MuiAlert-icon': {
                    alignItems: 'center',
                  }
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  fontFamily="Sora, sans-serif"
                >
                  Ayuda para mapear columnas
                </Typography>
                <Typography
                  variant="body2"
                  fontFamily="Inter, sans-serif"
                  sx={{ mt: 1 }}
                >
                  • Los campos marcados con * son obligatorios.<br />
                  • Selecciona la columna de tu archivo que corresponde a cada campo.<br />
                  • Si algún campo no tiene una columna correspondiente, déjalo en blanco (se usarán valores predeterminados).<br />
                  • Las fechas deben estar en formato DD/MM/YYYY o ser reconocibles como fechas.
                </Typography>
              </Alert>
            )}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel required>Número de Póliza *</InputLabel>
                  <Select
                    value={columnMapping.policyNumber}
                    onChange={(e) => handleColumnMappingChange('policyNumber', e.target.value)}
                    label="Número de Póliza *"
                  >
                    <MenuItem value="">
                      <em>No mapear</em>
                    </MenuItem>
                    {headers.map((header, index) => (
                      <MenuItem key={index} value={header}>{header}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel required>Nombre del Cliente *</InputLabel>
                  <Select
                    value={columnMapping.customerName}
                    onChange={(e) => handleColumnMappingChange('customerName', e.target.value)}
                    label="Nombre del Cliente *"
                  >
                    <MenuItem value="">
                      <em>No mapear</em>
                    </MenuItem>
                    {headers.map((header, index) => (
                      <MenuItem key={index} value={header}>{header}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel required>Tipo de Póliza *</InputLabel>
                  <Select
                    value={columnMapping.type}
                    onChange={(e) => handleColumnMappingChange('type', e.target.value)}
                    label="Tipo de Póliza *"
                  >
                    <MenuItem value="">
                      <em>No mapear</em>
                    </MenuItem>
                    {headers.map((header, index) => (
                      <MenuItem key={index} value={header}>{header}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel required>Compañía Aseguradora *</InputLabel>
                  <Select
                    value={columnMapping.company}
                    onChange={(e) => handleColumnMappingChange('company', e.target.value)}
                    label="Compañía Aseguradora *"
                  >
                    <MenuItem value="">
                      <em>No mapear</em>
                    </MenuItem>
                    {headers.map((header, index) => (
                      <MenuItem key={index} value={header}>{header}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel required>Prima *</InputLabel>
                  <Select
                    value={columnMapping.premium}
                    onChange={(e) => handleColumnMappingChange('premium', e.target.value)}
                    label="Prima *"
                  >
                    <MenuItem value="">
                      <em>No mapear</em>
                    </MenuItem>
                    {headers.map((header, index) => (
                      <MenuItem key={index} value={header}>{header}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Cobertura</InputLabel>
                  <Select
                    value={columnMapping.coverage}
                    onChange={(e) => handleColumnMappingChange('coverage', e.target.value)}
                    label="Cobertura"
                  >
                    <MenuItem value="">
                      <em>No mapear</em>
                    </MenuItem>
                    {headers.map((header, index) => (
                      <MenuItem key={index} value={header}>{header}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Frecuencia de Pago</InputLabel>
                  <Select
                    value={columnMapping.paymentFrequency}
                    onChange={(e) => handleColumnMappingChange('paymentFrequency', e.target.value)}
                    label="Frecuencia de Pago"
                  >
                    <MenuItem value="">
                      <em>No mapear</em>
                    </MenuItem>
                    {headers.map((header, index) => (
                      <MenuItem key={index} value={header}>{header}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel required>Fecha de Inicio *</InputLabel>
                  <Select
                    value={columnMapping.startDate}
                    onChange={(e) => handleColumnMappingChange('startDate', e.target.value)}
                    label="Fecha de Inicio *"
                  >
                    <MenuItem value="">
                      <em>No mapear</em>
                    </MenuItem>
                    {headers.map((header, index) => (
                      <MenuItem key={index} value={header}>{header}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel required>Fecha de Vencimiento *</InputLabel>
                  <Select
                    value={columnMapping.endDate}
                    onChange={(e) => handleColumnMappingChange('endDate', e.target.value)}
                    label="Fecha de Vencimiento *"
                  >
                    <MenuItem value="">
                      <em>No mapear</em>
                    </MenuItem>
                    {headers.map((header, index) => (
                      <MenuItem key={index} value={header}>{header}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={columnMapping.status}
                    onChange={(e) => handleColumnMappingChange('status', e.target.value)}
                    label="Estado"
                  >
                    <MenuItem value="">
                      <em>No mapear (usar &quot;Activa&quot; por defecto)</em>
                    </MenuItem>
                    {headers.map((header, index) => (
                      <MenuItem key={index} value={header}>{header}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Box sx={{ width: '100%' }}>
              <FormControl fullWidth>
                <InputLabel>Notas</InputLabel>
                <Select
                  value={columnMapping.notes}
                  onChange={(e) => handleColumnMappingChange('notes', e.target.value)}
                  label="Notas"
                >
                  <MenuItem value="">
                    <em>No mapear</em>
                  </MenuItem>
                  {headers.map((header, index) => (
                    <MenuItem key={index} value={header}>{header}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {!mappingComplete && (
              <Alert
                severity="warning"
                sx={{
                  mt: 3,
                  borderRadius: '12px',
                  '& .MuiAlert-icon': {
                    alignItems: 'center',
                  }
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={500}
                  fontFamily="Inter, sans-serif"
                >
                  Por favor, mapea todos los campos obligatorios (marcados con *) para continuar.
                </Typography>
              </Alert>
            )}
          </Box>
        );
      case 2: // Review data
        return (
          <Box sx={{ py: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight={700}
              fontFamily="Sora, sans-serif"
            >
              Revisar datos
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontFamily="Inter, sans-serif"
              sx={{ mb: 3 }}
            >
              Verifica que los datos sean correctos antes de importar.
            </Typography>
            {validationErrors.length > 0 && (
              <Alert
                severity="warning"
                sx={{
                  mb: 3,
                  borderRadius: '12px',
                  '& .MuiAlert-icon': {
                    alignItems: 'center',
                  }
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  fontFamily="Sora, sans-serif"
                >
                  Se encontraron {validationErrors.length} errores en los datos
                </Typography>
                <Box sx={{ mt: 1, maxHeight: '150px', overflow: 'auto' }}>
                  {validationErrors.slice(0, 10).map((error, index) => (
                    <Typography
                      key={index}
                      variant="caption"
                      component="div"
                      fontFamily="Inter, sans-serif"
                    >
                      • {error}
                    </Typography>
                  ))}
                  {validationErrors.length > 10 && (
                    <Typography
                      variant="caption"
                      component="div"
                      fontFamily="Inter, sans-serif"
                      fontStyle="italic"
                    >
                      Y {validationErrors.length - 10} errores más...
                    </Typography>
                  )}
                </Box>
              </Alert>
            )}
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: '12px',
                overflow: 'hidden',
                background: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.paper, 0.4)
                  : alpha(theme.palette.background.paper, 0.7),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                maxHeight: '400px',
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow
                    sx={{
                      '& th': {
                        backgroundColor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.6)
                          : alpha(theme.palette.background.paper, 0.9),
                        fontFamily: 'Sora, sans-serif',
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }
                    }}
                  >
                    <TableCell width={50}>Fila</TableCell>
                    <TableCell width={50}>Estado</TableCell>
                    <TableCell>Número</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Compañía</TableCell>
                    <TableCell>Prima</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parsedData.map((row) => (
                    <TableRow
                      key={row.rowNumber}
                      sx={{
                        backgroundColor: row.isValid
                          ? 'transparent'
                          : alpha(theme.palette.error.main, 0.05),
                        '& td': {
                          fontFamily: 'Inter, sans-serif',
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }
                      }}
                    >
                      <TableCell>{row.rowNumber}</TableCell>
                      <TableCell>
                        {row.isValid ? (
                          <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.success.main }} />
                        ) : (
                          <Tooltip title={row.errors.join(', ')}>
                            <ErrorIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>{row.policyNumber || '—'}</TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.company}</TableCell>
                      <TableCell>{row.premium}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            row.status === 'active' ? 'Activa' :
                              row.status === 'pending' ? 'Pendiente' :
                                row.status === 'expired' ? 'Vencida' :
                                  row.status === 'review' ? 'En revisión' :
                                    row.status === 'cancelled' ? 'Cancelada' :
                                      row.status
                          }
                          size="small"
                          sx={{
                            backgroundColor: alpha(
                              row.status === 'active' ? theme.palette.success.main :
                                row.status === 'pending' ? theme.palette.warning.main :
                                  row.status === 'expired' ? theme.palette.error.main :
                                    row.status === 'review' ? theme.palette.info.main :
                                      theme.palette.grey[500],
                              0.1
                            ),
                            color:
                              row.status === 'active' ? theme.palette.success.main :
                                row.status === 'pending' ? theme.palette.warning.main :
                                  row.status === 'expired' ? theme.palette.error.main :
                                    row.status === 'review' ? theme.palette.info.main :
                                      theme.palette.grey[500],
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            fontFamily: 'Inter, sans-serif',
                            borderRadius: '8px',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography
              variant="caption"
              color="text.secondary"
              fontFamily="Inter, sans-serif"
              sx={{ display: 'block', mt: 2 }}
            >
              Total: {parsedData.length} pólizas, {parsedData.filter(item => item.isValid).length} válidas, {parsedData.filter(item => !item.isValid).length} con errores
            </Typography>
          </Box>
        );
      case 3: // Confirm import
        return (
          <Box sx={{ py: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight={700}
              fontFamily="Sora, sans-serif"
            >
              Confirmar importación
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontFamily="Inter, sans-serif"
              sx={{ mb: 3 }}
            >
              Se importarán {parsedData.filter(item => item.isValid).length} pólizas válidas. Las pólizas con errores serán omitidas.
            </Typography>
            {validationErrors.length > 0 && (
              <Alert
                severity="info"
                sx={{
                  mb: 3,
                  borderRadius: '12px',
                  '& .MuiAlert-icon': {
                    alignItems: 'center',
                  }
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={500}
                  fontFamily="Inter, sans-serif"
                >
                  {parsedData.filter(item => !item.isValid).length} pólizas con errores no serán importadas. Puedes corregir los errores en el archivo y volver a intentarlo.
                </Typography>
              </Alert>
            )}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '12px',
                background: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.paper, 0.4)
                  : alpha(theme.palette.background.paper, 0.7),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                fontWeight={700}
                fontFamily="Sora, sans-serif"
                sx={{ color: theme.palette.primary.main }}
              >
                {parsedData.filter(item => item.isValid).length}
              </Typography>
              <Typography
                variant="body2"
                fontFamily="Inter, sans-serif"
              >
                Pólizas listas para importar
              </Typography>
            </Paper>
          </Box>
        );
      case 4: // Import complete
        return (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, type: 'spring' }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
              </Box>
            </motion.div>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight={700}
              fontFamily="Sora, sans-serif"
            >
              Importación completada
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontFamily="Inter, sans-serif"
              sx={{ mb: 3 }}
            >
              Se han importado {importResult.success} de {importResult.total} pólizas correctamente.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  background: alpha(theme.palette.success.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  textAlign: 'center',
                  width: 120,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  fontFamily="Sora, sans-serif"
                  sx={{ color: theme.palette.success.main }}
                >
                  {importResult.success}
                </Typography>
                <Typography
                  variant="caption"
                  fontFamily="Inter, sans-serif"
                  sx={{ color: theme.palette.success.main }}
                >
                  Importadas
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  background: alpha(theme.palette.error.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  textAlign: 'center',
                  width: 120,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  fontFamily="Sora, sans-serif"
                  sx={{ color: theme.palette.error.main }}
                >
                  {importResult.errors}
                </Typography>
                <Typography
                  variant="caption"
                  fontFamily="Inter, sans-serif"
                  sx={{ color: theme.palette.error.main }}
                >
                  Errores
                </Typography>
              </Paper>
            </Stack>
          </Box>
        );
      default:
        return null;
    }
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
        Importar Pólizas
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
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 4,
            '& .MuiStepLabel-label': {
              fontFamily: 'Inter, sans-serif',
              mt: 1,
            },
            '& .MuiStepLabel-labelContainer': {
              color: theme.palette.text.secondary,
            },
            '& .Mui-active': {
              color: `${theme.palette.primary.main} !important`,
            },
            '& .Mui-completed': {
              color: `${theme.palette.success.main} !important`,
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep)}
      </DialogContent>
      <Divider sx={{ opacity: 0.6 }} />
      <DialogActions sx={{ p: 3 }}>
        {activeStep === 4 ? (
          <>
            <Button
              onClick={onClose}
              color="inherit"
              sx={{
                borderRadius: '999px',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Cerrar
            </Button>
            <Button
              onClick={handleReset}
              color="primary"
              variant="contained"
              sx={{
                borderRadius: '999px',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
              }}
            >
              Importar Más Pólizas
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={activeStep === 0 ? onClose : handleBack}
              color="inherit"
              disabled={loading}
              startIcon={activeStep > 0 ? <ArrowBackIcon /> : undefined}
              sx={{
                borderRadius: '999px',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {activeStep === 0 ? 'Cancelar' : 'Atrás'}
            </Button>
            <Button
              onClick={activeStep === 3 ? handleImport : handleNext}
              color="primary"
              variant="contained"
              disabled={(activeStep === 0 && !file) ||
                (activeStep === 1 && !mappingComplete) ||
                (activeStep === 2 && parsedData.filter(item => item.isValid).length === 0) ||
                loading}
              endIcon={activeStep < 3 ? <ArrowForwardIcon /> : undefined}
              startIcon={activeStep === 3 ? (loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />) : undefined}
              sx={{
                borderRadius: '999px',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
              }}
            >
              {activeStep === 0 ? 'Continuar' :
                activeStep === 1 ? 'Continuar' :
                  activeStep === 2 ? 'Continuar' :
                    loading ? 'Importando...' : 'Importar Pólizas'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PolicyImportDialog;