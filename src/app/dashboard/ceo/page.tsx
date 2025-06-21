'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Paper,
  Fade,
  Chip,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Dashboard,
  LocalHospital,
  AccountBalance,
  TrendingUp,
  Psychology,
  Business,
  Download,
  Refresh,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import AdminRoute from '@/components/auth/AdminRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCEOMetrics } from '@/hooks/useCEOMetrics';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Import tab components
import ResumenTab from '@/components/ceo/tabs/ResumenTab';
import ClinicaOperativaTab from '@/components/ceo/tabs/ClinicaOperativaTab';
import FinanzasAdministracionTab from '@/components/ceo/tabs/FinanzasAdministracionTab';

// CEO Brand Colors - Exact as specified
const ceoBrandColors = {
  primary: '#5D4FB0',         // púrpura profesional
  secondary: '#A593F3',       // lavanda claro
  accentBlue: '#A5CAE6',      // azul suave
  accentPink: '#D97DB7',      // rosa emocional
  background: '#F2EDEA',      // fondo claro suave
  text: '#2E2E2E',            // gris oscuro elegante
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ceo-tabpanel-${index}`}
      aria-labelledby={`ceo-tab-${index}`}
    >
      {value === index && (
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Box sx={{ py: 4 }}>
              {children}
            </Box>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function CEODashboardContent() {
  const { user } = useAuth();
  const theme = useTheme();
  const ceoMetrics = useCEOMetrics();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      local: format(now, "EEEE, dd 'de' MMMM 'de' yyyy - HH:mm", { locale: es }),
      utc: format(now, "HH:mm 'UTC'")
    };
  };

  const { local, utc } = getCurrentDateTime();

  const tabs = [
    {
      label: 'Resumen Ejecutivo',
      icon: <Dashboard />,
      color: ceoBrandColors.primary,
      description: 'Vista ejecutiva general y KPIs'
    },
    {
      label: 'Clínica & Operativa',
      icon: <LocalHospital />,
      color: ceoBrandColors.accentBlue,
      description: 'Salud operacional y clínica'
    },
    {
      label: 'Finanzas & Administración',
      icon: <AccountBalance />,
      color: ceoBrandColors.accentPink,
      description: 'Métricas financieras y compliance'
    }
  ];

  const handleRefreshData = () => {
    // Trigger data refresh
    window.location.reload();
  };

  const handleExportReport = () => {
    // Export functionality
    console.log('Exporting CEO report...');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0F0F1A 0%, #1A1B2E 100%)'
          : 'linear-gradient(135deg, #F2EDEA 0%, #F8F6F4 100%)',
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      {/* Header / Topbar */}
      <Paper 
        elevation={0}
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'rgba(26, 27, 46, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ py: 4 }}>
            {/* Top Row - Logo, Title, Date, Actions */}
            <Grid container spacing={3} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <Grid item>
                <Box display="flex" alignItems="center" gap={3}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 4,
                      background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: '0 8px 32px rgba(93, 79, 176, 0.3)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        right: -2,
                        bottom: -2,
                        background: 'linear-gradient(135deg, #5D4FB0, #A593F3, #A5CAE6)',
                        borderRadius: 5,
                        zIndex: -1,
                        opacity: 0.3,
                      },
                    }}
                  >
                    <Business sx={{ fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 800,
                        background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 1.2,
                        mb: 0.5,
                      }}
                    >
                      Panel Ejecutivo
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        color: 'text.secondary',
                      }}
                    >
                      Centro Psicológico Digital • Dashboard CEO
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item>
                <Box display="flex" alignItems="center" gap={3}>
                  {/* Date & Time */}
                  <Box textAlign="right">
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 600,
                        color: 'text.primary',
                      }}
                    >
                      {local}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        color: 'text.secondary',
                      }}
                    >
                      {utc}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Box display="flex" alignItems="center" gap={2}>
                    <Tooltip title="Actualizar datos">
                      <IconButton
                        onClick={handleRefreshData}
                        sx={{
                          background: alpha(ceoBrandColors.primary, 0.1),
                          '&:hover': {
                            background: alpha(ceoBrandColors.primary, 0.2),
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Refresh sx={{ color: ceoBrandColors.primary }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Exportar reporte">
                      <IconButton
                        onClick={handleExportReport}
                        sx={{
                          background: alpha(ceoBrandColors.accentBlue, 0.1),
                          '&:hover': {
                            background: alpha(ceoBrandColors.accentBlue, 0.2),
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Download sx={{ color: ceoBrandColors.accentBlue }} />
                      </IconButton>
                    </Tooltip>
                    
                    <Chip
                      label={`CEO: ${user?.displayName?.split(' ')[0] || 'Admin'}`}
                      sx={{
                        background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                        color: 'white',
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        height: 36,
                        '& .MuiChip-label': {
                          px: 2,
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Tabs Navigation */}
            <Box sx={{ borderBottom: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}` }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTabs-indicator': {
                    background: `linear-gradient(90deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                    height: 4,
                    borderRadius: '4px 4px 0 0',
                  },
                }}
              >
                {tabs.map((tab, index) => (
                  <Tab
                    key={index}
                    icon={tab.icon}
                    iconPosition="start"
                    label={
                      <Box>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 700,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                          }}
                        >
                          {tab.label}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 500,
                            opacity: 0.8,
                            display: 'block',
                            fontSize: '0.75rem',
                          }}
                        >
                          {tab.description}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      minHeight: 88,
                      textTransform: 'none',
                      color: 'text.secondary',
                      '&.Mui-selected': {
                        color: ceoBrandColors.primary,
                      },
                      '&:hover': {
                        background: alpha(ceoBrandColors.primary, 0.05),
                      },
                      px: 4,
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Tab Content */}
      <Container maxWidth="xl">
        <TabPanel value={activeTab} index={0}>
          <ResumenTab ceoMetrics={ceoMetrics} />
        </TabPanel>
        
        <TabPanel value={activeTab} index={1}>
          <ClinicaOperativaTab ceoMetrics={ceoMetrics} />
        </TabPanel>
        
        <TabPanel value={activeTab} index={2}>
          <FinanzasAdministracionTab ceoMetrics={ceoMetrics} />
        </TabPanel>
      </Container>
    </Box>
  );
}

export default function CEODashboardPage() {
  return (
    <AdminRoute fallbackPath="/dashboard">
      <DashboardLayout>
        <CEODashboardContent />
      </DashboardLayout>
    </AdminRoute>
  );
}