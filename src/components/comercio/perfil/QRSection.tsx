'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  CircularProgress,
  Tabs,
  Tab,
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
  PictureAsPdf,
  Image as ImageIcon,
  ExternalLink,
  Smartphone,
  Language,
} from '@mui/icons-material';
import Image from 'next/image';
import { useComercios } from '@/hooks/useComercios';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

export const QRSection: React.FC = () => {
  const { comercio, generateQRUrl, generateWebUrl } = useComercios();
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [webQrDataUrl, setWebQrDataUrl] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate QR validation URLs
  const qrUrl = generateQRUrl(); // fidelya:// protocol for app scanning
  const webUrl = generateWebUrl(); // http:// protocol for web access

  const generateQRCode = React.useCallback(async () => {
    try {
      setGenerating(true);
      
      // Generate QR for app scanning (fidelya:// protocol)
      const appQrDataUrl = await QRCode.toDataURL(qrUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      setQrDataUrl(appQrDataUrl);

      // Generate QR for web access (http:// protocol) as fallback
      const webQrDataUrl = await QRCode.toDataURL(webUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      setWebQrDataUrl(webQrDataUrl);
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Error al generar el código QR');
    } finally {
      setGenerating(false);
    }
  }, [qrUrl, webUrl]);

  // Generate QR code data URL
  useEffect(() => {
    if (qrUrl && webUrl) {
      generateQRCode();
    }
  }, [qrUrl, webUrl, generateQRCode]);

  const handleCopyUrl = async (urlType: 'app' | 'web' = 'web') => {
    try {
      const urlToCopy = urlType === 'app' ? qrUrl : webUrl;
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      toast.success(`URL ${urlType === 'app' ? 'de aplicación' : 'web'} copiada al portapapeles`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Error al copiar la URL');
    }
  };

  const handleDownloadQR = async (format: 'png' | 'pdf' = 'png', qrType: 'app' | 'web' = 'app') => {
    const dataUrl = qrType === 'app' ? qrDataUrl : webQrDataUrl;
    if (!dataUrl) return;

    try {
      setDownloading(true);
      
      if (format === 'png') {
        // Download as PNG
        const link = document.createElement('a');
        link.download = `qr-${qrType}-${comercio?.nombreComercio || 'comercio'}.png`;
        link.href = dataUrl;
        link.click();
        toast.success(`QR ${qrType === 'app' ? 'de aplicación' : 'web'} descargado como imagen`);
      } else {
        // Generate PDF poster
        await generatePDFPoster(qrType);
      }
    } catch (error) {
      console.error('Error downloading QR:', error);
      toast.error('Error al descargar el QR');
    } finally {
      setDownloading(false);
    }
  };

  const generatePDFPoster = async (qrType: 'app' | 'web' = 'app') => {
    try {
      const dataUrl = qrType === 'app' ? qrDataUrl : webQrDataUrl;
      if (!dataUrl) return;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add title
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Código QR de Validación', pageWidth / 2, 30, { align: 'center' });

      // Add comercio name
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'normal');
      const comercioName = comercio?.nombreComercio || 'Mi Comercio';
      pdf.text(comercioName, pageWidth / 2, 45, { align: 'center' });

      // Add QR type indicator
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'italic');
      pdf.text(
        qrType === 'app' ? '(Para aplicación móvil)' : '(Para acceso web)', 
        pageWidth / 2, 55, 
        { align: 'center' }
      );

      // Add QR code
      const qrSize = 120;
      const qrX = (pageWidth - qrSize) / 2;
      const qrY = 70;
      pdf.addImage(dataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

      // Add instructions
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Instrucciones:', 20, 210);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const instructions = qrType === 'app' ? [
        '1. Los socios deben escanear este código con la aplicación Fidelitá',
        '2. El código está optimizado para la aplicación móvil',
        '3. Coloca este cartel en un lugar visible de tu comercio',
        '4. Mantén el cartel limpio y sin daños para mejor lectura'
      ] : [
        '1. Los socios pueden escanear este código con cualquier lector QR',
        '2. El código redirige a la página web de validación',
        '3. Funciona como respaldo si no tienen la aplicación',
        '4. Coloca este cartel en un lugar visible de tu comercio'
      ];

      instructions.forEach((instruction, index) => {
        pdf.text(instruction, 20, 225 + (index * 8));
      });

      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Generado por Fidelitá', pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text(new Date().toLocaleDateString(), pageWidth / 2, pageHeight - 5, { align: 'center' });

      // Save PDF
      pdf.save(`cartel-qr-${qrType}-${comercio?.nombreComercio || 'comercio'}.pdf`);
      toast.success(`Cartel PDF ${qrType === 'app' ? 'de aplicación' : 'web'} descargado correctamente`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el cartel PDF');
    }
  };

  const handlePrintQR = (qrType: 'app' | 'web' = 'app') => {
    const dataUrl = qrType === 'app' ? qrDataUrl : webQrDataUrl;
    if (!dataUrl) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR ${qrType === 'app' ? 'Aplicación' : 'Web'} - ${comercio?.nombreComercio || 'Comercio'}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                margin: 0;
              }
              .header { 
                margin-bottom: 30px; 
              }
              .title { 
                font-size: 24px; 
                font-weight: bold; 
                margin-bottom: 10px; 
              }
              .subtitle { 
                font-size: 18px; 
                color: #666; 
                margin-bottom: 10px; 
              }
              .qr-type { 
                font-size: 14px; 
                color: #888; 
                font-style: italic;
                margin-bottom: 30px; 
              }
              .qr-container { 
                margin: 30px 0; 
              }
              .qr-image { 
                max-width: 300px; 
                height: auto; 
              }
              .instructions { 
                text-align: left; 
                max-width: 500px; 
                margin: 30px auto; 
              }
              .instructions h3 { 
                font-size: 16px; 
                margin-bottom: 15px; 
              }
              .instructions ol { 
                padding-left: 20px; 
              }
              .instructions li { 
                margin-bottom: 8px; 
                font-size: 14px; 
              }
              .footer { 
                margin-top: 40px; 
                font-size: 12px; 
                color: #999; 
              }
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">Código QR de Validación</div>
              <div class="subtitle">${comercio?.nombreComercio || 'Mi Comercio'}</div>
              <div class="qr-type">${qrType === 'app' ? '(Para aplicación móvil)' : '(Para acceso web)'}</div>
            </div>
            
            <div class="qr-container">
              <img src="${dataUrl}" alt="Código QR" class="qr-image" />
            </div>
            
            <div class="instructions">
              <h3>Instrucciones de Uso:</h3>
              <ol>
                ${qrType === 'app' ? `
                  <li>Los socios deben escanear este código con la aplicación Fidelitá</li>
                  <li>El código está optimizado para la aplicación móvil</li>
                  <li>Coloca este cartel en un lugar visible de tu comercio</li>
                  <li>Mantén el cartel limpio y sin daños para mejor lectura</li>
                ` : `
                  <li>Los socios pueden escanear este código con cualquier lector QR</li>
                  <li>El código redirige a la página web de validación</li>
                  <li>Funciona como respaldo si no tienen la aplicación</li>
                  <li>Coloca este cartel en un lugar visible de tu comercio</li>
                `}
              </ol>
            </div>
            
            <div class="footer">
              Generado por Fidelitá - ${new Date().toLocaleDateString()}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleShareQR = async (qrType: 'app' | 'web' = 'app') => {
    const dataUrl = qrType === 'app' ? qrDataUrl : webQrDataUrl;
    const urlToShare = qrType === 'app' ? qrUrl : webUrl;
    
    if (navigator.share && dataUrl) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `qr-${qrType}-${comercio?.nombreComercio || 'comercio'}.png`, { type: 'image/png' });

        await navigator.share({
          title: `QR ${qrType === 'app' ? 'de Aplicación' : 'Web'} de ${comercio?.nombreComercio || 'Mi Comercio'}`,
          text: `Escanea este QR para validar beneficios en Fidelitá ${qrType === 'app' ? '(Aplicación)' : '(Web)'}`,
          files: [file],
        });
      } catch {
        // Fallback to URL sharing
        if (navigator.share) {
          try {
            await navigator.share({
              title: `QR ${qrType === 'app' ? 'de Aplicación' : 'Web'} de ${comercio?.nombreComercio || 'Mi Comercio'}`,
              text: `Escanea este QR para validar beneficios en Fidelitá ${qrType === 'app' ? '(Aplicación)' : '(Web)'}`,
              url: urlToShare,
            });
          } catch {
            handleCopyUrl(qrType);
          }
        } else {
          handleCopyUrl(qrType);
        }
      }
    } else {
      handleCopyUrl(qrType);
    }
  };

  const getCurrentQRData = () => {
    return activeTab === 0 ? qrDataUrl : webQrDataUrl;
  };

  const getCurrentQRType = (): 'app' | 'web' => {
    return activeTab === 0 ? 'app' : 'web';
  };

  const getCurrentUrl = () => {
    return activeTab === 0 ? qrUrl : webUrl;
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
              Códigos QR de Validación
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
              Genera códigos QR para que los socios validen sus beneficios. Disponible en dos formatos: aplicación móvil y acceso web.
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
                {/* QR Type Tabs */}
                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  centered
                  sx={{ mb: 3 }}
                >
                  <Tab 
                    icon={<Smartphone />} 
                    label="Aplicación" 
                    sx={{ minHeight: 48 }}
                  />
                  <Tab 
                    icon={<Language />} 
                    label="Web" 
                    sx={{ minHeight: 48 }}
                  />
                </Tabs>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Box
                    ref={qrRef}
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
                    {generating ? (
                      <CircularProgress sx={{ color: '#ec4899' }} />
                    ) : getCurrentQRData() ? (
                      <Image
                        src={getCurrentQRData()}
                        alt="Código QR"
                        width={180}
                        height={180}
                        style={{
                          width: '90%',
                          height: '90%',
                          objectFit: 'contain'
                        }}
                        unoptimized
                        priority
                      />
                    ) : (
                      <QrCode sx={{ fontSize: 60, color: '#ec4899', opacity: 0.5 }} />
                    )}
                    
                    {/* Hover overlay */}
                    {getCurrentQRData() && (
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
                    )}
                  </Box>
                </motion.div>

                <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151', mb: 1 }}>
                  QR {activeTab === 0 ? 'de Aplicación' : 'Web'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                  {activeTab === 0 
                    ? 'Optimizado para la aplicación móvil Fidelitá'
                    : 'Compatible con cualquier lector QR, redirige a la página de validación web'
                  }
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                  <Tooltip title="Ver QR completo">
                    <IconButton
                      onClick={() => setQrDialogOpen(true)}
                      disabled={!getCurrentQRData()}
                      sx={{
                        bgcolor: alpha('#ec4899', 0.1),
                        color: '#ec4899',
                        '&:hover': {
                          bgcolor: alpha('#ec4899', 0.2),
                        },
                        '&:disabled': {
                          bgcolor: alpha('#9ca3af', 0.1),
                          color: '#9ca3af',
                        }
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Compartir QR">
                    <IconButton
                      onClick={() => handleShareQR(getCurrentQRType())}
                      disabled={!getCurrentQRData()}
                      sx={{
                        bgcolor: alpha('#06b6d4', 0.1),
                        color: '#06b6d4',
                        '&:hover': {
                          bgcolor: alpha('#06b6d4', 0.2),
                        },
                        '&:disabled': {
                          bgcolor: alpha('#9ca3af', 0.1),
                          color: '#9ca3af',
                        }
                      }}
                    >
                      <Share />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Imprimir QR">
                    <IconButton
                      onClick={() => handlePrintQR(getCurrentQRType())}
                      disabled={!getCurrentQRData()}
                      sx={{
                        bgcolor: alpha('#10b981', 0.1),
                        color: '#10b981',
                        '&:hover': {
                          bgcolor: alpha('#10b981', 0.2),
                        },
                        '&:disabled': {
                          bgcolor: alpha('#9ca3af', 0.1),
                          color: '#9ca3af',
                        }
                      }}
                    >
                      <Print />
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
                    URL de Validación {activeTab === 0 ? '(Aplicación)' : '(Web)'}
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
                      {getCurrentUrl()}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    startIcon={copied ? <CheckCircle /> : <ContentCopy />}
                    onClick={() => handleCopyUrl(getCurrentQRType())}
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

                {/* Download Actions */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151', mb: 3 }}>
                    Descargas
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={downloading ? <CircularProgress size={16} /> : <PictureAsPdf />}
                      onClick={() => handleDownloadQR('pdf', getCurrentQRType())}
                      disabled={!getCurrentQRData() || downloading}
                      fullWidth
                      sx={{
                        background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                        boxShadow: '0 4px 20px rgba(236, 72, 153, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
                          boxShadow: '0 6px 25px rgba(236, 72, 153, 0.4)',
                        },
                        '&:disabled': {
                          background: '#e2e8f0',
                          color: '#94a3b8',
                          boxShadow: 'none',
                        }
                      }}
                    >
                      {downloading ? 'Generando...' : `Descargar Cartel PDF ${activeTab === 0 ? '(App)' : '(Web)'}`}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<ImageIcon />}
                      onClick={() => handleDownloadQR('png', getCurrentQRType())}
                      disabled={!getCurrentQRData()}
                      fullWidth
                      sx={{
                        borderColor: '#d1d5db',
                        color: '#6b7280',
                        '&:hover': {
                          borderColor: '#9ca3af',
                          bgcolor: alpha('#6b7280', 0.1),
                        },
                        '&:disabled': {
                          borderColor: '#e2e8f0',
                          color: '#94a3b8',
                        }
                      }}
                    >
                      Descargar QR PNG
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<Print />}
                      onClick={() => handlePrintQR(getCurrentQRType())}
                      disabled={!getCurrentQRData()}
                      fullWidth
                      sx={{
                        borderColor: '#d1d5db',
                        color: '#6b7280',
                        '&:hover': {
                          borderColor: '#9ca3af',
                          bgcolor: alpha('#6b7280', 0.1),
                        },
                        '&:disabled': {
                          borderColor: '#e2e8f0',
                          color: '#94a3b8',
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
                    Tus códigos QR están funcionando correctamente y listos para recibir validaciones.
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
                    {comercio?.visible && (
                      <Chip
                        label="Visible para Socios"
                        size="small"
                        sx={{
                          bgcolor: alpha('#8b5cf6', 0.2),
                          color: '#7c3aed',
                          fontWeight: 600,
                        }}
                      />
                    )}
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
                  <strong>QR de Aplicación:</strong> Optimizado para socios que usan la app móvil Fidelitá
                </Typography>
                <Typography variant="body2" sx={{ color: '#4c1d95' }}>
                  <strong>QR Web:</strong> Compatible con cualquier lector QR, redirige a la página web de validación
                </Typography>
                <Typography variant="body2" sx={{ color: '#4c1d95' }}>
                  1. <strong>Descarga</strong> el cartel con QR en formato PDF o imprime directamente
                </Typography>
                <Typography variant="body2" sx={{ color: '#4c1d95' }}>
                  2. <strong>Coloca</strong> el cartel en un lugar visible y accesible de tu comercio
                </Typography>
                <Typography variant="body2" sx={{ color: '#4c1d95' }}>
                  3. <strong>Los socios</strong> escanearán el QR para validar sus beneficios automáticamente
                </Typography>
                <Typography variant="body2" sx={{ color: '#4c1d95' }}>
                  4. <strong>Mantén</strong> el cartel limpio y sin daños para garantizar una lectura óptima
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
                Código QR {activeTab === 0 ? 'de Aplicación' : 'Web'}
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
              {getCurrentQRData() ? (
                <Image
                  src={getCurrentQRData()}
                  alt="Código QR"
                  width={270}
                  height={270}
                  style={{
                    width: '90%',
                    height: '90%',
                    objectFit: 'contain'
                  }}
                  unoptimized
                  priority
                />
              ) : (
                <CircularProgress sx={{ color: '#ec4899' }} />
              )}
            </Box>
          </motion.div>

          <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151', mb: 2 }}>
            {comercio?.nombreComercio || 'Mi Comercio'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 1 }}>
            {activeTab === 0 ? 'Para aplicación móvil' : 'Para acceso web'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
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
              {getCurrentUrl()}
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Stack direction="row" spacing={2} width="100%">
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={() => handleShareQR(getCurrentQRType())}
              disabled={!getCurrentQRData()}
              sx={{ flex: 1 }}
            >
              Compartir
            </Button>
            <Button
              variant="contained"
              startIcon={downloading ? <CircularProgress size={16} /> : <Download />}
              onClick={() => handleDownloadQR('pdf', getCurrentQRType())}
              disabled={!getCurrentQRData() || downloading}
              sx={{
                flex: 1,
                background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
                },
                '&:disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8',
                }
              }}
            >
              {downloading ? 'Generando...' : 'Descargar'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};