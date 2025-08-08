'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Alert,
  Divider,
  Chip,
  Avatar,
  LinearProgress,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton
} from '@mui/material';
import {
  Dashboard,
  Analytics,
  Settings,
  AutoMode,
  Send,
  Schedule,
  CheckCircle,
  Info,
  Add,
  Edit,
  Refresh,
  Close,
  Menu,
  Email,
  NotificationsActive,
} from '@mui/icons-material';
import { useSimpleNotifications } from '../../hooks/useSimpleNotifications';
import { NotificationTemplates } from '../notifications/NotificationTemplates';
import NotificationAutomation from '../notifications/NotificationAutomation';
import DeliveryStats from '../notifications/DeliveryStats';
import { SimpleNotificationSettingsComponent } from '../settings/SimpleNotificationSettings';
import { SimpleNotificationSender } from '../notifications/SimpleNotificationSender';
import { SimpleNotificationHistory } from '../notifications/SimpleNotificationHistory';

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
      id={`notifications-tabpanel-${index}`}
      aria-labelledby={`notifications-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

// Simple Dashboard Component
const SimpleDashboard = () => {
  const { notifications, loading } = useSimpleNotifications();

  // Calculate stats from notifications array
  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    pending: notifications.filter(n => n.status === 'sending').length,
    failed: notifications.filter(n => n.status === 'failed').length,
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard de Notificaciones
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Resumen general del sistema de notificaciones
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4 
      }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <NotificationsActive />
              </Avatar>
              <Box>
                <Typography variant="h4">{stats.total}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Notificaciones
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <CheckCircle />
              </Avatar>
              <Box>
                <Typography variant="h4">{stats.sent}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Enviadas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'info.main' }}>
                <Schedule />
              </Avatar>
              <Box>
                <Typography variant="h4">{stats.pending}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pendientes
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.main' }}>
                <Info />
              </Avatar>
              <Box>
                <Typography variant="h4">{stats.failed}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Fallidas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Notifications */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notificaciones Recientes
        </Typography>
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {notifications.slice(0, 10).map((notification) => (
            <Box
              key={notification.id}
              sx={{
                p: 2,
                borderBottom: '1px solid #f0f0f0',
                '&:last-child': { borderBottom: 'none' }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2">{notification.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={notification.status}
                  color={
                    notification.status === 'sent' ? 'success' :
                    notification.status === 'sending' ? 'warning' :
                    notification.status === 'failed' ? 'error' : 'default'
                  }
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default function NotificationsCenter() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    notifications,
    loading,
    error,
    refresh // Use the correct function name from the hook
  } = useSimpleNotifications();

  // Calculate stats from notifications array
  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    pending: notifications.filter(n => n.status === 'sending').length,
    failed: notifications.filter(n => n.status === 'failed').length,
  };

  const [activeTab, setActiveTab] = useState(0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [quickStatsExpanded, setQuickStatsExpanded] = useState(true);

  // Tabs configuration
  const tabs = [
    { 
      label: 'Dashboard', 
      icon: <Dashboard />, 
      component: SimpleDashboard,
      badge: null
    },
    { 
      label: 'Enviar', 
      icon: <Send />, 
      component: SimpleNotificationSender,
      badge: null
    },
    { 
      label: 'Historial', 
      icon: <Email />, 
      component: SimpleNotificationHistory,
      badge: notifications.filter(n => n.status === 'sending').length
    },
    { 
      label: 'Plantillas', 
      icon: <Edit />, 
      component: NotificationTemplates,
      badge: null
    },
    { 
      label: 'Automatización', 
      icon: <AutoMode />, 
      component: NotificationAutomation,
      badge: null
    },
    { 
      label: 'Estadísticas', 
      icon: <Analytics />, 
      component: DeliveryStats,
      badge: null
    },
    { 
      label: 'Configuración', 
      icon: <Settings />, 
      component: SimpleNotificationSettingsComponent,
      badge: null
    }
  ];

  // Quick actions for speed dial
  const quickActions: QuickAction[] = [
    {
      label: 'Enviar Notificación',
      icon: <Send />,
      color: '#1976d2',
      action: () => setActiveTab(1) // Sender tab
    },
    {
      label: 'Ver Historial',
      icon: <Email />,
      color: '#388e3c',
      action: () => setActiveTab(2) // History tab
    },
    {
      label: 'Ver Estadísticas',
      icon: <Analytics />,
      color: '#7b1fa2',
      action: () => setActiveTab(5) // Analytics tab
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const getSystemHealthStatus = () => {
    const errorRate = stats.failed / (stats.total || 1);
    
    if (errorRate < 0.01) return { status: 'healthy', color: '#4caf50', label: 'Saludable' };
    if (errorRate < 0.05) return { status: 'warning', color: '#ff9800', label: 'Advertencia' };
    return { status: 'error', color: '#f44336', label: 'Error' };
  };

  const systemHealth = getSystemHealthStatus();

  // Quick stats component
  const QuickStats = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Estado del Sistema</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              size="small"
              label={systemHealth.label}
              sx={{ 
                backgroundColor: systemHealth.color,
                color: 'white',
                fontWeight: 'bold'
              }}
            />
            <IconButton size="small" onClick={() => setQuickStatsExpanded(!quickStatsExpanded)}>
              {quickStatsExpanded ? <Close /> : <Info />}
            </IconButton>
          </Box>
        </Box>

        <AnimatePresence>
          {quickStatsExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
                gap: 2 
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {stats.sent}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enviadas
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {stats.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pendientes
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {stats.failed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fallidas
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>
    </motion.div>
  );

  // Mobile navigation drawer
  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      PaperProps={{
        sx: { width: 280 }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Centro de Notificaciones
        </Typography>
        <Divider />
      </Box>
      
      <List>
        {tabs.map((tab, index) => (
          <ListItemButton
            key={index}
            selected={activeTab === index}
            onClick={(event) => handleTabChange(event, index)}
          >
            <ListItemIcon>
              <Badge badgeContent={tab.badge} color="primary">
                {tab.icon}
              </Badge>
            </ListItemIcon>
            <ListItemText primary={tab.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Mobile Header */}
      {isMobile && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton onClick={() => setMobileDrawerOpen(true)}>
              <Menu />
            </IconButton>
            <Typography variant="h6">
              {tabs[activeTab].label}
            </Typography>
            <IconButton onClick={refresh}>
              <Refresh />
            </IconButton>
          </Box>
        </Paper>
      )}

      {/* Desktop Navigation */}
      {!isMobile && (
        <Paper sx={{ mb: 3 }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
              <Typography variant="h5" component="h1">
                Centro de Notificaciones
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={refresh}
                disabled={loading}
              >
                Actualizar
              </Button>
            </Box>
            
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={
                    <Badge badgeContent={tab.badge} color="primary">
                      {tab.icon}
                    </Badge>
                  }
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Container>
        </Paper>
      )}

      {/* Alerts */}
      <Container maxWidth="xl">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Stats */}
        {activeTab === 0 && <QuickStats />}
      </Container>

      {/* Tab Content */}
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
          <tab.component />
        </TabPanel>
      ))}

      {/* Mobile Drawer */}
      <MobileDrawer />

      {/* Speed Dial for Quick Actions */}
      {!isMobile && (
        <SpeedDial
          ariaLabel="Acciones rápidas"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          icon={<SpeedDialIcon />}
          open={speedDialOpen}
          onOpen={() => setSpeedDialOpen(true)}
          onClose={() => setSpeedDialOpen(false)}
        >
          {quickActions.map((action) => (
            <SpeedDialAction
              key={action.label}
              icon={action.icon}
              tooltipTitle={action.label}
              onClick={() => {
                action.action();
                setSpeedDialOpen(false);
              }}
              sx={{ 
                '& .MuiSpeedDialAction-fab': {
                  backgroundColor: action.color,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: action.color,
                    filter: 'brightness(0.9)'
                  }
                }
              }}
            />
          ))}
        </SpeedDial>
      )}

      {/* Mobile FAB */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => setActiveTab(1)} // Go to sender
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
}