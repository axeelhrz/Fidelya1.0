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
  const defaultColor = color || theme.palette.primary.main;

  return (
    <Paper
      component={motion.div}
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      elevation={0}
      sx={{
        p: 3,
        ...createPremiumCardStyle(theme, defaultColor),
        height: '100%',
        minHeight: height,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography 
        variant="h6" 
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
              minHeight: 250, 
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