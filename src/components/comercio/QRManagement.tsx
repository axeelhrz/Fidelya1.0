'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid2 as Grid,
  Stack,
  Paper,
  Avatar,
  alpha,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  QrCode,
  Download,
  Print,
  Share,
  Store,
  Info,
  CheckCircle,
  ContentCopy,
  Refresh,
} from '@mui/icons-material';
import { useComercios } from '@/hooks/useComercios';
import QRCodeLib from 'qrcode';
import toast from 'react-hot-toast';

export const QRManagement: React.FC = () => {
  const { comercio } = useComercios();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const qrUrl = comercio ? `${window.location.origin}/validar-beneficio?comercio=${comercio.uid}` : '';

  React.useEffect(() => {
    if (comercio) {
      generateQR();
    }
  }, [comercio]);

  const generateQR = async () => {
    if (!comercio) return;

    try {
      setLoading(true);
      const qrData = {
        comercioId: comercio.uid,
        timestamp: Date.now(),
        signature: btoa(`${comercio.uid}-${Date.now()}`) // Simple signature
      };

      const qrString = JSON.stringify(qrData);
      const dataUrl = await QRCodeLib.toDataURL(qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });

      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR:', error);
      toast.error('Error al generar el código QR');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = async (format: 'png' | 'pdf') => {
    if (!qrDataUrl || !comercio) return;

    try {
      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `qr-${comercio.nombreComercio.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = qrDataUrl;
        link.click();
      } else if (format === 'pdf') {
        // Create a printable PDF layout
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>QR Code - ${comercio.nombreComercio}</title>
              <style>
                body {
                  font-family: 'Arial', sans-serif;
                  margin: 0;
                  padding: 40px;
                  background: white;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
                .qr-container {
                  text-align: center;
                  max-width: 400px;
                  border: 2px solid #06b6d4;
                  border-radius: 20px;
                  padding: 40px;
                  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
                }
                .logo {
                  width: 80px;
                  height: 80px;
                  border-radius: 50%;
                  margin: 0 auto 20px;
                  background: #06b6d4;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 32px;
                }
                .title {
                  font-size: 24px;
                  font-weight: bold;
                  color: #1e293b;
                  margin-bottom: 10px;
                }
                .subtitle {
                  font-size: 16px;
                  color: #64748b;
                  margin-bottom: 30px;
                }
                .qr-code {
                  margin: 30px 0;
                  padding: 20px;
                  background: white;
                  border-radius: 15px;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }
                .instructions {
                  font-size: 14px;
                  color: #64748b;
                  line-height: 1.6;
                  margin-top: 20px;
                }
                .footer {
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #e2e8f0;
                  font-size: 12px;
                  color: #94a3b8;
                }
                @media print {
                  body { margin: 0; padding: 20px; }
                  .qr-container { border: 2px solid #06b6d4; }
                }
              </style>
            </head>
            <body>
              <div class="qr-container">
                <div class="logo">🏪</div>
                <div class="title">${comercio.nombreComercio}</div>
                <div class="subtitle">${comercio.categoria}</div>
                <div class="qr-code">
                  <img src="${qrDataUrl}" alt="QR Code" style="width: 200px; height: 200px;" />
                </div>
                <div class="instructions">
                  <strong>Instrucciones:</strong><br>
                  1. El socio debe escanear este código QR<br>
                  2. Seleccionar el beneficio a utilizar<br>
                  3. Confirmar la validación en pantalla<br>
                  4. Aplicar el descuento correspondiente
                </div>
                <div class="footer">
                  Powered by Fidelitá - Sistema de Fidelización
                </div>
              </div>
            </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }
      toast.success(`QR descargado en formato ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error downloading QR:', error);
      toast.error('Error al descargar el QR');
    }
  };

  const copyQRUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    toast.success('URL copiada al portapapeles');
  };

  const shareQR = async () => {
    if (navigator.share && qrDataUrl) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrDataUrl);
        const blob = await response.blob();
        const file = new File([blob], `qr-${comercio?.nombreComercio}.png`, { type: 'image/png' });

        await navigator.share({
          title: `QR Code - ${comercio?.nombreComercio}`,
          text: 'Escanea este código QR para acceder a nuestros beneficios',
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing:', error);
        copyQRUrl();
      }
    } else {
      copyQRUrl();
    }
  };

  if (!comercio) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: '#64748b' }}>
          Cargando información del comercio...
        </Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={4}>
        {/* QR Code Display */}
        <Grid xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              background: 'white',
              border: '1px solid #f1f5f9',
              borderRadius: 3,
              height: 'fit-content',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Código QR de Validación
                </Typography>
                <Tooltip title="Regenerar QR">
                  <IconButton
                    onClick={generateQR}
                    disabled={loading}
                    sx={{
                      bgcolor: alpha('#06b6d4', 0.1),
                      color: '#06b6d4',
                      '&:hover': {
                        bgcolor: alpha('#06b6d4', 0.2),
                      }
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Stack>

              <Box sx={{ textAlign: 'center', mb: 4 }}>
                {loading ? (
                  <Box sx={{ py: 8 }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Avatar sx={{ width: 60, height: 60, bgcolor: '#06b6d4', mx: 'auto' }}>
                        <QrCode sx={{ fontSize: 30 }} />
                      </Avatar>
                    </motion.div>
                  </Box>
                ) : qrDataUrl ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: '#fafbfc',
                        border: '2px solid #06b6d4',
                        borderRadius: 3,
                        display: 'inline-block',
                      }}
                    >
                      <img
                        src={qrDataUrl}
                        alt="QR Code"
                        style={{
                          width: 250,
                          height: 250,
                          display: 'block',
                        }}
                      />
                    </Paper>
                  </motion.div>
                ) : (
                  <Box sx={{ py: 8 }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: alpha('#ef4444', 0.1), color: '#ef4444', mx: 'auto', mb: 2 }}>
                      <QrCode sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Error al generar el código QR
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Action Buttons */}
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={() => downloadQR('png')}
                  disabled={!qrDataUrl}
                  fullWidth
                  sx={{
                    bgcolor: '#06b6d4',
                    '&:hover': { bgcolor: '#0891b2' },
                    borderRadius: 2,
                    py: 1.5,
                  }}
                >
                  Descargar PNG
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  onClick={() => downloadQR('pdf')}
                  disabled={!qrDataUrl}
                  fullWidth
                  sx={{
                    borderColor: '#06b6d4',
                    color: '#06b6d4',
                    '&:hover': {
                      borderColor: '#0891b2',
                      bgcolor: alpha('#06b6d4', 0.1),
                    },
                    borderRadius: 2,
                    py: 1.5,
                  }}
                >
                  Imprimir Cartel
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={shareQR}
                  disabled={!qrDataUrl}
                  fullWidth
                  sx={{
                    borderColor: '#10b981',
                    color: '#10b981',
                    '&:hover': {
                      borderColor: '#059669',
                      bgcolor: alpha('#10b981', 0.1),
                    },
                    borderRadius: 2,
                    py: 1.5,
                  }}
                >
                  Compartir
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Instructions and Info */}
        <Grid xs={12} md={6}>
          <Stack spacing={3}>
            {/* Commerce Info */}
            <Card
              elevation={0}
              sx={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                color: 'white',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Avatar
                    src={comercio.logoUrl}
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: alpha('#ffffff', 0.2),
                      border: '3px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    <Store sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {comercio.nombreComercio}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                      {comercio.categoria}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      ID: {comercio.uid.substring(0, 8)}...
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* QR URL */}
            <Card
              elevation={0}
              sx={{
                background: 'white',
                border: '1px solid #f1f5f9',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
                  URL de Validación
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: '#fafbfc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748b',
                      wordBreak: 'break-all',
                      fontFamily: 'monospace',
                    }}
                  >
                    {qrUrl}
                  </Typography>
                </Paper>
                <Button
                  startIcon={<ContentCopy />}
                  onClick={copyQRUrl}
                  size="small"
                  sx={{
                    color: '#06b6d4',
                    '&:hover': {
                      bgcolor: alpha('#06b6d4', 0.1),
                    }
                  }}
                >
                  Copiar URL
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card
              elevation={0}
              sx={{
                background: 'white',
                border: '1px solid #f1f5f9',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha('#10b981', 0.1),
                      color: '#10b981',
                      width: 40,
                      height: 40,
                    }}
                  >
                    <Info />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Instrucciones de Uso
                  </Typography>
                </Stack>

                <Stack spacing={3}>
                  {[
                    {
                      step: '1',
                      title: 'Mostrar el QR',
                      description: 'Coloca el código QR en un lugar visible de tu comercio o muéstralo en tu dispositivo.',
                      icon: <QrCode />,
                    },
                    {
                      step: '2',
                      title: 'Cliente escanea',
                      description: 'El socio escanea el código QR con su teléfono para acceder a los beneficios disponibles.',
                      icon: <Store />,
                    },
                    {
                      step: '3',
                      title: 'Validar beneficio',
                      description: 'El socio selecciona el beneficio y tú confirmas la validación en tu pantalla.',
                      icon: <CheckCircle />,
                    },
                  ].map((instruction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Avatar
                          sx={{
                            bgcolor: alpha('#06b6d4', 0.1),
                            color: '#06b6d4',
                            width: 40,
                            height: 40,
                            fontWeight: 700,
                          }}
                        >
                          {instruction.step}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                            {instruction.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                            {instruction.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </motion.div>
                  ))}
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Box
                  sx={{
                    p: 3,
                    bgcolor: alpha('#f59e0b', 0.1),
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha('#f59e0b', 0.2),
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: alpha('#f59e0b', 0.2),
                        color: '#f59e0b',
                        width: 32,
                        height: 32,
                      }}
                    >
                      <Info sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#92400e', mb: 1 }}>
                        Importante
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#92400e' }}>
                        Mantén este código QR seguro y no lo compartas públicamente. Solo debe ser visible en tu establecimiento.
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </motion.div>
  );
};