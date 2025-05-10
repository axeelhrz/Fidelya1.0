import React from 'react';
import { Stack, Typography, Box, Alert, AlertTitle, useTheme, Chip, IconButton } from '@mui/material';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSeverityColor } from '@/lib/formatters';

interface AlertData {
  id: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  text: string;
  timestamp: string;
  read: boolean;
}

interface RealTimeAlertsProps {
  alerts: AlertData[];
  onDismiss?: (alertId: string) => void;
}

export const RealTimeAlerts: React.FC<RealTimeAlertsProps> = ({ alerts, onDismiss }) => {
  const theme = useTheme();
  
  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  if (!alerts || alerts.length === 0) {
    return (
      <Alert 
        severity="success" 
        icon={<CheckCircle size={20} />} 
        sx={{ 
          borderRadius: '16px',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <AlertTitle sx={{ fontFamily: 'Sora, sans-serif', fontWeight: 600 }}>
          Sin alertas
        </AlertTitle>
        No hay alertas importantes en este momento.
      </Alert>
    );
  }
  
  // Ordenar por severidad y si han sido leídas
  const sortedAlerts = [...alerts].sort((a, b) => {
    // Primero las no leídas
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }
    
    // Luego por severidad
    const severityOrder = { error: 0, warning: 1, info: 2, success: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
  
  // Icono según severidad
  const getIcon = (severity: 'error' | 'warning' | 'info' | 'success') => {
    switch (severity) {
      case 'error':
        return <AlertTriangle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      case 'success':
        return <CheckCircle size={20} />;
    }
  };

  return (
    <Stack 
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      spacing={2}
    >
      {sortedAlerts.map((alert) => (
        <Alert
          key={alert.id}
          component={motion.div}
          severity={alert.severity}
          // Apply motion variants
          {...{ variants: itemVariants }}
          icon={getIcon(alert.severity)}
          sx={{ 
            borderRadius: '16px',
            fontFamily: 'Inter, sans-serif',
            position: 'relative',
            opacity: alert.read ? 0.7 : 1,
            border: alert.read ? 'none' : `1px solid ${getSeverityColor(alert.severity, theme)}`
          }}
          action={
            onDismiss && (
              <IconButton
                aria-label="dismiss"
                color="inherit"
                size="small"
                onClick={() => onDismiss(alert.id)}
              >
                <X size={16} />
              </IconButton>
            )
          }
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <AlertTitle sx={{ fontFamily: 'Sora, sans-serif', fontWeight: 600 }}>
              {alert.severity === 'error' ? 'Alerta Crítica' : 
               alert.severity === 'warning' ? 'Advertencia' : 
               alert.severity === 'info' ? 'Información' : 'Notificación'}
            </AlertTitle>
            {!alert.read && (
              <Chip
                label="Nueva"
                size="small"
                color={alert.severity}
                sx={{
                  height: '20px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  ml: 1
                }}
              />
            )}
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: 'Inter, sans-serif',
              mt: 0.5
            }}
          >
            {alert.text}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              mt: 1,
              color: theme.palette.text.secondary,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {alert.timestamp}
          </Typography>
        </Alert>
      ))}
    </Stack>
  );
};