import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Card,
  CardContent
} from '@mui/material';
import {
  Close,
  Download,
  Visibility,
  OpenInNew,
  Person,
  Schedule,
  Label,
  Info,
  CheckCircle,
} from '@mui/icons-material';
import { PatientDocument } from '../../../types/documents';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import DocumentViewer from './DocumentViewer';

interface DocumentDetailModalProps {
  document: PatientDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (document: PatientDocument) => void;
  onMarkAsRead?: (document: PatientDocument) => void;
  loading?: boolean;
}

const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document,
  isOpen,
  onClose,
  onDownload,
  onMarkAsRead,
  loading = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [downloading, setDownloading] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  // ============================================================================
  // EFECTOS
  // ============================================================================
  useEffect(() => {
    if (document && !document.isRead && onMarkAsRead) {
      // Marcar como leído automáticamente al abrir el modal
      onMarkAsRead(document);
    }
  }, [document, onMarkAsRead]);

  // ============================================================================
  // HELPERS
  // ============================================================================
  const getTypeColor = (type: PatientDocument['type']) => {
    const colors = {
      consentimiento: '#1976d2',
      informe: '#388e3c',
      receta: '#f57c00',
      constancia: '#7b1fa2',
      psicoeducacion: '#0288d1',
      certificado: '#d32f2f',
      evaluacion: '#5d4037',
      'plan-tratamiento': '#00796b',
      tarea: '#303f9f',
      recurso: '#689f38',
      otro: '#616161'
    };
    return colors[type] || colors.otro;
  };

  const getTypeLabel = (type: PatientDocument['type']) => {
    const labels = {
      consentimiento: 'Consentimiento',
      informe: 'Informe',
      receta: 'Receta',
      constancia: 'Constancia',
      psicoeducacion: 'Psicoeducación',
      certificado: 'Certificado',
      evaluacion: 'Evaluación',
      'plan-tratamiento': 'Plan de Tratamiento',
      tarea: 'Tarea',
      recurso: 'Recurso',
      otro: 'Otro'
    };
    return labels[type] || 'Documento';
  };

  const getCategoryLabel = (category: PatientDocument['category']) => {
    const labels = {
      clinico: 'Clínico',
      administrativo: 'Administrativo',
      educativo: 'Educativo',
      legal: 'Legal',
      personal: 'Personal'
    };
    return labels[category] || 'General';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canPreview = (fileType: string) => {
    return ['pdf', 'image', 'jpg', 'jpeg', 'png'].includes(fileType.toLowerCase());
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================
  const handleDownload = async () => {
    if (!document) return;
    try {
      setDownloading(true);
      await onDownload(document);
    } catch (error) {
      console.error('Error downloading document:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleOpenInNewTab = () => {
    if (!document) return;
    window.open(document.fileUrl, '_blank');
  };

  const handlePreview = () => {
    setViewerOpen(true);
  };

  if (!document) return null;

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            maxHeight: '90vh'
          }
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: getTypeColor(document.type),
                flexShrink: 0
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {document.title}
            </Typography>
            {!document.isRead && (
              <Chip
                label="Nuevo"
                size="small"
                color="primary"
                sx={{ flexShrink: 0 }}
              />
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {/* Información principal */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3
              }}
            >
              {/* Columna izquierda - Información del documento */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 66.666%' } }}>
                <Stack spacing={2}>
                  {/* Descripción */}
                  <Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {document.description}
                    </Typography>
                  </Box>

                  {/* Notas adicionales */}
                  {document.notes && (
                    <Alert severity="info" icon={<Info />}>
                      <Typography variant="body2">
                        {document.notes}
                      </Typography>
                    </Alert>
                  )}

                  {/* Etiquetas */}
                  {document.tags.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Label fontSize="small" />
                        Etiquetas
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {document.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Metadatos adicionales */}
                  {document.metadata && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Información adicional
                      </Typography>
                      <Card variant="outlined">
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Stack spacing={1}>
                            {document.metadata.version && (
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Versión:</Typography>
                                <Typography variant="body2">{document.metadata.version}</Typography>
                              </Box>
                            )}
                            {document.metadata.author && (
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Autor:</Typography>
                                <Typography variant="body2">{document.metadata.author}</Typography>
                              </Box>
                            )}
                            {document.metadata.summary && (
                              <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                  Resumen:
                                </Typography>
                                <Typography variant="body2">{document.metadata.summary}</Typography>
                              </Box>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* Columna derecha - Metadatos */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' } }}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack spacing={2}>
                      {/* Tipo y categoría */}
                      <Box>
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                          <Chip
                            label={getTypeLabel(document.type)}
                            size="small"
                            sx={{
                              backgroundColor: getTypeColor(document.type),
                              color: 'white'
                            }}
                          />
                          <Chip
                            label={getCategoryLabel(document.category)}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>
                      </Box>

                      <Divider />

                      {/* Información del archivo */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Información del archivo
                        </Typography>
                        <Stack spacing={1}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Nombre:</Typography>
                            <Typography variant="body2" sx={{ textAlign: 'right', wordBreak: 'break-word' }}>
                              {document.fileName}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Tipo:</Typography>
                            <Typography variant="body2">{document.fileType.toUpperCase()}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Tamaño:</Typography>
                            <Typography variant="body2">{formatFileSize(document.fileSize)}</Typography>
                          </Box>
                        </Stack>
                      </Box>

                      <Divider />

                      {/* Información temporal */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Fechas
                        </Typography>
                        <Stack spacing={1}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Schedule fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">Subido:</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ ml: 2.5 }}>
                            {format(document.createdAt, 'dd/MM/yyyy HH:mm', { locale: es })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 2.5 }}>
                            {formatDistanceToNow(document.createdAt, { addSuffix: true, locale: es })}
                          </Typography>
                          {document.readAt && (
                            <>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                                <CheckCircle fontSize="small" color="success" />
                                <Typography variant="body2" color="text.secondary">Leído:</Typography>
                              </Box>
                              <Typography variant="body2" sx={{ ml: 2.5 }}>
                                {format(document.readAt, 'dd/MM/yyyy HH:mm', { locale: es })}
                              </Typography>
                            </>
                          )}
                        </Stack>
                      </Box>

                      <Divider />

                      {/* Profesional */}
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                          <Person fontSize="small" color="action" />
                          <Typography variant="subtitle2">Subido por</Typography>
                        </Box>
                        <Typography variant="body2">{document.uploadedByName}</Typography>
                      </Box>

                      {/* Estadísticas de uso */}
                      {document.downloadCount > 0 && (
                        <>
                          <Divider />
                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Estadísticas
                            </Typography>
                            <Stack spacing={1}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Descargas:</Typography>
                                <Typography variant="body2">{document.downloadCount}</Typography>
                              </Box>
                              {document.lastDownloaded && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2" color="text.secondary">Última descarga:</Typography>
                                  <Typography variant="body2">
                                    {format(document.lastDownloaded, 'dd/MM/yyyy', { locale: es })}
                                  </Typography>
                                </Box>
                              )}
                            </Stack>
                          </Box>
                        </>
                      )}

                      {/* Fecha de expiración */}
                      {document.expiresAt && (
                        <>
                          <Divider />
                          <Alert severity="warning" sx={{ fontSize: '0.8rem' }}>
                            <Typography variant="body2">
                              Expira el {format(document.expiresAt, 'dd/MM/yyyy', { locale: es })}
                            </Typography>
                          </Alert>
                        </>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            {/* Vista previa */}
            {canPreview(document.fileType) && (
              <Tooltip title="Vista previa">
                <Button
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={handlePreview}
                  disabled={loading}
                >
                  Vista previa
                </Button>
              </Tooltip>
            )}

            {/* Abrir en nueva pestaña */}
            <Tooltip title="Abrir en nueva pestaña">
              <Button
                variant="outlined"
                startIcon={<OpenInNew />}
                onClick={handleOpenInNewTab}
                disabled={loading}
              >
                Abrir
              </Button>
            </Tooltip>

            <Box sx={{ flexGrow: 1 }} />

            {/* Descargar */}
            <Button
              variant="contained"
              startIcon={downloading ? <CircularProgress size={16} /> : <Download />}
              onClick={handleDownload}
              disabled={loading || downloading}
              color="primary"
            >
              {downloading ? 'Descargando...' : 'Descargar'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Visor de documentos */}
      {viewerOpen && (
        <DocumentViewer
          document={document}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          onDownload={onDownload}
          onMarkAsRead={onMarkAsRead}
        />
      )}
    </>
  );
};

export default DocumentDetailModal;