'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  Alert,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  QrCode as QrCodeIcon,
  Download as DownloadIcon,
  ContentCopy as CopyIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Restaurant as RestaurantIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from '../../types';

interface QRMenuGeneratorProps {
  menus: Menu[];
  onBack: () => void;
}

interface QRConfig {
  size: number;
  level: 'L' | 'M' | 'Q' | 'H';
  fgColor: string;
  bgColor: string;
  includeMargin: boolean;
}

interface GeneratedQR {
  id: string;
  menuId: string;
  menuName: string;
  url: string;
  config: QRConfig;
  createdAt: Date;
}

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);
const MotionBox = motion(Box);

const QRMenuGenerator: React.FC<QRMenuGeneratorProps> = ({ menus, onBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados básicos
  const [baseUrl, setBaseUrl] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState<string>('');
  const [generatedQRs, setGeneratedQRs] = useState<GeneratedQR[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Configuración del QR
  const [currentConfig, setCurrentConfig] = useState<QRConfig>({
    size: 256,
    level: 'M',
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    includeMargin: true,
  });

  // Detectar URL automáticamente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const selectedMenu = menus.find(m => m.id === selectedMenuId);

  const generateQR = () => {
    if (!selectedMenuId || !selectedMenu) return;

    const menuUrl = `${baseUrl}/menu?id=${selectedMenuId}`;
    const newQR: GeneratedQR = {
      id: `qr-${Date.now()}`,
      menuId: selectedMenuId,
      menuName: selectedMenu.name,
      url: menuUrl,
      config: { ...currentConfig },
      createdAt: new Date(),
    };

    setGeneratedQRs(prev => [newQR, ...prev]);
  };

  // Función de descarga mejorada (del segundo componente)
  const downloadQR = async (qr: GeneratedQR) => {
    setIsGenerating(true);
    try {
      // Buscar el SVG específico de este QR
      const qrCard = document.querySelector(`[data-qr-id="${qr.id}"]`);
      const svg = qrCard?.querySelector('svg');
      
      if (!svg) {
        console.error('SVG no encontrado');
        return;
      }

      // Crear un canvas temporal para la conversión
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('No se pudo crear el contexto del canvas');
        return;
      }

      // Configurar el canvas con alta resolución
      const downloadSize = 512; // Tamaño fijo para descarga de alta calidad
      canvas.width = downloadSize;
      canvas.height = downloadSize;

      // Configurar el contexto para renderizado nítido
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = qr.config.bgColor;
      ctx.fillRect(0, 0, downloadSize, downloadSize);

      // Crear un SVG limpio con las dimensiones correctas
      const cleanSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="${downloadSize}"
             height="${downloadSize}"
             viewBox="0 0 ${downloadSize} ${downloadSize}"
             style="background-color: ${qr.config.bgColor};">
          ${svg.innerHTML}
        </svg>
      `;

      // Convertir a blob y crear URL
      const svgBlob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      // Crear imagen y renderizar en canvas
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Limpiar canvas y dibujar fondo
          ctx.clearRect(0, 0, downloadSize, downloadSize);
          ctx.fillStyle = qr.config.bgColor;
          ctx.fillRect(0, 0, downloadSize, downloadSize);

          // Dibujar la imagen del QR
          ctx.drawImage(img, 0, 0, downloadSize, downloadSize);

          // Convertir a PNG y descargar
          canvas.toBlob((blob) => {
            if (blob) {
              const downloadUrl = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = `qr-${qr.menuId}-${qr.menuName.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`;

              // Agregar al DOM temporalmente para hacer click
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              // Limpiar URLs
              URL.revokeObjectURL(downloadUrl);
              URL.revokeObjectURL(url);
              
              console.log(`✅ QR descargado: ${link.download}`);
            } else {
              console.error('Error al crear el blob PNG');
            }
          }, 'image/png', 1.0);
        } catch (error) {
          console.error('Error al dibujar en canvas:', error);
          URL.revokeObjectURL(url);
        }
      };

      img.onerror = (error) => {
        console.error('Error al cargar imagen SVG:', error);
        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (error) {
      console.error('Error general en downloadQR:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyUrl = async (qr: GeneratedQR) => {
    try {
      await navigator.clipboard.writeText(qr.url);
      setCopied(qr.id);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Error copiando URL:', error);
    }
  };

  const shareQR = async (qr: GeneratedQR) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Menú ${qr.menuName}`,
          text: `Escanea el código QR para ver nuestro menú digital`,
          url: qr.url,
        });
      } catch (error) {
        console.error('Error compartiendo:', error);
        copyUrl(qr);
      }
    } else {
      copyUrl(qr);
    }
  };

  // Función de impresión mejorada (del segundo componente)
  const printQR = (qr: GeneratedQR) => {
    setIsGenerating(true);
    try {
      // Buscar el SVG específico de este QR
      const qrCard = document.querySelector(`[data-qr-id="${qr.id}"]`);
      const svg = qrCard?.querySelector('svg');
      
      if (!svg) {
        console.error('SVG no encontrado para imprimir');
        return;
      }

      // Crear SVG optimizado para impresión
      const printSize = 400;
      const printSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="${printSize}"
             height="${printSize}"
             viewBox="0 0 ${printSize} ${printSize}"
             style="background-color: ${qr.config.bgColor};">
          ${svg.innerHTML}
        </svg>
      `;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        console.error('No se pudo abrir ventana de impresión');
        return;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Código QR - ${qr.menuName}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Inter', Arial, sans-serif;
                text-align: center;
                padding: 40px 20px;
                margin: 0;
                background: white;
                color: #333;
              }
              
              .header {
                margin-bottom: 30px;
              }
              
              .restaurant-name {
                color: #D4AF37;
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 10px;
              }
              
              .subtitle {
                color: #666;
                font-size: 24px;
                font-weight: normal;
                margin: 0;
              }
              
              .qr-container {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 40px;
                border: 4px solid #D4AF37;
                border-radius: 20px;
                margin: 40px auto;
                background: ${qr.config.bgColor};
                max-width: 500px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              
              .qr-container svg {
                display: block;
                width: ${printSize}px !important;
                height: ${printSize}px !important;
                background-color: ${qr.config.bgColor} !important;
              }
              
              .instructions {
                font-size: 24px;
                font-weight: bold;
                color: #D4AF37;
                margin: 40px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 15px;
                border: 3px solid #e9ecef;
              }
              
              .info {
                margin: 30px 0;
                font-size: 18px;
                line-height: 1.6;
              }
              
              .url {
                font-family: 'Courier New', monospace;
                background: #f5f5f5;
                padding: 20px;
                border-radius: 10px;
                word-break: break-all;
                margin: 20px 0;
                border: 2px solid #ddd;
                font-size: 16px;
                font-weight: bold;
              }
              
              .date {
                font-weight: bold;
                color: #555;
                font-size: 16px;
              }
              
              @media print {
                body {
                  margin: 0;
                  padding: 10px;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
                
                .qr-container {
                  box-shadow: none;
                  page-break-inside: avoid;
                  background: ${qr.config.bgColor} !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                
                .qr-container svg {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  background-color: ${qr.config.bgColor} !important;
                }
                
                @page {
                  margin: 1cm;
                  size: A4 portrait;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="restaurant-name">${qr.menuName}</div>
                <h2 class="subtitle">Menú Digital</h2>
              </div>
              
              <div class="qr-container">
                ${printSvg}
              </div>
              
              <div class="instructions">
                📱 Escanea el código QR con la cámara de tu teléfono para acceder al menú digital
              </div>
              
              <div class="info">
                <div class="url">${qr.url}</div>
                <p class="date">Generado el: ${new Date().toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
                <p><strong>Configuración:</strong> ${qr.config.size}px, Nivel ${qr.config.level}</p>
              </div>
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Esperar y luego imprimir
      printWindow.addEventListener('load', () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      });
    } catch (error) {
      console.error('Error en printQR:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const presetColors = [
    { name: 'Clásico', color: '#000000', bg: '#FFFFFF' },
    { name: 'Elegante', color: '#D4AF37', bg: '#FFFFFF' },
    { name: 'Moderno', color: '#2C2C2E', bg: '#F8F8F8' },
    { name: 'Oscuro', color: '#FFFFFF', bg: '#1A1A1A' },
    { name: 'Azul', color: '#3B82F6', bg: '#FFFFFF' },
    { name: 'Verde', color: '#10B981', bg: '#FFFFFF' },
  ];

  const resetToDefaults = () => {
    setCurrentConfig({
      size: 256,
      level: 'M',
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      includeMargin: true,
    });
  };

  const removeQR = (qrId: string) => {
    setGeneratedQRs(prev => prev.filter(qr => qr.id !== qrId));
  };

  if (!baseUrl) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Cargando generador de QR...</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      position: 'relative'
    }}>
      {/* Fondo elegante */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.02) 0%, transparent 50%),
            linear-gradient(180deg, rgba(10, 10, 10, 1) 0%, rgba(16, 16, 16, 1) 100%)
          `,
          pointerEvents: 'none'
        }}
      />

      <Box sx={{ position: 'relative', p: { xs: 2, md: 4 } }}>
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{ mb: 4 }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <motion.div
                initial={{ rotate: -180 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.6 }}
              >
                <QrCodeIcon sx={{ color: '#D4AF37', fontSize: { xs: 28, md: 32 } }} />
              </motion.div>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight={700}
                sx={{ color: '#F8F8F8' }}
              >
                Generador de Códigos QR
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={onBack}
              sx={{
                borderRadius: 0,
                minWidth: { xs: 'auto', md: 'auto' },
                px: { xs: 2, md: 3 }
              }}
            >
              {isMobile ? '←' : 'Volver'}
            </Button>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: '#B8B8B8',
              maxWidth: 600,
              lineHeight: 1.6
            }}
          >
            Genera códigos QR personalizados para tus menús. Los clientes podrán escanear el código y acceder directamente al menú digital.
          </Typography>
        </MotionBox>

        {/* Configuración Principal */}
        <Grid container spacing={4}>
          {/* Panel de Configuración */}
          <Grid item xs={12} lg={4}>
            <MotionPaper
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              sx={{
                p: { xs: 3, md: 4 },
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(26, 26, 26, 0.8) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                height: 'fit-content',
                position: 'sticky',
                top: 20,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#F8F8F8', mb: 3 }}>
                Configuración
              </Typography>

              <Stack spacing={3}>
                {/* URL Base */}
                <TextField
                  label="URL Base del Sitio"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  fullWidth
                  variant="outlined"
                  helperText={`Detectado: ${baseUrl}`}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 0,
                    },
                  }}
                />

                {/* Selector de Menú */}
                <FormControl fullWidth>
                  <InputLabel>Seleccionar Menú</InputLabel>
                  <Select
                    value={selectedMenuId}
                    onChange={(e) => setSelectedMenuId(e.target.value)}
                    label="Seleccionar Menú"
                    sx={{ borderRadius: 0 }}
                  >
                    {menus.map((menu) => (
                      <MenuItem key={menu.id} value={menu.id}>
                        <Box>
                          <Typography variant="body1">{menu.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {menu.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Configuración Avanzada */}
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    startIcon={<SettingsIcon />}
                    onClick={() => setShowSettings(true)}
                    sx={{ flex: 1, borderRadius: 0 }}
                  >
                    Configurar QR
                  </Button>
                </Box>

                {/* Botón Generar */}
                <Button
                  variant="contained"
                  size="large"
                  onClick={generateQR}
                  disabled={!selectedMenuId}
                  startIcon={<AddIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 0,
                    background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #E8C547 0%, #D4AF37 100%)',
                    },
                  }}
                >
                  Generar Código QR
                </Button>

                {/* Info del menú seleccionado */}
                {selectedMenu && (
                  <Box sx={{ p: 2, backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: 0 }}>
                    <Typography variant="subtitle2" sx={{ color: '#D4AF37', mb: 1 }}>
                      Menú Seleccionado:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#F8F8F8', fontWeight: 600 }}>
                      {selectedMenu.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#B8B8B8' }}>
                      {selectedMenu.description}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </MotionPaper>
          </Grid>

          {/* Lista de QRs Generados */}
          <Grid item xs={12} lg={8}>
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" sx={{ color: '#F8F8F8' }}>
                  Códigos QR Generados ({generatedQRs.length})
                </Typography>
                {generatedQRs.length > 0 && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={() => setGeneratedQRs([])}
                    sx={{ borderRadius: 0 }}
                  >
                    Limpiar Todo
                  </Button>
                )}
              </Box>

              {generatedQRs.length === 0 ? (
                <Paper sx={{
                  p: { xs: 4, md: 6 },
                  textAlign: 'center',
                  background: 'rgba(26, 26, 26, 0.6)',
                  border: '1px solid rgba(212, 175, 55, 0.1)',
                }}>
                  <QrCodeIcon sx={{ fontSize: 64, color: '#D4AF37', mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" gutterBottom sx={{ color: '#F8F8F8' }}>
                    No hay códigos QR generados
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B8B8B8', mb: 3 }}>
                    Selecciona un menú y genera tu primer código QR
                  </Typography>
                  <RestaurantIcon sx={{ fontSize: 24, color: '#B8B8B8', opacity: 0.5 }} />
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  <AnimatePresence>
                    {generatedQRs.map((qr, index) => (
                      <Grid item xs={12} sm={6} xl={4} key={qr.id}>
                        <MotionCard
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          sx={{
                            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(44, 44, 46, 0.4) 100%)',
                            border: '1px solid rgba(212, 175, 55, 0.2)',
                            borderRadius: 0,
                            overflow: 'hidden',
                            '&:hover': {
                              border: '1px solid rgba(212, 175, 55, 0.4)',
                              transform: 'translateY(-2px)',
                              transition: 'all 0.3s ease',
                            },
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            {/* Header de la tarjeta */}
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                              <Box flex={1}>
                                <Typography variant="subtitle1" sx={{ color: '#F8F8F8', fontWeight: 600 }}>
                                  {qr.menuName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#B8B8B8' }}>
                                  {qr.createdAt.toLocaleDateString()} • {qr.createdAt.toLocaleTimeString()}
                                </Typography>
                              </Box>
                              <IconButton
                                size="small"
                                onClick={() => removeQR(qr.id)}
                                sx={{ color: '#B8B8B8', '&:hover': { color: '#F87171' } }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>

                            {/* QR Code Display */}
                            <Box
                              data-qr-id={qr.id}
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mb: 2,
                                p: 2,
                                backgroundColor: qr.config.bgColor,
                                borderRadius: 0,
                              }}
                            >
                              <QRCodeSVG
                                value={qr.url}
                                size={120}
                                level={qr.config.level}
                                fgColor={qr.config.fgColor}
                                bgColor={qr.config.bgColor}
                                includeMargin={qr.config.includeMargin}
                              />
                            </Box>

                            {/* URL */}
                            <Box sx={{
                              p: 1.5,
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: 0,
                              mb: 2
                            }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#B8B8B8',
                                  wordBreak: 'break-all',
                                  fontSize: '0.7rem',
                                  lineHeight: 1.3
                                }}
                              >
                                {qr.url}
                              </Typography>
                            </Box>

                            {/* Configuración */}
                            <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" sx={{ gap: 0.5 }}>
                              <Chip
                                label={`${qr.config.size}px`}
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                                  color: '#D4AF37',
                                  fontSize: '0.7rem'
                                }}
                              />
                              <Chip
                                label={`Nivel ${qr.config.level}`}
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                  color: '#3B82F6',
                                  fontSize: '0.7rem'
                                }}
                              />
                            </Stack>
                          </CardContent>

                          <CardActions sx={{ p: 2, pt: 0 }}>
                            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                              <Tooltip title="Descargar PNG">
                                <IconButton
                                  size="small"
                                  onClick={() => downloadQR(qr)}
                                  disabled={isGenerating}
                                  sx={{
                                    color: '#D4AF37',
                                    '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.1)' }
                                  }}
                                >


                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title={copied === qr.id ? "¡Copiado!" : "Copiar URL"}>
                                <IconButton
                                  size="small"
                                  onClick={() => copyUrl(qr)}
                                  sx={{
                                    color: copied === qr.id ? '#10B981' : '#3B82F6',
                                    '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.1)' }
                                  }}
                                >
                                  <CopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Imprimir">
                                <IconButton
                                  size="small"
                                  onClick={() => printQR(qr)}
                                  disabled={isGenerating}
                                  sx={{
                                    color: '#8B5CF6',
                                    '&:hover': { backgroundColor: 'rgba(139, 92, 246, 0.1)' }
                                  }}
                                >
                                  <PrintIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Compartir">
                                <IconButton
                                  size="small"
                                  onClick={() => shareQR(qr)}
                                  sx={{
                                    color: '#10B981',
                                    '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)' }
                                  }}
                                >
                                  <ShareIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </CardActions>
                        </MotionCard>
                      </Grid>
                    ))}
                  </AnimatePresence>
                </Grid>
              )}
            </MotionBox>
          </Grid>
        </Grid>

        {/* Mensaje de éxito */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 1000,
              }}
            >
              <Alert
                severity="success"
                sx={{
                  borderRadius: 0,
                  backgroundColor: 'rgba(16, 185, 129, 0.9)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(16, 185, 129, 1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                ✅ URL copiada al portapapeles
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Dialog de Configuración */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            backgroundColor: '#2C2C2E',
            backgroundImage: 'none',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <PaletteIcon sx={{ color: '#D4AF37' }} />
              <Typography variant="h6" fontWeight={600} sx={{ color: '#F8F8F8' }}>
                Configuración Avanzada del QR
              </Typography>
            </Box>
            <IconButton onClick={() => setShowSettings(false)} size="small" sx={{ color: '#B8B8B8' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={4} sx={{ mt: 1 }}>
            {/* Tamaño */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#F8F8F8' }}>
                Tamaño: <strong>{currentConfig.size}px</strong>
              </Typography>
              <Slider
                value={currentConfig.size}
                onChange={(_, value) => setCurrentConfig(prev => ({ ...prev, size: value as number }))}
                min={128}
                max={512}
                step={32}
                marks={[
                  { value: 128, label: '128px' },
                  { value: 256, label: '256px' },
                  { value: 384, label: '384px' },
                  { value: 512, label: '512px' },
                ]}
                sx={{
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#D4AF37',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#D4AF37',
                  },
                  '& .MuiSlider-markLabel': {
                    color: '#B8B8B8',
                  },
                }}
              />
            </Box>

            {/* Nivel de Corrección de Errores */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#B8B8B8' }}>Nivel de Corrección de Errores</InputLabel>
              <Select
                value={currentConfig.level}
                onChange={(e) => setCurrentConfig(prev => ({ ...prev, level: e.target.value as 'L' | 'M' | 'Q' | 'H' }))}
                label="Nivel de Corrección de Errores"
                sx={{
                  borderRadius: 0,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(212, 175, 55, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(212, 175, 55, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D4AF37',
                  },
                }}
              >
                <MenuItem value="L">Bajo (7%) - Más rápido</MenuItem>
                <MenuItem value="M">Medio (15%) - Recomendado</MenuItem>
                <MenuItem value="Q">Alto (25%) - Más resistente</MenuItem>
                <MenuItem value="H">Muy Alto (30%) - Máxima resistencia</MenuItem>
              </Select>
            </FormControl>

            {/* Combinaciones de Colores Predefinidas */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#F8F8F8' }}>
                Combinaciones de Colores
              </Typography>
              <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))" gap={1}>
                {presetColors.map((preset) => (
                  <Button
                    key={preset.name}
                    variant={currentConfig.fgColor === preset.color && currentConfig.bgColor === preset.bg ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => {
                      setCurrentConfig(prev => ({
                        ...prev,
                        fgColor: preset.color,
                        bgColor: preset.bg
                      }));
                    }}
                    sx={{
                      minWidth: 'auto',
                      px: 1,
                      py: 0.5,
                      fontSize: '0.75rem',
                      borderRadius: 0,
                      borderColor: 'rgba(212, 175, 55, 0.3)',
                      color: currentConfig.fgColor === preset.color && currentConfig.bgColor === preset.bg ? '#0A0A0A' : '#D4AF37',
                      '&:hover': {
                        borderColor: 'rgba(212, 175, 55, 0.5)',
                        backgroundColor: currentConfig.fgColor === preset.color && currentConfig.bgColor === preset.bg ? '#D4AF37' : 'rgba(212, 175, 55, 0.1)',
                      },
                    }}
                  >
                    {preset.name}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Colores Personalizados */}
            <Stack direction="row" spacing={2}>
              <Box flex={1}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#F8F8F8' }}>
                  Color del QR
                </Typography>
                <TextField
                  type="color"
                  value={currentConfig.fgColor}
                  onChange={(e) => setCurrentConfig(prev => ({ ...prev, fgColor: e.target.value }))}
                  fullWidth
                  size="small"
                  sx={{
                    '& input': {
                      height: 40,
                      cursor: 'pointer',
                      borderRadius: 0,
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />
              </Box>
              
              <Box flex={1}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#F8F8F8' }}>
                  Color de Fondo
                </Typography>
                <TextField
                  type="color"
                  value={currentConfig.bgColor}
                  onChange={(e) => setCurrentConfig(prev => ({ ...prev, bgColor: e.target.value }))}
                  fullWidth
                  size="small"
                  sx={{
                    '& input': {
                      height: 40,
                      cursor: 'pointer',
                      borderRadius: 0,
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />
              </Box>
            </Stack>

            {/* Incluir Margen */}
            <FormControlLabel
              control={
                <Switch
                  checked={currentConfig.includeMargin}
                  onChange={(e) => setCurrentConfig(prev => ({ ...prev, includeMargin: e.target.checked }))}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#D4AF37',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#D4AF37',
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ color: '#F8F8F8' }}>
                  Incluir margen alrededor del QR
                </Typography>
              }
            />

            {/* Vista Previa */}
            <Box sx={{
              textAlign: 'center',
              p: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 0,
              border: '1px solid rgba(212, 175, 55, 0.2)'
            }}>
              <Typography variant="caption" sx={{ color: '#B8B8B8', mb: 2, display: 'block' }}>
                Vista previa:
              </Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  p: 1,
                  backgroundColor: currentConfig.bgColor,
                  borderRadius: 0,
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              >
                <QRCodeSVG
                  value={selectedMenu ? `${baseUrl}/menu?id=${selectedMenu.id}` : 'https://ejemplo.com/menu'}
                  size={80}
                  level={currentConfig.level}
                  fgColor={currentConfig.fgColor}
                  bgColor={currentConfig.bgColor}
                  includeMargin={currentConfig.includeMargin}
                />
              </Box>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={resetToDefaults}
            sx={{
              color: '#B8B8B8',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: 'rgba(184, 184, 184, 0.1)',
              },
            }}
          >
            Restablecer
          </Button>
          <Button
            onClick={() => setShowSettings(false)}
            variant="contained"
            sx={{
              borderRadius: 0,
              background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E8C547 0%, #D4AF37 100%)',
              },
            }}
          >
            Aplicar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QRMenuGenerator;