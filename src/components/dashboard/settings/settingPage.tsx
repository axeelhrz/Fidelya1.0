'use client';

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, useTheme, Paper, Container, alpha, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Bell, 
  Shield, 
  User, 
  CreditCard, 
  Robot, 
  Gear,
  Trash
} from 'phosphor-react';

import AppearanceTab from '@/components/dashboard/settings/appearanceTab';
import NotificationsTab from '@/components/dashboard/settings/notificationsTab';
import SecurityTab from '@/components/dashboard/settings/securityTab';
import ProfileTab from '@/components/dashboard/settings/profileTab';
import PlanTab from '@/components/dashboard/settings/planTab';
import AISettingTab from '@/components/dashboard/settings/aiSettingTab';
import GeneralPreferencesTab from '@/components/dashboard/settings/generalPreferencesTab';
import DeleteAccountTab from '@/components/dashboard/settings/deleteAccounTab';
import { useProfile } from '@/hooks/use-profile';
import { useAuth } from '@/hooks/use-auth';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      <AnimatePresence mode="wait">
        {value === index && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Box sx={{ pt: 3 }}>{children}</Box>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

export default function SettingsPage() {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const { loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  
  const isLoading = authLoading || profileLoading;

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ 
          py: 4, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '50vh'
        }}>
          <CircularProgress size={40} />
          <Typography variant="h6" sx={{ mt: 2, fontFamily: 'Sora' }}>
            Cargando configuración...
          </Typography>
        </Box>
      </Container>
    );
  }
  
  // Check if profile has a plan with Enterprise name
  const isEnterprise = profile?.plan?.name === 'Enterprise';
  
  return (
    <Container maxWidth="lg">
      <Box 
        sx={{ 
          py: 4,
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0)} 0%, ${alpha(theme.palette.background.default, 0.4)} 100%)`
            : `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0)} 0%, ${alpha(theme.palette.background.default, 0.2)} 100%)`,
          borderRadius: '24px',
          minHeight: 'calc(100vh - 200px)'
        }}
      >
        <Typography variant="h4" 
          sx={{ 
            mb: 4, 
            fontFamily: 'Sora', 
            fontWeight: 600,
            color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Configuración
          </motion.div>
        </Typography>

        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: '16px', 
            overflow: 'hidden',
            boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(255,255,255,0.03)' 
              : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              aria-label="configuración de usuario"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                  height: 3,
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontFamily: 'Sora',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  minHeight: 64,
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  },
                },
              }}
            >
              <Tab 
                icon={<User weight="duotone" size={20} />} 
                iconPosition="start" 
                label="Perfil" 
                {...a11yProps(0)} 
              />
              <Tab 
                icon={<Palette weight="duotone" size={20} />} 
                iconPosition="start" 
                label="Apariencia" 
                {...a11yProps(1)} 
              />
              <Tab 
                icon={<Bell weight="duotone" size={20} />} 
                iconPosition="start" 
                label="Notificaciones" 
                {...a11yProps(2)} 
              />
              <Tab 
                icon={<Shield weight="duotone" size={20} />} 
                iconPosition="start" 
                label="Seguridad" 
                {...a11yProps(3)} 
              />
              <Tab 
                icon={<Gear weight="duotone" size={20} />} 
                iconPosition="start" 
                label="Preferencias" 
                {...a11yProps(4)} 
              />
              <Tab 
                icon={<CreditCard weight="duotone" size={20} />} 
                iconPosition="start" 
                label="Plan" 
                {...a11yProps(5)} 
              />
              <Tab 
                icon={<Robot weight="duotone" size={20} />} 
                iconPosition="start" 
                label="IA" 
                {...a11yProps(6)} 
                disabled={!isEnterprise}
              />
              <Tab 
                icon={<Trash weight="duotone" size={20} color={theme.palette.error.main} />} 
                iconPosition="start" 
                label="Eliminar cuenta" 
                {...a11yProps(7)} 
                sx={{ 
                  color: theme.palette.error.main,
                  '&.Mui-selected': {
                    color: theme.palette.error.main,
                  }
                }}
              />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 3 }}>
            <TabPanel value={value} index={0}>
              <ProfileTab />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <AppearanceTab />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <NotificationsTab />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <SecurityTab />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <GeneralPreferencesTab />
            </TabPanel>
            <TabPanel value={value} index={5}>
              <PlanTab />
            </TabPanel>
            <TabPanel value={value} index={6}>
              <AISettingTab />
            </TabPanel>
            <TabPanel value={value} index={7}>
              <DeleteAccountTab />
            </TabPanel>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
