import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const ResumenVentasDelDia = ({ resumenVentas, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!resumenVentas) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          No hay datos de ventas disponibles
        </Typography>
      </Box>
    );
  }

  const {
    numero_ventas = 0,
    total_efectivo = 0,
    total_tarjeta = 0,
    total_transferencia = 0,
    total_ventas = 0
  } = resumenVentas;

  const formasPago = [
    {
      nombre: 'Efectivo',
      total: total_efectivo,
      icono: <AttachMoneyIcon />,
      color: 'success'
    },
    {
      nombre: 'Tarjeta',
      total: total_tarjeta,
      icono: <CreditCardIcon />,
      color: 'info'
    },
    {
      nombre: 'Transferencia',
      total: total_transferencia,
      icono: <AccountBalanceIcon />,
      color: 'warning'
    }
  ];

  return (
    <Box>
      {/* Resumen general */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Card sx={{ bgcolor: 'primary.50', borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <ReceiptIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight={600} color="primary.main">
                {numero_ventas}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ventas Realizadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6}>
          <Card sx={{ bgcolor: 'success.50', borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <TrendingUpIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight={600} color="success.main">
                ${total_ventas.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Vendido
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Desglose por forma de pago */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Desglose por Forma de Pago
      </Typography>

      <List dense>
        {formasPago.map((forma, index) => (
          <ListItem key={index} sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Box sx={{ color: `${forma.color}.main` }}>
                {forma.icono}
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={forma.nombre}
              secondary={`$${forma.total.toFixed(2)}`}
              secondaryTypographyProps={{
                fontWeight: 600,
                color: `${forma.color}.main`
              }}
            />
            <Chip
              label={`${((forma.total / total_ventas) * 100).toFixed(1)}%`}
              size="small"
              color={forma.color}
              variant="outlined"
            />
          </ListItem>
        ))}
      </List>

      {/* Información importante */}
      {total_efectivo > 0 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 2 }}>
          <Typography variant="body2" color="info.main" fontWeight={500}>
            💡 Efectivo esperado en caja: ${total_efectivo.toFixed(2)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Este es el monto que debería estar físicamente en la caja
          </Typography>
        </Box>
      )}

      {numero_ventas === 0 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 2 }}>
          <Typography variant="body2" color="warning.main" fontWeight={500}>
            ⚠️ No se registraron ventas hoy
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Puedes realizar el cierre con $0.00 en efectivo
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ResumenVentasDelDia;