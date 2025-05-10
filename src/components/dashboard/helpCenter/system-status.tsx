import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Chip,
    useTheme,
    Avatar,
    Divider
  } from '@mui/material';
  import { motion } from 'framer-motion';
  import { 
    SettingsSystemDaydream, 
    CheckCircle, 
    Warning, 
    Error, 
    Build
  } from '@mui/icons-material';
  import { format } from 'date-fns';
  import { es } from 'date-fns/locale';
  
  // Datos de estado del sistema para demostración
  const systemStatusData = [
    {
      id: '1',
      name: 'Autenticación',
      status: 'operational',
      message: 'Funcionando correctamente',
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Base de datos',
      status: 'operational',
      message: 'Funcionando correctamente',
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'API',
      status: 'operational',
      message: 'Funcionando correctamente',
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Sistema de pagos',
      status: 'degraded',
      message: 'Rendimiento reducido',
      updatedAt: new Date()
    },
    {
      id: '5',
      name: 'Almacenamiento',
      status: 'operational',
      message: 'Funcionando correctamente',
      updatedAt: new Date()
    }
  ];
  
  export default function SystemStatus() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'operational':
          return <CheckCircle fontSize="small" sx={{ color: theme.palette.success.main }} />;
        case 'degraded':
          return <Warning fontSize="small" sx={{ color: theme.palette.warning.main }} />;
        case 'outage':
          return <Error fontSize="small" sx={{ color: theme.palette.error.main }} />;
        case 'maintenance':
          return <Build fontSize="small" sx={{ color: theme.palette.info.main }} />;
        default:
          return <CheckCircle fontSize="small" sx={{ color: theme.palette.success.main }} />;
      }
    };
    
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'operational':
          return theme.palette.success.main;
        case 'degraded':
          return theme.palette.warning.main;
        case 'outage':
          return theme.palette.error.main;
        case 'maintenance':
          return theme.palette.info.main;
        default:
          return theme.palette.success.main;
      }
    };
    
    const getStatusText = (status: string) => {
      switch (status) {
        case 'operational':
          return 'Operativo';
        case 'degraded':
          return 'Degradado';
        case 'outage':
          return 'Caído';
        case 'maintenance':
          return 'Mantenimiento';
        default:
          return 'Operativo';
      }
    };
    
    // Calcular el estado general del sistema
    const calculateOverallStatus = () => {
      if (systemStatusData.some(item => item.status === 'outage')) {
        return 'outage';
      } else if (systemStatusData.some(item => item.status === 'degraded')) {
        return 'degraded';
      } else if (systemStatusData.some(item => item.status === 'maintenance')) {
        return 'maintenance';
      } else {
        return 'operational';
      }
    };
    
    const overallStatus = calculateOverallStatus();
    
    return (
      <Box sx={{ mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
              background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box 
              sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center',
                borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
              }}
            >
              <Avatar
                sx={{ 
                  bgcolor: getStatusColor(overallStatus) + '20', 
                  color: getStatusColor(overallStatus),
                  mr: 2
                }}
              >
                <SettingsSystemDaydream />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 600,
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  Estado del sistema
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Última actualización: {format(new Date(), "d 'de' MMMM, HH:mm", { locale: es })}
                </Typography>
              </Box>
              <Chip
                icon={getStatusIcon(overallStatus)}
                label={getStatusText(overallStatus)}
                size="small"
                sx={{ 
                  bgcolor: getStatusColor(overallStatus) + '20',
                  color: getStatusColor(overallStatus),
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
            
            <CardContent sx={{ p: 0 }}>
              <List disablePadding>
                {systemStatusData.map((item, index) => (
                  <Box key={item.id}>
                    <ListItem sx={{ px: 2, py: 1.5 }}>
                      <ListItemText
                        primary={
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            {item.message}
                          </Typography>
                        }
                      />
                      <Chip
                        icon={getStatusIcon(item.status)}
                        label={getStatusText(item.status)}
                        size="small"
                        sx={{ 
                          bgcolor: getStatusColor(item.status) + '10',
                          color: getStatusColor(item.status),
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      />
                    </ListItem>
                    {index < systemStatusData.length - 1 && (
                      <Divider sx={{ mx: 2 }} />
                    )}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    );
  }