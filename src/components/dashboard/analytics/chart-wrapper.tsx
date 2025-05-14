import React from 'react';
import { Paper, Typography, Box, useTheme, alpha, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { createPremiumCardStyle } from '@/styles/theme/themeAnalytics';

interface ChartWrapperProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  height?: number | string;
  color?: string;
  isMobile?: boolean;
}

const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const mobileChartVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export const ChartWrapper: React.FC<ChartWrapperProps> = ({ 
  title, 
  children, 
  loading = false,
  height = 350,
  color,
  isMobile = false
}) => {
  const theme = useTheme();
  const defaultColor = color || theme.palette.primary.main;

  return (
    <Paper
      component={motion.div}
      variants={isMobile ? mobileChartVariants : chartVariants}
      initial="hidden"
      animate="visible"
      elevation={0}
      sx={{
        p: isMobile ? 1.5 : 3,
        ...createPremiumCardStyle(theme, defaultColor, isMobile),
        height: '100%',
        minHeight: isMobile ? (typeof height === 'number' ? height * 0.8 : height) : height,
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
          color: theme.palette.text.primary,
          fontSize: isMobile ? '0.9rem' : undefined,
          mb: isMobile ? 1 : 2
        }}
      >
        {title}
      </Typography>
      <Box sx={{ 
        flexGrow: 1, 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        // Reducir padding en móvil para aprovechar espacio
        px: isMobile ? 0 : 1
      }}>
        {loading ? (
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height="100%" 
            sx={{ 
              minHeight: isMobile ? 150 : 250, 
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