import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Toolbar,
  Tooltip
} from '@mui/material';
import {
  Close,
  Download,
  ZoomIn,
  ZoomOut,
  Fullscreen,
  FullscreenExit,
  RotateRight,
  Print
} from '@mui/icons-material';
import { PatientDocument } from '../../../types/documents';

interface DocumentViewerProps {
  document: PatientDocument;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (document: PatientDocument) => void;
  onMarkAsRead?: (document: PatientDocument) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  isOpen,
  onClose,
  onDownload,
  onMarkAsRead
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // ============================================================================
  // EFECTOS
  // ============================================================================
  
  useEffect(() => {
    if (document && !document.isRead && onMarkAsRead) {
      onMarkAsRead(document);
    }
  }, [document, onMarkAsRead]);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      setZoom(100);
      setRotation(0);
      setFullscreen(false);
      
      // Simular carga del documento
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, document]);

  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(document);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '400px',
            gap: 2
          }}
        >
          <CircularProgress size={48} />
          <Typography variant="body2" color="text.secondary">
            Cargando documento...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            <Typography variant="body2">
              Error al cargar el documento: {error}
            </Typography>
          </Alert>
        </Box>
      );
    }

    const fileType = document.fileType.toLowerCase();

    // Visor de PDF
    if (fileType === 'pdf') {
      return (
        <Box
          sx={{
            width: '100%',
            height: fullscreen ? '100vh' : '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease',
              transformOrigin: 'center center',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <iframe
              src={`${document.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              width="100%"
              height="100%"
              style={{
                border: 'none',
                borderRadius: '4px',
                boxShadow: theme.shadows[2]
              }}
              title={document.title}
            />
          </Box>
        </Box>
      );
    }

    // Visor de imágenes
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType)) {
      return (
        <Box
          sx={{
            width: '100%',
            height: fullscreen ? '100vh' : '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            overflow: 'hidden'
          }}
        >
          <Image
            src={document.fileUrl}
            alt={document.title}
            fill
            style={{
              objectFit: 'contain',
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease',
              borderRadius: '4px',
              boxShadow: theme.shadows[2]
            }}
          />
        </Box>
      );
    }

    // Visor de audio
    if (['mp3', 'wav', 'ogg', 'aac'].includes(fileType)) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '400px',
            gap: 3,
            p: 3
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <Typography variant="h2" color="white">
              🎵
            </Typography>
          </Box>
          
          <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
            {document.title}
          </Typography>
          
          <audio
            controls
            style={{ width: '100%', maxWidth: '400px' }}
            preload="metadata"
          >
            <source src={document.fileUrl} type={`audio/${fileType}`} />
            Tu navegador no soporta la reproducción de audio.
          </audio>
        </Box>
      );
    }

    // Tipo de archivo no soportado para vista previa
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px',
          gap: 2,
          p: 3
        }}
      >
        <Typography variant="h4">📄</Typography>
        <Typography variant="h6" textAlign="center">
          Vista previa no disponible
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Este tipo de archivo ({document.fileType.toUpperCase()}) no se puede previsualizar.
          Puedes descargarlo para abrirlo en tu aplicación preferida.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownload}
          sx={{ mt: 2 }}
        >
          Descargar archivo
        </Button>
      </Box>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      fullScreen={fullscreen || isMobile}
      PaperProps={{
        sx: {
          width: fullscreen ? '100vw' : '90vw',
          height: fullscreen ? '100vh' : '90vh',
          maxWidth: fullscreen ? 'none' : '1200px',
          maxHeight: fullscreen ? 'none' : '90vh',
          borderRadius: fullscreen ? 0 : 2
        }
      }}
    >
      {/* Header con controles */}
      <DialogTitle
        sx={{
          p: 0,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '1rem' }}>
            {document.title}
          </Typography>

          {/* Controles de visualización */}
          {!loading && !error && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1 }}>
              {/* Zoom out */}
              <Tooltip title="Reducir zoom">
                <IconButton
                  size="small"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                >
                  <ZoomOut fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Indicador de zoom */}
              <Typography variant="body2" sx={{ minWidth: '50px', textAlign: 'center' }}>
                {zoom}%
              </Typography>

              {/* Zoom in */}
              <Tooltip title="Aumentar zoom">
                <IconButton
                  size="small"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                >
                  <ZoomIn fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Rotar (solo para imágenes y PDFs) */}
              {['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'].includes(document.fileType.toLowerCase()) && (
                <Tooltip title="Rotar">
                  <IconButton size="small" onClick={handleRotate}>
                    <RotateRight fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {/* Pantalla completa */}
              <Tooltip title={fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
                <IconButton size="small" onClick={handleFullscreen}>
                  {fullscreen ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
                </IconButton>
              </Tooltip>

              {/* Imprimir */}
              <Tooltip title="Imprimir">
                <IconButton size="small" onClick={handlePrint}>
                  <Print fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Botón cerrar */}
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Toolbar>
      </DialogTitle>

      {/* Contenido del documento */}
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        {renderContent()}
      </DialogContent>

      {/* Acciones inferiores */}
      {!fullscreen && (
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={onClose}>
            Cerrar
          </Button>
          {onDownload && (
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDownload}
            >
              Descargar
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DocumentViewer;
