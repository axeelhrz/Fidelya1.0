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
  Fade
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Inventory, Update } from '@mui/icons-material';

const InventorySummaryCard = ({ data, loading, updateTrigger }) => {
  const theme = useTheme();
  const [previousTotal, setPreviousTotal] = useState(null);
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);

  // Detectar cambios en el total de productos
  useEffect(() => {
    if (data?.totalProductos !== undefined && previousTotal !== null) {
      if (data.totalProductos !== previousTotal) {
        setShowUpdateIndicator(true);
        const timer = setTimeout(() => {
          setShowUpdateIndicator(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
    if (data?.totalProductos !== undefined) {
      setPreviousTotal(data.totalProductos);
    }
  }, [data?.totalProductos, previousTotal]);

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
      rotate: [0, 360],
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const numberVariants = {
    updated: {
      scale: [1, 1.1, 1],
      color: [
        theme.palette.text.primary,
        theme.palette.primary.main,
        theme.palette.text.primary
      ],
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      animate={showUpdateIndicator ? "updated" : ""}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.warning.main, 0.1)} 0%, 
            ${alpha(theme.palette.warning.light, 0.05)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
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
            background: `radial-gradient(circle, ${alpha(theme.palette.warning.main, 0.1)} 0%, transparent 70%)`,
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
                  bgcolor: theme.palette.success.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.4)}`,
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
                Total Productos
              </Typography>
              
              {loading ? (
                <Skeleton variant="text" width={80} height={40} />
              ) : (
                <motion.div
                  variants={numberVariants}
                  animate={showUpdateIndicator ? "updated" : ""}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      lineHeight: 1.2,
                      fontSize: { xs: '1.75rem', sm: '2rem' }
                    }}
                  >
                    {data?.totalProductos || 0}
                  </Typography>
                </motion.div>
              )}
            </Box>

            <motion.div 
              variants={iconVariants}
              animate={showUpdateIndicator ? "updated" : ""}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 20px ${alpha(theme.palette.warning.main, 0.3)}`,
                  flexShrink: 0
                }}
              >
                <Inventory sx={{ fontSize: 24, color: 'white' }} />
              </Box>
            </motion.div>
          </Box>
          
          {/* Sección inferior: Estado */}
          {!loading && (
            <Fade in={!loading} timeout={500}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
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
                  <TrendingUp sx={{ fontSize: 14, color: theme.palette.success.main }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: theme.palette.success.main,
                      fontWeight: 600
                    }}
                  >
                    Activos
                  </Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem'
                  }}
                >
                  en inventario
                </Typography>
              </Box>
            </Fade>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InventorySummaryCard;