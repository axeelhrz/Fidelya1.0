import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  Inventory,
  ShoppingCart,
  People,
  Warning,
  AttachMoney,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import KPICard from '../../components/Dashboard/KPICard';
import SalesChart from '../../components/Dashboard/SalesChart';
import RecentActivities from '../../components/Dashboard/RecentActivities';
import AlertsPanel from '../../components/Dashboard/AlertsPanel';

interface DashboardKPIs {
  salesToday: { amount: number; count: number };
  salesThisMonth: { amount: number; count: number };
  lowStockProducts: number;
  productsNearExpiry: number;
  totalProducts: number;
  totalClients: number;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    try {
      const response = await axios.get('/dashboard/kpis');
      setKpis(response.data);
    } catch (error) {
      console.error('Error fetching KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Dashboard
        </Typography>

        {/* KPI Cards */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
          <KPICard
            title="Ventas Hoy"
            value={`$${kpis?.salesToday.amount.toLocaleString() || 0}`}
            subtitle={`${kpis?.salesToday.count || 0} ventas`}
            icon={<AttachMoney />}
            color="success"
            trend={12}
          />
          <KPICard
            title="Ventas del Mes"
            value={`$${kpis?.salesThisMonth.amount.toLocaleString() || 0}`}
            subtitle={`${kpis?.salesThisMonth.count || 0} ventas`}
            icon={<TrendingUp />}
            color="primary"
            trend={8}
          />
          <KPICard
            title="Stock Bajo"
            value={kpis?.lowStockProducts || 0}
            subtitle="productos"
            icon={<Warning />}
            color="warning"
            trend={-5}
          />
          <KPICard
            title="Total Productos"
            value={kpis?.totalProducts || 0}
            subtitle="activos"
            icon={<Inventory />}
            color="info"
          />
        </Stack>

        {/* Charts and Activities */}
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} sx={{ mb: 4 }}>
          <Box sx={{ flex: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Ventas de los Últimos 30 Días
                </Typography>
                <SalesChart />
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <RecentActivities />
          </Box>
        </Stack>

        {/* Alerts Panel */}
        <AlertsPanel />
      </motion.div>
    </Box>
  );
};

export default Dashboard;