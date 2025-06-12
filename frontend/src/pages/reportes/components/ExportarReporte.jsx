import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  FileDownload as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Print as PrintIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import reportesService from '../../../services/reportesService';

const ExportarReporte = ({ 
  tipoReporte, 
  datosReporte, 
  filtros = {},
  disabled = false 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '', mostrar: false });

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };




  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto, mostrar: true });
  };

  const cerrarMensaje = () => {
    setMensaje(prev => ({ ...prev, mostrar: false }));
  };

  // Exportar a PDF
  const exportarPDF = async () => {
    try {
      setLoading(true);
      handleClose();
      
      const resultado = await reportesService.exportarReporte(tipoReporte, 'pdf', filtros);
      mostrarMensaje('success', `Reporte PDF generado: ${resultado.nombre_archivo}`);
      
      // En una implementación real, aquí se descargaría el archivo
      console.log('📄 Archivo PDF generado:', resultado);
      
    } catch (error) {
      console.error('Error exportando PDF:', error);
      mostrarMensaje('error', 'Error al generar el reporte PDF');
    } finally {
      setLoading(false);
    }
  };

  // Exportar a Excel
  const exportarExcel = async () => {
    try {
      setLoading(true);
      handleClose();
      
      const resultado = await reportesService.exportarReporte(tipoReporte, 'excel', filtros);
      mostrarMensaje('success', `Reporte Excel generado: ${resultado.nombre_archivo}`);
      
      // En una implementación real, aquí se descargaría el archivo
      console.log('📊 Archivo Excel generado:', resultado);
      
    } catch (error) {
      console.error('Error exportando Excel:', error);
      mostrarMensaje('error', 'Error al generar el reporte Excel');
    } finally {
      setLoading(false);
    }
  };

  // Imprimir reporte
  const imprimirReporte = () => {
    handleClose();
    
    try {
      // Crear ventana de impresión con los datos del reporte
      const ventanaImpresion = window.open('', '_blank');
      
      const contenidoHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reporte ${tipoReporte}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #62a83d; }
            .titulo { font-size: 20px; margin: 10px 0; }
            .fecha { color: #666; font-size: 14px; }
            .seccion { margin: 20px 0; }
            .seccion h3 { color: #333; border-bottom: 2px solid #62a83d; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .numero { text-align: right; }
            .total { font-weight: bold; background-color: #f9f9f9; }
            @media print {
              .no-print { display: none; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🍎 Frutería Nina</div>
            <div class="titulo">Reporte de ${tipoReporte.replace('_', ' ').toUpperCase()}</div>
            <div class="fecha">Generado el ${new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
          </div>
          
          <div class="seccion">
            <h3>Filtros Aplicados</h3>
            <p><strong>Período:</strong> ${filtros.fecha_inicio || 'Sin especificar'} - ${filtros.fecha_fin || 'Sin especificar'}</p>
          </div>
          
          <div class="seccion">
            <h3>Resumen</h3>
            <p>Los datos del reporte se mostrarían aquí en una implementación completa.</p>
          </div>
          
          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #62a83d; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Imprimir
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #ccc; color: black; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
              Cerrar
            </button>
          </div>
        </body>
        </html>
      `;
      
      ventanaImpresion.document.write(contenidoHTML);
      ventanaImpresion.document.close();
      
      mostrarMensaje('info', 'Ventana de impresión abierta');
      
    } catch (error) {
      console.error('Error abriendo ventana de impresión:', error);
      mostrarMensaje('error', 'Error al abrir la ventana de impresión');
    }
  };

  // Compartir reporte
  const compartirReporte = async () => {
    handleClose();
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Reporte ${tipoReporte}`,
          text: `Reporte de ${tipoReporte.replace('_', ' ')} - Frutería Nina`,
          url: window.location.href
        });
        mostrarMensaje('success', 'Reporte compartido exitosamente');
      } else {
        // Fallback: copiar al portapapeles
        await navigator.clipboard.writeText(window.location.href);
        mostrarMensaje('info', 'Enlace copiado al portapapeles');
      }
    } catch (error) {
      console.error('Error compartiendo:', error);
      mostrarMensaje('error', 'Error al compartir el reporte');
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
        onClick={handleClick}
        disabled={disabled || loading}
        sx={{
          background: 'linear-gradient(45deg, #62a83d 30%, #8bc34a 90%)',
          boxShadow: '0 3px 5px 2px rgba(98, 168, 61, .3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #4a7c2a 30%, #62a83d 90%)',
          }
        }}
      >
        {loading ? 'Exportando...' : 'Exportar'}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.5,
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(98, 168, 61, 0.1)',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={exportarPDF}>
          <ListItemIcon>
            <PdfIcon sx={{ color: '#d32f2f' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>
              Exportar PDF
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Documento con formato
            </Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={exportarExcel}>
          <ListItemIcon>
            <ExcelIcon sx={{ color: '#2e7d32' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>
              Exportar Excel
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hoja de cálculo
            </Typography>
          </ListItemText>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={imprimirReporte}>
          <ListItemIcon>
            <PrintIcon sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>
              Imprimir
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Enviar a impresora
            </Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={compartirReporte}>
          <ListItemIcon>
            <ShareIcon sx={{ color: '#9c27b0' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>
              Compartir
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Enviar enlace
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={mensaje.mostrar}
        autoHideDuration={6000}
        onClose={cerrarMensaje}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={cerrarMensaje} 
          severity={mensaje.tipo} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {mensaje.texto}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExportarReporte;