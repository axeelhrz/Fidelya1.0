import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  PictureAsPdf as PictureAsPdfIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Share as ShareIcon,
  Security as SecurityIcon,
  QrCode as QrCodeIcon,
  Verified as VerifiedIcon,
  Settings as SettingsIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { cierreCajaService } from '../../../services/cierreCajaService';

const ExportarCierrePDF = ({ cierreId }) => {
  const [exportando, setExportando] = useState(false);
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [configuracionDialogOpen, setConfiguracionDialogOpen] = useState(false);
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [progreso, setProgreso] = useState(0);

  const [configuracion, setConfiguracion] = useState({
    plantilla: 'completa',
    incluirGraficos: true,
    incluirFirmaDigital: true,
    incluirCodigoQR: true,
    incluirDetalleVentas: true,
    incluirComparacion: true,
    incluirRecomendaciones: false,
    formato: 'A4',
    orientacion: 'vertical',
    idioma: 'es'
  });

  const plantillasDisponibles = [
    {
      id: 'completa',
      nombre: 'Completa',
      descripcion: 'Incluye todos los detalles y análisis',
      icono: <DescriptionIcon />
    },
    {
      id: 'resumida',
      nombre: 'Resumida',
      descripcion: 'Solo información esencial',
      icono: <AssessmentIcon />
    },
    {
      id: 'auditoria',
      nombre: 'Auditoría',
      descripcion: 'Formato para auditoría contable',
      icono: <SecurityIcon />
    }
  ];

  const handleExportarPDF = async () => {
    setExportando(true);
    setError(null);
    setSuccess(null);
    setProgreso(0);

    try {
      // Simular progreso
      const interval = setInterval(() => {
        setProgreso(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const resultado = await cierreCajaService.exportarCierrePDF(cierreId, configuracion);
      
      clearInterval(interval);
      setProgreso(100);
      
      // Simular descarga
      const link = document.createElement('a');
      link.href = resultado.url_descarga || '#';
      link.download = resultado.nombre_archivo || `cierre_${cierreId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess(`PDF generado exitosamente: ${resultado.nombre_archivo}`);
      
    } catch (error) {
      console.error('Error exportando PDF:', error);
      setError(error.message || 'Error al generar el PDF del cierre');
    } finally {
      setExportando(false);
      setTimeout(() => setProgreso(0), 2000);
    }
  };

  const handleEnviarEmail = async () => {
    setEnviandoEmail(true);
    setError(null);

    try {
      const resultado = await cierreCajaService.enviarCierrePorEmail(cierreId, configuracion);
      setSuccess(`PDF enviado por email a: ${resultado.destinatarios.join(', ')}`);
    } catch (error) {
      console.error('Error enviando email:', error);
      setError('Error al enviar el PDF por email');
    } finally {
      setEnviandoEmail(false);
    }
  };

  const handleGenerarVistaPrevia = async () => {
    try {
      const preview = await cierreCajaService.generarVistaPreviaPDF(cierreId, configuracion);
      setVistaPrevia(preview);
    } catch (error) {
      console.error('Error generando vista previa:', error);
      setError('Error al generar vista previa');
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleCompartir = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cierre de Caja - ${new Date().toLocaleDateString()}`,
          text: 'Reporte de cierre de caja diario',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error compartiendo:', error);
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href);
      setSuccess('Enlace copiado al portapapeles');
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PictureAsPdfIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Exportar Respaldo Contable
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Genera documentos PDF profesionales con firma digital y código QR de verificación
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<SettingsIcon />}
          onClick={() => setConfiguracionDialogOpen(true)}
          size="small"
        >
          Configurar
        </Button>
      </Box>

      {/* Progreso de exportación */}
      {progreso > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Generando PDF...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progreso}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progreso} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4
                }
              }} 
            />
          </Box>
        </motion.div>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Configuración actual */}
      <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            📋 Configuración Actual
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Plantilla
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {plantillasDisponibles.find(p => p.id === configuracion.plantilla)?.nombre}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Formato
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {configuracion.formato} - {configuracion.orientacion}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Seguridad
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                  {configuracion.incluirFirmaDigital && (
                    <Chip label="Firma" size="small" color="success" />
                  )}
                  {configuracion.incluirCodigoQR && (
                    <Chip label="QR" size="small" color="info" />
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Extras
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                  {configuracion.incluirGraficos && (
                    <Chip label="Gráficos" size="small" color="primary" />
                  )}
                  {configuracion.incluirComparacion && (
                    <Chip label="Análisis" size="small" color="secondary" />
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            startIcon={exportando ? <CircularProgress size={16} /> : <DownloadIcon />}
            onClick={handleExportarPDF}
            disabled={exportando || !cierreId}
            fullWidth
            size="large"
            sx={{
              py: 1.5,
              background: 'linear-gradient(45deg, #1976D2, #1565C0)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565C0, #0D47A1)',
              }
            }}
          >
            {exportando ? 'Generando...' : 'Descargar PDF'}
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button
            variant="outlined"
            startIcon={enviandoEmail ? <CircularProgress size={16} /> : <EmailIcon />}
            onClick={handleEnviarEmail}
            disabled={enviandoEmail || exportando}
            fullWidth
            size="large"
            sx={{ py: 1.5 }}
          >
            {enviandoEmail ? 'Enviando...' : 'Enviar por Email'}
          </Button>
        </Grid>

        <Grid item xs={6} md={3}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handleImprimir}
            disabled={exportando}
            fullWidth
          >
            Imprimir
          </Button>
        </Grid>

        <Grid item xs={6} md={3}>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleCompartir}
            disabled={exportando}
            fullWidth
          >
            Compartir
          </Button>
        </Grid>

        <Grid item xs={6} md={3}>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => setSuccess('Función de subida a la nube próximamente')}
            disabled={exportando}
            fullWidth
          >
            Subir a Nube
          </Button>
        </Grid>

        <Grid item xs={6} md={3}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleGenerarVistaPrevia}
            disabled={exportando}
            fullWidth
          >
            Vista Previa
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Información del contenido */}
      <Box sx={{ bgcolor: 'info.50', p: 3, borderRadius: 2, border: '1px solid', borderColor: 'info.200' }}>
        <Typography variant="subtitle2" color="info.main" fontWeight={600} gutterBottom>
          📋 El PDF incluye:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List dense>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <VerifiedIcon sx={{ fontSize: 16, color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Fecha y hora del cierre"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <VerifiedIcon sx={{ fontSize: 16, color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Usuario responsable"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <VerifiedIcon sx={{ fontSize: 16, color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Resumen completo de ventas del día"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <VerifiedIcon sx={{ fontSize: 16, color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Desglose por forma de pago"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List dense>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <VerifiedIcon sx={{ fontSize: 16, color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Comparación efectivo esperado vs contado"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <VerifiedIcon sx={{ fontSize: 16, color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Análisis de diferencias y precisión"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <SecurityIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Firma digital y timestamp"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <QrCodeIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Código QR de verificación"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 2, border: '1px solid', borderColor: 'warning.200' }}>
        <Typography variant="caption" color="warning.main" fontWeight={500}>
          ⚠️ Importante: Conserva este documento como respaldo contable oficial del cierre diario.
          El código QR permite verificar la autenticidad del documento.
        </Typography>
      </Box>

      {/* Dialog de configuración */}
      <Dialog
        open={configuracionDialogOpen}
        onClose={() => setConfiguracionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SettingsIcon sx={{ mr: 1 }} />
            Configuración de Exportación
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Selección de plantilla */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Plantilla de Documento
              </Typography>
              <Grid container spacing={2}>
                {plantillasDisponibles.map((plantilla) => (
                  <Grid item xs={12} md={4} key={plantilla.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: configuracion.plantilla === plantilla.id ? 2 : 1,
                        borderColor: configuracion.plantilla === plantilla.id ? 'primary.main' : 'grey.300',
                        '&:hover': { borderColor: 'primary.main' }
                      }}
                      onClick={() => setConfiguracion({ ...configuracion, plantilla: plantilla.id })}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        {plantilla.icono}
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1 }}>
                          {plantilla.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {plantilla.descripcion}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Configuración de formato */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Formato de Página</InputLabel>
                <Select
                  value={configuracion.formato}
                  onChange={(e) => setConfiguracion({ ...configuracion, formato: e.target.value })}
                  label="Formato de Página"
                >
                  <MenuItem value="A4">A4 (210 x 297 mm)</MenuItem>
                  <MenuItem value="Letter">Letter (216 x 279 mm)</MenuItem>
                  <MenuItem value="Legal">Legal (216 x 356 mm)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Orientación</InputLabel>
                <Select
                  value={configuracion.orientacion}
                  onChange={(e) => setConfiguracion({ ...configuracion, orientacion: e.target.value })}
                  label="Orientación"
                >
                  <MenuItem value="vertical">Vertical (Portrait)</MenuItem>
                  <MenuItem value="horizontal">Horizontal (Landscape)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Opciones de contenido */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Contenido del Documento
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={configuracion.incluirGraficos}
                        onChange={(e) => setConfiguracion({ 
                          ...configuracion, 
                          incluirGraficos: e.target.checked 
                        })}
                      />
                    }
                    label="Incluir gráficos y charts"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={configuracion.incluirDetalleVentas}
                        onChange={(e) => setConfiguracion({ 
                          ...configuracion, 
                          incluirDetalleVentas: e.target.checked 
                        })}
                      />
                    }
                    label="Detalle completo de ventas"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={configuracion.incluirComparacion}
                        onChange={(e) => setConfiguracion({ 
                          ...configuracion, 
                          incluirComparacion: e.target.checked 
                        })}
                      />
                    }
                    label="Análisis de comparación"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={configuracion.incluirRecomendaciones}
                        onChange={(e) => setConfiguracion({ 
                          ...configuracion, 
                          incluirRecomendaciones: e.target.checked 
                        })}
                      />
                    }
                    label="Recomendaciones automáticas"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Opciones de seguridad */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Seguridad y Verificación
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={configuracion.incluirFirmaDigital}
                        onChange={(e) => setConfiguracion({ 
                          ...configuracion, 
                          incluirFirmaDigital: e.target.checked 
                        })}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SecurityIcon sx={{ mr: 1, fontSize: 16 }} />
                        Firma digital
                      </Box>
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={configuracion.incluirCodigoQR}
                        onChange={(e) => setConfiguracion({ 
                          ...configuracion, 
                          incluirCodigoQR: e.target.checked 
                        })}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <QrCodeIcon sx={{ mr: 1, fontSize: 16 }} />
                        Código QR de verificación
                      </Box>
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfiguracionDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setConfiguracionDialogOpen(false);
              setSuccess('Configuración guardada correctamente');
            }}
          >
            Guardar Configuración
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ExportarCierrePDF;