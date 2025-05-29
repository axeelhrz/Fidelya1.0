import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Box,
  Chip,
  Button,
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  Inventory,
  Schedule,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface AlertItem {
  id: string;
  type: 'low_stock' | 'near_expiry' | 'out_of_stock';
  title: string;
  message: string;
  severity: 'warning' | 'error' | 'info';
  count?: number;
}

const AlertsPanel: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const [lowStockResponse, nearExpiryResponse] = await Promise.all([
        axios.get('/inventory/low-stock'),
        axios.get('/inventory/near-expiry'),
      ]);

      const lowStockProducts = lowStockResponse.data;
      const nearExpiryProducts = nearExpiryResponse.data;

      const alertsData: AlertItem[] = [];

      if (lowStockProducts.length > 0) {
        alertsData.push({
          id: 'low-stock',
          type: 'low_stock',
          title: 'Stock Bajo',
          message: `${lowStockProducts.length} productos con stock bajo`,
          severity: 'warning',
          count: lowStockProducts.length,
        });
      }

      if (nearExpiryProducts.length > 0) {
        alertsData.push({
          id: 'near-expiry',
          type: 'near_expiry',
          title: 'Próximos a Vencer',
          message: `${nearExpiryProducts.length} productos próximos a vencer`,
          severity: 'error',
          count: nearExpiryProducts.length,
        });
      }

      const outOfStockProducts = lowStockProducts.filter((p: any) => p.stock === 0);
      if (outOfStockProducts.length > 0) {
        alertsData.push({
          id: 'out-of-stock',
          type: 'out_of_stock',
          title: 'Sin Stock',
          message: `${outOfStockProducts.length} productos sin stock`,
          severity: 'error',
          count: outOfStockProducts.length,
        });
      }

      setAlerts(alertsData);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <Warning color="warning" />;
      case 'near_expiry':
        return <Schedule color="error" />;
      case 'out_of_stock':
        return <Error color="error" />;
      default:
        return <Info color="info" />;
    }
  };

  const handleAlertClick = (type: string) => {
    switch (type) {
      case 'low_stock':
      case 'out_of_stock':
        navigate('/inventory?filter=low-stock');
        break;
      case 'near_expiry':
        navigate('/inventory?filter=near-expiry');
        break;
      default:
        navigate('/inventory');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Alertas del Sistema
          </Typography>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography color="text.secondary">Cargando alertas...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Alertas del Sistema
        </Typography>

        {alerts.length === 0 ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography>
              ¡Excelente! No hay alertas pendientes en el sistema.
            </Typography>
          </Alert>
        ) : (
          <List sx={{ p: 0 }}>
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem
                  sx={{
                    px: 0,
                    py: 1,
                    cursor: 'pointer',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => handleAlertClick(alert.type)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getAlertIcon(alert.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">
                          {alert.title}
                        </Typography>
                        {alert.count && (
                          <Chip
                            label={alert.count}
                            size="small"
                            color={alert.severity}
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={alert.message}
                  />
                </ListItem>
              </motion.div>
            ))}
          </List>
        )}

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<Inventory />}
            onClick={() => navigate('/inventory')}
            size="small"
          >
            Ver Inventario Completo
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;