'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Stack, 
  Typography, 
  useTheme, 
  alpha, 
  Avatar, 
  Tooltip as MuiTooltip,
  IconButton,
  Skeleton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Policy } from '@/types/policy';
import { 
  DirectionsCar as CarIcon, 
  Favorite as LifeIcon, 
  Home as HomeIcon, 
  HealthAndSafety as HealthIcon, 
  Business as BusinessIcon, 
  Public as OtherIcon,
  FileDownload as DownloadIcon,
  MoreVert,
  Refresh,
  PieChart as PieChartIcon,
  DonutLarge,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import { formatNumber } from '@/lib/utils';

// Types for chart data
interface ChartData {
  id: string;
  name: string;
  value: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
  count: number;
}

// Mapping policy types to colors and icons
const policyTypeConfig: Record<string, { 
  lightColor: string; 
  darkColor: string; 
  icon: React.ReactNode;
  label: string;
}> = {
  'auto': { 
    lightColor: '#3B82F6', 
    darkColor: '#1E40AF', 
    icon: <CarIcon />,
    label: 'Auto'
  },
  'vida': { 
    lightColor: '#EF4444', 
    darkColor: '#B91C1C', 
    icon: <LifeIcon />,
    label: 'Vida'
  },
  'hogar': { 
    lightColor: '#F59E0B', 
    darkColor: '#B45309', 
    icon: <HomeIcon />,
    label: 'Hogar'
  },
  'salud': { 
    lightColor: '#10B981', 
    darkColor: '#065F46', 
    icon: <HealthIcon />,
    label: 'Salud'
  },
  'empresarial': { 
    lightColor: '#6366F1', 
    darkColor: '#4338CA', 
    icon: <BusinessIcon />,
    label: 'Empresarial'
  },
  'otros': { 
    lightColor: '#8B5CF6', 
    darkColor: '#5B21B6', 
    icon: <OtherIcon />,
    label: 'Otros'
  }
};

const PolicyDistributionChart = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'donut' | 'bar'>('donut');
  const [refreshing, setRefreshing] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  // Get policy data in real-time
  useEffect(() => {
    if (!user?.uid) return;

    setIsLoading(true);
    
    // Query to get all user policies
    const policiesRef = collection(db, 'policies');
    const q = query(policiesRef, where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const policiesList: Policy[] = [];
      snapshot.forEach((doc) => {
        policiesList.push({ id: doc.id, ...doc.data() } as Policy);
      });
      
      setPolicies(policiesList);
      setIsLoading(false);
      setRefreshing(false);
    }, (error) => {
      console.error('Error fetching policies:', error);
      setIsLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!policies.length) return [];

    // Group policies by type
    const typeGroups = policies.reduce((acc, policy) => {
      const type = policy.type?.toLowerCase() || 'otros';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(policy);
      return acc;
    }, {} as Record<string, Policy[]>);

    // Calculate total policies
    const totalPolicies = policies.length;

    // Convert to chart format
    const data: ChartData[] = Object.entries(typeGroups).map(([type, typePolicies]) => {
      const normalizedType = type.toLowerCase();
      const config = policyTypeConfig[normalizedType] || policyTypeConfig.otros;
      const count = typePolicies.length;
      const percentage = (count / totalPolicies) * 100;
      
      return {
        id: normalizedType,
        name: config.label || capitalizeFirstLetter(type),
        value: percentage,
        percentage: percentage,
        count: count,
        color: theme.palette.mode === 'dark' ? config.darkColor : config.lightColor,
        icon: config.icon
      };
    });

    // Sort by percentage descending
    return data.sort((a, b) => b.value - a.value);
  }, [policies, theme.palette.mode]);

  // Function to capitalize first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Handle menu open
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Handle chart type change
  const handleChartTypeChange = (type: 'pie' | 'donut' | 'bar') => {
    setChartType(type);
    handleMenuClose();
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setIsLoading(true);
    // The data will be refreshed automatically via the Firestore subscription
    handleMenuClose();
  };

  // Export chart as image
  const handleExportChart = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#ffffff',
          scale: 2
        });
        
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'distribucion-polizas.png';
        link.click();
      } catch (error) {
        console.error('Error exporting chart:', error);
      }
    }
    handleMenuClose();
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

  // Animation for legend items
  const legendItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    }),
    hover: {
      scale: 1.03,
      x: 5,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ 
    active, 
    payload 
  }: { 
    active?: boolean; 
    payload?: Array<{ payload: ChartData }>; 
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            p: 1.5,
            borderRadius: 2,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: data.color,
                color: '#fff'
              }}
            >
              {data.icon}
            </Avatar>
            <Typography variant="subtitle2" fontWeight={600}>
              {data.name}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>{data.count}</strong> pólizas
          </Typography>
          <Typography variant="body2">
            <strong>{data.percentage.toFixed(1)}%</strong> del total
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Render legend
  const renderLegend = () => {
    return (
      <Stack 
        spacing={1.5} 
        sx={{ 
          width: '100%', 
          height: '100%',
            display: 'flex',
          flexDirection: 'column'
          }}
        >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Distribución por tipo
        </Typography>
        
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <AnimatePresence>
            {chartData.map((entry, index) => (
              <motion.div
                key={`legend-${entry.id}`}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={legendItemVariants}
                whileHover="hover"
                onMouseEnter={() => setHoveredType(entry.id)}
                onMouseLeave={() => setHoveredType(null)}
              >
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  spacing={1.5}
          sx={{ 
                    p: 1.2,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    bgcolor: hoveredType === entry.id 
                      ? alpha(entry.color, theme.palette.mode === 'dark' ? 0.15 : 0.1) 
                      : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(entry.color, theme.palette.mode === 'dark' ? 0.15 : 0.1),
                    }
          }}
        >
                  <Avatar
          sx={{ 
                      width: 36,
                      height: 36,
                      bgcolor: entry.color,
                      color: '#fff'
          }}
        >
                    {entry.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {entry.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {entry.count} pólizas
                    </Typography>
        </Box>
                  <Typography 
                    variant="body2" 
                    fontWeight={700}
                    sx={{ 
                      color: entry.color,
                      minWidth: 45,
                      textAlign: 'right'
                    }}
                  >
                    {entry.percentage.toFixed(1)}%
                  </Typography>
                </Stack>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
        
        {chartData.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Box 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.5)
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Aún no has registrado pólizas. Empieza a registrar para ver la distribución.
              </Typography>
            </Box>
          </motion.div>
        )}
      </Stack>
  );
};

  // Render chart based on selected type
  const renderChart = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
          <Stack spacing={2} alignItems="center">
            <Skeleton variant="circular" width={80} height={80} />
            <Typography variant="body2" color="text.secondary">
              Cargando datos...
            </Typography>
          </Stack>
        </Box>
      );
    }

    if (chartData.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
          <Typography variant="body2" color="text.secondary">
            Sin datos disponibles
          </Typography>
        </Box>
      );
    }

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  opacity={hoveredType === null || hoveredType === entry.id ? 1 : 0.5}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={chartType === 'donut' ? 60 : 0}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            animationDuration={1000}
            animationBegin={200}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke={theme.palette.background.paper}
                strokeWidth={2}
                opacity={hoveredType === null || hoveredType === entry.id ? 1 : 0.5}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {chartData.length > 0 && chartType === 'donut' && (
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={theme.palette.text.primary}
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                fontFamily: 'Sora'
              }}
            >
              {formatNumber(policies.length)}
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card
      component={motion.div}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      ref={chartRef}
      sx={{
        height: '100%',
        borderRadius: 4,
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        boxShadow: theme.palette.mode === 'dark' 
          ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`
          : `0 8px 32px ${alpha('#000', 0.05)}`,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" fontFamily="Sora" fontWeight={600}>
              Pólizas por tipo
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
        action={
          <Box>
            <MuiTooltip title="Opciones">
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
            </MuiTooltip>
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
              <MenuItem onClick={() => handleChartTypeChange('pie')}>
                <ListItemIcon>
                  <PieChartIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Gráfico circular</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleChartTypeChange('donut')}>
                <ListItemIcon>
                  <DonutLarge fontSize="small" />
                </ListItemIcon>
                <ListItemText>Gráfico anillo</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleChartTypeChange('bar')}>
                <ListItemIcon>
                  <BarChartIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Gráfico barras</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleRefresh}>
                <ListItemIcon>
                  <Refresh fontSize="small" />
                </ListItemIcon>
                <ListItemText>Actualizar datos</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleExportChart}>
                <ListItemIcon>
                  <DownloadIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Exportar como imagen</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        }
      />
      <CardContent 
        sx={{ 
          p: { xs: 2, md: 3 },
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            width: { xs: '100%', md: '50%' }, 
            height: { xs: 220, md: '100%' },
            minHeight: { xs: 220, md: 280 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {renderChart()}
        </Box>
        <Box 
          sx={{ 
            width: { xs: '100%', md: '50%' },
            height: { xs: 'auto', md: '100%' },
            display: 'flex'
          }}
        >
          {renderLegend()}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PolicyDistributionChart;