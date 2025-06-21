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
        background: ceoBrandColors.background,
        fontFamily: '"Neris", sans-serif',
      }}
    >
      {/* Header / Topbar */}
      <Paper 
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ py: 3 }}>
            {/* Top Row - Logo, Title, Date, Actions */}
            <Grid container spacing={3} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Grid item>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <Business sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600,
                        color: ceoBrandColors.text,
                        lineHeight: 1.2,
                      }}
                    >
                      Panel Ejecutivo
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 300,
                        color: alpha(ceoBrandColors.text, 0.7),
                      }}
                    >
                      Centro Psicológico Digital
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
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600,
                        color: ceoBrandColors.text,
                      }}
                    >
                      {local}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 300,
                        color: alpha(ceoBrandColors.text, 0.6),
                      }}
                    >
                      {utc}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <Tooltip title="Actualizar datos">
                      <IconButton
                        onClick={handleRefreshData}
                        sx={{
                          background: alpha(ceoBrandColors.primary, 0.1),
                          '&:hover': {
                            background: alpha(ceoBrandColors.primary, 0.2),
                          },
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
                          },
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
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600,
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
                    height: 3,
                    borderRadius: '3px 3px 0 0',
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
                            fontFamily: '"Neris", sans-serif',
                            fontWeight: 600,
                            textTransform: 'none',
                          }}
                        >
                          {tab.label}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontFamily: '"Neris", sans-serif',
                            fontWeight: 300,
                            opacity: 0.7,
                            display: 'block',
                          }}
                        >
                          {tab.description}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      minHeight: 80,
                      textTransform: 'none',
                      color: alpha(ceoBrandColors.text, 0.7),
                      '&.Mui-selected': {
                        color: ceoBrandColors.primary,
                      },
                      '&:hover': {
                        background: alpha(ceoBrandColors.primary, 0.05),
                      },
                      px: 4,
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
      <CEODashboardContent />
    </AdminRoute>
  );
}