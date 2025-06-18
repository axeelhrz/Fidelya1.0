import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress, 
  useTheme,
  alpha,
  Skeleton,
  Badge,
  Button
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  WarningAmber, 
  CheckCircle, 
  NotificationsActive,
  Update,
  Refresh
} from '@mui/icons-material';

const LowStockAlertCard = ({ data, loading, updateTrigger }) => {
  const theme = useTheme();
  const [previousCount, setPreviousCount] = useState(null);
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // Detectar cambios en el número de productos con stock bajo
  useEffect(() => {
    const currentCount = Array.isArray(data) ? data.length : 0;
    if (previousCount !== null && currentCount !== previousCount) {
      setShowUpdateIndicator(true);
      const timer = setTimeout(() => {
        setShowUpdateIndicator(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
    setPreviousCount(currentCount);
  }, [data, previousCount]);

  // Función para crear productos de prueba con stock bajo
  const handleCreateTestProducts = async () => {
    setLocalLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/test/crear-productos-stock-bajo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Forzar actualización del dashboard
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creando productos de prueba:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const cardVariants = {
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    updated: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    updated: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const numberVariants = {
    updated: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  // Asegurar que data sea un array y calcular correctamente
  const stockBajoArray = Array.isArray(data) ? data : [];
  const hasLowStock = stockBajoArray.length > 0;
  const stockBajoCount = stockBajoArray.length;

  console.log('LowStockAlertCard - Data recibida:', data);
  console.log('LowStockAlertCard - Array procesado:', stockBajoArray);
  console.log('LowStockAlertCard - Cantidad:', stockBajoCount);

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      animate={showUpdateIndicator ? "updated" : ""}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: hasLowStock 
            ? `linear-gradient(135deg, 
                ${alpha(theme.palette.error.main, 0.1)} 0%, 
                ${alpha(theme.palette.warning.main, 0.05)} 100%)`
            : `linear-gradient(135deg, 
                ${alpha(theme.palette.success.main, 0.1)} 0%, 
                ${alpha(theme.palette.success.light, 0.05)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(hasLowStock ? theme.palette.error.main : theme.palette.success.main, 0.2)}`,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        {/* Elemento decorativo de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(hasLowStock ? theme.palette.error.main : theme.palette.success.main, 0.1)} 0%, transparent 70%)`,
            zIndex: 0,
          }}
        />

        {/* Indicador de actualización */}
        <AnimatePresence>
          {showUpdateIndicator && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: theme.palette.info.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 2px 8px ${alpha(theme.palette.info.main, 0.4)}`,
                }}
              >
                <Update sx={{ fontSize: 14, color: 'white' }} />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <CardContent 
          sx={{ 
            p: 3, 
            position: 'relative', 
            zIndex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Sección superior: Título e ícono */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.75rem',
                  mb: 1
                }}
              >
                Stock Bajo
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={60} height={40} />
              ) : (
                <motion.div
                  variants={numberVariants}
                  animate={showUpdateIndicator ? "updated" : ""}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700,
                      color: hasLowStock ? theme.palette.error.main : theme.palette.success.main,
                      lineHeight: 1.2,
                      fontSize: { xs: '1.75rem', sm: '2rem' }
                    }}
                  >
                    {stockBajoCount}
                  </Typography>
                </motion.div>
              )}
            </Box>

            <motion.div 
              variants={iconVariants}
              animate={showUpdateIndicator ? "updated" : ""}
            >
              <Badge
                badgeContent={hasLowStock ? stockBajoCount : 0}
                color="error"
                invisible={!hasLowStock}
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: hasLowStock 
                      ? `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.light})`
                      : `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 20px ${alpha(hasLowStock ? theme.palette.error.main : theme.palette.success.main, 0.3)}`,
                    flexShrink: 0
                  }}
                >
                  {hasLowStock ? (
                    <WarningAmber sx={{ fontSize: 24, color: 'white' }} />
                  ) : (
                    <CheckCircle sx={{ fontSize: 24, color: 'white' }} />
                  )}
                </Box>
              </Badge>
            </motion.div>
          </Box>
          
          {/* Sección inferior: Estado */}
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 'auto' }}>
              <Skeleton variant="rectangular" height={20} />
              <Skeleton variant="rectangular" height={20} width="80%" />
            </Box>
          ) : (
            <AnimatePresence mode="wait">
              {hasLowStock ? (
                <motion.div
                  key="low-stock"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginTop: 'auto' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                      }}
                    >
                      <NotificationsActive sx={{ fontSize: 14, color: theme.palette.error.main }} />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: theme.palette.error.main,
                          fontWeight: 600
                        }}
                      >
                        Requiere atención
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontSize: '0.75rem'
                    }}
                  >
                    {stockBajoCount} producto{stockBajoCount > 1 ? 's' : ''} con stock insuficiente
                  </Typography>
                </motion.div>
              ) : (
                <motion.div
                  key="good-stock"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginTop: 'auto' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 14, color: theme.palette.success.main }} />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: theme.palette.success.main,
                          fontWeight: 600
                        }}
                      >
                        Todo en orden
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontSize: '0.75rem',
                      mb: 1
                    }}
                  >
                    Todos los productos tienen stock suficiente
                  </Typography>

                  {/* Botón para crear productos de prueba */}
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    startIcon={localLoading ? <CircularProgress size={14} /> : <Refresh />}
                    onClick={handleCreateTestProducts}
                    disabled={localLoading}
                    sx={{
                      fontSize: '0.7rem',
                      textTransform: 'none',
                      borderRadius: 1,
                      mt: 0.5
                    }}
                  >
                    {localLoading ? 'Creando...' : 'Simular Stock Bajo'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LowStockAlertCard;