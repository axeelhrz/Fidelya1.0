import React, { useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

interface SalesData {
  date: string;
  total: number;
  count: number;
}

const SalesChart: React.FC = () => {
  const theme = useTheme();
  const [data, setData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get('/dashboard/sales-chart');
      const chartData = Object.entries(response.data).map(([date, values]: [string, any]) => ({
        date: new Date(date).toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric' 
        }),
        total: values.total,
        count: values.count,
      }));
      setData(chartData);
    } catch (error) {
      console.error('Error fetching sales chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Cargando gráfico...
      </Box>
    );
  }

  return (
    <Box sx={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="date" 
            stroke={theme.palette.text.secondary}
            fontSize={12}
          />
          <YAxis 
            stroke={theme.palette.text.secondary}
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 8,
            }}
            formatter={(value: number, name: string) => [
              name === 'total' ? `$${value.toLocaleString()}` : value,
              name === 'total' ? 'Ventas' : 'Cantidad'
            ]}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke={theme.palette.primary.main}
            strokeWidth={3}
            dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: theme.palette.primary.main, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SalesChart;