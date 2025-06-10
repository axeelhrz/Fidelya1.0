import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Fab,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  MarkEmailRead as MarkReadIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import NotificationCard from '../components/Notificaciones/NotificationCard';
import NotificationSettings from '../components/Notificaciones/NotificationSettings';
import AlertModal from '../components/Notificaciones/AlertModal';
import notificationService from '../services/notificationService';

const Notificaciones = () => {
  const theme = useTheme();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);
  const [alertModal, setAlertModal] = useState({ open: false });

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await notificationService.obtenerNotificaciones({ limite: 100 });
      setNotificaciones(data);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
      setError('Error al cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarLeida = async (notificacionId) => {
    try {
      await notificationService.marcarComoLeidas([notificacionId]);
      await cargarNotificaciones();
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
      setAlertModal({
        open: true,
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'No se pudo marcar la notificación como leída',
      });
    }
  };

  const handleMarcarTodasLeidas = async () => {
    try {
      await notificationService.marcarComoLeidas();
      await cargarNotificaciones();
      setAlertModal({
        open: true,
        tipo: 'success',
        titulo: 'Éxito',
        mensaje: 'Todas las notificaciones han sido marcadas como leídas',
        autoClose: true,
      });
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
      setAlertModal({
        open: true,
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'No se pudieron marcar las notificaciones como leídas',
      });
    }
  };

  const handleVerificarAlertas = async () => {
    try {
      const resultado = await notificationService.verificarAlertas();
      await cargarNotificaciones();
      
      const totalAlertas = Object.values(resultado.alertas_generadas).reduce((a, b) => a + b, 0);
      
      setAlertModal({
        open: true,
        tipo: totalAlertas > 0 ? 'warning' : 'info',
        titulo: 'Verificación Completada',
        mensaje: totalAlertas > 0 
          ? `Se generaron ${totalAlertas} nuevas alertas del sistema`
          : 'No se encontraron nuevas alertas',
        autoClose: true,
      });
    } catch (error) {
      console.error('Error verificando alertas:', error);
      setAlertModal({
        open: true,
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'No se pudieron verificar las alertas del sistema',
      });
    }
  };

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida);
  const notificacionesLeidas = notificaciones.filter(n => n.leida);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              <NotificationsIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Centro de Notificaciones
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gestiona todas tus alertas y notificaciones del sistema
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              onClick={cargarNotificaciones}
              disabled={loading}
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
            >
              <RefreshIcon />
            </IconButton>
            
            <IconButton
              onClick={() => setOpenSettings(true)}
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {notificaciones.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Notificaciones
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {notificacionesNoLeidas.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No Leídas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h4" fontWeight={700} color="error.main">
                  {notificaciones.filter(n => n.tipo === 'stock').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Alertas de Stock
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h4" fontWeight={700} color="info.main">
                  {notificaciones.filter(n => n.tipo === 'pago' || n.tipo === 'cobro').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pagos/Cobros
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Actions */}
        {notificacionesNoLeidas.length > 0 && (
          <Box display="flex" gap={2} mb={4}>
            <Button
              variant="contained"
              startIcon={<MarkReadIcon />}
              onClick={handleMarcarTodasLeidas}
            >
              Marcar Todas como Leídas
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleVerificarAlertas}
            >
              Verificar Nuevas Alertas
            </Button>
          </Box>
        )}

        {/* Content */}
        <Grid container spacing={3}>
          {/* Notificaciones No Leídas */}
          {notificacionesNoLeidas.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h5" fontWeight={600} mb={3} color="warning.main">
                📬 Notificaciones No Leídas ({notificacionesNoLeidas.length})
              </Typography>
              
              {notificacionesNoLeidas.map((notificacion) => (
                <NotificationCard
                  key={notificacion.id}
                  notificacion={notificacion}
                  onMarkAsRead={handleMarcarLeida}
                />
              ))}
            </Grid>
          )}

          {/* Notificaciones Leídas */}
          {notificacionesLeidas.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h5" fontWeight={600} mb={3} color="text.secondary">
                📭 Notificaciones Leídas ({notificacionesLeidas.length})
              </Typography>
              
              {notificacionesLeidas.map((notificacion) => (
                <NotificationCard
                  key={notificacion.id}
                  notificacion={notificacion}
                  compact
                />
              ))}
            </Grid>
          )}

          {/* Loading State */}
          {loading && (
            <Grid item xs={12}>
              {[...Array(5)].map((_, index) => (
                <Card key={index} sx={{ mb: 2, borderRadius: 3 }}>
                  <CardContent>
                    <Box display="flex" gap={2}>
                      <Skeleton variant="circular" width={48} height={48} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" height={24} />
                        <Skeleton variant="text" width="100%" height={20} />
                        <Skeleton variant="text" width="40%" height={16} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          )}

          {/* Error State */}
          {!loading && error && (
            <Grid item xs={12}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ py: 8 }}
              >
                <Typography variant="h5" fontWeight={600} color="error.main" mb={1}>
                  Error al cargar notificaciones
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" mb={3}>
                  {error}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={cargarNotificaciones}
                >
                  Reintentar
                </Button>
              </Box>
            </Grid>
          )}

          {/* Empty State */}
          {!loading && !error && notificaciones.length === 0 && (
            <Grid item xs={12}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ py: 8 }}
              >
                <NotificationsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" fontWeight={600} color="text.secondary" mb={1}>
                  No hay notificaciones
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" mb={3}>
                  Cuando tengas nuevas alertas o notificaciones, aparecerán aquí
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleVerificarAlertas}
                >
                  Verificar Alertas
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={handleVerificarAlertas}
        >
          <RefreshIcon />
        </Fab>

        {/* Settings Dialog */}
        <NotificationSettings
          open={openSettings}
          onClose={() => setOpenSettings(false)}
          onSave={() => {
            setAlertModal({
              open: true,
              tipo: 'success',
              titulo: 'Configuración Guardada',
              mensaje: 'La configuración de notificaciones se ha actualizado correctamente',
              autoClose: true,
            });
          }}
        />

        {/* Alert Modal */}
        <AlertModal
          open={alertModal.open}
          onClose={() => setAlertModal({ open: false })}
          tipo={alertModal.tipo}
          titulo={alertModal.titulo}
          mensaje={alertModal.mensaje}
          autoClose={alertModal.autoClose}
        />
      </motion.div>
    </Container>
  );
};

export default Notificaciones;