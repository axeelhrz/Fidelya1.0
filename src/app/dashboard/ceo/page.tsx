'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  useTheme,
  Paper,
  Grid,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  LocalHospital,
  AccountBalance,
} from '@mui/icons-material';
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

// Minimalist color palette
const colors = {
  primary: '#2563eb',      // Clean blue
  secondary: '#64748b',    // Neutral gray
  success: '#059669',      // Clean green
  warning: '#d97706',      // Clean orange
  error: '#dc2626',        // Clean red
  background: '#f8fafc',   // Very light gray
  surface: '#ffffff',      // Pure white
  text: '#1e293b',         // Dark gray
  textSecondary: '#64748b', // Medium gray
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
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
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
    return format(now, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es });
  };

  const tabs = [
    {
      label: 'Resumen',
      icon: <Dashboard sx={{ fontSize: 20 }} />,
    },
    {
      label: 'Clínica',
      icon: <LocalHospital sx={{ fontSize: 20 }} />,
    },
    {
      label: 'Finanzas',
      icon: <AccountBalance sx={{ fontSize: 20 }} />,
    }
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        backgroundColor: colors.background,
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {/* Clean Header */}
      <Paper 
        elevation={0}
        sx={{
          backgroundColor: colors.surface,
          borderBottom: `1px solid #e2e8f0`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ py: 3 }}>
            {/* Header Row */}
            <Grid container spacing={3} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <Grid item>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 700,
                    color: colors.text,
                    mb: 0.5,
                  }}
                >
                  Dashboard CEO
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
                  }}
                >
                  Centro Psicológico Digital
                </Typography>
              </Grid>

              <Grid item>
                <Box textAlign="right">
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 600,
                      color: colors.text,
                    }}
                  >
                    {getCurrentDateTime()}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 400,
                      color: colors.textSecondary,
                    }}
                  >
                    CEO: {user?.displayName?.split(' ')[0] || 'Admin'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* Clean Tabs Navigation */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: colors.primary,
                  height: 2,
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: colors.textSecondary,
                  minHeight: 48,
                  '&.Mui-selected': {
                    color: colors.primary,
                  },
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.icon}
                  iconPosition="start"
                  label={tab.label}
                  sx={{
                    px: 3,
                  }}
                />
              ))}
            </Tabs>
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