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
  CardHeader,
  Button,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Alert,
  Divider,
  Stack,
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
  Campaign,
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
  MoreVert,
  Close,
  Menu,
  Email,
  Sms,
  NotificationsActive,
  PhoneAndroid,
  PlayArrow,
  Pause,
  Stop
} from '@mui/icons-material';
import { useEnhancedNotifications } from '../../hooks/useEnhancedNotifications';
import { NotificationDashboard } from '../notifications/NotificationDashboard';
import { NotificationTemplates } from '../notifications/NotificationTemplates';
import NotificationEditor from '../notifications/NotificationEditor';
import NotificationAutomation from '../notifications/NotificationAutomation';
import DeliveryStats from '../notifications/DeliveryStats';
import EnhancedNotificationSettings from '../settings/EnhancedNotificationSettings';

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

export default function NotificationsCenter() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    templates,
    campaigns,
    queueStats,
    loadingTemplates,
    loadingCampaigns,
    loadingMetrics,
    error,
    success,
    clearMessages,
    refresh,
    sendTestNotification,
    pauseQueue,
    resumeQueue,
    clearQueue
  } = useEnhancedNotifications();

  const [activeTab, setActiveTab] = useState(0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [quickStatsExpanded, setQuickStatsExpanded] = useState(true);

  // Tabs configuration
  const tabs = [
    { 
      label: 'Dashboard', 
      icon: <Dashboard />, 
      component: NotificationDashboard,
      badge: null
    },
    { 
      label: 'Plantillas', 
      icon: <Email />, 
      component: NotificationTemplates,
      badge: templates.length
    },
    { 
      label: 'Editor', 
      icon: <Edit />, 
      component: NotificationEditor,
      badge: null
    },
    { 
      label: 'Campañas', 
      icon: <Campaign />, 
      component: () => <CampaignsView />,
      badge: campaigns.filter(c => c.status === 'scheduled').length
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
      component: EnhancedNotificationSettings,
      badge: null
    }
  ];

  // Quick actions for speed dial
  const quickActions: QuickAction[] = [
    {
      label: 'Nueva Plantilla',
      icon: <Email />,
      color: '#1976d2',
      action: () => setActiveTab(2) // Editor tab
    },
    {
      label: 'Nueva Campaña',
      icon: <Campaign />,
      color: '#388e3c',
      action: () => setActiveTab(3) // Campaigns tab
    },
    {
      label: 'Enviar Prueba',
      icon: <Send />,
      color: '#f57c00',
      action: () => handleQuickTest()
    },
    {
      label: 'Ver Analytics',
      icon: <Analytics />,
      color: '#7b1fa2',
      action: () => setActiveTab(5) // Analytics tab
    }
  ];

  const handleQuickTest = async () => {
    try {
      if (templates.length > 0) {
        await sendTestNotification(templates[0].id, 'test@example.com', 'email');
      }
    } catch (err) {
      console.error('Error sending quick test:', err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const getSystemHealthStatus = () => {
    if (!queueStats) return { status: 'unknown', color: '#9e9e9e', label: 'Desconocido' };
    
    const failed = typeof queueStats.failed === 'number' ? queueStats.failed : 0;
    const errorRate = failed / (typeof queueStats.processed === 'number' ? queueStats.processed : 1);
    
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
                    {templates.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Plantillas
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {campaigns.filter(c => c.status === 'sent').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Campañas Enviadas
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {campaigns.filter(c => c.status === 'scheduled').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Programadas
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {`${queueStats?.pending ?? 0}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    En Cola
                  </Typography>
                </Box>
              </Box>

              {queueStats && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">
                      Procesamiento de Cola
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        onClick={queueStats.isProcessing ? pauseQueue : resumeQueue}
                        color={queueStats.isProcessing ? 'warning' : 'success'}
                      >
                        {queueStats.isProcessing ? <Pause /> : <PlayArrow />}
                      </IconButton>
                      <IconButton size="small" onClick={clearQueue} color="error">
                        <Stop />
                      </IconButton>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={
                      (typeof queueStats.processed === 'number' ? queueStats.processed : 0) / 
                      (typeof queueStats.total === 'number' && queueStats.total > 0 ? queueStats.total : 1) * 100
                    }
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {(typeof queueStats?.processed === 'number' ? queueStats.processed : 0)} / {(typeof queueStats?.total === 'number' ? queueStats.total : 0)} procesadas
                  </Typography>
                </Box>
              )}
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

  // Campaigns view component
  const CampaignsView = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Campañas de Notificaciones
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona y monitorea tus campañas de notificaciones
        </Typography>
      </Box>

      {loadingCampaigns ? (
        <LinearProgress />
      ) : (
        <Box sx={{ display: 'grid', gap: 3 }}>
          {campaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card>
                <CardHeader
                  avatar={
                    <Avatar sx={{ 
                      backgroundColor: campaign.status === 'sent' ? '#4caf50' : 
                                     campaign.status === 'scheduled' ? '#ff9800' : 
                                     campaign.status === 'sending' ? '#2196f3' : '#9e9e9e'
                    }}>
                      {campaign.status === 'sent' ? <CheckCircle /> :
                       campaign.status === 'scheduled' ? <Schedule /> :
                       campaign.status === 'sending' ? <Send /> : <Campaign />}
                    </Avatar>
                  }
                  title={campaign.name}
                  subheader={campaign.description}
                  action={
                    <Stack direction="row" spacing={1}>
                      <Chip
                        size="small"
                        label={campaign.status}
                        color={
                          campaign.status === 'sent' ? 'success' :
                          campaign.status === 'scheduled' ? 'warning' :
                          campaign.status === 'sending' ? 'info' : 'default'
                        }
                      />
                      <IconButton>
                        <MoreVert />
                      </IconButton>
                    </Stack>
                  }
                />
                <CardContent>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
                    gap: 2, 
                    mb: 2 
                  }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Destinatarios
                      </Typography>
                      <Typography variant="h6">
                        {campaign.stats.totalRecipients.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Enviados
                      </Typography>
                      <Typography variant="h6">
                        {campaign.stats.sent.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Entregados
                      </Typography>
                      <Typography variant="h6">
                        {campaign.stats.delivered.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Abiertos
                      </Typography>
                      <Typography variant="h6">
                        {campaign.stats.opened.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={1}>
                      {campaign.channels.map((channel) => (
                        <Chip
                          key={channel}
                          size="small"
                          variant="outlined"
                          icon={
                            channel === 'email' ? <Email /> :
                            channel === 'sms' ? <Sms /> :
                            channel === 'push' ? <NotificationsActive /> :
                            <PhoneAndroid />
                          }
                          label={channel.toUpperCase()}
                        />
                      ))}
                    </Stack>
                    
                    <Typography variant="body2" color="text.secondary">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      )}
    </Container>
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
                disabled={loadingTemplates || loadingCampaigns || loadingMetrics}
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
              <Alert severity="error" sx={{ mb: 3 }} onClose={clearMessages}>
                {error}
              </Alert>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert severity="success" sx={{ mb: 3 }} onClose={clearMessages}>
                {success}
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
          onClick={() => setActiveTab(2)} // Go to editor
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
}