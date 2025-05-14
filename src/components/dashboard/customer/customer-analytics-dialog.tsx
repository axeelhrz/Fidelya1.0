import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  useTheme,
  alpha,
  Divider,
  Box,
  Stack,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Customer } from '@/types/customer';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface CustomerAnalyticsDialogProps {
  open: boolean;
  onClose: () => void;
  customers: Customer[];
}

const CustomerAnalyticsDialog: React.FC<CustomerAnalyticsDialogProps> = ({
  open,
  onClose,
  customers,
}) => {
  const theme = useTheme();
  
  // Datos para el gráfico de estado
  const statusData = [
    { name: 'Activos', value: customers.filter(c => c.status === 'active').length },
    { name: 'Inactivos', value: customers.filter(c => c.status === 'inactive').length },
    { name: 'Leads', value: customers.filter(c => c.status === 'lead').length },
  ].filter(item => item.value > 0);
  
  // Datos para el gráfico de género
  const genderData = [
    { name: 'Masculino', value: customers.filter(c => c.gender === 'male').length },
    { name: 'Femenino', value: customers.filter(c => c.gender === 'female').length },
    { name: 'Otro', value: customers.filter(c => c.gender === 'other').length },
  ].filter(item => item.value > 0);
  
  // Datos para el gráfico de nivel de riesgo
  const riskLevelData = [
    { name: 'Bajo', value: customers.filter(c => c.riskLevel === 'low').length },
    { name: 'Medio', value: customers.filter(c => c.riskLevel === 'medium').length },
    { name: 'Alto', value: customers.filter(c => c.riskLevel === 'high').length },
  ].filter(item => item.value > 0);
  
  // Datos para el gráfico de estado civil
  const civilStatusData = [
    { name: 'Soltero/a', value: customers.filter(c => c.civilStatus === 'single').length },
    { name: 'Casado/a', value: customers.filter(c => c.civilStatus === 'married').length },
    { name: 'Divorciado/a', value: customers.filter(c => c.civilStatus === 'divorced').length },
    { name: 'Viudo/a', value: customers.filter(c => c.civilStatus === 'widowed').length },
  ].filter(item => item.value > 0);
  
  // Colores para los gráficos
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];
  
  // Datos para el gráfico de clientes por mes
  const getCustomersByMonth = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const monthData: Record<string, number> = {};
    
    // Inicializar los últimos 12 meses
    for (let i = 0; i < 12; i++) {
      const month = new Date(currentYear, now.getMonth() - i, 1);
      const monthKey = month.toLocaleString('es', { month: 'short', year: '2-digit' });
      monthData[monthKey] = 0;
    }
    
    // Contar clientes por mes
    customers.forEach(customer => {
      if (!customer.createdAt) return;
      
      const createdAt = typeof customer.createdAt === 'string' 
        ? new Date(customer.createdAt) 
        : customer.createdAt instanceof Date 
          ? customer.createdAt 
          : customer.createdAt.toDate();
      
      // Solo considerar los últimos 12 meses
      const monthDiff = (now.getFullYear() - createdAt.getFullYear()) * 12 + now.getMonth() - createdAt.getMonth();
      if (monthDiff >= 0 && monthDiff < 12) {
        const monthKey = createdAt.toLocaleString('es', { month: 'short', year: '2-digit' });
        monthData[monthKey] = (monthData[monthKey] || 0) + 1;
      }
    });
    
    // Convertir a array para el gráfico
    return Object.entries(monthData)
      .map(([name, value]) => ({ name, value }))
      .reverse();
  };
  
  const customersByMonth = getCustomersByMonth();
  
  // Componente personalizado para el tooltip
  const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: Array<{
      value: number;
      color: string;
    }>;
    label?: string;
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography 
            variant="body2" 
            fontWeight={600}
            fontFamily="'Sora', sans-serif"
            color="text.primary"
          >
            {label}
          </Typography>
          <Typography 
            variant="body2"
            fontFamily="'Sora', sans-serif"
            color={payload[0].color}
          >
            {`${payload[0].value} clientes`}
          </Typography>
        </Paper>
      );
    }
    return null;
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        }
      }}
    >
      <DialogTitle sx={{ 
        p: 3, 
        fontFamily: "'Sora', sans-serif",
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TrendingUpIcon color="primary" />
          <Typography variant="h6" fontFamily="'Sora', sans-serif" fontWeight={600}>
            Análisis de clientes
          </Typography>
        </Stack>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.text.secondary, 0.1),
            '&:hover': {
              bgcolor: alpha(theme.palette.text.secondary, 0.2),
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Gráfico de clientes por mes */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography 
              variant="h6" 
              fontWeight={600}
              fontFamily="'Sora', sans-serif"
              gutterBottom
            >
              Nuevos clientes por mes
            </Typography>
            
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={customersByMonth}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontFamily: "'Sora', sans-serif", fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontFamily: "'Sora', sans-serif", fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    name="Clientes" 
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          
          {/* Gráficos de distribución - Primera fila */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {/* Distribución por estado */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                flex: 1,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight={600}
                fontFamily="'Sora', sans-serif"
                gutterBottom
              >
                Distribución por estado
              </Typography>
              
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      formatter={(value) => (
                        <span style={{ fontFamily: "'Sora', sans-serif", color: theme.palette.text.primary }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
            
            {/* Distribución por nivel de riesgo */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                flex: 1,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight={600}
                fontFamily="'Sora', sans-serif"
                gutterBottom
              >
                Distribución por nivel de riesgo
              </Typography>
              
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskLevelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {riskLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      formatter={(value) => (
                        <span style={{ fontFamily: "'Sora', sans-serif", color: theme.palette.text.primary }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Stack>
          
          {/* Gráficos de distribución - Segunda fila */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {/* Distribución por género */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                flex: 1,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight={600}
                fontFamily="'Sora', sans-serif"
                gutterBottom
              >
                Distribución por género
              </Typography>
              
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      formatter={(value) => (
                        <span style={{ fontFamily: "'Sora', sans-serif", color: theme.palette.text.primary }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
            
            {/* Distribución por estado civil */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                flex: 1,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight={600}
                fontFamily="'Sora', sans-serif"
                gutterBottom
              >
                Distribución por estado civil
              </Typography>
              
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={civilStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {civilStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      formatter={(value) => (
                        <span style={{ fontFamily: "'Sora', sans-serif", color: theme.palette.text.primary }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Stack>
        </Stack>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            fontFamily: "'Sora', sans-serif",
            px: 3,
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerAnalyticsDialog;