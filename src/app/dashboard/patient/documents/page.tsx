'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Alert,
  Skeleton,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  Fab,
  Snackbar,
  Paper
} from '@mui/material';
import {
  Description,
  CloudDownload,
  Refresh,
  FilterList
} from '@mui/icons-material';
import { usePatientDocuments } from '../../../../hooks/usePatientDocuments';
import { useAuth } from '../../../../contexts/AuthContext';
import DocumentCard from '../../../../components/clinical/patient-portal/DocumentCard';
import DocumentFilters from '../../../../components/clinical/patient-portal/DocumentFilters';
import DocumentDetailModal from '../../../../components/clinical/patient-portal/DocumentDetailModal';
import { PatientDocument } from '../../../../types/documents';

const PatientDocumentsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  
  const {
    documents,
    stats,
    loading,
    error,
    hasUnreadDocuments,
    filters,
    applyFilters,
    clearFilters,
    markAsRead,
    downloadDocument,
    refreshDocuments
  } = usePatientDocuments();

  // Estados locales
  const [selectedDocument, setSelectedDocument] = useState<PatientDocument | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const handleViewDocument = (document: PatientDocument) => {
    setSelectedDocument(document);
    setDetailModalOpen(true);
    
    // Marcar como leído si no lo está
    if (!document.isRead) {
      markAsRead(document.id);
    }
  };

  const handleDownloadDocument = async (document: PatientDocument) => {
    try {
      setDownloading(document.id);
      await downloadDocument(document);
      
      setSnackbar({
        open: true,
        message: `Documento "${document.title}" descargado correctamente`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      setSnackbar({
        open: true,
        message: 'Error al descargar el documento. Inténtalo de nuevo.',
        severity: 'error'
      });
    } finally {
      setDownloading(null);
    }
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedDocument(null);
  };

  const handleRefresh = () => {
    refreshDocuments();
    setSnackbar({
      open: true,
      message: 'Documentos actualizados',
      severity: 'info'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  const renderSkeletonCards = () => (
    <Grid container spacing={3}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper sx={{ p: 2, height: 280 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="rectangular" width={80} height={20} />
              </Box>
              <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
              <Skeleton variant="rectangular" height={60} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="rectangular" width={60} height={20} />
                <Skeleton variant="rectangular" width={80} height={20} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                <Skeleton variant="text" width={100} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Skeleton variant="circular" width={32} height={32} />
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  const renderEmptyState = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center'
      }}
    >
      <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        No hay documentos disponibles
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        Aún no tienes documentos en tu expediente. Los documentos aparecerán aquí cuando tu terapeuta los suba.
      </Typography>
      <Button
        variant="outlined"
        startIcon={<Refresh />}
        onClick={handleRefresh}
        disabled={loading}
      >
        Actualizar
      </Button>
    </Box>
  );

  const renderNoResults = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        textAlign: 'center'
      }}
    >
      <FilterList sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        No se encontraron documentos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Intenta ajustar los filtros de búsqueda
      </Typography>
      <Button
        variant="outlined"
        onClick={clearFilters}
        size="small"
      >
        Limpiar filtros
      </Button>
    </Box>
  );

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================
  
  if (error && documents.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Mis Documentos
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Accede a tus archivos y materiales clínicos
        </Typography>
        
        {/* Bienvenida personalizada */}
        {user && (
          <Typography variant="body2" color="text.secondary">
            Hola {user.firstName}, aquí puedes consultar y descargar todos tus documentos clínicos.
          </Typography>
        )}

        {/* Alerta de documentos no leídos */}
        {hasUnreadDocuments && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Tienes documentos nuevos sin leer. Revísalos para mantenerte al día con tu tratamiento.
          </Alert>
        )}
      </Box>

      {/* Filtros */}
      <DocumentFilters
        filters={filters}
        onFiltersChange={applyFilters}
        onClearFilters={clearFilters}
        stats={stats}
        loading={loading}
      />

      {/* Contenido principal */}
      <Box sx={{ mb: 4 }}>
        {loading && documents.length === 0 ? (
          renderSkeletonCards()
        ) : documents.length === 0 ? (
          stats?.total === 0 ? renderEmptyState() : renderNoResults()
        ) : (
          <Grid container spacing={3}>
            {documents.map((document) => (
              <Grid item xs={12} sm={6} md={4} key={document.id}>
                <DocumentCard
                  document={document}
                  onView={handleViewDocument}
                  onDownload={handleDownloadDocument}
                  loading={downloading === document.id}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Estadísticas resumidas */}
      {stats && documents.length > 0 && (
        <Paper sx={{ p: 3, mt: 4, backgroundColor: theme.palette.grey[50] }}>
          <Typography variant="h6" gutterBottom>
            Resumen
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Total de documentos
              </Typography>
              <Typography variant="h6">
                {stats.total}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Sin leer
              </Typography>
              <Typography variant="h6" color={stats.unread > 0 ? 'primary.main' : 'inherit'}>
                {stats.unread}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Agregados recientemente
              </Typography>
              <Typography variant="h6">
                {stats.recentlyAdded}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Tamaño total
              </Typography>
              <Typography variant="h6">
                {(stats.totalSize / 1024 / 1024).toFixed(1)} MB
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* FAB para actualizar en móvil */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="actualizar"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16
          }}
          onClick={handleRefresh}
          disabled={loading}
        >
          <Refresh />
        </Fab>
      )}

      {/* Modal de detalles */}
      <DocumentDetailModal
        document={selectedDocument}
        isOpen={detailModalOpen}
        onClose={handleCloseDetailModal}
        onDownload={handleDownloadDocument}
        onMarkAsRead={markAsRead}
        loading={downloading === selectedDocument?.id}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PatientDocumentsPage;
