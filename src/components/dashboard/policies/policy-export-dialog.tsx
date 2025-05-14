'use client';
import React, { useState } from 'react';
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
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Stack,
  Divider,
  Paper,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  FileDownload as FileDownloadIcon,
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Policy } from '@/types/policy';

interface PolicyExportDialogProps {
  open: boolean;
  onClose: () => void;
  policies: Policy[];
}

const PolicyExportDialog: React.FC<PolicyExportDialogProps> = ({
  open,
  onClose,
  policies
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [fileFormat, setFileFormat] = useState('xlsx');
  const [includeFields, setIncludeFields] = useState({
    customerDetails: true,
    dates: true,
    financial: true,
    status: true,
    notes: false,
    reminders: false,
    documents: false
  });
  const [exportComplete, setExportComplete] = useState(false);

  const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileFormat(event.target.value);
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeFields({
      ...includeFields,
      [event.target.name]: event.target.checked
    });
  };

  const handleExport = () => {
    setLoading(true);
    
    // Simular exportación
    setTimeout(() => {
      setLoading(false);
      setExportComplete(true);
    }, 2000);
  };

  const handleReset = () => {
    setExportComplete(false);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
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
        Exportar Pólizas
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
        {!exportComplete ? (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="subtitle1" 
                fontWeight={600}
                fontFamily="Sora, sans-serif"
                sx={{ mb: 1 }}
              >
                Información de la Exportación
              </Typography>
              
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
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    }}
                  >
                    <FileDownloadIcon />
                  </Box>
                  <Box>
                    <Typography 
                      variant="body2" 
                      fontWeight={600}
                      fontFamily="Sora, sans-serif"
                    >
                      Exportar {policies.length} pólizas
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      <Chip
                        label={`${policies.filter(p => p.status === 'active').length} activas`}
                        size="small"
                        sx={{
                          backgroundColor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          fontFamily: 'Inter, sans-serif',
                          borderRadius: '8px',
                          height: 20,
                        }}
                      />
                      <Chip
                        label={`${policies.filter(p => p.status === 'expired').length} vencidas`}
                        size="small"
                        sx={{
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                          color: theme.palette.error.main,
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          fontFamily: 'Inter, sans-serif',
                          borderRadius: '8px',
                          height: 20,
                        }}
                      />
                      <Chip
                        label={`${policies.filter(p => p.status === 'pending').length} pendientes`}
                        size="small"
                        sx={{
                          backgroundColor: alpha(theme.palette.warning.main, 0.1),
                          color: theme.palette.warning.main,
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          fontFamily: 'Inter, sans-serif',
                          borderRadius: '8px',
                          height: 20,
                        }}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="subtitle1" 
                fontWeight={600}
                fontFamily="Sora, sans-serif"
                sx={{ mb: 1 }}
              >
                Formato de Archivo
              </Typography>
              
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="file-format"
                  name="file-format"
                  value={fileFormat}
                  onChange={handleFormatChange}
                >
                  <FormControlLabel 
                    value="xlsx" 
                    control={
                      <Radio 
                        sx={{
                          color: theme.palette.primary.main,
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    } 
                    label={
                      <Typography 
                        variant="body2"
                        fontFamily="Inter, sans-serif"
                      >
                        Excel (.xlsx)
                      </Typography>
                    }
                  />
                  <FormControlLabel 
                    value="csv" 
                    control={
                      <Radio 
                        sx={{
                          color: theme.palette.primary.main,
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    } 
                    label={
                      <Typography 
                        variant="body2"
                        fontFamily="Inter, sans-serif"
                      >
                        CSV (.csv)
                      </Typography>
                    }
                  />
                  <FormControlLabel 
                    value="pdf" 
                    control={
                      <Radio 
                        sx={{
                          color: theme.palette.primary.main,
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    } 
                    label={
                      <Typography 
                        variant="body2"
                        fontFamily="Inter, sans-serif"
                      >
                        PDF (.pdf)
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            
            <Box>
              <Typography 
                variant="subtitle1" 
                fontWeight={600}
                fontFamily="Sora, sans-serif"
                sx={{ mb: 1 }}
              >
                Campos a Incluir
              </Typography>
              
              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeFields.customerDetails}
                      onChange={handleFieldChange}
                      name="customerDetails"
                      sx={{
                        color: theme.palette.primary.main,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography 
                      variant="body2"
                      fontFamily="Inter, sans-serif"
                    >
                      Detalles del cliente
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeFields.dates}
                      onChange={handleFieldChange}
                      name="dates"
                      sx={{
                        color: theme.palette.primary.main,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography 
                      variant="body2"
                      fontFamily="Inter, sans-serif"
                    >
                      Fechas de inicio y vencimiento
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeFields.financial}
                      onChange={handleFieldChange}
                      name="financial"
                      sx={{
                        color: theme.palette.primary.main,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography 
                      variant="body2"
                      fontFamily="Inter, sans-serif"
                    >
                      Información financiera (prima)
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeFields.status}
                      onChange={handleFieldChange}
                      name="status"
                      sx={{
                        color: theme.palette.primary.main,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography 
                      variant="body2"
                      fontFamily="Inter, sans-serif"
                    >
                      Estado de la póliza
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeFields.notes}
                      onChange={handleFieldChange}
                      name="notes"
                      sx={{
                        color: theme.palette.primary.main,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography 
                      variant="body2"
                      fontFamily="Inter, sans-serif"
                    >
                      Notas
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeFields.reminders}
                      onChange={handleFieldChange}
                      name="reminders"
                      sx={{
                        color: theme.palette.primary.main,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography 
                      variant="body2"
                      fontFamily="Inter, sans-serif"
                    >
                      Recordatorios
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeFields.documents}
                      onChange={handleFieldChange}
                      name="documents"
                      sx={{
                        color: theme.palette.primary.main,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography 
                      variant="body2"
                      fontFamily="Inter, sans-serif"
                    >
                      Lista de documentos
                    </Typography>
                  }
                />
              </Stack>
            </Box>
          </>
        ) : (
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
              Exportación completada
            </Typography>
            
            <Typography 
              variant="body2"
              color="text.secondary"
              fontFamily="Inter, sans-serif"
              sx={{ mb: 3 }}
            >
              Se han exportado {policies.length} pólizas correctamente.
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              sx={{ 
                borderRadius: '999px',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
                mb: 2,
              }}
            >
              Descargar Archivo
            </Button>
            
            <Typography 
              variant="caption"
              color="text.secondary"
              fontFamily="Inter, sans-serif"
              sx={{ display: 'block' }}
            >
              El archivo se guardará en tu carpeta de descargas
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <Divider sx={{ opacity: 0.6 }} />
      
      <DialogActions sx={{ p: 3 }}>
        {exportComplete ? (
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
              variant="outlined"
              sx={{ 
                borderRadius: '999px',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                borderColor: alpha(theme.palette.primary.main, 0.5),
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              Nueva Exportación
            </Button>
          </>
        ) : (
          <>
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
              onClick={handleExport}
              color="primary"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />}
              sx={{ 
                borderRadius: '999px',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
              }}
            >
              {loading ? 'Exportando...' : 'Exportar'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PolicyExportDialog;