import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  PictureAsPdf as PictureAsPdfIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { cierreCajaService } from '../../../services/cierreCajaService';

const ExportarCierrePDF = ({ cierreId }) => {
  const [exportando, setExportando] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleExportarPDF = async () => {
    setExportando(true);
    setError(null);
    setSuccess(null);

    try {
      const resultado = await cierreCajaService.exportarCierrePDF(cierreId);
      
      setSuccess(`PDF generado exitosamente: ${resultado.nombre_archivo}`);
      
      // En una implementación real, aquí se descargaría el archivo
      // window.open(resultado.url_descarga, '_blank');
      
    } catch (error) {
      console.error('Error exportando PDF:', error);
      setError(error.message || 'Error al generar el PDF del cierre');
    } finally {
      setExportando(false);
    }
  };

  const handleImprimir = () => {
    // En una implementación real, esto abriría el diálogo de impresión
    window.print();
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PictureAsPdfIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight={600}>
          Exportar Respaldo Contable
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Genera un documento PDF profesional con el detalle completo del cierre de caja, 
        incluyendo resumen de ventas, diferencias y observaciones. Ideal para respaldo 
        contable y auditoría.
      </Typography>

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

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={exportando ? <CircularProgress size={16} /> : <DownloadIcon />}
          onClick={handleExportarPDF}
          disabled={exportando || !cierreId}
          sx={{ minWidth: 160 }}
        >
          {exportando ? 'Generando...' : 'Descargar PDF'}
        </Button>

        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handleImprimir}
          disabled={exportando}
        >
          Imprimir
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ bgcolor: 'info.50', p: 2, borderRadius: 1 }}>
        <Typography variant="subtitle2" color="info.main" fontWeight={600} gutterBottom>
          📋 El PDF incluye:
        </Typography>
        <Typography variant="body2" color="text.secondary" component="div">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Fecha y hora del cierre</li>
            <li>Usuario responsable</li>
            <li>Resumen completo de ventas del día</li>
            <li>Desglose por forma de pago</li>
            <li>Comparación efectivo esperado vs contado</li>
            <li>Análisis de diferencias</li>
            <li>Observaciones y notas</li>
            <li>Firma digital y timestamp</li>
          </ul>
        </Typography>
      </Box>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
        <Typography variant="caption" color="warning.main" fontWeight={500}>
          ⚠️ Importante: Conserva este documento como respaldo contable oficial del cierre diario.
        </Typography>
      </Box>
    </Paper>
  );
};

export default ExportarCierrePDF;