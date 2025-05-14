'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Box, 
  Typography, 
  useTheme, 
  alpha, 
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
  Divider,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { 
  MoreVert, 
  FileDownload, 
  Refresh, 
  CalendarMonth, 
  CalendarToday,
  CalendarViewMonth,
  CalendarViewWeek
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import { generatePolicyTrends } from '@/lib/generate-policy-trends';

// Types for chart data
interface ChartData {
  name: string;
  nuevas: number;
  renovadas: number;
  canceladas: number;
}

const PoliciesChart = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('year');
  const [refreshing, setRefreshing] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);
  
  useEffect(() => {
    if (!user?.uid) return;

    // Real-time subscription to chart data from Firestore
    const unsubscribe = onSnapshot(
      doc(db, `users/${user.uid}/dashboard/trends`),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const trendsData = docSnapshot.data();
          if (trendsData.monthByMonth) {
            setChartData(trendsData.monthByMonth);
          }
        } else {
          // Si no existen datos de tendencias, generarlos
          generatePolicyTrends(user.uid).then(() => {
            console.log('Datos de tendencias generados');
          });
      }
        
        setIsLoading(false);
        setRefreshing(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Filter data based on selected time range
  const getFilteredData = () => {
    if (chartData.length === 0) {
      return [];
    }
    // Filter real data
    switch (timeRange) {
      case 'week':
        return chartData.slice(-3);
      case 'month':
        return chartData.slice(-6);
      case 'quarter':
        return chartData.slice(-9);
      case 'year':
      default:
        return chartData;
    }
  };

  const data = getFilteredData();

  // Handle menu open
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Handle time range change
  const handleTimeRangeChange = (range: 'week' | 'month' | 'quarter' | 'year') => {
    setTimeRange(range);
    handleMenuClose();
  };

  // Handle refresh
  const handleRefresh = async () => {
    if (!user?.uid) return;
    
    setRefreshing(true);
    setIsLoading(true);
      try {
      // Generar nuevos datos de tendencias
      await generatePolicyTrends(user.uid);
      console.log('Datos de tendencias actualizados');
      } catch (error) {
      console.error('Error al actualizar datos de tendencias:', error);
      }
    handleMenuClose();
  };

  // Handle export as image
  const handleExportImage = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#ffffff',
          scale: 2
        });
        
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'evolucion-polizas.png';
        link.click();
      } catch (error) {
        console.error('Error exporting chart:', error);
      }
    }
    handleMenuClose();
  };

  // Get time range text
  const getTimeRangeText = () => {
    switch (timeRange) {
      case 'week':
        return 'Últimas semanas';
      case 'month':
        return 'Últimos 6 meses';
      case 'quarter':
        return 'Últimos 9 meses';
      case 'year':
      default:
        return 'Últimos 12 meses';
    }
  };

  // Interface for tooltip payload entry
    interface TooltipPayloadEntry {
      name: string;
      value: number;
      color: string;
      dataKey?: string;
      payload?: Record<string, unknown>;
    }
  
    // Interface for CustomTooltip props
    interface CustomTooltipProps {
      active?: boolean;
      payload?: TooltipPayloadEntry[];
      label?: string;
    }

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
  return (
        <Box
      sx={{
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            p: 2,
                  borderRadius: 2,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}
            >
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            {label}
              </Typography>
          
          {payload.map((entry: TooltipPayloadEntry, index: number) => (
            <Stack 
              key={`item-${index}`} 
              direction="row" 
              alignItems="center" 
              spacing={1.5}
              sx={{ mb: 0.5 }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: entry.color
                }}
              />
              <Typography variant="body2">
                {entry.name}: <strong>{entry.value}</strong>
              </Typography>
            </Stack>
          ))}
          
          <Divider sx={{ my: 1 }} />
          
          <Typography variant="body2" fontWeight={600}>
            Total: <strong>{payload.reduce((sum: number, entry: TooltipPayloadEntry) => sum + entry.value, 0)}</strong>
          </Typography>
        </Box>
  );
    }
    return null;
};

  // Animation for the component
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <Card
      component={motion.div}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      ref={chartRef}
      sx={{
        height: 400,
        borderRadius: 4,
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(12px)',
        boxShadow: theme.palette.mode === 'dark' 
          ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`
          : `0 8px 32px ${alpha('#000', 0.05)}`,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}
    >
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" fontFamily="Sora" fontWeight={600}>
              Evolución de Pólizas
            </Typography>
            {refreshing && (
              <Box sx={{ display: 'inline-flex', ml: 1 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Refresh fontSize="small" color="primary" />
                </motion.div>
              </Box>
            )}
          </Stack>
        }
        subheader={getTimeRangeText()}
        action={
          <Box>
            <Tooltip title="Opciones">
              <IconButton 
                onClick={handleMenuClick}
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2)
                  }
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={menuAnchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  borderRadius: 2,
                  minWidth: 200,
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                  mt: 1.5,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => handleTimeRangeChange('week')}>
                <ListItemIcon>
                  <CalendarViewWeek fontSize="small" />
                </ListItemIcon>
                <ListItemText>Últimas semanas</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleTimeRangeChange('month')}>
                <ListItemIcon>
                  <CalendarViewMonth fontSize="small" />
                </ListItemIcon>
                <ListItemText>Últimos 6 meses</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleTimeRangeChange('quarter')}>
                <ListItemIcon>
                  <CalendarToday fontSize="small" />
                </ListItemIcon>
                <ListItemText>Últimos 9 meses</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleTimeRangeChange('year')}>
                <ListItemIcon>
                  <CalendarMonth fontSize="small" />
                </ListItemIcon>
                <ListItemText>Últimos 12 meses</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleRefresh}>
                <ListItemIcon>
                  <Refresh fontSize="small" />
                </ListItemIcon>
                <ListItemText>Actualizar datos</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleExportImage}>
                <ListItemIcon>
                  <FileDownload fontSize="small" />
                </ListItemIcon>
                <ListItemText>Exportar como imagen</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        }
      />
      <CardContent sx={{ height: 320, p: 1 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Stack spacing={2} alignItems="center">
              <Skeleton variant="circular" width={40} height={40} />
              <Typography variant="body2" color="text.secondary">
                Cargando datos...
              </Typography>
            </Stack>
          </Box>
        ) : data.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Stack spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                No hay datos disponibles. Intente actualizar.
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<Refresh />}
                onClick={handleRefresh}
              >
                Actualizar datos
              </Button>
            </Stack>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorNuevas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRenovadas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCanceladas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.error.main} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
                dy={10}
              />
              <YAxis 
                tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
                dx={-10}
              />
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={alpha(theme.palette.divider, 0.5)} 
                vertical={false}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ 
                  paddingTop: 20,
                  fontSize: 12
                }}
              />
              <Area 
                type="monotone" 
                dataKey="nuevas" 
                name="Nuevas" 
                stroke={theme.palette.primary.main} 
                fillOpacity={1} 
                fill="url(#colorNuevas)" 
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="renovadas" 
                name="Renovadas" 
                stroke={theme.palette.success.main} 
                fillOpacity={1} 
                fill="url(#colorRenovadas)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="canceladas" 
                name="Canceladas" 
                stroke={theme.palette.error.main} 
                fillOpacity={1} 
                fill="url(#colorCanceladas)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PoliciesChart;