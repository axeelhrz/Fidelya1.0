import React from 'react';
import { Paper, Typography, Box, useTheme, alpha, Skeleton, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { createPremiumCardStyle } from '@/styles/theme/themeAnalytics';

interface ChartWrapperProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  height?: number | string;
  color?: string;
}

const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const ChartWrapper: React.FC<ChartWrapperProps> = ({ 
  title, 
  children, 
  loading = false,
  height = 350,
  color
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultColor = color || theme.palette.primary.main;

  // Ajustar altura para móviles
  const mobileHeight = typeof height === 'number' ? Math.min(height, 250) : height;
  const responsiveHeight = isMobile ? mobileHeight : height;

  // Reducir animaciones en móvil para mejorar rendimiento
  const mobileVariants = isMobile ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  } : chartVariants;

  return (
    <Paper
      component={motion.div}
      variants={mobileVariants}
      initial="hidden"
      animate="visible"
      elevation={0}
      sx={{
        p: isMobile ? 2 : 3,
        ...createPremiumCardStyle(theme, defaultColor, isMobile),
        height: '100%',
        minHeight: responsiveHeight,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography 
        variant={isMobile ? "subtitle1" : "h6"} 
        component="h3" 
        gutterBottom 
        sx={{ 
          fontFamily: 'Sora, sans-serif', 
          fontWeight: 600,
          color: theme.palette.text.primary
        }}
      >
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height="100%" 
            sx={{ 
              minHeight: isMobile ? 180 : 250, 
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.primary.main, 0.1)
            }} 
          />
        ) : (
          children
        )}
      </Box>
    </Paper>
  );
};