import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Skeleton,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoriasChart = ({ data = [], loading = false, tipo = 'venta', onTipoChange }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const colors = [
    '#4CAF50', // Verde
    '#FF9800', // Naranja
    '#2196F3', // Azul
    '#9C27B0', // Púrpura
    '#F44336', // Rojo
    '#00BCD4', // Cian
    '#FFEB3B', // Amarillo
    '#795548'  // Marrón
  ];

  const chartData = {
    labels: data.map(item => item.categoria),
    datasets: [
      {
        data: data.map(item => item.total),
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors.slice(0, data.length).map(color => color),
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 10
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percentage = ((value / data.datasets[0].data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: data.datasets[0].borderWidth,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#4CAF50',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    elements: {
      arc: {
        borderRadius: 4
      }
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Distribución por Categorías
          </Typography>
          <Skeleton variant="rectangular" width={120} height={40} />
        </Box>
        <Skeleton variant="circular" width={280} height={280} sx={{ mx: 'auto' }} />
      </Paper>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Distribución por Categorías
          </Typography>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={tipo}
              label="Tipo"
              onChange={(e) => onTipoChange && onTipoChange(e.target.value)}
            >
              <MenuItem value="venta">Ventas</MenuItem>
              <MenuItem value="compra">Compras</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {data.length === 0 ? (
          <Box 
            sx={{ 
              height: 320, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No hay datos de categorías para mostrar
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: 320, position: 'relative' }}>
            <Doughnut data={chartData} options={options} />
            
            {/* Total en el centro */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Total
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {formatCurrency(data.reduce((sum, item) => sum + item.total, 0))}
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

export default CategoriasChart;