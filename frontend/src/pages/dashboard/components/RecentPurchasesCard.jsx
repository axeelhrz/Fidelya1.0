import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  useTheme,
  alpha,
  Skeleton
} from '@mui/material';
import { motion } from 'framer-motion';
import { ShoppingCart, LocalShipping } from '@mui/icons-material';

const RecentPurchasesCard = ({ data, loading }) => {
  const theme = useTheme();


  const cardVariants = {
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
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
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
                  display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.secondary.main, 0.1)} 0%, 
            ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
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
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
            zIndex: 0,
                }}
        />

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
                Compras Recientes
              </Typography>
              
              {loading ? (
                <Skeleton variant="text" width={80} height={40} />
              ) : (
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                    fontSize: { xs: '1.75rem', sm: '2rem' }
                  }}
                >
                  {data?.length || 0}
                </Typography>
              )}
            </Box>

            <motion.div variants={iconVariants}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 20px ${alpha(theme.palette.secondary.main, 0.3)}`,
                  flexShrink: 0
                }}
              >
                <LocalShipping sx={{ fontSize: 24, color: 'white' }} />
              </Box>
    </motion.div>
          </Box>
          
          {/* Sección inferior: Estado */}
          {!loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                }}
              >
                <ShoppingCart sx={{ fontSize: 14, color: theme.palette.info.main }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: theme.palette.info.main,
                    fontWeight: 600
                  }}
                >
                  Esta semana
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem'
                }}
              >
                pedidos realizados
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentPurchasesCard;