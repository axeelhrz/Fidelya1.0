'use client';

import React, { useState, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  Stack,
  Alert,
  IconButton,
  Divider,
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
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface QRGeneratorProps {
  menuId: string;
  menuName: string;
}

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const QRGenerator: React.FC<QRGeneratorProps> = ({ menuId, menuName }) => {
  const [baseUrl, setBaseUrl] = useState('http://localhost:3000');
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [qrSize, setQrSize] = useState(256);
  const [qrLevel, setQrLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
  const [includeMargin, setIncludeMargin] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  
  const menuUrl = `${baseUrl}/menu?id=${menuId}`;

  // Función simplificada para generar QR como canvas y descargar
  const downloadQR = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Crear un canvas directamente
      const canvas = document.createElement('canvas');
      const size = 512; // Alta resolución
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('No se pudo crear el contexto del canvas');
      }

      // Usar la librería QRCode directamente para generar en canvas
      const QRCode = await import('qrcode');
      
      // Configurar opciones
      const options = {
        errorCorrectionLevel: qrLevel,
        type: 'image/png' as const,
        quality: 1.0,
        margin: includeMargin ? 4 : 1,
        color: {
          dark: qrColor,
          light: qrBgColor,
        },
        width: size,
      };

      // Generar QR directamente en canvas
      await QRCode.toCanvas(canvas, menuUrl, options);
      
      // Crear enlace de descarga
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          
          // Nombre de archivo único
          const sanitizedMenuName = menuName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
          const timestamp = Date.now();
          link.download = `qr-${menuId}-${sanitizedMenuName}-${timestamp}.png`;
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Limpiar URL
          URL.revokeObjectURL(url);
          
          console.log(`✅ QR descargado exitosamente: ${link.download}`);
        }
      }, 'image/png', 1.0);
      
    } catch (error) {
      console.error('❌ Error al descargar QR:', error);
      alert('Error al generar el código QR para descarga. Inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  }, [menuUrl, qrLevel, qrColor, qrBgColor, includeMargin, menuId, menuName]);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copiando URL:', error);
    }
  };

  const printQR = useCallback(async () => {
    try {
      setIsGenerating(true);
      
      // Generar QR para impresión usando la librería QRCode
      const QRCode = await import('qrcode');
      
      const options = {
        errorCorrectionLevel: 'H' as const, // Máxima corrección para impresión
        type: 'image/png' as const,
        quality: 1.0,
        margin: 4,
        color: {
          dark: qrColor,
          light: qrBgColor,
        },
        width: 400,
      };

      // Generar QR como data URL
      const qrDataURL = await QRCode.toDataURL(menuUrl, options);
      
      // Abrir ventana de impresión
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('No se pudo abrir ventana de impresión');
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Código QR - ${menuName}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
                background: white;
                color: black;
                line-height: 1.6;
              }
              
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              
              .header {
                margin-bottom: 30px;
              }
              
              .header h1 {
                color: #333;
                margin-bottom: 10px;
                font-size: 32px;
                font-weight: bold;
              }
              
              .header h2 {
                color: #666;
                font-weight: normal;
                font-size: 24px;
              }
              
              .qr-container {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 40px;
                border: 4px solid #000;
                border-radius: 20px;
                margin: 40px auto;
                background: white;
                max-width: 500px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              
              .qr-container img {
                display: block;
                width: 400px !important;
                height: 400px !important;
                max-width: 100%;
                image-rendering: pixelated;
                image-rendering: -moz-crisp-edges;
                image-rendering: crisp-edges;
              }
              
              .instructions {
                font-size: 24px;
                font-weight: bold;
                color: #333;
                margin: 40px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 15px;
                border: 3px solid #e9ecef;
              }
              
              .info {
                margin: 30px 0;
                font-size: 18px;
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
                
                .container {
                  max-width: none;
                  padding: 10px;
                }
                
                .qr-container { 
                  box-shadow: none;
                  page-break-inside: avoid;
                  background: white !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                
                .qr-container img {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
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
                <h1>${menuName}</h1>
                <h2>Menú Digital</h2>
              </div>
              
              <div class="qr-container">
                <img src="${qrDataURL}" alt="Código QR para ${menuName}" />
              </div>
              
              <div class="instructions">
                📱 Escanea el código QR con la cámara de tu teléfono para acceder al menú digital
              </div>
              
              <div class="info">
                <div class="url">${menuUrl}</div>
                <p class="date">Generado el: ${new Date().toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
          </body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      printWindow.addEventListener('load', () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      });
      
    } catch (error) {
      console.error('Error en printQR:', error);
      alert('Error al imprimir. Inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  }, [menuUrl, qrColor, qrBgColor, menuName]);

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Menú ${menuName}`,
          text: `Escanea el código QR para ver nuestro menú digital`,
          url: menuUrl,
        });
      } catch (error) {
        console.error('Error compartiendo:', error);
        copyUrl();
      }
    } else {
      copyUrl();
    }
  };

  const presetColors = [
    { name: 'Negro', color: '#000000', bg: '#FFFFFF' },
    { name: 'Azul', color: '#3B82F6', bg: '#FFFFFF' },
    { name: 'Verde', color: '#10B981', bg: '#FFFFFF' },
    { name: 'Naranja', color: '#F59E0B', bg: '#FFFFFF' },
    { name: 'Púrpura', color: '#8B5CF6', bg: '#FFFFFF' },
    { name: 'Rojo', color: '#EF4444', bg: '#FFFFFF' },
    { name: 'Oscuro', color: '#FFFFFF', bg: '#1F2937' },
    { name: 'Elegante', color: '#1F2937', bg: '#F9FAFB' },
  ];

  const resetToDefaults = () => {
    setQrSize(256);
    setQrLevel('M');
    setQrColor('#000000');
    setQrBgColor('#FFFFFF');
    setIncludeMargin(true);
  };

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        p: 4,
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
      }}
    >
      <Stack spacing={4}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <motion.div
              initial={{ rotate: -180 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.6 }}
            >
              <QrCodeIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            </motion.div>
            <Typography variant="h6" fontWeight={600}>
              Generador de Código QR
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setShowSettings(true)}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Configurar
          </Button>
        </Box>

        {/* URL Configuration */}
        <TextField
          label="URL Base del Sitio"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          fullWidth
          variant="outlined"
          helperText="Cambia esta URL por tu dominio real (ej: https://mirestaurante.com)"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
              },
            }
          }}
        />

        {/* Menu Info */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Información del Menú:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
            <Chip 
              label={`ID: ${menuId}`} 
              size="small" 
              sx={{
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: 'primary.main',
                fontWeight: 600,
              }}
            />
            <Chip 
              label={menuName} 
              size="small" 
              sx={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'success.main',
                fontWeight: 600,
              }}
            />
          </Stack>
        </Box>

        {/* QR Code Display */}
        <MotionBox
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          sx={{ textAlign: 'center' }}
        >
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Código QR para: <strong>{menuName}</strong>
          </Typography>
          
          <Box
            ref={qrRef}
            sx={{
              display: 'inline-block',
              p: 3,
              backgroundColor: qrBgColor,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              border: '2px solid rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
              },
            }}
          >
            <QRCodeSVG
              value={menuUrl}
              size={qrSize}
              level={qrLevel}
              fgColor={qrColor}
              bgColor={qrBgColor}
              includeMargin={includeMargin}
            />
          </Box>

          <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
              {menuUrl}
            </Typography>
          </Box>
        </MotionBox>

        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Action Buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={downloadQR}
            disabled={isGenerating}
            sx={{ 
              flex: 1,
              borderRadius: 2,
              py: 1.5,
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              },
              '&:disabled': {
                background: 'rgba(59, 130, 246, 0.3)',
              },
            }}
          >
            {isGenerating ? 'Generando...' : 'Descargar PNG'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<CopyIcon />}
            onClick={copyUrl}
            color={copied ? 'success' : 'primary'}
            sx={{ 
              flex: 1,
              borderRadius: 2,
              py: 1.5,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            {copied ? '✓ Copiado!' : 'Copiar URL'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={printQR}
            disabled={isGenerating}
            sx={{ 
              flex: 1,
              borderRadius: 2,
              py: 1.5,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Imprimir
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={shareQR}
            sx={{ 
              flex: 1,
              borderRadius: 2,
              py: 1.5,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Compartir
          </Button>
        </Stack>

        {/* Success Message */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Alert 
                severity="success" 
                sx={{ 
                  borderRadius: 2,
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                ✅ URL copiada al portapapeles exitosamente
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>

      {/* Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: '#2C2C2E',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <PaletteIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Configuración del QR
              </Typography>
            </Box>
            <IconButton onClick={() => setShowSettings(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={4} sx={{ mt: 1 }}>
            {/* Size */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Tamaño: <strong>{qrSize}px</strong>
              </Typography>
              <Slider
                value={qrSize}
                onChange={(_, value) => setQrSize(value as number)}
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
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: 'primary.main',
                  },
                }}
              />
            </Box>

            {/* Error Correction Level */}
            <FormControl fullWidth>
              <InputLabel>Nivel de Corrección de Errores</InputLabel>
              <Select
                value={qrLevel}
                onChange={(e) => setQrLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                label="Nivel de Corrección de Errores"
              >
                <MenuItem value="L">Bajo (7%) - Más rápido</MenuItem>
                <MenuItem value="M">Medio (15%) - Recomendado</MenuItem>
                <MenuItem value="Q">Alto (25%) - Más resistente</MenuItem>
                <MenuItem value="H">Muy Alto (30%) - Máxima resistencia</MenuItem>
              </Select>
            </FormControl>

            {/* Color Presets */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Combinaciones de Colores
              </Typography>
              <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))" gap={1}>
                {presetColors.map((preset) => (
                  <Button
                    key={preset.name}
                    variant={qrColor === preset.color && qrBgColor === preset.bg ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => {
                      setQrColor(preset.color);
                      setQrBgColor(preset.bg);
                    }}
                    sx={{
                      minWidth: 'auto',
                      px: 1,
                      py: 0.5,
                      fontSize: '0.75rem',
                      borderRadius: 2,
                    }}
                  >
                    {preset.name}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Custom Colors */}
            <Stack direction="row" spacing={2}>
              <Box flex={1}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Color del QR
                </Typography>
                <TextField
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{
                    '& input': {
                      height: 40,
                      cursor: 'pointer',
                    },
                  }}
                />
              </Box>
              
              <Box flex={1}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Color de Fondo
                </Typography>
                <TextField
                  type="color"
                  value={qrBgColor}
                  onChange={(e) => setQrBgColor(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{
                    '& input': {
                      height: 40,
                      cursor: 'pointer',
                    },
                  }}
                />
              </Box>
            </Stack>

            {/* Include Margin */}
            <FormControlLabel
              control={
                <Switch
                  checked={includeMargin}
                  onChange={(e) => setIncludeMargin(e.target.checked)}
                  color="primary"
                />
              }
              label="Incluir margen alrededor del QR"
            />

            {/* Preview */}
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Vista previa
              </Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  p: 1,
                  backgroundColor: qrBgColor,
                  borderRadius: 1,
                }}
              >
                <QRCodeSVG
                  value={menuUrl}
                  size={80}
                  level={qrLevel}
                  fgColor={qrColor}
                  bgColor={qrBgColor}
                  includeMargin={includeMargin}
                />
              </Box>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={resetToDefaults}
            color="secondary"
          >
            Restablecer
          </Button>
          <Button
            onClick={() => setShowSettings(false)}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Aplicar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </MotionPaper>
  );
};

export default QRGenerator;