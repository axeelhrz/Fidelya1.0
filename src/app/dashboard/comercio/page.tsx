'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Stack,
  Paper,
  Divider,
  IconButton,
  alpha,
  useTheme,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Store,
  TrendingUp,
  QrCode,
  Receipt,
  BarChart,
  Settings,
  Notifications,
  LocalOffer,
  People,
  AttachMoney,
  CheckCircle,
  Warning,
  Refresh,
  Download,
  Share,
} from '@mui/icons-material';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { ComercioProfile } from '@/components/comercio/ComercioProfile';
import { BeneficiosManagement } from '@/components/comercio/BeneficiosManagement';
import { QRManagement } from '@/components/comercio/QRManagement';
import { ValidacionesHistory } from '@/components/comercio/ValidacionesHistory';
import { ComercioStats } from '@/components/comercio/ComercioStats';
import { ComercioNotifications } from '@/components/comercio/ComercioNotifications';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`comercio-tabpanel-${index}`}
      aria-labelledby={`comercio-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ComercioDashboard() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const { comercio, loading: comercioLoading } = useComercios();
  const { beneficios, activeBeneficios } = useBeneficios();
  const { validaciones, getStats } = useValidaciones();

  const [stats, setStats] = useState({
    totalValidaciones: 0,
    validacionesHoy: 0,
    validacionesMes: 0,
    beneficiosActivos: 0,
    tasaConversion: 0,
  });

  useEffect(() => {
    const validacionStats = getStats();
    setStats({
      totalValidaciones: validacionStats.totalValidaciones,
      validacionesHoy: validaciones.filter(v => {
        const today = new Date();
        const validacionDate = v.fechaHora.toDate();
        return validacionDate.toDateString() === today.toDateString();
      }).length,
      validacionesMes: validaciones.filter(v => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return v.fechaHora.toDate() >= startOfMonth;
      }).length,
      beneficiosActivos: activeBeneficios.length,
      tasaConversion: validacionStats.totalValidaciones > 0 
        ? (validacionStats.validacionesExitosas / validacionStats.totalValidaciones) * 100 
        : 0,
    });
  }, [validaciones, activeBeneficios, getStats]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { label: 'Resumen', icon: <BarChart />, component: ComercioStats },
    { label: 'Perfil', icon: <Store />, component: ComercioProfile },
    { label: 'Beneficios', icon: <LocalOffer />, component: BeneficiosManagement },
    { label: 'QR Validación', icon: <QrCode />, component: QRManagement },
    { label: 'Validaciones', icon: <Receipt />, component: ValidacionesHistory },
    { label: 'Notificaciones', icon: <Notifications />, component: ComercioNotifications },
  ];

  if (comercioLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#fafbfc'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Avatar sx={{ width: 60, height: 60, bgcolor: '#06b6d4' }}>
            <Store sx={{ fontSize: 30 }} />
          </Avatar>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#fafbfc',
      background: 'linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%)',
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              color: 'white',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background Pattern */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                opacity: 0.1,
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar
                      src={comercio?.logoUrl}
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: alpha('#ffffff', 0.2),
                        border: '3px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      <Store sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
                        {comercio?.nombreComercio || 'Mi Comercio'}
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                        {comercio?.categoria || 'Categoría no definida'}
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Chip
                          label={comercio?.estado === 'activo' ? 'Activo' : 'Inactivo'}
                          color={comercio?.estado === 'activo' ? 'success' : 'warning'}
                          sx={{ 
                            bgcolor: comercio?.estado === 'activo' ? '#10b981' : '#f59e0b',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                        <Chip
                          label={`${comercio?.asociacionesVinculadas?.length || 0} Asociaciones`}
                          sx={{ 
                            bgcolor: alpha('#ffffff', 0.2),
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={2}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h3" sx={{ fontWeight: 900 }}>
                        {stats.validacionesHoy}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Validaciones hoy
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stats.beneficiosActivos}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Beneficios activos
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              {
                title: 'Total Validaciones',
                value: stats.totalValidaciones,
                icon: <Receipt />,
                color: '#06b6d4',
                change: '+12%'
              },
              {
                title: 'Validaciones del Mes',
                value: stats.validacionesMes,
                icon: <TrendingUp />,
                color: '#10b981',
                change: '+8%'
              },
              {
                title: 'Tasa de Conversión',
                value: `${stats.tasaConversion.toFixed(1)}%`,
                icon: <CheckCircle />,
                color: '#8b5cf6',
                change: '+5%'
              },
              {
                title: 'Beneficios Activos',
                value: stats.beneficiosActivos,
                icon: <LocalOffer />,
                color: '#f59e0b',
                change: '0%'
              },
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      background: 'white',
                      border: '1px solid #f1f5f9',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        borderColor: stat.color,
                      }
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: alpha(stat.color, 0.1),
                          color: stat.color,
                          width: 56,
                          height: 56,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                          {stat.title}
                        </Typography>
                        <Chip
                          label={stat.change}
                          size="small"
                          sx={{
                            bgcolor: stat.change.startsWith('+') ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
                            color: stat.change.startsWith('+') ? '#10b981' : '#ef4444',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                    </Stack>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              mb: 3,
              background: 'white',
              border: '1px solid #f1f5f9',
              borderRadius: 3,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 72,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#64748b',
                  '&.Mui-selected': {
                    color: '#06b6d4',
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#06b6d4',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                  sx={{
                    '& .MuiTab-iconWrapper': {
                      marginRight: 1,
                      marginBottom: 0,
                    }
                  }}
                />
              ))}
            </Tabs>
          </Paper>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tabs.map((tab, index) => (
            <TabPanel key={index} value={activeTab} index={index}>
              <tab.component />
            </TabPanel>
          ))}
        </motion.div>
      </Container>
    </Box>
  );
}