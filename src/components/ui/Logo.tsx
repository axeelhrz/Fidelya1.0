'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';

interface LogoProps {
  variant?: 'default' | 'white';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const Logo = ({ variant = 'default', size = 'md', animated = true }: LogoProps) => {
  const sizes = {
    sm: { fontSize: '1.25rem', badgeSize: '0.625rem', badgePadding: '0.125rem 0.375rem' },
    md: { fontSize: '1.5rem', badgeSize: '0.75rem', badgePadding: '0.25rem 0.5rem' },
    lg: { fontSize: '2rem', badgeSize: '0.875rem', badgePadding: '0.25rem 0.625rem' },
  };

  const { fontSize, badgeSize } = sizes[size];

  const logoContent = (
    <Box className="relative flex items-center">
      <Typography 
        component="span" 
        className="font-sora font-bold"
        sx={{ fontSize }}
      >
        Reel
        <Box 
          component="span" 
          sx={{ 
            color: variant === 'white' ? 'white' : 'primary.main',
            transition: 'color 0.3s ease'
          }}
        >
          Genius
        </Box>
      </Typography>
      <Box
        component="span"
        sx={{
          ml: 0.5,
          fontSize: badgeSize,
          bgcolor: 'secondary.main',
          color: 'white',
          px: 0.75,
          py: 0.25,
          borderRadius: '4px',
          fontWeight: 600,
          letterSpacing: '0.02em',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(255, 51, 102, 0.3)',
        }}
      >
        BETA
      </Box>
    </Box>
  );

  if (animated) {
    return (
      <Link href="/" className="flex items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          {logoContent}
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href="/" className="flex items-center">
      {logoContent}
    </Link>
  );
};

export default Logo;