'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Paper,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  QrCode,
  Download,
  Visibility,
  Print,
  Share,
  Close,
  ContentCopy,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import toast from 'react-hot-toast';

export const QRSection: React.FC = () => {
  const { user } = useAuth();
  const { comercio } = useComercios();
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate QR validation URL
  const qrUrl = `${window.location.origin}/validar-beneficio?comercio=${user?.uid}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      toast.success('URL copiada al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Error al copiar la URL');
    }
  };

  const handleDownloadQR = () => {
    // This would generate and download a PDF with QR code
    toast.success('Descargando cartel con QR...');
  };

  const handlePrintQR = () => {
    // This would open print dialog for QR poster
    window.print();
  };

  const handleShareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR de ${comercio?.nombreComercio || 'Mi Comercio'}`,
          text: 'Escanea este QR para validar beneficios en Fidelitá',
          url: qrUrl,
        });
      } catch (error) {
        handleCopyUrl();
      }
    } else {
      handleCopyUrl();
    }
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Animated background */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 180,
            height: 180,
            background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
            borderRadius: '50%',
            opacity: 0.05,
            transform: 'translate(50%, 50%)',
          }}
        />

        <CardContent sx={{ p: 6, position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 900, 
                color: '#0f172a',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <QrCode sx={{ fontSize: 32, color: '#ec4899' }} />
              Código QR de Validación
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
              Este QR permite a los socios validar sus beneficios en tu comercio. Imprímelo y colócalo en un lugar visible.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* QR Preview */}
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: '2px solid #f1f5f9',
                  borderRadius: 4,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #fafbfc 0%, #ffffff 100%)',
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Box
                    sx={{
                      width: 200,
                      height: 200,
                      bgcolor: '#ffffff',
                      border: '3px solid #e2e8f0',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#ec4899',
                        boxShadow: '0 8px 32px rgba(236, 72, 153, 0.2)',
                      }
                    }}
                    onClick={() => setQrDialogOpen(true)}
                  >
                    {/* QR Code placeholder - in real implementation, use a QR library */}
                    <Box
                      sx={{
                        width: '80%',
                        height: '80%',
                        background: `
                          repeating-linear-gradient(
                            0deg,
                            #000 0px,
                            #000 4px,
                            transparent 4px,
                            transparent 8px
                          ),
                          repeating-linear-gradient(
                            90deg,
                            #000 0px,
                            #000 4px,
                            transparent 4px,
                            transparent 8px
                          )
                        `,
                        borderRadius: 1,
                      }}
                    />
                    
                    {/* Hover overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: alpha('#ec4899', 0.1),
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      <Visibility sx={{ fontSize: 30, color: '#ec4899' }} />
                    </Box>
                  </Box>
                </motion.div>

                <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151', mb: 1 }}>
                  QR de Validación
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                  Los socios escanean este código para validar beneficios
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="center">
                  <Tooltip title="Ver QR completo">
                    <IconButton
                      onClick={() => setQrDialogOpen(true)}
                      sx={{
                        bgcolor: alpha('#ec4899', 0.1),
                        color: '#ec4899',
                        '&:hover': {
                          bgcolor: alpha('#ec4899', 0.2),
                        }
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Compartir QR">
                    <IconButton
                      onClick={handleShareQR}
                      sx={{
                        bgcolor: alpha('#06b6d4', 0.1),
                        color: '#06b6d4',
                        '&:hover': {
                          bgcolor: alpha('#06b6d4', 0.2),
                        }
                      }}
                    >
                      <Share />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Paper>
            </Box>

            {/* Actions and Info */}
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Stack spacing={4}>
                {/* URL Info */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                    bgcolor: alpha('#f8fafc', 0.5),
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151', mb: 2 }}>
                    URL de Validación
                  </Typography>
                  
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: '#f1f5f9',
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                      mb: 3,
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#475569',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all',
                        fontSize: '0.85rem',
                      }}
                    >
                      {qrUrl}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    startIcon={copied ? <CheckCircle /> : <ContentCopy />}
                    onClick={handleCopyUrl}
                    fullWidth
                    sx={{
                      borderColor: copied ? '#10b981' : '#d1d5db',
                      color: copied ? '#10b981' : '#6b7280',
                      '&:hover': {
                        borderColor: copied ? '#10b981' : '#9ca3af',
                        bgcolor: copied ? alpha('#10b981', 0.1) : alpha('#6b7280', 0.1),
                      }
                    }}
                  >
                    {copied ? 'Copiado!' : 'Copiar URL'}
                  </Button>
                </Paper>

                {/* Actions */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151', mb: 3 }}>
                    Acciones Rápidas
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={handleDownloadQR}
                      fullWidth
                      sx={{
                        background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                        boxShadow: '0 4px 20px rgba(236, 72, 153, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
                          boxShadow: '0 6px 25px rgba(236, 72, 153, 0.4)',
                        }
                      }}
                    >
                      Descargar Cartel PDF
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<Print />}
                      onClick={handlePrintQR}
                      fullWidth
                      sx={{
                        borderColor: '#d1d5db',
                        color: '#6b7280',
                        '&:hover': {
                          borderColor: '#9ca3af',
                          bgcolor: alpha('#6b7280', 0.1),
                        }
                      }}
                    >
                      Imprimir QR
                    </Button>
                  </Stack>
                </Paper>

                {/* Status */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                    bgcolor: alpha('#10b981', 0.05),
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <CheckCircle sx={{ color: '#10b981', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#059669' }}>
                      QR Activo
                    </Typography>
                  </Stack>
                  
                  <Typography variant="body2" sx={{ color: '#047857', mb: 3 }}>
                    Tu código QR está funcionando correctamente y listo para recibir validaciones.
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      label="Comercio Verificado"
                      size="small"
                      sx={{
                        bgcolor: alpha('#10b981', 0.2),
                        color: '#047857',
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label="QR Válido"
                      size="small"
                      sx={{
                        bgcolor: alpha('#06b6d4', 0.2),
                        color: '#0891b2',
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
                </Paper>
              </Stack>
            </Box>
          </Box>

          {/* Instructions */}
          <Box sx={{ mt: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                bgcolor: alpha('#6366f1', 0.05),
                border: '1px solid',
                borderColor: alpha('#6366f1', 0.2),
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#5b21b6', mb: 2 }}>
                📋 Instrucciones de Uso
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: '#4c1d95' }}>
                  1. <strong>Descarga</strong> el cartel con QR en formato PDF
                </Typography>
                <Typography variant="body2" sx={{ color: '#4c1d95' }}>
                  2. <strong>Imprime</strong> el cartel en tamaño A4 o mayor
                </Typography>
                <Typography variant="body2" sx={{ color: '#4c1d95' }}>
                  3. <strong>Coloca</strong> el cartel en un lugar visible de tu comercio
                </Typography>
                <Typography variant="body2" sx={{ color: '#4c1d95' }}>
                  4. <strong>Los socios</strong> escanearán el QR para validar sus beneficios
                </Typography>
              </Stack>
            </Paper>
          </Box>
        </CardContent>
      </Card>

      {/* QR Dialog */}
      <Dialog
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <QrCode sx={{ color: '#ec4899', fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
                Código QR de Validación
              </Typography>
            </Box>
            <IconButton onClick={() => setQrDialogOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                width: 300,
                height: 300,
                bgcolor: '#ffffff',
                border: '4px solid #e2e8f0',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              }}
            >
              {/* QR Code placeholder */}
              <Box
                sx={{
                  width: '85%',
                  height: '85%',
                  background: `
                    repeating-linear-gradient(
                      0deg,
                      #000 0px,
                      #000 6px,
                      transparent 6px,
                      transparent 12px
                    ),
                    repeating-linear-gradient(
                      90deg,
                      #000 0px,
                      #000 6px,
                      transparent 6px,
                      transparent 12px
                    )
                  `,
                  borderRadius: 2,
                }}
              />
            </Box>
          </motion.div>

          <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151', mb: 2 }}>
            {comercio?.nombreComercio || 'Mi Comercio'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
            Escanea este código para validar beneficios
          </Typography>

          <Box
            sx={{
              p: 3,
              bgcolor: '#f8fafc',
              borderRadius: 3,
              border: '1px solid #e2e8f0',
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#475569',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                fontSize: '0.8rem',
              }}
            >
              {qrUrl}
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Stack direction="row" spacing={2} width="100%">
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={handleShareQR}
              sx={{ flex: 1 }}
            >
              Compartir
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDownloadQR}
              sx={{
                flex: 1,
                background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
                }
              }}
            >
              Descargar
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};
