import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  Receipt,
  TrendingUp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Activity {
  id: string;
  type: 'sale' | 'purchase';
  title: string;
  subtitle: string;
  amount: number;
  time: string;
}

const RecentActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      const response = await axios.get('/dashboard/recent-activities');
      const { recentSales, recentPurchases } = response.data;

      const formattedActivities: Activity[] = [
        ...recentSales.map((sale: any) => ({
          id: sale.id,
          type: 'sale' as const,
          title: `Venta ${sale.saleNumber}`,
          subtitle: sale.client?.name || 'Cliente general',
          amount: sale.total,
          time: new Date(sale.createdAt).toLocaleString(),
        })),
        ...recentPurchases.map((purchase: any) => ({
          id: purchase.id,
          type: 'purchase' as const,
          title: `Compra ${purchase.purchaseNumber}`,
          subtitle: purchase.supplier?.name || 'Proveedor',
          amount: purchase.total,
          time: new Date(purchase.createdAt).toLocaleString(),
        })),
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ShoppingCart color="success" />;
      case 'purchase':
        return <Receipt color="primary" />;
      default:
        return <TrendingUp />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'success';
      case 'purchase':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Actividad Reciente
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">Cargando...</Typography>
          </Box>
        ) : activities.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No hay actividades recientes
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getActivityIcon(activity.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">
                          {activity.title}
                        </Typography>
                        <Chip
                          label={activity.type === 'sale' ? 'Venta' : 'Compra'}
                          size="small"
                          color={getActivityColor(activity.type) as any}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {activity.subtitle}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color={activity.type === 'sale' ? 'success.main' : 'primary.main'}
                            sx={{ fontWeight: 600 }}
                          >
                            ${activity.amount.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < activities.length - 1 && <Divider />}
              </motion.div>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;