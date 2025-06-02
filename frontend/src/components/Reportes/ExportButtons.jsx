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
  Snackbar
} from '@mui/material';
import {
  GetApp,
  PictureAsPdf,
  TableChart,
  KeyboardArrowDown
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { reportesService } from '../../services/reportesService';

const ExportButtons = ({ filtros = {}, disabled = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const exportarPDF = async () => {
    setLoading(true);
    handleClose();
    
    try {
      const response = await reportesService.exportarReportePDF(filtros);
      showNotification(
        response.message || 'Funcionalidad de exportación PDF disponible. Implementación en desarrollo.',
        'info'
      );
    } catch (error) {
      console.error('Error exportando PDF:', error);
      showNotification('Error al exportar a PDF', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportarExcel = async () => {
    setLoading(true);
    handleClose();
    
    try {
      const response = await reportesService.exportarReporteExcel(filtros);
      showNotification(
        response.message || 'Funcionalidad de exportación Excel disponible. Implementación en desarrollo.',
        'info'
      );
    } catch (error) {
      console.error('Error exportando Excel:', error);
      showNotification('Error al exportar a Excel', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportarCSV = () => {
    handleClose();
    showNotification('Funcionalidad de exportación CSV en desarrollo', 'info');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="contained"
          startIcon={<GetApp />}
          endIcon={<KeyboardArrowDown />}
          onClick={handleClick}
          disabled={disabled || loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            background: 'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #45a049 30%, #5cb85c 90%)',
            }
          }}
        >
          {loading ? 'Exportando...' : 'Exportar Reporte'}
        </Button>
      </motion.div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            mt: 1,
            minWidth: 200,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Selecciona el formato
          </Typography>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={exportarPDF} disabled={loading}>
          <ListItemIcon>
            <PictureAsPdf color="error" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Exportar como PDF</Typography>
            <Typography variant="caption" color="text.secondary">
              Formato A4, resumen y detalle
            </Typography>
          </ListItemText>
        </MenuItem>
        
        <MenuItem onClick={exportarExcel} disabled={loading}>
          <ListItemIcon>
            <TableChart color="success" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Exportar como Excel</Typography>
            <Typography variant="caption" color="text.secondary">
              Con pestañas por tipo
            </Typography>
          </ListItemText>
        </MenuItem>
        
        <MenuItem onClick={exportarCSV} disabled={loading}>
          <ListItemIcon>
            <TableChart color="info" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Exportar como CSV</Typography>
            <Typography variant="caption" color="text.secondary">
              Datos tabulares simples
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExportButtons;