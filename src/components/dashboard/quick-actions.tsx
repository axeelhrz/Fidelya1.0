'use client';

import { useState } from 'react';
import { 
  Box, 
  Button, 
  Stack, 
  Tooltip, 
  useTheme, 
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Person, 
  Policy, 
  Assignment, 
  Analytics, 
  Event,
  Calculate,
  Close as CloseIcon,
  Settings as SettingsIcon,
  Chat as ChatIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useSubscription } from '@/hooks/use-subscription';
import ROICalculator from '../calculators/ROICalculator';

const QuickActions = () => {
  const theme = useTheme();
  const { subscription } = useSubscription();
  const [openROICalculator, setOpenROICalculator] = useState(false);
  const [openMeetingScheduler, setOpenMeetingScheduler] = useState(false);
  
  const isPremium = subscription?.plan ? 
    (subscription.plan === 'professional' || subscription.plan === 'enterprise') : false;

  // Animation for the component
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation for the buttons
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Definition of quick actions
  const primaryActions = [
    {
      icon: <Policy />,
      label: 'Nueva Póliza',
      href: '/dashboard/policies?action=create',
      color: theme.palette.primary.main,
      premium: false
    },
    {
      icon: <Person />,
      label: 'Nuevo Cliente',
      href: '/dashboard/customers?action=create',
      color: theme.palette.secondary.main,
      premium: false
    },
    {
      icon: <Assignment />,
      label: 'Nueva Tarea',
      href: '/dashboard/tasks?action=create',
      color: theme.palette.warning.main,
      premium: false
    },
    {
      icon: <Event />,
      label: 'Agendar Reunión',
      action: () => setOpenMeetingScheduler(true),
      color: theme.palette.info.main,
      premium: true
    }
  ];

  const secondaryActions = [
    {
      icon: <Analytics />,
      label: 'Ver Análisis',
      href: '/dashboard/analisis',
      color: theme.palette.success.main,
      premium: true
    },
    {
      icon: <Calculate />,
      label: 'Calculadora ROI',
      action: () => setOpenROICalculator(true),
      color: theme.palette.error.main,
      premium: true
    },
    {
      icon: <ChatIcon />,
      label: 'Chat',
      href: '/dashboard/chat',
      color: theme.palette.info.dark,
      premium: true
    },
    {
      icon: <HelpIcon />,
      label: 'Ayuda',
      href: '/dashboard/soporte',
      color: theme.palette.grey[700],
      premium: false
    }
  ];

  return (
    <>
      <Paper
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 4,
          background: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.05)}`
        }}
      >
        <Stack spacing={2}>
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            sx={{ px: 1 }}
          >
            <Typography variant="subtitle1" fontWeight={600} fontFamily="Sora">
              Acciones Rápidas
            </Typography>
            <Tooltip title="Personalizar acciones" arrow>
              <IconButton 
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2)
                  }
                }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          <Divider />

          <Stack
            direction="row"
            spacing={2}
            sx={{ 
              overflowX: 'auto', 
              pb: 1,
              '&::-webkit-scrollbar': {
                height: 6,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                borderRadius: 3,
              }
            }}
          >
            {primaryActions.map((action, index) => (
              <Tooltip 
                key={index} 
                title={action.premium && !isPremium ? 'Requiere plan Premium' : ''}
                arrow
              >
                <Box>
                  <motion.div
                    variants={buttonVariants}
                    whileHover={!action.premium || isPremium ? 'hover' : undefined}
                  >
                    {action.href ? (
                      <Button
                        component={Link}
                        href={action.href}
                        variant="contained"
                        startIcon={action.icon}
                        disabled={action.premium && !isPremium}
                        sx={{
                          px: 3,
                          py: 1.5,
                          borderRadius: 3,
                          textTransform: 'none',
                          fontWeight: 600,
                          backgroundColor: alpha(action.color, 0.1),
                          color: action.color,
                          border: `1px solid ${alpha(action.color, 0.2)}`,
                          boxShadow: `0 4px 12px ${alpha(action.color, 0.1)}`,
                          '&:hover': {
                            backgroundColor: alpha(action.color, 0.2),
                            boxShadow: `0 6px 16px ${alpha(action.color, 0.2)}`
                          },
                          '&.Mui-disabled': {
                            backgroundColor: alpha(theme.palette.grey[500], 0.1),
                            color: theme.palette.grey[500],
                            border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`
                          }
                        }}
                      >
                        {action.label}
                      </Button>
                    ) : (
                      <Button
                        onClick={action.action}
                        variant="contained"
                        startIcon={action.icon}
                        disabled={action.premium && !isPremium}
                        sx={{
                          px: 3,
                          py: 1.5,
                          borderRadius: 3,
                          textTransform: 'none',
                          fontWeight: 600,
                          backgroundColor: alpha(action.color, 0.1),
                          color: action.color,
                          border: `1px solid ${alpha(action.color, 0.2)}`,
                          boxShadow: `0 4px 12px ${alpha(action.color, 0.1)}`,
                          '&:hover': {
                            backgroundColor: alpha(action.color, 0.2),
                            boxShadow: `0 6px 16px ${alpha(action.color, 0.2)}`
                          },
                          '&.Mui-disabled': {
                            backgroundColor: alpha(theme.palette.grey[500], 0.1),
                            color: theme.palette.grey[500],
                            border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`
                          }
                        }}
                      >
                        {action.label}
                      </Button>
                    )}
                  </motion.div>
                </Box>
              </Tooltip>
            ))}
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{ 
              overflowX: 'auto', 
              pb: 1,
              '&::-webkit-scrollbar': {
                height: 6,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                borderRadius: 3,
              }
            }}
          >
            {secondaryActions.map((action, index) => (
              <Tooltip 
                key={index} 
                title={action.premium && !isPremium ? 'Requiere plan Premium' : ''}
                arrow
              >
                <Box>
                  <motion.div
                    variants={buttonVariants}
                    whileHover={!action.premium || isPremium ? 'hover' : undefined}
                  >
                    {action.href ? (
                      <Button
                        component={Link}
                        href={action.href}
                        variant="outlined"
                        startIcon={action.icon}
                        disabled={action.premium && !isPremium}
                        sx={{
                          px: 3,
                          py: 1.5,
                          borderRadius: 3,
                          textTransform: 'none',
                          fontWeight: 600,
                          color: action.color,
                          borderColor: alpha(action.color, 0.3),
                          '&:hover': {
                            backgroundColor: alpha(action.color, 0.05),
                            borderColor: action.color
                          },
                          '&.Mui-disabled': {
                            borderColor: alpha(theme.palette.grey[500], 0.2),
                            color: theme.palette.grey[500]
                          }
                        }}
                      >
                        {action.label}
                      </Button>
                    ) : (
                      <Button
                        onClick={action.action}
                        variant="outlined"
                        startIcon={action.icon}
                        disabled={action.premium && !isPremium}
                        sx={{
                          px: 3,
                          py: 1.5,
                          borderRadius: 3,
                          textTransform: 'none',
                          fontWeight: 600,
                          color: action.color,
                          borderColor: alpha(action.color, 0.3),
                          '&:hover': {
                            backgroundColor: alpha(action.color, 0.05),
                            borderColor: action.color
                          },
                          '&.Mui-disabled': {
                            borderColor: alpha(theme.palette.grey[500], 0.2),
                            color: theme.palette.grey[500]
                          }
                        }}
                      >
                        {action.label}
                      </Button>
                    )}
                  </motion.div>
                </Box>
              </Tooltip>
            ))}
          </Stack>
        </Stack>
      </Paper>

      {/* ROI Calculator Dialog */}
      <ROICalculator 
        open={openROICalculator} 
        onClose={() => setOpenROICalculator(false)} 
      />

      {/* Meeting Scheduler Dialog */}
      <Dialog
        open={openMeetingScheduler}
        onClose={() => setOpenMeetingScheduler(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Event color="primary" />
              <Box component="span" fontFamily="Sora" fontWeight={600}>
                Agendar Reunión
              </Box>
            </Stack>
            <IconButton onClick={() => setOpenMeetingScheduler(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <iframe 
              src="https://calendly.com/assuriva/30min" 
              width="100%" 
              height="100%" 
              frameBorder="0"
              title="Calendly"
              style={{ borderRadius: 8 }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickActions;