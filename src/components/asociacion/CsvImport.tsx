'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  alpha,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Upload,
  Download,
  FileUpload,
  CheckCircle,
  Error,
  Close,
  Info,
  CloudUpload,
} from '@mui/icons-material';
import Papa from 'papaparse';
import { SocioFormData } from '@/types/socio';
import { csvSocioSchema } from '@/lib/validations/socio';

interface CsvImportProps {
  open: boolean;
  onClose: () => void;
  onImport: (socios: SocioFormData[]) => Promise<void>;
  loading?: boolean;
}

interface ParsedSocio extends SocioFormData {
  _index: number;
  _errors?: string[];
}

export const CsvImport: React.FC<CsvImportProps> = ({
  open,
  onClose,
  onImport,
  loading = false
}) => {
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [parsedData, setParsedData] = useState<ParsedSocio[]>([]);
  const [validData, setValidData] = useState<SocioFormData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const template = [
      ['nombre', 'email', 'estado', 'telefono', 'dni'],
      ['Juan Pérez', 'juan@email.com', 'activo', '123456789', '12345678'],
      ['María García', 'maria@email.com', 'vencido', '987654321', '87654321']
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla_socios.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed: ParsedSocio[] = [];
        const validSocios: SocioFormData[] = [];
        const parseErrors: string[] = [];

        results.data.forEach((row: unknown, index: number) => {
          try {
            const validated = csvSocioSchema.parse(row);
            const socio: ParsedSocio = {
              ...validated,
              _index: index + 1
            };
            parsed.push(socio);
            validSocios.push(validated);
          } catch (error: unknown) {
            // Attempt to extract fields if row is an object
            const safeRow = typeof row === 'object' && row !== null ? row as Record<string, unknown> : {};
            let errorMessages: string[] = ['Error de validación'];
            if (
              typeof error === 'object' &&
              error !== null &&
              'errors' in error &&
              Array.isArray((error as { errors?: unknown }).errors)
            ) {
              errorMessages = ((error as { errors: { message: string }[] }).errors)
                .map((e) => typeof e.message === 'string' ? e.message : 'Error de validación');
            }
            const socio: ParsedSocio = {
              nombre: typeof safeRow.nombre === 'string' ? safeRow.nombre : '',
              email: typeof safeRow.email === 'string' ? safeRow.email : '',
              estado:
                typeof safeRow.estado === 'string' && (safeRow.estado === 'activo' || safeRow.estado === 'vencido')
                  ? safeRow.estado
                  : 'activo',
              telefono: typeof safeRow.telefono === 'string' ? safeRow.telefono : '',
              dni: typeof safeRow.dni === 'string' ? safeRow.dni : '',
              _index: index + 1,
              _errors: errorMessages
            };
            parsed.push(socio);
            parseErrors.push(`Fila ${index + 1}: ${errorMessages.join(', ')}`);
          }
        });

        setParsedData(parsed);
        setValidData(validSocios);
        setErrors(parseErrors);
        setStep('preview');
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setErrors(['Error al procesar el archivo CSV']);
      }
    });
  };

  const handleImport = async () => {
    if (validData.length === 0) return;

    try {
      await onImport(validData);
      handleClose();
    } catch (error) {
      console.error('Error importing socios:', error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setStep('upload');
      setParsedData([]);
      setValidData([]);
      setErrors([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    }
  };

  const formatRequirements = [
    { field: 'nombre', description: 'Nombre completo (requerido)', required: true },
    { field: 'email', description: 'Dirección de email (requerido)', required: true },
    { field: 'estado', description: 'activo o vencido (opcional, por defecto: activo)', required: false },
    { field: 'telefono', description: 'Número de teléfono (opcional)', required: false },
    { field: 'dni', description: 'Documento de identidad (opcional)', required: false },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: 0,
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: alpha('#ffffff', 0.2),
                color: 'white',
              }}
            >
              <Upload sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
                Importar Socios desde CSV
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Carga masiva de socios desde archivo CSV
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: alpha('#ffffff', 0.1),
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 60,
            height: 60,
            borderRadius: '50%',
            bgcolor: alpha('#ffffff', 0.1),
          }}
        />
      </DialogTitle>

      <DialogContent sx={{ p: 4, maxHeight: '60vh', overflow: 'auto' }}>
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Stack spacing={4}>
                {/* Upload Area */}
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: alpha('#3b82f6', 0.1),
                      color: '#3b82f6',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <CloudUpload sx={{ fontSize: 40 }} />
                  </Avatar>
                  
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                    Sube tu archivo CSV
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', mb: 4, maxWidth: 400, mx: 'auto' }}>
                    Selecciona un archivo CSV con la información de los socios para importar
                  </Typography>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="contained"
                      startIcon={<FileUpload />}
                      size="large"
                      sx={{
                        py: 2,
                        px: 4,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 6px 25px rgba(59, 130, 246, 0.4)',
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Seleccionar Archivo CSV
                    </Button>
                    
                    <Button
                      onClick={downloadTemplate}
                      variant="outlined"
                      startIcon={<Download />}
                      size="large"
                      sx={{
                        py: 2,
                        px: 4,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 700,
                        borderColor: '#e2e8f0',
                        color: '#475569',
                        borderWidth: 2,
                        '&:hover': {
                          borderColor: '#3b82f6',
                          bgcolor: alpha('#3b82f6', 0.03),
                          color: '#3b82f6',
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Descargar Plantilla
                    </Button>
                  </Stack>
                </Box>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, px: 2 }}>
                    FORMATO REQUERIDO
                  </Typography>
                </Divider>

                {/* Format Requirements */}
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: alpha('#3b82f6', 0.05),
                    border: `1px solid ${alpha('#3b82f6', 0.15)}`,
                    borderRadius: 4,
                    p: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: alpha('#3b82f6', 0.15),
                        color: '#3b82f6',
                        flexShrink: 0,
                      }}
                    >
                      <Info sx={{ fontSize: 20 }} />
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#3b82f6',
                          mb: 1,
                          fontSize: '1rem'
                        }}
                      >
                        Estructura del Archivo CSV
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: alpha('#3b82f6', 0.8),
                          fontSize: '0.9rem',
                          mb: 2
                        }}
                      >
                        Tu archivo CSV debe contener las siguientes columnas:
                      </Typography>
                    </Box>
                  </Box>

                  <List dense>
                    {formatRequirements.map((req, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: req.required ? '#ef4444' : '#10b981',
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ color: alpha('#3b82f6', 0.9) }}>
                              <Box component="span" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                                {req.field}:
                              </Box>{' '}
                              {req.description}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Stack>
            </motion.div>
          )}

          {step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Stack spacing={4}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                      Vista previa de importación
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {validData.length} socios válidos, {errors.length} errores encontrados
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => setStep('upload')}
                    startIcon={<Close />}
                    sx={{
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: '#e2e8f0',
                      color: '#475569',
                      '&:hover': {
                        borderColor: '#6366f1',
                        bgcolor: alpha('#6366f1', 0.03),
                        color: '#6366f1',
                      },
                    }}
                  >
                    Cambiar archivo
                  </Button>
                </Box>

                {/* Error Summary */}
                {errors.length > 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: alpha('#ef4444', 0.05),
                      border: `1px solid ${alpha('#ef4444', 0.2)}`,
                      borderRadius: 4,
                      p: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: alpha('#ef4444', 0.15),
                          color: '#ef4444',
                          flexShrink: 0,
                        }}
                      >
                        <Error sx={{ fontSize: 20 }} />
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: '#ef4444',
                            mb: 1,
                            fontSize: '1rem'
                          }}
                        >
                          Errores encontrados ({errors.length})
                        </Typography>
                        <List dense>
                          {errors.slice(0, 5).map((error, index) => (
                            <ListItem key={index} sx={{ py: 0.25, pl: 0 }}>
                              <ListItemText
                                primary={
                                  <Typography variant="body2" sx={{ color: alpha('#ef4444', 0.8), fontSize: '0.85rem' }}>
                                    • {error}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                          {errors.length > 5 && (
                            <ListItem sx={{ py: 0.25, pl: 0 }}>
                              <ListItemText
                                primary={
                                  <Typography variant="body2" sx={{ color: alpha('#ef4444', 0.6), fontSize: '0.85rem', fontStyle: 'italic' }}>
                                    ... y {errors.length - 5} errores más
                                  </Typography>
                                }
                              />
                            </ListItem>
                          )}
                        </List>
                      </Box>
                    </Box>
                  </Paper>
                )}

                {/* Success Summary */}
                {validData.length > 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: alpha('#10b981', 0.05),
                      border: `1px solid ${alpha('#10b981', 0.2)}`,
                      borderRadius: 4,
                      p: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, #10b981, #059669)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: alpha('#10b981', 0.15),
                          color: '#10b981',
                          flexShrink: 0,
                        }}
                      >
                        <CheckCircle sx={{ fontSize: 20 }} />
                      </Avatar>
                      
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#10b981',
                          fontSize: '1rem'
                        }}
                      >
                        {validData.length} socios listos para importar
                      </Typography>
                    </Box>
                  </Paper>
                )}

                {/* Data Preview Table */}
                <Paper
                  elevation={0}
                  sx={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}
                >
                  <TableContainer sx={{ maxHeight: 300 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#fafbfc' }}>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Fila</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Nombre</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Estado</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Validación</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {parsedData.map((socio) => (
                          <TableRow 
                            key={socio._index} 
                            sx={{ 
                              bgcolor: socio._errors ? alpha('#ef4444', 0.05) : 'white',
                              '&:hover': {
                                bgcolor: socio._errors ? alpha('#ef4444', 0.1) : '#fafbfc',
                              }
                            }}
                          >
                            <TableCell sx={{ fontSize: '0.8rem' }}>{socio._index}</TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>{socio.nombre}</TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>{socio.email}</TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>
                              <Chip
                                label={socio.estado}
                                size="small"
                                sx={{
                                  bgcolor: socio.estado === 'activo' ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
                                  color: socio.estado === 'activo' ? '#10b981' : '#ef4444',
                                  fontWeight: 600,
                                  fontSize: '0.7rem',
                                  height: 20,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {socio._errors ? (
                                <Chip
                                  icon={<Error sx={{ fontSize: '0.8rem' }} />}
                                  label="Error"
                                  size="small"
                                  sx={{
                                    bgcolor: alpha('#ef4444', 0.1),
                                    color: '#ef4444',
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    height: 20,
                                  }}
                                />
                              ) : (
                                <Chip
                                  icon={<CheckCircle sx={{ fontSize: '0.8rem' }} />}
                                  label="Válido"
                                  size="small"
                                  sx={{
                                    bgcolor: alpha('#10b981', 0.1),
                                    color: '#10b981',
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    height: 20,
                                  }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 0 }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outlined"
            startIcon={<Close />}
            sx={{
              flex: step === 'upload' ? 1 : 0,
              py: 1.5,
              px: 3,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 700,
              borderColor: '#e2e8f0',
              color: '#475569',
              borderWidth: 2,
              '&:hover': {
                borderColor: '#6366f1',
                bgcolor: alpha('#6366f1', 0.03),
                color: '#6366f1',
              },
              transition: 'all 0.2s ease'
            }}
          >
            Cancelar
          </Button>
          
          {step === 'upload' && (
            <Button
              onClick={downloadTemplate}
              variant="outlined"
              startIcon={<Download />}
              sx={{
                flex: 1,
                py: 1.5,
                px: 3,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                borderColor: '#e2e8f0',
                color: '#475569',
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#3b82f6',
                  bgcolor: alpha('#3b82f6', 0.03),
                  color: '#3b82f6',
                },
                transition: 'all 0.2s ease'
              }}
            >
              Descargar Plantilla
            </Button>
          )}
          
          {step === 'preview' && validData.length > 0 && (
            <Button
              onClick={handleImport}
              disabled={loading || validData.length === 0}
              variant="contained"
              startIcon={<Upload />}
              sx={{
                flex: 1,
                py: 1.5,
                px: 3,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 25px rgba(16, 185, 129, 0.4)',
                },
                '&:disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8',
                  transform: 'none',
                  boxShadow: 'none',
                },
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Importando...' : `Importar ${validData.length} Socios`}
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};