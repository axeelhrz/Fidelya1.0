'use client';

import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  Stack,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import QRCode from 'qrcode.react';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode';

const MotionPaper = motion(Paper);

interface QRGeneratorProps {
  menuId: string;
  menuName: string;
}

export default function QRGenerator({ menuId, menuName }: QRGeneratorProps) {
  const [baseUrl, setBaseUrl] = useState('https://tudominio.com');
  const [copied, setCopied] = useState(false);
  
  const menuUrl = `${baseUrl}/menu?id=${menuId}`;

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `qr-${menuId}.png`;
      link.href = url;
      link.click();
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #2C2C2E 0%, #3A3A3C 100%)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
      }}
    >
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <QrCodeIcon sx={{ color: '#3B82F6', fontSize: 28 }} />
          <Typography variant="h6" fontWeight={600}>
            Generador de Código QR
          </Typography>
        </Box>

        <TextField
          label="URL Base del Sitio"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          fullWidth
          variant="outlined"
          helperText="Cambia esta URL por tu dominio real"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
            }
          }}
        />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Menú: {menuName}
          </Typography>
          
          <Box
            sx={{
              display: 'inline-block',
              p: 3,
              backgroundColor: '#FFFFFF',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <QRCode
              id="qr-code"
              value={menuUrl}
              size={200}
              level="M"
              includeMargin={true}
            />
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: 2,
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            URL del menú:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                flex: 1, 
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                wordBreak: 'break-all',
              }}
            >
              {menuUrl}
            </Typography>
            <Tooltip title={copied ? "¡Copiado!" : "Copiar URL"}>
              <IconButton 
                size="small" 
                onClick={copyUrl}
                sx={{ 
                  color: copied ? '#10B981' : '#3B82F6',
                  backgroundColor: copied ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {copied && (
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            URL copiada al portapapeles
          </Alert>
        )}

        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={downloadQR}
          fullWidth
          sx={{
            py: 1.5,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            }
          }}
        >
          Descargar Código QR
        </Button>
      </Stack>
    </MotionPaper>
  );
}