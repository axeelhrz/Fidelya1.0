'use client';

import React, { useState, useRef } from 'react';
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
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

interface QRGeneratorProps {
  menuId: string;
  menuName: string;
}

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const QRGenerator: React.FC<QRGeneratorProps> = ({ menuId, menuName }) => {
  const [baseUrl, setBaseUrl] = useState('https://tu-dominio.com');
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [qrSize, setQrSize] = useState(256);
  const [qrLevel, setQrLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
  const [includeMargin, setIncludeMargin] = useState(true);
  const qrRef = useRef<HTMLDivElement>(null);
  
  const menuUrl = `${baseUrl}/menu?id=${menuId}`;

  const downloadQR = async () => {
    try {
      const svg = qrRef.current?.querySelector('svg');
      if (!svg) return;

      // Crear un canvas con alta resolución para mejor calidad
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Usar un factor de escala para mejor calidad
      const scaleFactor = 2;
      const finalSize = qrSize * scaleFactor;
      
      canvas.width = finalSize;
      canvas.height = finalSize;
      
      // Configurar el contexto para alta calidad
      ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = qrBgColor;
      ctx.fillRect(0, 0, finalSize, finalSize);

      // Clonar el SVG y ajustar sus dimensiones
      const svgClone = svg.cloneNode(true) as SVGElement;
      svgClone.setAttribute('width', finalSize.toString());
      svgClone.setAttribute('height', finalSize.toString());
      
      // Serializar el SVG con las dimensiones correctas
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        // Dibujar la imagen en el canvas
        ctx.drawImage(img, 0, 0, finalSize, finalSize);

        // Convertir a blob con alta calidad
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qr-menu-${menuName.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/png', 1.0); // Máxima calidad
        URL.revokeObjectURL(svgUrl);
      };
      
      img.onerror = () => {
        console.error('Error cargando la imagen SVG');
        URL.revokeObjectURL(svgUrl);
      };
      
      img.src = svgUrl;
    } catch (error) {
      console.error('Error descargando QR:', error);
    }
  };

  const copyUrl = async () => {
      try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      } catch (error) {
      console.error('Error copiando URL:', error);
      }
  };

  const printQR = () => {
    try {
      const svg = qrRef.current?.querySelector('svg');
      if (!svg) return;

      // Crear una versión del SVG optimizada para impresión
      const svgClone = svg.cloneNode(true) as SVGElement;
      
      // Asegurar que el SVG tenga las dimensiones correctas para impresión
      const printSize = 300; // Tamaño fijo para impresión
      svgClone.setAttribute('width', printSize.toString());
      svgClone.setAttribute('height', printSize.toString());
      svgClone.setAttribute('viewBox', `0 0 ${printSize} ${printSize}`);
      
      const svgData = new XMLSerializer().serializeToString(svgClone);
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Código QR - ${menuName}</title>
            <meta charset="utf-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Arial', sans-serif;
                text-align: center;
                padding: 40px 20px;
                background: white;
                color: black;
                line-height: 1.6;
              }
              
              .container {
                max-width: 600px;
                margin: 0 auto;
              }
              
              .header {
                margin-bottom: 30px;
              }
              
              .header h1 {
                color: #333;
                margin-bottom: 10px;
                font-size: 28px;
                font-weight: bold;
              }
              
              .header h2 {
                color: #666;
                font-weight: normal;
                font-size: 20px;
              }
              
              .qr-container {
                display: inline-block;
                padding: 30px;
                border: 3px solid #000;
                border-radius: 15px;
                margin: 30px 0;
                background: white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              
              .qr-container svg {
                display: block;
                margin: 0 auto;
              }
              
              .instructions {
                font-size: 20px;
                font-weight: bold;
                color: #333;
                margin: 30px 0;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 10px;
                border: 2px solid #e9ecef;
              }
              
              .info {
                margin: 25px 0;
                font-size: 16px;
              }
              
              .url {
                font-family: 'Courier New', monospace;
                background: #f5f5f5;
                padding: 15px;
                border-radius: 8px;
                word-break: break-all;
                margin: 15px 0;
                border: 1px solid #ddd;
                font-size: 14px;
              }
              
              .date {
                font-weight: bold;
                color: #555;
              }
              
              @media print {
                body { 
                  margin: 0; 
                  padding: 20px;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                
                .qr-container { 
                  box-shadow: none;
                  page-break-inside: avoid;
                }
                
                .container {
                  page-break-inside: avoid;
                }
                
                @page {
                  margin: 1cm;
                  size: A4;
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
                ${svgData}
              </div>
              
              <div class="instructions">
                📱 Escanea el código QR con tu teléfono para ver el menú digital
              </div>
              
              <div class="info">
                <div class="url">${menuUrl}</div>
                <p class="date">Fecha de generación: ${new Date().toLocaleDateString('es-ES', {
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
      
      // Esperar a que se cargue completamente antes de imprimir
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
  };

    } catch (error) {
      console.error('Error imprimiendo QR:', error);
    }
};

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
        copyUrl(); // Fallback a copiar
      }
    } else {
      copyUrl(); // Fallback a copiar
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
            sx={{ 
              flex: 1,
              borderRadius: 2,
              py: 1.5,
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              },
            }}
          >
            Descargar PNG
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
                Vista previa:
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