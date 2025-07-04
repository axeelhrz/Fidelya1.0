import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Stack,
  Tooltip,
  Badge,
  useTheme
} from '@mui/material';
import {
  Download,
  Visibility,
  PictureAsPdf,
  AudioFile,
  VideoFile,
  Image,
  InsertDriveFile,
  FiberNew,
  Schedule,
  Person
} from '@mui/icons-material';
import { PatientDocument } from '../../../types/documents';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface DocumentCardProps {
  document: PatientDocument;
  onView: (document: PatientDocument) => void;
  onDownload: (document: PatientDocument) => void;
  loading?: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onDownload,
  loading = false
}) => {
  const theme = useTheme();

  // ============================================================================
  // HELPERS
  // ============================================================================
  
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <PictureAsPdf sx={{ color: '#d32f2f' }} />;
      case 'audio':
      case 'mp3':
      case 'wav':
        return <AudioFile sx={{ color: '#1976d2' }} />;
      case 'video':
      case 'mp4':
      case 'avi':
        return <VideoFile sx={{ color: '#7b1fa2' }} />;
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image sx={{ color: '#388e3c' }} />;
      default:
        return <InsertDriveFile sx={{ color: '#616161' }} />;
    }
  };

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isRecent = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return document.createdAt >= weekAgo;
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const handleView = () => {
    onView(document);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(document);
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        border: !document.isRead ? `2px solid ${theme.palette.primary.main}` : '1px solid',
        borderColor: !document.isRead ? theme.palette.primary.main : theme.palette.divider,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
          borderColor: theme.palette.primary.main
        },
        opacity: loading ? 0.7 : 1,
        position: 'relative'
      }}
      onClick={handleView}
    >
      {/* Badge para documentos nuevos */}
      {!document.isRead && (
        <Badge
          badgeContent={<FiberNew sx={{ fontSize: 12 }} />}
          color="primary"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1
          }}
        />
      )}

      {/* Badge para documentos recientes */}
      {isRecent() && document.isRead && (
        <Chip
          label="Nuevo"
          size="small"
          color="success"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            fontSize: '0.7rem',
            height: 20
          }}
        />
      )}

      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header con icono y tipo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ mr: 1.5 }}>
            {getFileIcon(document.fileType)}
          </Box>
          <Chip
            label={getTypeLabel(document.type)}
            size="small"
            sx={{
              backgroundColor: getTypeColor(document.type),
              color: 'white',
              fontSize: '0.7rem',
              height: 20
            }}
          />
        </Box>

        {/* Título */}
        <Typography
          variant="h6"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            mb: 1,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: !document.isRead ? theme.palette.primary.main : 'inherit'
          }}
        >
          {document.title}
        </Typography>

        {/* Descripción */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4
          }}
        >
          {document.description}
        </Typography>

        {/* Metadatos */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Person sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {document.uploadedByName}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(document.createdAt, { 
                addSuffix: true, 
                locale: es 
              })}
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary">
            {formatFileSize(document.fileSize)}
          </Typography>
        </Stack>

        {/* Tags */}
        {document.tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {document.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.65rem',
                    height: 18,
                    '& .MuiChip-label': {
                      px: 0.5
                    }
                  }}
                />
              ))}
              {document.tags.length > 3 && (
                <Chip
                  label={`+${document.tags.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.65rem',
                    height: 18,
                    '& .MuiChip-label': {
                      px: 0.5
                    }
                  }}
                />
              )}
            </Stack>
          </Box>
        )}

        {/* Acciones */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {document.downloadCount > 0 && (
              <Typography variant="caption" color="text.secondary">
                {document.downloadCount} descarga{document.downloadCount !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>

          <Box>
            <Tooltip title="Ver documento">
              <IconButton
                size="small"
                onClick={handleView}
                sx={{ 
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '10'
                  }
                }}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Descargar">
              <IconButton
                size="small"
                onClick={handleDownload}
                disabled={loading}
                sx={{ 
                  color: theme.palette.success.main,
                  '&:hover': {
                    backgroundColor: theme.palette.success.main + '10'
                  }
                }}
              >
                <Download fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
